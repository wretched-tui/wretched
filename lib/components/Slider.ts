import {Viewport} from '../Viewport'
import {type Props as ViewProps, View} from '../View'
import {Point, Size, interpolate} from '../geometry'
import {
  type MouseEvent,
  isMouseDragging,
  isMouseEnter,
  isMouseExit,
} from '../events'

type Direction = 'vertical' | 'horizontal'
type Border = 'line' | 'fill'

interface Props extends ViewProps {
  direction: Direction
  border?: Border
  range?: [number, number]
  position?: number
  integer?: boolean
  onChange?: (value: number) => void
}

export class Slider extends View {
  #direction: Direction
  #border: Border
  #range: [number, number]
  #position: number
  #contentSize?: Size
  #integer: boolean
  #isHover = false
  #onChange?: (value: number) => void

  constructor({
    direction,
    border,
    range,
    position,
    integer,
    onChange,
    ...viewProps
  }: Props) {
    super(viewProps)

    this.#direction = direction
    this.#border = border ?? 'fill'
    this.#range = range ?? [0, 1]
    this.#position = position ?? Math.min(...this.#range)
    this.#integer = integer ?? false
    this.#onChange = onChange
  }

  naturalSize(available: Size) {
    return new Size(available.width, 1)
  }

  receiveMouse(event: MouseEvent) {
    if (isMouseEnter(event)) {
      this.#isHover = true
    } else if (isMouseExit(event)) {
      this.#isHover = false
    }

    if (isMouseDragging(event) && this.#contentSize) {
      const prev = this.#position
      if (this.#direction === 'horizontal') {
        this.#position = interpolate(
          event.position.x,
          [0, this.#contentSize.width - 1],
          this.#range,
        )
      } else {
        this.#position = interpolate(
          event.position.y,
          [0, this.#contentSize.height - 1],
          this.#range,
        )
      }

      if (this.#integer) {
        this.#position = Math.round(this.#position)
      }
      this.#position = Math.min(
        this.#range[1],
        Math.max(this.#range[0], this.#position),
      )

      if (this.#position !== prev) {
        this.#onChange?.(this.#position)
      }
    }
  }

  render(viewport: Viewport) {
    this.#contentSize = viewport.contentSize
    viewport.registerMouse(['mouse.move', 'mouse.button.left'])

    if (this.#border === 'fill') {
      this.renderFill(viewport)
    } else {
      this.renderLine(viewport)
    }
  }

  renderFill(viewport: Viewport) {
    const pt = Point.zero.mutableCopy()
    if (this.#direction === 'horizontal') {
      const position = Math.round(
        interpolate(this.#position, this.#range, [
          0,
          viewport.contentSize.width - 1,
        ]),
      )
      for (; pt.x < viewport.contentSize.width; pt.x++) {
        const char = pt.x === position ? '█' : '░'
        for (pt.y = 0; pt.y < viewport.contentSize.height; pt.y++) {
          viewport.write(char, pt, this.theme.ui())
        }
      }
    } else {
      const position = Math.round(
        interpolate(this.#position, this.#range, [
          0,
          viewport.contentSize.height - 1,
        ]),
      )
      for (; pt.y < viewport.contentSize.height; pt.y++) {
        const char = pt.y === position ? '█' : '░'
        viewport.write(char.repeat(viewport.contentSize.width), pt)
      }
    }
  }

  renderLine(viewport: Viewport) {
    const pt = Point.zero.mutableCopy()
    const textStyle = this.theme.ui({isHover: this.#isHover})
    const controlStyle = this.theme.ui({isHover: this.#isHover})
    if (this.#direction === 'horizontal') {
      const position = Math.round(
        interpolate(this.#position, this.#range, [
          0,
          viewport.contentSize.width - 1,
        ]),
      )
      viewport.visibleRect.forEachPoint(pt => {
        let char: string,
          style = textStyle
        if (pt.x === position) {
          if (pt.y === 0 && viewport.contentSize.height > 1) {
            char = '▄'
          } else if (
            pt.y === viewport.contentSize.height - 1 &&
            viewport.contentSize.height > 1
          ) {
            char = '▀'
          } else {
            char = '█'
          }
          style = controlStyle
        } else if (viewport.contentSize.height === 1) {
          if (pt.x === 0) {
            char = '╶'
          } else if (pt.x === viewport.contentSize.width - 1) {
            char = '╴'
          } else {
            char = '─'
          }
        } else if (pt.y === 0) {
          if (pt.x === 0) {
            char = '┌'
          } else if (pt.x === viewport.contentSize.width - 1) {
            char = '┐'
          } else {
            char = '─'
          }
        } else if (pt.y === viewport.contentSize.height - 1) {
          if (pt.x === 0) {
            char = '└'
          } else if (pt.x === viewport.contentSize.width - 1) {
            char = '┘'
          } else {
            char = '─'
          }
        } else if (pt.x === 0 || pt.x === viewport.contentSize.width - 1) {
          char = '│'
        } else {
          char = ' '
        }

        viewport.write(char, pt, style)
      })
    } else {
      const position = Math.round(
        interpolate(this.#position, this.#range, [
          0,
          viewport.contentSize.height - 1,
        ]),
      )
      viewport.visibleRect.forEachPoint(pt => {
        let char: string,
          style = textStyle
        if (pt.y === position) {
          if (pt.x === 0 && viewport.contentSize.width > 1) {
            char = '▐'
          } else if (
            pt.x === viewport.contentSize.width - 1 &&
            viewport.contentSize.width > 1
          ) {
            char = '▌'
          } else {
            char = '█'
          }
          style = controlStyle
        } else if (viewport.contentSize.width === 1) {
          if (pt.y === 0) {
            char = '╷'
          } else if (pt.y === viewport.contentSize.height - 1) {
            char = '╵'
          } else {
            char = '│'
          }
        } else if (pt.x === 0) {
          if (pt.y === 0) {
            char = '┌'
          } else if (pt.y === viewport.contentSize.height - 1) {
            char = '└'
          } else {
            char = '│'
          }
        } else if (pt.x === viewport.contentSize.width - 1) {
          if (pt.y === 0) {
            char = '┐'
          } else if (pt.y === viewport.contentSize.height - 1) {
            char = '┘'
          } else {
            char = '│'
          }
        } else if (pt.y === 0 || pt.y === viewport.contentSize.height - 1) {
          char = '─'
        } else {
          char = ' '
        }

        viewport.write(char, pt, style)
      })
    }
  }
}
