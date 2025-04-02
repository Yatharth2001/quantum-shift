export class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private audioContext: AudioContext | null = null;
  private failedSounds: Set<string> = new Set();
  private musicVolume: number = 0.3;
  private sfxVolume: number = 0.5;
  private isInitialized: boolean = false;

  constructor() {
    this.initializeAudioContext();
    this.initializeSounds();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn("AudioContext not supported:", error);
    }
  }

  private generateSyntheticSound(
    type: "realityShift" | "timeReverse" | "puzzleSolved"
  ) {
    if (!this.audioContext) return null;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    switch (type) {
      case "realityShift":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(
          600,
          this.audioContext.currentTime + 0.2
        );
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0,
          this.audioContext.currentTime + 0.3
        );
        break;

      case "timeReverse":
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(
          100,
          this.audioContext.currentTime + 0.4
        );
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0,
          this.audioContext.currentTime + 0.5
        );
        break;

      case "puzzleSolved":
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(
          600,
          this.audioContext.currentTime + 0.1
        );
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0,
          this.audioContext.currentTime + 0.2
        );
        break;
    }

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    return { oscillator, gainNode };
  }

  private async initializeSounds() {
    const soundFiles = {
      realityShift: "/sounds/reality-shift.mp3",
      timeReverse: "/sounds/time-reverse.mp3",
      puzzleSolved: "/sounds/puzzle-solved.mp3",
      quantumBg: "/sounds/quantum-ambient.mp3",
      normalBg: "/sounds/normal-ambient.mp3",
    };

    for (const [key, path] of Object.entries(soundFiles)) {
      try {
        const audio = new Audio();
        audio.src = path;

        await new Promise((resolve, reject) => {
          audio.addEventListener("canplaythrough", resolve, { once: true });
          audio.addEventListener("error", reject, { once: true });
          audio.load();
        });

        if (key.includes("Bg")) {
          audio.loop = true;
          audio.volume = this.musicVolume;
        } else {
          audio.volume = this.sfxVolume;
        }

        this.sounds.set(key, audio);
      } catch (error) {
        console.warn(`Using synthetic fallback for sound: ${key}`);
        this.failedSounds.add(key);
      }
    }

    this.isInitialized = true;
  }

  playSound(name: string) {
    // Try playing recorded sound first
    const sound = this.sounds.get(name);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch((e) => {
        console.warn("Sound playback failed:", e);
        this.failedSounds.add(name);

        // Try synthetic fallback
        if (!name.includes("Bg")) {
          const synthetic = this.generateSyntheticSound(name as any);
          if (synthetic) {
            synthetic.oscillator.start();
            synthetic.oscillator.stop(this.audioContext!.currentTime + 0.5);
          }
        }
      });
      return;
    }

    // Fall back to synthetic sound if available
    if (this.failedSounds.has(name) && !name.includes("Bg")) {
      const synthetic = this.generateSyntheticSound(name as any);
      if (synthetic) {
        synthetic.oscillator.start();
        synthetic.oscillator.stop(this.audioContext!.currentTime + 0.5);
      }
    }
  }

  stopSound(name: string) {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  async switchBackgroundMusic(reality: "normal" | "quantum") {
    await this.waitForInitialization();

    this.stopSound("normalBg");
    this.stopSound("quantumBg");
    this.playSound(`${reality}Bg`);
  }

  setMusicVolume(volume: number) {
    this.musicVolume = volume;
    this.sounds.forEach((sound, key) => {
      if (key.includes("Bg") && !this.failedSounds.has(key)) {
        sound.volume = volume;
      }
    });
  }

  setSFXVolume(volume: number) {
    this.sfxVolume = volume;
    this.sounds.forEach((sound, key) => {
      if (!key.includes("Bg") && !this.failedSounds.has(key)) {
        sound.volume = volume;
      }
    });
  }

  async waitForInitialization() {
    if (this.isInitialized) return;
    await new Promise((resolve) => {
      const checkInit = () => {
        if (this.isInitialized) {
          resolve(true);
        } else {
          setTimeout(checkInit, 100);
        }
      };
      checkInit();
    });
  }

  getFailedSounds() {
    return Array.from(this.failedSounds);
  }

  isReady() {
    return this.isInitialized;
  }
}

export const soundManager = new SoundManager();
