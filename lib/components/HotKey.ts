import type {Viewport} from '../Viewport'
import {type Props as ContainerProps, Container} from '../Container'
import {Size} from '../geometry'
import {HotKey as HotKeyEvent} from '../events'

export interface Props extends ContainerProps {
  hotKey: HotKeyEvent
}

export class HotKey extends Container {
  #hotKey: HotKeyEvent = {char: ''}

  constructor(props: Props) {
    super(props)

    this.#update(props)
  }

  update(props: Props) {
    this.#update(props)
    super.update(props)
  }

  #update({hotKey}: Props) {
    this.#hotKey = hotKey
  }

  naturalSize(availableSize: Size): Size {
    return Size.zero
  }

  render(viewport: Viewport) {
    if (viewport.isEmpty) {
      return super.render(viewport)
    }

    viewport.registerHotKey(this.#hotKey)
  }
}
