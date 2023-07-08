import {unicode} from '../sys'

import type {Viewport} from '../Viewport'
import {View} from '../View'
import {Style, fromSGR, colorToSGR} from '../ansi'
import {Point, Size} from '../geometry'

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
  alignment: Alignment
  wrap: boolean
}

type Props = Partial<StyleProps> & (TextProps | LinesProps)

export class Text extends View {
  lines: [string, number][]
  alignment: StyleProps['alignment']
  wrap: StyleProps['wrap']

  constructor({text, lines, alignment, wrap}: Props) {
    super()
    this.alignment = alignment ?? 'left'
    this.lines = (lines ?? text.split('\n')).map(line => [
      line,
      unicode.lineWidth(line),
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

    viewport.pushPen()
    const point = new Point(0, 0).mutableCopy()
    for (const [line, width] of lines) {
      if (!line.length) {
        point.y += 1
        continue
      }

      let didWrap = false
      const offsetX =
        this.alignment === 'left'
          ? 0
          : this.alignment === 'center'
          ? ~~((viewport.contentSize.width - width) / 2)
          : viewport.contentSize.width - width
      point.x = offsetX
      for (const char of unicode.toChars(line)) {
        const width = unicode.charWidth(char)
        if (width === 0) {
          // track the currentStyle regardless of wether it's visible
          viewport.replacePen(fromSGR(char))
          continue
        }

        if (this.wrap && point.x >= viewport.contentSize.width) {
          didWrap = true
          point.x = 0
          point.y += 1
        }

        if (didWrap && char.match(/\s/)) {
          continue
        }
        didWrap = false

        if (
          point.x >= viewport.visibleRect.minX() &&
          point.x + width - 1 < viewport.visibleRect.maxX()
        ) {
          viewport.write(char, point)
        }

        point.x += width
        if (!this.wrap && point.x >= viewport.visibleRect.maxX()) {
          break
        }
      }

      point.y += 1
    }
    viewport.popPen()
  }
}
