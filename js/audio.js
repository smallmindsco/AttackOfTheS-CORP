// ============================================================
// Attack of the S-Corp - Procedural Audio (Web Audio API)
// ============================================================

class GameAudio {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.volume = 0.3;
        this.musicVolume = 0.15;
        this.initialized = false;

        // Music state
        this._currentMusic = null;
        this._musicTimerId = null;
        this._musicNodes = [];
    }

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            this.enabled = false;
        }
    }

    play(name) {
        if (!this.enabled) return;
        if (!this.initialized) this.init();
        if (!this.ctx) return;

        // Resume context if suspended (browser autoplay policy)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        switch (name) {
            case 'laser':      this._laser(); break;
            case 'explosion':  this._explosion(); break;
            case 'pinkslip':   this._pinkslip(); break;
            case 'assimilate': this._assimilate(); break;
            case 'bosshit':    this._bossHit(); break;
            case 'bossdefeat': this._bossDefeat(); break;
            case 'victory':    this._victory(); break;
            case 'gameover':   this._gameOver(); break;
            case 'wavestart':  this._waveStart(); break;
            case 'bossappear': this._bossAppear(); break;
            case 'recruit':    this._recruit(); break;
        }
    }

    // --- Music system ---

    playMusic(name) {
        if (!this.enabled) return;
        if (!this.initialized) this.init();
        if (!this.ctx) return;
        if (this._currentMusic === name) return; // Already playing

        this.stopMusic();
        this._currentMusic = name;

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        this._scheduleMusic(name);
    }

    stopMusic() {
        this._currentMusic = null;
        if (this._musicTimerId) {
            clearTimeout(this._musicTimerId);
            this._musicTimerId = null;
        }
        // Stop all active music nodes
        for (const node of this._musicNodes) {
            try { node.stop(); } catch (e) { /* already stopped */ }
        }
        this._musicNodes = [];
    }

    _scheduleMusic(name) {
        if (this._currentMusic !== name) return;
        if (!this.ctx) return;

        // Clear previous loop's nodes (they've finished playing by now)
        this._musicNodes = [];

        let loopDuration; // in seconds
        switch (name) {
            case 'title':    loopDuration = this._musicTitle(); break;
            case 'gameplay': loopDuration = this._musicGameplay(); break;
            case 'boss':     loopDuration = this._musicBoss(); break;
            case 'victory':  loopDuration = this._musicVictory(); break;
            case 'gameover': loopDuration = this._musicGameOver(); break;
            default: return;
        }

        // Schedule next loop slightly before current one ends
        this._musicTimerId = setTimeout(() => {
            this._scheduleMusic(name);
        }, (loopDuration - 0.1) * 1000);
    }

    _musicNote(freq, start, duration, type, vol) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const v = (vol || 0.5) * this.musicVolume;
        osc.type = type || 'square';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(v, start);
        gain.gain.setValueAtTime(v, start + duration * 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
        this._musicNodes.push(osc);
        return osc;
    }

    // Title: mysterious, slightly heroic 8-bit loop (A minor, ~4 bars at 120 BPM)
    _musicTitle() {
        const t = this.ctx.currentTime;
        const bpm = 120;
        const beat = 60 / bpm;
        const eighth = beat / 2;

        // Melody (triangle, higher register) - A minor pentatonic
        const melody = [
            440, 0, 523, 0, 587, 523, 440, 0,
            523, 0, 659, 0, 587, 0, 523, 440,
            440, 0, 523, 587, 659, 0, 784, 0,
            659, 587, 523, 0, 440, 0, 0, 0,
        ];
        for (let i = 0; i < melody.length; i++) {
            if (melody[i] > 0) {
                this._musicNote(melody[i], t + i * eighth, eighth * 0.9, 'triangle', 0.5);
            }
        }

        // Bass (square, low register) - root notes
        const bass = [
            220, 0, 0, 0, 220, 0, 0, 0,
            262, 0, 0, 0, 262, 0, 0, 0,
            220, 0, 0, 0, 330, 0, 0, 0,
            262, 0, 220, 0, 220, 0, 0, 0,
        ];
        for (let i = 0; i < bass.length; i++) {
            if (bass[i] > 0) {
                this._musicNote(bass[i], t + i * eighth, eighth * 0.85, 'square', 0.35);
            }
        }

        return melody.length * eighth;
    }

    // Gameplay: upbeat, driving 8-bit loop (C major, ~4 bars at 140 BPM)
    _musicGameplay() {
        const t = this.ctx.currentTime;
        const bpm = 140;
        const beat = 60 / bpm;
        const eighth = beat / 2;

        // Melody (square)
        const melody = [
            523, 0, 587, 659, 784, 0, 659, 0,
            587, 523, 0, 587, 659, 0, 784, 0,
            880, 0, 784, 0, 659, 0, 587, 523,
            587, 659, 523, 0, 523, 0, 0, 0,
        ];
        for (let i = 0; i < melody.length; i++) {
            if (melody[i] > 0) {
                this._musicNote(melody[i], t + i * eighth, eighth * 0.85, 'square', 0.4);
            }
        }

        // Bass (sawtooth, pumping eighth notes)
        const bass = [
            131, 0, 131, 0, 165, 0, 165, 0,
            175, 0, 175, 0, 196, 0, 196, 0,
            220, 0, 220, 0, 196, 0, 175, 0,
            165, 0, 165, 0, 131, 0, 131, 0,
        ];
        for (let i = 0; i < bass.length; i++) {
            if (bass[i] > 0) {
                this._musicNote(bass[i], t + i * eighth, eighth * 0.8, 'sawtooth', 0.35);
            }
        }

        // Percussion: kick on beats via low sine pops
        for (let i = 0; i < 8; i++) {
            const kickStart = t + i * beat;
            const kickOsc = this.ctx.createOscillator();
            const kickGain = this.ctx.createGain();
            kickOsc.type = 'sine';
            kickOsc.frequency.setValueAtTime(150, kickStart);
            kickOsc.frequency.exponentialRampToValueAtTime(30, kickStart + 0.08);
            kickGain.gain.setValueAtTime(this.musicVolume * 0.6, kickStart);
            kickGain.gain.exponentialRampToValueAtTime(0.001, kickStart + 0.1);
            kickOsc.connect(kickGain);
            kickGain.connect(this.ctx.destination);
            kickOsc.start(kickStart);
            kickOsc.stop(kickStart + 0.1);
            this._musicNodes.push(kickOsc);
        }

        return melody.length * eighth;
    }

    // Boss: intense, menacing loop (E minor, ~4 bars at 160 BPM)
    _musicBoss() {
        const t = this.ctx.currentTime;
        const bpm = 160;
        const beat = 60 / bpm;
        const eighth = beat / 2;

        // Melody (sawtooth, aggressive)
        const melody = [
            330, 330, 0, 392, 440, 0, 392, 330,
            0, 330, 392, 440, 494, 0, 440, 0,
            330, 0, 294, 330, 392, 0, 440, 494,
            440, 392, 330, 0, 294, 0, 330, 0,
        ];
        for (let i = 0; i < melody.length; i++) {
            if (melody[i] > 0) {
                this._musicNote(melody[i], t + i * eighth, eighth * 0.85, 'sawtooth', 0.45);
            }
        }

        // Bass (square, driving low E minor pattern)
        const bass = [
            82, 0, 82, 82, 0, 82, 82, 0,
            98, 0, 98, 98, 0, 98, 98, 0,
            110, 0, 110, 110, 0, 110, 82, 0,
            98, 0, 82, 0, 82, 82, 0, 0,
        ];
        for (let i = 0; i < bass.length; i++) {
            if (bass[i] > 0) {
                this._musicNote(bass[i], t + i * eighth, eighth * 0.8, 'square', 0.4);
            }
        }

        // Fast percussion
        for (let i = 0; i < 16; i++) {
            const kickStart = t + i * beat * 0.5;
            const kickOsc = this.ctx.createOscillator();
            const kickGain = this.ctx.createGain();
            kickOsc.type = 'sine';
            kickOsc.frequency.setValueAtTime(180, kickStart);
            kickOsc.frequency.exponentialRampToValueAtTime(25, kickStart + 0.06);
            kickGain.gain.setValueAtTime(this.musicVolume * 0.5, kickStart);
            kickGain.gain.exponentialRampToValueAtTime(0.001, kickStart + 0.08);
            kickOsc.connect(kickGain);
            kickGain.connect(this.ctx.destination);
            kickOsc.start(kickStart);
            kickOsc.stop(kickStart + 0.08);
            this._musicNodes.push(kickOsc);
        }

        return melody.length * eighth;
    }

    // Victory: bright, triumphant loop (C major, ~4 bars at 130 BPM)
    _musicVictory() {
        const t = this.ctx.currentTime;
        const bpm = 130;
        const beat = 60 / bpm;
        const eighth = beat / 2;

        // Melody (triangle, celebratory arpeggios)
        const melody = [
            523, 659, 784, 1047, 784, 659, 523, 0,
            587, 740, 880, 1175, 880, 740, 587, 0,
            659, 784, 1047, 1319, 1047, 784, 659, 0,
            523, 659, 784, 1047, 0, 0, 0, 0,
        ];
        for (let i = 0; i < melody.length; i++) {
            if (melody[i] > 0) {
                this._musicNote(melody[i], t + i * eighth, eighth * 0.9, 'triangle', 0.45);
            }
        }

        // Bass (square, major chord roots)
        const bass = [
            131, 0, 0, 0, 131, 0, 0, 0,
            147, 0, 0, 0, 147, 0, 0, 0,
            165, 0, 0, 0, 165, 0, 0, 0,
            131, 0, 131, 0, 165, 0, 131, 0,
        ];
        for (let i = 0; i < bass.length; i++) {
            if (bass[i] > 0) {
                this._musicNote(bass[i], t + i * eighth, eighth * 0.85, 'square', 0.3);
            }
        }

        return melody.length * eighth;
    }

    // Game Over: slow, somber loop (A minor, ~4 bars at 80 BPM)
    _musicGameOver() {
        const t = this.ctx.currentTime;
        const bpm = 80;
        const beat = 60 / bpm;
        const eighth = beat / 2;

        // Melody (sawtooth, mournful descending phrases)
        const melody = [
            440, 0, 0, 392, 0, 0, 330, 0,
            349, 0, 0, 330, 0, 0, 262, 0,
            294, 0, 0, 262, 0, 0, 220, 0,
            262, 0, 0, 0, 220, 0, 0, 0,
        ];
        for (let i = 0; i < melody.length; i++) {
            if (melody[i] > 0) {
                this._musicNote(melody[i], t + i * eighth, eighth * 1.8, 'sawtooth', 0.35);
            }
        }

        // Bass (triangle, sustained low tones)
        const bass = [
            110, 0, 0, 0, 0, 0, 0, 0,
            87, 0, 0, 0, 0, 0, 0, 0,
            73, 0, 0, 0, 0, 0, 0, 0,
            65, 0, 0, 0, 55, 0, 0, 0,
        ];
        for (let i = 0; i < bass.length; i++) {
            if (bass[i] > 0) {
                this._musicNote(bass[i], t + i * eighth, beat * 1.8, 'triangle', 0.3);
            }
        }

        return melody.length * eighth;
    }

    // --- Sound effects ---

    _createGain(vol) {
        const gain = this.ctx.createGain();
        gain.gain.value = (vol || 1) * this.volume;
        gain.connect(this.ctx.destination);
        return gain;
    }

    // Short high-pitched blip
    _laser() {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this._createGain(0.15);
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(440, t + 0.08);
        gain.gain.setValueAtTime(0.15 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.connect(gain);
        osc.start(t);
        osc.stop(t + 0.08);
    }

    // Noise burst for explosions
    _explosion() {
        const t = this.ctx.currentTime;
        const duration = 0.2;

        // Noise via buffer
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = this._createGain(0.3);
        gain.gain.setValueAtTime(0.3 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        noise.connect(gain);
        noise.start(t);

        // Low thump
        const osc = this.ctx.createOscillator();
        const oscGain = this._createGain(0.4);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + duration);
        oscGain.gain.setValueAtTime(0.4 * this.volume, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        osc.connect(oscGain);
        osc.start(t);
        osc.stop(t + duration);
    }

    // Bright ascending chime
    _pinkslip() {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this._createGain(0.2);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.linearRampToValueAtTime(1200, t + 0.15);
        gain.gain.setValueAtTime(0.2 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.connect(gain);
        osc.start(t);
        osc.stop(t + 0.2);
    }

    // Descending ominous tone
    _assimilate() {
        const t = this.ctx.currentTime;
        for (let i = 0; i < 3; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this._createGain(0.25);
            osc.type = 'sawtooth';
            const start = t + i * 0.12;
            osc.frequency.setValueAtTime(300 - i * 80, start);
            osc.frequency.exponentialRampToValueAtTime(60, start + 0.15);
            gain.gain.setValueAtTime(0.25 * this.volume, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
            osc.connect(gain);
            osc.start(start);
            osc.stop(start + 0.15);
        }
    }

    // Metallic hit
    _bossHit() {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this._createGain(0.25);
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.1);
        gain.gain.setValueAtTime(0.25 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(gain);
        osc.start(t);
        osc.stop(t + 0.15);
    }

    // Big descending cascade
    _bossDefeat() {
        const t = this.ctx.currentTime;
        for (let i = 0; i < 8; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this._createGain(0.3);
            const start = t + i * 0.1;
            osc.type = i % 2 === 0 ? 'square' : 'sawtooth';
            osc.frequency.setValueAtTime(800 - i * 80, start);
            osc.frequency.exponentialRampToValueAtTime(40, start + 0.3);
            gain.gain.setValueAtTime(0.3 * this.volume, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
            osc.connect(gain);
            osc.start(start);
            osc.stop(start + 0.3);
        }
    }

    // Triumphant ascending fanfare
    _victory() {
        const t = this.ctx.currentTime;
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        for (let i = 0; i < notes.length; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this._createGain(0.2);
            const start = t + i * 0.2;
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(notes[i], start);
            gain.gain.setValueAtTime(0.2 * this.volume, start);
            gain.gain.setValueAtTime(0.2 * this.volume, start + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
            osc.connect(gain);
            osc.start(start);
            osc.stop(start + 0.35);
        }
    }

    // Sad descending tones
    _gameOver() {
        const t = this.ctx.currentTime;
        const notes = [392, 349, 330, 262]; // G4, F4, E4, C4
        for (let i = 0; i < notes.length; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this._createGain(0.25);
            const start = t + i * 0.3;
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(notes[i], start);
            gain.gain.setValueAtTime(0.25 * this.volume, start);
            gain.gain.setValueAtTime(0.25 * this.volume, start + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
            osc.connect(gain);
            osc.start(start);
            osc.stop(start + 0.4);
        }
    }

    // Quick ascending arpeggio for wave clear
    _waveStart() {
        const t = this.ctx.currentTime;
        const notes = [440, 554, 659]; // A4, C#5, E5
        for (let i = 0; i < notes.length; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this._createGain(0.15);
            const start = t + i * 0.08;
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(notes[i], start);
            gain.gain.setValueAtTime(0.15 * this.volume, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
            osc.connect(gain);
            osc.start(start);
            osc.stop(start + 0.15);
        }
    }

    // Ominous low rumble for boss appearance
    _bossAppear() {
        const t = this.ctx.currentTime;
        for (let i = 0; i < 4; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this._createGain(0.3);
            const start = t + i * 0.2;
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(80 + i * 10, start);
            osc.frequency.linearRampToValueAtTime(40, start + 0.3);
            gain.gain.setValueAtTime(0.3 * this.volume, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
            osc.connect(gain);
            osc.start(start);
            osc.stop(start + 0.3);
        }
    }

    // Warning buzz for recruitment attempt
    _recruit() {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this._createGain(0.2);
        osc.type = 'square';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.linearRampToValueAtTime(120, t + 0.15);
        gain.gain.setValueAtTime(0.2 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(gain);
        osc.start(t);
        osc.stop(t + 0.15);
    }
}

// Create global audio instance
window.gameAudio = new GameAudio();
