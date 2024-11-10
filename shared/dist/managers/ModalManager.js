"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalManager = void 0;
const Container_1 = require("../Container");
const events_1 = require("../events");
class ModalManager {
    #modalView = new Modal();
    #modal;
    reset() {
        this.#modal = undefined;
    }
    requestModal(parent, modal, onClose, rect) {
        if (!this.#canRequestModal(parent)) {
            return false;
        }
        if (this.#modal && this.#modal[0] !== modal) {
            this.#modal[1]();
        }
        this.#modal = [modal, onClose, rect];
        return true;
    }
    renderModals(screen, viewport) {
        this.#modalView.moveToScreen(screen);
        let lastView = screen.rootView;
        // this.#modal can be assigned _another modal_
        while (this.#modal) {
            const [view, onClose, rect] = this.#modal;
            // preRender calls reset() which assigns this.#modal = undefined
            screen.preRender(view);
            lastView = view;
            this.#modalView.updateView(view, onClose);
            this.#modalView.naturalSize(viewport.contentSize);
            viewport.parentRect = rect;
            this.#modalView.render(viewport);
        }
        return lastView;
    }
    #canRequestModal(view) {
        return this.#modal === undefined;
    }
}
exports.ModalManager = ModalManager;
class Modal extends Container_1.Container {
    #view = null;
    #onClose = null;
    updateView(view, onClose) {
        this.#onClose = onClose;
        if (this.#view === view) {
            return;
        }
        if (this.#view) {
            this.removeChild(this.#view);
        }
        this.add(view);
        this.#view = view;
    }
    receiveMouse(event) {
        if ((0, events_1.isMouseClicked)(event)) {
            this.#onClose?.();
        }
    }
    render(viewport) {
        viewport.registerMouse('mouse.button.left');
        super.render(viewport);
    }
}
//# sourceMappingURL=ModalManager.js.map