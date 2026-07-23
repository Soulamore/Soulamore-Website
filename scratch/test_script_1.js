
        // --- PARTICLES (STARS & NEURAL THREADS) ---
        const particleContainer = document.getElementById('particles');
        for (let i = 0; i < 50; i++) {
            let p = document.createElement('div');
            p.classList.add('particle');
            p.style.left = Math.random() * 100 + 'vw';

            // Random sizes for stars
            let size = Math.random() * 3 + 1;
            p.style.width = size + 'px';
            p.style.height = size + 'px';

            p.style.animationDuration = Math.random() * 40 + 20 + 's, ' + (Math.random() * 3 + 2) + 's';
            p.style.animationDelay = (Math.random() * -40) + 's, 0s';
            particleContainer.appendChild(p);
        }

        // --- FLOATING WORDS LOGIC ---
        const words = [
            "Cognitive", "Emotional", "Somatic", "Regulation",
            "Intensity", "Resilience", "Baseline", "Clarity",
            "Self-Concept", "Attachment", "Pattern", "Reflection"
        ];
        const atmosphere = document.getElementById('word-atmosphere');

        function createWord() {
            const el = document.createElement('div');
            el.classList.add('floating-word');
            el.innerText = words[Math.floor(Math.random() * words.length)];

            el.style.left = Math.random() * 90 + 'vw';
            el.style.animationDuration = (Math.random() * 20 + 20) + 's';
            el.style.fontSize = (Math.random() * 1.2 + 0.8) + 'rem';
            el.style.opacity = Math.random() * 0.4 + 0.1;

            atmosphere.appendChild(el);
            setTimeout(() => { el.remove(); }, 40000);
        }

        for (let i = 0; i < 6; i++) setTimeout(createWord, i * 3000);
        setInterval(createWord, 6000);

        // --- DYNAMIC GRID & FILTERING LOGIC ---
        let ALL_TESTS = []; // Initialized via fetch
        const gridEl = document.getElementById('assessments-grid');
        
        window.addEventListener('load', async () => {
            try {
                // Tier 4 Optimization: Lazy-load Directory & Citations
                const [dirRes, citRes] = await Promise.all([
                    fetch('../../assets/data/assessments-directory.json'),
                    fetch('../../assets/data/citations.json')
                ]);
                
                if (!dirRes.ok || !citRes.ok) throw new Error("Failed to load assessments database.");
                
                window.SoulamoreAssessments = await dirRes.json();
                window.SoulamoreCitations = await citRes.json();
                
                ALL_TESTS = Object.values(window.SoulamoreAssessments);
                console.log('[Soulamore] Loaded Directory:', ALL_TESTS.length);
                
                // Continue with existing initialization
                initializeEngine();
                
            } catch (error) {
                console.error('[Soulamore] Assessment data failed to initialize:', error);
                if (gridEl) gridEl.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-secondary);"><i class="fas fa-circle-exclamation" style="font-size:2rem;margin-bottom:15px;display:block;color:var(--peach-glow)"></i><p>Assessment data failed to load. Please refresh the page.</p></div>';
            }

            let filteredTests = [];
            let currentPage = 0;
            const BATCH_SIZE = 6;
            let activeDomains = new Set();   // empty = All
            let activeContexts = new Set();
            
            const primaryFilterBar = document.getElementById('primary-filters');
            const contextFilterBar = document.getElementById('context-filters');
            const pagers = document.querySelectorAll('.pager-container');
            const sideNav = document.querySelector('.side-nav');
            const allPrevBtns = document.querySelectorAll('.prev-btn');
            const allNextBtns = document.querySelectorAll('.next-btn');

            // --- MUST BE DECLARED BEFORE initializeEngine() ---
            const DOMAINS = [
                "Anxiety Spectrum",
                "Mood & Depression",
                "Trauma & Nervous System",
                "Relationship & Intimacy",
                "Burnout & Functional Exhaustion",
                "Career & Performance",
                "Academic Stress",
                "Grief & Loss",
                "Loneliness & Connection",
                "Expats & Migration",
                "Adolescents & Youth"
            ];

            const CONTEXTS = [
                "Workplace", "Academic", "Digital", "Somatic", "Identity",
                "Family", "Romantic", "Social", "Trauma", "Loneliness",
                "Performance", "Creative", "Leadership", "Youth", "Migration",
                "Grief", "Students", "Expat"
            ];

            function initializeEngine() {
                ALL_TESTS = getDiscoveryOrder([...ALL_TESTS]);
                filteredTests = [...ALL_TESTS];
                setupFilters();
                renderGrid(0);
                injectIndexSchema();
            }


            // Helper to render assessments
            window.renderAssessments = function (filter) {
                activeDomains.clear();
                if (filter && filter !== 'all') activeDomains.add(filter);
                applyFilters();
            };


            // Sticky Randomization (Persistent discovery order)
            function getDiscoveryOrder(array) {
                const STORAGE_KEY = 'SoulamoreDiscoveryOrder';
                let idOrder = [];
                try {
                    const stored = localStorage.getItem(STORAGE_KEY);
                    if (stored) idOrder = JSON.parse(stored);
                } catch (e) { }

                const mapped = new Map(array.map(test => [test.id, test]));
                let finalIds = idOrder.filter(id => mapped.has(id));
                const currentIds = array.map(t => t.id);
                const newIds = currentIds.filter(id => !idOrder.includes(id));

                if (newIds.length > 0) {
                    const shuffledNew = [...newIds];
                    for (let i = shuffledNew.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [shuffledNew[i], shuffledNew[j]] = [shuffledNew[j], shuffledNew[i]];
                    }
                    finalIds = [...finalIds, ...shuffledNew];
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalIds));
                }
                return finalIds.map(id => mapped.get(id));
            }

            function setupFilters() {
                const DOMAIN_LABELS = {
                    "Anxiety Spectrum": "Anxiety",
                    "Mood & Depression": "Depression",
                    "Trauma & Nervous System": "Trauma",
                    "Relationship & Intimacy": "Relationships",
                    "Burnout & Functional Exhaustion": "Burnout",
                    "Career & Performance": "Career",
                    "Academic Stress": "Academic",
                    "Grief & Loss": "Grief",
                    "Loneliness & Connection": "Loneliness",
                    "Expats & Migration": "Expats",
                    "Adolescents & Youth": "Youth",
                };

                const domainPanel = document.getElementById('domain-dropdown-panel');
                const domainBtn = document.getElementById('domain-dropdown-btn');
                const domainLabel = document.getElementById('domain-btn-label');

                const situPanel = document.getElementById('situation-dropdown-panel');
                const situBtn = document.getElementById('situation-dropdown-btn');
                const situLabel = document.getElementById('situation-btn-label');

                // ---- Build domain checkboxes ----
                domainPanel.innerHTML = `<div class="dropdown-clear-row"><button class="dropdown-clear-btn" id="domain-clear-btn">Clear all</button></div>`;
                DOMAINS.forEach(dom => {
                    const label = document.createElement('label');
                    label.className = 'filter-checkbox-item';
                    label.innerHTML = `<input type="checkbox" value="${dom}"> ${DOMAIN_LABELS[dom] || dom}`;
                    domainPanel.appendChild(label);
                });

                // ---- Build situation checkboxes ----
                situPanel.innerHTML = `<div class="dropdown-clear-row"><button class="dropdown-clear-btn" id="situ-clear-btn">Clear all</button></div>`;
                CONTEXTS.forEach(ctx => {
                    const label = document.createElement('label');
                    label.className = 'filter-checkbox-item';
                    label.innerHTML = `<input type="checkbox" value="${ctx}"> ${ctx}`;
                    situPanel.appendChild(label);
                });

                // ---- Toggle panels open/close ----
                function closeAll() {
                    domainPanel.classList.remove('open'); domainBtn.classList.remove('open'); domainBtn.setAttribute('aria-expanded', 'false');
                    situPanel.classList.remove('open'); situBtn.classList.remove('open'); situBtn.setAttribute('aria-expanded', 'false');
                }

                function togglePanel(btn, panel) {
                    const isOpen = panel.classList.contains('open');
                    closeAll();
                    if (!isOpen) {
                        panel.classList.add('open');
                        btn.classList.add('open');
                        btn.setAttribute('aria-expanded', 'true');
                    } else {
                        btn.setAttribute('aria-expanded', 'false');
                    }
                }

                domainBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    togglePanel(domainBtn, domainPanel);
                });
                situBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    togglePanel(situBtn, situPanel);
                });



                // Close on outside click
                document.addEventListener('click', (e) => { if (!e.target.closest('.filter-dropdown-wrap')) { closeAll(); } });

                // ---- Domain checkbox change ----
                function updateDomainLabel() {
                    if (activeDomains.size === 0) { domainLabel.textContent = 'Domain: All'; domainBtn.classList.remove('has-selection'); }
                    else { domainLabel.textContent = `Domain: ${activeDomains.size} selected`; domainBtn.classList.add('has-selection'); }
                }
                domainPanel.addEventListener('change', (e) => {
                    if (e.target.type !== 'checkbox') return;
                    if (e.target.checked) activeDomains.add(e.target.value);
                    else activeDomains.delete(e.target.value);
                    e.target.closest('.filter-checkbox-item').classList.toggle('selected', e.target.checked);
                    updateDomainLabel();
                    applyFilters();
                });
                document.getElementById('domain-clear-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    activeDomains.clear();
                    domainPanel.querySelectorAll('input[type=checkbox]').forEach(cb => { cb.checked = false; cb.closest('.filter-checkbox-item').classList.remove('selected'); });
                    updateDomainLabel();
                    applyFilters();
                });

                // ---- Situation checkbox change ----
                function updateSituLabel() {
                    if (activeContexts.size === 0) { situLabel.textContent = 'Situation: Any'; situBtn.classList.remove('has-selection'); }
                    else { situLabel.textContent = `Situation: ${activeContexts.size} selected`; situBtn.classList.add('has-selection'); }
                }
                situPanel.addEventListener('change', (e) => {
                    if (e.target.type !== 'checkbox') return;
                    if (e.target.checked) activeContexts.add(e.target.value);
                    else activeContexts.delete(e.target.value);
                    e.target.closest('.filter-checkbox-item').classList.toggle('selected', e.target.checked);
                    updateSituLabel();
                    applyFilters();
                });
                document.getElementById('situ-clear-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    activeContexts.clear();
                    situPanel.querySelectorAll('input[type=checkbox]').forEach(cb => { cb.checked = false; cb.closest('.filter-checkbox-item').classList.remove('selected'); });
                    updateSituLabel();
                    applyFilters();
                });

                // ---- Search input ----
                document.getElementById('assessment-search').addEventListener('input', applyFilters);
            }

            function applyFilters() {
                const searchTerm = (document.getElementById('assessment-search')?.value || '').toLowerCase().trim();

                filteredTests = ALL_TESTS.filter(test => {
                    const matchDomain = (activeDomains.size === 0 || activeDomains.has(test.primary_domain));
                    const matchContext = (activeContexts.size === 0 ||
                        (test.context_tags && test.context_tags.some(t => activeContexts.has(t))));
                    const matchSearch = !searchTerm ||
                        (test.title && test.title.toLowerCase().includes(searchTerm)) ||
                        (test.description && test.description.toLowerCase().includes(searchTerm)) ||
                        (test.primary_domain && test.primary_domain.toLowerCase().includes(searchTerm));
                    return matchDomain && matchContext && matchSearch;
                });

                renderGrid(0);
            }


            function getIconForDomain(domain) {
                const icons = {
                    "Anxiety Spectrum": "fa-wind",
                    "Mood & Depression": "fa-cloud-showers-heavy",
                    "Trauma & Nervous System": "fa-bolt",
                    "Relationship & Intimacy": "fa-link",
                    "Attachment & Relationships": "fa-link",
                    "Burnout & Functional Exhaustion": "fa-battery-quarter",
                    "Career & Performance": "fa-briefcase",
                    "Career & Burnout": "fa-briefcase",
                    "Academic Stress": "fa-graduation-cap",
                    "Identity & Self-Concept": "fa-user-astronaut",
                    "Loneliness & Connection": "fa-street-view",
                    "Loneliness & Social Isolation": "fa-street-view",
                    "Grief & Loss": "fa-leaf",
                    "Adolescents & Youth": "fa-seedling",
                    "Youth & Development": "fa-seedling",
                    "Expats & Migration": "fa-globe-americas",
                    "Migration & Cultural Transition": "fa-globe-americas"
                };
                return icons[domain] || "fa-brain";
            }

            function createCardHTML(test, index) {
                const color = test.theme_color || "var(--teal-glow)";
                const icon = getIconForDomain(test.primary_domain);

                // Primary domain tag only (context tags shown via filter, not card)
                const domainBadge = test.primary_domain
                    ? `<span class="tag-badge" style="border-color: var(--teal-glow); color: var(--teal-glow)">${test.primary_domain}</span>`
                    : '';

                // Intelligence signal badge
                const domain = (test.primary_domain || '').toLowerCase();
                const SENSITIVE_DOMAINS = ['trauma', 'grief', 'mood', 'depression'];
                const QUICK_DOMAINS = ['anxiety', 'burnout', 'career', 'academic'];
                let intelBadge = '';
                if (index < 6) {
                    intelBadge = `<span class="intel-badge popular"><i class="fas fa-fire"></i> Popular</span>`;
                } else if (SENSITIVE_DOMAINS.some(k => domain.includes(k))) {
                    intelBadge = `<span class="intel-badge sensitive"><i class="fas fa-shield-alt"></i> Sensitive</span>`;
                } else if (QUICK_DOMAINS.some(k => domain.includes(k))) {
                    intelBadge = `<span class="intel-badge quick"><i class="fas fa-bolt"></i> Quick Screen</span>`;
                }

                return `
                <div class="assessment-card" style="--hover-color: ${color};" onmouseover="this.style.borderColor='${color}'; this.style.boxShadow='0 15px 40px rgba(0,0,0,0.4), inset 0 0 20px ${color}10'" onmouseout="this.style.borderColor='var(--border-glass)'; this.style.boxShadow='none'">
                    <div class="card-badge-stack">
                        ${intelBadge}
                        <div class="sci-badge" data-citation="${test.id}">
                            <i class="fas fa-microscope" style="color:${color};"></i> Clinical Backing
                        </div>
                    </div>
                    <div class="card-inner">
                        <i class="fas ${icon} card-icon" style="color:${color};"></i>
                        <h3 class="card-title">${test.title}</h3>
                        ${domainBadge ? `<div class="badge-container">${domainBadge}</div>` : ''}
                        <p class="card-desc">${test.description}</p>
                        <div class="card-meta">
                            <span><i class="far fa-clock"></i> ~5 mins</span>
                            <a href="/spaces/assessments/engine?id=${test.id}" class="card-btn">Start Assessment <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>

                    <div class="sci-overlay">
                        <div class="sci-overlay-content">
                            <!-- Populated by JS -->
                        </div>
                    </div>
                </div>
            `;
            }

            function renderGrid(page = 0) {
                currentPage = page;
                gridEl.innerHTML = '';

                if (filteredTests.length === 0) {
                    gridEl.innerHTML = `
                        <div class="empty-state" style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; background:var(--bg-subtle); border: 1px dashed var(--border-glass); border-radius: 24px;">
                            <i class="fas fa-search" style="font-size: 3rem; color: var(--teal-glow); opacity: 0.3; margin-bottom: 20px;"></i>
                            <h3 style="font-family: 'Outfit'; font-size: 1.5rem; margin-bottom: 10px;">No assessments found</h3>
                            <p style="opacity: 0.7;">Try adjusting your filters or search terms.</p>
                            <button onclick="activeContexts.clear(); document.querySelectorAll('.context-btn').forEach(b => b.classList.remove('active')); renderAssessments('all')" class="nav-btn" style="margin: 20px auto 0; display: inline-flex;">Clear All Filters</button>
                        </div>
                    `;
                    pagers.forEach(p => p.style.display = 'none');
                    updatePager(0, 0);
                    return;
                }

                const start = currentPage * BATCH_SIZE;
                const end = Math.min(start + BATCH_SIZE, filteredTests.length);
                const slice = filteredTests.slice(start, end);

                slice.forEach((test, idx) => {
                    gridEl.insertAdjacentHTML('beforeend', createCardHTML(test, start + idx));
                });

                updatePager(start, end);
                if (typeof loadClinicalCitations === 'function') loadClinicalCitations();
            }

            function updatePager(start, end) {
                const total = filteredTests.length;
                const totalPages = Math.ceil(total / BATCH_SIZE) || 1;
                const currentPageHuman = currentPage + 1;

                // Hide pagers if 0 or only 1 page
                if (total === 0 || totalPages <= 1) {
                    pagers.forEach(p => p.style.display = 'none');
                } else {
                    pagers.forEach(p => p.style.display = 'flex');
                }

                pagers.forEach(pager => {
                    const info = pager.querySelector('.pager-info');
                    const rangeSpan = info.querySelector('.item-range');
                    const counterSpan = info.querySelector('.page-counter');

                    if (total === 0) {
                        rangeSpan.innerText = "0 - 0 of 0";
                        counterSpan.innerText = "Page 0 of 0";
                    } else {
                        rangeSpan.innerText = `${start + 1} - ${end} of ${total}`;
                        counterSpan.innerText = `Page ${currentPageHuman} of ${totalPages}`;
                    }
                });

                const isFirstPage = (currentPage === 0);
                const isLastPage = (end >= total);

                allPrevBtns.forEach(btn => btn.disabled = isFirstPage);
                allNextBtns.forEach(btn => btn.disabled = isLastPage);
            }

            function handleNavigate(direction) {
                const total = filteredTests.length;
                const maxPage = Math.floor((total - 1) / BATCH_SIZE);

                if (direction === 'prev' && currentPage > 0) {
                    renderGrid(currentPage - 1);
                    window.scrollTo({ top: gridEl.offsetTop - 150, behavior: 'smooth' });
                } else if (direction === 'next' && currentPage < maxPage) {
                    renderGrid(currentPage + 1);
                    window.scrollTo({ top: gridEl.offsetTop - 150, behavior: 'smooth' });
                }
            }

            allPrevBtns.forEach(btn => btn.addEventListener('click', () => handleNavigate('prev')));
            allNextBtns.forEach(btn => btn.addEventListener('click', () => handleNavigate('next')));

            // Side Nav Visibility Observer
            const navObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        sideNav.classList.add('visible');
                    } else {
                        sideNav.classList.remove('visible');
                    }
                });
            }, { threshold: 0.05, rootMargin: "-100px 0px" });

            navObserver.observe(gridEl);

            // Keyboard Navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') handleNavigate('prev');
                if (e.key === 'ArrowRight') handleNavigate('next');
            });

            // Initialization now happens fully after the JSON payload is fetched


            async function loadClinicalCitations() {
                try {
                    if (!window.SoulamoreCitations) return;
                    const citationsData = window.SoulamoreCitations;

                    document.querySelectorAll('.assessment-card').forEach(card => {
                        if (card.dataset.boundSci) return;
                        card.dataset.boundSci = "true";

                        const badge = card.querySelector('.sci-badge');
                        const contentEl = card.querySelector('.sci-overlay-content');
                        const testId = badge.getAttribute('data-citation');
                        const data = citationsData[testId];

                        if (data) {
                            const color = card.style.getPropertyValue('--hover-color') || "var(--teal-glow)";
                            let html = `<div class="sci-popup-title" style="color:${color}"><i class="fas fa-brain"></i> Backed By Clinical Science</div>`;

                            if (data.citations && data.citations.length > 0) {
                                data.citations.forEach(c => {
                                    html += `
                                    <div class="sci-citation" style="border-left-color: ${color};">
                                        <div class="citation-name">${c.name}</div>
                                        <div class="citation-desc">${c.description}</div>
                                    </div>
                                `;
                                });
                            } else {
                                // FALLBACK CLINICAL CONTEXT
                                html += `
                                <div class="sci-citation" style="border-left-color: ${color};">
                                    <div class="citation-name">Standardized Assessment Protocol</div>
                                    <div class="citation-desc">This assessment is built upon deterministic emotional architecture frameworks and clinical screening benchmarks.</div>
                                </div>
                            `;
                            }
                            if (data.disclaimer) {
                                html += `<div class="sci-disclaimer">${data.disclaimer}</div>`;
                            } else {
                                html += `<div class="sci-disclaimer">Grounded in psychological framework benchmarks for self-reflection. Not a diagnostic tool.</div>`;
                            }
                            contentEl.innerHTML = html;
                        } else {
                            // TOTAL FALLBACK IF CITATION OBJECT MISSING (Should not happen with fallback arriba)
                            const color = card.style.getPropertyValue('--hover-color') || "var(--teal-glow)";
                            contentEl.innerHTML = `
                            <div class="sci-popup-title" style="color:${color}"><i class="fas fa-brain"></i> Clinical Foundation</div>
                            <div class="sci-citation" style="border-left-color: ${color};">
                                <div class="citation-name">Soulamore Clinical Architecture</div>
                                <div class="citation-desc">Deterministic mapping based on severity-band psychological frameworks.</div>
                            </div>
                            <div class="sci-disclaimer">Standard screening protocol for emotional intensity tracking.</div>
                        `;
                        }

                        badge.addEventListener('mouseenter', () => {
                            card.classList.add('sci-hover');
                        });

                        badge.addEventListener('mouseleave', () => {
                            card.classList.remove('sci-hover');
                        });
                    });
                } catch (e) { console.error("Could not load clinical citations", e); }
            }

            // Inject ItemList Schema for SEO
            function injectIndexSchema() {
                const checkData = window.SoulamoreAssessments || {};
                if (Object.keys(checkData).length === 0) return;

                const script = document.createElement('script');
                script.type = 'application/ld+json';
                const schema = {
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "name": "Soulamore Personal Emotional Assessments",
                    "description": "A comprehensive directory of clinical-grade emotional assessments for anxiety, burnout, relationships, and more.",
                    "itemListElement": Object.keys(checkData).map((id, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "url": `https://soulamore.com/spaces/assessments/landing.html?id=${id}`,
                        "name": checkData[id] ? checkData[id].title : "Assessment"
                    }))
                };
                script.text = JSON.stringify(schema);
                document.head.appendChild(script);
            }
        });

    