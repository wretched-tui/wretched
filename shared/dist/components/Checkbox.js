"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Radio = exports.Checkbox = void 0;
const sys_1 = require("../sys");
const Container_1 = require("../Container");
const Text_1 = require("./Text");
const geometry_1 = require("../geometry");
const events_1 = require("../events");
const UI_1 = require("../UI");
class Checkbox extends Container_1.Container {
    #value = false;
    #hotKey;
    #onChange;
    #textView;
    #contentView;
    constructor(props) {
        super(props);
        this.#textView = new Text_1.Text({ alignment: 'center' });
        this.add(this.#textView);
        this.#update(props);
    }
    get value() {
        return this.#value;
    }
    set value(value) {
        if (value === this.#value) {
            return;
        }
        this.#value = value;
        this.invalidateRender();
    }
    childTheme(view) {
        return (0, UI_1.childTheme)(super.childTheme(view), this.isPressed, this.isHover);
    }
    update(props) {
        this.#update(props);
        super.update(props);
    }
    #update({ text, hotKey, value, onChange }) {
        const styledText = hotKey ? (0, events_1.styleTextForHotKey)(text ?? '', hotKey) : text;
        this.#textView.text = styledText ?? '';
        this.#value = value;
        this.#hotKey = hotKey;
        this.#onChange = onChange;
    }
    get text() {
        return this.#textView?.text;
    }
    set text(value) {
        const styledText = this.#hotKey
            ? (0, events_1.styleTextForHotKey)(value ?? '', this.#hotKey)
            : value;
        this.#textView.text = styledText ?? '';
        this.invalidateSize();
    }
    naturalSize(available) {
        return super.naturalSize(available).grow(BOX_WIDTH, 0);
    }
    receiveMouse(event, system) {
        super.receiveMouse(event, system);
        if ((0, events_1.isMouseClicked)(event)) {
            this.#value = !this.#value;
            this.#onChange?.(this.#value);
        }
    }
    render(viewport) {
        if (viewport.isEmpty) {
            return super.render(viewport);
        }
        viewport.registerMouse(['mouse.button.left', 'mouse.move']);
        const uiStyle = this.theme.ui({
            isPressed: this.isPressed,
            isHover: this.isHover,
        });
        viewport.paint(uiStyle);
        const boxWidth = BOX_WIDTH;
        const naturalSize = super.naturalSize(viewport.contentSize.shrink(boxWidth, 0));
        const offset = new geometry_1.Point(boxWidth, Math.round((viewport.contentSize.height - naturalSize.height) / 2));
        const box = this.boxChars()[this.#value ? 'checked' : 'unchecked'];
        viewport.write(box, geometry_1.Point.zero, uiStyle);
        viewport.clipped(new geometry_1.Rect(offset, naturalSize), uiStyle, inside => {
            super.render(inside);
        });
    }
    boxChars() {
        return BOX.checkbox;
    }
}
exports.Checkbox = Checkbox;
class Radio extends Checkbox {
    boxChars() {
        return BOX.radio;
    }
}
exports.Radio = Radio;
const BOX = {
    checkbox: {
        unchecked: '☐ ',
        checked: '☑ ',
    },
    radio: {
        unchecked: '◯ ',
        checked: '⦿ ',
    },
};
const BOX_WIDTH = sys_1.unicode.lineWidth(BOX.checkbox.unchecked);
//# sourceMappingURL=Checkbox.js.map