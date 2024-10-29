import {Container} from '../Container'
import {Point, Size} from '../geometry'
import {Style} from '../Style'
import {Viewport} from '../Viewport'
import {Text} from './Text'
import {type FontFamily} from './types'
import {type Props as ViewProps} from '../View'

interface Props extends ViewProps {
  text: string
  border: 'single' | 'bold' | 'double'
  font?: FontFamily
  bold?: boolean
  dim?: boolean
}

export class Header extends Container {
  #text: Text
  #style: Style
  #border: Props['border'] = 'single'

  constructor({bold, dim, text, font, ...props}: Props) {
    super(props)

    this.#border = props.border

    this.#style = new Style({
      bold: bold,
      dim: dim,
    })
    this.#text = new Text({
      text: text,
      font: font,
      style: this.#style,
    })

    this.add(this.#text)
  }

  naturalSize(available: Size) {
    return this.#text.naturalSize(available).grow(2, 1)
  }

  render(viewport: Viewport) {
    const inside = viewport.contentRect.inset({left: 1, right: 1, bottom: 1})
    viewport.clipped(inside, inside => {
      this.#text.render(inside)
    })

    const maxWidth = this.#text.naturalSize(Size.zero).width + 2
    let border
    switch (this.#border) {
      case 'single':
        border = '─'
        break
      case 'bold':
        border = '━'
        break
      case 'double':
        border = '═'
        break
    }
    viewport.write(
      border.repeat(maxWidth),
      new Point(0, viewport.contentSize.height - 1),
      this.#style,
    )
  }
}

export function H1(text: string = '') {
  return new Header({
    text,
    border: 'double',
    font: 'script',
    bold: true,
  })
}

export function H2(text: string = '') {
  return new Header({
    text,
    border: 'bold',
    font: 'script',
  })
}

export function H3(text: string = '') {
  return new Header({
    text,
    border: 'single',
    font: 'sans-bold',
    bold: true,
  })
}

export function H4(text: string = '') {
  return new Header({
    text,
    border: 'single',
    font: 'sans',
  })
}

export function H5(text: string = '') {
  return new Header({
    text,
    border: 'single',
    font: 'serif-bold',
    bold: true,
    dim: true,
  })
}

export function H6(text: string = '') {
  return new Header({
    text,
    font: 'serif-italic',
    border: 'single',
    dim: true,
  })
}
