"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collapsible = void 0;
const Container_1 = require("../Container");
const Text_1 = require("./Text");
const geometry_1 = require("../geometry");
const events_1 = require("../events");
class Collapsible extends Container_1.Container {
    /**
     * Also assignable as child-view 0 (this is a React support hack)
     */
    #collapsedView;
    /**
     * Also assignable as child-view 1 (this is a React support hack)
     */
    #expandedView;
    #isCollapsed = true;
    #showCollapsed = false;
    constructor(props) {
        super(props);
        this.#update(props);
    }
    update(props) {
        this.#update(props);
        super.update(props);
    }
    add(child, at) {
        super.add(child, at);
        this.#collapsedView = this.children.at(0);
        this.#expandedView = this.children.at(1);
    }
    removeChild(child) {
        super.removeChild(child);
        this.#collapsedView = this.children.at(0);
        this.#expandedView = this.children.at(1);
    }
    #update({ isCollapsed, showCollapsed, collapsed: collapsedView, expanded: expandedView, }) {
        this.#isCollapsed = isCollapsed ?? true;
        this.#showCollapsed = showCollapsed ?? false;
        // edge case: expandedView is being assigned, but not collapsedView
        if (expandedView && !collapsedView) {
            collapsedView = this.#collapsedView ?? new Text_1.Text();
        }
        if (collapsedView && collapsedView !== this.#collapsedView) {
            this.#collapsedView?.removeFromParent();
            this.add(collapsedView, 0);
        }
        if (expandedView && expandedView !== this.#expandedView) {
            this.#expandedView?.removeFromParent();
            this.add(expandedView, 1);
        }
    }
    naturalSize(available) {
        let size;
        if (this.#isCollapsed) {
            size = this.#collapsedView?.naturalSize(available) ?? geometry_1.Size.zero;
        }
        else if (this.#showCollapsed) {
            let collapsedSize = this.#collapsedView?.naturalSize(available) ?? geometry_1.Size.zero;
            const remaining = available.shrink(0, collapsedSize.height);
            size = this.#expandedView?.naturalSize(remaining) ?? geometry_1.Size.zero;
            size = size.growHeight(collapsedSize);
        }
        else {
            size = this.#expandedView?.naturalSize(available) ?? geometry_1.Size.zero;
        }
        return size.grow(2, 0);
    }
    receiveMouse(event, system) {
        super.receiveMouse(event, system);
        if ((0, events_1.isMouseClicked)(event)) {
            this.#isCollapsed = !this.#isCollapsed;
            this.invalidateSize();
        }
    }
    render(viewport) {
        if (viewport.isEmpty) {
            return super.render(viewport);
        }
        viewport.registerMouse(['mouse.button.left', 'mouse.move']);
        const textStyle = this.theme.text({
            isPressed: this.isPressed,
            isHover: this.isHover,
        });
        viewport.paint(textStyle);
        const offset = new geometry_1.Point(2, 0);
        viewport.write(this.#isCollapsed ? '►' : '▼', new geometry_1.Point(0, offset.y), textStyle);
        const contentSize = viewport.contentSize.shrink(2, 0);
        viewport.clipped(new geometry_1.Rect(offset, contentSize), inside => {
            if (this.#isCollapsed) {
                this.#collapsedView?.render(inside);
            }
            else if (this.#showCollapsed) {
                const collapsedSize = this.#collapsedView?.naturalSize(contentSize) ?? geometry_1.Size.zero;
                let remaining = contentSize;
                remaining = remaining.shrink(0, collapsedSize.height);
                this.#collapsedView?.render(inside);
                viewport.clipped(new geometry_1.Rect([0, collapsedSize.height], remaining), inside => {
                    this.#expandedView?.render(inside);
                });
            }
            else {
                this.#expandedView?.render(inside);
            }
        });
    }
}
exports.Collapsible = Collapsible;
//# sourceMappingURL=Collapsible.js.map