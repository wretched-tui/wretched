import type {Viewport} from '../Viewport'
import {View} from '../View'
import {Rect, Point, Size} from '../geometry'

interface Props {
  cellAtIndex: (row: number) => View | undefined
}

interface ContentOffset {
  row: number
  offset: number
}

export class ScrollableList extends View {
  contentOffset: ContentOffset
  contentSize: Size
  readonly cellAtIndex: (row: number) => View | undefined
  visibleRows: Set<View> = new Set()
  viewCache: Map<number, View> = new Map()

  constructor({cellAtIndex}: Props) {
    super()
    this.contentOffset = {row: 0, offset: 0}
    this.cellAtIndex = cellAtIndex
    this.contentSize = Size.zero
  }

  /**
   * positive offset.y, scroll *down* (currentOffset goes more negative)
   *
   * If we scroll past the height of the current cell, we set the offset to the cell
   * that is at the top of the screen and still visible
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

    if (offset > 0) {
      // add heights of visible cells – if we run out of cells before
      // y > this.contentSize, exit. Otherwise, scroll.
      let y = currentOffset
      let nextRow = row
      let nextHeight: number | undefined = height
      while (nextHeight !== undefined) {
        y += nextHeight
        if (y > this.contentSize.height) {
          break
        }
        nextHeight = this.heightForRow(++nextRow, this.contentSize.width)
        if (nextHeight === undefined) {
          return
        }
      }
    } else if (row === 0 && currentOffset >= 0) {
      return
    }

    let nextOffset = currentOffset - offset
    if (nextOffset <= -height) {
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
      this.contentOffset = {row: nextRow, offset: nextOffset}
    } else if (nextOffset > 0) {
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
      this.contentOffset = {row: nextRow, offset: nextOffset}
    } else {
      this.contentOffset = {row: row, offset: nextOffset}
    }
  }

  viewForRow(row: number): View | undefined {
    let view = this.viewCache.get(row)
    if (!view) {
      view = this.cellAtIndex(row)
      if (view) {
        this.viewCache.set(row, view)
      }
    }

    return view
  }

  heightForRow(row: number, contentWidth: number, view?: View): number | undefined {
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
    const prevRows = new Set(this.visibleRows)
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
        const prevParent = view.parent
        prevParent?.remove(view)
        view.willMoveTo(this)
        view.parent = this
        if (prevParent) {
          view.didMoveFrom(prevParent)
        }

        if (!prevRows.has(view)) {
          view.didMount()
        }
      }

      this.visibleRows.add(view)

      if (y < viewport.visibleRect.maxY() && y + height >= viewport.visibleRect.minY()) {
        const rect = new Rect(new Point(0, y), new Size(viewport.contentSize.width, height))
        const clipped = viewport.clipped(rect)
        view.render(clipped)
      }

      y += height
      if (y >= viewport.contentSize.height) {
        break
      }

      row += 1
    }

    for (const prevRow of prevRows) {
      if (!this.visibleRows.has(prevRow)) {
        prevRow.didUnmount()
      }
    }
  }
}
