import type {BlessedProgram} from '../sys'

import {iTerm2} from '../iTerm2'
import {interceptConsoleLog} from '../log'

import type {View} from '../View'
import {Screen} from '../Screen'
import {TrackMouse} from '../components/utility'
import {ConsoleLog, Flex, Window} from '../components'

export async function demo(demoContent: View) {
  interceptConsoleLog()
  process.title = 'Wretched'

  const consoleLog = new ConsoleLog({
    height: 10,
  })
  const [screen, program] = await Screen.start(
    async (program: BlessedProgram) => {
      await iTerm2.setBackground(program, [23, 23, 23])

      return new Window({
        child: new TrackMouse({
          content: Flex.down({
            children: [
              ['flex1', demoContent],
              ['natural', consoleLog],
            ],
          }),
        }),
      })
    },
  )

  program.key('escape', function () {
    consoleLog.clear()
    screen.render()
  })
}
