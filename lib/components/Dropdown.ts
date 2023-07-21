import type {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'
import type {MouseEvent} from '../events'
import {unicode} from '../sys'
import {View} from '../View'
import {Container} from '../Container'
import {Style} from '../Style'
import {Point, Size, Rect} from '../geometry'
import {isMouseEnter, isMouseExit, isMouseClicked} from '../events'
import {ScrollableList} from '../components/ScrollableList'
import {Text} from '../components/Text'
import {Button} from '../components/Button'

interface Props<T> extends ViewProps {
  choices: [string, T][]
  selected: number
}

export class Dropdown<T> extends View {
  #dropdown: DropdownSelector<T>
  #isHover = false
  #showModal = false

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
    const {width, height} = unicode.stringSize(this.#dropdown.selectedText)
    return new Size(width + 1, height + 2)
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
    viewport.write(
      ' '.repeat(viewport.contentSize.width),
      new Point(0, viewport.contentSize.height - 1),
    )

    viewport.write(
      '╭' + '─'.repeat(viewport.contentSize.width - 4) + '┬─╮',
      new Point(0, 0),
    )
    let pt: Point
    for (let y = 1; y < viewport.contentSize.height - 1; y++) {
      pt = new Point(0, y)
      viewport.write('│' + ' '.repeat(viewport.contentSize.width - 4), pt)
      if (y - 1 < lines.length) {
        viewport.write(lines[y - 1], pt.offset(1, 0))
      }
      pt = new Point(viewport.contentSize.width - 3, y)
      viewport.write('│ │', pt)
    }
    viewport.write(
      '╰' + '─'.repeat(viewport.contentSize.width - 4) + '┴─╯',
      new Point(0, viewport.contentSize.height - 1),
    )
    viewport.write(
      this.#showModal ? '▼' : this.#isHover ? '◀︎' : '◁',
      new Point(
        viewport.contentSize.width - 2,
        viewport.contentSize.height - 2,
      ),
    )
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
    maxHeight: 20,
    padding: {left: 1, right: 1},
    cellAtIndex: row => this.cellAtIndex(row),
  })

  constructor({choices, selected, onSelect, ...viewProps}: SelectorProps<T>) {
    super({...viewProps})

    this.#choices = choices.map(([text, value], row) => [
      text.split('\n'),
      value,
    ])
    this.#selected = selected
    this.#onSelect = onSelect
    this.add(this.#scrollView)
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
    return new Button({
      type: selected ? 'selected' : 'blank',
      content: new Text({
        lines: lines.map((line, index) => {
          const prefix =
            index === 0 ? (row === this.#selected ? '● ' : '○ ') : '  '
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
  }

  render(viewport: Viewport) {
    const intrinsicSize = this.intrinsicSize(viewport.contentSize).max(
      viewport.contentSize,
    )
    const fitsBelow =
      viewport.parentRect.maxY() + intrinsicSize.height <
      viewport.contentSize.height
    const fitsAbove =
      viewport.parentRect.minY() - intrinsicSize.height >=
      viewport.contentSize.height

    // 1. doesn't fit above or below, pick the side that has more room
    // 2. prefer below
    // 3. otherwise above
    let placement: 'above' | 'below'
    let height = intrinsicSize.height
    if (!fitsBelow && !fitsAbove) {
      const spaceBelow =
        viewport.contentSize.height - viewport.parentRect.maxY()
      const spaceAbove = viewport.parentRect.minY()
      placement = spaceAbove > spaceBelow ? 'above' : 'below'
      height = placement === 'above' ? spaceAbove : spaceBelow
    } else if (fitsBelow) {
      placement = 'below'
    } else {
      placement = 'above'
    }

    const x = Math.max(
      0,
      viewport.parentRect.maxX() - intrinsicSize.width - 2,
      viewport.parentRect.minX(),
    )
    const width = Math.min(intrinsicSize.width, viewport.contentSize.width - x)
    let y: number
    if (placement === 'below') {
      y = viewport.parentRect.maxY()
    } else {
      y = viewport.parentRect.minY() - height
    }

    const rect = new Rect(new Point(x, y), new Size(width, height))
    viewport.clipped(rect, inside => super.render(inside))
  }
}
