import type {Viewport} from '../Viewport'
import {View} from '../View'
import {Container} from '../Container'
import {Rect, Point, Size} from '../geometry'

interface Props {
  cellAtIndex: (row: number) => View | undefined
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
  readonly cellAtIndex: (row: number) => View | undefined
  contentOffset: ContentOffset
  contentSize: Size
  #viewCache: Map<number, View> = new Map()

  constructor({cellAtIndex}: Props) {
    super()
    this.contentOffset = {row: 0, offset: 0}
    this.cellAtIndex = cellAtIndex
    this.contentSize = Size.zero
  }

  /**
   * Tells ScrollableList to re-fetch the visible rows.
   */
  invalidateCache() {
    this.#viewCache = new Map()
  }

  /**
   * Tells ScrollableList to refetch a specific row.
   */
  invalidateRow(row: number) {
    this.#viewCache.delete(row)
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

    const {row, offset: currentOffset} = this.contentOffset

    let height = this.heightForRow(row, this.contentSize.width)
    if (height === undefined) {
      this.contentOffset = {row: 0, offset: 0}
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
      this.contentOffset = this.#scrollDownToNextRow(row, nextOffset, height)
    } else if (nextOffset > 0) {
      this.contentOffset = this.#scrollUpToPrevRow(row, nextOffset, height)
    } else {
      this.contentOffset = {row: row, offset: nextOffset}
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

  heightForRow(
    row: number,
    contentWidth: number,
    view?: View,
  ): number | undefined {
    view = view ?? this.viewForRow(row)
    if (view === undefined) {
      return undefined
    }

    const {height} = view.intrinsicSize(new Size(contentWidth, 0))
    return height
  }

  intrinsicSize(size: Size): Size {
    let row = Math.max(0, this.contentOffset.row)
    let y = this.contentOffset.offset
    while (y < size.height) {
      const view = this.viewForRow(row)
      if (!view) {
        break
      }

      let height = this.heightForRow(row, size.width, view)
      if (height === undefined) {
        break
      }
      y += height
      row += 1
    }

    return new Size(size.width, Math.max(y, size.height))
  }

  render(viewport: Viewport) {
    const prevRows = new Set(this.children)
    const visibleRows = new Set<View>()
    let row = Math.max(0, this.contentOffset.row)
    this.contentSize = viewport.contentSize

    let y = this.contentOffset.offset
    while (y < viewport.contentSize.height) {
      const view = this.viewForRow(row)
      if (!view) {
        break
      }

      let height = this.heightForRow(row, viewport.contentSize.width, view)
      if (height === undefined) {
        break
      }

      if (view.parent !== this) {
        this.add(view)
      }

      visibleRows.add(view)

      if (
        y < viewport.visibleRect.maxY() &&
        y + height >= viewport.visibleRect.minY()
      ) {
        const rect = new Rect(
          new Point(0, y),
          new Size(viewport.contentSize.width, height),
        )
        viewport.clipped(rect, inside => {
          view.render(inside)
        })
      }

      y += height
      if (y >= viewport.contentSize.height) {
        break
      }

      row += 1
    }

    for (const prevRow of prevRows) {
      if (!visibleRows.has(prevRow)) {
        this.remove(prevRow)
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
      if (y > this.contentSize.height) {
        return true
      }
      nextHeight = this.heightForRow(++nextRow, this.contentSize.width)
      if (nextHeight === undefined) {
        return false
      }
    }
  }

  #scrollDownToNextRow(row: number, nextOffset: number, height: number) {
    let nextRow = row
    while (nextOffset <= -height) {
      const nextHeight = this.heightForRow(nextRow + 1, this.contentSize.width)
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
      const nextHeight = this.heightForRow(nextRow - 1, this.contentSize.width)
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
