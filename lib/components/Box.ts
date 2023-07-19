import type {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'
import type {MouseEvent} from '../events'
import {View} from '../View'
import {Container} from '../Container'
import {Rect, Point, Size} from '../geometry'
import {Style} from '../Style'
import {isMouseEnter, isMouseExit} from '../events'

type Border = 'single' | 'bold' | 'double' | 'round'

interface ChildrenProps {
  children: View[]
  content?: undefined
}
interface ContentProps {
  content?: View
  children?: undefined
}
interface StyleProps extends ViewProps {
  border?: Border
  highlight?: Style
}
type Props = StyleProps & (ChildrenProps | ContentProps)

export class Box extends Container {
  #border: Border
  #highlight?: Style
  #hover = false

  constructor({content, children, border, highlight, ...viewProps}: Props) {
    super(viewProps)
    this.#border = border ?? 'single'
    this.#highlight = highlight
    if (children) {
      this.addAll(children)
    } else if (content) {
      this.add(content)
    }
  }

  intrinsicSize(size: Size): Size {
    const intrinsicSize = super.intrinsicSize(size.shrink(2, 2))
    return intrinsicSize.grow(2, 2)
  }

  receiveMouse(event: MouseEvent) {
    if (isMouseEnter(event)) {
      this.#hover = true
    } else if (isMouseExit(event)) {
      this.#hover = false
    }
  }

  render(viewport: Viewport) {
    const maxX = viewport.contentSize.width - 1
    const maxY = viewport.contentSize.height - 1
    let borderStyle = new Style({foreground: 'white', background: 'default'})
    if (this.#highlight) {
      borderStyle = this.#hover
        ? this.#highlight.merge(borderStyle)
        : borderStyle
      viewport.registerMouse('mouse.move')
    }

    const innerStyle = new Style({background: borderStyle.background})
    for (let y = 1; y < maxY; ++y) {
      viewport.write(' '.repeat(maxX - 1), new Point(1, y), innerStyle)
    }

    viewport.clipped(
      new Rect(new Point(1, 1), viewport.contentSize.shrink(2, 2)),
      inside => {
        super.render(inside)
      },
    )

    viewport.usingPen(borderStyle, () => {
      const [top, left, tl, tr, bl, br, bottom, right] = BORDERS[this.#border]
      viewport.write(top.repeat(maxX - 1), new Point(1, 0))
      viewport.write((bottom ?? top).repeat(maxX - 1), new Point(1, maxY))
      for (let y = 1; y < maxY; ++y) {
        viewport.write(left, new Point(0, y))
        viewport.write(right ?? left, new Point(maxX, y))
      }
      viewport.write(tl, Point.zero)
      viewport.write(tr, new Point(maxX, 0))
      viewport.write(bl, new Point(0, maxY))
      viewport.write(br, new Point(maxX, maxY))
    })
  }
}

type Chars =
  | [string, string, string, string, string, string]
  | [string, string, string, string, string, string, string, string]
const BORDERS: Record<Border, Chars> = {
  single: ['─', '│', '┌', '┐', '└', '┘'],
  bold: ['━', '┃', '┏', '┓', '┗', '┛'],
  double: ['═', '║', '╔', '╗', '╚', '╝'],
  round: ['─', '│', '╭', '╮', '╰', '╯'],
}
