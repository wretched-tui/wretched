import {
  Box,
  Button,
  Drawer,
  Flex,
  Flow,
  Input,
  Space,
  Text,
  interceptConsoleLog,
} from 'wretched'

import {demo} from './demo'

interceptConsoleLog()

const singleLine = new Input({
  text: "family: 👨‍👩‍👧‍👦 smiley: 😀 some other text that isn't very interesting.",
})

const emptySingleLine = new Input({
  text: '',
  placeholder: 'Single line',
})

const wrapLine = new Input({
  text:
    'Once upon a time... ' +
    'There was a little k' +
    'id. She got into all' +
    ' kinds of trouble. T' +
    'he End.',
  wrap: true,
  width: 20,
  height: 3,
})

const emptyMultiLine = new Input({
  text: 'asdf\nasdf\nasdf\n',
  placeholder: 'INSERT\nLINES\nHERE',
  wrap: true,
  multiline: true,
})

const restrictedLine = new Input({
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  maxWidth: 20,
})

const restrictedMultiLine = new Input({
  text: `\
Lorem ipsum
dolor sit
amet, ac
sodales dui
eros ac
elit...`,
  placeholder: 'ahha',
  maxWidth: 10,
  maxHeight: 5,
  multiline: true,
})

function box(input: Input) {
  return Flex.right({
    children: [new Box({border: 'single', child: input}), new Space()],
  })
}

demo(
  Flex.down({
    children: [
      //
      box(singleLine),
      box(emptySingleLine),
      box(wrapLine),
      box(emptyMultiLine),
      box(restrictedLine),
      box(restrictedMultiLine),
    ],
  }),
  false,
)
