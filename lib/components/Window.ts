import type {Viewport} from '../Viewport'
import {type Props as ViewProps, View} from '../View'
import {Container} from '../Container'
import {Size} from '../geometry'

interface Props extends ViewProps {
  children?: View[]
}

export class Window extends Container {
  constructor({children, ...viewProps}: Props = {}) {
    super(viewProps)

    if (children) {
      this.addAll(children)
    }
  }

  naturalSize(size: Size): Size {
    return size
  }

  render(viewport: Viewport) {
    this.renderChildren(viewport)
  }
}
