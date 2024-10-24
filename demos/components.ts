import {
  interceptConsoleLog,
  Box,
  Button,
  Checkbox,
  Collapsible,
  CollapsibleText,
  Digits,
  Drawer,
  Dropdown,
  Flex,
  Input,
  Progress,
  Scrollable,
  ScrollableList,
  Separator,
  Slider,
  Space,
  Text,
  Tree,
  type FontFamily,
  FontFamilies,
} from 'wretched'

import {demo} from './demo'
import {inspect} from 'wretched'

interceptConsoleLog()

// Log,
// Scrollable,
// ScrollableList,
// Space,

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
  new Progress({theme: 'red', height: 2, progress: 55, showPercent: true}),
  new Progress({theme: 'green', height: 3, progress: 75, showPercent: true}),
  new Progress({theme: 'plain', height: 4, progress: 100, showPercent: true}),
]

const slider0 = new Slider({
  width: 1,
  direction: 'vertical',
  range: [0, 255],
  position: ~~(Math.random() * 255),
  buttons: true,
  step: 1,
})
const slider1 = new Slider({
  direction: 'vertical',
  range: [0, 255],
  position: ~~(Math.random() * 255),
  buttons: true,
  step: 1,
  border: true,
})

const slider2 = new Slider({
  height: 1,
  direction: 'horizontal',
  range: [0, 255],
  position: ~~(Math.random() * 255),
  buttons: true,
  step: 1,
})
const slider3 = new Slider({
  direction: 'horizontal',
  range: [0, 255],
  position: ~~(Math.random() * 255),
  buttons: true,
  step: 1,
  border: true,
})

const titleInput = new Input({
  text: '',
  placeholder: 'Title',
})

const storyInput = new Input({
  text: '',
  placeholder: 'Story',
  wrap: true,
  multiline: true,
})

const wrapCheckbox = new Checkbox({
  text: `Wrap lines?`,
  isChecked: true,
  onChange(value) {
    storyInput.wrap = value
  },
})

const fontSelect = new Dropdown({
  theme: 'proceed',
  onSelect(value: FontFamily) {
    titleInput.font = value
    storyInput.font = value
  },
  height: 1,
  choices: FontFamilies.map(f => [f, f]),
  selected: 'default',
})

const storybox = Flex.down([
  Flex.right([wrapCheckbox, Space.horizontal(1), fontSelect]),
  titleInput,
  storyInput,
])

const tree = new Tree({
  titleView: new Text({text: 'Title view'}),
  data: [{path: '1'}, {path: '2'}, {path: '3'}],
  render({path}, index) {
    return new Text({text: `Item ${path}`})
  },
  getChildren({path}) {
    return [{path: `${path}.1`}, {path: `${path}.2`}, {path: `${path}.3`}]
  },
})

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
  text: 'Sphinx of black quartz,\njudge my vow.\n123,456.7890',
})

const digits2 = new Digits({
  bold: true,
  text: 'Sphinx of black quartz,\njudge my vow.\n123,456.7890',
})

const scrollable = new Scrollable({
  child: Flex.down([digits1, digits2]),
  width: 20,
  height: 4,
})

const drawerView = Flex.down({
  maxWidth: 40,
  children: [new Text({text: 'Drawer'}), Separator.horizontal()],
})

const contentView = Flex.right([
  Flex.down(
    {
      children: [
        Flex.right([
          Flex.down([primary1, Space.vertical(1), primary2]),
          Flex.down([button1, Space.vertical(1), button2]),
          Flex.down(checkboxes, {padding: 1}),
          Flex.down(progress, {width: 40}),
          slider0,
          storybox,
        ]),
        slider2,
        slider3,
        collapsible,
        collapsibleText,
        Flex.right(boxes, {height: 8}),
        scrollable,
        tree,
      ],
    },
    {flex: 1},
  ),
  Flex.down([['flex1', slider1], Space.vertical(1)]),
])

demo(
  new Drawer({
    theme: 'secondary',
    drawerView,
    contentView,
  }),
  false,
)
