import type {Viewport} from '../Viewport'

import {View} from '../View'
import {type Props as ContainerProps, Container} from '../Container'
import {Text} from './Text'
import {Rect, Point, Size} from '../geometry'
import {
  type MouseEvent,
  isMousePressStart,
  isMousePressExit,
  isMouseEnter,
  isMouseExit,
  isMouseClicked,
} from '../events'

interface StyleProps {
  isCollapsed?: boolean
  collapsed?: View
  expanded?: View
}

type Props = StyleProps & ContainerProps

export class Collapsible extends Container {
  /**
   * Also assignable as child-view 0 (this is a React support hack)
   */
  #collapsedView?: View
  /**
   * Also assignable as child-view 1 (this is a React support hack)
   */
  #expandedView?: View

  #isCollapsed = true
  #isPressed = false
  #isHover = false

  constructor(props: Props) {
    super(props)

    this.#update(props)
  }

  update(props: Props) {
    this.#update(props)
    super.update(props)
  }

  add(child: View, at?: number) {
    super.add(child, at)
    this.#collapsedView = this.children[0]
    this.#expandedView = this.children[1]
  }

  removeChild(remove: View) {
    super.removeChild(remove)
    this.#collapsedView = this.children[0]
    this.#expandedView = this.children[1]
  }

  #update({
    isCollapsed,
    collapsed: collapsedView,
    expanded: expandedView,
  }: Props) {
    this.#isCollapsed = isCollapsed ?? true

    // edge case: expandedView is being assigned, but not collapsedView
    if (expandedView && !this.#collapsedView && !collapsedView) {
      collapsedView = new Text()
    }

    if (collapsedView && collapsedView !== this.#collapsedView) {
      this.#collapsedView?.removeFromParent()

      this.add(collapsedView, 0)
    }

    if (expandedView && expandedView !== this.#expandedView) {
      this.#expandedView?.removeFromParent()

      this.add(expandedView, 1)
    }
  }

  naturalSize(available: Size): Size {
    let size: Size | undefined
    if (this.#isCollapsed) {
      size = this.#collapsedView?.naturalSize(available)
    } else {
      size = this.#expandedView?.naturalSize(available)
    }

    return (size ?? Size.zero).grow(2, 0)
  }

  receiveMouse(event: MouseEvent) {
    if (isMousePressStart(event)) {
      this.#isPressed = true
    } else if (isMousePressExit(event)) {
      this.#isPressed = false

      if (isMouseClicked(event)) {
        this.#isCollapsed = !this.#isCollapsed
        this.invalidateSize()
      }
    }

    if (isMouseEnter(event)) {
      this.#isHover = true
    } else if (isMouseExit(event)) {
      this.#isHover = false
    }
  }

  render(viewport: Viewport) {
    if (viewport.isEmpty) {
      return super.render(viewport)
    }

    viewport.registerMouse(['mouse.button.left', 'mouse.move'])

    const textStyle = this.theme.text({
      isPressed: this.#isPressed,
      isHover: this.#isHover,
    })

    viewport.paint(textStyle)

    const contentSize = viewport.contentSize.shrink(2, 0)
    const naturalSize =
      (this.#isCollapsed
        ? this.#collapsedView?.naturalSize(contentSize)
        : this.#expandedView?.naturalSize(contentSize)) ?? Size.zero
    const offset = new Point(2, 0)

    viewport.write(
      this.#isCollapsed ? '►' : '▼',
      new Point(0, offset.y),
      textStyle,
    )
    viewport.clipped(new Rect(offset, naturalSize), inside => {
      if (this.#isCollapsed) {
        this.#collapsedView?.render(inside)
      } else {
        this.#expandedView?.render(inside)
      }
    })
  }
}
