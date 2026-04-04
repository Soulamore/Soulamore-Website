/**
 * tag-ui-utils.js
 * Comprehensive UI utility for rendering the categorized tag selectors.
 */

import { PEER_CATEGORIES, PSYCH_CLINICAL_TAGS, PSYCH_APPROACH_TAGS, PEER_CATEGORIES_FOR_PSYCH } from './tag-definitions.js';

/**
 * Creates a categorized dropdown selector.
 * @param {HTMLElement} container - The element to inject the component into.
 * @param {Object} options - Configuration options.
 */
export function renderCategorizedSelector(container, options = {}) {
    const {
        type = 'peer', // 'peer' or 'psych'
        selectedTags = [],
        onSelectionChange = () => {},
        placeholder = 'Select areas of expertise...'
    } = options;

    // Use specific categories based on type
    let categoryData = {};
    if (type === 'peer') {
        categoryData = PEER_CATEGORIES;
    } else if (type === 'psych') {
        // Psych has specific groupings
        categoryData = {
            "Clinical Specializations": PSYCH_CLINICAL_TAGS,
            "Therapeutic Approaches": PSYCH_APPROACH_TAGS,
            ...PEER_CATEGORIES_FOR_PSYCH
        };
    }

    // 1. Build Component Structure
    const componentId = `tag-selector-${Math.random().toString(36).substr(2, 9)}`;
    container.innerHTML = `
        <div class="tag-dropdown-wrap" id="${componentId}">
            <button class="tag-dropdown-btn">
                <span class="btn-text">${placeholder}</span>
                <i class="fas fa-chevron-down chevron"></i>
            </button>
            <div class="tag-dropdown-panel">
                <div style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.75rem; opacity: 0.5;" class="selection-counter">0 selected</span>
                    <button class="clear-all-btn" style="background: none; border: none; color: var(--accent-theme); font-size: 0.75rem; cursor: pointer; font-weight: 600;">Clear all</button>
                </div>
                <div class="categories-scroll-area">
                    ${Object.entries(categoryData).map(([catName, tags]) => `
                        <div class="tag-category-group">
                            <div class="tag-category-title">${catName}</div>
                            <div class="tag-options-grid">
                                ${tags.map(tag => `
                                    <label class="tag-option-item">
                                        <input type="checkbox" value="${tag}" ${selectedTags.includes(tag) ? 'checked' : ''}>
                                        <span>${tag}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="tag-preview-strip"></div>
        </div>
    `;

    const wrap = container.querySelector('.tag-dropdown-wrap');
    const btn = wrap.querySelector('.tag-dropdown-btn');
    const btnText = wrap.querySelector('.btn-text');
    const panel = wrap.querySelector('.tag-dropdown-panel');
    const preview = wrap.querySelector('.tag-preview-strip');
    const counter = wrap.querySelector('.selection-counter');
    const clearBtn = wrap.querySelector('.clear-all-btn');
    const checkboxes = wrap.querySelectorAll('input[type="checkbox"]');

    // 2. Event Listeners
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = panel.classList.contains('open');
        
        // Close all other panels first (if any)
        document.querySelectorAll('.tag-dropdown-panel.open').forEach(p => {
            if (p !== panel) p.classList.remove('open');
        });
        document.querySelectorAll('.tag-dropdown-btn.open').forEach(b => {
             if (b !== btn) b.classList.remove('open');
        });

        panel.classList.toggle('open');
        btn.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!wrap.contains(e.target)) {
            panel.classList.remove('open');
            btn.classList.remove('open');
        }
    });

    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => updateState());
    });

    clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        checkboxes.forEach(cb => cb.checked = false);
        updateState();
    });

    // 3. State Management
    function updateState() {
        const checked = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
        
        // Update Counter & Button Text
        counter.textContent = `${checked.length} selected`;
        if (checked.length > 0) {
            btnText.textContent = `${checked.length} topics selected`;
            btn.classList.add('has-selection');
        } else {
            btnText.textContent = placeholder;
            btn.classList.remove('has-selection');
        }

        // Update Preview Strip
        preview.innerHTML = checked.map(tag => `
            <div class="tag-pill-active">
                ${tag}
                <i class="fas fa-times" data-tag="${tag}"></i>
            </div>
        `).join('');

        // Handle pill removal
        preview.querySelectorAll('i').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const tagToRemove = e.target.dataset.tag;
                const cb = Array.from(checkboxes).find(c => c.value === tagToRemove);
                if (cb) cb.checked = false;
                updateState();
            });
        });

        onSelectionChange(checked);
    }

    // Initialize
    updateState();
}
