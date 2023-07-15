import type {BlessedProgram} from './sys'
import {StringDecoder} from 'string_decoder'

import type {Color} from './ansi'
import {colorToHex} from './ansi'

let _restoreBg: string | undefined

/**
 * Sets iTerm2 proprietary ANSI codes
 */
export class iTerm2 {
  static async setBackground(program: BlessedProgram, bg: Color) {
    process.on('exit', () => {
      iTerm2.restoreBg(program)
    })

    return new Promise(resolve => {
      const hex = colorToHex(bg).slice(1)

      program.once('data', (input: any) => {
        const decoder = new StringDecoder('utf8')
        const response = decoder.write(input)
        _restoreBg = parseBackgroundResponse(response)

        program.write(setBackgroundCommand(hex))
        resolve(void 0)
      })

      program.write(getBackgroundColorCommand())
    })
  }

  static restoreBg(program: BlessedProgram) {
    if (_restoreBg) {
      program.write(setBackgroundCommand(_restoreBg))
    }
  }
}

function getBackgroundColorCommand() {
  return '\x1b]4;-2;?\x07'
}

function parseBackgroundResponse(response: string): string | undefined {
  const match = response.match(/\x1b\]4;-2;rgb:(\w{2})\w*\/(\w{2})\w*\/(\w{2})/)
  if (match) {
    return match[1] + match[2] + match[3]
  }
}

/**
 * @param rgb should not include the '#' symbol
 */
function setBackgroundCommand(rgb: string): string {
  return `\x1b]Ph${rgb.replace('#', '')}\x1b\\`
}
