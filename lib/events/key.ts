import type {KeyEvent as WretchedKeyEvent} from '../sys'

export type KeyEvent = WretchedKeyEvent & {type: 'key'}

export function isKeyPrintable(event: KeyEvent) {
  switch (event.name) {
    case 'up':
    case 'down':
    case 'left':
    case 'right':
    case 'pageup':
    case 'pagedown':
    case 'home':
    case 'end':
    case 'insert':
    case 'clear':
    case 'enter':
    case 'return':
    case 'escape':
    case 'tab':
    case 'delete':
    case 'backspace':
    case 'f1':
    case 'f2':
    case 'f3':
    case 'f4':
    case 'f1':
    case 'f2':
    case 'f3':
    case 'f4':
    case 'f1':
    case 'f2':
    case 'f3':
    case 'f4':
    case 'f5':
    case 'f5':
    case 'f6':
    case 'f7':
    case 'f8':
    case 'f9':
    case 'f10':
    case 'f11':
    case 'f12':
      return false
  }
  return true
}
