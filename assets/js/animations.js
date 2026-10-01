/**
 * Mustang GSAP Animation Pipeline
 * Configures hero entrance, ScrollTrigger scroll effects, and hover physics.
 */

export class AnimationManager {
  constructor() {
    this.hasGsap = typeof window.gsap !== 'undefined';
    this.hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';

    if (this.hasGsap && this.hasScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    this.init();
  }

  init() {
    this.initHeroEntrance();
    this.initHeroScrollEffect();
    this.initScrollReveals();
    this.initCardTiltEffects();
    this.initBackToTop();
  }

  initHeroEntrance() {
    if (!this.hasGsap) return;

    const tl = window.gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.nav-brand', { opacity: 0, y: -20, duration: 0.8 })
      .from('.nav-link', { opacity: 0, y: -10, stagger: 0.1, duration: 0.6 }, '-=0.4')
      .from('.btn-nav-compare', { opacity: 0, scale: 0.9, duration: 0.5 }, '-=0.3')
      .from('.hero-badge-wrap', { opacity: 0, y: 30, duration: 0.7 }, '-=0.3')
      .from('.hero-title .title-line-1', { opacity: 0, y: 50, duration: 0.9 }, '-=0.5')
      .from('.hero-title .title-line-2', { opacity: 0, y: 50, duration: 0.9 }, '-=0.6')
      .from('.hero-desc', { opacity: 0, y: 30, duration: 0.8 }, '-=0.5')
      .from('.hero-actions .btn-primary, .hero-actions .btn-secondary', { opacity: 0, y: 25, stagger: 0.15, duration: 0.7 }, '-=0.4')
      .from('.hero-stats-bar', { opacity: 0, y: 40, duration: 0.9 }, '-=0.5')
      .from('.hero-scroll-indicator', { opacity: 0, duration: 1 }, '-=0.3');
  }

  initHeroScrollEffect() {
    if (!this.hasGsap || !this.hasScrollTrigger) return;

    // As user scrolls down from hero, gently scale down and fade hero content for high-end cinematic parallax
    window.gsap.to('.hero-content', {
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      y: 120,
      opacity: 0.1,
      scale: 0.92
    });

    window.gsap.to('.hero-speed-lines', {
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      y: 200
    });
  }

  initScrollReveals() {
    if (!this.hasGsap || !this.hasScrollTrigger) return;

    // Animate section headers as they enter viewport
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
      window.gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out'
      });
    });

    // Animate sound console
    const soundConsole = document.querySelector('.sound-console');
    if (soundConsole) {
      window.gsap.from(soundConsole, {
        scrollTrigger: {
          trigger: soundConsole,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      });
    }

    // Animate compare matrix
    const compareBox = document.querySelector('.compare-matrix-box');
    if (compareBox) {
      window.gsap.from(compareBox, {
        scrollTrigger: {
          trigger: compareBox,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      });
    }
  }

  initCardTiltEffects() {
    // Dynamic 3D mouse tilt on cards
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.model-card');
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    document.addEventListener('mouseout', (e) => {
      const card = e.target.closest('.model-card');
      if (!card) return;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  }

  initBackToTop() {
    const btnTop = document.getElementById('backToTop');
    if (!btnTop) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        btnTop.classList.add('visible');
      } else {
        btnTop.classList.remove('visible');
      }
    });

    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
