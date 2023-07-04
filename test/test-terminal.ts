import type {Terminal, Color} from '../lib/types'

export class TestTerminal implements Terminal {
  chars = ''
  setForeground(fg: Color) {}
  setBackground(bg: Color) {}
  move(x: number, y: number) {
    this.x = x
  }
  write(str: string) {
    console.log(`x: ${this.x}, y: ${this.y}: ${str}`)
  }

  cols: number = 5
  rows: number = 1
  x: number = 0
  y: number = 0
}
