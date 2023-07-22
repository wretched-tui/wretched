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
      await iTerm2.setBackground(program, [57, 57, 57])

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
            new Button({
              height: 3,
              type: 'primary',
              text: 'Launch',
            }),

            ['flex1', new Space()],
            new Button({
              height: 3,
              type: 'confirm',
              text: 'Cancel',
            }),

            ['flex1', new Space()],
            new Button({
              height: 3,
              type: 'destroy',
              text: 'The Usual',
            }),

            ['flex1', new Space()],
            new Button({
              height: 3,
              type: 'secondary',
              text: 'Do it!',
            }),

            ['flex1', new Space()],
            new Button({height: 3, type: 'plain', text: 'Do it!'}),
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
