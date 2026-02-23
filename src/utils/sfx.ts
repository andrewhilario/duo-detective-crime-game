// ---------------------------------------------------------------------------
// AudioEngine — procedural Web Audio API sound engine
// All sounds are generated programmatically — no audio asset files needed.
// ---------------------------------------------------------------------------

export const AudioEngine = {
  ctx: null as AudioContext | null,
  masterGain: null as GainNode | null,
  musicGain: null as GainNode | null,
  sfxGain: null as GainNode | null,

  // Background music state
  _musicNodes: [] as AudioNode[],
  _musicRunning: false,
  _musicLoopTimeout: null as ReturnType<typeof setTimeout> | null,

  // -------------------------------------------------------------------------
  // Init
  // -------------------------------------------------------------------------
  init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

      // Master → splits to music and sfx buses
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.4;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.7;
      this.sfxGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  // -------------------------------------------------------------------------
  // Volume controls
  // -------------------------------------------------------------------------
  setMusicVolume(v: number) {
    this.init();
    if (this.musicGain) this.musicGain.gain.value = Math.max(0, Math.min(1, v));
  },

  setSfxVolume(v: number) {
    this.init();
    if (this.sfxGain) this.sfxGain.gain.value = Math.max(0, Math.min(1, v));
  },

  // -------------------------------------------------------------------------
  // Background music — procedural noir ambient loop
  //
  // The track is built from three layers that play simultaneously and loop:
  //   1. Bass drone   — slow LFO-modulated sine pad in the low register
  //   2. Chord stabs  — muted triangle chords in a minor ii-V-i pattern
  //   3. Hi-hat pulse — subtle white-noise pulse on beats 2 & 4
  //
  // Each loop is ~8 bars @ ~60 bpm (≈8s). The scheduler queues the next loop
  // 0.1s before the current one ends to avoid gaps.
  // -------------------------------------------------------------------------
  startMusic() {
    this.init();
    if (!this.ctx || this._musicRunning) return;
    this._musicRunning = true;
    this._scheduleLoop();
  },

  stopMusic() {
    this._musicRunning = false;
    if (this._musicLoopTimeout !== null) {
      clearTimeout(this._musicLoopTimeout);
      this._musicLoopTimeout = null;
    }
    // Fade out quickly instead of cutting
    if (this.musicGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
      this.musicGain.gain.linearRampToValueAtTime(0, now + 1.5);
      setTimeout(() => {
        // Kill all running nodes
        this._musicNodes.forEach(n => {
          try { (n as OscillatorNode | AudioBufferSourceNode).stop(); } catch { /* already stopped */ }
        });
        this._musicNodes = [];
        // Restore gain for next start
        if (this.musicGain) this.musicGain.gain.value = 0.4;
      }, 1600);
    }
  },

  _scheduleLoop() {
    if (!this._musicRunning || !this.ctx || !this.musicGain) return;

    const ctx = this.ctx;
    const out = this.musicGain;
    const now = ctx.currentTime;
    const bpm = 58;
    const beat = 60 / bpm;           // seconds per beat
    const bar = beat * 4;             // 4/4
    const loopLen = bar * 8;          // 8 bars

    // Restore gain in case it was faded
    out.gain.cancelScheduledValues(now);
    out.gain.setValueAtTime(out.gain.value < 0.05 ? 0.4 : out.gain.value, now);

    // ── Layer 1: Bass drone ────────────────────────────────────────────────
    // A minor — root A2 (110 Hz) with LFO wobble
    const droneFreqs = [55, 82.5, 110]; // A1, E2, A2
    droneFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const envGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;
      lfo.type = 'sine';
      lfo.frequency.value = 0.15 + i * 0.05;
      lfoGain.gain.value = freq * 0.012;

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      // Envelope: fade in over 2s, hold, fade out last 2s
      envGain.gain.setValueAtTime(0, now);
      envGain.gain.linearRampToValueAtTime(0.18 - i * 0.04, now + 2);
      envGain.gain.setValueAtTime(0.18 - i * 0.04, now + loopLen - 2);
      envGain.gain.linearRampToValueAtTime(0, now + loopLen);

      osc.connect(envGain);
      envGain.connect(out);
      lfo.start(now);
      osc.start(now);
      lfo.stop(now + loopLen);
      osc.stop(now + loopLen);

      this._musicNodes.push(osc, lfo);
    });

    // ── Layer 2: Chord stabs (triangle wave, muted) ────────────────────────
    // Am - Dm - E7 - Am  (one chord per 2 bars)
    const chords = [
      [220, 261.6, 329.6],   // Am  (A3 C4 E4)
      [293.7, 349.2, 440],   // Dm  (D4 F4 A4)
      [329.6, 415.3, 493.9], // E7  (E4 Ab4 B4)
      [220, 261.6, 329.6],   // Am
    ];
    chords.forEach((chord, ci) => {
      const startTime = now + ci * bar * 2;
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;

        // Short stab: attack 0.08s, decay to 0.02 over the 2 bars
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.04, startTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.005, startTime + bar * 2 - 0.05);
        gain.gain.linearRampToValueAtTime(0, startTime + bar * 2);

        osc.connect(gain);
        gain.connect(out);
        osc.start(startTime);
        osc.stop(startTime + bar * 2);
        this._musicNodes.push(osc);
      });
    });

    // ── Layer 3: Tick / hi-hat (noise bursts on beats 2 & 4) ──────────────
    for (let b = 0; b < 32; b++) {
      const isBeat2or4 = (b % 4 === 1) || (b % 4 === 3);
      if (!isBeat2or4) continue;
      const t = now + b * beat;

      const bufSize = ctx.sampleRate * 0.06;
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);

      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const hpf = ctx.createBiquadFilter();
      hpf.type = 'highpass';
      hpf.frequency.value = 8000;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      src.connect(hpf);
      hpf.connect(gain);
      gain.connect(out);
      src.start(t);
      src.stop(t + 0.07);
      this._musicNodes.push(src);
    }

    // ── Layer 4: Melodic line (flute-like sine, sparse) ───────────────────
    // A simple descending minor pentatonic phrase over bars 3-4 and 7-8
    const melody = [
      // bar 3
      { freq: 440, t: bar * 2, dur: beat * 0.4 },
      { freq: 392, t: bar * 2 + beat * 0.5, dur: beat * 0.4 },
      { freq: 349.2, t: bar * 2 + beat * 1.2, dur: beat * 0.6 },
      { freq: 329.6, t: bar * 2 + beat * 2.1, dur: beat * 1.2 },
      // bar 7
      { freq: 523.25, t: bar * 6, dur: beat * 0.3 },
      { freq: 493.9, t: bar * 6 + beat * 0.4, dur: beat * 0.3 },
      { freq: 440, t: bar * 6 + beat * 0.9, dur: beat * 0.5 },
      { freq: 392, t: bar * 6 + beat * 1.7, dur: beat * 0.7 },
      { freq: 349.2, t: bar * 6 + beat * 2.6, dur: beat * 1.4 },
    ];

    melody.forEach(({ freq, t, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const startT = now + t;
      gain.gain.setValueAtTime(0, startT);
      gain.gain.linearRampToValueAtTime(0.06, startT + 0.04);
      gain.gain.linearRampToValueAtTime(0.04, startT + dur * 0.7);
      gain.gain.linearRampToValueAtTime(0, startT + dur);

      osc.connect(gain);
      gain.connect(out);
      osc.start(startT);
      osc.stop(startT + dur + 0.01);
      this._musicNodes.push(osc);
    });

    // Schedule next loop 100ms before this one ends
    this._musicLoopTimeout = setTimeout(() => {
      this._musicNodes = [];
      this._scheduleLoop();
    }, (loopLen - 0.1) * 1000);
  },

  // -------------------------------------------------------------------------
  // SFX
  // -------------------------------------------------------------------------
  _sfx(fn: (ctx: AudioContext, out: GainNode) => void) {
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    fn(this.ctx, this.sfxGain);
  },

  playBeep() {
    this._sfx((ctx, out) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain); gain.connect(out);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    });
  },

  playScan() {
    this._sfx((ctx, out) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 1.5);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      osc.connect(gain); gain.connect(out);
      osc.start(); osc.stop(ctx.currentTime + 1.5);
    });
  },

  playSuccess() {
    this._sfx((ctx, out) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      osc.connect(gain); gain.connect(out);
      osc.start(); osc.stop(ctx.currentTime + 0.5);
    });
  },

  playChatPing() {
    this._sfx((ctx, out) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain); gain.connect(out);
      osc.start(); osc.stop(ctx.currentTime + 0.2);
    });
  },

  playAccuse() {
    this._sfx((ctx, out) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.5);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      osc.connect(gain); gain.connect(out);
      osc.start(); osc.stop(ctx.currentTime + 1.5);
    });
  },
};
