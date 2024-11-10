"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackMouse = void 0;
const Style_1 = require("../../Style");
const Container_1 = require("../../Container");
const geometry_1 = require("../../geometry");
class TrackMouse extends Container_1.Container {
    #position;
    constructor({ content, ...viewProps }) {
        super(viewProps);
        this.#position = geometry_1.Point.zero;
        this.add(content);
    }
    naturalSize(available) {
        return super.naturalSize(available.shrink(1, 1)).grow(1, 1);
    }
    receiveMouse(event) {
        this.#position = event.position;
    }
    render(viewport) {
        viewport.registerMouse('mouse.move');
        const maxX = viewport.contentSize.width;
        const maxY = viewport.contentSize.height;
        let borderStyle = new Style_1.Style({ foreground: 'white', background: 'default' });
        viewport.clipped(new geometry_1.Rect(new geometry_1.Point(1, 1), viewport.contentSize.shrink(1, 1)), inside => {
            super.render(inside);
        });
        const highlight = new Style_1.Style({ inverse: true });
        viewport.usingPen(borderStyle, pen => {
            for (let x = 1; x < maxX; ++x) {
                const cx = x - 1;
                pen.replacePen(x === this.#position.x ? highlight : Style_1.Style.NONE);
                const char = cx % 10 === 0
                    ? (['0', '⠁', '⠉', '⠋', '⠛', '⠟', '⠿', '⡿', '⣿'][cx / 10] ?? 'X')
                    : `${cx % 10}`;
                viewport.write(char, new geometry_1.Point(x, 0));
            }
            for (let y = 1; y < maxY; ++y) {
                const cy = y - 1;
                pen.replacePen(y === this.#position.y ? highlight : Style_1.Style.NONE);
                const char = cy % 10 === 0
                    ? (['0', '⠁', '⠉', '⠋', '⠛', '⠟', '⠿', '⡿', '⣿'][cy / 10] ?? 'X')
                    : `${cy % 10}`;
                viewport.write(char, new geometry_1.Point(0, y));
            }
            pen.replacePen(Style_1.Style.NONE);
            const pos = `${this.#position.x}, ${this.#position.y}`;
            viewport.write(pos, new geometry_1.Point(viewport.contentSize.width - pos.length, viewport.contentSize.height - 1));
        });
    }
}
exports.TrackMouse = TrackMouse;
//# sourceMappingURL=TrackMouse.js.map