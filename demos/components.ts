import {
  interceptConsoleLog,
  Accordion,
  Box,
  Button,
  Checkbox,
  Collapsible,
  CollapsibleText,
  Digits,
  Drawer,
  Dropdown,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Flex,
  Input,
  Progress,
  Scrollable,
  ScrollableList,
  Separator,
  Slider,
  Space,
  Tabs,
  Text,
  Tree,
  type FontFamily,
  FontFamilies,
} from 'wretched'

import {demo} from './demo'
import {inspect} from 'wretched'

interceptConsoleLog()

// Log,
// ScrollableList,

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
  value: ~~(Math.random() * 255),
  buttons: true,
  step: 1,
})
const slider1 = new Slider({
  direction: 'vertical',
  range: [0, 255],
  value: ~~(Math.random() * 255),
  buttons: true,
  step: 1,
  border: true,
})

const slider2 = new Slider({
  height: 1,
  direction: 'horizontal',
  range: [0, 255],
  value: ~~(Math.random() * 255),
  buttons: true,
  step: 1,
})
const slider3 = new Slider({
  direction: 'horizontal',
  range: [0, 255],
  value: ~~(Math.random() * 255),
  buttons: true,
  step: 1,
  border: true,
})

const summary = new Text()

const titleInput = new Input({
  text: '',
  placeholder: 'Title',
  onChange() {
    summary.text = titleInput.text + '\n' + storyInput.text
  },
})

const storyInput = new Input({
  text: '',
  placeholder: 'Story',
  wrap: true,
  multiline: true,
  onChange() {
    summary.text = titleInput.text + '\n' + storyInput.text
  },
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
  Space.vertical(1),
  summary,
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
  collapsed: new Text({text: inspect1}),
  expanded: new Text({text: inspect2}),
})

const collapsibleText = new CollapsibleText({
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur molestie faucibus. Phasellus iaculis pellentesque felis eu fringilla. Ut in sollicitudin nisi. Praesent in mauris tortor. Nam interdum, magna eu pellentesque scelerisque, dui ipsum adipiscing ante, vel ullamcorper nisl sapien id arcu. Nullam egestas diam eu felis mollis sit amet cursus enim vehicula. Quisque eu tellus id erat pellentesque consequat. Maecenas fermentum faucibus magna, eget dictum nisi congue sed. Quisque a justo a nisi eleifend facilisis sit amet at augue. Sed a sapien vitae augue hendrerit porta vel eu ligula. Proin enim urna, faucibus in vestibulum tincidunt, commodo sit amet orci. Vestibulum ac sem urna, quis mattis urna. Nam eget ullamcorper ligula. Nam volutpat, arcu vel auctor dignissim, tortor nisi sodales enim, et vestibulum nulla dui id ligula. Nam ullamcorper, augue ut interdum vulputate, eros mauris lobortis sapien, ac sodales dui eros ac elit.'.replaceAll(
    '. ',
    '.\n',
  ),
})

const tabs = new Box({
  height: 8,
  highlight: true,
  child: Tabs.create([
    ['Single', new Box({flex: 1})],
    ['Double', new Box({border: 'double', flex: 1})],
    ['Dotted', new Box({border: 'dotted', flex: 1})],
    ['Rounded', new Box({border: 'rounded', flex: 1})],
    [
      'Custom',
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
    ],
  ]),
})

const digits1 = new Digits({
  text: 'Sphinx of black\nquartz, judge my vow.\n123,456.7890\n(1)[2]{3}\n+-*/ %#:!\n2^⁴',
})

const digits2 = new Digits({
  bold: true,
  text: 'How vexingly quick\ndaft zebras jump!\n123,456.7890\n(1)[2]{3}\n+-*/ %#:!\n2^⁴',
})

const scrollable = new Scrollable({
  child: Flex.down([digits1, digits2]),
  width: 40,
  height: 5,
})

const drawerView = Flex.down({
  maxWidth: 40,
  children: [
    new Text({text: 'Drawer'}),
    Separator.horizontal(),
    Accordion.create(
      Array(10)
        .fill(0)
        .map((_, index) =>
          Accordion.Section.create(
            `title ${index + 1}`,
            new Text({
              text: Array(10)
                .fill(`section ${index + 1}.`)
                .map((line, index) => line + (index + 1))
                .join('\n'),
            }),
          ),
        ),
      {multiple: true},
    ),
  ],
})

const contentView = Flex.right([
  Flex.down(
    [
      Flex.right([
        Flex.down([
          Flex.right([
            Flex.down([primary1, primary2], {gap: 1, debug: true}),
            Flex.down([button1, button2], {gap: 1}),
            Flex.down(checkboxes, {padding: 1}),
          ]),
          Flex.right([
            Flex.down([H1('Header 1'), H4('Header 4')]),
            Flex.down([H2('Header 2'), H5('Header 5')]),
            Flex.down([H3('Header 3'), H6('Header 6')]),
          ]),
        ]),
        Flex.down(progress, {width: 40}),
        slider0,
        storybox,
      ]),
      slider2,
      slider3,
      collapsible,
      collapsibleText,
      tabs,
      scrollable,
      tree,
    ],
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
