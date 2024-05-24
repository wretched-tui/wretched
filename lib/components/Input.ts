import {unicode} from '../sys'

import type {KeyEvent, MouseEvent} from '../events'
import {isKeyPrintable} from '../events'
import type {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'
import {View} from '../View'
import {Style} from '../Style'
import {Point, Size} from '../geometry'
import {System} from '../System'
import type {Alignment, FontFamily} from './types'
import {FONTS} from './fonts'

interface TextProps {
  placeholder?: string
  onChange?: (text: string) => void
  onSubmit?: (text: string) => void
}

interface StyleProps {
  text: string
  alignment: Alignment
  wrap: boolean
  multiline: boolean
  font?: FontFamily
}

interface Cursor {
  start: number
  end: number
}

export type Props = Partial<StyleProps> & TextProps & ViewProps

/**
 * Single line text input
 */
export class Input extends View {
  /**
   * Array of graphemes
   */
  #placeholder: [string[], number][] = [[[], 0]]
  #text: string = ''
  #chars: string[] = []
  #lines: [string[], number][] = []
  #alignment: StyleProps['alignment'] = 'left'
  #wrap: boolean = false
  #multiline: boolean = false
  #font: FontFamily = 'serif'
  #onChange?: (text: string) => void
  #onSubmit?: (text: string) => void

  // Printable width
  #maxLineWidth: number = 0
  #maxLineHeight: number = 0
  // Text drawing starts at this offset (if it can't fit on screen)
  #offset: number = 0
  #cursor: Cursor = {start: 0, end: 0}

  constructor(props: Props = {}) {
    super(props)
    this.#update(props)
    this.#cursor = {start: this.#chars.length, end: this.#chars.length}
  }

  update(props: Props) {
    this.#update(props)
    super.update(props)
  }

  #update({
    text,
    wrap,
    multiline,
    font,
    alignment,
    placeholder,
    onChange,
    onSubmit,
  }: Props) {
    this.#onChange = onChange
    this.#onSubmit = onSubmit
    this.#wrap = wrap ?? false
    this.#multiline = multiline ?? false
    placeholder ??= ''
    const placeholderLines =
      placeholder === ''
        ? []
        : placeholder.split('\n').map(line => unicode.printableChars(line))
    this.#placeholder = placeholderLines.map(line => [
      line,
      line.reduce((w, c) => w + unicode.charWidth(c), 0),
    ])
    this.#updateLines(text, font)
  }

  #updateLines(text: string | undefined, font: FontFamily | undefined) {
    this.#font = font ?? 'serif'
    const fontMap = font && FONTS[font]

    const startIsAtEnd = this.#cursor.start === this.#chars.length
    const endIsAtEnd = this.#cursor.end === this.#chars.length
    this.#chars = []
    let lines: [string[], number][]
    if (text !== undefined && text !== '') {
      if (!this.#multiline) {
        text = text.replaceAll('\n', ' ')
      }

      this.#text = text
      lines =
        text === ''
          ? []
          : text.split('\n').map((line, index) => {
              if (fontMap) {
                line = [...line].map(c => fontMap.get(c) ?? c).join('')
              }

              const printableLine = unicode.printableChars(line)
              if (index > 0) {
                this.#chars.push('\n')
              }
              this.#chars.push(...printableLine)
              return [printableLine, unicode.lineWidth(line)]
            })
      this.#lines = lines
    } else {
      this.#text = ''
      lines = this.#placeholder
      this.#lines = []
    }

    this.#cursor.start = Math.min(this.#cursor.start, this.#chars.length)
    this.#cursor.end = Math.min(this.#cursor.end, this.#chars.length)

    if (endIsAtEnd) {
      this.#cursor.end = this.#chars.length
    }

    if (startIsAtEnd) {
      this.#cursor.start = this.#chars.length
    }

    this.#maxLineWidth = lines.reduce((maxWidth, [, width]) => {
      // the _printable_ width, not the number of characters
      return Math.max(maxWidth, width)
    }, 0)
    this.#maxLineHeight = lines.length

    this.invalidateSize()
  }

  get text() {
    return this.#text
  }
  set text(text: string) {
    this.#updateLines(text, this.#font)
  }

  get font() {
    return this.#font
  }
  set font(font: FontFamily) {
    this.#updateLines(this.#text, font)
  }

  naturalSize(available: Size): Size {
    let lines: [string[], number][]
    if (this.#lines.length === 0) {
      lines = this.#placeholder
    } else {
      lines = this.#lines
    }

    if (!lines.length) {
      return Size.zero
    }

    let height: number = 0
    if (this.#wrap) {
      for (const [, width] of lines) {
        // width + 1 because there should always be room for the cursor to be _after_
        // the last character.
        height += Math.ceil((width + 1) / available.width)
      }
    } else {
      height = lines.length
    }

    return new Size(this.#maxLineWidth + 1, height)
  }

  minSelected() {
    return Math.min(this.#cursor.start, this.#cursor.end)
  }

  maxSelected() {
    return isEmptySelection(this.#cursor)
      ? this.#cursor.start + 1
      : Math.max(this.#cursor.start, this.#cursor.end)
  }

  #showCursor = true
  #dt = 0
  receiveTick(dt: number): boolean {
    this.#dt += dt
    if (this.#dt > 500) {
      this.#showCursor = !this.#showCursor
      this.#dt = this.#dt % 500
      return true
    }

    return false
  }

  receiveKey(event: KeyEvent) {
    const prevChars = this.#chars
    this.#showCursor = true
    this.#dt = 0

    if (event.name === 'enter' || event.name === 'return') {
      if (this.#multiline) {
        this.#receiveChar('\n')
      } else {
        this.#onSubmit?.(this.#chars.join(''))
      }
      return
    }

    if (event.name === 'up' || event.name === 'home' || event.full === 'C-a') {
      this.#receiveKeyUpArrow(event)
    } else if (
      event.name === 'down' ||
      event.name === 'end' ||
      event.full === 'C-e'
    ) {
      this.#receiveKeyDownArrow(event)
    } else if (event.name === 'left') {
      this.#receiveKeyLeftArrow(event)
    } else if (event.name === 'right') {
      this.#receiveKeyRightArrow(event)
    } else if (event.full === 'backspace') {
      this.#receiveKeyBackspace()
    } else if (event.name === 'delete') {
      this.#receiveKeyDelete()
    } else if (event.full === 'M-backspace' || event.full === 'C-w') {
      this.#receiveKeyDeleteWord()
    } else if (isKeyPrintable(event)) {
      this.#receiveKeyPrintable(event)
    }

    if (prevChars !== this.#chars) {
      this.#updateLines(this.#chars.join(''), this.#font)
      this.#onChange?.(this.#chars.join(''))
    }
  }

  receiveMouse(event: MouseEvent, system: System) {
    if (event.name === 'mouse.button.down') {
      system.requestFocus()
    }
  }

  receiveMouse(event: MouseEvent, system: System) {
    if (event.name === 'mouse.button.down') {
      system.requestFocus()
    }
  }

  render(viewport: Viewport) {
    const hasFocus = viewport.registerFocus()
    if (hasFocus) {
      viewport.registerTick()
    } else if (this.#dt !== 0) {
      this.#showCursor = true
      this.#dt = 0
    }
    viewport.registerMouse('mouse.button.left')

    // shrink by 1 to accommodate the final ' ' for the cursor
    const visibleSize = viewport.contentSize.shrink(1, 0)

    // cursorEnd: the location of the cursor relative to the text
    // (ie if the text had been drawn at 0,0, cursorEnd is the screen location of
    // the cursor)
    // cursorPosition: the location of the cursor relative to the viewport
    const [cursorEnd, cursorPosition] = this.#cursorPosition(visibleSize)
    const cursorMin = this.toPosition(this.minSelected(), visibleSize.width)
    const cursorMax = this.toPosition(this.maxSelected(), visibleSize.width)

    // cursorVisible: the text location of the first line & char to draw
    const cursorVisible = new Point(
      cursorEnd.x - cursorPosition.x,
      cursorEnd.y - cursorPosition.y,
    )

    let lines: [string[], number][]
    let isPlaceholder = !Boolean(this.#chars.length)
    // everything above and below uses this.#cursor and assumes that we're printing
    // this.#lines... but here suddenly we're maybe printing the placeholder?
    // We only print the placeholder when lines/chars are empty, in which case the
    // cursor will be fixed to 0,0, which works great for the placeholder text.
    if (this.#chars.length) {
      lines = this.#lines
    } else {
      lines = this.#placeholder
    }

    if (this.#wrap) {
      lines = lines.reduce(
        (memo, line) => {
          let [lastLine, lastWidth] = memo.pop() ?? [[], 0]
          const [currentLine, currentWidth] = line
          if (lastWidth + currentWidth > visibleSize.width) {
            for (const char of currentLine) {
              const charWidth = unicode.charWidth(char)
              if (lastWidth + charWidth > visibleSize.width) {
                memo.push([lastLine, lastWidth])
                lastLine = [char]
                lastWidth = charWidth
              } else {
                lastWidth += charWidth
                lastLine.push(char)
              }
            }

            memo.push([lastLine, lastWidth])
          } else {
            memo.push([[...lastLine, ...currentLine], lastWidth + currentWidth])
          }
          return memo
        },
        [] as [string[], number][],
      )
    }

    let currentStyle = Style.NONE
    const plainStyle = isPlaceholder
      ? new Style({
          foreground: this.theme.dimText,
          bold: hasFocus,
        })
      : hasFocus
      ? new Style({
          foreground: this.theme.textColor,
          bold: hasFocus,
        })
      : new Style({
          foreground: this.theme.textColor,
        })
    const selectedStyle = hasFocus
      ? new Style({
          foreground: this.theme.textColor,
          inverse: true,
          bold: hasFocus,
        })
      : new Style({
          foreground: this.theme.dimText,
          background: this.theme.dimBackground,
          bold: hasFocus,
        })
    const cursorStyle = new Style({
      foreground: isPlaceholder ? this.theme.dimText : this.theme.textColor,
      underline: true,
      bold: hasFocus,
    })

    viewport.usingPen(pen => {
      let style: Style = plainStyle

      let scanTextPosition = new Point(0, cursorVisible.y).mutableCopy()
      for (const [line, width] of lines.slice(cursorVisible.y)) {
        // used to determine whether to draw a final …
        const isTooWide = this.#wrap
          ? false
          : width - cursorVisible.x > viewport.contentSize.width

        // set to true if any character is skipped
        let drawInitialEllipses = false
        scanTextPosition.x = 0
        for (const char of line.concat(' ')) {
          const charWidth = unicode.charWidth(char)
          if (scanTextPosition.x >= cursorVisible.x) {
            const inSelection = isInSelection(
              cursorMin,
              cursorMax,
              scanTextPosition,
            )
            if (isEmptySelection(this.#cursor)) {
              if (
                hasFocus &&
                this.#showCursor &&
                scanTextPosition.x === cursorEnd.x &&
                scanTextPosition.y === cursorEnd.y
              ) {
                style = cursorStyle
              } else {
                style = plainStyle
              }
            } else {
              if (
                !this.#showCursor &&
                scanTextPosition.x === cursorEnd.x &&
                scanTextPosition.y === cursorEnd.y
              ) {
                style = cursorStyle
              } else if (inSelection) {
                style = selectedStyle
              } else {
                style = plainStyle
              }
            }

            if (!currentStyle.isEqual(style)) {
              pen.replacePen(style)
              currentStyle = style
            }

            const drawEllipses =
              drawInitialEllipses ||
              (isTooWide &&
                scanTextPosition.x - cursorVisible.x + charWidth >=
                  viewport.contentSize.width)
            viewport.write(
              drawEllipses ? '…' : char,
              scanTextPosition.offset(-cursorVisible.x, -cursorVisible.y),
            )
            drawInitialEllipses = false
          } else {
            drawInitialEllipses = true
          }

          scanTextPosition.x += charWidth
          if (
            scanTextPosition.x - cursorVisible.x >=
            viewport.contentSize.width
          ) {
            break
          }
        }

        scanTextPosition.y += 1
        if (
          scanTextPosition.y - cursorVisible.y >=
          viewport.contentSize.height
        ) {
          break
        }
      }
    })
  }

  /**
   * The position of the character that is at the desired cursor offset, taking into
   * character widths into account, relative to the text (as if the text were drawn
   * at 0,0), and 'wrap' setting.
   */
  toPosition(offset: number, visibleWidth: number): Point {
    if (this.#wrap) {
      let y = 0,
        numChars = 0
      let x = 0
      for (const [chars] of this.#lines) {
        if (y) {
          y += 1
        }
        x = 0
        // .concat(' ') serves two purposes: handles the newline, and the case where the
        // cursor is at the EOL
        for (const char of chars.concat(' ')) {
          if (numChars === offset) {
            return new Point(x, y)
          }

          const charWidth = unicode.charWidth(char)
          if (x + charWidth > visibleWidth) {
            x = 0
            y += 1
            numChars += 1
          } else {
            x += charWidth
            numChars += 1
          }
        }
      }

      return new Point(x, y)
    } else {
      let y = 0,
        numChars = 0
      for (const [chars] of this.#lines) {
        if (numChars + chars.length >= offset) {
          let x = 0
          for (const char of chars.slice(0, offset - numChars)) {
            x += unicode.charWidth(char)
          }
          return new Point({x, y})
        }
        // accommodate the newline
        numChars += chars.length + 1
        y += 1
      }

      return new Point(0, y)
    }
  }

  /**
   * Returns the cursor offset that points to the character at the desired screen
   * position, taking into account character widths.
   */
  toOffset(position: Point, visibleWidth: number): number {
    if (position.y >= this.#lines.length) {
      return this.#chars.length
    }

    if (this.#wrap) {
      return Math.min(this.#chars.length, visibleWidth)
    } else {
      let y = 0,
        index = 0
      for (const [chars, width] of this.#lines) {
        if (y === position.y) {
          let x = 0
          for (const char of chars) {
            x += unicode.charWidth(char)
            if (x > position.x) {
              return index
            }
            index += 1
          }
          return index
        }
        y += 1
        index += chars.length + 1
      }

      return this.#chars.length
    }
  }

  /**
   * Determine the position of the cursor, relative to the viewport, based on the
   * text and viewport sizes.
   *
   * The cursor is placed so that it will appear at the start or end of the viewport
   * when it is near the start or end of the line, otherwise it tries to be centered.
   */
  #cursorPosition(visibleSize: Size) {
    const halfWidth = Math.floor(visibleSize.width / 2)
    const halfHeight = Math.floor(visibleSize.height / 2)

    // the cursor, relative to the start of text (as if all text was visible),
    // ie in the "coordinate system" of the text.
    let cursorEnd = this.toPosition(this.#cursor.end, visibleSize.width)

    let currentLineWidth: number, totalHeight: number
    if (this.#wrap) {
      // run through the lines until we get to our desired cursorEnd.y
      // but also add all the heights to calculate currentHeight
      let h = 0
      currentLineWidth = -1
      totalHeight = 0
      for (const [line, width] of this.#lines) {
        const dh = Math.ceil(width / visibleSize.width)
        totalHeight += dh

        if (currentLineWidth === -1 && +dh >= cursorEnd.y) {
          if (cursorEnd.y - h === dh) {
            // the cursor is on the last wrapped line, use modulo divide to calculate the
            // last line width.
            currentLineWidth = visibleSize.width % width
          } else {
            currentLineWidth = visibleSize.width
          }
          break
        }
      }

      if (currentLineWidth === -1) {
        currentLineWidth = 0
      }
    } else if (!this.#lines.length) {
      return [cursorEnd, new Point(0, 0)]
    } else {
      currentLineWidth = this.#lines[cursorEnd.y][1]
      totalHeight = this.#lines.length
    }

    // Calculate the viewport location where the cursor will be drawn
    // x location:
    let cursorX: number
    if (currentLineWidth + 1 <= visibleSize.width) {
      // If the viewport can accommodate the entire line
      // draw the cursor at its natural location.
      cursorX = cursorEnd.x
    } else if (cursorEnd.x < halfWidth) {
      // If the cursor is at the start of the line
      // place the cursor at the start of the viewport
      cursorX = cursorEnd.x
    } else if (cursorEnd.x >= currentLineWidth - halfWidth) {
      // or if the cursor is at the end of the line
      // draw it at the end of the viewport
      cursorX = visibleSize.width - currentLineWidth + cursorEnd.x
    } else {
      // otherwise place it in the middle.
      cursorX = halfWidth
    }

    // y location:
    let cursorY: number
    if (totalHeight <= visibleSize.height) {
      // If the viewport can accommodate the entire height
      // draw the cursor at its natural location.
      cursorY = cursorEnd.y
    } else if (cursorEnd.y < halfHeight) {
      // If the cursor is at the start of the text
      // place the cursor at the start of the viewport
      cursorY = cursorEnd.y
    } else if (cursorEnd.y >= totalHeight - halfHeight) {
      // or if the cursor is at the end of the text
      // draw it at the end of the viewport
      cursorY = visibleSize.height - totalHeight + cursorEnd.y
    } else {
      // otherwise place it in the middle.
      cursorY = halfHeight
    }

    // The viewport location where the cursor will be drawn
    return [cursorEnd, new Point(cursorX, cursorY)]
  }

  #receiveChar(char: string) {
    if (isEmptySelection(this.#cursor)) {
      this.#chars = this.#chars
        .slice(0, this.#cursor.start)
        .concat(char, this.#chars.slice(this.#cursor.start))
      this.#cursor.start = this.#cursor.end = this.#cursor.start + 1
      this.#maxLineWidth += unicode.charWidth(char)
    } else {
      this.#chars = this.#chars
        .slice(0, this.minSelected())
        .concat(char, this.#chars.slice(this.maxSelected()))
      this.#cursor.start = this.#cursor.end = this.minSelected() + 1
      this.#updateWidth()
    }
  }

  #receiveKeyPrintable({char}: KeyEvent) {
    this.#receiveChar(char)
  }

  #receiveKeyUpArrow({shift}: KeyEvent) {
    if (shift) {
      this.#cursor.end = 0
    } else {
      this.#cursor = {start: 0, end: 0}
    }
  }

  #receiveKeyDownArrow({shift}: KeyEvent) {
    if (shift) {
      this.#cursor.end = this.#chars.length
    } else {
      this.#cursor = {start: this.#chars.length, end: this.#chars.length}
    }
  }

  #prevWordOffset(shift: boolean): number {
    let cursor: number
    if (shift) {
      cursor = this.#cursor.end
    } else if (isEmptySelection(this.#cursor)) {
      cursor = this.#cursor.start
    } else {
      cursor = this.minSelected()
    }

    let prevWordOffset: number = 0
    for (const [chars, offset] of unicode.words(this.#chars)) {
      prevWordOffset = offset
      if (cursor <= offset + chars.length) {
        break
      }
    }

    return prevWordOffset
  }

  #nextWordOffset(shift: boolean): number {
    let cursor: number
    if (shift) {
      cursor = this.#cursor.end
    } else if (isEmptySelection(this.#cursor)) {
      cursor = this.#cursor.start
    } else {
      cursor = this.maxSelected()
    }

    let nextWordOffset: number = 0
    for (const [chars, offset] of unicode.words(this.#chars)) {
      nextWordOffset = offset + chars.length
      if (cursor < offset + chars.length) {
        break
      }
    }

    return nextWordOffset
  }

  #receiveKeyLeftArrow({shift, meta}: KeyEvent) {
    if (meta) {
      const prevWordOffset = this.#prevWordOffset(shift)
      if (shift) {
        this.#cursor.end = prevWordOffset
      } else {
        this.#cursor.start = this.#cursor.end = prevWordOffset
      }
    } else if (shift) {
      this.#cursor.end = Math.max(0, this.#cursor.end - 1)
    } else if (isEmptySelection(this.#cursor)) {
      this.#cursor.start = this.#cursor.end = Math.max(
        0,
        this.#cursor.start - 1,
      )
    } else {
      this.#cursor.start = this.#cursor.end = this.minSelected()
    }
  }

  #receiveKeyRightArrow({shift, meta}: KeyEvent) {
    if (meta) {
      const nextWordOffset = this.#nextWordOffset(shift)
      if (shift) {
        this.#cursor.end = nextWordOffset
      } else {
        this.#cursor.start = this.#cursor.end = nextWordOffset
      }
    } else if (shift) {
      this.#cursor.end = Math.min(this.#chars.length, this.#cursor.end + 1)
    } else if (isEmptySelection(this.#cursor)) {
      this.#cursor.start = this.#cursor.end = Math.min(
        this.#chars.length,
        this.#cursor.start + 1,
      )
    } else {
      this.#cursor.start = this.#cursor.end = this.maxSelected()
    }
  }

  #updateWidth() {
    this.#maxLineWidth = this.#chars
      .map(unicode.charWidth)
      .reduce((a, b) => a + b, 0 as number)
  }

  #deleteSelection() {
    this.#chars = this.#chars
      .slice(0, this.minSelected())
      .concat(this.#chars.slice(this.maxSelected()))
    this.#cursor.start = this.#cursor.end = this.minSelected()
    this.#updateWidth()
  }

  #receiveKeyBackspace() {
    if (isEmptySelection(this.#cursor)) {
      if (this.#cursor.start === 0) {
        return
      }
      this.#chars = this.#chars
        .slice(0, this.#cursor.start - 1)
        .concat(this.#chars.slice(this.#cursor.start))
      this.#cursor.start = this.#cursor.end = this.#cursor.start - 1
    } else {
      this.#deleteSelection()
    }
  }

  #receiveKeyDelete() {
    if (isEmptySelection(this.#cursor)) {
      if (this.#cursor.start > this.#chars.length - 1) {
        return
      }
      this.#maxLineWidth -= unicode.charWidth(this.#chars[this.#cursor.start])
      this.#chars = this.#chars
        .slice(0, this.#cursor.start)
        .concat(this.#chars.slice(this.#cursor.start + 1))
    } else {
      this.#deleteSelection()
    }
  }

  #receiveKeyDeleteWord() {
    if (!isEmptySelection(this.#cursor)) {
      return this.#deleteSelection()
    }

    if (this.#cursor.start === 0) {
      return
    }

    const offset = this.#prevWordOffset(false)
    this.#chars = this.#chars
      .slice(0, offset)
      .concat(this.#chars.slice(this.#cursor.start))
    this.#cursor.start = this.#cursor.end = offset
    this.#updateWidth()
  }
}

function isEmptySelection(cursor: Cursor) {
  return cursor.start === cursor.end
}

function isInSelection(
  cursorMin: Point,
  cursorMax: Point,
  scanTextPosition: Point,
) {
  if (scanTextPosition.y < cursorMin.y || scanTextPosition.y > cursorMax.y) {
    return false
  }

  if (scanTextPosition.y === cursorMin.y) {
    if (scanTextPosition.x < cursorMin.x) {
      return false
    }
  }

  if (scanTextPosition.y === cursorMax.y) {
    if (scanTextPosition.x >= cursorMax.x) {
      return false
    }
  }

  return true
}
