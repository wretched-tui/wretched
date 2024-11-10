"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const sys_1 = require("../sys");
const Container_1 = require("../Container");
const Text_1 = require("./Text");
const geometry_1 = require("../geometry");
const events_1 = require("../events");
const UI_1 = require("../UI");
class Button extends Container_1.Container {
    #hotKey;
    #onClick;
    #textView;
    #border = 'default';
    #align = 'center';
    constructor(props) {
        super(props);
        this.#textView = new Text_1.Text({ alignment: 'center' });
        this.add(this.#textView);
        this.#update(props);
    }
    update(props) {
        this.#update(props);
        super.update(props);
    }
    childTheme(view) {
        return (0, UI_1.childTheme)(super.childTheme(view), this.isPressed, this.isHover);
    }
    #update({ text, border, align, hotKey, onClick }) {
        const styledText = hotKey ? (0, events_1.styleTextForHotKey)(text ?? '', hotKey) : text;
        this.#textView.text = styledText ?? '';
        this.#align = align ?? 'center';
        this.#border = border ?? 'default';
        this.#hotKey = hotKey;
        this.#onClick = onClick;
    }
    naturalSize(available) {
        const [left, right] = this.#borderSize();
        return super.naturalSize(available).grow(left + right, 0);
    }
    get text() {
        return this.#textView.text;
    }
    set text(value) {
        const styledText = this.#hotKey
            ? (0, events_1.styleTextForHotKey)(value ?? '', this.#hotKey)
            : (value ?? '');
        this.#textView.text = styledText;
        this.invalidateSize();
    }
    #borderSize() {
        const [left, right] = BORDERS[this.#border];
        return [sys_1.unicode.lineWidth(left), sys_1.unicode.lineWidth(right)];
    }
    receiveMouse(event, system) {
        super.receiveMouse(event, system);
        if ((0, events_1.isMouseClicked)(event)) {
            this.#onClick?.();
        }
    }
    receiveKey(_) {
        this.#onClick?.();
    }
    render(viewport) {
        if (viewport.isEmpty) {
            return super.render(viewport);
        }
        viewport.registerMouse(['mouse.button.left', 'mouse.move']);
        if (this.#hotKey) {
            viewport.registerHotKey((0, events_1.toHotKeyDef)(this.#hotKey));
        }
        const textStyle = this.theme.ui({
            isPressed: this.isPressed,
            isHover: this.isHover,
        });
        const topsStyle = this.theme.ui({
            isPressed: this.isPressed,
            isHover: this.isHover,
            isOrnament: true,
        });
        viewport.visibleRect.forEachPoint(pt => {
            if (pt.y === 0 && viewport.contentSize.height > 2) {
                viewport.write('▔', pt, topsStyle);
            }
            else if (pt.y === viewport.contentSize.height - 1 &&
                viewport.contentSize.height > 2) {
                viewport.write('▁', pt, topsStyle);
            }
            else {
                viewport.write(' ', pt, textStyle);
            }
        });
        const [leftWidth, rightWidth] = this.#borderSize();
        const naturalSize = super.naturalSize(viewport.contentSize.shrink(leftWidth + rightWidth, 0));
        const offsetLeft = this.#align === 'center'
            ? Math.round((viewport.contentSize.width - naturalSize.width) / 2)
            : this.#align === 'left'
                ? 1
                : viewport.contentSize.width - naturalSize.width - 1, offset = new geometry_1.Point(offsetLeft, Math.round((viewport.contentSize.height - naturalSize.height) / 2));
        const [left, right] = BORDERS[this.#border], leftX = offset.x - leftWidth, rightX = offset.x + naturalSize.width;
        for (let y = 0; y < naturalSize.height; y++) {
            viewport.write(left, new geometry_1.Point(leftX, offset.y + y), textStyle);
            viewport.write(right, new geometry_1.Point(rightX, offset.y + y), textStyle);
        }
        viewport.clipped(new geometry_1.Rect(offset, naturalSize), inside => {
            super.render(inside);
        });
    }
}
exports.Button = Button;
const BORDERS = {
    default: ['[ ', ' ]'],
    arrows: [' ', ' '],
    none: [' ', ' '],
};
// E0A0 
// E0B0 
//# sourceMappingURL=Button.js.map