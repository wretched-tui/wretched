import type {Viewport} from '../Viewport'
import {type Props as ViewProps, View} from '../View'
import {Container} from '../Container'
import {Style} from '../Style'
import {Rect, Point, Size} from '../geometry'
import {
  type MouseEvent,
  isMouseClicked,
  isMousePressed,
  isMouseReleased,
  isMouseEnter,
  isMouseExit,
} from '../events'

interface Props extends ViewProps {
  isOpen?: boolean
  onToggle?: (isOpen: boolean) => void
}

interface ConstructorProps extends Props {
  drawerView: View
  contentView: View
}

const DRAWER_BTN_SIZE = new Size(3, 8)
// const GRAY_TEXT = 156
// const GRAY_HOVER = 255

export class Drawer extends Container {
  readonly drawerView: View
  readonly contentView: View

  #isHover = false
  #isPressed = false
  #drawerWidth = 0
  #isOpen = false
  #targetDx = 0
  #currentDx = 0
  #onToggle: Props['onToggle']

  constructor({contentView, drawerView, ...props}: ConstructorProps) {
    super(props)

    this.add((this.drawerView = drawerView))
    this.add((this.contentView = contentView))

    this.#update(props)
  }

  update(props: Props) {
    this.#update(props)
    super.update(props)
  }

  #update({isOpen, onToggle}: Props) {
    if (isOpen !== undefined) {
      this.#setIsOpen(isOpen, false)
    }
    this.#onToggle = onToggle
  }

  /**
   * Not called internally, and so never reports to onToggle
   */
  open() {
    this.#setIsOpen(true, false)
  }

  /**
   * Not called internally, and so never reports to onToggle
   */
  close() {
    this.#setIsOpen(false, false)
  }

  /**
   * Not called internally, and so never reports to onToggle
   */
  toggle() {
    this.#setIsOpen(!this.#isOpen, false)
  }

  #setIsOpen(value: boolean, report: boolean) {
    this.#isOpen = value
    this.#targetDx = value ? this.#drawerWidth : 0
    if (report) {
      this.#onToggle?.(value)
    }
  }

  naturalSize(size: Size): Size {
    const drawerSize = this.drawerView.naturalSize(
      size.shrink(DRAWER_BTN_SIZE.width, 0),
    )
    this.#drawerWidth = drawerSize.width
    if (this.#isOpen) {
      this.#targetDx = this.#drawerWidth
    }

    const contentSize = this.contentView.naturalSize(
      size.shrink(DRAWER_BTN_SIZE.width, 0),
    )

    return new Size(
      Math.max(drawerSize.width, contentSize.width) + DRAWER_BTN_SIZE.width,
      Math.max(contentSize.height, drawerSize.height + 2),
    )
  }

  receiveTick(dt: number) {
    const dx = (this.#targetDx > this.#currentDx ? 0.25 : -0.25) * dt
    const nextDx = Math.max(
      0,
      Math.min(this.#drawerWidth, this.#currentDx + dx),
    )
    if (nextDx !== this.#currentDx) {
      this.#currentDx = nextDx
      return true
    }

    return false
  }

  receiveMouse(event: MouseEvent) {
    if (isMousePressed(event)) {
      this.#isPressed = true
    } else if (isMouseReleased(event)) {
      this.#isPressed = false
    }

    if (isMouseEnter(event)) {
      this.#isHover = true
    } else if (isMouseExit(event)) {
      this.#isHover = false
    }

    if (isMouseClicked(event)) {
      this.#setIsOpen(!this.#isOpen, true)
    }
  }

  render(viewport: Viewport) {
    if (this.#currentDx !== this.#targetDx) {
      viewport.registerTick()
    }

    const drawerButtonRect = new Rect(
      new Point(~~this.#currentDx, 0),
      new Size(2, viewport.contentSize.height),
    )

    const contentRect = new Rect(
      new Point(DRAWER_BTN_SIZE.width, 0),
      viewport.contentSize.shrink(DRAWER_BTN_SIZE.width, 0),
    )

    viewport.clipped(contentRect, inside => {
      this.contentView.render(inside)
    })

    if (this.drawerView && this.#currentDx > 0) {
      const drawerRect = new Rect(
        new Point(this.#currentDx - this.#drawerWidth, 1),
        new Size(this.#drawerWidth, drawerButtonRect.size.height - 2),
      )
      viewport.paint(this.theme.text(), drawerRect)
      viewport.clipped(drawerRect, inside => {
        this.drawerView.render(inside)
      })
    }

    const style = this.theme.text({
      isHover: this.#isHover,
      isPressed: this.#isPressed,
    })
    this.#drawDrawer(viewport, style, drawerButtonRect)
  }

  #drawDrawer(viewport: Viewport, style: Style, rect: Rect) {
    viewport.registerMouse(['mouse.move', 'mouse.button.left'], rect)
    viewport.usingPen(style, () => {
      const minY = 0,
        drawerHeight = rect.size.height,
        drawerX = rect.minX(),
        maxY = rect.maxY(),
        y0 = Math.max(minY, rect.minY()),
        point = new Point(0, y0).mutableCopy(),
        buttonHeight = Math.min(
          drawerHeight - 2,
          Math.max(DRAWER_BTN_SIZE.height, ~~(drawerHeight / 3)),
        ),
        button0 = y0 + Math.max(1, ~~((drawerHeight - buttonHeight) / 2)),
        button1 = button0 + buttonHeight

      for (; point.x < drawerX; point.x++) {
        point.y = y0
        viewport.write('─', point)
        point.y = maxY - 1
        viewport.write('─', point)
      }

      point.x = drawerX
      for (point.y = y0; point.y < maxY; point.y++) {
        const drawButton = point.y >= button0 && point.y < button1
        let drawer: string
        if (point.y === y0) {
          drawer = '╮'
        } else if (point.y === button0) {
          drawer = '╰' + (this.#isHover ? '─' : '') + '╮'
        } else if (point.y === button1 - 1) {
          drawer = '╭' + (this.#isHover ? '─' : '') + '╯'
        } else if (drawButton) {
          drawer = this.#isHover ? ' ' : ''
          drawer += this.#isOpen ? '‹' : '›'
          drawer += '│'
        } else if (point.y === maxY - 1) {
          drawer = '╯'
        } else {
          drawer = '│'
        }

        viewport.write(drawer, point)
      }
    })
  }
}
