/**
 * Mustang Web Audio API & Animated Waveform Engine
 * Features live <canvas> visualizer and harmonic V8 engine sound synthesis.
 */

export class MustangAudioEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.audioCtx = null;
    this.analyser = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.activeModel = null;
    this.animationFrameId = null;
    this.oscillators = [];
    this.currentRpm = 800;
    this.targetRpm = 800;
    this.maxRpm = 7500;
    this.isRebbing = false;

    this.onStateChange = null;
    this.initCanvasResize();
  }

  initCanvasResize() {
    if (!this.canvas) return;
    const resize = () => {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvas.width = rect.width * (window.devicePixelRatio || 1);
      this.canvas.height = rect.height * (window.devicePixelRatio || 1);
      if (this.ctx) {
        this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      }
    };
    resize();
    window.addEventListener('resize', resize);
  }

  ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playModelSound(model) {
    this.ensureAudioContext();
    this.activeModel = model;

    // Stop any existing sound
    this.stopSound();

    this.isPlaying = true;
    this.currentRpm = model.synthProfile ? model.synthProfile.idleRpm : 800;
    this.targetRpm = this.currentRpm;
    this.maxRpm = model.synthProfile ? model.synthProfile.revRpm : 6500;

    // Start harmonic V8 synthesis
    this.startV8Synthesizer(model);

    // Start visualizer loop
    this.startVisualizer();

    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: true,
        model: this.activeModel,
        rpm: this.currentRpm
      });
    }
  }

  startV8Synthesizer(model) {
    const profile = model.synthProfile || { baseFreq: 80, cylinders: 8 };
    const baseFreq = profile.baseFreq || 75;

    // Multiple harmonic detuned oscillators to mimic firing order of American Cross-Plane V8
    const harmonics = [1, 2, 2.5, 3, 4, 0.5];
    this.oscillators = [];

    const now = this.audioCtx.currentTime;

    harmonics.forEach((h, index) => {
      const osc = this.audioCtx.createOscillator();
      const oscGain = this.audioCtx.createGain();

      // Sawtooth/Triangle mix delivers raspy American V8 growl
      osc.type = index % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq * h, now);

      // Low pass filter for deep muffled exhaust throatiness
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + (index * 80), now);

      const level = 0.15 / (index + 1);
      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.exponentialRampToValueAtTime(level, now + 0.1);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start();
      this.oscillators.push({ osc, filter, baseMultiplier: h, baseFreq, oscGain });
    });
  }

  revThrottle() {
    if (!this.isPlaying || !this.audioCtx) return;
    this.isRebbing = true;

    const now = this.audioCtx.currentTime;
    const revRpm = this.maxRpm;
    this.targetRpm = revRpm;

    // Pitch sweep up fast, then burble down with exhaust pops
    const revDuration = 1.4;
    this.oscillators.forEach(item => {
      const targetFreq = item.baseFreq * item.baseMultiplier * 3.2;
      item.osc.frequency.cancelScheduledValues(now);
      item.osc.frequency.setValueAtTime(item.osc.frequency.value, now);
      item.osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.6);
      item.osc.frequency.exponentialRampToValueAtTime(item.baseFreq * item.baseMultiplier, now + revDuration);

      item.filter.frequency.cancelScheduledValues(now);
      item.filter.frequency.setValueAtTime(item.filter.frequency.value, now);
      item.filter.frequency.linearRampToValueAtTime(2400, now + 0.6);
      item.filter.frequency.exponentialRampToValueAtTime(450, now + revDuration);
    });

    // Animate RPM counter up and down
    let startTime = performance.now();
    const animateRpm = (currentTime) => {
      const elapsed = (currentTime - startTime) / 1000;
      if (elapsed < 0.6) {
        const progress = elapsed / 0.6;
        this.currentRpm = Math.floor(this.activeModel.synthProfile.idleRpm + (revRpm - this.activeModel.synthProfile.idleRpm) * Math.sin(progress * Math.PI / 2));
      } else if (elapsed < revDuration) {
        const progress = (elapsed - 0.6) / (revDuration - 0.6);
        this.currentRpm = Math.floor(revRpm - (revRpm - this.activeModel.synthProfile.idleRpm) * progress);
      } else {
        this.currentRpm = this.activeModel.synthProfile.idleRpm;
        this.isRebbing = false;
        return;
      }
      this.updateTachometer(this.currentRpm, this.maxRpm);
      requestAnimationFrame(animateRpm);
    };
    requestAnimationFrame(animateRpm);
  }

  stopSound() {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    if (this.oscillators.length && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.oscillators.forEach(item => {
        try {
          item.oscGain.gain.cancelScheduledValues(now);
          item.oscGain.gain.linearRampToValueAtTime(0.0001, now + 0.15);
          item.osc.stop(now + 0.2);
        } catch (e) {}
      });
      this.oscillators = [];
    }

    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: false,
        model: this.activeModel,
        rpm: 0
      });
    }
  }

  startVisualizer() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const bufferLength = this.analyser ? this.analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      this.animationFrameId = requestAnimationFrame(render);
      if (!this.ctx || !this.canvas) return;

      const width = this.canvas.width / (window.devicePixelRatio || 1);
      const height = this.canvas.height / (window.devicePixelRatio || 1);

      this.ctx.clearRect(0, 0, width, height);

      // Dark background grid reflection
      this.ctx.fillStyle = 'rgba(9, 9, 13, 0.4)';
      this.ctx.fillRect(0, 0, width, height);

      if (this.isPlaying && this.analyser) {
        this.analyser.getByteFrequencyData(dataArray);

        // Center line
        const centerY = height / 2;
        const barCount = 48;
        const barWidth = (width / barCount) * 0.7;
        const barSpacing = (width / barCount) * 0.3;

        for (let i = 0; i < barCount; i++) {
          const index = Math.floor(i * (bufferLength / barCount));
          const val = dataArray[index] || 15;
          const barHeight = Math.max(4, (val / 255) * (height * 0.42));

          const x = i * (barWidth + barSpacing) + barSpacing;

          // Fiery crimson to brushed chrome gradient
          const grad = this.ctx.createLinearGradient(0, centerY - barHeight, 0, centerY + barHeight);
          grad.addColorStop(0, '#ff2a4b');
          grad.addColorStop(0.5, '#ffffff');
          grad.addColorStop(1, '#b3001e');

          this.ctx.fillStyle = grad;
          this.ctx.shadowBlur = 10;
          this.ctx.shadowColor = 'rgba(230, 0, 40, 0.6)';

          // Symmetrical audio wave bars
          this.ctx.beginPath();
          this.ctx.roundRect(x, centerY - barHeight, barWidth, barHeight * 2, 4);
          this.ctx.fill();
        }

        // Draw animated center pulse wire
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1.5;
        this.ctx.moveTo(0, centerY);
        for (let i = 0; i < barCount; i++) {
          const index = Math.floor(i * (bufferLength / barCount));
          const val = dataArray[index] || 0;
          const yOffset = ((val - 128) / 128) * 20;
          const x = i * (barWidth + barSpacing);
          this.ctx.lineTo(x, centerY + yOffset);
        }
        this.ctx.lineTo(width, centerY);
        this.ctx.stroke();

        this.updateTachometer(this.currentRpm, this.maxRpm);

      } else {
        // Idle gentle waveform pulse when sound stopped
        const centerY = height / 2;
        const time = performance.now() * 0.002;
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(230, 0, 40, 0.35)';
        this.ctx.lineWidth = 2;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = 'rgba(230, 0, 40, 0.4)';

        for (let x = 0; x < width; x += 5) {
          const y = centerY + Math.sin(x * 0.02 + time) * 6 * Math.sin(time * 0.5);
          if (x === 0) this.ctx.moveTo(x, y);
          else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
      }
    };

    render();
  }

  updateTachometer(rpm, maxRpm) {
    const rpmDisplay = document.getElementById('tachRpmNumber');
    if (rpmDisplay) {
      rpmDisplay.textContent = rpm.toLocaleString();
    }

    const needle = document.getElementById('tachNeedle');
    if (needle) {
      // Rotate between -90deg (0 RPM) to +90deg (max RPM)
      const ratio = Math.min(1, Math.max(0, rpm / (maxRpm || 8000)));
      const degrees = -90 + (ratio * 180);
      needle.style.transform = `rotate(${degrees}deg)`;
    }
  }
}
