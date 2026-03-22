function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderTagList(tags, extraClass = '') {
  return (tags || []).map((tag) => `<span class="tag ${extraClass}">${escapeHtml(tag)}</span>`).join('');
}

function renderPsychologistSection(section) {
  if (section.type === 'rich-text') {
    return `
      <section class="glass-panel profile-section" data-section-id="${escapeHtml(section.id)}" data-tab-id="${escapeHtml(section.tab)}">
        <div class="panel-title"><i class="${escapeHtml(section.icon)}"></i> ${escapeHtml(section.title)}</div>
        ${section.paragraphs.map((paragraph) => `<p class="bio-text">${escapeHtml(paragraph)}</p>`).join('')}
      </section>
    `;
  }

  if (section.type === 'style-session') {
    return `
      <section class="glass-panel profile-section" data-section-id="${escapeHtml(section.id)}" data-tab-id="${escapeHtml(section.tab)}">
        <div class="panel-title"><i class="${escapeHtml(section.icon)}"></i> ${escapeHtml(section.title)}</div>
        <p class="section-intro">${escapeHtml(section.intro || '')}</p>
        <div class="tag-cloud" style="margin-bottom:30px;">${renderTagList(section.tags, 'style-tag')}</div>
        <div class="panel-title panel-subtitle"><i class="fas fa-door-open"></i> ${escapeHtml(section.noteTitle || 'First Session')}</div>
        <p class="session-note">${escapeHtml(section.note || '')}</p>
      </section>
    `;
  }

  if (section.type === 'focus-list') {
    return `
      <section class="glass-panel profile-section" data-section-id="${escapeHtml(section.id)}" data-tab-id="${escapeHtml(section.tab)}">
        <div class="panel-title"><i class="${escapeHtml(section.icon)}"></i> ${escapeHtml(section.title)}</div>
        ${(section.items || []).map((item) => `
          <div class="credential-item">
            <div class="cred-icon"><i class="${escapeHtml(item.icon)}"></i></div>
            <div class="cred-details">
              <h4>${escapeHtml(item.title)}</h4>
              <span>${escapeHtml(item.subtitle)}</span>
            </div>
          </div>
        `).join('')}
      </section>
    `;
  }

  if (section.type === 'quotes') {
    return `
      <section class="glass-panel profile-section" data-section-id="${escapeHtml(section.id)}" data-tab-id="${escapeHtml(section.tab)}">
        <div class="panel-title"><i class="${escapeHtml(section.icon)}"></i> ${escapeHtml(section.title)}</div>
        ${(section.items || []).map((item) => `
          <div class="testi-box">
            <i class="fas fa-quote-left quote-icon"></i>
            <p class="quote-text">${escapeHtml(item.quote)}</p>
            <div class="quote-author">- ${escapeHtml(item.author)}</div>
          </div>
        `).join('')}
      </section>
    `;
  }

  if (section.type === 'info-list') {
    return `
      <section class="glass-panel profile-section" data-section-id="${escapeHtml(section.id)}" data-tab-id="${escapeHtml(section.tab)}">
        <div class="panel-title"><i class="${escapeHtml(section.icon)}"></i> ${escapeHtml(section.title)}</div>
        <ul class="info-list">
          ${(section.items || []).map((item) => {
            let valueHtml = '';
            if (item.kind === 'tags') {
              valueHtml = `<div class="tag-cloud">${renderTagList(item.value)}</div>`;
            } else if (item.kind === 'status') {
              const accentClass = item.accent === 'success' ? 'status-success' : '';
              valueHtml = `<span class="info-val ${accentClass}">${escapeHtml(item.value)}</span>`;
            } else {
              valueHtml = `<span class="info-val">${escapeHtml(item.value)}</span>`;
            }
            return `
              <li>
                <span class="info-label">${escapeHtml(item.label)}</span>
                ${valueHtml}
              </li>
            `;
          }).join('')}
        </ul>
      </section>
    `;
  }

  if (section.type === 'notice') {
    const alertClass = section.tone === 'alert' ? 'glass-panel notice-panel notice-alert' : 'glass-panel notice-panel';
    return `
      <section class="${alertClass}" data-section-id="${escapeHtml(section.id)}" data-tab-id="${escapeHtml(section.tab)}">
        <div class="panel-title notice-title"><i class="${escapeHtml(section.icon)}"></i> ${escapeHtml(section.title)}</div>
        ${(section.body || []).map((paragraph) => `<p class="notice-copy">${escapeHtml(paragraph)}</p>`).join('')}
      </section>
    `;
  }

  return '';
}

function renderPeerSection(section) {
  if (section.type === 'rich-text') {
    return `
      <section class="soft-card profile-section" data-section-id="${escapeHtml(section.id)}" data-tab-id="${escapeHtml(section.tab)}">
        <div class="section-title"><i class="${escapeHtml(section.icon)}"></i> ${escapeHtml(section.title)}</div>
        ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
      </section>
    `;
  }

  if (section.type === 'check-list') {
    return `
      <section class="soft-card profile-section" data-section-id="${escapeHtml(section.id)}" data-tab-id="${escapeHtml(section.tab)}">
        <div class="section-title"><i class="${escapeHtml(section.icon)}"></i> ${escapeHtml(section.title)}</div>
        <ul class="check-list">
          ${(section.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </section>
    `;
  }

  if (section.type === 'chip-list') {
    return `
      <section class="soft-card profile-section" data-section-id="${escapeHtml(section.id)}" data-tab-id="${escapeHtml(section.tab)}">
        <div class="section-title"><i class="${escapeHtml(section.icon)}"></i> ${escapeHtml(section.title)}</div>
        <div class="style-grid">
          ${(section.items || []).map((item) => `<span class="style-chip">${escapeHtml(item)}</span>`).join('')}
        </div>
      </section>
    `;
  }

  if (section.type === 'reviews') {
    return `
      <section class="soft-card profile-section" data-section-id="${escapeHtml(section.id)}" data-tab-id="${escapeHtml(section.tab)}">
        <div class="section-title"><i class="${escapeHtml(section.icon)}"></i> ${escapeHtml(section.title)}</div>
        ${(section.items || []).map((item) => `
          <div class="review-card">
            <p class="review-copy">${escapeHtml(item.quote)}</p>
            <div class="review-author">- ${escapeHtml(item.author)}</div>
          </div>
        `).join('')}
      </section>
    `;
  }

  if (section.type === 'boundary') {
    return `
      <section class="boundary-box profile-section" data-section-id="${escapeHtml(section.id)}" data-tab-id="${escapeHtml(section.tab)}">
        <h4>${escapeHtml(section.title)}</h4>
        <p>${escapeHtml(section.body)}</p>
      </section>
    `;
  }

  return '';
}

function mountTabs({ container, tabs, defaultTab, onTabChange }) {
  if (!container || !tabs || tabs.length === 0) return;
  let currentTab = defaultTab || tabs[0].id;

  function draw() {
    container.innerHTML = tabs.map((tab) => `
      <button class="profile-tab ${tab.id === currentTab ? 'active' : ''}" type="button" data-tab-button="${escapeHtml(tab.id)}">
        ${escapeHtml(tab.label)}
      </button>
    `).join('');

    container.querySelectorAll('[data-tab-button]').forEach((button) => {
      button.addEventListener('click', () => {
        currentTab = button.dataset.tabButton;
        draw();
        onTabChange(currentTab);
      });
    });
  }

  draw();
  onTabChange(currentTab);
}

export function mountPsychologistProfile({ profile, root, loadingEl, errorEl }) {
  if (!profile || !root) {
    if (loadingEl) loadingEl.classList.add('hidden');
    if (errorEl) errorEl.classList.remove('hidden');
    return;
  }

  document.title = profile.seoTitle || document.title;
  const description = document.querySelector('meta[name="description"]');
  if (description && profile.seoDescription) description.setAttribute('content', profile.seoDescription);

  const heroStats = (profile.hero.stats || []).map((stat) => `
    <div class="stat-pill"><i class="${escapeHtml(stat.icon)}"></i> ${escapeHtml(stat.label)}</div>
  `).join('');

  root.innerHTML = `
    <nav class="profile-nav">
      <a href="psychologists.html" class="back-link"><i class="fas fa-arrow-left"></i> Back to Psychologists</a>
    </nav>
    <div class="profile-header">
      <div class="avatar-ring">
        <div class="profile-avatar">${escapeHtml(profile.hero.avatarInitial || profile.hero.name.charAt(0))}</div>
      </div>
      <h1 class="profile-name">${escapeHtml(profile.hero.name)}</h1>
      <div class="profile-role">${escapeHtml(profile.hero.role)}</div>
      <div class="stats-row">${heroStats}</div>
      <a href="${escapeHtml(profile.hero.cta.href)}" class="book-btn">${escapeHtml(profile.hero.cta.label)}</a>
    </div>
    <div class="profile-tabs" id="psychologistTabs"></div>
    <div class="content-grid">
      <div class="left-col" id="psychologistMainColumn"></div>
      <div class="right-col" id="psychologistSideColumn"></div>
    </div>
  `;

  const mainColumn = root.querySelector('#psychologistMainColumn');
  const sideColumn = root.querySelector('#psychologistSideColumn');
  const tabs = root.querySelector('#psychologistTabs');

  const groupedSections = {
    main: profile.sections.filter((section) => section.column !== 'side'),
    side: profile.sections.filter((section) => section.column === 'side')
  };

  function renderByTab(tabId) {
    const tab = profile.tabs.find((entry) => entry.id === tabId) || profile.tabs[0];
    const activeIds = new Set(tab.sections);
    mainColumn.innerHTML = groupedSections.main.filter((section) => activeIds.has(section.id)).map(renderPsychologistSection).join('');
    sideColumn.innerHTML = groupedSections.side.filter((section) => activeIds.has(section.id)).map(renderPsychologistSection).join('');
  }

  mountTabs({
    container: tabs,
    tabs: profile.tabs,
    defaultTab: profile.defaultTab,
    onTabChange: renderByTab
  });

  if (loadingEl) loadingEl.classList.add('hidden');
  root.classList.remove('hidden');
}

export function mountPeerProfile({ profile, root, loadingEl, errorEl }) {
  if (!profile || !root) {
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.classList.remove('hidden');
    return;
  }

  document.title = profile.seoTitle || document.title;
  const description = document.querySelector('meta[name="description"]');
  if (description && profile.seoDescription) description.setAttribute('content', profile.seoDescription);

  document.body.classList.remove('theme-anxiety', 'theme-low', 'theme-lonely');
  if (profile.themeClass) document.body.classList.add(profile.themeClass);

  root.innerHTML = `
    <section class="profile-hero fade-in">
      <div class="avatar-container">
        <div class="avatar-initials">${escapeHtml(profile.hero.avatarInitial || profile.hero.name.charAt(0))}</div>
      </div>
      <h1 class="hero-name">${escapeHtml(profile.hero.name)}</h1>
      <div class="hero-role">${escapeHtml(profile.hero.role)}</div>
      <p class="hero-quote">${escapeHtml(profile.hero.quote)}</p>
      <div class="badge-row">
        ${(profile.hero.badges || []).map((badge) => `<span class="soft-badge"><i class="${escapeHtml(badge.icon)}"></i> ${escapeHtml(badge.label)}</span>`).join('')}
      </div>
    </section>
    <div class="profile-tabs" id="peerTabs"></div>
    <div id="peerSections"></div>
    <div class="cta-section fade-in">
      <a class="primary-btn" href="${escapeHtml(profile.cta.primary.href)}">${escapeHtml(profile.cta.primary.label)}</a>
      <p class="cta-note">${escapeHtml(profile.cta.secondaryNote)}</p>
      <button class="save-btn" type="button"><i class="far fa-heart"></i> ${escapeHtml(profile.cta.saveLabel)}</button>
    </div>
  `;

  const tabs = root.querySelector('#peerTabs');
  const sectionHost = root.querySelector('#peerSections');

  function renderByTab(tabId) {
    const tab = profile.tabs.find((entry) => entry.id === tabId) || profile.tabs[0];
    const activeIds = new Set(tab.sections);
    sectionHost.innerHTML = profile.sections.filter((section) => activeIds.has(section.id)).map(renderPeerSection).join('');
  }

  mountTabs({
    container: tabs,
    tabs: profile.tabs,
    defaultTab: profile.defaultTab,
    onTabChange: renderByTab
  });

  if (loadingEl) loadingEl.style.display = 'none';
  root.style.display = 'block';
}
