"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollapsibleText = void 0;
const sys_1 = require("../sys");
const View_1 = require("../View");
const Style_1 = require("../Style");
const geometry_1 = require("../geometry");
const events_1 = require("../events");
class CollapsibleText extends View_1.View {
    #lines = [];
    #style;
    #isCollapsed = true;
    constructor(props) {
        super(props);
        this.#update(props);
    }
    update(props) {
        this.#update(props);
        super.update(props);
    }
    #update({ text, style }) {
        this.#style = style;
        this.#lines = text.split('\n');
    }
    get text() {
        return this.#lines.join('\n');
    }
    set text(value) {
        this.#lines = value.split('\n');
        this.invalidateSize();
    }
    naturalSize(available) {
        if (this.#lines.length === 0) {
            return geometry_1.Size.zero;
        }
        if (this.#lines.length === 1) {
            const { width: lineWidth, height: lineHeight } = sys_1.unicode.stringSize(this.#lines, available.width);
            if (lineWidth <= available.width && lineHeight === 1) {
                return new geometry_1.Size(lineWidth, 1);
            }
            if (this.#isCollapsed) {
                return new geometry_1.Size(lineWidth + 2, 1);
            }
            return new geometry_1.Size(lineWidth + 2, lineHeight);
        }
        if (this.#isCollapsed) {
            const lineWidth = sys_1.unicode.lineWidth(this.#lines[0]);
            return new geometry_1.Size(lineWidth + 2, 1);
        }
        return new geometry_1.Size(sys_1.unicode.stringSize(this.#lines, available.width)).grow(2, 0);
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
            return;
        }
        const lines = this.#lines;
        if (!lines.length) {
            return;
        }
        const startingStyle = Style_1.Style.NONE;
        viewport.usingPen(this.#style, pen => {
            const { width, height } = sys_1.unicode.stringSize(lines, viewport.contentSize.width);
            const point = new geometry_1.Point(0, 0).mutableCopy();
            let offsetX = 0;
            if (viewport.contentSize.width < width || height > 1) {
                viewport.registerMouse('mouse.button.left');
                viewport.write(this.#isCollapsed ? '► ' : '▼ ', geometry_1.Point.zero, this.theme.text({ isPressed: this.isPressed }));
                offsetX = 2;
            }
            point.x = offsetX;
            for (const line of this.#lines) {
                let didWrap = false;
                for (const char of sys_1.unicode.printableChars(line)) {
                    const width = sys_1.unicode.charWidth(char);
                    if (width === 0) {
                        pen.mergePen(Style_1.Style.fromSGR(char, startingStyle));
                        continue;
                    }
                    if (!this.#isCollapsed && point.x >= viewport.contentSize.width) {
                        didWrap = true;
                        point.x = offsetX;
                        point.y += 1;
                    }
                    // don't print preceding whitespace after line wrap
                    if (didWrap && char.match(/\s/)) {
                        continue;
                    }
                    didWrap = false;
                    if (point.x >= viewport.visibleRect.minX() &&
                        point.x + width - 1 < viewport.visibleRect.maxX() &&
                        point.y >= viewport.visibleRect.minY()) {
                        viewport.write(char, point);
                    }
                    point.x += width;
                }
                point.y += 1;
                if (point.y >= viewport.visibleRect.maxY()) {
                    break;
                }
                point.x = offsetX;
            }
        });
    }
}
exports.CollapsibleText = CollapsibleText;
//# sourceMappingURL=CollapsibleText.js.map