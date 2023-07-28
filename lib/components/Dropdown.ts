import {unicode} from '../sys'

import type {Viewport} from '../Viewport'
import {type Props as ViewProps, View} from '../View'
import {Container} from '../Container'
import {Point, Size, Rect} from '../geometry'
import {
  type BorderChars as BoxBorderChars,
  Box,
  Button,
  Flex,
  ScrollableList,
  Separator,
  Text,
} from '../components'
import {
  type MouseEvent,
  isMouseEnter,
  isMouseExit,
  isMouseClicked,
} from '../events'

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

export class Dropdown<T> extends View {
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
    return this.#selectedSize.grow(5, 0)
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
      isHover: this.#isHover && !this.#showModal,
    })

    if (viewport.contentSize.height === 1) {
      viewport.write(
        ' '.repeat(viewport.contentSize.width - 3) + `▏  `,
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
        this.#showModal ? '◇' : this.#isHover ? '▼' : '▽',
        new Point(viewport.contentSize.width - 2, 0),
        textStyle,
      )
    } else {
      const pt = new Point(0, 0).mutableCopy()
      for (; pt.y < viewport.contentSize.height; pt.y++) {
        viewport.write(
          ' '.repeat(viewport.contentSize.width - 3),
          pt,
          textStyle,
        )
        if (pt.y < lines.length) {
          viewport.write(lines[pt.y], pt.offset(1, 0), textStyle)
        }
        viewport.write(
          `▏  `,
          pt.offset(viewport.contentSize.width - 3, 0),
          textStyle,
        )
      }

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
  #scrollView: ScrollableList<T>
  #box = new Box({maxHeight: 24, border: BORDERS.below})

  constructor({choices, selected, onSelect, ...viewProps}: SelectorProps<T>) {
    super({...viewProps})

    this.#choices = choices.map(([text, value], row) => [
      text.split('\n'),
      value,
    ])
    this.#selected = selected
    this.#onSelect = onSelect
    this.#scrollView = new ScrollableList({
      items: this.#choices.map(([, choice]) => choice),
      cellForItem: (choice, row) => this.cellForItem(choice, row),
    })
    this.#box.add(this.#scrollView)
    this.add(this.#box)
  }

  get selectedText() {
    return this.#choices[this.#selected][0]
  }

  get selectedValue() {
    return this.#choices[this.#selected][1]
  }

  cellForItem(choice: T, row: number) {
    const lines: string[] = this.#choices[row][0]
    const selected = this.#choices[this.#selected][1]
    const isSelected = this.#selected === row
    const button = new Button({
      theme: isSelected ? 'selected' : undefined,
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
        this.#scrollView.invalidateItem(selected, 'view')
        this.#scrollView.invalidateItem(choice, 'view')
        this.#selected = row
        this.#onSelect()
      },
    })

    return new Flex({
      direction: 'leftToRight',
      children: [
        ['flex1', button],
        new Separator({direction: 'vertical', border: 'single'}),
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
      y = viewport.parentRect.maxY()
    } else {
      y = viewport.parentRect.minY() - height
    }

    const border: BoxBorderChars = [...BORDERS[placement]]
    this.#box.border = border

    const rect = new Rect(new Point(x, y), new Size(width, height))
    viewport.clipped(rect, inside => this.renderChildren(inside))
  }
}

const BORDERS: BorderChars = {
  control: ['─', '│', '╭', '┬─╮', '╰', '┴─╯'],
  hover: ['─', '│', '╭', '┬─╮', '╰', '┴─╯', '─', '│'],
  below: ['─', '│', '╭', '┬─╮', '╰', '┴─╯', '─', '│'],
  above: ['─', '│', '╭', '┬─╮', '╰', '┴─╯', '─', '│'],
}
