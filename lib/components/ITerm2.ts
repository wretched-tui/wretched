import {StringDecoder} from 'string_decoder'

import type {Viewport} from '../Viewport'
import {View} from '../View'
import {Screen} from '../Screen'
import {Size} from '../geometry'
import type {Color} from '../ansi'
import {colorToHex} from '../ansi'

interface Props {
  bg?: Color
}

/**
 * Sets iTerm2 proprietary ANSI codes
 */
export class ITerm2 extends View {
  bg?: string
  restoreBg?: string

  constructor({bg}: Props) {
    super()
    this.bg = bg ? colorToHex(bg).slice(1) : undefined
  }

  didMount(screen: Screen) {
    screen.program.once('data', (input: any) => {
      const decoder = new StringDecoder('utf8')
      const response = decoder.write(input)
      this.restoreBg = this.#parseBackgroundResponse(response)

      if (this.bg) {
        screen.program.write(this.#setBackgroundCommand(this.bg))
      }
    })
    screen.program.write(this.#getBackgroundColorCommand())
  }

  didUnmount(prev: Screen) {
    if (this.restoreBg) {
      prev.program.write(this.#setBackgroundCommand(this.restoreBg))
    }
  }

  #getBackgroundColorCommand() {
    return '\x1b]4;-2;?\x07'
  }

  #parseBackgroundResponse(response: string): string | undefined {
    const match = response.match(
      /\x1b\]4;-2;rgb:(\w{2})\w*\/(\w{2})\w*\/(\w{2})/,
    )
    if (match) {
      return match[1] + match[2] + match[3]
    }
  }

  /**
   * @param rgb should not include the '#' symbol
   */
  #setBackgroundCommand(rgb: string): string {
    return `\x1b]Ph${rgb.replace('#', '')}\x1b\\`
  }

  intrinsicSize(): Size {
    return Size.zero
  }

  render() {}
}
