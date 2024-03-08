import {colors} from '../sys'
import {Digits, Flex, Input, Slider, Space, Text} from '../components'

import {demo} from './demo'

function pad(num: number) {
  if (num < 10) {
    return `0${num}`
  } else {
    return `${num}`
  }
}

const swatch = new Space({background: '#000', height: 'fill'})
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

const rgbText1 = new Digits({text: '', bold: true})
const rgbText2 = new Digits({text: '', bold: false})
function updateText(text: string) {
  rgbText1.text = text
  rgbText2.text = text
}
const ansiText = new Text()

const update = () => {
  rgb[0] = Math.max(0, Math.min(255, rgb[0]))
  rgb[1] = Math.max(0, Math.min(255, rgb[1]))
  rgb[2] = Math.max(0, Math.min(255, rgb[2]))
  // const rgb = colors.HSBtoRGB(rgb[0] / 360, rgb[1] / 100, rgb[2] / 100)
  const sgr = colors.match(rgb)
  let ansi = `\x1b[38;5;${sgr};48;5;${sgr}m      \x1b[39;49m`
  ansi = [ansi, ansi, ansi].join('\n') + ` (6bit: ${sgr})`
  updateText(colors.RGBtoHex(rgb))
  ansiText.text = ansi
  swatch.background = colors.RGBtoHex(rgb)

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
          children: [
            ['flex1', swatch],
            Flex.right([rgbText1, ansiText]),
            rgbText2,
          ],
        }),
      ],
      [
        'flex1',
        Flex.right({
          children: [
            new Slider({
              direction: 'vertical',
              range: [0, 255],
              position: rgb[0],
              buttons: true,
              step: 5,
              border: true,
              onChange(value) {
                rgb[0] = Math.round(value)
                update()
              },
            }),
            new Slider({
              theme: 'green',
              direction: 'vertical',
              range: [0, 255],
              position: rgb[1],
              buttons: true,
              step: 1,
              onChange(value) {
                rgb[1] = Math.round(value)
                update()
              },
            }),
            new Slider({
              theme: 'blue',
              direction: 'vertical',
              range: [0, 255],
              position: rgb[2],
              border: true,
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
