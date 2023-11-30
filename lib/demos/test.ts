import type {BlessedProgram} from '../sys'

import {iTerm2} from '../iTerm2'
import {interceptConsoleLog} from '../log'

import {Screen} from '../Screen'
import {type View} from '../View'

import {TrackMouse} from '../components/utility'
import {Button, ConsoleLog, Flex, Separator, Space} from '../components'

function run() {
  process.title = 'Wretched'

  const consoleLog = new ConsoleLog({
    minHeight: 10,
  })
  const [screen, program] = Screen.start((program: BlessedProgram) => {
    iTerm2.setBackground(program, [23, 23, 23])

    return new Button({x: 10, y: 10, width: 20, text: 'test'})
  })

  interceptConsoleLog()

  program.key('escape', function () {
    consoleLog.clear()
    screen.render()
  })
}

run()
