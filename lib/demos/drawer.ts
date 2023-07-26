import type {BlessedProgram} from '../sys'

import {iTerm2} from '../iTerm2'
import {Screen} from '../Screen'
import {
  Box,
  Button,
  ConsoleLog,
  Drawer,
  Flex,
  Flow,
  Input,
  Separator,
  Space,
  Text,
} from '../components'
import {interceptConsoleLog} from '../log'
import {debug} from '../util'

interceptConsoleLog()

async function run() {
  process.title = 'Wretched'

  const consoleLog = new ConsoleLog()
  const [screen, program] = await Screen.start(
    async (program: BlessedProgram) => {
      await iTerm2.setBackground(program, [23, 23, 23])

      return new Drawer({
        // theme: 'primary',
        drawer: new Text({
          maxWidth: 40,
          wrap: true,
          text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur molestie faucibus. Phasellus iaculis pellentesque felis eu fringilla. Ut in sollicitudin nisi. Praesent in mauris tortor. Nam interdum, magna eu pellentesque scelerisque, dui ipsum adipiscing ante, vel ullamcorper nisl sapien id arcu. Nullam egestas diam eu felis mollis sit amet cursus enim vehicula. Quisque eu tellus id erat pellentesque consequat. Maecenas fermentum faucibus magna, eget dictum nisi congue sed. Quisque a justo a nisi eleifend facilisis sit amet at augue. Sed a sapien vitae augue hendrerit porta vel eu ligula. Proin enim urna, faucibus in vestibulum tincidunt, commodo sit amet orci. Vestibulum ac sem urna, quis mattis urna. Nam eget ullamcorper ligula. Nam volutpat, arcu vel auctor dignissim, tortor nisi sodales enim, et vestibulum nulla dui id ligula. Nam ullamcorper, augue ut interdum vulputate, eros mauris lobortis sapien, ac sodales dui eros ac elit.`,
        }),
        // content: new Text({
        //   wrap: true,
        //   text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur molestie faucibus. Phasellus iaculis pellentesque felis eu fringilla. Ut in sollicitudin nisi. Praesent in mauris tortor. Nam interdum, magna eu pellentesque scelerisque, dui ipsum adipiscing ante, vel ullamcorper nisl sapien id arcu. Nullam egestas diam eu felis mollis sit amet cursus enim vehicula. Quisque eu tellus id erat pellentesque consequat. Maecenas fermentum faucibus magna, eget dictum nisi congue sed. Quisque a justo a nisi eleifend facilisis sit amet at augue. Sed a sapien vitae augue hendrerit porta vel eu ligula. Proin enim urna, faucibus in vestibulum tincidunt, commodo sit amet orci. Vestibulum ac sem urna, quis mattis urna. Nam eget ullamcorper ligula. Nam volutpat, arcu vel auctor dignissim, tortor nisi sodales enim, et vestibulum nulla dui id ligula. Nam ullamcorper, augue ut interdum vulputate, eros mauris lobortis sapien, ac sodales dui eros ac elit.`,
        // }),
        content: new Flex({
          direction: 'topToBottom',
          children: [
            [
              'natural',
              new Flex({
                direction: 'leftToRight',
                children: [
                  ['flex1', new Text({text: 'flex1-left'})],
                  [
                    'flex1',
                    new Input({
                      text: "family: 👨‍👩‍👧‍👦 smiley: 😀 some other text that isn't very interesting.",
                    }),
                  ],
                  [
                    'flex1',
                    new Text({text: 'flex1-right', alignment: 'right'}),
                  ],
                ],
              }),
            ],
            [
              'natural',
              new Flex({
                direction: 'leftToRight',
                children: [
                  ['flex3', new Text({text: 'flex3-left'})],
                  [
                    'flex1',
                    new Input({
                      text: "family: 👨‍👩‍👧‍👦 smiley: 😀 some other text that isn't very interesting.",
                    }),
                  ],
                  [
                    'flex3',
                    new Text({text: 'flex3-right', alignment: 'right'}),
                  ],
                ],
              }),
            ],
            [
              'flex1',
              new Box({
                border: 'single',
                content: new Flex({
                  direction: 'leftToRight',
                  children: [
                    ['flex1', new Space()],
                    [
                      'flex1',
                      new Flow({
                        direction: 'topToBottom',
                        children: [
                          new Button({
                            text: 'Click me!🙂',
                            width: 'natural',
                            onClick() {
                              console.log('You did!')
                            },
                          }),
                          new Space({height: 1}),
                          new Button({
                            text: 'Not me!',
                            onClick() {
                              console.log("You DIDN'T")
                            },
                          }),
                        ],
                      }),
                    ],
                    ['flex1', new Space()],
                  ],
                }),
              }),
            ],
            new Separator({direction: 'horizontal', border: 'dash3'}),
            ['flex1', consoleLog],
          ],
        }),
      })
    },
  )

  program.key('f1', function () {
    debug(!debug())
  })

  program.key('escape', function () {
    consoleLog.clear()
    screen.render()
  })
}

run()
