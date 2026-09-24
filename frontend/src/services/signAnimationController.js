export class SignAnimationController {
  constructor({ sequence = [], speed = 1, onUpdate }) {
    this.sequence = sequence
    this.speed = speed
    this.onUpdate = onUpdate
    this.index = 0
    this.timer = null
    this.isPlaying = false
  }

  emit(stateOverride = {}) {
    const active = this.sequence[this.index] || ''
    const payload = {
      sign: active,
      index: this.index,
      status: this.isPlaying ? 'Playing' : 'Paused',
      ...stateOverride,
    }

    this.onUpdate?.(payload)
  }

  _scheduleNext() {
    if (!this.sequence.length) return
    clearTimeout(this.timer)

    const duration = (1600 / this.speed) || 1600

    this.timer = setTimeout(() => {
      if (!this.isPlaying) return

      if (this.index >= this.sequence.length - 1) {
        this.isPlaying = false
        this.emit({ status: 'Completed' })
        return
      }

      this.index += 1
      this.emit({ status: 'Playing' })
      this._scheduleNext()
    }, duration)
  }

  play() {
    if (!this.sequence.length) return
    this.isPlaying = true
    this.emit({ status: 'Playing' })
    this._scheduleNext()
  }

  pause() {
    if (!this.sequence.length) return
    this.isPlaying = false
    clearTimeout(this.timer)
    this.emit({ status: 'Paused' })
  }

  resume() {
    if (!this.sequence.length) return
    this.isPlaying = true
    this.emit({ status: 'Playing' })
    this._scheduleNext()
  }

  stop() {
    this.isPlaying = false
    clearTimeout(this.timer)
    this.index = 0
    this.emit({ sign: '', index: 0, status: 'Stopped' })
  }

  replay() {
    this.index = 0
    this.play()
  }

  setSpeed(speed = 1) {
    this.speed = speed
    if (this.isPlaying) {
      this._scheduleNext()
    }
  }
}
