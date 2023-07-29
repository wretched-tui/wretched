import type {BlessedProgram} from '../sys'

import {iTerm2} from '../iTerm2'
import {interceptConsoleLog} from '../log'

import {Screen} from '../Screen'
import {ConsoleLog, Box, Text} from '../components'

async function run() {
  interceptConsoleLog()
  process.title = 'Wretched'

  const consoleLog = new ConsoleLog({
    minHeight: 10,
  })
  const [screen, program] = await Screen.start(
    async (program: BlessedProgram) => {
      await iTerm2.setBackground(program, [23, 23, 23])

      return new Box({
        border: 'popout',
        width: 10,
        height: 5,
        content: new Text({text: ''}),
      })
    },
  )

  program.key('escape', function () {
    consoleLog.clear()
    screen.render()
  })
}

run()
