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
  Checkbox,
  Space,
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

interface SharedProps<T> extends ViewProps {
  choices: readonly [string, T][]
}

interface StyleProps {
  title?: string
}

type SelectMultipleFn<T> = (value: T[]) => void
type SelectOneFn<T> = (value: T) => void

interface SelectMultiple<T> {
  multiple: true
  selected: readonly T[]
  onSelect: SelectMultipleFn<T>
}

interface SelectOne<T> {
  multiple?: false
  selected?: T
  onSelect: SelectOneFn<T>
}

type Props<T> = SharedProps<T> & StyleProps & (SelectMultiple<T> | SelectOne<T>)

export class Dropdown<T> extends View {
  #dropdown: DropdownSelector<T>
  #title?: string[]
  #isHover = false
  #showModal = false
  #selectedSize = Size.zero

  constructor({
    title,
    choices,
    selected,
    multiple,
    onSelect,
    ...viewProps
  }: Props<T>) {
    super(viewProps)

    let selectedItems: T[]
    if (multiple) {
      selectedItems = selected as T[]
    } else if (selected !== undefined) {
      selectedItems = [selected as T]
    } else {
      selectedItems = []
    }

    const selectedRows = selectedItems.flatMap(item => {
      const index = choices.findIndex(([_, choice]) => choice === item)
      if (index === -1) {
        return []
      }

      return [index]
    })

    this.#title = title ? title.split('\n') : undefined
    this.#dropdown = new DropdownSelector({
      theme: this.theme,
      multiple: multiple ?? false,
      choices,
      selected: selectedRows,
      onSelect: () => {
        if (multiple) {
          ;(onSelect as SelectMultipleFn<T>)(this.#dropdown.selectedValues)
        } else {
          this.#showModal = false
          const value = this.#dropdown.selectedValue
          if (value !== undefined) {
            ;(onSelect as SelectOneFn<T>)(value)
          }
        }
        this.invalidateSize()
      },
    })
  }

  get choices() {
    return this.#dropdown.choices
  }
  set choices(choices: SharedProps<T>['choices']) {
    this.#dropdown.choices = choices
  }

  #titleLines() {
    if (
      this.#title !== undefined &&
      this.#dropdown.selectedValues.length === 0
    ) {
      return this.#title
    }

    return this.#dropdown.selectedText ?? ['<select>']
  }

  naturalSize(size: Size): Size {
    this.#selectedSize = new Size(unicode.stringSize(this.#titleLines()))
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
    const lines = this.#titleLines()
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

interface SelectorProps<T> extends SharedProps<T> {
  onSelect(): void
  selected: number[]
  multiple: boolean
}

class DropdownSelector<T> extends Container {
  #choices: [string[], T][]
  #selected: Set<number>
  #multiple: boolean
  #onSelect: () => void
  #scrollView: ScrollableList<T>
  #box = new Box({maxHeight: 24, border: BORDERS.below})
  #checkbox: Checkbox

  get choices() {
    return this.#choices.map(([lines, choice]) => [lines.join('\n'), choice])
  }

  set choices(choices: SharedProps<T>['choices']) {
    const selected = [...this.#selected].map(index => this.#choices[index][1])
    this.#choices = choices.map(([text, choice]) => [text.split('\n'), choice])
    this.#selected = new Set(
      selected.flatMap(item => {
        const index = choices.findIndex(([_, choice]) => choice === item)
        if (index === -1) {
          return []
        }
        return [index]
      }),
    )
    this.#scrollView.updateItems(choices.map(([, choice]) => choice))
  }

  constructor({
    choices,
    selected,
    multiple,
    onSelect,
    ...viewProps
  }: SelectorProps<T>) {
    super({...viewProps})

    this.#choices = choices.map(([text, value]) => [text.split('\n'), value])
    this.#selected = new Set(selected)
    this.#multiple = multiple
    this.#onSelect = onSelect
    this.#checkbox = new Checkbox({
      text: 'Select all',
      isChecked: false,
      onCheck: value => {
        if (value) {
          this.#selected = new Set(Array(this.#choices.length).keys())
        } else {
          this.#selected = new Set()
        }
        onSelect()
        this.#scrollView.invalidateAllRows('view')
      },
    })
    this.#scrollView = new ScrollableList({
      items: this.#choices.map(([, choice]) => choice),
      cellForItem: (choice, row) => this.cellForItem(choice, row),
    })
    const content = new Flex({direction: 'topToBottom', children: []})

    if (multiple) {
      content.add(this.#checkbox)
    }
    content.addFlex('flex1', this.#scrollView)
    this.#box.add(content)
    this.add(this.#box)

    this.#checkbox.isChecked = this.#isAllSelected()
  }

  #isAllSelected() {
    return this.#selected.size === this.#choices.length
  }

  get selectedText() {
    if (this.#selected.size === 0) {
      return undefined
    }
    if (this.#selected.size > 1) {
      // return [`${this.#selected.size} items selected`]
      return [
        [...this.#selected]
          .map(index => this.#choices[index][0].join(' '))
          .join(', '),
      ]
    }
    const [row] = [...this.#selected]
    return this.#choices[row][0]
  }

  get selectedValue() {
    if (this.#selected.size === 0) {
      return undefined
    }
    const [row] = [...this.#selected]
    return this.#choices[row][1]
  }

  get selectedValues() {
    return [...this.#selected].map(index => this.#choices[index][1])
  }

  cellForItem(choice: T, row: number) {
    const button = this.#cellButton(choice, row)

    return new Flex({
      direction: 'leftToRight',
      children: [
        ['flex1', button],
        new Separator({direction: 'vertical', border: 'single'}),
      ],
    })
  }

  #cellButton(choice: T, row: number) {
    const lines: string[] = this.#choices[row][0]
    const isSelected = [...this.#selected].some(index => index === row)

    return new Button({
      theme: isSelected ? 'selected' : undefined,
      border: 'none',
      content: new Text({
        width: 'fill',
        lines: lines.map((line, index) => {
          let prefix: string
          if (this.#multiple) {
            prefix =
              index === 0
                ? isSelected
                  ? BOX.multiple.checked
                  : BOX.multiple.unchecked
                : '  '
          } else {
            prefix =
              index === 0
                ? isSelected
                  ? BOX.single.checked
                  : BOX.single.unchecked
                : '  '
          }

          return prefix + line
        }),
      }),
      onClick: () => {
        this.#selected.forEach(selected => {
          const item = this.#choices[selected][1]
          this.#scrollView.invalidateItem(item, 'view')
        })

        this.#scrollView.invalidateItem(choice, 'view')

        if (this.#multiple) {
          if (this.#selected.has(row)) {
            this.#selected.delete(row)
          } else {
            this.#selected.add(row)
          }
        } else {
          this.#selected = new Set([row])
        }

        this.#checkbox.isChecked = this.#isAllSelected()

        this.#onSelect()
      },
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

    this.#box.border = BORDERS[placement]

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

const BOX: Record<
  'multiple' | 'single',
  Record<'unchecked' | 'checked', string>
> = {
  multiple: {
    unchecked: '☐ ',
    checked: '☑ ',
  },
  single: {
    unchecked: '◯ ',
    checked: '⦿ ',
  },
}
