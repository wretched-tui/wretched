import type {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'
import type {MouseEvent} from '../events'
import {unicode} from '../sys'
import {View} from '../View'
import {Style} from '../Style'
import {Container} from '../Container'
import {Point, Size, Rect} from '../geometry'
import {isMouseEnter, isMouseExit, isMouseClicked} from '../events'
import {Box, Button, Flex, ScrollableList, Separator, Text} from '../components'
import type {BorderChars} from '../components/Box'

interface Props<T> extends ViewProps {
  choices: [string, T][]
  selected: number
}

export class Dropdown<T> extends View {
  #dropdown: DropdownSelector<T>
  #isHover = false
  #showModal = false
  #selectedSize = Size.zero

  constructor({choices, selected, ...viewProps}: Props<T>) {
    super(viewProps)

    this.#dropdown = new DropdownSelector({
      choices,
      selected,
      onSelect: () => {
        this.#showModal = false
        this.invalidateSize()
      },
    })
  }

  intrinsicSize(size: Size): Size {
    this.#selectedSize = new Size(
      unicode.stringSize(this.#dropdown.selectedText),
    )
    //12      345 width += 5
    //╭─......┬─╮1
    //│ .text.│ │
    //...txt2....
    //╰─......┴─╯2 height += 1
    return this.#selectedSize.grow(5, 2)
  }

  receiveMouse(event: MouseEvent) {
    if (isMouseEnter(event)) {
      this.#isHover = true
    } else if (isMouseExit(event)) {
      this.#isHover = false
    }

    if (isMouseClicked(event)) {
      this.#showModal = true
    }
  }

  render(viewport: Viewport) {
    if (this.#showModal) {
      viewport.requestModal(this.#dropdown, () => {
        this.#showModal = false
      })
    }

    viewport.registerMouse(['mouse.move', 'mouse.button.left'])
    const lines = this.#dropdown.selectedText
    const [top, side, tl, tr, bl, br, ct, cb] =
      this.#isHover || this.#showModal
        ? ['━', '┃', '┏', '┓', '┗', '┛', '┳', '┻']
        : ['─', '│', '┌', '┐', '└', '┘', '┬', '┴']

    if (viewport.contentSize.height === 1) {
      viewport.write(
        ' '.repeat(viewport.contentSize.width),
        Point.zero,
        Style.underlined,
      )
      viewport.clipped(
        new Rect(Point.zero, viewport.contentSize.shrink(3, 0)),
        Style.underlined,
        () => {
          viewport.write(side + lines[0], Point.zero, Style.underlined)
        },
      )
      viewport.write(
        `${side}${this.#showModal ? '⦿' : this.#isHover ? '◯' : '◌'}${side}`,
        new Point(viewport.contentSize.width - 3, 0),
      )
    } else {
      viewport.write(
        tl + top.repeat(viewport.contentSize.width - 4) + `${ct}${top}${tr}`,
        new Point(0, 0),
      )
      const pt = new Point(0, 1).mutableCopy()
      for (; pt.y < viewport.contentSize.height - 1; pt.y++) {
        viewport.write(side + ' '.repeat(viewport.contentSize.width - 4), pt)
        if (pt.y - 1 < lines.length) {
          viewport.write(lines[pt.y - 1], pt.offset(1, 0))
        }
        viewport.write(
          `${side} ${side}`,
          pt.offset(viewport.contentSize.width - 3, 0),
        )
      }
      viewport.write(
        bl + top.repeat(viewport.contentSize.width - 4) + `${cb}${top}${br}`,
        new Point(0, viewport.contentSize.height - 1),
      )

      viewport.write(
        this.#showModal ? '⦿' : this.#isHover ? '◯' : '◌',
        new Point(
          viewport.contentSize.width - 2,
          viewport.contentSize.height - 2,
        ),
      )
    }
  }
}

interface SelectorProps<T> extends Props<T> {
  onSelect(): void
}

class DropdownSelector<T> extends Container {
  #choices: [string[], T][]
  #selected: number
  #onSelect: () => void
  #scrollView = new ScrollableList({
    cellAtIndex: row => this.cellAtIndex(row),
  })
  #box = new Box({maxHeight: 24, border: belowChars})

  constructor({choices, selected, onSelect, ...viewProps}: SelectorProps<T>) {
    super({...viewProps})

    this.#choices = choices.map(([text, value], row) => [
      text.split('\n'),
      value,
    ])
    this.#selected = selected
    this.#onSelect = onSelect
    this.#box.add(this.#scrollView)
    this.add(this.#box)
  }

  get selectedText() {
    return this.#choices[this.#selected][0]
  }

  get selectedValue() {
    return this.#choices[this.#selected][1]
  }

  cellAtIndex(row: number) {
    if (row >= this.#choices.length) {
      return undefined
    }

    const lines: string[] = this.#choices[row][0]
    const selected = this.#selected === row
    const button = new Button({
      type: selected ? 'selected' : 'plain',
      border: 'none',
      content: new Text({
        lines: lines.map((line, index) => {
          const prefix =
            index === 0 ? (this.#selected === row ? '⦿ ' : '◯ ') : '  '
          return prefix + line
        }),
      }),
      onClick: () => {
        this.#scrollView.invalidateRow(this.#selected)
        this.#scrollView.invalidateRow(row)
        this.#selected = row
        this.#onSelect()
      },
    })

    return new Flex({
      direction: 'leftToRight',
      children: [
        ['flex1', button],
        new Separator({direction: 'vertical', border: 'bold'}),
      ],
    })
  }

  render(viewport: Viewport) {
    const intrinsicSize = this.intrinsicSize(viewport.contentSize).max(
      viewport.contentSize,
    )
    const fitsBelow =
      viewport.parentRect.maxY() + intrinsicSize.height <
      viewport.contentSize.height
    const fitsAbove = intrinsicSize.height <= viewport.parentRect.minY()

    // 1. doesn't fit above or below, pick the side that has more room
    // 2. prefer below
    // 3. otherwise above
    let placement: 'above' | 'below'
    let height = intrinsicSize.height
    if (!fitsBelow && !fitsAbove) {
      const spaceBelow =
        viewport.contentSize.height - viewport.parentRect.maxY() + 1
      const spaceAbove = viewport.parentRect.minY() + 1
      if (spaceAbove > spaceBelow) {
        placement = 'above'
        height = spaceAbove
      } else {
        placement = 'below'
        height = spaceBelow
      }
    } else if (fitsBelow) {
      placement = 'below'
    } else {
      placement = 'above'
    }

    // const width = Math.min(intrinsicSize.width, viewport.contentSize.width - x)
    const width = viewport.parentRect.size.width
    const x = Math.max(
      0,
      viewport.parentRect.maxX() - width,
      viewport.parentRect.minX(),
    )
    let y: number
    if (placement === 'below') {
      y = viewport.parentRect.maxY() - 1
    } else {
      y = viewport.parentRect.minY() - height + 1
    }

    const border: BorderChars = [
      ...(placement === 'below' ? belowChars : aboveChars),
    ]
    if (viewport.parentRect.size.height === 1) {
      if (placement === 'below') {
        y += 1
        height -= 1
        border[6] = border[0] // bottom
        border[0] = '' // top
        border[2] = '' // top left
        border[3] = '' // top right
      } else {
        height -= 1
        border[4] = '' // bottom left
        border[5] = '' // bottom right
        border[6] = '' // bottom
      }
    }
    this.#box.border = border

    const rect = new Rect(new Point(x, y), new Size(width, height))
    viewport.clipped(rect, inside => super.render(inside))
  }
}

//                  top  left  tl    tr    bl   br
const belowChars = ['━', '┃', '┣', '╋━┫', '┗', '┻━┛'] as BorderChars
const aboveChars = ['━', '┃', '┏', '┳━┓', '┣', '╋━┫'] as BorderChars
