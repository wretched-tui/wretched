import type {Viewport} from '../Viewport'
import {type Props as ContainerProps, Container} from '../Container'
import {Point, Rect, Size, interpolate} from '../geometry'
import {type MouseEvent} from '../events'
import {Style} from '../Style'

interface Props extends ContainerProps {
  /**
   * Show/hide the scrollbars
   * @default true
   */
  showScrollbars?: boolean
  /**
   * How many rows to scroll by when using the mouse wheel.
   * @default 1
   */
  scrollHeight?: number
}

interface ContentOffset {
  x: number
  y: number
}

/**
 * Scrollable is meant to scroll _a single view_, ie a Flow view. But all the
 * container views are optimized to check their _visibleRect_, and won't render
 * children that are not in view, saving some CPU cycles.
 */
export class Scrollable extends Container {
  #showScrollbars: boolean = true
  #scrollHeight: number = 1
  #contentOffset: ContentOffset
  #contentSize?: Size
  #visibleSize?: Size

  constructor(props: Props) {
    super(props)

    this.#contentOffset = {x: 0, y: 0}
    this.#update(props)
  }

  update(props: Props) {
    this.#update(props)
    super.update(props)
  }

  #update({scrollHeight, showScrollbars}: Props) {
    this.#showScrollbars = showScrollbars ?? true
    this.#scrollHeight = scrollHeight ?? 1
  }

  naturalSize(availableSize: Size) {
    const size = super.naturalSize(availableSize)
    return size
  }

  receiveMouse(event: MouseEvent) {
    let delta = 0
    if (event.name === 'mouse.wheel.up') {
      delta = this.#scrollHeight * -1
    } else if (event.name === 'mouse.wheel.down') {
      delta = this.#scrollHeight
    }

    if (event.ctrl) {
      delta *= 5
    }

    if (event.shift) {
      this.scrollBy(delta, 0)
    } else {
      this.scrollBy(0, delta)
    }
  }

  /**
   * Moves the visible region. The visible region is stored as a pointer to the
   * top-most row and an offset from the top of that row (see `interface ContentOffset`)
   *
   * Positive offset scrolls *down* (currentOffset goes more negative)
   *
   * When current cell is entirely above the top, we set the `contentOffset` to the
   * row that is at the top of the screen and still visible, similarly if the current
   * cell is below the top, we fetch enough rows about and update the `contentOffset`
   * to point to the top-most row.
   */
  scrollBy(offsetX: number, offsetY: number) {
    if (
      (offsetX === 0 && offsetY === 0) ||
      this.#contentSize === undefined ||
      this.#visibleSize === undefined
    ) {
      return
    }

    let {x, y} = this.#contentOffset
    const maxX = this.#visibleSize.width - this.#contentSize.width
    const maxY = this.#visibleSize.height - this.#contentSize.height
    x = Math.min(0, Math.max(maxX, x - offsetX))
    y = Math.min(0, Math.max(maxY, y - offsetY))
    this.#contentOffset = {x, y}
  }

  get contentSize(): Size {
    const delta = this.#showScrollbars ? 1 : 0
    return super.contentSize.shrink(delta, delta)
  }

  render(viewport: Viewport) {
    viewport.registerMouse('mouse.wheel')

    let contentSize = Size.zero.mutableCopy()
    for (const child of this.children) {
      const childSize = child.naturalSize(viewport.contentSize)
      contentSize.width = Math.max(contentSize.width, childSize.width)
      contentSize.height = Math.max(contentSize.height, childSize.height)
    }

    const tooWide = contentSize.width > viewport.contentSize.width
    const tooTall = contentSize.height > viewport.contentSize.height

    // #contentOffset is _negative_ (indicates the amount to move the view away
    // from the origin, which will always be up/left of 0,0)
    const outside = new Rect(
      [this.#contentOffset.x, this.#contentOffset.y],
      viewport.contentSize
        .shrink(this.#contentOffset.x, this.#contentOffset.y)
        .shrink(
          this.#showScrollbars && tooWide ? 1 : 0,
          this.#showScrollbars && tooTall ? 1 : 0,
        ),
    )
    viewport.clipped(outside, inside => {
      for (const child of this.children) {
        child.render(inside)
      }
    })

    this.#visibleSize = viewport.visibleRect.size.shrink(
      tooWide ? 1 : 0,
      tooTall ? 1 : 0,
    )
    this.#contentSize = contentSize

    if (this.#showScrollbars && (tooWide || tooTall)) {
      // scrollMaxX: x of the last column of the view
      // scrollMaxY: y of the last row of the view
      // scrollMaxHorizX: horizontal scroll bar is drawn from 0 to scrollMaxHorizX
      // scrollMaxHorizY: vertical scroll bar is drawn from 0 to scrollMaxHorizY
      const scrollMaxX = viewport.contentSize.width - 1,
        scrollMaxY = viewport.contentSize.height - 1,
        scrollMaxHorizX = scrollMaxX - (tooTall ? 1 : 0),
        scrollMaxVertY = scrollMaxX - (tooWide ? 1 : 0)
      if (tooWide && tooTall) {
        viewport.write('X', new Point(scrollMaxX, scrollMaxY))
      }

      if (tooWide) {
        viewport.registerMouse(
          'mouse.button.left',
          new Rect(new Point(0, scrollMaxY), new Size(scrollMaxHorizX + 1, 1)),
        )
        for (let x = 0; x <= scrollMaxHorizX; x++) {
          const w = interpolate(x, [0, scrollMaxHorizX], [0, contentSize.width])
          const inRange =
            ~~w >= -this.#contentOffset.x &&
            ~~w <= -this.#contentOffset.x + viewport.contentSize.width
          viewport.write(
            inRange ? '█' : ' ',
            new Point(x, scrollMaxY),
            new Style(
              inRange
                ? {
                    foreground: this.theme.highlightColor,
                    background: this.theme.highlightColor,
                  }
                : {
                    foreground: this.theme.darkenColor,
                    background: this.theme.darkenColor,
                  },
            ),
          )
        }
      }

      if (tooTall) {
        viewport.registerMouse(
          'mouse.button.left',
          new Rect(new Point(scrollMaxX, 0), new Size(1, scrollMaxVertY + 1)),
        )

        for (let y = 0; y < scrollMaxVertY; y++) {
          const h = interpolate(y, [0, scrollMaxVertY], [0, contentSize.height])
          const inRange =
            ~~h >= -this.#contentOffset.y &&
            ~~h <= -this.#contentOffset.y + viewport.contentSize.height
          viewport.write(
            inRange ? '█' : ' ',
            new Point(scrollMaxX, y),
            new Style(
              inRange
                ? {
                    foreground: this.theme.highlightColor,
                    background: this.theme.highlightColor,
                  }
                : {
                    foreground: this.theme.darkenColor,
                    background: this.theme.darkenColor,
                  },
            ),
          )
        }
      }
    }
  }
}
