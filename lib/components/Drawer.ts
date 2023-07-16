import type {Viewport} from '../Viewport'
import type {MouseEvent} from '../events'
import type {Props as ViewProps} from '../View'
import {View} from '../View'
import {Container} from '../Container'
import {Style} from '../Style'
import {Rect, Point, Size} from '../geometry'
import {isClicked, isMouseEnter, isMouseExit} from '../events'

interface Props extends ViewProps {
  drawer: View
  content: View
}

const DRAWER_BTN_SIZE = new Size(3, 8)
const GRAY_TEXT = 156
const GRAY_HOVER = 255

export class Drawer extends Container {
  readonly drawer: View
  readonly content: View

  #hover = false
  #drawerWidth = 0
  #isOpen = false
  #targetDx = 0
  #currentDx = 0

  constructor({content, drawer, ...viewProps}: Props) {
    super(viewProps)

    this.add((this.drawer = drawer))
    this.add((this.content = content))
  }

  open() {
    this.#setIsOpen(true)
  }

  close() {
    this.#setIsOpen(false)
  }

  toggle() {
    this.#setIsOpen(!this.#isOpen)
  }

  #setIsOpen(value: boolean) {
    this.#isOpen = value
    this.#targetDx = value ? this.#drawerWidth : 0
  }

  intrinsicSize(size: Size): Size {
    const drawerSize = this.drawer.intrinsicSize(
      size.shrink(DRAWER_BTN_SIZE.width, 0),
    )
    this.#drawerWidth = drawerSize.width
    if (this.#isOpen) {
      this.#targetDx = this.#drawerWidth
    }

    const contentSize = this.content.intrinsicSize(
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
    if (isMouseEnter(event)) {
      this.#hover = true
    } else if (isMouseExit(event)) {
      this.#hover = false
    }

    if (isClicked(event)) {
      this.toggle()
    }
  }

  render(viewport: Viewport) {
    if (this.#currentDx !== this.#targetDx) {
      viewport.registerTick(this)
    }

    const drawerButtonRect = new Rect(
      new Point(~~this.#currentDx, 0),
      new Size(2, viewport.contentSize.height),
    )
    viewport.registerMouse(
      this,
      ['mouse.move', 'mouse.button.left'],
      drawerButtonRect,
    )

    const contentRect = new Rect(
      new Point(DRAWER_BTN_SIZE.width, 0),
      viewport.contentSize.shrink(DRAWER_BTN_SIZE.width, 0),
    )

    viewport.clipped(contentRect, inside => {
      this.content.render(inside)
    })

    if (this.drawer && this.#currentDx > 0) {
      const drawerRect = new Rect(
        new Point(this.#currentDx - this.#drawerWidth, 1),
        new Size(this.#drawerWidth, drawerButtonRect.size.height - 2),
      )
      for (let y = drawerRect.minY(); y < drawerRect.maxY(); y++)
        for (let x = drawerRect.minX(); x < drawerRect.maxX(); x++) {
          viewport.write(' ', new Point(x, y))
        }
      viewport.clipped(drawerRect, inside => {
        this.drawer.render(inside)
      })
    }

    const style = new Style(
      this.#hover
        ? {foreground: {grayscale: GRAY_HOVER}}
        : {foreground: {grayscale: GRAY_TEXT}},
    )
    this.#drawDrawer(viewport, style, drawerButtonRect)
  }

  #drawDrawer(viewport: Viewport, style: Style, rect: Rect) {
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
          drawer = '╰' + (this.#hover ? '─' : '') + '╮'
        } else if (point.y === button1 - 1) {
          drawer = '╭' + (this.#hover ? '─' : '') + '╯'
        } else if (drawButton) {
          drawer = this.#hover ? ' ' : ''
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
