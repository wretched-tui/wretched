import {unicode} from '../sys'

import type {Viewport} from '../Viewport'
import {View} from '../View'
import {Point, Size} from '../geometry'
import {strSize} from '../util'
import {toChars} from '../sys/unicode'

type Alignment = 'left' | 'right' | 'center'

interface TextProps {
  text: string
  lines?: undefined
}

interface LinesProps {
  text?: undefined
  lines: string[]
}

interface StyleProps {
  alignment?: Alignment
  wrap?: boolean
}

type Props = StyleProps & (TextProps | LinesProps)

export class Text extends View {
  lines: string[]
  alignment: StyleProps['alignment']
  wrap: StyleProps['wrap']

  constructor({text, lines, alignment, wrap}: Props) {
    super()
    if (text !== undefined) {
      this.lines = text.split('\n')
    } else {
      this.lines = lines
    }
    this.alignment = alignment ?? 'left'
    this.wrap = wrap ?? false
  }

  intrinsicSize(availableSize: Size): Size {
    if (this.wrap) {
      const [width, height] = this.lines.reduce(
        (memo, line) => {
          const [maxWidth, height] = memo
          const width = unicode.strWidth(line)
          return [
            Math.max(maxWidth, width),
            height + ~~(width / availableSize.width) + 1,
          ] as [number, number]
        },
        [0, 0] as [number, number],
      )
      return new Size(Math.min(availableSize.width, width), height)
    }
    return strSize(this.lines)
  }

  render(viewport: Viewport) {
    const lines: [string, number][] = this.lines.map(line => [
      line,
      this.alignment === 'left' ? 0 : unicode.strWidth(line),
    ])

    let y = 0
    let visibleX = 0
    let visibleLine = ''
    let currentAttrs = ''

    function writeVisible(offsetX: number) {
      if (visibleLine.length) {
        viewport.write(visibleLine, new Point(offsetX + visibleX, y))
        visibleLine = ''
      }
    }

    for (const [line, width] of lines) {
      if (!line.length) {
        y += 1
        continue
      }

      let x = 0
      visibleX = 0
      let didWrap = false
      const offsetX =
        this.alignment === 'center'
          ? ~~((viewport.contentSize.width - width) / 2)
          : viewport.contentSize.width - width
      for (const char of toChars(line)) {
        const width = unicode.charWidth(char)
        if (width === 0) {
          // track the currentAttrs regardless of wether it's visible
          currentAttrs = char
          if (visibleLine.length) {
            visibleLine += currentAttrs
          }
          continue
        }

        if (this.wrap && x >= viewport.contentSize.width) {
          writeVisible(offsetX)

          didWrap = true
          x = 0
          y += 1
        }

        if (didWrap && char.match(/\s/)) {
          continue
        }
        didWrap = false

        if (
          x >= viewport.visibleRect.minX() &&
          x + width - 1 < viewport.visibleRect.maxX()
        ) {
          if (!visibleLine.length) {
            // this is the first visible character of the line, writeVisible should use this
            // offset the next time it 'flushes' its buffer
            visibleX = x
            visibleLine = currentAttrs
          }
          visibleLine += char
        }

        x += width
        if (x >= viewport.visibleRect.maxX()) {
          // we're past the visible portion; flush the visible line
          writeVisible(offsetX)
        }
      }

      writeVisible(offsetX)

      y += 1
    }
  }
}
