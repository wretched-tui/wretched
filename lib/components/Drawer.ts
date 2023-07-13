import type {Viewport} from '../Viewport'
import {View} from '../View'
import {Container} from '../Container'
import {Style} from '../Style'
import {Rect, Point, Size} from '../geometry'

import {Button} from './Button'

interface Props {
  header?: View
  drawer: View
  content: View
}

const BUTTON_SIZE = new Size(5, 2)
const DRAWER_WIDTH = 2

export class Drawer extends Container {
  readonly header: View | undefined
  readonly drawer: View
  readonly content: View

  #hamburgerButton: Button
  #drawerButton: Button
  #isOpen = false

  constructor({content, drawer, header}: Props) {
    super()

    this.#hamburgerButton = new Button({
      style: {foreground: 'white', background: 'black'},
      hover: {background: 'gray'},
      text: new Array(BUTTON_SIZE.height)
        .fill(' ' + '━'.repeat(BUTTON_SIZE.width - 2) + ' ')
        .join('\n'),
      onHover: value => {
        this.#drawerButton.isHover = value
      },
      onPress: value => {
        this.#drawerButton.isPressed = value
      },
      onClick: () => {
        this.onClick()
      },
    })

    this.#drawerButton = new Button({
      style: {foreground: 'white', background: 'black'},
      hover: {background: 'gray'},
      text: '›',
      onHover: value => {
        this.#hamburgerButton.isHover = value
      },
      onPress: value => {
        this.#hamburgerButton.isPressed = value
      },
      onClick: () => {
        this.onClick()
      },
    })

    this.header = header
    if (header) {
      this.add(header)
    }
    this.add((this.drawer = drawer))
    this.add((this.content = content))
  }

  onClick() {}

  intrinsicSize(size: Size): Size {
    const intrinsicSize = this.content.intrinsicSize(size)
    return new Size(
      Math.max(intrinsicSize.width, BUTTON_SIZE.width),
      Math.max(intrinsicSize.height, BUTTON_SIZE.height),
    )
  }

  render(viewport: Viewport) {
    let contentRect: Rect
    if (this.header) {
      contentRect = new Rect(
        new Point(DRAWER_WIDTH, BUTTON_SIZE.height),
        viewport.contentSize.shrink(DRAWER_WIDTH, BUTTON_SIZE.height),
      )
      const header = this.header
      const headerRect = new Rect(
        new Point(BUTTON_SIZE.width, 0),
        new Size(
          viewport.contentSize.width - BUTTON_SIZE.width,
          BUTTON_SIZE.height,
        ),
      )
      viewport.clipped(headerRect, inside => {
        header.render(inside)
      })
    } else {
      contentRect = new Rect(
        new Point(DRAWER_WIDTH, 0),
        viewport.contentSize.shrink(DRAWER_WIDTH, 0),
      )
    }
    viewport.clipped(contentRect, inside => {
      this.content.render(inside)
    })

    if (this.#isOpen) {
    } else {
      const drawerRect = new Rect(
        new Point(0, BUTTON_SIZE.height),
        new Size(
          DRAWER_WIDTH,
          viewport.contentSize.height - BUTTON_SIZE.height,
        ),
      )
      viewport.clipped(drawerRect, inside => {
        this.#drawerButton.text =
          '››' + '\n››'.repeat(drawerRect.size.height - 1)
        this.#drawerButton.render(inside)
      })
    }

    const hamburgerButtonRect = new Rect(
      new Point(0, 0),
      new Size(BUTTON_SIZE.width, BUTTON_SIZE.height),
    )
    viewport.clipped(hamburgerButtonRect, inside => {
      this.#hamburgerButton.render(inside)
    })
  }
}
