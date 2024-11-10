"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
exports.H1 = H1;
exports.H2 = H2;
exports.H3 = H3;
exports.H4 = H4;
exports.H5 = H5;
exports.H6 = H6;
const Container_1 = require("../Container");
const geometry_1 = require("../geometry");
const Style_1 = require("../Style");
const Text_1 = require("./Text");
class Header extends Container_1.Container {
    #text;
    #style;
    #border = 'single';
    constructor({ bold, dim, text, font, ...props }) {
        super(props);
        this.#border = props.border;
        this.#style = new Style_1.Style({
            bold: bold,
            dim: dim,
        });
        this.#text = new Text_1.Text({
            text: text,
            font: font,
            style: this.#style,
            wrap: true,
        });
        this.add(this.#text);
    }
    naturalSize(available) {
        return this.#text.naturalSize(available).grow(2, 1);
    }
    render(viewport) {
        const inside = viewport.contentRect.inset({ left: 1, right: 1, bottom: 1 });
        const textSize = this.#text.naturalSize(inside.size);
        viewport.clipped(inside, inside => {
            this.#text.render(inside);
        });
        const maxWidth = textSize.width + 2;
        let border;
        switch (this.#border) {
            case 'single':
                border = '─';
                break;
            case 'bold':
                border = '━';
                break;
            case 'double':
                border = '═';
                break;
        }
        viewport.write(border.repeat(maxWidth), new geometry_1.Point(0, textSize.height), this.#style);
    }
}
exports.Header = Header;
function H1(text = '') {
    return new Header({
        text,
        border: 'double',
        font: 'script',
        bold: true,
    });
}
function H2(text = '') {
    return new Header({
        text,
        border: 'bold',
        font: 'script',
    });
}
function H3(text = '') {
    return new Header({
        text,
        border: 'single',
        font: 'sans-bold',
        bold: true,
    });
}
function H4(text = '') {
    return new Header({
        text,
        border: 'single',
        font: 'sans',
    });
}
function H5(text = '') {
    return new Header({
        text,
        border: 'single',
        font: 'serif-bold',
        bold: true,
        dim: true,
    });
}
function H6(text = '') {
    return new Header({
        text,
        font: 'serif-italic',
        border: 'single',
        dim: true,
    });
}
//# sourceMappingURL=Header.js.map