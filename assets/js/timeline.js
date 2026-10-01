/**
 * Mustang Generation Timeline Module
 * Interactive 1964-to-Present Generation Navigation & Scrubbing
 */

export class TimelineManager {
  constructor(models, onFilterGeneration) {
    this.models = models;
    this.onFilterGeneration = onFilterGeneration;
    this.currentGenIndex = 0;

    this.generations = [
      {
        gen: 1,
        years: "1964½ – 1973",
        title: "Gen 1: The Original Pony Car",
        summary: "Conceived under Lee Iacocca and unveiled at the 1964 New York World's Fair, the Mustang became an overnight cultural phenomenon, spawning the pony car genre, Carroll Shelby GT350s, Trans-Am Boss 302s, and NASCAR-derived Boss 429 monsters.",
        highlightEngine: "4.7L 289 to 7.0L 429 Semi-Hemi",
        peakHp: "375 HP (Boss 429)",
        image: "assets/images/1964-mustang.png",
        milestone: "Over 418,000 units sold in the first 12 months."
      },
      {
        gen: 2,
        years: "1974 – 1978",
        title: "Gen 2: The Downsized Era (Mustang II)",
        summary: "Arriving during the 1973 Arab oil embargo, the lighter Mustang II shed hundreds of pounds, won Motor Trend's 1974 Car of the Year, and successfully weathered the global fuel crisis before bringing back 302 V8 power and the King Cobra package.",
        highlightEngine: "2.8L V6 to 4.9L 302 V8",
        peakHp: "140 HP",
        image: "assets/images/1974-mustang.png",
        milestone: "Motor Trend Car of the Year (1974)."
      },
      {
        gen: 3,
        years: "1979 – 1993",
        title: "Gen 3: The Fox Body Revival",
        summary: "Built on Ford's versatile lightweight Fox platform, this generation rescued American muscle from the malaise era. In 1982 'The Boss is Back' brought the 5.0L High Output V8, followed by aero ground effects and the debut of the Special Vehicle Team (SVT) 1993 Cobra.",
        highlightEngine: "5.0L High Output SEFI V8",
        peakHp: "235 HP (1993 SVT Cobra)",
        image: "assets/images/1987-mustang.png",
        milestone: "15-year reign defining street racing culture."
      },
      {
        gen: 4,
        years: "1994 – 2004",
        title: "Gen 4: SN95 & Sharp New Edge",
        summary: "Codenamed 'Fox-4', the SN95 brought curvaceous 1990s styling followed by sharp 1999 New Edge angular body panels. This era pioneered modular overhead-cam 4.6L V8s, independent rear suspension (IRS), and culminated in the supercharged 390hp 'Terminator' Cobra.",
        highlightEngine: "4.6L Supercharged DOHC 32V V8",
        peakHp: "390 HP (Terminator Cobra)",
        image: "assets/images/2003-mustang.png",
        milestone: "First factory supercharged SVT Mustang."
      },
      {
        gen: 5,
        years: "2005 – 2014",
        title: "Gen 5: Retro-Futurism (S197)",
        summary: "The S197 ignited a worldwide retro-muscle war by resurrecting the aggressive fastback proportions of the late 1960s. It introduced the revolutionary all-aluminum 5.0L Coyote V8, revived the Boss 302, and crowned the era with the 202-mph, 662hp Shelby GT500.",
        highlightEngine: "5.8L Supercharged 'Trinity' V8",
        peakHp: "662 HP (2013 Shelby GT500)",
        image: "assets/images/2013-mustang.png",
        milestone: "First factory Mustang to break 200 MPH."
      },
      {
        gen: 6,
        years: "2015 – 2023",
        title: "Gen 6: The Global Performance Era (S550)",
        summary: "Celebrating the Mustang's 50th birthday, the S550 debuted standard integral-link independent rear suspension worldwide and right-hand drive export. It engineered track supremacy with the 8,250 RPM flat-plane crankshaft GT350 and the 760hp dual-clutch GT500.",
        highlightEngine: "5.2L 'Voodoo' Flat-Plane Crank V8",
        peakHp: "760 HP (2020 Shelby GT500)",
        image: "assets/images/2016-mustang.png",
        milestone: "Exotic 8,250 RPM European-challenging track supercar."
      },
      {
        gen: 7,
        years: "2024 – Present",
        title: "Gen 7: Digital Cockpit Era (S650)",
        summary: "With competitors bowing out, the S650 stands as America's sole surviving V8 muscle car. It combines a fighter-jet dual curved digital cockpit running Unreal Engine with dual-air-intake Coyote power and the track-honed 500hp Dark Horse flagship.",
        highlightEngine: "5.0L Dual-Throttle Coyote Gen-4 V8",
        peakHp: "500 HP (Dark Horse)",
        image: "assets/images/2024-mustang.png",
        milestone: "Sole reigning V8 manual muscle car in production."
      }
    ];

    this.container = document.getElementById('timelineContainer');
    this.progressLine = document.getElementById('timelineProgressLine');
    this.nodes = document.querySelectorAll('.gen-node-btn');

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderCurrentGeneration();
  }

  bindEvents() {
    // Generation node button clicks
    this.nodes.forEach((node, index) => {
      node.addEventListener('click', () => {
        this.selectGeneration(index);
      });
    });

    // Arrow keys or buttons
    const prevBtn = document.getElementById('btnPrevGen');
    const nextBtn = document.getElementById('btnNextGen');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.selectGeneration((this.currentGenIndex - 1 + this.generations.length) % this.generations.length);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.selectGeneration((this.currentGenIndex + 1) % this.generations.length);
      });
    }
  }

  selectGeneration(index) {
    this.currentGenIndex = index;

    // Update scrubber nodes
    this.nodes.forEach((node, i) => {
      if (i === index) node.classList.add('active');
      else node.classList.remove('active');
    });

    // Update scrubber progress line width
    if (this.progressLine) {
      const percentage = (index / (this.generations.length - 1)) * 100;
      this.progressLine.style.width = `${Math.max(12, percentage)}%`;
    }

    this.renderCurrentGeneration();
  }

  renderCurrentGeneration() {
    const gen = this.generations[this.currentGenIndex];
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="gen-visual">
        <span class="gen-badge-overlay">Generation ${gen.gen}</span>
        <img src="${gen.image}" alt="${gen.title}" loading="lazy">
      </div>

      <div class="gen-info">
        <span class="gen-years-tag">${gen.years}</span>
        <h3 class="gen-heading">${gen.title}</h3>
        <p class="gen-summary">${gen.summary}</p>

        <div class="gen-highlights-grid">
          <div class="gen-highlight-item">
            <span class="highlight-label">Peak Horsepower</span>
            <div class="highlight-value" style="color: var(--accent-red);">${gen.peakHp}</div>
          </div>
          <div class="gen-highlight-item">
            <span class="highlight-label">Engine Architecture</span>
            <div class="highlight-value" style="font-size: 1rem; color: #ffffff;">${gen.highlightEngine}</div>
          </div>
        </div>

        <div class="gen-highlight-item" style="border-left: 3px solid var(--accent-red); margin-top: -0.25rem;">
          <span class="highlight-label">Historical Milestone</span>
          <div style="color: #ffffff; font-size: 0.95rem; font-weight: 600; margin-top: 0.2rem;">${gen.milestone}</div>
        </div>

        <div class="timeline-nav-controls">
          <button class="btn-timeline-arrow" id="btnPrevGen" aria-label="Previous Generation">‹</button>
          <button class="btn-timeline-arrow" id="btnNextGen" aria-label="Next Generation">›</button>
          <button class="btn-view-gen-models" id="btnFilterShowcaseGen" data-gen="${gen.gen}">
            View Gen ${gen.gen} Models in Showcase →
          </button>
        </div>
      </div>
    `;

    // Rebind internal controls
    const prevBtn = document.getElementById('btnPrevGen');
    const nextBtn = document.getElementById('btnNextGen');
    const filterBtn = document.getElementById('btnFilterShowcaseGen');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.selectGeneration((this.currentGenIndex - 1 + this.generations.length) % this.generations.length);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.selectGeneration((this.currentGenIndex + 1) % this.generations.length);
      });
    }

    if (filterBtn) {
      filterBtn.addEventListener('click', () => {
        if (this.onFilterGeneration) {
          this.onFilterGeneration(gen.gen);
        }
      });
    }
  }
}
