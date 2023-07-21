import type {View} from '../View'
import {Container} from '../Container'
import type {Viewport} from '../Viewport'
import type {Screen} from '../Screen'
import type {Rect} from '../geometry'
import type {MouseEvent} from '../events'
import {isMouseClicked} from '../events'

export class ModalManager {
  #modalView = new Modal()
  #modal: [View, () => void, Rect] | undefined

  reset() {
    this.#modal = undefined
  }

  requestModal(
    parent: View,
    modal: View,
    onClose: () => void,
    rect: Rect,
  ): boolean {
    if (!this.#canRequestModal(parent)) {
      return false
    }

    this.#modal = [modal, onClose, rect]

    return true
  }

  renderModals(screen: Screen, viewport: Viewport) {
    this.#modalView.moveToScreen(screen)

    let lastView: View | undefined
    while (this.#modal) {
      const [view, onClose, rect] = this.#modal

      lastView = view
      this.#modalView.updateView(view, onClose)
      this.#modalView.intrinsicSize(viewport.contentSize)

      screen.preRender()
      viewport.parentRect = rect
      this.#modalView.render(viewport)
    }

    return lastView
  }

  #canRequestModal(view: View): boolean {
    return this.#modal === undefined
  }
}

class Modal extends Container {
  #view: View | null = null
  #onClose: (() => void) | null = null

  updateView(view: View, onClose: () => void) {
    this.#onClose = onClose

    if (this.#view === view) {
      return
    }

    if (this.#view) {
      this.remove(this.#view)
    }
    this.add(view)
    this.#view = view
  }

  receiveMouse(event: MouseEvent) {
    if (isMouseClicked(event)) {
      this.#onClose?.()
    }
  }

  render(viewport: Viewport) {
    viewport.registerMouse('mouse.button.left')
    super.render(viewport)
  }
}
