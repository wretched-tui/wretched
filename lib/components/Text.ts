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
  lines: [string, number][]
  alignment: StyleProps['alignment']
  wrap: StyleProps['wrap']

  constructor({text, lines, alignment, wrap}: Props) {
    super()
    this.alignment = alignment ?? 'left'
    this.lines = (lines ?? text.split('\n')).map(line => [
      line,
      unicode.strWidth(line),
    ])
    this.wrap = wrap ?? false
  }

  intrinsicSize(availableSize: Size): Size {
    const [width, height] = this.lines.reduce(
      ([maxWidth, height], [, width]) => {
        let lineHeight: number = 1
        if (this.wrap) {
          lineHeight += ~~(width / availableSize.width)
        }
        return [Math.max(maxWidth, width), height + lineHeight]
      },
      [0, 0] as [number, number],
    )
    return new Size(Math.min(availableSize.width, width), height)
  }

  render(viewport: Viewport) {
    const lines: [string, number][] = this.lines

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
          : this.alignment === 'left'
          ? 0
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
