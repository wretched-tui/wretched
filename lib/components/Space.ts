import type {Viewport} from '../Viewport'
import {View} from '../View'
import {Size} from '../geometry'

export class Space extends View {
  intrinsicSize(): Size {
    return Size.zero
  }

  render(viewport: Viewport) {}
}
