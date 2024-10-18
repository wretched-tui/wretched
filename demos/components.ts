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

// Collapsible,
// CollapsibleText,
// Digits,
// Drawer,
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

demo(
  Flow.down({
    children: [
      Flex.right([
        Flow.down([
          new Button({
            height: 3,
            theme: 'primary',
            text: 'Primary',
          }),
          Space.vertical(1),
          new Button({
            theme: 'primary',
            text: 'Primary',
          }),
        ]),
        Flow.down([
          new Button({
            height: 3,
            text: 'Default',
          }),
          Space.vertical(1),
          new Button({
            text: 'Default',
          }),
        ]),
        Flow.down(
          [
            new Checkbox({text: 'Choice 1', isChecked: false}),
            new Checkbox({text: 'Choice 2', isChecked: false}),
            new Checkbox({text: 'Choice 3', isChecked: false}),
            new Checkbox({text: 'Choice 4', isChecked: false}),
          ],
          {padding: 1},
        ),
        Flow.down(
          [
            new Progress({progress: 0, showPercent: true}),
            new Progress({theme: 'blue', progress: 15, showPercent: true}),
            new Progress({theme: 'orange', progress: 46, showPercent: true}),
            new Progress({theme: 'red', progress: 55, showPercent: true}),
            new Progress({theme: 'green', progress: 75, showPercent: true}),
            new Progress({theme: 'plain', progress: 100, showPercent: true}),
          ],
          {width: 40},
        ),
      ]),
      Flex.right(
        [
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
        ],
        {height: 8},
      ),
      Flex.right([
        new Digits({
          text: `
a quick brown fox
jumped over the
lazy dog.
123,456.7890`.slice(1),
        }),
        Space.horizontal(4),
        new Digits({
          bold: true,
          text: `
a quick brown fox
jumped over the
lazy dog.
123,456.7890`.slice(1),
        }),
      ]),
    ],
  }),
)
