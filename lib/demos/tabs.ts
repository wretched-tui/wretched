import type {BlessedProgram} from '../sys'

import {iTerm2} from '../iTerm2'
import {interceptConsoleLog} from '../log'

import {Screen} from '../Screen'
import {Text, Flow} from '../components'
import {Size} from '../geometry'
import {View} from '../View'
import {Viewport} from '../Viewport'

function run() {
  interceptConsoleLog()
  process.title = 'Wretched'
  const [screen, program] = Screen.start((program: BlessedProgram) => {
    iTerm2.setBackground(program, [23, 23, 23])

    return new AnimatedText({frames: animations})
  })
}

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

  receiveTick(dt: number) {
    this.#frameTime += dt
    if (this.#frameTime > AnimatedText.FRAME) {
      this.#frameTime %= AnimatedText.FRAME
      this.#frame = (this.#frame + 1) % this.#frames.length
      return true
    }
  }

  render(viewport: Viewport) {
    viewport.registerTick()

    const t = new Text({text: this.#frames[this.#frame]})
    t.render(viewport)
  }
}

run()

const animations = [
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
───╴━━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
──╴━━━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
─╴━━━━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
╴━━━━━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━━━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━━━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━━━━━╶─────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━━━━╶──────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━━━╶───────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━━╶────────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━╶─────────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━╶─────────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━╶─────────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━╶─────────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━╶─────────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━╶─────────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━╶─────────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━╶─────────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━╶─────────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━╶─────────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━━╶────────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━━━╶───────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━━━━╶──────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━━━━━╶─────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━━━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
━━━━━━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
╴━━━━━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
─╴━━━━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
──╴━━━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
───╴━━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━━╶───`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━━━╶──`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━━━━╶─`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━━━━━╶`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━━━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━━━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
─────╴━━━━━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
──────╴━━━━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
───────╴━━━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
────────╴━━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
─────────╴━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
─────────╴━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
─────────╴━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
─────────╴━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
─────────╴━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
─────────╴━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
─────────╴━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
─────────╴━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
─────────╴━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
────────╴━━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
───────╴━━━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
──────╴━━━━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
─────╴━━━━━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━━━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━━━━━━`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━━━━━╶`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━━━━╶─`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━━━╶──`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━━╶───`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
  `
Tab1 Tab2 Tab3
────╴━━━━╶────`.slice(1),
]
