import {Text} from '../components'
import {Size} from '../geometry'
import {View} from '../View'
import {Viewport} from '../Viewport'

import {demo} from './demo'

class AnimatedText extends View {
  #frameTime = 0
  #frame = 0
  #frames: string[]

  static FRAME = 32

  constructor({frames}: {frames: string[]}) {
    super({
      x: 10,
      y: 4,
      width: 14,
      height: 2,
    })

    this.#frames = frames
  }

  naturalSize() {
    return new Size(14, 2)
  }

  receiveTick(dt: number): boolean {
    this.#frameTime += dt
    if (this.#frameTime > AnimatedText.FRAME) {
      this.#frameTime %= AnimatedText.FRAME
      this.#frame = (this.#frame + 1) % this.#frames.length
      return true
    }

    return false
  }

  render(viewport: Viewport) {
    viewport.registerTick()

    const t = new Text({text: this.#frames[this.#frame]})
    t.render(viewport)
  }
}

const frames = [
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
  `
Tab1 Tab2 Tab3
───╴━━━━━╶────`,
  `
Tab1 Tab2 Tab3
──╴━━━━━━╶────`,
  `
Tab1 Tab2 Tab3
─╴━━━━━━━╶────`,
  `
Tab1 Tab2 Tab3
╴━━━━━━━━╶────`,
  `
Tab1 Tab2 Tab3
━━━━━━━━━╶────`,
  `
Tab1 Tab2 Tab3
━━━━━━━━━╶────`,
  `
Tab1 Tab2 Tab3
━━━━━━━━╶─────`,
  `
Tab1 Tab2 Tab3
━━━━━━━╶──────`,
  `
Tab1 Tab2 Tab3
━━━━━━╶───────`,
  `
Tab1 Tab2 Tab3
━━━━━╶────────`,
  `
Tab1 Tab2 Tab3
━━━━╶─────────`,
  `
Tab1 Tab2 Tab3
━━━━╶─────────`,
  `
Tab1 Tab2 Tab3
━━━━╶─────────`,
  `
Tab1 Tab2 Tab3
━━━━╶─────────`,
  `
Tab1 Tab2 Tab3
━━━━╶─────────`,
  `
Tab1 Tab2 Tab3
━━━━╶─────────`,
  `
Tab1 Tab2 Tab3
━━━━╶─────────`,
  `
Tab1 Tab2 Tab3
━━━━╶─────────`,
  `
Tab1 Tab2 Tab3
━━━━╶─────────`,
  `
Tab1 Tab2 Tab3
━━━━╶─────────`,
  `
Tab1 Tab2 Tab3
━━━━━╶────────`,
  `
Tab1 Tab2 Tab3
━━━━━━╶───────`,
  `
Tab1 Tab2 Tab3
━━━━━━━╶──────`,
  `
Tab1 Tab2 Tab3
━━━━━━━━╶─────`,
  `
Tab1 Tab2 Tab3
━━━━━━━━━╶────`,
  `
Tab1 Tab2 Tab3
━━━━━━━━━╶────`,
  `
Tab1 Tab2 Tab3
╴━━━━━━━━╶────`,
  `
Tab1 Tab2 Tab3
─╴━━━━━━━╶────`,
  `
Tab1 Tab2 Tab3
──╴━━━━━━╶────`,
  `
Tab1 Tab2 Tab3
───╴━━━━━╶────`,
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
  `
Tab1 Tab2 Tab3
────╴━━━━━╶───`,
  `
Tab1 Tab2 Tab3
────╴━━━━━━╶──`,
  `
Tab1 Tab2 Tab3
────╴━━━━━━━╶─`,
  `
Tab1 Tab2 Tab3
────╴━━━━━━━━╶`,
  `
Tab1 Tab2 Tab3
────╴━━━━━━━━━`,
  `
Tab1 Tab2 Tab3
────╴━━━━━━━━━`,
  `
Tab1 Tab2 Tab3
─────╴━━━━━━━━`,
  `
Tab1 Tab2 Tab3
──────╴━━━━━━━`,
  `
Tab1 Tab2 Tab3
───────╴━━━━━━`,
  `
Tab1 Tab2 Tab3
────────╴━━━━━`,
  `
Tab1 Tab2 Tab3
─────────╴━━━━`,
  `
Tab1 Tab2 Tab3
─────────╴━━━━`,
  `
Tab1 Tab2 Tab3
─────────╴━━━━`,
  `
Tab1 Tab2 Tab3
─────────╴━━━━`,
  `
Tab1 Tab2 Tab3
─────────╴━━━━`,
  `
Tab1 Tab2 Tab3
─────────╴━━━━`,
  `
Tab1 Tab2 Tab3
─────────╴━━━━`,
  `
Tab1 Tab2 Tab3
─────────╴━━━━`,
  `
Tab1 Tab2 Tab3
─────────╴━━━━`,
  `
Tab1 Tab2 Tab3
────────╴━━━━━`,
  `
Tab1 Tab2 Tab3
───────╴━━━━━━`,
  `
Tab1 Tab2 Tab3
──────╴━━━━━━━`,
  `
Tab1 Tab2 Tab3
─────╴━━━━━━━━`,
  `
Tab1 Tab2 Tab3
────╴━━━━━━━━━`,
  `
Tab1 Tab2 Tab3
────╴━━━━━━━━━`,
  `
Tab1 Tab2 Tab3
────╴━━━━━━━━╶`,
  `
Tab1 Tab2 Tab3
────╴━━━━━━━╶─`,
  `
Tab1 Tab2 Tab3
────╴━━━━━━╶──`,
  `
Tab1 Tab2 Tab3
────╴━━━━━╶───`,
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`,
].map(t => t.slice(1))

demo(new AnimatedText({frames}))
