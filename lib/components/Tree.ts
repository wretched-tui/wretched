import type {Viewport} from '../Viewport'

import {type Props as ViewProps, View} from '../View'
import {Container} from '../Container'
import {Rect, Point, Size} from '../geometry'
import {
  type MouseEvent,
  isMousePressed,
  isMouseReleased,
  isMouseEnter,
  isMouseExit,
  isMouseClicked,
} from '../events'
import {Style} from '../Style'

type RenderFn<T> = (data: T) => View
type GetChildrenFn<T> = (item: T) => T[]

interface StyleProps<T> {
  isSelectable?: boolean
  // isSelected?: boolean
  data: T[]
  render: RenderFn<T>
  getChildren: GetChildrenFn<T>
  titleView: View
}

type Props<T> = StyleProps<T> & ViewProps
type ChildProps<T> = Props<T> & {
  isLast: boolean
  isExpanded?: boolean
}

const TREE_BULLET_WIDTH = 4

export class Tree<T> extends Container {
  #isSelectable = false
  // #isSelected = false
  #titleView?: View
  #itemViews: [T, TreeChild<T>][] = []
  #data: T[] = []
  #render?: RenderFn<T>
  #getChildren: GetChildrenFn<T> = () => []
  declare isExpanded: boolean

  constructor(props: Props<T>) {
    super(props)

    this.#update(props)

    Object.defineProperties(this, {
      isExpanded: {
        enumerable: true,
        get: () => this._isExpanded(),
      },
    })
  }

  /**
   * The top level Tree is always expanded, child trees are collapsible
   */
  _isExpanded() {
    return true
  }

  isEmpty() {
    return this.#data.length === 0
  }

  update(props: Props<T>) {
    this.#update(props)
    super.update(props)
  }

  #update({
    titleView,
    // isSelected,
    isSelectable,
    data,
    render,
    getChildren,
  }: Props<T>) {
    if (titleView && titleView !== this.#titleView) {
      this.#titleView?.removeFromParent()

      this.add(titleView)
      this.#titleView = titleView
    }

    this.#isSelectable = isSelectable ?? false
    // this.#isSelected = isSelectable === true ? isSelected ?? false : false
    this.#data = data
    this.#render = render
    this.#getChildren = getChildren

    const prevTrees: [T, TreeChild<T>][] = this.#itemViews
    const removeTrees: TreeChild<T>[] = []
    const nextTrees: [T, TreeChild<T>][] = []
    let insertIndex = this.#titleView ? 1 : 0
    for (let index = 0; index < data.length; index++) {
      const item = data[index]
      const itemView = render(item)
      const childData = getChildren(item)

      const isLast = item === data[data.length - 1]
      const [prevData, prevView] =
        prevTrees.length > index ? prevTrees[index] : []
      let tree: TreeChild<T>
      if (prevData === data && prevView) {
        tree = prevView
        tree.isLast = isLast
      } else {
        if (prevView) {
          removeTrees.push(prevView)
        }
        tree = new TreeChild({
          titleView: itemView,
          // isSelected: false,
          isSelectable,
          isExpanded: false,
          isLast,
          data: childData,
          render,
          getChildren,
        })
      }

      insertIndex += 1
      this.add(tree, insertIndex)
      nextTrees.push([item, tree])
    }

    for (const prevView of removeTrees) {
      this.removeChild(prevView)
    }

    this.#itemViews = nextTrees
  }

  naturalSize(availableSize: Size): Size {
    const size = Size.zero.mutableCopy()
    if (this.#titleView) {
      const titleSize = this.#titleView.naturalSize(availableSize)
      size.width = titleSize.width
      size.height = titleSize.height
    }

    if (!this.isExpanded) {
      return size
    }

    const remainingSize = availableSize.mutableCopy()

    for (const [item, tree] of this.#itemViews) {
      remainingSize.height = Math.max(0, availableSize.height - size.height)

      const itemSize = tree.naturalSize(remainingSize)
      size.width = Math.max(size.width, itemSize.width)
      size.height += itemSize.height
    }

    return size
  }

  render(viewport: Viewport) {
    const titleView = this.#titleView
    const titleSize = titleView?.naturalSize(viewport.contentSize) ?? Size.zero
    if (titleView) {
      viewport.clipped(new Rect(Point.zero, titleSize), inside =>
        titleView.render(inside),
      )
    }

    if (!this.isExpanded || this.#itemViews.length === 0) {
      return
    }

    const remainingSize = viewport.contentSize
      .shrink(0, titleSize.height)
      .mutableCopy()
    const offset = new Point(0, titleSize.height)

    viewport.clipped(new Rect(offset, remainingSize), inside => {
      const origin = Point.zero.mutableCopy()
      const views = [...this.#itemViews]
      for (const [, tree] of views) {
        if (origin.y > inside.contentSize.height) {
          break
        }

        const treeSize = tree.naturalSize(remainingSize)
        const treeRect = new Rect(origin, treeSize)
        inside.clipped(treeRect, inside => tree.render(inside))

        remainingSize.height -= treeSize.height
        origin.y += treeSize.height
      }
    })
  }
}

class TreeChild<T> extends Tree<T> {
  #isExpanded = false
  #isPressed = false
  #isHover = false

  isLast = true

  constructor(props: ChildProps<T>) {
    super(props)

    this.#update(props)
  }

  _isExpanded() {
    return this.#isExpanded
  }

  isPressed() {
    return this.#isPressed
  }

  isHover() {
    return this.#isHover
  }

  update(props: ChildProps<T>) {
    this.#update(props)
    super.update(props)
  }

  #update({isExpanded, isLast, data}: ChildProps<T>) {
    this.#isExpanded = data.length === 0 ? true : isExpanded ?? true
    this.isLast = isLast
  }

  receiveMouse(event: MouseEvent) {
    if (isMousePressed(event)) {
      this.#isPressed = true
    } else if (isMouseReleased(event)) {
      this.#isPressed = false

      if (isMouseClicked(event) && !this.isEmpty()) {
        this.#isExpanded = !this.#isExpanded
        this.invalidateSize()
      }
    }

    if (isMouseEnter(event)) {
      this.#isHover = true
    } else if (isMouseExit(event)) {
      this.#isHover = false
    }
  }

  naturalSize(availableSize: Size): Size {
    const size = super.naturalSize(availableSize).mutableCopy()
    size.width += TREE_BULLET_WIDTH

    return size
  }

  render(viewport: Viewport) {
    const treeSize = this.naturalSize(viewport.contentSize).shrink(
      TREE_BULLET_WIDTH,
      0,
    )
    const treeRect = new Rect(new Point(TREE_BULLET_WIDTH, 0), treeSize)

    if (!this.isEmpty()) {
      viewport.registerMouse(['mouse.move', 'mouse.button.left'])
    }

    let textStyle: Style
    if (this.isPressed() || this.isHover()) {
      textStyle = new Style({bold: true})
    } else {
      textStyle = Style.NONE
    }

    let firstLine: string, middleLine: string, lastLine: string
    if (this.isEmpty()) {
      if (this.isLast) {
        firstLine = '└──╴'
        middleLine = '    '
        lastLine = '    '
      } else {
        firstLine = '├──╴'
        middleLine = '│   '
        lastLine = '│   '
      }
    } else {
      if (this.isLast) {
        firstLine = '└'
        middleLine = '    '
        lastLine = '    '
      } else {
        firstLine = '├'
        middleLine = '│   '
        lastLine = '│   '
      }

      if (this.isExpanded) {
        if (this.isHover()) {
          firstLine += '─╴▾'
        } else if (this.isPressed()) {
          firstLine += '━╸▾'
        } else {
          firstLine += '─╴▿'
        }
      } else {
        if (this.isHover()) {
          firstLine += '─╴▸'
        } else if (this.isPressed()) {
          firstLine += '━╸▸'
        } else {
          firstLine += '─╴▹'
        }
      }
    }

    const origin = Point.zero
    viewport.write(firstLine, origin, textStyle)
    for (let offsetY = 1; offsetY < treeSize.height - 1; offsetY++) {
      viewport.write(middleLine, origin.offset(0, offsetY))
    }
    if (treeSize.height > 1) {
      viewport.write(lastLine, origin.offset(0, treeSize.height - 1))
    }

    viewport.clipped(treeRect, inside => super.render(inside))
  }
}
