import type {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'
import {View} from '../View'
import {Point, Size} from '../geometry'

export class Spinner extends View {
  #tick = 0
  #frame = 0
  #frameLen = 1

  constructor(props: ViewProps = {}) {
    super(props)
  }

  naturalSize() {
    return new Size(1, 1)
  }

  receiveTick(dt: number) {
    this.#tick = this.#tick + dt
    if (this.#tick > HZ) {
      this.#tick %= HZ
      this.#frame = (this.#frame + 1) % this.#frameLen
    }

    return true
  }

  render(viewport: Viewport) {
    if (viewport.contentSize.isEmpty()) {
      return
    }

    viewport.registerTick()

    const char = ONE[this.#frame]
    viewport.write(char, Point.zero)
    this.#frameLen = ONE.length
  }
}

const ONE = ['⣾', '⣷', '⣯', '⣟', '⡿', '⢿', '⣻', '⣽'] as const
const HZ = 1000 / 10
