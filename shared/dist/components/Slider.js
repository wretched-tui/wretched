"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slider = void 0;
const View_1 = require("../View");
const geometry_1 = require("../geometry");
const events_1 = require("../events");
const MIN = 5;
class Slider extends View_1.View {
    // styles
    #direction = 'horizontal';
    #border = false;
    #buttons = false;
    // position of slider
    #range = [0, 0];
    #value = 0;
    #step = 1;
    // mouse information
    #contentSize = geometry_1.Size.zero;
    #isPressingDecrease = false;
    #isPressingIncrease = false;
    #buttonTracking = 'off';
    #isHoverSlider = false;
    #isHoverDecrease = false;
    #isHoverIncrease = false;
    #onChange;
    constructor(props) {
        super(props);
        this.#update(props);
    }
    update(props) {
        this.#update(props);
        super.update(props);
    }
    #update({ direction, border, buttons, range, value, step, onChange }) {
        this.#direction = direction ?? 'horizontal';
        this.#border = border ?? false;
        this.#buttons = buttons ?? false;
        this.#range = range ?? [0, 1];
        this.#step = step ? Math.max(step, 1) : 1;
        this.#onChange = onChange;
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
    naturalSize() {
        // try to have enough room for every value
        const min = Math.max(MIN, Math.ceil((this.#range[1] - this.#range[0]) / this.#step));
        if (this.#direction === 'horizontal') {
            const minWidth = min + 2 * (this.#buttons ? 3 : this.#border ? 1 : 0);
            if (this.#border) {
                //╭─┬──
                //│◃│█╶
                //╰─┴──
                // ╭──
                // │█╶
                // ╰──
                return new geometry_1.Size(minWidth, 3);
            }
            else {
                // [◃]
                // █╶─
                return new geometry_1.Size(minWidth, 1);
            }
        }
        else {
            const minHeight = min +
                2 *
                    (this.#buttons && this.#border
                        ? 3
                        : this.#buttons || this.#border
                            ? 1
                            : 0);
            if (this.#border) {
                // ╭─╮
                // │▵│
                // ├─┤ ╭─╮
                // │█│ │█│
                // │╷│ │╷│
                return new geometry_1.Size(3, minHeight);
            }
            else {
                // ▵
                // █   █
                // ╷   ╷
                return new geometry_1.Size(1, minHeight);
            }
        }
    }
    receiveMouse(event) {
        if (this.#contentSize === undefined) {
            return;
        }
        const prev = this.#value;
        let pos, 
        // the beginning of the slider area
        minSlider = 0, 
        // the smaller dimension, ie the height of the horizontal slider
        // the bigger dimension, ie the width of the horizontal slider
        bigSize, 
        // the end of the slider area
        maxSlider;
        if (this.#direction === 'horizontal') {
            pos = event.position.x;
            bigSize = this.#contentSize.width;
        }
        else {
            pos = event.position.y;
            bigSize = this.#contentSize.height;
        }
        maxSlider = bigSize - 1;
        if (this.#buttons) {
            if (this.#direction === 'horizontal') {
                //╭─┬
                //│◃│ or [◃]
                //╰─┴
                minSlider += 3;
                maxSlider -= 3;
            }
            else if (this.#border) {
                // ╭─╮
                // │▵│
                // ├─┤
                minSlider += 3;
                maxSlider -= 3;
            }
            else {
                // ▵
                minSlider += 1;
                maxSlider -= 1;
            }
        }
        else if (this.#border) {
            //╭
            //│ or ╭─╮
            //╰
            minSlider += 1;
            maxSlider -= 1;
        }
        const isHoverDecrease = pos >= 0 && pos < minSlider;
        const isHoverIncrease = pos > maxSlider && pos < bigSize;
        const isMouseDown = event.name === 'mouse.button.down' || this.#buttonTracking === 'pressing';
        const isDragging = (!isMouseDown && (0, events_1.isMouseDragging)(event)) ||
            this.#buttonTracking === 'dragging';
        let shouldUpdate = false;
        if (isDragging) {
            this.#isHoverSlider = true;
            this.#isHoverDecrease = false;
            this.#isHoverIncrease = false;
        }
        else if ((0, events_1.isMouseExit)(event)) {
            this.#isHoverSlider = false;
            this.#isHoverDecrease = false;
            this.#isHoverIncrease = false;
        }
        else {
            this.#isHoverSlider = pos >= minSlider && pos <= maxSlider;
            this.#isHoverDecrease = isHoverDecrease;
            this.#isHoverIncrease = isHoverIncrease;
        }
        if (isMouseDown && pos < minSlider) {
            if ((0, events_1.isMousePressStart)(event)) {
                this.#isPressingDecrease = true;
                this.#buttonTracking = 'pressing';
            }
            else if ((0, events_1.isMousePressExit)(event)) {
                this.#isPressingDecrease = false;
            }
            if ((0, events_1.isMouseClicked)(event) && pos < minSlider) {
                this.#value = prev > this.#range[1] ? this.#range[1] : prev - this.#step;
                this.#buttonTracking = 'off';
                shouldUpdate = true;
            }
        }
        else if (isMouseDown && pos > maxSlider) {
            if ((0, events_1.isMousePressStart)(event)) {
                this.#isPressingIncrease = true;
                this.#buttonTracking = 'pressing';
            }
            else if ((0, events_1.isMousePressExit)(event)) {
                this.#isPressingIncrease = false;
            }
            if ((0, events_1.isMouseClicked)(event) && pos > maxSlider) {
                this.#value = prev > this.#range[1] ? this.#range[1] : prev + this.#step;
                this.#buttonTracking = 'off';
                shouldUpdate = true;
            }
        }
        else if ((0, events_1.isMousePressEnd)(event)) {
            this.#buttonTracking = 'off';
        }
        else if (isMouseDown || isDragging) {
            this.#buttonTracking = 'dragging';
            this.#value = (0, geometry_1.interpolate)(pos, [minSlider, maxSlider], this.#range, true);
            shouldUpdate = true;
            // if step is an even number, value should be an even number
            // this should be a _setting_ not automatic like this
            if (~~this.#step === this.#step) {
                this.#value =
                    Math.round((this.#value - this.#range[0]) / this.#step) * this.#step;
            }
        }
        if (shouldUpdate) {
            this.#value = Math.min(this.#range[1], Math.max(this.#range[0], this.#value));
            if (this.#value !== prev) {
                this.#onChange?.(this.#value);
            }
        }
    }
    #renderHorizontal(viewport, sliderStyle, decreaseButtonStyle, increaseButtonStyle) {
        const hasBorder = this.#border && viewport.contentSize.height >= 3;
        const height = hasBorder ? 3 : 1;
        const marginX = this.#buttons ? 3 : hasBorder ? 1 : 0;
        const outerRect = new geometry_1.Rect([0, 0], [viewport.visibleRect.size.width, height]);
        const innerRect = new geometry_1.Rect([marginX, 0], [viewport.visibleRect.size.width - 2 * marginX, height]);
        viewport.registerMouse(['mouse.move', 'mouse.button.left'], outerRect);
        if (this.#buttons) {
            const left = this.#isHoverDecrease ? '◂' : '◃';
            const right = this.#isHoverIncrease ? '▸' : '▹';
            (hasBorder ? ['╭─┬', `│${left}│`, '╰─┴'] : [`[${left}]`]).forEach((line, offsetY) => {
                viewport.write(line, geometry_1.Point.zero.offset(0, offsetY), decreaseButtonStyle);
            });
            (hasBorder ? ['┬─╮', `│${right}│`, '┴─╯'] : [`[${right}]`]).forEach((line, offsetY) => {
                viewport.write(line, geometry_1.Point.zero.offset(viewport.contentSize.width - line.length, offsetY), increaseButtonStyle);
            });
        }
        else if (hasBorder) {
            ;
            ['╭', '│', '╰'].forEach((char, offsetY) => {
                viewport.write(char, geometry_1.Point.zero.offset(0, offsetY), sliderStyle);
            });
            ['╮', '│', '╯'].forEach((char, offsetY) => {
                viewport.write(char, geometry_1.Point.zero.offset(viewport.contentSize.width - 1, offsetY), sliderStyle);
            });
        }
        const min = innerRect.minX(), max = innerRect.maxX();
        const position = Math.round((0, geometry_1.interpolate)(this.#value, this.#range, [min, max - 1], true));
        innerRect.forEachPoint(pt => {
            let char;
            if (height === 1 || pt.y === 1) {
                if (pt.x === position) {
                    char = '█';
                }
                else if (pt.x === position + 1) {
                    char = '╶';
                }
                else if (pt.x === position - 1) {
                    char = '╴';
                }
                else {
                    char = '─';
                }
            }
            else {
                char = '─';
            }
            viewport.write(char, pt, sliderStyle);
        });
    }
    #renderVertical(viewport, sliderStyle, decreaseButtonStyle, increaseButtonStyle) {
        const hasBorder = this.#border && viewport.contentSize.width >= 3;
        const width = hasBorder ? 3 : 1;
        const marginY = this.#buttons && hasBorder ? 3 : this.#buttons || hasBorder ? 1 : 0;
        const outerRect = new geometry_1.Rect([0, 0], [width, viewport.visibleRect.size.height]);
        const innerRect = new geometry_1.Rect([0, marginY], [width, viewport.visibleRect.size.height - 2 * marginY]);
        viewport.registerMouse(['mouse.move', 'mouse.button.left'], outerRect);
        if (this.#buttons) {
            const up = this.#isHoverDecrease ? '▴' : '▵';
            const down = this.#isHoverIncrease ? '▾' : '▿';
            (hasBorder ? ['╭─╮', `│${up}│`, '├─┤'] : [up]).forEach((line, offsetY) => {
                viewport.write(line, geometry_1.Point.zero.offset(0, offsetY), decreaseButtonStyle);
            });
            (hasBorder ? ['╰─╯', `│${down}│`, '├─┤'] : [down]).forEach((line, offsetY) => {
                viewport.write(line, geometry_1.Point.zero.offset(0, viewport.contentSize.height - offsetY - 1), increaseButtonStyle);
            });
        }
        else if (hasBorder) {
            viewport.write('╭─╮', geometry_1.Point.zero.offset(0, 0), sliderStyle);
            viewport.write('╰─╯', geometry_1.Point.zero.offset(0, viewport.contentSize.height - 1), sliderStyle);
        }
        const min = innerRect.minY(), max = innerRect.maxY();
        const position = Math.round((0, geometry_1.interpolate)(this.#value, this.#range, [min, max - 1], true));
        innerRect.forEachPoint(pt => {
            let char;
            if (width === 1 || pt.x === 1) {
                if (pt.y === position) {
                    char = '█';
                    // } else if (
                    //   (pt.y === min && position === min + 1) ||
                    //   (pt.y === max && position === max - 1)
                    // ) {
                    //   char = '∙'
                }
                else if (pt.y === position + 1) {
                    char = '╷';
                }
                else if (pt.y === position - 1) {
                    char = '╵';
                }
                else {
                    char = '│';
                }
            }
            else {
                char = '│';
            }
            viewport.write(char, pt, sliderStyle);
        });
    }
    render(viewport) {
        if (viewport.isEmpty) {
            return;
        }
        this.#contentSize = viewport.contentSize;
        const pt = geometry_1.Point.zero.mutableCopy();
        const sliderStyle = this.theme.ui({ isHover: this.#isHoverSlider });
        const decreaseButtonStyle = this.theme.ui({
            isPressed: this.#isPressingDecrease,
            isHover: this.#isHoverDecrease,
        });
        const increaseButtonStyle = this.theme.ui({
            isPressed: this.#isPressingIncrease,
            isHover: this.#isHoverIncrease,
        });
        if (this.#direction === 'horizontal') {
            this.#renderHorizontal(viewport, sliderStyle, decreaseButtonStyle, increaseButtonStyle);
        }
        else {
            this.#renderVertical(viewport, sliderStyle, decreaseButtonStyle, increaseButtonStyle);
        }
    }
}
exports.Slider = Slider;
//# sourceMappingURL=Slider.js.map