import {iTerm2} from 'wretched'
import {interceptConsoleLog} from 'wretched'

import type {View} from 'wretched'
import {Screen} from 'wretched'
import {TrackMouse} from 'wretched'
import {ConsoleLog, Flex, Window} from 'wretched'

export async function demo(demoContent: View, showConsoleLog = true) {
  process.title = 'Wretched'

  const consoleLog = new ConsoleLog({
    height: 10,
  })
  const [screen, program] = await Screen.start(
    async program => {
      await iTerm2.setBackground(program, [23, 23, 23])
      interceptConsoleLog()

      return new Window({
        child: new TrackMouse({
          content: Flex.down({
            children: showConsoleLog
              ? [
                  ['flex1', demoContent],
                  ['natural', consoleLog],
                ]
              : [['flex1', demoContent]],
          }),
        }),
      })
    },
    {quitChar: 'q'},
  )

  program.key('escape', function () {
    consoleLog.clear()
    screen.render()
  })
}
