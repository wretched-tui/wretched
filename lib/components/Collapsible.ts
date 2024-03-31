import type {Viewport} from '../Viewport'

import {View} from '../View'
import {type Props as ContainerProps, Container} from '../Container'
import {Text} from './Text'
import {Rect, Point, Size} from '../geometry'
import {
  type MouseEvent,
  isMousePressInside,
  isMousePressOutside,
  isMouseEnter,
  isMouseExit,
  isMouseClicked,
} from '../events'

interface StyleProps {
  isCollapsed?: boolean
  collapsedView?: View
  expandedView?: View
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
    if (this.children.length === 0) {
      this.#collapsedView = child
    } else if (this.children.length === 1) {
      this.#expandedView = child
    }

    super.add(child, at)
  }

  #update({isCollapsed, collapsedView, expandedView}: Props) {
    this.#isCollapsed = isCollapsed ?? true

    // edge case: expandedView is being assigned, but not collapsedView
    if (expandedView && !this.#collapsedView && !collapsedView) {
      collapsedView = new Text()
    }

    if (collapsedView && collapsedView !== this.#collapsedView) {
      this.#collapsedView?.removeFromParent()

      this.#collapsedView = collapsedView
      this.add(collapsedView, 0)
    }

    if (expandedView && expandedView !== this.#expandedView) {
      this.#expandedView?.removeFromParent()

      this.#expandedView = expandedView
      this.add(expandedView, 1)
    }
  }

  naturalSize(availableSize: Size): Size {
    let size: Size | undefined
    if (this.#isCollapsed) {
      size = this.#collapsedView?.naturalSize(availableSize)
    } else {
      size = this.#expandedView?.naturalSize(availableSize)
    }

    return (size ?? Size.zero).grow(2, 0)
  }

  receiveMouse(event: MouseEvent) {
    if (isMousePressInside(event)) {
      this.#isPressed = true
    } else if (isMousePressOutside(event)) {
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
