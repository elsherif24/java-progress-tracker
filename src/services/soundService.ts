import type { SoundType } from "@/types";

export class SoundService {
  private soundEnabled = true;
  private sounds: Record<SoundType, () => void> = {} as Record<
    SoundType,
    () => void
  >;

  constructor() {
    this.initializeSounds();
    this.loadSoundSettings();
  }

  private initializeSounds() {
    // Load audio files with correct paths from /public/assets/
    this.sounds = {
      smallWin: this.createAudioSound("/assets/small-win.mp3"),
      mediumWin: this.createAudioSound("/assets/medium-win.mp3"),
      bigWin: this.createAudioSound("/assets/big-win1.mp3"),
      biggestWin: this.createAudioSound("/assets/big-win2.mp3"),
      click: this.createToneSound(440, 0.1),
      pageComplete: this.createAudioSound("/assets/big-win1.mp3"), // big-win1 for completing all pages
      problemComplete: this.createAudioSound("/assets/big-win1.mp3"), // big-win1 for completing all problems
      mcqComplete: this.createAudioSound("/assets/medium-win.mp3"),
      chapterStart: this.createAudioSound("/assets/small-win.mp3"),
      chapterComplete: this.createAudioSound("/assets/big-win2.mp3"),
      pageProgress: this.createAudioSound("/assets/small-win.mp3"), // small-win for page progress every 5 pages
    };

    // Test audio files are accessible
    this.testAudioFiles();
  }

  private testAudioFiles() {
    const audioFiles = [
      "/assets/small-win.mp3",
      "/assets/medium-win.mp3",
      "/assets/big-win1.mp3",
      "/assets/big-win2.mp3",
    ];

    audioFiles.forEach((file) => {
      const audio = new Audio();
      audio.src = file;
      audio.addEventListener("error", () => {
        console.warn(`Audio file not found: ${file}`);
      });
    });
  }

  private createToneSound(frequency: number, duration: number) {
    return () => {
      if (!this.soundEnabled) return;

      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0.3,
          audioContext.currentTime + 0.01,
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + duration,
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      } catch (error) {
        console.log("Sound not supported in this browser:", error);
      }
    };
  }

  private createAudioSound(audioPath: string) {
    return () => {
      if (!this.soundEnabled) {
        return;
      }

      try {
        // Create a new Audio instance each time to avoid conflicts
        const audio = new Audio();
        audio.volume = 0.7; // Set volume to 70%
        audio.preload = "auto";
        audio.src = audioPath;

        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Audio played successfully
            })
            .catch((error) => {
              console.warn("Audio playback failed:", error);
            });
        }
      } catch (error) {
        console.warn("Audio creation failed:", error);
      }
    };
  }

  playSound(soundType: SoundType) {
    if (!this.soundEnabled) {
      return;
    }

    if (!this.sounds[soundType]) {
      console.warn(`Sound not found: ${soundType}`);
      return;
    }

    // Add a small delay to prevent audio conflicts
    setTimeout(() => {
      this.sounds[soundType]();
    }, 10);
  }

  // Play sound for completing ALL pages in a chapter
  playAllPagesCompleteSound() {
    this.playSound("pageComplete");
  }

  // Play sound for completing ALL problems in a chapter
  playAllProblemsCompleteSound() {
    this.playSound("problemComplete");
  }

  // Play sound for page progress (every 5 pages)
  playPageProgressSound() {
    this.playSound("pageProgress");
  }

  // Play sound for MCQ completion
  playMcqMilestoneSound() {
    this.playSound("mcqComplete");
  }

  // Play sound for starting a chapter
  playChapterStartSound() {
    this.playSound("chapterStart");
  }

  // Play sound for completing a chapter
  playChapterCompleteSound() {
    this.playSound("chapterComplete");
  }

  // Play sound for small achievements
  playSmallWinSound() {
    this.playSound("smallWin");
  }

  toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    this.saveSoundSettings();

    // Play a test sound when enabling
    if (this.soundEnabled) {
      this.playSound("click");
    }

    return this.soundEnabled;
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  private loadSoundSettings() {
    const soundEnabled = localStorage.getItem("javaStudySound");
    this.soundEnabled = soundEnabled !== null ? JSON.parse(soundEnabled) : true;
  }

  private saveSoundSettings() {
    localStorage.setItem("javaStudySound", JSON.stringify(this.soundEnabled));
  }
}

export const soundService = new SoundService();
