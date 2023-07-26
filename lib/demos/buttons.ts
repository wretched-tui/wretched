import type {BlessedProgram} from '../sys'
import type {MouseEvent} from '../events'
import type {Props as ViewProps} from '../View'

import {iTerm2} from '../iTerm2'
import {interceptConsoleLog} from '../log'

import {Screen} from '../Screen'
import {Style} from '../Style'
import {Container} from '../Container'
import {Viewport} from '../Viewport'
import {View} from '../View'
import {Point, Size, Rect} from '../geometry'

import {TrackMouse} from '../components/utility'
import {
  Box,
  Button,
  LargeButton,
  ConsoleLog,
  Drawer,
  Dropdown,
  Flex,
  Flow,
  Input,
  Separator,
  Space,
  Text,
} from '../components'

async function run() {
  process.title = 'Wretched'

  const consoleLog = new ConsoleLog({
    minHeight: 10,
  })
  const [screen, program] = await Screen.start(
    async (program: BlessedProgram) => {
      await iTerm2.setBackground(program, [23, 23, 23])

      return new TrackMouse({
        content: new Flex({
          direction: 'topToBottom',
          children: [
            new Separator({
              direction: 'horizontal',
              border: 'trailing',
              padding: 1,
            }),

            ['flex1', new Space()],
            new LargeButton({
              height: 3,
              theme: 'primary',
              text: 'Launch',
            }),

            ['flex1', new Space()],
            new LargeButton({
              height: 3,
              theme: 'proceed',
              text: 'Proceed',
            }),

            ['flex1', new Space()],
            new LargeButton({
              height: 3,
              theme: 'cancel',
              text: 'Cancel',
            }),

            ['flex1', new Space()],
            new LargeButton({
              height: 3,
              theme: 'secondary',
              text: 'Do it!',
            }),

            ['flex1', new Space()],
            new Button({theme: 'plain', height: 3, text: 'Do it!'}),
            new Button({theme: 'selected', height: 3, text: 'Do it!'}),
            ['flex1', new Space()],
            new Separator({
              direction: 'horizontal',
              border: 'trailing',
              padding: 1,
            }),
          ],
        }),
      })
    },
  )

  interceptConsoleLog()

  program.key('escape', function () {
    consoleLog.clear()
    screen.render()
  })
}

run()
