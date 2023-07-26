import type {BlessedProgram} from '../sys'

import {iTerm2} from '../iTerm2'
import {interceptConsoleLog} from '../log'

import {Screen} from '../Screen'
import {TrackMouse} from '../components/utility'
import {
  Box,
  Button,
  ConsoleLog,
  Drawer,
  Dropdown,
  LargeDropdown,
  Flex,
  Flow,
  Input,
  Separator,
  Space,
  Text,
} from '../components'

async function run() {
  interceptConsoleLog()
  process.title = 'Wretched'

  const consoleLog = new ConsoleLog({
    minHeight: 10,
  })
  const [screen, program] = await Screen.start(
    async (program: BlessedProgram) => {
      await iTerm2.setBackground(program, [23, 23, 23])

      const choices: [string, number][] = [
        ['One\n1', 1],
        ['Two\n2', 2],
        ['Three\n3', 3],
        ['Four\n4', 4],
        ['Five\n5', 5],
        ['Six\n6', 6],
        ['Seven\n7', 7],
        ['Eight\n8', 8],
        ['Nine\n9', 9],
        ['Ten\n10', 10],
        ['Eleven\n11', 11],
        ['Twelve\n12', 12],
        ['Thirteen\n13', 13],
        ['Fourteen\n14', 14],
        ['Fifteen\n15', 15],
        ['Sixteen\n16', 16],
        ['Seventeen\n17', 17],
        ['Eighteen\n18', 18],
        ['Nineteen\n19', 19],
        ['Twenty\n20', 20],
        ['21', 21],
        ['22', 22],
        ['23', 23],
        ['24', 24],
        ['25', 25],
        ['26', 26],
        ['27', 27],
        ['28', 28],
        ['29', 29],
        ['30', 30],
        ['31', 31],
        ['32', 32],
        ['33', 33],
        ['34', 34],
        ['35', 35],
      ]

      return new TrackMouse({
        content: new Flex({
          direction: 'topToBottom',
          children: [
            new LargeDropdown({
              theme: 'primary',
              padding: {left: 2, right: 2},
              choices,
              selected: 1,
            }),
            new Space({height: 1}),
            new Dropdown({
              theme: 'secondary',
              padding: {left: 2, right: 2},
              height: 1,
              choices,
              selected: 1,
            }),
            new Space({height: 1}),
            new Dropdown({
              padding: {left: 2, right: 2},
              height: 1,
              choices,
              selected: 1,
            }),
            ['flex1', new Space()],
            new Button({
              height: 3,
              padding: {left: 1, right: 1},
              theme: 'primary',
              text: 'Launch',
            }),
            [
              'flex1',
              new Separator({
                direction: 'horizontal',
                border: 'trailing',
                padding: 1,
              }),
            ],
            new Dropdown({
              theme: 'proceed',
              padding: {left: 2, right: 2},
              height: 1,
              choices,
              selected: 1,
            }),
            new Space({height: 1}),
            new LargeDropdown({
              theme: 'cancel',
              padding: {left: 2, right: 2},
              choices,
              selected: 1,
            }),
            // consoleLog,
          ],
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
