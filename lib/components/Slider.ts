import {Viewport} from '../Viewport'
import {type Props as ViewProps, View} from '../View'
import {Point, Rect, Size, interpolate} from '../geometry'
import {
  type MouseEvent,
  isMouseDragging,
  isMouseEnter,
  isMouseExit,
  isMouseMove,
  isMouseClicked,
  isMousePressStart,
  isMousePressExit,
  isMousePressEnd,
} from '../events'
import type {Style} from '../Style'

type Direction = 'vertical' | 'horizontal'

const MIN = 5

type ButtonProps =
  | {
      /**
       * Whether to show ◃, ▹ buttons on either side of the slider.
       * Default: false
       */
      buttons?: false
      /**
       * If provided, values will be in fit the equation `min(range) + N * step`. Also
       * applies to the buttons, if they are visible.
       */
      step?: number
    }
  | {
      /**
       * Whether to show ◃, ▹ buttons on either side of the slider.
       * Default: false
       */
      buttons: true
      /**
       * If provided, values will be in fit the equation `min(range) + N * step`. Also
       * applies to the buttons, if they are visible.
       */
      step: number
    }

type Props = ViewProps &
  ButtonProps & {
    /**
     * What direction to draw the slider.
     * Default: 'horizontal'
     */
    direction?: Direction
    /**
     * Whether to show a border around the slider.
     * Default: false
     */
    border?: boolean
    /**
     * Minimum and maximum values - inclusive.
     */
    range?: [number, number]
    /**
     * Current position of the slider, should be within the range
     */
    value?: number
    onChange?: (value: number) => void
  }

export class Slider extends View {
  // styles
  #direction: Direction = 'horizontal'
  #border: boolean = false
  #buttons: boolean = false

  // position of slider
  #range: [number, number] = [0, 0]
  #value: number = 0
  #step: number = 1

  // mouse information
  #contentSize?: Size = Size.zero
  #isPressingDecrease = false
  #isPressingIncrease = false
  /**
   * If true, no slider drag events should trigger
   */
  #didStartPressOnButton = false
  #isHoverSlider = false
  #isHoverButtons = false
  #onChange?: (value: number) => void

  constructor(props: Props) {
    super(props)
    this.#update(props)
  }

  update(props: Props) {
    this.#update(props)
    super.update(props)
  }

  #update({direction, border, buttons, range, value, step, onChange}: Props) {
    this.#direction = direction ?? 'horizontal'
    this.#border = border ?? false
    this.#buttons = buttons ?? false
    this.#range = range ?? [0, 1]
    this.#value = value ?? Math.min(...this.#range)
    this.#step = step ? Math.max(step, 1) : 1
    this.#onChange = onChange
  }

  naturalSize(available: Size) {
    if (this.#direction === 'horizontal') {
      const minWidth = MIN + 2 * (this.#buttons ? 3 : this.#border ? 1 : 0)
      if (this.#border) {
        //╭─┬──
        //│◃│█╶
        //╰─┴──
        // ╭──
        // │█╶
        // ╰──
        return new Size(minWidth, 3)
      } else {
        // [◃]
        // █╶─
        return new Size(minWidth, 1)
      }
    } else {
      const minHeight =
        MIN +
        2 *
          (this.#buttons && this.#border
            ? 3
            : this.#buttons || this.#border
              ? 1
              : 0)
      if (this.#border) {
        // ╭─╮
        // │▵│
        // ├─┤ ╭─╮
        // │█│ │█│
        // │╷│ │╷│
        return new Size(3, MIN)
      } else {
        // ▵
        // █   █
        // ╷   ╷
        return new Size(1, MIN)
      }
    }
  }

  receiveMouse(event: MouseEvent) {
    if (this.#contentSize === undefined) {
      return
    }

    if (isMouseExit(event)) {
      this.#isHoverSlider = false
      this.#isHoverButtons = false
      return
    }

    const prev = this.#value
    let pos: number,
      isValid: boolean,
      // the beginning of the slider area
      minSlider = 0,
      // the smaller dimension, ie the height of the horizontal slider
      smallSize = this.#border ? 3 : 1,
      // the bigger dimension, ie the width of the horizontal slider
      bigSize: number,
      // the end of the slider area
      maxSlider: number

    if (this.#direction === 'horizontal') {
      isValid = event.position.y <= smallSize
      pos = event.position.x
      bigSize = this.#contentSize.width
    } else {
      isValid = event.position.x <= smallSize
      pos = event.position.y
      bigSize = this.#contentSize.height
    }

    if (!isValid) {
      return
    }

    maxSlider = bigSize - 1

    if (this.#buttons) {
      if (this.#direction === 'horizontal') {
        //╭─┬
        //│◃│ or [◃]
        //╰─┴
        minSlider += 3
        maxSlider -= 3
      } else if (this.#border) {
        // ╭─╮
        // │▵│
        // ├─┤
        minSlider += 3
        maxSlider -= 3
      } else {
        // ▵
        minSlider += 1
        maxSlider -= 1
      }
    } else if (this.#border) {
      //╭
      //│ or ╭─╮
      //╰
      minSlider += 1
      maxSlider -= 1
    }

    const isHoverDecrease = pos >= 0 && pos < minSlider
    const isHoverIncrease = pos > maxSlider && pos < bigSize

    if (isMouseMove(event)) {
      this.#isHoverSlider = pos >= minSlider && pos <= maxSlider

      this.#isHoverButtons = isHoverDecrease || isHoverIncrease
    }

    if (pos < minSlider) {
      if (isMousePressStart(event)) {
        this.#isPressingDecrease = true
        this.#didStartPressOnButton = true
      } else if (isMousePressExit(event)) {
        this.#isPressingDecrease = false
      }

      if (isMouseClicked(event) && pos < minSlider) {
        this.#value -= this.#step
      }
    } else if (pos > maxSlider) {
      if (isMousePressStart(event)) {
        this.#isPressingIncrease = true
        this.#didStartPressOnButton = true
      } else if (isMousePressExit(event)) {
        this.#isPressingIncrease = false
      }

      if (isMouseClicked(event) && pos > maxSlider) {
        this.#value += this.#step
      }
    } else if (!this.#didStartPressOnButton) {
      if (isMouseDragging(event)) {
        this.#value = interpolate(pos, [minSlider, maxSlider], this.#range)

        if (~~this.#step === this.#step) {
          this.#value =
            Math.round((this.#value - this.#range[0]) / this.#step) * this.#step
        }
      }
    }

    if (isMousePressEnd(event)) {
      this.#didStartPressOnButton = false
    }

    this.#value = Math.min(
      this.#range[1],
      Math.max(this.#range[0], this.#value),
    )

    if (this.#value !== prev) {
      this.#onChange?.(this.#value)
    }
  }

  #renderHorizontal(
    viewport: Viewport,
    sliderStyle: Style,
    buttonStyle: Style,
  ) {
    const hasBorder = this.#border && viewport.contentSize.height >= 3
    const height = hasBorder ? 3 : 1
    const marginX = this.#buttons ? 3 : hasBorder ? 1 : 0
    const outerRect = new Rect(
      [0, 0],
      [viewport.visibleRect.size.width, height],
    )
    const innerRect = new Rect(
      [marginX, 0],
      [viewport.visibleRect.size.width - 2 * marginX, height],
    )

    if (this.#buttons) {
      const left = this.#isHoverButtons ? '◂' : '◃'
      const right = this.#isHoverButtons ? '▸' : '▹'
      ;(hasBorder ? ['╭─┬', `│${left}│`, '╰─┴'] : [`[${left}]`]).forEach(
        (line, offsetY) => {
          viewport.write(line, Point.zero.offset(0, offsetY), buttonStyle)
        },
      )
      ;(hasBorder ? ['┬─╮', `│${right}│`, '┴─╯'] : [`[${right}]`]).forEach(
        (line, offsetY) => {
          viewport.write(
            line,
            Point.zero.offset(
              viewport.contentSize.width - line.length,
              offsetY,
            ),
            buttonStyle,
          )
        },
      )
    } else if (hasBorder) {
      ;['╭', '│', '╰'].forEach((char, offsetY) => {
        viewport.write(char, Point.zero.offset(0, offsetY), sliderStyle)
      })
      ;['╮', '│', '╯'].forEach((char, offsetY) => {
        viewport.write(
          char,
          Point.zero.offset(viewport.contentSize.width - 1, offsetY),
          sliderStyle,
        )
      })
    }

    const min = innerRect.minX(),
      max = innerRect.maxX()
    const position = Math.round(
      interpolate(this.#value, this.#range, [min, max - 1]),
    )

    viewport.registerMouse(['mouse.move', 'mouse.button.left'], outerRect)

    innerRect.forEachPoint(pt => {
      let char: string
      if (height === 1 || pt.y === 1) {
        if (pt.x === position) {
          char = '█'
        } else if (
          (pt.x === min && position === min + 1) ||
          (pt.x === max && position === max - 1)
        ) {
          char = '∙'
        } else if (pt.x === min || pt.x === position + 1) {
          char = '╶'
        } else if (pt.x === max || pt.x === position - 1) {
          char = '╴'
        } else {
          char = '─'
        }
      } else {
        char = '─'
      }

      viewport.write(char, pt, sliderStyle)
    })
  }

  #renderVertical(viewport: Viewport, sliderStyle: Style, buttonStyle: Style) {
    const hasBorder = this.#border && viewport.contentSize.width >= 3
    const width = hasBorder ? 3 : 1
    const marginY =
      this.#buttons && hasBorder ? 3 : this.#buttons || hasBorder ? 1 : 0
    const outerRect = new Rect(
      [0, 0],
      [width, viewport.visibleRect.size.height],
    )
    const innerRect = new Rect(
      [0, marginY],
      [width, viewport.visibleRect.size.height - 2 * marginY],
    )

    if (this.#buttons) {
      const up = this.#isHoverButtons ? '▴' : '▵'
      const down = this.#isHoverButtons ? '▾' : '▿'
      ;(hasBorder ? ['╭─╮', `│${up}│`, '├─┤'] : [up]).forEach(
        (line, offsetY) => {
          viewport.write(line, Point.zero.offset(0, offsetY), buttonStyle)
        },
      )
      ;(hasBorder ? ['╰─╯', `│${down}│`, '├─┤'] : [down]).forEach(
        (line, offsetY) => {
          viewport.write(
            line,
            Point.zero.offset(0, viewport.contentSize.height - offsetY - 1),
            buttonStyle,
          )
        },
      )
    } else if (hasBorder) {
      viewport.write('╭─╮', Point.zero.offset(0, 0), sliderStyle)
      viewport.write(
        '╰─╯',
        Point.zero.offset(0, viewport.contentSize.height - 1),
        sliderStyle,
      )
    }

    const min = innerRect.minY(),
      max = innerRect.maxY()
    const position = Math.round(
      interpolate(this.#value, this.#range, [min, max - 1]),
    )

    viewport.registerMouse(['mouse.move', 'mouse.button.left'], outerRect)
    innerRect.forEachPoint(pt => {
      let char: string
      if (width === 1 || pt.x === 1) {
        if (pt.y === position) {
          char = '█'
          // } else if (
          //   (pt.y === min && position === min + 1) ||
          //   (pt.y === max && position === max - 1)
          // ) {
          //   char = '∙'
        } else if (pt.y === position + 1) {
          char = '╷'
        } else if (pt.y === position - 1) {
          char = '╵'
        } else {
          char = '│'
        }
      } else {
        char = '│'
      }

      viewport.write(char, pt, sliderStyle)
    })
  }

  render(viewport: Viewport) {
    if (viewport.isEmpty) {
      return
    }

    this.#contentSize = viewport.contentSize

    const pt = Point.zero.mutableCopy()
    const sliderStyle = this.theme.ui({isHover: this.#isHoverSlider})
    const buttonStyle = this.theme.ui({
      isPressed: this.#isPressingIncrease || this.#isPressingDecrease,
      isHover: this.#isHoverButtons,
    })

    if (this.#direction === 'horizontal') {
      this.#renderHorizontal(viewport, sliderStyle, buttonStyle)
    } else {
      this.#renderVertical(viewport, sliderStyle, buttonStyle)
    }
  }
}
