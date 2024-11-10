"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = void 0;
const View_1 = require("../View");
const geometry_1 = require("../geometry");
const Style_1 = require("../Style");
class Progress extends View_1.View {
    #direction = 'horizontal';
    #range = [0, 100];
    #value = 0;
    #showPercent = false;
    constructor(props) {
        super(props);
        this.#update(props);
    }
    update(props) {
        this.#update(props);
        super.update(props);
    }
    #update({ direction, min, max, value, showPercent }) {
        this.#direction = direction ?? 'horizontal';
        this.#range = [min ?? 0, max ?? 100];
        this.#showPercent = showPercent ?? false;
        this.#value = value ?? this.#range[0];
    }
    get value() {
        return this.#value;
    }
    set value(value) {
        this.#value = value;
        if (value !== this.#value) {
            this.#value = value;
            this.invalidateRender();
        }
    }
    naturalSize(available) {
        return new geometry_1.Size(available.width, 1);
    }
    render(viewport) {
        if (viewport.isEmpty) {
            return;
        }
        const pt = geometry_1.Point.zero.mutableCopy();
        let percent = '';
        if (this.#showPercent) {
            const percentNum = (0, geometry_1.interpolate)(this.#value, this.#range, [0, 100], true);
            percent = `${Math.round(percentNum)}%`;
        }
        const percentStartPoint = new geometry_1.Point(~~((viewport.contentSize.width - percent.length) / 2), viewport.contentSize.height <= 1 ? 0 : 1);
        const textStyle = this.theme.text();
        const controlStyle = this.theme.ui({ isHover: true }).invert().merge({
            background: textStyle.background,
        });
        const altTextStyle = new Style_1.Style({
            foreground: textStyle.foreground,
            background: controlStyle.foreground,
        });
        if (this.#direction === 'horizontal') {
            this.#renderHorizontal(viewport, percent, percentStartPoint, textStyle, controlStyle, altTextStyle);
        }
        else {
            this.#renderVertical(viewport, percent, percentStartPoint, textStyle, controlStyle, altTextStyle);
        }
    }
    #renderHorizontal(viewport, percent, percentStartPoint, textStyle, controlStyle, altTextStyle) {
        const progressX = Math.round((0, geometry_1.interpolate)(this.#value, this.#range, [0, viewport.contentSize.width - 1], true));
        viewport.visibleRect.forEachPoint(pt => {
            let char, style = textStyle;
            if (this.#showPercent &&
                pt.x >= percentStartPoint.x &&
                pt.x - percentStartPoint.x < percent.length &&
                pt.y === percentStartPoint.y) {
                char = percent[pt.x - percentStartPoint.x];
                if (pt.x <= progressX) {
                    style = altTextStyle;
                }
                else {
                    style = textStyle;
                }
            }
            else {
                const min = Math.min(...this.#range);
                if (pt.x <= progressX && this.#value > min) {
                    if (pt.y === 0 && viewport.contentSize.height > 1) {
                        char = '▄';
                    }
                    else if (pt.y === viewport.contentSize.height - 1 &&
                        viewport.contentSize.height > 1) {
                        char = '▀';
                    }
                    else {
                        char = '█';
                    }
                    style = controlStyle;
                }
                else if (viewport.contentSize.height === 1) {
                    if (pt.x === 0) {
                        char = '╶';
                    }
                    else if (pt.x === viewport.contentSize.width - 1) {
                        char = '╴';
                    }
                    else {
                        char = '─';
                    }
                }
                else if (pt.y === 0) {
                    if (pt.x === 0) {
                        char = '╭';
                    }
                    else if (pt.x === viewport.contentSize.width - 1) {
                        char = '╮';
                    }
                    else {
                        char = '─';
                    }
                }
                else if (pt.y === viewport.contentSize.height - 1) {
                    if (pt.x === 0) {
                        char = '╰';
                    }
                    else if (pt.x === viewport.contentSize.width - 1) {
                        char = '╯';
                    }
                    else {
                        char = '─';
                    }
                }
                else if (pt.x === 0 || pt.x === viewport.contentSize.width - 1) {
                    char = '│';
                }
                else {
                    char = ' ';
                }
            }
            viewport.write(char, pt, style);
        });
    }
    #renderVertical(viewport, _percent, _percentStartPoint, textStyle, controlStyle, _altTextStyle) {
        const progressY = Math.round((0, geometry_1.interpolate)(this.#value, this.#range, [viewport.contentSize.height - 1, 0], true));
        viewport.visibleRect.forEachPoint(pt => {
            let char, style = textStyle;
            if (pt.y >= progressY) {
                if (pt.x === 0 && viewport.contentSize.width > 1) {
                    char = '▐';
                }
                else if (pt.x === viewport.contentSize.width - 1 &&
                    viewport.contentSize.width > 1) {
                    char = '▌';
                }
                else {
                    char = '█';
                }
                style = controlStyle;
            }
            else if (viewport.contentSize.width === 1) {
                if (pt.y === 0) {
                    char = '╷';
                }
                else if (pt.y === viewport.contentSize.height - 1) {
                    char = '╵';
                }
                else {
                    char = '│';
                }
            }
            else if (pt.x === 0) {
                if (pt.y === 0) {
                    char = '╭';
                }
                else if (pt.y === viewport.contentSize.height - 1) {
                    char = '╰';
                }
                else {
                    char = '│';
                }
            }
            else if (pt.x === viewport.contentSize.width - 1) {
                if (pt.y === 0) {
                    char = '╮';
                }
                else if (pt.y === viewport.contentSize.height - 1) {
                    char = '╯';
                }
                else {
                    char = '│';
                }
            }
            else if (pt.y === 0 || pt.y === viewport.contentSize.height - 1) {
                char = '─';
            }
            else {
                char = ' ';
            }
            viewport.write(char, pt, style);
        });
    }
}
exports.Progress = Progress;
//# sourceMappingURL=Progress.js.map