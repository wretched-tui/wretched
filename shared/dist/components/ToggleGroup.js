"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleGroup = void 0;
const sys_1 = require("../sys");
const Container_1 = require("../Container");
const geometry_1 = require("../geometry");
const events_1 = require("../events");
class ToggleGroup extends Container_1.Container {
    #multiple = false;
    #padding = 1;
    #offAxisPadding = 0;
    #direction = 'horizontal';
    #titles = [];
    #titlesCache = [];
    #sizeCache = geometry_1.Size.zero;
    #selected = new Set();
    #hover;
    constructor(props) {
        super(props);
        this.#update(props);
    }
    update(props) {
        super.update(props);
        this.#update(props);
    }
    get titles() {
        return this.#titles;
    }
    set titles(value) {
        this.#titles = value;
        this.#updateTitles(value);
        this.invalidateSize();
    }
    #update({ multiple, padding, direction, titles, selected }) {
        this.#multiple = multiple ?? false;
        this.#padding = Math.max(0, padding ?? 1);
        this.#offAxisPadding = Math.max(0, this.#padding - 1);
        this.#direction = direction ?? 'horizontal';
        this.#selected = new Set(selected);
        this.#updateTitles(titles);
    }
    #updateTitles(titles) {
        if (titles.length == 0) {
            this.#titlesCache = [];
            return;
        }
        const sizeCache = geometry_1.Size.zero.mutableCopy();
        this.#titlesCache = titles.map(title => {
            const size = sys_1.unicode.stringSize(title);
            if (this.#direction === 'horizontal') {
                const textWidth = size.width + 2 * this.#padding;
                sizeCache.width += BORDER.size + textWidth;
                sizeCache.height = Math.max(sizeCache.height, size.height);
            }
            else {
                const textHeight = size.height + 2 * this.#padding;
                sizeCache.width = Math.max(sizeCache.width, size.width);
                sizeCache.height += BORDER.size + textHeight;
            }
            return [title, size];
        });
        if (this.#direction === 'horizontal') {
            sizeCache.width += BORDER.size;
            sizeCache.height += BORDER.size * 2 + 2 * this.#offAxisPadding;
        }
        else {
            sizeCache.width += BORDER.size * 2 + 2 * this.#offAxisPadding;
            sizeCache.height += BORDER.size;
        }
        this.#sizeCache = sizeCache;
    }
    naturalSize() {
        return this.#sizeCache;
    }
    receiveMouse(event, system) {
        let x = 0;
        if (this.#direction === 'horizontal') {
            if (event.position.y >= this.#sizeCache.height) {
                this.#hover = undefined;
                return;
            }
            let hoverIndex = undefined;
            for (const [index, [_, size]] of this.#titlesCache.entries()) {
                const textWidth = size.width + 2 * this.#padding;
                x += 2 * BORDER.size + textWidth;
                if (event.position.x < x) {
                    hoverIndex = index;
                    break;
                }
                x -= BORDER.size;
            }
            if ((0, events_1.isMouseExit)(event)) {
                this.#hover = undefined;
            }
            else if ((0, events_1.isMouseEnter)(event) || (0, events_1.isMouseMove)(event)) {
                this.#hover = hoverIndex;
            }
            else if ((0, events_1.isMouseClicked)(event) && hoverIndex !== undefined) {
                if (this.#selected.has(hoverIndex)) {
                    this.#selected.delete(hoverIndex);
                }
                else if (this.#multiple) {
                    this.#selected.add(hoverIndex);
                }
                else {
                    this.#selected = new Set([hoverIndex]);
                }
            }
        }
    }
    render(viewport) {
        if (viewport.isEmpty) {
            return;
        }
        viewport.registerMouse(['mouse.button.left', 'mouse.move']);
        if (this.#direction === 'horizontal') {
            let x = 0;
            for (const [index, [text, size]] of this.#titlesCache.entries()) {
                const rect = new geometry_1.Rect([x, 0], [size.width + 2 + 2 * this.#padding, this.#sizeCache.height]);
                viewport.clipped(rect, inner => {
                    this.#renderGroupHorizontal(inner, text, size, index);
                });
                x += rect.size.width - 1;
            }
        }
        else {
            let y = 0;
            for (const [index, [text, size]] of this.#titlesCache.entries()) {
                const rect = new geometry_1.Rect([0, y], [this.#sizeCache.width, size.height + 2 + 2 * this.#padding]).offset(BORDER.size, 0);
                viewport.clipped(rect, inner => {
                    // this.#renderGroupVertical(
                    //   inner,
                    //   text,
                    //   size,
                    //   index,
                    // )
                });
            }
        }
    }
    #renderGroupHorizontal(viewport, text, size, index) {
        const maxIndex = this.#titlesCache.length - 1;
        const isFirst = index === 0;
        const isLast = index === maxIndex;
        const textWidth = size.width + 2 * this.#padding;
        const bottomPoint = geometry_1.Point.zero.offset(0, this.#sizeCache.height - 1);
        let border;
        if (this.#selected.has(index - 1) && this.#selected.has(index)) {
            border = BORDER_BOTH;
        }
        else if (this.#selected.has(index - 1)) {
            border = BORDER_PREV;
        }
        else if (this.#selected.has(index)) {
            border = BORDER_CURR;
        }
        else {
            border = BORDER;
        }
        if (this.#hover === index && this.#selected.has(index)) {
            border = {
                ...border,
                top: '━',
                bottom: '━',
                left: '┃',
                right: '┃',
                joinerHorizTop: '┏',
                joinerHorizBottom: '┗',
            };
        }
        else if (this.#hover === index) {
            border = {
                ...border,
                top: '─',
                bottom: '─',
                left: '│',
                right: '│',
                joinerHorizTop: '┌',
                joinerHorizBottom: '└',
            };
        }
        else if (this.#hover === index - 1 && this.#selected.has(index - 1)) {
            border = {
                ...border,
                joinerHorizTop: '┓',
                joinerHorizBottom: '┛',
            };
        }
        else if (this.#hover === index - 1) {
            border = {
                ...border,
                left: '│',
                joinerHorizTop: '┐',
                joinerHorizBottom: '┘',
            };
        }
        if (isFirst && isLast) {
            const top = border.tl + border.bottom.repeat(textWidth) + border.tr;
            const bottom = border.bl + border.bottom.repeat(textWidth) + border.br;
            viewport.write(top, geometry_1.Point.zero);
            viewport.write(bottom, bottomPoint);
        }
        else if (isFirst) {
            const top = border.tl + border.bottom.repeat(textWidth);
            const bottom = border.bl + border.bottom.repeat(textWidth);
            viewport.write(top, geometry_1.Point.zero);
            viewport.write(bottom, bottomPoint);
        }
        else if (isLast) {
            const top = border.joinerHorizTop + border.bottom.repeat(textWidth) + border.tr;
            const bottom = border.joinerHorizBottom + border.bottom.repeat(textWidth) + border.br;
            viewport.write(top, geometry_1.Point.zero);
            viewport.write(bottom, bottomPoint);
        }
        else {
            const top = border.joinerHorizTop + border.bottom.repeat(textWidth);
            const bottom = border.joinerHorizBottom + border.bottom.repeat(textWidth);
            viewport.write(top, geometry_1.Point.zero);
            viewport.write(bottom, bottomPoint);
        }
        let offsetY = 1;
        const line = border.left + ' '.repeat(textWidth) + border.right;
        for (let i = this.#sizeCache.height - 2 * BORDER.size; i-- > 0;) {
            viewport.write(line, geometry_1.Point.zero.offset(0, offsetY));
            offsetY += 1;
        }
        viewport.clipped(viewport.contentRect.offset(BORDER.size + this.#padding, BORDER.size + this.#offAxisPadding), inner => {
            inner.write(text, geometry_1.Point.zero);
        });
    }
}
exports.ToggleGroup = ToggleGroup;
const BORDER = {
    size: 1,
    top: '─',
    bottom: '─',
    left: '│',
    right: '│',
    joinerHorizTop: '┬',
    joinerHorizBottom: '┴',
    joinerVertRight: '┤',
    joinerVertLeft: '├',
    tl: '╭',
    tr: '╮',
    bl: '╰',
    br: '╯',
};
const BORDER_BOTH = {
    ...BORDER,
    top: '━',
    bottom: '━',
    left: '┃',
    right: '┃',
    joinerHorizTop: '┳',
    joinerHorizBottom: '┻',
    joinerVertRight: '┫',
    joinerVertLeft: '┣',
    tl: '┏',
    tr: '┓',
    bl: '┗',
    br: '┛',
};
const BORDER_PREV = {
    ...BORDER,
    top: '━',
    left: '┃',
    joinerHorizTop: '┱',
    joinerHorizBottom: '┹',
    joinerVertRight: '┩',
    joinerVertLeft: '┡',
};
const BORDER_CURR = {
    ...BORDER_BOTH,
    joinerHorizTop: '┲',
    joinerHorizBottom: '┺',
    joinerVertRight: '┪',
    joinerVertLeft: '┢',
};
//# sourceMappingURL=ToggleGroup.js.map