"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const geometry_1 = require("./geometry");
const View_1 = require("./View");
const util_1 = require("./util");
class Container extends View_1.View {
    #children = [];
    constructor({ child, children, ...viewProps } = {}) {
        super(viewProps);
        (0, util_1.define)(this, 'children', { enumerable: true });
        if (child) {
            this.add(child);
        }
        else if (children) {
            for (const child of children) {
                this.add(child);
            }
        }
    }
    get children() {
        return this.#children;
    }
    update(props) {
        this.#update(props);
        super.update(props);
    }
    #update({ child, children }) {
        // Stack recreates this logic
        if (child !== undefined) {
            children = (children ?? []).concat([child]);
        }
        if (children === undefined) {
            return;
        }
        if (children.length) {
            const childrenSet = new Set(children);
            for (const child of this.#children) {
                if (!childrenSet.has(child)) {
                    this.#removeChild(child);
                }
            }
            for (const child of children) {
                this.add(child);
            }
        }
        else {
            this.removeAllChildren();
        }
    }
    naturalSize(available) {
        let width = 0;
        let height = 0;
        for (const child of this.#children) {
            if (!child.isVisible) {
                continue;
            }
            const naturalSize = child.naturalSize(available);
            width = Math.max(width, naturalSize.width);
            height = Math.max(height, naturalSize.height);
        }
        return new geometry_1.Size(width, height);
    }
    render(viewport) {
        this.renderChildren(viewport);
    }
    renderChildren(viewport) {
        for (const child of this.#children) {
            if (!child.isVisible) {
                continue;
            }
            child.render(viewport);
        }
    }
    add(child, at) {
        // early exit for adding child at its current index
        if (this.#children.length &&
            this.#children[at ?? this.#children.length - 1] === child) {
            return;
        }
        if (child.parent === this) {
            // only changing the order - remove it from this.#children, and add it back
            // below at the correct index
            this.#children = this.#children.filter(view => view !== child);
        }
        else {
            child.willMoveTo(this);
            if (child.parent && child.parent instanceof Container) {
                const index = child.parent.#children.indexOf(child);
                if (~index) {
                    child.parent.#children.splice(index, 1);
                }
            }
        }
        this.#children.splice(at ?? this.#children.length, 0, child);
        if (child.parent !== this) {
            const parent = child.parent;
            child.parent = this;
            if (parent) {
                child.didMoveFrom(parent);
            }
        }
        // in theory we could call 'didReorder' in the else clause
        // takes care of didMount, noop if screen == this.screen
        child.moveToScreen(this.screen);
        this.invalidateSize();
    }
    #removeChild(child) {
        child.parent = undefined;
        child.didMoveFrom(this);
        // takes care of didUnmount
        child.moveToScreen(undefined);
    }
    removeAllChildren() {
        for (const child of this.#children) {
            this.removeChild(child);
        }
    }
    removeChild(child) {
        if (child.parent !== this) {
            return;
        }
        const index = this.#children.indexOf(child);
        if (~index && index >= 0 && index < this.#children.length) {
            const child = this.#children[index];
            this.#children.splice(index, 1);
            this.#removeChild(child);
        }
    }
    moveToScreen(screen) {
        super.moveToScreen(screen);
        for (const child of this.#children) {
            child.moveToScreen(this.screen);
        }
    }
}
exports.Container = Container;
//# sourceMappingURL=Container.js.map