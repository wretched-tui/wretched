import {Viewport} from '../Viewport'
import {type Props as ViewProps, View} from '../View'
import {Point, Size, interpolate} from '../geometry'

type Direction = 'vertical' | 'horizontal'

interface Props extends ViewProps {
  direction: Direction
  min?: number
  max?: number
  progress?: number
}

export class Progress extends View {
  #direction: Direction = 'horizontal'
  #range: [number, number] = [0, 100]
  #progress: number = 0

  constructor(props: Props) {
    super(props)
    this.#update(props)
  }

  update(props: Props) {
    this.#update(props)
    super.update(props)
  }

  #update({direction, min, max, progress}: Props) {
    this.#direction = direction
    this.#range = [min ?? 0, max ?? 100]
    this.#progress = progress ?? Math.min(...this.#range)
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
    const pt = Point.zero.mutableCopy()
    const textStyle = this.theme.ui()
    const controlStyle = this.theme.ui({isOrnament: true})
    if (this.#direction === 'horizontal') {
      const position = Math.round(
        interpolate(this.#progress, this.#range, [
          0,
          viewport.contentSize.width - 1,
        ]),
      )
      viewport.visibleRect.forEachPoint(pt => {
        let char: string,
          style = textStyle
        if (pt.x <= position) {
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
        interpolate(this.#progress, this.#range, [
          viewport.contentSize.height - 1,
          0,
        ]),
      )
      viewport.visibleRect.forEachPoint(pt => {
        let char: string,
          style = textStyle
        if (pt.y >= position) {
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
