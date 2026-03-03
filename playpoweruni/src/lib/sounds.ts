// Simple sound effects using Web Audio API
export class SoundManager {
  private audioContext: AudioContext | null = null
  private enabled = true

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  playSound(type: 'click' | 'success' | 'error' | 'complete') {
    if (!this.enabled || !this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    const currentTime = this.audioContext.currentTime

    switch (type) {
      case 'click':
        oscillator.frequency.setValueAtTime(600, currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(400, currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.3, currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1)
        oscillator.start(currentTime)
        oscillator.stop(currentTime + 0.1)
        break

      case 'success':
        oscillator.frequency.setValueAtTime(523.25, currentTime) // C5
        oscillator.frequency.setValueAtTime(659.25, currentTime + 0.1) // E5
        oscillator.frequency.setValueAtTime(783.99, currentTime + 0.2) // G5
        gainNode.gain.setValueAtTime(0.3, currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.3)
        oscillator.start(currentTime)
        oscillator.stop(currentTime + 0.3)
        break

      case 'error':
        oscillator.frequency.setValueAtTime(300, currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(200, currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.3, currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.2)
        oscillator.start(currentTime)
        oscillator.stop(currentTime + 0.2)
        break

      case 'complete':
        oscillator.frequency.setValueAtTime(523.25, currentTime) // C5
        oscillator.frequency.setValueAtTime(659.25, currentTime + 0.1) // E5
        oscillator.frequency.setValueAtTime(783.99, currentTime + 0.2) // G5
        oscillator.frequency.setValueAtTime(1046.50, currentTime + 0.3) // C6
        gainNode.gain.setValueAtTime(0.3, currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.5)
        oscillator.start(currentTime)
        oscillator.stop(currentTime + 0.5)
        break
    }
  }

  toggleEnabled() {
    this.enabled = !this.enabled
    return this.enabled
  }

  isEnabled() {
    return this.enabled
  }
}

export const soundManager = new SoundManager()