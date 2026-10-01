/**
 * Mustang Model Cards Showcase Module
 * Renders cards, handles search/filtering/sorting, and hooks into Compare and Audio engines.
 */

export class ModelCardsManager {
  constructor(models, audioEngine, compareManager) {
    this.allModels = models;
    this.filteredModels = [...models];
    this.audioEngine = audioEngine;
    this.compareManager = compareManager;
    this.activeGenerationFilter = 'all';
    this.searchQuery = '';
    this.currentSort = 'year-asc';

    this.gridContainer = document.getElementById('modelsGrid');
    this.searchInput = document.getElementById('modelSearch');
    this.sortSelect = document.getElementById('modelSort');
    this.filterPillsContainer = document.getElementById('generationFilterPills');

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderCards();
  }

  bindEvents() {
    // Search input event
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.applyFilterAndSort();
      });
    }

    // Sort select event
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.applyFilterAndSort();
      });
    }

    // Filter pill events
    if (this.filterPillsContainer) {
      this.filterPillsContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.filter-pill');
        if (!pill) return;

        this.filterPillsContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        this.activeGenerationFilter = pill.dataset.gen || 'all';
        this.applyFilterAndSort();
      });
    }
  }

  setGenerationFilter(genNumber) {
    this.activeGenerationFilter = String(genNumber);
    if (this.filterPillsContainer) {
      this.filterPillsContainer.querySelectorAll('.filter-pill').forEach(pill => {
        if (pill.dataset.gen === String(genNumber)) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });
    }
    this.applyFilterAndSort();

    // Smooth scroll to showcase grid
    const target = document.getElementById('modelsSection');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  applyFilterAndSort() {
    this.filteredModels = this.allModels.filter(m => {
      // Generation filter
      const matchesGen = this.activeGenerationFilter === 'all' || 
                         String(m.generation) === this.activeGenerationFilter;

      // Search filter
      const matchesSearch = !this.searchQuery || 
        m.name.toLowerCase().includes(this.searchQuery) ||
        m.engine.toLowerCase().includes(this.searchQuery) ||
        m.badge.toLowerCase().includes(this.searchQuery) ||
        String(m.launchYear).includes(this.searchQuery);

      return matchesGen && matchesSearch;
    });

    // Sort
    this.filteredModels.sort((a, b) => {
      if (this.currentSort === 'year-asc') return a.launchYear - b.launchYear;
      if (this.currentSort === 'year-desc') return b.launchYear - a.launchYear;
      if (this.currentSort === 'hp-desc') return b.horsepower - a.horsepower;
      if (this.currentSort === 'price-asc') return a.launchPriceValue - b.launchPriceValue;
      if (this.currentSort === 'price-desc') return b.launchPriceValue - a.launchPriceValue;
      return 0;
    });

    this.renderCards();
  }

  renderCards() {
    if (!this.gridContainer) return;

    if (this.filteredModels.length === 0) {
      this.gridContainer.innerHTML = `
        <div class="models-empty" style="grid-column: 1 / -1;">
          <p style="font-size: 1.2rem; color: #a1a1aa; margin-bottom: 1rem;">No Mustang models found matching your criteria.</p>
          <button class="btn-secondary" id="btnResetFilters">Reset Search & Filters</button>
        </div>
      `;
      const btnReset = document.getElementById('btnResetFilters');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          this.activeGenerationFilter = 'all';
          this.searchQuery = '';
          if (this.searchInput) this.searchInput.value = '';
          if (this.filterPillsContainer) {
            this.filterPillsContainer.querySelectorAll('.filter-pill').forEach((p, idx) => {
              if (idx === 0) p.classList.add('active');
              else p.classList.remove('active');
            });
          }
          this.applyFilterAndSort();
        });
      }
      return;
    }

    const cardsHtml = this.filteredModels.map(m => {
      const isSelectedForCompare = this.compareManager && this.compareManager.isModelSelected(m.id);
      const isPlaying = this.audioEngine && this.audioEngine.isPlaying && this.audioEngine.activeModel?.id === m.id;
      const hpPercentage = Math.min(100, Math.round((m.horsepower / 662) * 100));

      return `
        <article class="model-card" data-id="${m.id}">
          <div class="card-media">
            <span class="card-badge-top">${m.badge}</span>
            <span class="card-year-tag">${m.launchYear}</span>
            <img class="card-image" src="${m.image}" alt="${m.name}" loading="lazy" onerror="this.onerror=null; if('${m.placeholder || ''}') this.src='${m.placeholder}';">
          </div>

          <div class="card-body">
            <h3 class="card-title">${m.name}</h3>
            <span class="card-generation">${m.generationLabel}</span>
            <p class="card-desc">${m.description}</p>

            <div class="card-specs-grid">
              <div class="spec-cell">
                <span class="spec-title">Engine</span>
                <span class="spec-val" style="font-size: 0.95rem; line-height: 1.3;">${m.engine}</span>
              </div>
              <div class="spec-cell price-cell">
                <span class="spec-title">Launch Price</span>
                <span class="spec-val price-val">
                  ${m.launchPrice}
                  <button class="price-verify-btn" title="Price notes: ${m.priceVerificationNotes}" data-id="${m.id}">
                    ℹ️
                  </button>
                </span>
              </div>
              <div class="spec-cell">
                <span class="spec-title">0–60 MPH</span>
                <span class="spec-val">${m.zeroToSixty}</span>
              </div>
              <div class="spec-cell">
                <span class="spec-title">Top Speed</span>
                <span class="spec-val">${m.topSpeed}</span>
              </div>
            </div>

            <div class="hp-bar-wrapper">
              <div class="hp-bar-header">
                <span>Output</span>
                <strong style="color: #ffffff;">${m.horsepower} HP • ${m.torque}</strong>
              </div>
              <div class="hp-bar-track">
                <div class="hp-bar-fill" style="width: ${hpPercentage}%;"></div>
              </div>
            </div>

            <div class="card-actions">
              <button class="btn-card-sound ${isPlaying ? 'playing' : ''}" data-id="${m.id}">
                ${isPlaying ? '⏸ Pause Roar' : '🔊 Hear Exhaust'}
              </button>
              <button class="btn-card-compare ${isSelectedForCompare ? 'active' : ''}" data-id="${m.id}" title="Add to Side-by-Side Compare">
                ${isSelectedForCompare ? '✓ Compared' : '⚔️ Compare'}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    this.gridContainer.innerHTML = cardsHtml;
    this.bindCardActions();
  }

  bindCardActions() {
    // Sound button handlers
    this.gridContainer.querySelectorAll('.btn-card-sound').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modelId = e.currentTarget.dataset.id;
        const model = this.allModels.find(m => m.id === modelId);
        if (!model) return;

        if (this.audioEngine.isPlaying && this.audioEngine.activeModel?.id === model.id) {
          this.audioEngine.stopSound();
        } else {
          this.audioEngine.playModelSound(model);
          // Highlight sound section console
          const soundSection = document.getElementById('soundSection');
          if (soundSection) {
            soundSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
        this.renderCards();
      });
    });

    // Compare button handlers
    this.gridContainer.querySelectorAll('.btn-card-compare').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modelId = e.currentTarget.dataset.id;
        const model = this.allModels.find(m => m.id === modelId);
        if (!model || !this.compareManager) return;

        this.compareManager.toggleModelInCompare(model);
        this.renderCards();
      });
    });

    // Price verification note tooltip/alert
    this.gridContainer.querySelectorAll('.price-verify-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modelId = e.currentTarget.dataset.id;
        const model = this.allModels.find(m => m.id === modelId);
        if (!model) return;
        alert(`MSRP Verification Notes for ${model.name}:\n\nListed Launch Price: ${model.launchPrice}\nStatus: ${model.priceStatus}\n\nDetails: ${model.priceVerificationNotes}\n\nRefer to README.md for historical Monroney invoice records.`);
      });
    });
  }
}
