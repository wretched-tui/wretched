import type {BlessedProgram} from '../sys'

import {iTerm2} from '../iTerm2'
import {interceptConsoleLog} from '../log'
import {inspect} from '../inspect'

import {Screen} from '../Screen'
import {TrackMouse} from '../components/utility'
import {ConsoleLog, Collapsible, Text} from '../components'

async function run() {
  interceptConsoleLog()
  process.title = 'Wretched'

  const consoleLog = new ConsoleLog({
    minHeight: 10,
  })
  const [screen, program] = await Screen.start(
    async (program: BlessedProgram) => {
      await iTerm2.setBackground(program, [23, 23, 23])

      return new TrackMouse({
        content: new Collapsible({
          isCollapsed: false,
          collapsedView: new Text({text: inspect(OBJ, false)}),
          expandedView: new Text({text: inspect(OBJ, true)}),
        }),
      })
    },
  )

  program.key('escape', function () {
    consoleLog.clear()
    screen.render()
  })
}

run()

const OBJ = {
  word: 'something',
  tags: ['tag1', 'tag2', 'tag3', 'tag4'],
  sentences: {
    short: 'this is a short sentence.',
    medium: 'this is another sentence, slightly longer.',
    long: 'finally, a long sentence, one that goes on a little too long, it could be argued.',
  },
}
