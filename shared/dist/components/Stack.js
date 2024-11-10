"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
const View_1 = require("../View");
const Container_1 = require("../Container");
const geometry_1 = require("../geometry");
const util_1 = require("../util");
function fromShorthand(props, direction, extraProps = {}) {
    if (Array.isArray(props)) {
        return { children: props, direction, ...extraProps };
    }
    else {
        return { ...props, direction, ...extraProps };
    }
}
class Stack extends Container_1.Container {
    #direction = 'down';
    #gap = 0;
    #fill = true;
    #sizes = new Map();
    static down(props = {}, extraProps = {}) {
        const direction = 'down';
        return new Stack(fromShorthand(props, direction, extraProps));
    }
    static up(props = {}, extraProps = {}) {
        const direction = 'up';
        return new Stack(fromShorthand(props, direction, extraProps));
    }
    static right(props = {}, extraProps = {}) {
        const direction = 'right';
        return new Stack(fromShorthand(props, direction, extraProps));
    }
    static left(props = {}, extraProps = {}) {
        const direction = 'left';
        return new Stack(fromShorthand(props, direction, extraProps));
    }
    constructor({ children, child, direction, fill, gap, ...viewProps }) {
        super(viewProps);
        (0, util_1.define)(this, 'direction', { enumerable: true });
        (0, util_1.define)(this, 'gap', { enumerable: true });
        this.#update({ direction, fill, gap });
        this.#updateChildren(children, child);
    }
    get direction() {
        return this.#direction;
    }
    set direction(value) {
        this.#direction = value;
        this.invalidateSize();
    }
    get gap() {
        return this.#gap;
    }
    set gap(value) {
        this.#gap = value;
        this.invalidateSize();
    }
    update({ children, child, ...props }) {
        this.#update(props);
        this.#updateChildren(children, child);
        super.update(props);
    }
    #updateChildren(children, child) {
        // this logic comes from Container
        if (child !== undefined) {
            children = (children ?? []).concat([child]);
        }
        if (children === undefined) {
            return;
        }
        if (children.length) {
            const childrenSet = new Set(children);
            for (const child of this.children) {
                if (!childrenSet.has(child)) {
                    this.removeChild(child);
                }
            }
            for (const info of children) {
                let flexSize, child;
                if (info instanceof View_1.View) {
                    flexSize = info.flex;
                    child = info;
                }
                else {
                    ;
                    [flexSize, child] = info;
                    flexSize = (0, View_1.parseFlexShorthand)(flexSize);
                }
                this.addFlex(flexSize, child);
            }
        }
        else {
            this.removeAllChildren();
        }
    }
    #update({ direction, fill, gap }) {
        this.#direction = direction ?? 'down';
        this.#fill = fill ?? true;
        this.#gap = gap ?? 0;
    }
    naturalSize(available) {
        const size = geometry_1.Size.zero.mutableCopy();
        const remainingSize = available.mutableCopy();
        let hasFlex = false;
        for (const child of this.children) {
            const childSize = child.naturalSize(remainingSize);
            if (!child.isVisible) {
                continue;
            }
            if (this.isVertical) {
                if (size.height) {
                    size.height += this.#gap;
                }
                remainingSize.height = Math.max(0, remainingSize.height - childSize.height);
                size.width = Math.max(size.width, childSize.width);
                size.height += childSize.height;
            }
            else {
                if (size.width) {
                    size.width += this.#gap;
                }
                remainingSize.width = Math.max(0, remainingSize.width - childSize.width);
                size.width += childSize.width;
                size.height = Math.max(size.height, childSize.height);
            }
            const flexSize = this.#sizes.get(child);
            if (flexSize && flexSize !== 'natural') {
                hasFlex = true;
            }
        }
        if (hasFlex && this.#fill) {
            if (this.isVertical) {
                const height = Math.max(size.height, available.height);
                return new geometry_1.Size(size.width, height);
            }
            else {
                const width = Math.max(size.width, available.width);
                return new geometry_1.Size(width, size.height);
            }
        }
        return size;
    }
    add(child, at) {
        super.add(child, at);
        this.#sizes.set(child, child.flex);
    }
    addFlex(flexSize, child, at) {
        super.add(child, at);
        this.#sizes.set(child, flexSize);
    }
    get isVertical() {
        return this.#direction === 'down' || this.#direction === 'up';
    }
    render(viewport) {
        if (viewport.isEmpty) {
            return super.render(viewport);
        }
        const remainingSize = viewport.contentSize.mutableCopy();
        let flexTotal = 0;
        let flexCount = 0;
        // first pass, calculate all the naturalSizes and subtract them from the
        // contentSize - leftovers are divided to the flex views. naturalSizes might
        // as well be memoized along with the flex amounts
        const flexViews = [];
        for (const child of this.children) {
            if (!child.isVisible) {
                continue;
            }
            if (flexViews.length) {
                if (this.isVertical) {
                    remainingSize.height = Math.max(0, remainingSize.height - this.#gap);
                }
                else {
                    remainingSize.width = Math.max(0, remainingSize.width - this.#gap);
                }
            }
            const flexSize = this.#sizes.get(child) ?? 'natural';
            if (flexSize === 'natural') {
                const childSize = child.naturalSize(remainingSize);
                if (this.isVertical) {
                    flexViews.push(['natural', childSize.height, child]);
                    remainingSize.height -= childSize.height;
                }
                else {
                    flexViews.push(['natural', childSize.width, child]);
                    remainingSize.width -= childSize.width;
                }
                remainingSize.height = Math.max(0, remainingSize.height);
                remainingSize.width = Math.max(0, remainingSize.width);
            }
            else {
                flexTotal += flexSize;
                flexViews.push([flexSize, flexSize, child]);
                flexCount += 1;
            }
        }
        let origin;
        switch (this.#direction) {
            case 'right':
            case 'down':
                origin = geometry_1.Point.zero.mutableCopy();
                break;
            case 'left':
                origin = new geometry_1.Point(viewport.contentSize.width, 0);
                break;
            case 'up':
                origin = new geometry_1.Point(0, viewport.contentSize.height);
                break;
        }
        // stores the leftover rounding errors, and added to view once it exceeds 1
        let correctAmount = 0;
        // second pass, divide up the remainingSize to the flex views, subtracting off
        // of remainingSize. The last view receives any leftover height
        const totalRemainingSize = this.isVertical
            ? remainingSize.height
            : remainingSize.width;
        let remainingDimension = totalRemainingSize;
        let isFirst = true;
        for (const [flexSize, amount, child] of flexViews) {
            const childSize = viewport.contentSize.mutableCopy();
            if (!isFirst) {
                remainingDimension -= this.#gap;
            }
            if (flexSize === 'natural') {
                if (this.isVertical) {
                    childSize.height = amount;
                }
                else {
                    childSize.width = amount;
                }
            }
            else {
                // rounding errors can compound, so we track the error and add it to subsequent
                // views; the last view receives the amount left in remainingSize (0..1)
                let size = (totalRemainingSize / flexTotal) * amount + correctAmount;
                correctAmount = size - ~~size;
                remainingDimension -= ~~size;
                // --flexCount === 0 checks for the last flex view
                if (--flexCount === 0) {
                    size += remainingDimension;
                }
                if (this.isVertical) {
                    childSize.height = ~~size;
                }
                else {
                    childSize.width = ~~size;
                }
            }
            if (this.#direction === 'left') {
                origin.x -= childSize.width;
            }
            else if (this.#direction === 'up') {
                origin.y -= childSize.height;
            }
            if (!isFirst) {
                if (this.#direction === 'right') {
                    origin.x += this.#gap;
                }
                else if (this.#direction === 'down') {
                    origin.y += this.#gap;
                }
            }
            viewport.clipped(new geometry_1.Rect(origin, childSize), inside => {
                child.render(inside);
            });
            if (!isFirst) {
                if (this.#direction === 'left') {
                    origin.x -= this.#gap;
                }
                else if (this.#direction === 'up') {
                    origin.y -= this.#gap;
                }
            }
            if (this.#direction === 'right') {
                origin.x += childSize.width;
            }
            else if (this.#direction === 'down') {
                origin.y += childSize.height;
            }
            isFirst = false;
        }
    }
}
exports.Stack = Stack;
//# sourceMappingURL=Stack.js.map