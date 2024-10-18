import type {Viewport} from '../Viewport'

import {type Props as ViewProps, View} from '../View'
import {Flow} from './Flow'
import {type Props as ContainerProps, Container} from '../Container'
import {Rect, Point, Size, interpolate} from '../geometry'
import {
  type MouseEvent,
  isMousePressInside,
  isMousePressOutside,
  isMouseEnter,
  isMouseExit,
  isMouseMove,
  isMouseClicked,
} from '../events'
import {Style} from '../Style'

type RenderFn<T> = (data: T) => View
type GetChildrenFn<T> = (item: T) => T[]

interface StyleProps<T> {
  isSelectable?: boolean
  isSelected?: boolean
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
  #isSelected = false
  #titleView?: View
  #itemViews: [T, TreeChild<T>][] = []
  #data: T[] = []
  #render?: RenderFn<T>
  #getChildren: GetChildrenFn<T> = () => []
  #contentView = Flow.down()
  _animatedView = new AnimatedHeight({
    child: this.#contentView,
  })
  declare isExpanded: boolean

  constructor(props: Props<T>) {
    super(props)

    this.#update(props)

    this.add(this._animatedView)

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
    isSelectable,
    isSelected,
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
    this.#isSelected = isSelectable === true ? isSelected ?? false : false
    this.#data = data
    this.#render = render
    this.#getChildren = getChildren

    const prevTrees: [T, TreeChild<T>][] = this.#itemViews
    const removeTrees: TreeChild<T>[] = []
    const nextTrees: [T, TreeChild<T>][] = []
    let insertIndex = this.#titleView ? 1 : 0
    // does not support -but should- reordered data
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
          isSelectable,
          isSelected: false,
          isExpanded: false,
          isLast,
          data: childData,
          render,
          getChildren,
        })
      }

      insertIndex += 1
      this.#contentView.add(tree, insertIndex)
      nextTrees.push([item, tree])
    }

    for (const prevView of removeTrees) {
      this.#contentView.removeChild(prevView)
    }

    this.#itemViews = nextTrees
  }

  naturalSize(availableSize: Size): Size {
    let titleSize = Size.zero
    if (this.#titleView) {
      titleSize = this.#titleView.naturalSize(availableSize)
    }

    const remainingSize = availableSize.shrink(0, titleSize.height)
    const contentSize = this._animatedView.naturalSize(remainingSize)
    return new Size(
      Math.max(titleSize.width, contentSize.width),
      titleSize.height + contentSize.height,
    )
  }

  render(viewport: Viewport) {
    if (viewport.isEmpty) {
      return super.render(viewport)
    }

    const titleView = this.#titleView
    const titleSize = titleView?.naturalSize(viewport.contentSize) ?? Size.zero
    if (titleView) {
      viewport.clipped(new Rect(Point.zero, titleSize), inside =>
        titleView.render(inside),
      )
    }

    viewport.clipped(
      viewport.contentRect.inset({top: titleSize.height}),
      inside => this._animatedView.render(inside),
    )
  }
}

class TreeChild<T> extends Tree<T> {
  #isExpanded = false
  #isPressed = false
  #isHover = false

  isLast = true

  constructor(props: ChildProps<T>) {
    super(props)

    Object.defineProperties(this, {
      titleView: {
        enumerable: true,
        get: () => props.titleView,
      },
    })

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
    this._animatedView.isExpanded = this.#isExpanded
    this.isLast = isLast
  }

  receiveMouse(event: MouseEvent) {
    if (isMousePressInside(event)) {
      this.#isPressed = true
    } else if (isMousePressOutside(event)) {
      this.#isPressed = false

      if (isMouseClicked(event) && !this.isEmpty()) {
        const isExpanded = !this.#isExpanded
        this.#isExpanded = isExpanded
        this._animatedView.isExpanded = isExpanded
        this._animatedView.invalidateSize()
        this.invalidateSize()
      }
    }

    if (isMouseEnter(event)) {
      this.#isHover = true
    } else if (isMouseExit(event)) {
      this.#isHover = false
    } else if (isMouseMove(event)) {
      this.#isHover = event.name === 'mouse.move.in'
    }
  }

  naturalSize(availableSize: Size): Size {
    const size = super.naturalSize(availableSize).mutableCopy()
    size.width += TREE_BULLET_WIDTH

    return size
  }

  render(viewport: Viewport) {
    if (viewport.isEmpty) {
      return super.render(viewport)
    }

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

const ANIMATION_DURATION = 160

export class AnimatedHeight extends Container {
  #frameTime = 0

  #startingHeight?: number
  #currentHeight?: number
  #targetHeight?: number

  isExpanded = false

  get contentView(): View | undefined {
    return this.children[0]
  }

  naturalSize(availableSize: Size) {
    if (this.contentView === undefined) {
      return Size.zero
    }

    const nextSize = this.contentView.naturalSize(availableSize)
    const nextHeight = this.isExpanded ? nextSize.height : 0

    if (
      this.#currentHeight === undefined ||
      nextHeight === this.#currentHeight
    ) {
      // if the currentHeight has never been set, start at the initial height.
      // or if the currentHeight is the correct height, no animation necessary
      this.#currentHeight = nextHeight
      this.#startingHeight = this.#targetHeight = undefined

      return new Size(nextSize.width, nextHeight)
    } else if (
      this.#targetHeight !== undefined &&
      nextHeight !== this.#targetHeight
    ) {
      // animation was already in progress, but height changed
      this.#frameTime = ANIMATION_DURATION - this.#frameTime
      this.#startingHeight = this.#targetHeight
      this.#targetHeight = nextHeight
    } else if (
      this.#startingHeight === undefined ||
      this.#targetHeight === undefined
    ) {
      // height changed
      this.#frameTime = 0
      this.#startingHeight = this.#currentHeight
      this.#targetHeight = nextHeight
    }

    const height = interpolate(
      this.#frameTime,
      [0, ANIMATION_DURATION],
      [this.#startingHeight, this.#targetHeight],
    )

    this.#currentHeight = height
    return new Size(nextSize.width, height)
  }

  receiveTick(dt: number): boolean {
    if (
      this.#currentHeight === this.#targetHeight ||
      this.#startingHeight === undefined ||
      this.#targetHeight === undefined
    ) {
      this.#frameTime = 0
      this.#startingHeight = undefined
      this.#targetHeight = undefined
      return false
    }

    this.#frameTime = Math.min(this.#frameTime + dt, ANIMATION_DURATION)
    this.invalidateSize()

    return true
  }

  render(viewport: Viewport) {
    if (!this.contentView) {
      return
    }

    if (viewport.isEmpty) {
      return super.render(viewport)
    }

    if (
      this.#targetHeight !== undefined &&
      this.#currentHeight !== this.#targetHeight
    ) {
      viewport.registerTick()
    }

    this.contentView.render(viewport)
  }
}
