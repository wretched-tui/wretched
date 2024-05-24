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
  text: '',
  placeholder: 'INSERT\nLINES\nHERE',
  wrap: true,
  multiline: true,
})

const restrictedLine = new Input({
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  maxWidth: 20,
})

const restrictedMultiLine = new Input({
  text: `Lorem ipsum dolor sit amet,
consectetur adipiscing elit. Nunc consectetur molestie faucibus. Phasellus iaculis pellentesque felis eu fringilla. Ut in sollicitudin nisi. Praesent in mauris tortor. Nam interdum,
magna eu pellentesque scelerisque,
dui ipsum adipiscing ante,
vel ullamcorper nisl sapien id arcu. Nullam egestas diam eu felis mollis sit amet cursus enim vehicula. Quisque eu tellus id erat pellentesque consequat. Maecenas fermentum faucibus magna,
eget dictum nisi congue sed. Quisque a justo a nisi eleifend facilisis sit amet at augue. Sed a sapien vitae augue hendrerit porta vel eu ligula. Proin enim urna,
faucibus in vestibulum tincidunt,
commodo sit amet orci. Vestibulum ac sem urna,
quis mattis urna. Nam eget ullamcorper ligula. Nam volutpat,
arcu vel auctor dignissim,
tortor nisi sodales enim,
et vestibulum nulla dui id ligula. Nam ullamcorper,
augue ut interdum vulputate,
eros mauris lobortis sapien,
ac sodales dui eros ac elit.`,
  maxWidth: 20,
  maxHeight: 5,
  wrap: true,
})

demo(
  Flex.down({
    children: [
      //
      singleLine,
      emptySingleLine,
      Flex.right({
        children: [new Box({border: 'single', child: wrapLine}), new Space()],
      }),
      emptyMultiLine,
      restrictedLine,
      restrictedMultiLine,
    ],
  }),
  false,
)
