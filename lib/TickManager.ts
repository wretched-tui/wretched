import {View} from './View'
import type {KeyEvent} from './events'

export class TickManager {
  #render: () => void
  #tickTimer: ReturnType<typeof setInterval> | undefined
  #tickViews: Set<View> = new Set()

  constructor(render: () => void) {
    this.#render = render
  }

  reset() {
    this.#tickViews = new Set()
  }

  endRender() {
    if (!this.#tickViews.size && this.#tickTimer) {
      this.#stop()
    } else if (this.#tickViews.size && !this.#tickTimer) {
      this.#start()
    }
  }

  stop() {
    this.#stop()
  }

  #start() {
    if (this.#tickTimer) {
      return
    }

    let prevTime = Date.now()
    this.#tickTimer = setInterval(() => {
      const nextTime = Date.now()
      this.triggerTick(nextTime - (prevTime ?? nextTime))
      prevTime = nextTime
    }, 16)
  }

  #stop() {
    if (!this.#tickTimer) {
      return
    }

    clearInterval(this.#tickTimer)
    this.#tickTimer = undefined
  }

  registerTick(view: View) {
    this.#tickViews.add(view)
  }

  triggerTick(dt: number) {
    let needsRender = false
    for (const view of this.#tickViews) {
      needsRender = Boolean(view.receiveTick(dt)) || needsRender
    }

    if (needsRender) {
      this.#render()
    }
  }
}
