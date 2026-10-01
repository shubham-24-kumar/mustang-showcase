/**
 * Mustang Side-by-Side Compare Engine
 * Handles dual-slot vehicle comparison, winner delta calculation, and sticky comparison drawer.
 */

export class CompareManager {
  constructor(models) {
    this.models = models;
    // Default selection: 1964 1/2 vs 2024 Dark Horse (Iconic 60-year gap!)
    this.slotA = models[0] || null;
    this.slotB = models[models.length - 1] || null;

    this.selectA = document.getElementById('compareSelectA');
    this.selectB = document.getElementById('compareSelectB');
    this.matrixContainer = document.getElementById('compareMatrixContainer');
    this.stickyTray = document.getElementById('compareStickyTray');
    this.traySlotA = document.getElementById('trayChipA');
    this.traySlotB = document.getElementById('trayChipB');
    this.navCompareBadge = document.getElementById('navCompareBadge');

    this.init();
  }

  init() {
    this.populateDropdowns();
    this.bindEvents();
    this.renderComparison();
    this.updateStickyTray();
  }

  populateDropdowns() {
    if (!this.selectA || !this.selectB) return;

    const optionsHtml = this.models.map(m => `
      <option value="${m.id}">${m.launchYear} ${m.name}</option>
    `).join('');

    this.selectA.innerHTML = optionsHtml;
    this.selectB.innerHTML = optionsHtml;

    if (this.slotA) this.selectA.value = this.slotA.id;
    if (this.slotB) this.selectB.value = this.slotB.id;
  }

  bindEvents() {
    if (this.selectA) {
      this.selectA.addEventListener('change', (e) => {
        this.slotA = this.models.find(m => m.id === e.target.value) || null;
        this.renderComparison();
        this.updateStickyTray();
      });
    }

    if (this.selectB) {
      this.selectB.addEventListener('change', (e) => {
        this.slotB = this.models.find(m => m.id === e.target.value) || null;
        this.renderComparison();
        this.updateStickyTray();
      });
    }

    // Swap slots button
    const swapBtn = document.getElementById('btnSwapCompare');
    if (swapBtn) {
      swapBtn.addEventListener('click', () => {
        const temp = this.slotA;
        this.slotA = this.slotB;
        this.slotB = temp;
        if (this.selectA && this.slotA) this.selectA.value = this.slotA.id;
        if (this.selectB && this.slotB) this.selectB.value = this.slotB.id;
        this.renderComparison();
        this.updateStickyTray();
      });
    }

    // Sticky tray jump button
    const btnTrayCompare = document.getElementById('btnTrayCompare');
    if (btnTrayCompare) {
      btnTrayCompare.addEventListener('click', () => {
        const target = document.getElementById('compareSection');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Sticky tray clear button
    const btnTrayClear = document.getElementById('btnTrayClear');
    if (btnTrayClear) {
      btnTrayClear.addEventListener('click', () => {
        this.slotA = this.models[0];
        this.slotB = this.models[1];
        if (this.selectA) this.selectA.value = this.slotA.id;
        if (this.selectB) this.selectB.value = this.slotB.id;
        this.renderComparison();
        this.updateStickyTray();
        window.dispatchEvent(new CustomEvent('mustang:compare-updated'));
      });
    }
  }

  isModelSelected(modelId) {
    return (this.slotA && this.slotA.id === modelId) || (this.slotB && this.slotB.id === modelId);
  }

  toggleModelInCompare(model) {
    if (this.slotA && this.slotA.id === model.id) {
      // already in A, leave or swap
      return;
    } else if (this.slotB && this.slotB.id === model.id) {
      return;
    } else {
      // Put into Slot B (or Slot A)
      this.slotB = model;
      if (this.selectB) this.selectB.value = model.id;
    }

    this.renderComparison();
    this.updateStickyTray();
    this.showStickyTray();
  }

  showStickyTray() {
    if (this.stickyTray) {
      this.stickyTray.classList.add('active');
    }
  }

  updateStickyTray() {
    if (this.traySlotA && this.slotA) {
      this.traySlotA.innerHTML = `<span>🏎️ ${this.slotA.name}</span>`;
    }
    if (this.traySlotB && this.slotB) {
      this.traySlotB.innerHTML = `<span>🏎️ ${this.slotB.name}</span>`;
    }
    if (this.navCompareBadge) {
      const count = (this.slotA ? 1 : 0) + (this.slotB ? 1 : 0);
      this.navCompareBadge.textContent = count;
    }
  }

  calculatePowerToWeight(model) {
    if (!model) return 0;
    const weightNum = parseInt(model.curbWeight.replace(/[^0-9]/g, ''), 10) || 3000;
    // HP per 1000 lbs
    return ((model.horsepower / weightNum) * 1000).toFixed(1);
  }

  renderComparison() {
    if (!this.matrixContainer || !this.slotA || !this.slotB) return;

    const carA = this.slotA;
    const carB = this.slotB;

    // Numerical parse for delta calculations
    const hpA = carA.horsepower;
    const hpB = carB.horsepower;
    const hpWinner = hpA > hpB ? 'A' : (hpB > hpA ? 'B' : 'TIE');
    const hpTotal = hpA + hpB;
    const hpPercentA = Math.round((hpA / hpTotal) * 100);
    const hpPercentB = 100 - hpPercentA;

    // 0-60
    const zeroSixtyA = parseFloat(carA.zeroToSixty) || 6.0;
    const zeroSixtyB = parseFloat(carB.zeroToSixty) || 6.0;
    const zeroWinner = zeroSixtyA < zeroSixtyB ? 'A' : (zeroSixtyB < zeroSixtyA ? 'B' : 'TIE');

    // Top Speed
    const speedA = parseInt(carA.topSpeed.replace(/[^0-9]/g, ''), 10) || 120;
    const speedB = parseInt(carB.topSpeed.replace(/[^0-9]/g, ''), 10) || 120;
    const speedWinner = speedA > speedB ? 'A' : (speedB > speedA ? 'B' : 'TIE');

    // Power to weight
    const ptwA = parseFloat(this.calculatePowerToWeight(carA));
    const ptwB = parseFloat(this.calculatePowerToWeight(carB));
    const ptwWinner = ptwA > ptwB ? 'A' : (ptwB > ptwA ? 'B' : 'TIE');
    const ptwTotal = ptwA + ptwB;
    const ptwPercentA = Math.round((ptwA / ptwTotal) * 100);
    const ptwPercentB = 100 - ptwPercentA;

    // Price
    const priceA = carA.launchPriceValue;
    const priceB = carB.launchPriceValue;

    this.matrixContainer.innerHTML = `
      <div class="compare-cars-header">
        <div class="compare-car-card ${hpWinner === 'A' ? 'winner-card' : ''}">
          <div class="compare-car-img-wrap">
            <img src="${carA.image}" alt="${carA.name}" loading="lazy" onerror="this.onerror=null; if('${carA.placeholder || ''}') this.src='${carA.placeholder}';">
          </div>
          <h4 class="compare-car-title">${carA.name}</h4>
          <span class="compare-car-sub">${carA.generationLabel}</span>
        </div>

        <div class="compare-car-card ${hpWinner === 'B' ? 'winner-card' : ''}">
          <div class="compare-car-img-wrap">
            <img src="${carB.image}" alt="${carB.name}" loading="lazy" onerror="this.onerror=null; if('${carB.placeholder || ''}') this.src='${carB.placeholder}';">
          </div>
          <h4 class="compare-car-title">${carB.name}</h4>
          <span class="compare-car-sub">${carB.generationLabel}</span>
        </div>
      </div>

      <div class="compare-stats-matrix">
        <!-- Horsepower Stat Row -->
        <div class="stat-compare-row">
          <div class="stat-row-label">Maximum Horsepower</div>
          <div class="stat-values-row">
            <div class="stat-val-slot slot-a">
              ${hpWinner === 'A' ? '<span class="winner-tag">★ Lead</span>' : ''}
              <span>${hpA} HP</span>
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">VS</div>
            <div class="stat-val-slot slot-b">
              <span>${hpB} HP</span>
              ${hpWinner === 'B' ? '<span class="winner-tag">★ Lead</span>' : ''}
            </div>
          </div>
          <div class="delta-bar-container">
            <div class="delta-fill-a" style="width: ${hpPercentA}%;" title="${carA.name}: ${hpPercentA}%"></div>
            <div class="delta-fill-b" style="width: ${hpPercentB}%;" title="${carB.name}: ${hpPercentB}%"></div>
          </div>
        </div>

        <!-- 0-60 Acceleration Stat Row -->
        <div class="stat-compare-row">
          <div class="stat-row-label">0–60 MPH Acceleration (Lower is Quicker)</div>
          <div class="stat-values-row">
            <div class="stat-val-slot slot-a">
              ${zeroWinner === 'A' ? '<span class="winner-tag">⚡ Quicker</span>' : ''}
              <span>${carA.zeroToSixty}</span>
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">VS</div>
            <div class="stat-val-slot slot-b">
              <span>${carB.zeroToSixty}</span>
              ${zeroWinner === 'B' ? '<span class="winner-tag">⚡ Quicker</span>' : ''}
            </div>
          </div>
        </div>

        <!-- Top Speed Stat Row -->
        <div class="stat-compare-row">
          <div class="stat-row-label">Estimated Top Speed</div>
          <div class="stat-values-row">
            <div class="stat-val-slot slot-a">
              ${speedWinner === 'A' ? '<span class="winner-tag">★ Faster</span>' : ''}
              <span>${carA.topSpeed}</span>
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">VS</div>
            <div class="stat-val-slot slot-b">
              <span>${carB.topSpeed}</span>
              ${speedWinner === 'B' ? '<span class="winner-tag">★ Faster</span>' : ''}
            </div>
          </div>
        </div>

        <!-- Power to Weight Ratio Stat Row -->
        <div class="stat-compare-row">
          <div class="stat-row-label">Power-to-Weight (HP per 1,000 lbs)</div>
          <div class="stat-values-row">
            <div class="stat-val-slot slot-a">
              ${ptwWinner === 'A' ? '<span class="winner-tag">★ Superior</span>' : ''}
              <span>${ptwA} hp/1k lbs</span>
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">VS</div>
            <div class="stat-val-slot slot-b">
              <span>${ptwB} hp/1k lbs</span>
              ${ptwWinner === 'B' ? '<span class="winner-tag">★ Superior</span>' : ''}
            </div>
          </div>
          <div class="delta-bar-container">
            <div class="delta-fill-a" style="width: ${ptwPercentA}%;"></div>
            <div class="delta-fill-b" style="width: ${ptwPercentB}%;"></div>
          </div>
        </div>

        <!-- Engine & Transmission Specs -->
        <div class="stat-compare-row">
          <div class="stat-row-label">Engine Architecture & Transmission</div>
          <div class="stat-values-row">
            <div class="stat-val-slot slot-a" style="font-size: 1rem; flex-direction: column; align-items: flex-end;">
              <span style="color: #ffffff; font-weight: 700;">${carA.engine}</span>
              <span style="font-size: 0.8rem; color: var(--text-secondary);">${carA.transmission}</span>
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">VS</div>
            <div class="stat-val-slot slot-b" style="font-size: 1rem; flex-direction: column; align-items: flex-start;">
              <span style="color: #ffffff; font-weight: 700;">${carB.engine}</span>
              <span style="font-size: 0.8rem; color: var(--text-secondary);">${carB.transmission}</span>
            </div>
          </div>
        </div>

        <!-- Launch Price Comparison -->
        <div class="stat-compare-row">
          <div class="stat-row-label">Historical Launch MSRP (Original Period Pricing)</div>
          <div class="stat-values-row">
            <div class="stat-val-slot slot-a">
              <span style="color: var(--accent-gold);">${carA.launchPrice}</span>
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">VS</div>
            <div class="stat-val-slot slot-b">
              <span style="color: var(--accent-gold);">${carB.launchPrice}</span>
            </div>
          </div>
          <div style="text-align: center; margin-top: 0.75rem;">
            <span class="winner-tag" style="background: rgba(245, 158, 11, 0.1); color: var(--accent-gold); border-color: rgba(245, 158, 11, 0.3);">
              Note: Base Launch MSRP. Check README.md for inflation and trim option verification.
            </span>
          </div>
        </div>
      </div>
    `;
  }
}
