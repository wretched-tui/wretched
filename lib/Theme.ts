import type {Color} from './Color'

export interface ColorGroup {
  background: Color
  highlight: Color
}

export type ThemeType = 'default' | 'confirm' | 'destroy' | 'action'

const text = '#E2E2E2'

export class Theme {
  text: Color
  default: ColorGroup
  confirm: ColorGroup
  destroy: ColorGroup
  action: ColorGroup

  static default = new Theme({
    text,
    default: {
      background: '#0032FA',
      highlight: '#0070FF',
    },
    confirm: {
      background: '#108040',
      highlight: '#1EB317',
    },
    destroy: {
      background: '#981618',
      highlight: '#C51B1E',
    },
    action: {
      background: '#D0851C',
      highlight: '#F39614',
    },
  })

  constructor({text, default: _default, confirm, destroy, action}: Theme) {
    this.text = text
    this.default = _default
    this.confirm = confirm
    this.destroy = destroy
    this.action = action
  }
}
