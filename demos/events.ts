import {
  Box,
  ConsoleLog,
  Flex,
  Flow,
  Input,
  KeyEvent,
  Size,
  Space,
  View,
  Viewport,
  interceptConsoleLog,
} from 'wretched'

import {demo} from './demo'

interceptConsoleLog()

class Keys extends View {
  constructor() {
    super({})
  }

  naturalSize() {
    return Size.zero
  }

  receiveKey(event: KeyEvent) {
    console.log({event})
  }

  render(viewport: Viewport) {
    viewport.registerFocus()
  }
}

class Mouse extends View {
  constructor() {
    super({})
  }

  naturalSize(available: Size) {
    return available
  }

  receiveKey(event: KeyEvent) {
    console.log({event})
  }

  render(viewport: Viewport) {
    viewport.registerMouse(['mouse.button.all'])
  }
}

demo(
  Flex.down([
    new Keys(),
    // new Mouse(),
    new ConsoleLog({flex: 1}),
  ]),
  false,
)
