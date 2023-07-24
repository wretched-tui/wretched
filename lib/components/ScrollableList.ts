import type {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'
import {View} from '../View'
import {Container} from '../Container'
import {Style} from '../Style'
import {Rect, Point, Size, interpolate} from '../geometry'
import type {MouseEvent} from '../events'

interface Props extends ViewProps {
  cellAtIndex: (row: number) => View | undefined
  showScrollbars?: boolean
}

interface ContentOffset {
  row: number
  offset: number
}

export class ScrollableList extends Container {
  /**
   * Your function here need not return "stable" views; the views returned by this
   * function will be cached until you call `scrollableList.invalidateCache()` or
   * `scrollableList.invalidateRow(row)`.
   */
  cellAtIndex: (row: number) => View | undefined

  #showScrollbars: boolean
  #heights: [number, number, number] = [0, 0, 0]
  #contentOffset: ContentOffset
  #contentSize: Size
  #maxWidth: number = 0
  #viewCache: Map<number, View> = new Map()
  #sizeCache: Map<number, Size> = new Map()

  constructor({cellAtIndex, showScrollbars, ...viewProps}: Props) {
    super(viewProps)
    this.#showScrollbars = showScrollbars ?? true
    this.#contentOffset = {row: 0, offset: 0}
    this.cellAtIndex = cellAtIndex
    this.#contentSize = Size.zero
  }

  /**
   * Tells ScrollableList to re-fetch the visible rows.
   */
  invalidateCache() {
    this.#viewCache = new Map()
    this.#sizeCache = new Map()
  }

  /**
   * Tells ScrollableList to refetch a specific row.
   */
  invalidateRow(row: number) {
    this.#viewCache.delete(row)
    this.#sizeCache.delete(row)
  }

  receiveMouse(event: MouseEvent) {
    if (event.name === 'mouse.wheel.up') {
      this.scrollBy(-1)
    } else if (event.name === 'mouse.wheel.down') {
      this.scrollBy(1)
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
  scrollBy(offset: number) {
    if (offset === 0) {
      return
    }

    this.invalidateSize()

    const {row, offset: currentOffset} = this.#contentOffset

    let height = this.sizeForRow(row, this.#contentSize.width)?.height
    if (height === undefined) {
      this.#contentOffset = {row: 0, offset: 0}
      return
    }

    // prevent scrolling if there is no more content
    if (offset > 0) {
      const doScroll = this.#checkScrollDown(row, currentOffset, height)
      if (!doScroll) {
        return
      }
    } else if (row === 0 && currentOffset >= 0) {
      // no helper function necessary here - if offset < 0, do not scroll if we are
      // already at the top
      return
    }

    let nextOffset = currentOffset - offset
    if (nextOffset <= -height) {
      this.#contentOffset = this.#scrollDownToNextRow(row, nextOffset, height)
    } else if (nextOffset > 0) {
      this.#contentOffset = this.#scrollUpToPrevRow(row, nextOffset, height)
    } else {
      this.#contentOffset = {row: row, offset: nextOffset}
    }
  }

  viewForRow(row: number): View | undefined {
    let view = this.#viewCache.get(row)
    if (!view) {
      view = this.cellAtIndex(row)
      if (view) {
        this.#viewCache.set(row, view)
      }
    }

    return view
  }

  sizeForRow(row: number, contentWidth: number, view: View): Size
  sizeForRow(row: number, contentWidth: number): Size | undefined
  sizeForRow(row: number, contentWidth: number, view?: View): Size | undefined {
    if (contentWidth === this.#contentSize.width) {
      const size = this.#sizeCache.get(row)
      if (size !== undefined) {
        return size
      }
    }

    view = view ?? this.viewForRow(row)
    if (view === undefined) {
      return undefined
    }

    const size = view.intrinsicSize(new Size(contentWidth, 0))
    if (contentWidth === this.#contentSize.width) {
      this.#sizeCache.set(row, size)
    }
    return size
  }

  intrinsicSize(size: Size): Size {
    let row = Math.max(0, this.#contentOffset.row)
    let y = this.#contentOffset.offset

    while (y < size.height) {
      const view = this.viewForRow(row)
      if (!view) {
        break
      }

      const rowSize = this.sizeForRow(row, size.width, view)
      this.#maxWidth = Math.max(this.#maxWidth, rowSize.width)
      y += rowSize.height
      row += 1
    }

    return new Size(
      this.#maxWidth + (this.#showScrollbars ? 1 : 0),
      size.height,
    )
  }

  render(viewport: Viewport) {
    viewport.registerMouse('mouse.wheel')

    const prevRows = new Set(this.children)
    const visibleRows = new Set<View>()
    let row = Math.max(0, this.#contentOffset.row)
    this.#contentSize = viewport.contentSize
    if (this.#showScrollbars) {
      this.#contentSize = this.#contentSize.shrink(1, 0)
    }
    const cellWidth = this.#contentSize.width

    let heights: [number, number, number] = [0, 0, 0]

    if (this.#showScrollbars) {
      for (let i = 0; i < row; i++) {
        heights[0] += this.sizeForRow(i, cellWidth)?.height ?? 0
      }
      heights[1] = heights[0]
    }

    let y = this.#contentOffset.offset
    while (y < viewport.contentSize.height) {
      const view = this.viewForRow(row)
      if (!view) {
        break
      }

      const height = this.sizeForRow(row, cellWidth, view)?.height
      row += 1
      heights[1] += height

      if (view.parent !== this) {
        this.add(view)
      }

      visibleRows.add(view)

      if (
        y < viewport.visibleRect.maxY() &&
        y + height >= viewport.visibleRect.minY()
      ) {
        const rect = new Rect(new Point(0, y), new Size(cellWidth, height))
        viewport.clipped(rect, inside => {
          view.render(inside)
        })
      }

      y += height
      if (y >= viewport.contentSize.height) {
        break
      }
    }

    for (const prevRow of prevRows) {
      if (!visibleRows.has(prevRow)) {
        this.remove(prevRow)
      }
    }

    if (this.#showScrollbars) {
      heights[2] = heights[1]
      for (let i = row; i < 100000; i++) {
        const rowHeight = this.sizeForRow(i, cellWidth)?.height
        if (rowHeight === undefined) {
          break
        }
        heights[2] += rowHeight
      }

      for (let y = 0; y < viewport.contentSize.height; y++) {
        const h = interpolate(
          y,
          [0, viewport.contentSize.height - 1],
          [0, heights[2]],
        )
        const inRange = ~~h >= heights[0] && ~~h <= heights[1]
        viewport.write(
          inRange ? '█' : ' ',
          new Point(cellWidth, y),
          new Style(
            inRange
              ? {
                  foreground: this.theme.highlight,
                  background: this.theme.highlight,
                }
              : {
                  foreground: this.theme.darken,
                  background: this.theme.darken,
                },
          ),
        )
      }
    }
  }

  /**
   * Returns 'true' if the scroll should be allowed, returns 'false' if there
   * is no more content to be shown (do not scroll down)
   */
  #checkScrollDown(row: number, currentOffset: number, height: number) {
    // add heights of visible cells – if we run out of cells before
    // y > this.contentSize, exit. Otherwise, scroll.
    let y = currentOffset
    let nextRow = row
    let nextHeight: number | undefined = height
    while (nextHeight !== undefined) {
      y += nextHeight
      if (y > this.#contentSize.height) {
        return true
      }
      nextHeight = this.sizeForRow(++nextRow, this.#contentSize.width)?.height
      if (nextHeight === undefined) {
        return false
      }
    }
  }

  #scrollDownToNextRow(row: number, nextOffset: number, height: number) {
    let nextRow = row
    while (nextOffset <= -height) {
      const nextHeight = this.sizeForRow(
        nextRow + 1,
        this.#contentSize.width,
      )?.height
      if (nextHeight === undefined) {
        nextOffset = -height
        break
      }
      nextOffset += height
      height = nextHeight
      nextRow += 1
    }

    return {row: nextRow, offset: nextOffset}
  }

  #scrollUpToPrevRow(row: number, nextOffset: number, height: number) {
    let nextRow = row
    while (nextOffset > 0) {
      const nextHeight = this.sizeForRow(
        nextRow - 1,
        this.#contentSize.width,
      )?.height
      if (nextHeight === undefined) {
        nextOffset = 0
        break
      }
      height = nextHeight
      nextOffset -= height
      nextRow -= 1
    }

    return {row: nextRow, offset: nextOffset}
  }
}
