import {
  Box,
  Button,
  Checkbox,
  Collapsible,
  CollapsibleText,
  Digits,
  Drawer,
  Dropdown,
  Flex,
  Flow,
  Input,
  Log,
  Progress,
  Scrollable,
  ScrollableList,
  Separator,
  Slider,
  Space,
  Text,
  Tree,
} from 'wretched'

import {demo} from './demo'
import {inspect} from 'wretched'

// Dropdown,
// Input,
// Log,
// Progress,
// Scrollable,
// ScrollableList,
// Separator,
// Slider,
// Space,
// Text,
// Tree,

const OBJ = {
  word: 'something',
  tags: ['tag1', 'tag2', 'tag3', 'tag4'],
  sentences: {
    short: 'this is a short sentence.',
    medium: 'this is another sentence, slightly longer.',
    long: 'finally, a long sentence, one that goes on a little too long, it could be argued.',
  },
}
const inspect1 = inspect(OBJ, false)
const inspect2 = inspect(OBJ, true)

const primary1 = new Button({
  height: 3,
  theme: 'primary',
  text: 'Primary',
})
const primary2 = new Button({
  theme: 'primary',
  text: 'Primary',
})
const button1 = new Button({
  height: 3,
  text: 'Default',
})
const button2 = new Button({
  text: 'Default',
})

const checkboxes = [1, 2, 3, 4].map(
  num => new Checkbox({text: `Choice ${num}`, isChecked: false}),
)

const progress = [
  new Progress({progress: 0, showPercent: true}),
  new Progress({theme: 'blue', progress: 15, showPercent: true}),
  new Progress({theme: 'orange', progress: 46, showPercent: true}),
  new Progress({theme: 'red', progress: 55, showPercent: true}),
  new Progress({theme: 'green', progress: 75, showPercent: true}),
  new Progress({theme: 'plain', progress: 100, showPercent: true}),
]

const collapsible = new Collapsible({
  isCollapsed: true,
  collapsedView: new Text({text: inspect1}),
  expandedView: new Text({text: inspect2}),
})

const collapsibleText = new CollapsibleText({
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur molestie faucibus. Phasellus iaculis pellentesque felis eu fringilla. Ut in sollicitudin nisi. Praesent in mauris tortor. Nam interdum, magna eu pellentesque scelerisque, dui ipsum adipiscing ante, vel ullamcorper nisl sapien id arcu. Nullam egestas diam eu felis mollis sit amet cursus enim vehicula. Quisque eu tellus id erat pellentesque consequat. Maecenas fermentum faucibus magna, eget dictum nisi congue sed. Quisque a justo a nisi eleifend facilisis sit amet at augue. Sed a sapien vitae augue hendrerit porta vel eu ligula. Proin enim urna, faucibus in vestibulum tincidunt, commodo sit amet orci. Vestibulum ac sem urna, quis mattis urna. Nam eget ullamcorper ligula. Nam volutpat, arcu vel auctor dignissim, tortor nisi sodales enim, et vestibulum nulla dui id ligula. Nam ullamcorper, augue ut interdum vulputate, eros mauris lobortis sapien, ac sodales dui eros ac elit.'.replaceAll(
    '. ',
    '.\n',
  ),
})

const boxes = [
  new Box({
    flex: 1,
  }),
  new Box({
    border: 'double',
    flex: 1,
  }),
  new Box({
    border: 'dotted',
    flex: 1,
  }),
  new Box({
    border: 'rounded',
    flex: 1,
  }),
  new Box({
    border: [
      '\n╌\n─', //top
      ' ╎│', // left
      '┌╌┐\n└┐└\n ╎┌', // tl
      '┌╌┐\n┘┌┘\n┐╎', // tr
      ' ╎└\n └╌', // bl
      '┘╎\n╌┘', // br
      '─\n╌', // bottom
      '│╎', // right
    ],
    flex: 1,
  }),
]
const digits1 = new Digits({
  text: `a quick brown fox jumped over the lazy dog. 123,456.7890`,
})

const digits2 = new Digits({
  bold: true,
  text: `a quick brown fox jumped over the lazy dog. 123,456.7890`,
})

const drawerView = Flow.down({
  maxWidth: 40,
  children: [new Text({text: 'Drawer'}), Separator.horizontal()],
})

const contentView = Flow.down({
  children: [
    Flex.right([
      Flow.down([primary1, Space.vertical(1), primary2]),
      Flow.down([button1, Space.vertical(1), button2]),
      Flow.down(checkboxes, {padding: 1}),
      Flow.down(progress, {width: 40}),
    ]),
    collapsible,
    collapsibleText,
    Flex.right(boxes, {height: 8}),
    digits1,
    digits2,
  ],
})

demo(
  new Drawer({
    theme: 'secondary',
    drawerView,
    contentView,
  }),
  false,
)
