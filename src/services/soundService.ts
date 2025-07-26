import type { SoundType } from '@/types'

export class SoundService {
  private soundEnabled = true
  private sounds: Record<SoundType, () => void> = {} as Record<SoundType, () => void>

  constructor() {
    this.initializeSounds()
    this.loadSoundSettings()
  }

  private initializeSounds() {
    // Load audio files for different achievement levels
    this.sounds = {
      smallWin: this.createAudioSound('/assets/small win.mp3'),
      mediumWin: this.createAudioSound('/assets/medium win.mp3'),
      bigWin: this.createAudioSound('/assets/big win.mp3'),
      biggestWin: this.createAudioSound('/assets/Big win 2.mp3'),
      click: this.createToneSound(440, 0.1), // Keep tone for click sound
    }
  }

  private createToneSound(frequency: number, duration: number) {
    return () => {
      if (!this.soundEnabled) return

      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const audioContext = new AudioContextClass()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = frequency
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration)
      } catch {
        console.log('Sound not supported in this browser')
      }
    }
  }

  private createAudioSound(audioPath: string) {
    return () => {
      if (!this.soundEnabled) return

      try {
        const audio = new Audio(audioPath)
        audio.volume = 0.5 // Set volume to 50%
        audio.play().catch(() => {
          console.log('Audio playback failed')
        })
      } catch {
        console.log('Audio file not found or not supported')
      }
    }
  }

  playSound(soundType: SoundType) {
    if (this.soundEnabled && this.sounds[soundType]) {
      this.sounds[soundType]()
    }
  }

  toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled
    this.saveSoundSettings()

    // Play a test sound when enabling
    if (this.soundEnabled) {
      this.playSound('click')
    }

    return this.soundEnabled
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled
  }

  private loadSoundSettings() {
    const soundEnabled = localStorage.getItem('javaStudySound')
    this.soundEnabled = soundEnabled !== null ? JSON.parse(soundEnabled) : true
  }

  private saveSoundSettings() {
    localStorage.setItem('javaStudySound', JSON.stringify(this.soundEnabled))
  }
}

export const soundService = new SoundService()
