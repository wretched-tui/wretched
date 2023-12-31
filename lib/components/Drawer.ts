import type {Viewport} from '../Viewport'
import {type Props as ViewProps, View} from '../View'
import {Container} from '../Container'
import {Rect, Point, Size, type Edge} from '../geometry'
import {
  type MouseEvent,
  isMouseClicked,
  isMousePressed,
  isMouseReleased,
  isMouseEnter,
  isMouseExit,
} from '../events'

interface Props extends ViewProps {
  location?: Edge
  isOpen?: boolean
  onToggle?: (isOpen: boolean) => void
}

interface ConstructorProps extends Props {
  drawerView: View
  contentView: View
}

const DRAWER_BORDER = 2
const DRAWER_BTN_SIZE = {
  vertical: new Size(3, 8),
  horizontal: new Size(8, 3),
}

export class Drawer extends Container {
  readonly drawerView: View
  readonly contentView: View

  #isHover = false
  #isPressed = false
  #drawerSize = Size.zero
  #isOpen = false
  #currentDx = 0
  #location: Edge = 'left'
  #onToggle: Props['onToggle']
  declare location: Edge

  constructor({contentView, drawerView, ...props}: ConstructorProps) {
    super(props)

    this.add((this.drawerView = drawerView))
    this.add((this.contentView = contentView))

    this.#update(props)

    Object.defineProperty(this, 'location', {
      enumerable: true,
      get: () => this.#location,
      set: (value: Edge) => {
        this.#location = value
        this.invalidateSize()
      },
    })
  }

  update(props: Props) {
    this.#update(props)
    super.update(props)
  }

  #update({isOpen, location, onToggle}: Props) {
    if (isOpen !== undefined) {
      this.#setIsOpen(isOpen, false)
    }
    this.#onToggle = onToggle
    this.#location = location ?? 'left'
  }

  /**
   * Opens the drawer (does not trigger onToggle)
   */
  open() {
    this.#setIsOpen(true, false)
  }

  /**
   * Closes the drawer (does not trigger onToggle)
   */
  close() {
    this.#setIsOpen(false, false)
  }

  /**
   * Toggles the drawer open/closed (does not trigger onToggle)
   */
  toggle() {
    this.#setIsOpen(!this.#isOpen, false)
  }

  #setIsOpen(value: boolean, report: boolean) {
    this.#isOpen = value

    if (report) {
      this.#onToggle?.(value)
    }
  }

  naturalSize(availableSize: Size): Size {
    const [drawerSize, contentSize] = this.#saveDrawerSize(availableSize)

    switch (this.#location) {
      case 'top':
      case 'bottom':
        return new Size(
          Math.max(drawerSize.width + DRAWER_BORDER, contentSize.width),
          Math.max(drawerSize.height, contentSize.height) +
            DRAWER_BTN_SIZE.horizontal.height,
        )
      case 'left':
      case 'right':
        return new Size(
          Math.max(drawerSize.width, contentSize.width) +
            DRAWER_BTN_SIZE.vertical.width,
          Math.max(drawerSize.height + DRAWER_BORDER, contentSize.height),
        )
    }
  }

  #targetDx() {
    switch (this.#isOpen ? this.#location : '') {
      case 'top':
      case 'bottom':
        return this.#drawerSize.height
      case 'left':
      case 'right':
        return this.#drawerSize.width
      default:
        return 0
    }
  }

  receiveTick(dt: number) {
    const targetDx = this.#targetDx()
    let delta: number
    switch (this.#location) {
      case 'top':
      case 'bottom':
        delta = (targetDx > this.#currentDx ? 0.05 : -0.05) * dt
        break
      case 'left':
      case 'right':
        delta = (targetDx > this.#currentDx ? 0.2 : -0.2) * dt
        break
    }
    let target: number
    switch (this.#location) {
      case 'top':
      case 'bottom':
        target = this.#drawerSize.height
        break
      case 'left':
      case 'right':
        target = this.#drawerSize.width
        break
    }

    const nextDx = Math.max(0, Math.min(target, this.#currentDx + delta))
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

  #saveDrawerSize(availableSize: Size) {
    let remainingSize: Size
    let adjustSize: Size
    switch (this.#location) {
      case 'top':
      case 'bottom':
        remainingSize = availableSize.shrink(
          0,
          DRAWER_BTN_SIZE.horizontal.height,
        )
        break
      case 'left':
      case 'right':
        remainingSize = availableSize.shrink(DRAWER_BTN_SIZE.vertical.width, 0)
        break
    }

    const drawerSize = this.drawerView.naturalSize(remainingSize)
    const contentSize = this.contentView.naturalSize(remainingSize)
    this.#drawerSize = drawerSize
    return [drawerSize, contentSize]
  }

  render(viewport: Viewport) {
    if (this.#currentDx !== this.#targetDx()) {
      viewport.registerTick()
    }

    const [drawerSize] = this.#saveDrawerSize(viewport.contentSize)

    switch (this.#location) {
      case 'top':
        return this.#renderTop(viewport, drawerSize)
      case 'right':
        return this.#renderRight(viewport, drawerSize)
      case 'bottom':
        return this.#renderBottom(viewport, drawerSize)
      case 'left':
        return this.#renderLeft(viewport, drawerSize)
    }
  }

  #renderTop(viewport: Viewport, drawerSize: Size) {
    const drawerButtonRect = new Rect(
      new Point(0, ~~this.#currentDx),
      new Size(viewport.contentSize.width, DRAWER_BTN_SIZE.horizontal.height),
    )

    const contentRect = new Rect(
      new Point(0, DRAWER_BTN_SIZE.horizontal.height - 1),
      viewport.contentSize.shrink(0, DRAWER_BTN_SIZE.horizontal.height - 1),
    )

    const drawerRect = new Rect(
      new Point(1, ~~this.#currentDx - this.#drawerSize.height),
      new Size(
        drawerButtonRect.size.width - DRAWER_BORDER,
        this.#drawerSize.height,
      ),
    )

    this.#renderContent(viewport, drawerButtonRect, contentRect, drawerRect)
    this.#renderDrawerTop(viewport, drawerButtonRect)
  }

  #renderBottom(viewport: Viewport, drawerSize: Size) {
    const drawerButtonRect = new Rect(
      new Point(
        0,
        viewport.contentSize.height -
          ~~this.#currentDx -
          DRAWER_BTN_SIZE.horizontal.height,
      ),
      new Size(viewport.contentSize.width, DRAWER_BTN_SIZE.horizontal.height),
    )

    const contentRect = new Rect(
      new Point(0, 0),
      viewport.contentSize.shrink(0, DRAWER_BTN_SIZE.horizontal.height - 1),
    )

    const drawerRect = new Rect(
      new Point(1, viewport.contentSize.height - this.#currentDx),
      new Size(
        drawerButtonRect.size.width - DRAWER_BORDER,
        this.#drawerSize.height,
      ),
    )
    this.#renderContent(viewport, drawerButtonRect, contentRect, drawerRect)
    this.#renderDrawerBottom(viewport, drawerButtonRect)
  }

  #renderRight(viewport: Viewport, drawerSize: Size) {
    const drawerButtonRect = new Rect(
      new Point(
        viewport.contentSize.width -
          ~~this.#currentDx -
          DRAWER_BTN_SIZE.vertical.width,
        0,
      ),
      new Size(DRAWER_BTN_SIZE.vertical.width, viewport.contentSize.height),
    )

    const contentRect = new Rect(
      new Point(0, 0),
      viewport.contentSize.shrink(DRAWER_BTN_SIZE.vertical.width - 1, 0),
    )

    const drawerRect = new Rect(
      new Point(viewport.contentSize.width - this.#currentDx, 1),
      new Size(
        this.#drawerSize.width,
        drawerButtonRect.size.height - DRAWER_BORDER,
      ),
    )
    this.#renderContent(viewport, drawerButtonRect, contentRect, drawerRect)
    this.#renderDrawerRight(viewport, drawerButtonRect)
  }

  #renderLeft(viewport: Viewport, drawerSize: Size) {
    const drawerButtonRect = new Rect(
      new Point(~~this.#currentDx, 0),
      new Size(DRAWER_BTN_SIZE.vertical.width, viewport.contentSize.height),
    )

    const contentRect = new Rect(
      new Point(DRAWER_BTN_SIZE.vertical.width - 1, 0),
      viewport.contentSize.shrink(DRAWER_BTN_SIZE.vertical.width - 1, 0),
    )

    const drawerRect = new Rect(
      new Point(this.#currentDx - this.#drawerSize.width, 1),
      new Size(
        this.#drawerSize.width,
        drawerButtonRect.size.height - DRAWER_BORDER,
      ),
    )

    this.#renderContent(viewport, drawerButtonRect, contentRect, drawerRect)
    this.#renderDrawerLeft(viewport, drawerButtonRect)
  }

  #renderContent(
    viewport: Viewport,
    drawerButtonRect: Rect,
    contentRect: Rect,
    drawerRect: Rect,
  ) {
    // contentView renders before registerMouse so the drawer can be "on top"
    viewport.clipped(contentRect, inside => {
      this.contentView.render(inside)
    })

    if (!this.#isHover) {
      let inset: Edge
      switch (this.#location) {
        case 'top':
          inset = 'bottom'
          break
        case 'right':
          inset = 'left'
          break
        case 'bottom':
          inset = 'top'
          break
        case 'left':
          inset = 'right'
          break
      }
      viewport.registerMouse(
        ['mouse.move', 'mouse.button.left'],
        drawerButtonRect.inset({[inset]: 1}),
      )
    } else {
      viewport.registerMouse(
        ['mouse.move', 'mouse.button.left'],
        drawerButtonRect,
      )
    }

    if (this.#currentDx > 0) {
      viewport.paint(this.theme.text(), drawerRect)
      viewport.clipped(drawerRect, inside => {
        this.drawerView.render(inside)
      })
    }
  }

  #renderDrawerTop(viewport: Viewport, drawerButtonRect: Rect) {
    const style = this.theme.text({
      isHover: this.#isHover,
      isPressed: this.#isPressed,
    })
    viewport.usingPen(style, () => {
      const drawerWidth = drawerButtonRect.size.width,
        drawerY = drawerButtonRect.minY(),
        minX = drawerButtonRect.minX(),
        maxX = drawerButtonRect.maxX(),
        point = new Point(0, 0).mutableCopy(),
        buttonWidth = Math.min(
          drawerWidth - DRAWER_BORDER,
          Math.max(DRAWER_BTN_SIZE.horizontal.width, ~~(drawerWidth / 3)),
        ),
        button0 = Math.max(1, ~~((drawerWidth - buttonWidth) / 2)),
        button1 = button0 + buttonWidth

      for (; point.y < drawerY; point.y++) {
        point.x = minX
        viewport.write('│', point)
        point.x = maxX - 1
        viewport.write('│', point)
      }

      point.y = drawerButtonRect.minY()
      for (point.x = minX; point.x < maxX; point.x++) {
        const drawButton = point.x >= button0 && point.x < button1
        let drawer: [string, string, string]
        if (point.x === 0) {
          drawer = ['╰', '', '']
        } else if (point.x === button0) {
          if (this.#isHover) {
            drawer = ['╮', '│', '╰']
          } else {
            drawer = ['╮', '╰', '']
          }
        } else if (point.x === button1 - 1) {
          if (this.#isHover) {
            drawer = ['╭', '│', '╯']
          } else {
            drawer = ['╭', '╯', '']
          }
        } else if (drawButton) {
          let chevron: string
          if (point.x % 2 === 0) {
            chevron = ' '
          } else if (this.#isOpen) {
            chevron = '∧'
          } else {
            chevron = '∨'
          }
          let c1: string, c2: string, c3: string
          if (this.#isHover) {
            c1 = ' '
            c2 = chevron
            c3 = '─'
          } else {
            c1 = chevron
            c2 = '─'
            c3 = ''
          }
          drawer = [c1, c2, c3]
        } else if (point.x === maxX - 1) {
          drawer = ['╯', '', '']
        } else {
          drawer = ['─', '', '']
        }

        viewport.write(drawer[0], point.offset(0, 0))
        viewport.write(drawer[1], point.offset(0, 1))
        if (drawer[2] !== '') {
          viewport.write(drawer[2], point.offset(0, 2))
        }
      }
    })
  }

  #renderDrawerBottom(viewport: Viewport, drawerButtonRect: Rect) {
    const style = this.theme.text({
      isHover: this.#isHover,
      isPressed: this.#isPressed,
    })
    viewport.usingPen(style, () => {
      const drawerWidth = drawerButtonRect.size.width,
        drawerY = drawerButtonRect.maxY(),
        minX = drawerButtonRect.minX(),
        maxX = drawerButtonRect.maxX(),
        point = new Point(0, drawerY).mutableCopy(),
        buttonWidth = Math.min(
          drawerWidth - DRAWER_BORDER,
          Math.max(DRAWER_BTN_SIZE.horizontal.width, ~~(drawerWidth / 3)),
        ),
        button0 = Math.max(1, ~~((drawerWidth - buttonWidth) / 2)),
        button1 = button0 + buttonWidth

      for (; point.y < viewport.contentSize.height; point.y++) {
        point.x = minX
        viewport.write('│', point)
        point.x = maxX - 1
        viewport.write('│', point)
      }

      point.y = drawerButtonRect.minY()
      for (point.x = minX; point.x < maxX; point.x++) {
        const drawButton = point.x >= button0 && point.x < button1
        let drawer: [string, string, string]
        if (point.x === 0) {
          drawer = ['', '', '╭']
        } else if (point.x === button0) {
          if (this.#isHover) {
            drawer = ['╭', '│', '╯']
          } else {
            drawer = ['', '╭', '╯']
          }
        } else if (point.x === button1 - 1) {
          if (this.#isHover) {
            drawer = ['╮', '│', '╰']
          } else {
            drawer = ['', '╮', '╰']
          }
        } else if (drawButton) {
          let chevron: string
          if (point.x % 2 === 0) {
            chevron = ' '
          } else if (this.#isOpen) {
            chevron = '∨'
          } else {
            chevron = '∧'
          }
          let c1: string, c2: string, c3: string
          if (this.#isHover) {
            c1 = '─'
            c2 = chevron
            c3 = ' '
          } else {
            c1 = ''
            c2 = '─'
            c3 = chevron
          }
          drawer = [c1, c2, c3]
        } else if (point.x === maxX - 1) {
          drawer = ['', '', '╮']
        } else {
          drawer = ['', '', '─']
        }

        if (drawer[0] !== '') {
          viewport.write(drawer[0], point.offset(0, 0))
        }
        viewport.write(drawer[1], point.offset(0, 1))
        viewport.write(drawer[2], point.offset(0, 2))
      }
    })
  }

  #renderDrawerRight(viewport: Viewport, drawerButtonRect: Rect) {
    const style = this.theme.text({
      isHover: this.#isHover,
      isPressed: this.#isPressed,
    })
    viewport.usingPen(style, () => {
      const drawerHeight = drawerButtonRect.size.height,
        drawerX = drawerButtonRect.maxX(),
        minY = drawerButtonRect.minY(),
        maxY = drawerButtonRect.maxY(),
        point = new Point(drawerX, 0).mutableCopy(),
        buttonHeight = Math.min(
          drawerHeight - DRAWER_BORDER,
          Math.max(DRAWER_BTN_SIZE.vertical.height, ~~(drawerHeight / 3)),
        ),
        button0 = Math.max(1, ~~((drawerHeight - buttonHeight) / 2)),
        button1 = button0 + buttonHeight

      for (; point.x < viewport.contentSize.width; point.x++) {
        point.y = minY
        viewport.write('─', point)
        point.y = maxY - 1
        viewport.write('─', point)
      }

      for (point.y = minY; point.y < maxY; point.y++) {
        point.x = drawerButtonRect.minX()
        const drawButton = point.y >= button0 && point.y < button1
        let drawer: string
        if (point.y === 0) {
          drawer = '╭'
          point.x += 2
        } else if (point.y === button0) {
          if (this.#isHover) {
            drawer = '╭─╯'
          } else {
            drawer = '╭╯'
            point.x += 1
          }
        } else if (point.y === button1 - 1) {
          if (this.#isHover) {
            drawer = '╰─╮'
          } else {
            drawer = '╰╮'
            point.x += 1
          }
        } else if (drawButton) {
          drawer = ''
          if (!this.#isHover) {
            point.x += 1
          }
          drawer += '│'
          drawer += this.#isOpen ? '›' : '‹'
        } else if (point.y === maxY - 1) {
          drawer = '╰'
          point.x += 2
        } else {
          drawer = '│'
          point.x += 2
        }

        viewport.write(drawer, point)
      }
    })
  }

  #renderDrawerLeft(viewport: Viewport, drawerButtonRect: Rect) {
    const style = this.theme.text({
      isHover: this.#isHover,
      isPressed: this.#isPressed,
    })
    viewport.usingPen(style, () => {
      const drawerHeight = drawerButtonRect.size.height,
        drawerX = drawerButtonRect.minX(),
        minY = drawerButtonRect.minY(),
        maxY = drawerButtonRect.maxY(),
        point = new Point(0, 0).mutableCopy(),
        buttonHeight = Math.min(
          drawerHeight - DRAWER_BORDER,
          Math.max(DRAWER_BTN_SIZE.vertical.height, ~~(drawerHeight / 3)),
        ),
        button0 = Math.max(1, ~~((drawerHeight - buttonHeight) / 2)),
        button1 = button0 + buttonHeight

      for (; point.x < drawerX; point.x++) {
        point.y = minY
        viewport.write('─', point)
        point.y = maxY - 1
        viewport.write('─', point)
      }

      point.x = drawerX
      for (point.y = minY; point.y < maxY; point.y++) {
        const drawButton = point.y >= button0 && point.y < button1
        let drawer: string
        if (point.y === 0) {
          drawer = '╮'
        } else if (point.y === button0) {
          drawer = '╰' + (this.#isHover ? '─' : '') + '╮'
        } else if (point.y === button1 - 1) {
          drawer = '╭' + (this.#isHover ? '─' : '') + '╯'
        } else if (drawButton) {
          drawer = ''
          drawer += this.#isHover ? ' ' : ''
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
