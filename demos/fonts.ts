import {
  type FontFamily,
  FontFamilies,
  Text,
  Dropdown,
  Flex,
  Separator,
  Space,
} from '../components'

import {demo} from './demo'

const choices: [string, FontFamily][] = FontFamilies.map(f => [f, f])

const text = new Text({
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n0123456789\nNunc consectetur molestie faucibus.\nPhasellus iaculis pellentesque felis eu fringilla.\nUt in sollicitudin nisi.\nPraesent in mauris tortor.\nNam interdum, magna eu pellentesque scelerisque, dui ipsum adipiscing ante, vel ullamcorper nisl sapien id arcu.\nNullam egestas diam eu felis mollis sit amet cursus enim vehicula.\nQuisque eu tellus id erat pellentesque consequat.\nMaecenas fermentum faucibus magna, eget dictum nisi congue sed.\nQuisque a justo a nisi eleifend facilisis sit amet at augue.\nSed a sapien vitae augue hendrerit porta vel eu ligula.\nProin enim urna, faucibus in vestibulum tincidunt, commodo sit amet orci.\nVestibulum ac sem urna, quis mattis urna.\nNam eget ullamcorper ligula.\nNam volutpat, arcu vel auctor dignissim, tortor nisi sodales enim, et vestibulum nulla dui id ligula.\nNam ullamcorper, augue ut interdum vulputate, eros mauris lobortis sapien, ac sodales dui eros ac elit.',
  wrap: true,
  font: 'serif',
  padding: 2,
})

const dropdown = new Dropdown({
  theme: 'proceed',
  onSelect(value: FontFamily) {
    text.font = value
    console.log(`Selected: ${value}`)
  },
  padding: {left: 2, right: 2},
  height: 1,
  choices,
  selected: 'serif',
})

demo(
  Flex.down({
    children: [new Space({height: 1}), dropdown, new Space({height: 1}), text],
  }),
)
