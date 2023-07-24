import type {Color} from './Color'
import {Style} from './Style'

export type Purpose =
  | 'primary'
  | 'secondary'
  | 'proceed'
  | 'cancel'
  | 'selected'
  | 'plain'

const defaultText = '#E2E2E2'

interface Props {
  text?: Color
  background: Color
  highlight: Color
  darken: Color
}

export class Theme {
  text: Color
  background: Color
  highlight: Color
  darken: Color

  static primary = new Theme({
    background: '#0032FA',
    highlight: '#0070FF',
    darken: '#0058C8',
  })
  static secondary = new Theme({
    background: '#D0851C',
    highlight: '#F39614',
    darken: '#F39614',
  })
  static proceed = new Theme({
    background: '#108040',
    highlight: '#1EB317',
    darken: '#1EB317',
  })
  static cancel = new Theme({
    background: '#981618',
    highlight: '#C51B1E',
    darken: '#C51B1E',
  })
  static selected = new Theme({
    text: '#383838',
    background: '#BDBDBD',
    highlight: '#E6E6E6',
    darken: '#E6E6E6',
  })
  static plain = new Theme({
    background: '#4F4F4F',
    highlight: '#616161',
    darken: '#616161',
  })

  constructor({text, background, highlight, darken}: Props) {
    this.text = text ?? defaultText
    this.background = background
    this.highlight = highlight
    this.darken = darken
  }

  default({
    isPressed,
    isHover,
  }: {
    isPressed?: boolean
    isHover?: boolean
  } = {}): Style {
    return new Style({
      foreground: this.text,
      background: isPressed
        ? this.darken
        : isHover
        ? this.highlight
        : this.background,
    })
  }

  border({
    isPressed,
    isHover,
  }: {
    isPressed?: boolean
    isHover?: boolean
  } = {}): Style {
    if (isPressed) {
      return new Style({
        foreground: this.darken,
        background: this.darken,
      })
    }
    if (isHover) {
      return new Style({
        foreground: this.highlight,
        background: this.highlight,
      })
    }
    return new Style({
      foreground: this.highlight,
      background: this.background,
    })
  }
}
