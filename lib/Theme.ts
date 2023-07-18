import type {Color} from './Color'

export interface ColorGroup {
  foreground: Color
  background: Color
  highlight: Color
  active: Color
}

export type ThemeType = keyof Theme

const foreground = '#E2E2E2'

export class Theme {
  default: ColorGroup
  confirm: ColorGroup
  destroy: ColorGroup
  action: ColorGroup

  static default = new Theme({
    default: {
      foreground,
      background: '#0953E3',
      highlight: '#0C61FF',
      active: '#FFF',
    },
    confirm: {
      foreground,
      background: '#108040',
      highlight: '#1EB317',
      active: '#FFF',
    },
    destroy: {
      foreground,
      background: '#981618',
      highlight: '#C51B1E',
      active: '#FFF',
    },
    action: {
      foreground,
      background: '#D0851C',
      highlight: '#F39614',
      active: '#FFF',
    },
  })

  constructor({
    default: _default,
    confirm,
    destroy,
    action,
  }: Record<keyof Theme, ColorGroup>) {
    this.default = _default
    this.confirm = confirm
    this.destroy = destroy
    this.action = action
  }
}
