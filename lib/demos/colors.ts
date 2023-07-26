import {colors} from '../sys'
import type {BlessedProgram} from '../sys'
import type {MouseEvent} from '../events'
import type {Props as ViewProps} from '../View'

import {isMouseDragging, isMouseEnter, isMouseExit} from '../events'

import {iTerm2} from '../iTerm2'
import {interceptConsoleLog} from '../log'

import {Screen} from '../Screen'
import {Style} from '../Style'
import {Container} from '../Container'
import {Viewport} from '../Viewport'
import {View} from '../View'
import {Point, Size, Rect, interpolate} from '../geometry'

import {TrackMouse} from '../components/utility'
import {
  Box,
  Button,
  ConsoleLog,
  Drawer,
  Dropdown,
  Flex,
  Flow,
  Input,
  Separator,
  Slider,
  Space,
  Text,
} from '../components'

async function run() {
  process.title = 'Wretched'

  const consoleLog = new ConsoleLog({
    minHeight: 10,
  })
  const [screen, program] = await Screen.start(
    async (program: BlessedProgram) => {
      await iTerm2.setBackground(program, [23, 23, 23])

      const space = new Space({background: '#000', height: 'fill'})
      const hsb = [
        Math.floor(Math.random() * 360),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
      ]
      const hueInput = new Input({
          text: `${hsb[0]}`,
          padding: {top: 1},
          onChange: text => {
            const value = Number.parseFloat(text)
            if (!Number.isNaN(value)) {
              hsb[0] = value
              update()
            }
          },
        }),
        saturationInput = new Input({
          text: `${hsb[1]}`,
          padding: {top: 1},
          onChange: text => {
            const value = Number.parseFloat(text)
            if (!Number.isNaN(value)) {
              hsb[1] = value
              update()
            }
          },
        }),
        brightnessInput = new Input({
          text: `${hsb[2]}`,
          padding: {top: 1},
          onChange: text => {
            const value = Number.parseFloat(text)
            if (!Number.isNaN(value)) {
              hsb[2] = value
              update()
            }
          },
        })

      const update = () => {
        hsb[0] = Math.max(0, Math.min(360, hsb[0]))
        hsb[1] = Math.max(0, Math.min(100, hsb[1]))
        hsb[2] = Math.max(0, Math.min(100, hsb[2]))
        const rgb = colors.HSBtoRGB(hsb[0] / 360, hsb[1] / 100, hsb[2] / 100)
        space.background = rgb

        hueInput.text = `${hsb[0]}`
        saturationInput.text = `${hsb[1]}`
        brightnessInput.text = `${hsb[2]}`
      }
      update()

      return new Flex({
        direction: 'leftToRight',
        children: [
          ['flex1', space],
          new Slider({
            theme: 'primary',
            direction: 'vertical',
            border: 'line',
            range: [0, 360],
            position: hsb[0],
            width: 1,
            onChange(value) {
              hsb[0] = value
              update()
            },
          }),
          new Slider({
            theme: 'secondary',
            direction: 'vertical',
            border: 'line',
            range: [0, 360],
            position: hsb[0],
            width: 2,
            onChange(value) {
              hsb[0] = value
              update()
            },
          }),
          new Slider({
            theme: 'proceed',
            direction: 'vertical',
            border: 'line',
            range: [0, 360],
            position: hsb[0],
            width: 3,
            onChange(value) {
              hsb[0] = value
              update()
            },
          }),
          new Slider({
            theme: 'cancel',
            direction: 'vertical',
            border: 'line',
            range: [0, 360],
            position: hsb[0],
            width: 4,
            onChange(value) {
              hsb[0] = value
              update()
            },
          }),
          [
            'flex1',
            new Flex({
              direction: 'topToBottom',
              children: [
                new Slider({
                  theme: 'primary',
                  direction: 'horizontal',
                  range: [0, 100],
                  position: hsb[1],
                  height: 2,
                  onChange(value) {
                    hsb[1] = value
                    update()
                  },
                }),
                hueInput,
                new Slider({
                  theme: 'secondary',
                  direction: 'horizontal',
                  border: 'line',
                  range: [0, 100],
                  position: hsb[2],
                  height: 1,
                  onChange(value) {
                    hsb[2] = value
                    update()
                  },
                }),
                new Slider({
                  theme: 'proceed',
                  direction: 'horizontal',
                  border: 'line',
                  range: [0, 100],
                  position: hsb[2],
                  height: 2,
                  onChange(value) {
                    hsb[2] = value
                    update()
                  },
                }),
                new Slider({
                  theme: 'cancel',
                  direction: 'horizontal',
                  border: 'line',
                  range: [0, 100],
                  position: hsb[2],
                  height: 3,
                  onChange(value) {
                    hsb[2] = value
                    update()
                  },
                }),
                new Slider({
                  theme: 'selected',
                  direction: 'horizontal',
                  border: 'line',
                  range: [0, 100],
                  position: hsb[2],
                  height: 4,
                  onChange(value) {
                    hsb[2] = value
                    update()
                  },
                }),
                saturationInput,
                brightnessInput,
                consoleLog,
              ],
            }),
          ],
        ],
      })
    },
  )

  interceptConsoleLog()

  program.key('escape', function () {
    consoleLog.clear()
    screen.render()
  })
}

run()
