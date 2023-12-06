import type {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'
import type {Color} from '../Color'
import {Style} from '../Style'
import {View} from '../View'
import {Size} from '../geometry'

interface Props extends ViewProps {
  background?: Color
}

export class Space extends View {
  background?: Color

  constructor(props: Props = {}) {
    super(props)
    this.#update(props)
  }

  update(props: Props) {
    super.update(props)
    this.#update(props)
  }

  #update({background}: Props) {
    this.background = background
  }

  naturalSize(): Size {
    return Size.zero
  }

  #prev = this.background
  render(viewport: Viewport) {
    if (!this.background) {
      return
    }

    if (this.#prev !== this.background) {
      this.#prev = this.background
    }
    const style = new Style({background: this.background})
    viewport.paint(style)
  }
}
