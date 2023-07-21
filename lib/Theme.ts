import type {Color} from './Color'

export interface ColorGroup {
  text: Color
  background: Color
  highlight: Color
}

export type ThemeType =
  | 'primary'
  | 'secondary'
  | 'confirm'
  | 'destroy'
  | 'selected'
  | 'blank'

const text = '#E2E2E2'

export class Theme {
  primary: ColorGroup
  secondary: ColorGroup
  confirm: ColorGroup
  destroy: ColorGroup
  selected: ColorGroup
  blank: ColorGroup

  static default = new Theme({
    primary: {
      text,
      background: '#0032FA',
      highlight: '#0070FF',
    },
    secondary: {
      text,
      background: '#D0851C',
      highlight: '#F39614',
    },
    confirm: {
      text,
      background: '#108040',
      highlight: '#1EB317',
    },
    destroy: {
      text,
      background: '#981618',
      highlight: '#C51B1E',
    },
    selected: {
      text: '#383838',
      background: '#BDBDBD',
      highlight: '#E6E6E6',
    },
    blank: {
      text,
      background: '#383838',
      highlight: '#616161',
    },
  })

  constructor({primary, secondary, confirm, destroy, selected, blank}: Theme) {
    this.primary = primary
    this.secondary = secondary
    this.confirm = confirm
    this.destroy = destroy
    this.selected = selected
    this.blank = blank
  }
}
