/**
 * Main Application Bootstrapper
 * Coordinates modules: Data, Sound, Timeline, Cards, Compare, and GSAP Animations.
 */

import { loadModelsData } from './data-loader.js';
import { MustangAudioEngine } from './audio-visualizer.js';
import { TimelineManager } from './timeline.js';
import { ModelCardsManager } from './model-cards.js';
import { CompareManager } from './compare.js';
import { AnimationManager } from './animations.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Load Data
  const models = await loadModelsData();

  // 2. Initialize Audio & Waveform Visualizer
  const audioEngine = new MustangAudioEngine('waveformCanvas');

  // 3. Initialize Compare Engine
  const compareManager = new CompareManager(models);

  // 4. Initialize Model Cards Manager
  const cardsManager = new ModelCardsManager(models, audioEngine, compareManager);

  // 5. Initialize Timeline Manager
  const timelineManager = new TimelineManager(models, (genNumber) => {
    cardsManager.setGenerationFilter(genNumber);
  });

  // 6. Initialize GSAP Animations
  const animationManager = new AnimationManager();

  // 7. Setup Sound Console & Playlist UI
  setupSoundSection(models, audioEngine);

  // 8. Setup Global Navigation & Mobile Drawer
  setupNavigation();

  console.log('🐎 Ford Mustang Showcase initialized successfully.');
});

function setupSoundSection(models, audioEngine) {
  const btnMainPlay = document.getElementById('btnMainPlaySound');
  const btnRevThrottle = document.getElementById('btnRevThrottle');
  const soundModelList = document.getElementById('soundModelButtons');
  const activeTitle = document.getElementById('soundActiveTitle');
  const activeEngine = document.getElementById('soundActiveEngine');
  const activeCharacter = document.getElementById('soundActiveCharacter');

  let activeModel = models[0];

  function updateActiveModelDisplay(m) {
    activeModel = m;
    if (activeTitle) activeTitle.textContent = m.name;
    if (activeEngine) activeEngine.textContent = `${m.engine} • ${m.horsepower} HP`;
    if (activeCharacter) activeCharacter.textContent = m.synthProfile?.character || 'Muscle V8';

    // Highlight button
    if (soundModelList) {
      soundModelList.querySelectorAll('.sound-model-pill').forEach(btn => {
        if (btn.dataset.id === m.id) btn.classList.add('active');
        else btn.classList.remove('active');
      });
    }
  }

  // Render sound model playlist buttons
  if (soundModelList) {
    soundModelList.innerHTML = models.map((m, idx) => `
      <button class="sound-model-pill ${idx === 0 ? 'active' : ''}" data-id="${m.id}">
        <span class="sound-pill-icon">🔊</span>
        <div>
          <div class="sound-pill-name">${m.launchYear} ${m.name.split('Mustang')[1] || m.name}</div>
          <div class="sound-pill-character">${m.synthProfile?.character || 'V8 Roar'}</div>
        </div>
      </button>
    `).join('');

    soundModelList.querySelectorAll('.sound-model-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const model = models.find(m => m.id === id);
        if (model) {
          updateActiveModelDisplay(model);
          audioEngine.playModelSound(model);
        }
      });
    });
  }

  // Play / Pause Main Button
  if (btnMainPlay) {
    btnMainPlay.addEventListener('click', () => {
      if (audioEngine.isPlaying) {
        audioEngine.stopSound();
        btnMainPlay.textContent = '▶';
        btnMainPlay.title = 'Start Engine';
      } else {
        audioEngine.playModelSound(activeModel);
        btnMainPlay.textContent = '⏸';
        btnMainPlay.title = 'Stop Engine';
      }
    });
  }

  // Rev Throttle Button
  if (btnRevThrottle) {
    btnRevThrottle.addEventListener('click', () => {
      if (!audioEngine.isPlaying) {
        audioEngine.playModelSound(activeModel);
        if (btnMainPlay) btnMainPlay.textContent = '⏸';
      }
      audioEngine.revThrottle();
    });
  }

  // Audio state change listener
  audioEngine.onStateChange = (state) => {
    if (btnMainPlay) {
      btnMainPlay.textContent = state.isPlaying ? '⏸' : '▶';
    }
    if (state.model) {
      updateActiveModelDisplay(state.model);
    }
  };
}

function setupNavigation() {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.mobile-toggle');
  const links = document.querySelector('.nav-links');

  // Sticky blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
    });

    links.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }
}
