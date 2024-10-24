import {Viewport} from '../Viewport'
import {type Props as ViewProps, View} from '../View'
import {Point, Size, interpolate} from '../geometry'
import {Style} from '../Style'

type Direction = 'vertical' | 'horizontal'

interface Props extends ViewProps {
  direction?: Direction
  min?: number
  max?: number
  progress?: number
  showPercent?: boolean
}

export class Progress extends View {
  #direction: Direction = 'horizontal'
  #range: [number, number] = [0, 100]
  #progress: number = 0
  #showPercent: boolean = false

  constructor(props: Props) {
    super(props)
    this.#update(props)
  }

  update(props: Props) {
    this.#update(props)
    super.update(props)
  }

  #update({direction, min, max, progress, showPercent}: Props) {
    this.#direction = direction ?? 'horizontal'
    this.#range = [min ?? 0, max ?? 100]
    this.#progress = progress ?? Math.min(...this.#range)
    this.#showPercent = showPercent ?? false
  }

  get progress() {
    return this.#progress
  }
  set progress(progress: number) {
    this.#progress = progress
    this.invalidateRender()
  }

  naturalSize(available: Size) {
    return new Size(available.width, 1)
  }

  render(viewport: Viewport) {
    if (viewport.isEmpty) {
      return
    }

    const pt = Point.zero.mutableCopy()
    const percent = this.#showPercent
      ? `${Math.round(
          (100 * (this.#progress - this.#range[0])) /
            (this.#range[1] - this.#range[0]),
        )}%`
      : ''
    const percentStartPoint = new Point(
      ~~((viewport.contentSize.width - percent.length) / 2),
      viewport.contentSize.height <= 1 ? 0 : 1,
    )
    const textStyle = this.theme.text()
    const controlStyle = this.theme.ui({isHover: true}).invert().merge({
      background: textStyle.background,
    })
    const altTextStyle = new Style({
      foreground: textStyle.foreground,
      background: controlStyle.foreground,
    })
    if (this.#direction === 'horizontal') {
      this.#renderHorizontal(
        viewport,
        percent,
        percentStartPoint,
        textStyle,
        controlStyle,
        altTextStyle,
      )
    } else {
      this.#renderVertical(
        viewport,
        percent,
        percentStartPoint,
        textStyle,
        controlStyle,
        altTextStyle,
      )
    }
  }

  #renderHorizontal(
    viewport: Viewport,
    percent: string,
    percentStartPoint: Point,
    textStyle: Style,
    controlStyle: Style,
    altTextStyle: Style,
  ) {
    const progressX = Math.round(
      interpolate(this.#progress, this.#range, [
        0,
        viewport.contentSize.width - 1,
      ]),
    )

    viewport.visibleRect.forEachPoint(pt => {
      let char: string,
        style = textStyle
      if (
        this.#showPercent &&
        pt.x >= percentStartPoint.x &&
        pt.x - percentStartPoint.x < percent.length &&
        pt.y === percentStartPoint.y
      ) {
        char = percent[pt.x - percentStartPoint.x]
        if (pt.x <= progressX) {
          style = altTextStyle
        } else {
          style = textStyle
        }
      } else {
        if (pt.x <= progressX && this.#progress > this.#range[0]) {
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
            char = '╭'
          } else if (pt.x === viewport.contentSize.width - 1) {
            char = '╮'
          } else {
            char = '─'
          }
        } else if (pt.y === viewport.contentSize.height - 1) {
          if (pt.x === 0) {
            char = '╰'
          } else if (pt.x === viewport.contentSize.width - 1) {
            char = '╯'
          } else {
            char = '─'
          }
        } else if (pt.x === 0 || pt.x === viewport.contentSize.width - 1) {
          char = '│'
        } else {
          char = ' '
        }
      }

      viewport.write(char, pt, style)
    })
  }

  #renderVertical(
    viewport: Viewport,
    percent: string,
    percentStartPoint: Point,
    textStyle: Style,
    controlStyle: Style,
    altTextStyle: Style,
  ) {
    const progressY = Math.round(
      interpolate(this.#progress, this.#range, [
        viewport.contentSize.height - 1,
        0,
      ]),
    )
    viewport.visibleRect.forEachPoint(pt => {
      let char: string,
        style = textStyle
      if (pt.y >= progressY) {
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
          char = '╭'
        } else if (pt.y === viewport.contentSize.height - 1) {
          char = '╰'
        } else {
          char = '│'
        }
      } else if (pt.x === viewport.contentSize.width - 1) {
        if (pt.y === 0) {
          char = '╮'
        } else if (pt.y === viewport.contentSize.height - 1) {
          char = '╯'
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
