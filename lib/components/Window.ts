import type {Viewport} from '../Viewport'
import {type Props as ContainerProps, Container} from '../Container'
import {Size} from '../geometry'

export class Window extends Container {
  constructor({children, ...viewProps}: ContainerProps = {}) {
    super(viewProps)
  }

  naturalSize(size: Size): Size {
    return size
  }
}
