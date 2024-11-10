"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Separator = void 0;
const View_1 = require("../View");
const geometry_1 = require("../geometry");
class Separator extends View_1.View {
    #direction = 'vertical';
    #padding = 0;
    #border = 'single';
    static horizontal(props = {}) {
        return new Separator({ direction: 'horizontal', ...props });
    }
    static vertical(props = {}) {
        return new Separator({ direction: 'vertical', ...props });
    }
    constructor(props) {
        super(props);
        this.#update(props);
    }
    update(props) {
        this.#update(props);
        super.update(props);
    }
    #update({ direction, padding, border }) {
        this.#direction = direction;
        this.#padding = padding ?? 0;
        this.#border = border ?? 'single';
    }
    naturalSize(available) {
        if (this.#direction === 'vertical') {
            return new geometry_1.Size(1 + 2 * this.#padding, available.height);
        }
        else {
            return new geometry_1.Size(available.width, 1 + 2 * this.#padding);
        }
    }
    render(viewport) {
        if (viewport.isEmpty) {
            return;
        }
        const style = this.theme.text();
        if (this.#direction === 'vertical') {
            const [char] = BORDERS[this.#border], minY = viewport.visibleRect.minY(), maxY = viewport.visibleRect.maxY();
            for (let y = minY; y < maxY; ++y) {
                viewport.write(char, new geometry_1.Point(this.#padding, y), style);
            }
        }
        else {
            const [, char] = BORDERS[this.#border];
            const pt = viewport.visibleRect.origin.offset(0, this.#padding);
            viewport.write(char.repeat(viewport.visibleRect.size.width), pt, style);
        }
    }
}
exports.Separator = Separator;
const BORDERS = {
    single: ['│', '─'],
    leading: ['▏', '▔'],
    trailing: ['▕', '▁'],
    bold: ['┃', '━'],
    dash: ['╵', '╴'],
    dash2: ['╎', '╌'],
    dash3: ['┆', '┄'],
    dash4: ['┊', '┈'],
    double: ['║', '═'],
};
//# sourceMappingURL=Separator.js.map