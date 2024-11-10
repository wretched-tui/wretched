"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Slider_instances, _Slider_direction, _Slider_border, _Slider_buttons, _Slider_range, _Slider_value, _Slider_step, _Slider_contentSize, _Slider_isPressingDecrease, _Slider_isPressingIncrease, _Slider_buttonTracking, _Slider_isHoverSlider, _Slider_isHoverDecrease, _Slider_isHoverIncrease, _Slider_onChange, _Slider_update, _Slider_renderHorizontal, _Slider_renderVertical;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slider = void 0;
var View_1 = require("../View");
var geometry_1 = require("../geometry");
var events_1 = require("../events");
var MIN = 5;
var Slider = /** @class */ (function (_super) {
    __extends(Slider, _super);
    function Slider(props) {
        var _this = _super.call(this, props) || this;
        _Slider_instances.add(_this);
        // styles
        _Slider_direction.set(_this, 'horizontal');
        _Slider_border.set(_this, false);
        _Slider_buttons.set(_this, false
        // position of slider
        );
        // position of slider
        _Slider_range.set(_this, [0, 0]);
        _Slider_value.set(_this, 0);
        _Slider_step.set(_this, 1
        // mouse information
        );
        // mouse information
        _Slider_contentSize.set(_this, geometry_1.Size.zero);
        _Slider_isPressingDecrease.set(_this, false);
        _Slider_isPressingIncrease.set(_this, false);
        _Slider_buttonTracking.set(_this, 'off');
        _Slider_isHoverSlider.set(_this, false);
        _Slider_isHoverDecrease.set(_this, false);
        _Slider_isHoverIncrease.set(_this, false);
        _Slider_onChange.set(_this, void 0);
        __classPrivateFieldGet(_this, _Slider_instances, "m", _Slider_update).call(_this, props);
        return _this;
    }
    Slider.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Slider_instances, "m", _Slider_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Object.defineProperty(Slider.prototype, "value", {
        get: function () {
            return __classPrivateFieldGet(this, _Slider_value, "f");
        },
        set: function (value) {
            __classPrivateFieldSet(this, _Slider_value, value, "f");
            if (value !== __classPrivateFieldGet(this, _Slider_value, "f")) {
                __classPrivateFieldSet(this, _Slider_value, value, "f");
                this.invalidateRender();
            }
        },
        enumerable: false,
        configurable: true
    });
    Slider.prototype.naturalSize = function () {
        // try to have enough room for every value
        var min = Math.max(MIN, Math.ceil((__classPrivateFieldGet(this, _Slider_range, "f")[1] - __classPrivateFieldGet(this, _Slider_range, "f")[0]) / __classPrivateFieldGet(this, _Slider_step, "f")));
        if (__classPrivateFieldGet(this, _Slider_direction, "f") === 'horizontal') {
            var minWidth = min + 2 * (__classPrivateFieldGet(this, _Slider_buttons, "f") ? 3 : __classPrivateFieldGet(this, _Slider_border, "f") ? 1 : 0);
            if (__classPrivateFieldGet(this, _Slider_border, "f")) {
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
            var minHeight = min +
                2 *
                    (__classPrivateFieldGet(this, _Slider_buttons, "f") && __classPrivateFieldGet(this, _Slider_border, "f")
                        ? 3
                        : __classPrivateFieldGet(this, _Slider_buttons, "f") || __classPrivateFieldGet(this, _Slider_border, "f")
                            ? 1
                            : 0);
            if (__classPrivateFieldGet(this, _Slider_border, "f")) {
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
    };
    Slider.prototype.receiveMouse = function (event) {
        var _a;
        if (__classPrivateFieldGet(this, _Slider_contentSize, "f") === undefined) {
            return;
        }
        var prev = __classPrivateFieldGet(this, _Slider_value, "f");
        var pos, 
        // the beginning of the slider area
        minSlider = 0, 
        // the smaller dimension, ie the height of the horizontal slider
        // the bigger dimension, ie the width of the horizontal slider
        bigSize, 
        // the end of the slider area
        maxSlider;
        if (__classPrivateFieldGet(this, _Slider_direction, "f") === 'horizontal') {
            pos = event.position.x;
            bigSize = __classPrivateFieldGet(this, _Slider_contentSize, "f").width;
        }
        else {
            pos = event.position.y;
            bigSize = __classPrivateFieldGet(this, _Slider_contentSize, "f").height;
        }
        maxSlider = bigSize - 1;
        if (__classPrivateFieldGet(this, _Slider_buttons, "f")) {
            if (__classPrivateFieldGet(this, _Slider_direction, "f") === 'horizontal') {
                //╭─┬
                //│◃│ or [◃]
                //╰─┴
                minSlider += 3;
                maxSlider -= 3;
            }
            else if (__classPrivateFieldGet(this, _Slider_border, "f")) {
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
        else if (__classPrivateFieldGet(this, _Slider_border, "f")) {
            //╭
            //│ or ╭─╮
            //╰
            minSlider += 1;
            maxSlider -= 1;
        }
        var isHoverDecrease = pos >= 0 && pos < minSlider;
        var isHoverIncrease = pos > maxSlider && pos < bigSize;
        var isMouseDown = event.name === 'mouse.button.down' || __classPrivateFieldGet(this, _Slider_buttonTracking, "f") === 'pressing';
        var isDragging = (!isMouseDown && (0, events_1.isMouseDragging)(event)) ||
            __classPrivateFieldGet(this, _Slider_buttonTracking, "f") === 'dragging';
        var shouldUpdate = false;
        if (isDragging) {
            __classPrivateFieldSet(this, _Slider_isHoverSlider, true, "f");
            __classPrivateFieldSet(this, _Slider_isHoverDecrease, false, "f");
            __classPrivateFieldSet(this, _Slider_isHoverIncrease, false, "f");
        }
        else if ((0, events_1.isMouseExit)(event)) {
            __classPrivateFieldSet(this, _Slider_isHoverSlider, false, "f");
            __classPrivateFieldSet(this, _Slider_isHoverDecrease, false, "f");
            __classPrivateFieldSet(this, _Slider_isHoverIncrease, false, "f");
        }
        else {
            __classPrivateFieldSet(this, _Slider_isHoverSlider, pos >= minSlider && pos <= maxSlider, "f");
            __classPrivateFieldSet(this, _Slider_isHoverDecrease, isHoverDecrease, "f");
            __classPrivateFieldSet(this, _Slider_isHoverIncrease, isHoverIncrease, "f");
        }
        if (isMouseDown && pos < minSlider) {
            if ((0, events_1.isMousePressStart)(event)) {
                __classPrivateFieldSet(this, _Slider_isPressingDecrease, true, "f");
                __classPrivateFieldSet(this, _Slider_buttonTracking, 'pressing', "f");
            }
            else if ((0, events_1.isMousePressExit)(event)) {
                __classPrivateFieldSet(this, _Slider_isPressingDecrease, false, "f");
            }
            if ((0, events_1.isMouseClicked)(event) && pos < minSlider) {
                __classPrivateFieldSet(this, _Slider_value, prev > __classPrivateFieldGet(this, _Slider_range, "f")[1] ? __classPrivateFieldGet(this, _Slider_range, "f")[1] : prev - __classPrivateFieldGet(this, _Slider_step, "f"), "f");
                __classPrivateFieldSet(this, _Slider_buttonTracking, 'off', "f");
                shouldUpdate = true;
            }
        }
        else if (isMouseDown && pos > maxSlider) {
            if ((0, events_1.isMousePressStart)(event)) {
                __classPrivateFieldSet(this, _Slider_isPressingIncrease, true, "f");
                __classPrivateFieldSet(this, _Slider_buttonTracking, 'pressing', "f");
            }
            else if ((0, events_1.isMousePressExit)(event)) {
                __classPrivateFieldSet(this, _Slider_isPressingIncrease, false, "f");
            }
            if ((0, events_1.isMouseClicked)(event) && pos > maxSlider) {
                __classPrivateFieldSet(this, _Slider_value, prev > __classPrivateFieldGet(this, _Slider_range, "f")[1] ? __classPrivateFieldGet(this, _Slider_range, "f")[1] : prev + __classPrivateFieldGet(this, _Slider_step, "f"), "f");
                __classPrivateFieldSet(this, _Slider_buttonTracking, 'off', "f");
                shouldUpdate = true;
            }
        }
        else if ((0, events_1.isMousePressEnd)(event)) {
            __classPrivateFieldSet(this, _Slider_buttonTracking, 'off', "f");
        }
        else if (isMouseDown || isDragging) {
            __classPrivateFieldSet(this, _Slider_buttonTracking, 'dragging', "f");
            __classPrivateFieldSet(this, _Slider_value, (0, geometry_1.interpolate)(pos, [minSlider, maxSlider], __classPrivateFieldGet(this, _Slider_range, "f"), true), "f");
            shouldUpdate = true;
            // if step is an even number, value should be an even number
            // this should be a _setting_ not automatic like this
            if (~~__classPrivateFieldGet(this, _Slider_step, "f") === __classPrivateFieldGet(this, _Slider_step, "f")) {
                __classPrivateFieldSet(this, _Slider_value, Math.round((__classPrivateFieldGet(this, _Slider_value, "f") - __classPrivateFieldGet(this, _Slider_range, "f")[0]) / __classPrivateFieldGet(this, _Slider_step, "f")) * __classPrivateFieldGet(this, _Slider_step, "f"), "f");
            }
        }
        if (shouldUpdate) {
            __classPrivateFieldSet(this, _Slider_value, Math.min(__classPrivateFieldGet(this, _Slider_range, "f")[1], Math.max(__classPrivateFieldGet(this, _Slider_range, "f")[0], __classPrivateFieldGet(this, _Slider_value, "f"))), "f");
            if (__classPrivateFieldGet(this, _Slider_value, "f") !== prev) {
                (_a = __classPrivateFieldGet(this, _Slider_onChange, "f")) === null || _a === void 0 ? void 0 : _a.call(this, __classPrivateFieldGet(this, _Slider_value, "f"));
            }
        }
    };
    Slider.prototype.render = function (viewport) {
        if (viewport.isEmpty) {
            return;
        }
        __classPrivateFieldSet(this, _Slider_contentSize, viewport.contentSize, "f");
        var pt = geometry_1.Point.zero.mutableCopy();
        var sliderStyle = this.theme.ui({ isHover: __classPrivateFieldGet(this, _Slider_isHoverSlider, "f") });
        var decreaseButtonStyle = this.theme.ui({
            isPressed: __classPrivateFieldGet(this, _Slider_isPressingDecrease, "f"),
            isHover: __classPrivateFieldGet(this, _Slider_isHoverDecrease, "f"),
        });
        var increaseButtonStyle = this.theme.ui({
            isPressed: __classPrivateFieldGet(this, _Slider_isPressingIncrease, "f"),
            isHover: __classPrivateFieldGet(this, _Slider_isHoverIncrease, "f"),
        });
        if (__classPrivateFieldGet(this, _Slider_direction, "f") === 'horizontal') {
            __classPrivateFieldGet(this, _Slider_instances, "m", _Slider_renderHorizontal).call(this, viewport, sliderStyle, decreaseButtonStyle, increaseButtonStyle);
        }
        else {
            __classPrivateFieldGet(this, _Slider_instances, "m", _Slider_renderVertical).call(this, viewport, sliderStyle, decreaseButtonStyle, increaseButtonStyle);
        }
    };
    return Slider;
}(View_1.View));
exports.Slider = Slider;
_Slider_direction = new WeakMap(), _Slider_border = new WeakMap(), _Slider_buttons = new WeakMap(), _Slider_range = new WeakMap(), _Slider_value = new WeakMap(), _Slider_step = new WeakMap(), _Slider_contentSize = new WeakMap(), _Slider_isPressingDecrease = new WeakMap(), _Slider_isPressingIncrease = new WeakMap(), _Slider_buttonTracking = new WeakMap(), _Slider_isHoverSlider = new WeakMap(), _Slider_isHoverDecrease = new WeakMap(), _Slider_isHoverIncrease = new WeakMap(), _Slider_onChange = new WeakMap(), _Slider_instances = new WeakSet(), _Slider_update = function _Slider_update(_a) {
    var direction = _a.direction, border = _a.border, buttons = _a.buttons, range = _a.range, value = _a.value, step = _a.step, onChange = _a.onChange;
    __classPrivateFieldSet(this, _Slider_direction, direction !== null && direction !== void 0 ? direction : 'horizontal', "f");
    __classPrivateFieldSet(this, _Slider_border, border !== null && border !== void 0 ? border : false, "f");
    __classPrivateFieldSet(this, _Slider_buttons, buttons !== null && buttons !== void 0 ? buttons : false, "f");
    __classPrivateFieldSet(this, _Slider_range, range !== null && range !== void 0 ? range : [0, 1], "f");
    __classPrivateFieldSet(this, _Slider_step, step ? Math.max(step, 1) : 1, "f");
    __classPrivateFieldSet(this, _Slider_onChange, onChange, "f");
    __classPrivateFieldSet(this, _Slider_value, value !== null && value !== void 0 ? value : __classPrivateFieldGet(this, _Slider_range, "f")[0], "f");
}, _Slider_renderHorizontal = function _Slider_renderHorizontal(viewport, sliderStyle, decreaseButtonStyle, increaseButtonStyle) {
    var hasBorder = __classPrivateFieldGet(this, _Slider_border, "f") && viewport.contentSize.height >= 3;
    var height = hasBorder ? 3 : 1;
    var marginX = __classPrivateFieldGet(this, _Slider_buttons, "f") ? 3 : hasBorder ? 1 : 0;
    var outerRect = new geometry_1.Rect([0, 0], [viewport.visibleRect.size.width, height]);
    var innerRect = new geometry_1.Rect([marginX, 0], [viewport.visibleRect.size.width - 2 * marginX, height]);
    viewport.registerMouse(['mouse.move', 'mouse.button.left'], outerRect);
    if (__classPrivateFieldGet(this, _Slider_buttons, "f")) {
        var left = __classPrivateFieldGet(this, _Slider_isHoverDecrease, "f") ? '◂' : '◃';
        var right = __classPrivateFieldGet(this, _Slider_isHoverIncrease, "f") ? '▸' : '▹';
        (hasBorder ? ['╭─┬', "\u2502".concat(left, "\u2502"), '╰─┴'] : ["[".concat(left, "]")]).forEach(function (line, offsetY) {
            viewport.write(line, geometry_1.Point.zero.offset(0, offsetY), decreaseButtonStyle);
        });
        (hasBorder ? ['┬─╮', "\u2502".concat(right, "\u2502"), '┴─╯'] : ["[".concat(right, "]")]).forEach(function (line, offsetY) {
            viewport.write(line, geometry_1.Point.zero.offset(viewport.contentSize.width - line.length, offsetY), increaseButtonStyle);
        });
    }
    else if (hasBorder) {
        ;
        ['╭', '│', '╰'].forEach(function (char, offsetY) {
            viewport.write(char, geometry_1.Point.zero.offset(0, offsetY), sliderStyle);
        });
        ['╮', '│', '╯'].forEach(function (char, offsetY) {
            viewport.write(char, geometry_1.Point.zero.offset(viewport.contentSize.width - 1, offsetY), sliderStyle);
        });
    }
    var min = innerRect.minX(), max = innerRect.maxX();
    var position = Math.round((0, geometry_1.interpolate)(__classPrivateFieldGet(this, _Slider_value, "f"), __classPrivateFieldGet(this, _Slider_range, "f"), [min, max - 1], true));
    innerRect.forEachPoint(function (pt) {
        var char;
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
}, _Slider_renderVertical = function _Slider_renderVertical(viewport, sliderStyle, decreaseButtonStyle, increaseButtonStyle) {
    var hasBorder = __classPrivateFieldGet(this, _Slider_border, "f") && viewport.contentSize.width >= 3;
    var width = hasBorder ? 3 : 1;
    var marginY = __classPrivateFieldGet(this, _Slider_buttons, "f") && hasBorder ? 3 : __classPrivateFieldGet(this, _Slider_buttons, "f") || hasBorder ? 1 : 0;
    var outerRect = new geometry_1.Rect([0, 0], [width, viewport.visibleRect.size.height]);
    var innerRect = new geometry_1.Rect([0, marginY], [width, viewport.visibleRect.size.height - 2 * marginY]);
    viewport.registerMouse(['mouse.move', 'mouse.button.left'], outerRect);
    if (__classPrivateFieldGet(this, _Slider_buttons, "f")) {
        var up = __classPrivateFieldGet(this, _Slider_isHoverDecrease, "f") ? '▴' : '▵';
        var down = __classPrivateFieldGet(this, _Slider_isHoverIncrease, "f") ? '▾' : '▿';
        (hasBorder ? ['╭─╮', "\u2502".concat(up, "\u2502"), '├─┤'] : [up]).forEach(function (line, offsetY) {
            viewport.write(line, geometry_1.Point.zero.offset(0, offsetY), decreaseButtonStyle);
        });
        (hasBorder ? ['╰─╯', "\u2502".concat(down, "\u2502"), '├─┤'] : [down]).forEach(function (line, offsetY) {
            viewport.write(line, geometry_1.Point.zero.offset(0, viewport.contentSize.height - offsetY - 1), increaseButtonStyle);
        });
    }
    else if (hasBorder) {
        viewport.write('╭─╮', geometry_1.Point.zero.offset(0, 0), sliderStyle);
        viewport.write('╰─╯', geometry_1.Point.zero.offset(0, viewport.contentSize.height - 1), sliderStyle);
    }
    var min = innerRect.minY(), max = innerRect.maxY();
    var position = Math.round((0, geometry_1.interpolate)(__classPrivateFieldGet(this, _Slider_value, "f"), __classPrivateFieldGet(this, _Slider_range, "f"), [min, max - 1], true));
    innerRect.forEachPoint(function (pt) {
        var char;
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
};
