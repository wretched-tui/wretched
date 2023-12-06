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

interface StyleProps {
  isCollapsed?: boolean
}

type Props = StyleProps & ViewProps

interface ConstructorProps extends Props {
  collapsedView: View
  expandedView: View
}

export class Collapsible extends Container {
  #collapsedView: View
  #expandedView: View
  #isCollapsed = true
  #isPressed = false
  #isHover = false

  constructor({collapsedView, expandedView, ...props}: ConstructorProps) {
    super(props)

    this.#collapsedView = collapsedView
    this.#expandedView = expandedView

    this.add(collapsedView)
    this.add(expandedView)

    this.#update(props)
  }

  update(props: Props) {
    super.update(props)
    this.#update(props)
  }

  #update({isCollapsed}: Props) {
    this.#isCollapsed = isCollapsed ?? false
  }

  naturalSize(availableSize: Size): Size {
    if (this.#isCollapsed) {
      return this.#collapsedView.naturalSize(availableSize).grow(2, 0)
    } else {
      return this.#expandedView.naturalSize(availableSize).grow(2, 0)
    }
  }

  receiveMouse(event: MouseEvent) {
    if (isMousePressed(event)) {
      this.#isPressed = true
    } else if (isMouseReleased(event)) {
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
    const naturalSize = this.#isCollapsed
      ? this.#collapsedView.naturalSize(contentSize)
      : this.#expandedView.naturalSize(contentSize)
    const offset = new Point(2, 0)

    viewport.write(
      this.#isCollapsed ? '►' : '▼',
      new Point(0, offset.y),
      textStyle,
    )
    viewport.clipped(new Rect(offset, naturalSize), inside => {
      if (this.#isCollapsed) {
        this.#collapsedView.render(inside)
      } else {
        this.#expandedView.render(inside)
      }
    })
  }
}
