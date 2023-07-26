import type {Color} from './Color'
import {Style} from './Style'

export type Purpose =
  | 'primary'
  | 'secondary'
  | 'proceed'
  | 'cancel'
  | 'selected'
  | 'plain'

const defaultText = '#E2E2E2(253)'
const defaultBrightText = '#FFF(16)'

interface Props {
  text?: Color
  brightText?: Color
  background: Color
  textBackground?: Color
  highlight: Color
  darken: Color
}

export class Theme {
  textColor: Color
  brightText: Color
  background: Color
  textBackground: Color
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
    darken: '#A66A16',
  })
  static proceed = new Theme({
    background: '#108040',
    highlight: '#1EB317',
    darken: '#0C6030',
  })
  static cancel = new Theme({
    background: '#981618',
    highlight: '#C51B1E',
    darken: '#821113',
  })
  static selected = new Theme({
    text: '#383838(236)',
    background: '#BDBDBD(250)',
    highlight: '#E6E6E6(254)',
    darken: '#7F7F7F(243)',
  })
  static plain = new Theme({
    background: '#4F4F4F(239)',
    textBackground: 'default',
    highlight: '#616161(241)',
    darken: '#3F3F3F(237)',
  })

  constructor({
    text,
    brightText,
    background,
    textBackground,
    highlight,
    darken,
  }: Props) {
    this.textColor = text ?? defaultText
    this.brightText = brightText ?? defaultBrightText
    this.background = background
    this.textBackground = textBackground ?? background
    this.highlight = highlight
    this.darken = darken
  }

  ui({
    isPressed,
    isHover,
    isOrnament,
  }: {
    isPressed?: boolean
    isHover?: boolean
    isOrnament?: boolean
  } = {}): Style {
    return new Style({
      foreground: isOrnament
        ? isPressed
          ? this.darken
          : this.highlight
        : this.textColor,
      background: isPressed
        ? this.darken
        : isHover
        ? this.highlight
        : this.background,
    })
  }

  text({
    isPressed,
    isHover,
  }: {
    isPressed?: boolean
    isHover?: boolean
  } = {}): Style {
    if (isPressed) {
      return new Style({
        foreground: this.highlight,
        background: this.textBackground,
      })
    }
    if (isHover) {
      return new Style({
        foreground: this.brightText,
        background: this.textBackground,
      })
    }
    return new Style({
      foreground: this.textColor,
      background: this.textBackground,
    })
  }
}
