import type {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'
import type {MouseEvent} from '../events'
import {unicode} from '../sys'
import {View} from '../View'
import {Container} from '../Container'
import {Point, Size, Rect} from '../geometry'
import {isMouseEnter, isMouseExit, isMouseClicked} from '../events'
import {Box, Button, Flex, ScrollableList, Separator, Text} from '../components'
import type {BorderChars as BoxBorderChars} from '../components/Box'

type Placement = 'above' | 'below'

interface BorderChars {
  control: BoxBorderChars
  hover: BoxBorderChars
  above: BoxBorderChars
  below: BoxBorderChars
}

interface Props<T> extends ViewProps {
  choices: [string, T][]
  selected: number
}

export class LargeDropdown<T> extends View {
  #dropdown: DropdownSelector<T>
  #isHover = false
  #showModal = false
  #selectedSize = Size.zero

  constructor({choices, selected, ...viewProps}: Props<T>) {
    super(viewProps)

    this.#dropdown = new DropdownSelector({
      theme: this.theme,
      choices,
      selected,
      onSelect: () => {
        this.#showModal = false
        this.invalidateSize()
      },
    })
  }

  naturalSize(size: Size): Size {
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
    const textStyle = this.theme.ui({
      isPressed: this.#showModal,
      isHover: this.#isHover,
    })

    if (viewport.contentSize.height === 1) {
      const [top, side, tl, tr, bl, br] = BORDERS.hover

      viewport.write(
        side + ' '.repeat(viewport.contentSize.width - 1),
        Point.zero,
        textStyle,
      )
      viewport.clipped(
        new Rect(Point.zero, viewport.contentSize.shrink(3, 0)),
        textStyle,
        () => {
          viewport.write(lines[0], Point.zero.offset(1, 0))
        },
      )
      viewport.write(
        `${side} ${side}`,
        new Point(viewport.contentSize.width - 3, 0),
        textStyle,
      )
      viewport.write(
        this.#showModal ? '◇' : this.#isHover ? '▼' : '▽',
        new Point(viewport.contentSize.width - 2, 0),
        textStyle,
      )
    } else {
      const [top, side, tl, tr, bl, br] =
        this.#isHover || this.#showModal ? BORDERS.hover : BORDERS.control

      viewport.write(
        tl + top.repeat(viewport.contentSize.width - 4) + `${tr}`,
        new Point(0, 0),
        textStyle,
      )
      const pt = new Point(0, 1).mutableCopy()
      for (; pt.y < viewport.contentSize.height - 1; pt.y++) {
        viewport.write(
          side + ' '.repeat(viewport.contentSize.width - 4),
          pt,
          textStyle,
        )
        if (pt.y - 1 < lines.length) {
          viewport.write(lines[pt.y - 1], pt.offset(1, 0), textStyle)
        }
        viewport.write(
          `${side} ${side}`,
          pt.offset(viewport.contentSize.width - 3, 0),
          textStyle,
        )
      }
      viewport.write(
        bl + top.repeat(viewport.contentSize.width - 4) + `${br}`,
        new Point(0, viewport.contentSize.height - 1),
        textStyle,
      )

      viewport.write(
        this.#showModal ? '◇' : this.#isHover ? '▼' : '▽',
        new Point(
          viewport.contentSize.width - 2,
          viewport.contentSize.height - 2,
        ),
        textStyle,
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
  #box = new Box({maxHeight: 24, border: BORDERS.below})

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
      theme: selected ? 'selected' : undefined,
      border: 'none',
      content: new Text({
        width: 'fill',
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
    const naturalSize = this.naturalSize(viewport.contentSize).max(
      viewport.contentSize,
    )
    const fitsBelow =
      viewport.parentRect.maxY() + naturalSize.height <
      viewport.contentSize.height
    const fitsAbove = naturalSize.height <= viewport.parentRect.minY()

    // 1. doesn't fit above or below, pick the side that has more room
    // 2. prefer below
    // 3. otherwise above
    let placement: 'above' | 'below'
    let height = naturalSize.height
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

    const border: BoxBorderChars = [...BORDERS[placement]]
    if (viewport.parentRect.size.height === 1) {
      if (placement === 'below') {
        y += 1
        height -= 1
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

const BORDERS: BorderChars = {
  control: ['─', '│', '╭', '┬─╮', '╰', '┴─╯'],
  hover: ['─', '│', '╭', '┬─╮', '╰', '┴─╯', '─', '│'],
  below: ['─', '│', '├', '┼─┤', '╰', '┴─╯', '─', '│'],
  above: ['─', '│', '╭', '┬─╮', '├', '┼─┤', '─', '│'],
}
