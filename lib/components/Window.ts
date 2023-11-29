import type {Viewport} from '../Viewport'
import {type Props as ViewProps, View} from '../View'
import {Container} from '../Container'
import {Size} from '../geometry'

interface ChildrenProps {
  children: View[]
  content?: undefined
}
interface ContentProps {
  content?: View
  children?: undefined
}
interface StyleProps extends ViewProps {}
type Props = StyleProps & (ChildrenProps | ContentProps)

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
