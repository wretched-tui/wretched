import {colors} from '../sys'
import {Text, Flex, Input, Slider, Space} from '../components'

import {demo} from './demo'

function pad(num: number) {
  if (num < 10) {
    return `0${num}`
  } else {
    return `${num}`
  }
}

const space = new Space({background: '#000', height: 'fill'})
const rgb = [
  Math.floor(Math.random() * 255),
  Math.floor(Math.random() * 255),
  Math.floor(Math.random() * 255),
] as [number, number, number]

const redInput = new Input({
    text: `${pad(rgb[0])}`,
    padding: {top: 1},
    onChange: text => {
      const value = Number.parseFloat(text)
      if (!Number.isNaN(value)) {
        rgb[0] = Math.round(value)
        update()
      }
    },
  }),
  greenInput = new Input({
    text: `${pad(rgb[1])}`,
    padding: {top: 1},
    onChange: text => {
      const value = Number.parseFloat(text)
      if (!Number.isNaN(value)) {
        rgb[1] = Math.round(value)
        update()
      }
    },
  }),
  blueInput = new Input({
    text: `${pad(rgb[2])}`,
    padding: {top: 1},
    onChange: text => {
      const value = Number.parseFloat(text)
      if (!Number.isNaN(value)) {
        rgb[2] = Math.round(value)
        update()
      }
    },
  })
const rgbText = new Text()

const update = () => {
  rgb[0] = Math.max(0, Math.min(255, rgb[0]))
  rgb[1] = Math.max(0, Math.min(255, rgb[1]))
  rgb[2] = Math.max(0, Math.min(255, rgb[2]))
  // const rgb = colors.HSBtoRGB(rgb[0] / 360, rgb[1] / 100, rgb[2] / 100)
  const sgr = colors.match(rgb)
  const ansi = `\x1b[38;5;${sgr};48;5;${sgr}m      \x1b[39;49m (${sgr})`
  rgbText.text = colors.RGBtoHex(rgb) + ' – ' + ansi
  space.background = colors.RGBtoHex(rgb)

  redInput.text = `${rgb[0]}`
  greenInput.text = `${rgb[1]}`
  blueInput.text = `${rgb[2]}`
}
update()

demo(
  Flex.right({
    children: [
      [
        'flex1',
        Flex.down({
          children: [['flex1', space], rgbText],
        }),
      ],
      [
        'flex1',
        Flex.down({
          children: [
            new Slider({
              theme: 'red',
              direction: 'horizontal',
              border: 'line',
              range: [0, 255],
              position: rgb[0],
              height: 4,
              onChange(value) {
                rgb[0] = Math.round(value)
                update()
              },
            }),
            new Slider({
              theme: 'green',
              direction: 'horizontal',
              range: [0, 255],
              position: rgb[1],
              height: 4,
              onChange(value) {
                rgb[1] = Math.round(value)
                update()
              },
            }),
            new Slider({
              theme: 'blue',
              direction: 'horizontal',
              border: 'line',
              range: [0, 255],
              position: rgb[2],
              height: 4,
              onChange(value) {
                rgb[2] = Math.round(value)
                update()
              },
            }),
            redInput,
            greenInput,
            blueInput,
          ],
        }),
      ],
    ],
  }),
)
