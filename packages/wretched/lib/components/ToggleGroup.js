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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var _ToggleGroup_instances, _ToggleGroup_multiple, _ToggleGroup_padding, _ToggleGroup_offAxisPadding, _ToggleGroup_direction, _ToggleGroup_titles, _ToggleGroup_titlesCache, _ToggleGroup_sizeCache, _ToggleGroup_selected, _ToggleGroup_hover, _ToggleGroup_update, _ToggleGroup_updateTitles, _ToggleGroup_renderGroupHorizontal;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleGroup = void 0;
var sys_1 = require("../sys");
var Container_1 = require("../Container");
var geometry_1 = require("../geometry");
var events_1 = require("../events");
var ToggleGroup = /** @class */ (function (_super) {
    __extends(ToggleGroup, _super);
    function ToggleGroup(props) {
        var _this = _super.call(this, props) || this;
        _ToggleGroup_instances.add(_this);
        _ToggleGroup_multiple.set(_this, false);
        _ToggleGroup_padding.set(_this, 1);
        _ToggleGroup_offAxisPadding.set(_this, 0);
        _ToggleGroup_direction.set(_this, 'horizontal');
        _ToggleGroup_titles.set(_this, []);
        _ToggleGroup_titlesCache.set(_this, []);
        _ToggleGroup_sizeCache.set(_this, geometry_1.Size.zero);
        _ToggleGroup_selected.set(_this, new Set());
        _ToggleGroup_hover.set(_this, void 0);
        __classPrivateFieldGet(_this, _ToggleGroup_instances, "m", _ToggleGroup_update).call(_this, props);
        return _this;
    }
    ToggleGroup.prototype.update = function (props) {
        _super.prototype.update.call(this, props);
        __classPrivateFieldGet(this, _ToggleGroup_instances, "m", _ToggleGroup_update).call(this, props);
    };
    Object.defineProperty(ToggleGroup.prototype, "titles", {
        get: function () {
            return __classPrivateFieldGet(this, _ToggleGroup_titles, "f");
        },
        set: function (value) {
            __classPrivateFieldSet(this, _ToggleGroup_titles, value, "f");
            __classPrivateFieldGet(this, _ToggleGroup_instances, "m", _ToggleGroup_updateTitles).call(this, value);
            this.invalidateSize();
        },
        enumerable: false,
        configurable: true
    });
    ToggleGroup.prototype.naturalSize = function () {
        return __classPrivateFieldGet(this, _ToggleGroup_sizeCache, "f");
    };
    ToggleGroup.prototype.receiveMouse = function (event, system) {
        var x = 0;
        if (__classPrivateFieldGet(this, _ToggleGroup_direction, "f") === 'horizontal') {
            if (event.position.y >= __classPrivateFieldGet(this, _ToggleGroup_sizeCache, "f").height) {
                __classPrivateFieldSet(this, _ToggleGroup_hover, undefined, "f");
                return;
            }
            var hoverIndex = undefined;
            for (var _i = 0, _a = __classPrivateFieldGet(this, _ToggleGroup_titlesCache, "f").entries(); _i < _a.length; _i++) {
                var _b = _a[_i], index = _b[0], _c = _b[1], _ = _c[0], size = _c[1];
                var textWidth = size.width + 2 * __classPrivateFieldGet(this, _ToggleGroup_padding, "f");
                x += 2 * BORDER.size + textWidth;
                if (event.position.x < x) {
                    hoverIndex = index;
                    break;
                }
                x -= BORDER.size;
            }
            if ((0, events_1.isMouseExit)(event)) {
                __classPrivateFieldSet(this, _ToggleGroup_hover, undefined, "f");
            }
            else if ((0, events_1.isMouseEnter)(event) || (0, events_1.isMouseMove)(event)) {
                __classPrivateFieldSet(this, _ToggleGroup_hover, hoverIndex, "f");
            }
            else if ((0, events_1.isMouseClicked)(event) && hoverIndex !== undefined) {
                if (__classPrivateFieldGet(this, _ToggleGroup_selected, "f").has(hoverIndex)) {
                    __classPrivateFieldGet(this, _ToggleGroup_selected, "f").delete(hoverIndex);
                }
                else if (__classPrivateFieldGet(this, _ToggleGroup_multiple, "f")) {
                    __classPrivateFieldGet(this, _ToggleGroup_selected, "f").add(hoverIndex);
                }
                else {
                    __classPrivateFieldSet(this, _ToggleGroup_selected, new Set([hoverIndex]), "f");
                }
            }
        }
    };
    ToggleGroup.prototype.render = function (viewport) {
        var _this = this;
        if (viewport.isEmpty) {
            return;
        }
        viewport.registerMouse(['mouse.button.left', 'mouse.move']);
        if (__classPrivateFieldGet(this, _ToggleGroup_direction, "f") === 'horizontal') {
            var x = 0;
            var _loop_1 = function (index, text, size) {
                var rect = new geometry_1.Rect([x, 0], [size.width + 2 + 2 * __classPrivateFieldGet(this_1, _ToggleGroup_padding, "f"), __classPrivateFieldGet(this_1, _ToggleGroup_sizeCache, "f").height]);
                viewport.clipped(rect, function (inner) {
                    __classPrivateFieldGet(_this, _ToggleGroup_instances, "m", _ToggleGroup_renderGroupHorizontal).call(_this, inner, text, size, index);
                });
                x += rect.size.width - 1;
            };
            var this_1 = this;
            for (var _i = 0, _a = __classPrivateFieldGet(this, _ToggleGroup_titlesCache, "f").entries(); _i < _a.length; _i++) {
                var _b = _a[_i], index = _b[0], _c = _b[1], text = _c[0], size = _c[1];
                _loop_1(index, text, size);
            }
        }
        else {
            var y = 0;
            for (var _d = 0, _e = __classPrivateFieldGet(this, _ToggleGroup_titlesCache, "f").entries(); _d < _e.length; _d++) {
                var _f = _e[_d], index = _f[0], _g = _f[1], text = _g[0], size = _g[1];
                var rect = new geometry_1.Rect([0, y], [__classPrivateFieldGet(this, _ToggleGroup_sizeCache, "f").width, size.height + 2 + 2 * __classPrivateFieldGet(this, _ToggleGroup_padding, "f")]).offset(BORDER.size, 0);
                viewport.clipped(rect, function (inner) {
                    // this.#renderGroupVertical(
                    //   inner,
                    //   text,
                    //   size,
                    //   index,
                    // )
                });
            }
        }
    };
    return ToggleGroup;
}(Container_1.Container));
exports.ToggleGroup = ToggleGroup;
_ToggleGroup_multiple = new WeakMap(), _ToggleGroup_padding = new WeakMap(), _ToggleGroup_offAxisPadding = new WeakMap(), _ToggleGroup_direction = new WeakMap(), _ToggleGroup_titles = new WeakMap(), _ToggleGroup_titlesCache = new WeakMap(), _ToggleGroup_sizeCache = new WeakMap(), _ToggleGroup_selected = new WeakMap(), _ToggleGroup_hover = new WeakMap(), _ToggleGroup_instances = new WeakSet(), _ToggleGroup_update = function _ToggleGroup_update(_a) {
    var multiple = _a.multiple, padding = _a.padding, direction = _a.direction, titles = _a.titles, selected = _a.selected;
    __classPrivateFieldSet(this, _ToggleGroup_multiple, multiple !== null && multiple !== void 0 ? multiple : false, "f");
    __classPrivateFieldSet(this, _ToggleGroup_padding, Math.max(0, padding !== null && padding !== void 0 ? padding : 1), "f");
    __classPrivateFieldSet(this, _ToggleGroup_offAxisPadding, Math.max(0, __classPrivateFieldGet(this, _ToggleGroup_padding, "f") - 1), "f");
    __classPrivateFieldSet(this, _ToggleGroup_direction, direction !== null && direction !== void 0 ? direction : 'horizontal', "f");
    __classPrivateFieldSet(this, _ToggleGroup_selected, new Set(selected), "f");
    __classPrivateFieldGet(this, _ToggleGroup_instances, "m", _ToggleGroup_updateTitles).call(this, titles);
}, _ToggleGroup_updateTitles = function _ToggleGroup_updateTitles(titles) {
    var _this = this;
    if (titles.length == 0) {
        __classPrivateFieldSet(this, _ToggleGroup_titlesCache, [], "f");
        return;
    }
    var sizeCache = geometry_1.Size.zero.mutableCopy();
    __classPrivateFieldSet(this, _ToggleGroup_titlesCache, titles.map(function (title) {
        var size = sys_1.unicode.stringSize(title);
        if (__classPrivateFieldGet(_this, _ToggleGroup_direction, "f") === 'horizontal') {
            var textWidth = size.width + 2 * __classPrivateFieldGet(_this, _ToggleGroup_padding, "f");
            sizeCache.width += BORDER.size + textWidth;
            sizeCache.height = Math.max(sizeCache.height, size.height);
        }
        else {
            var textHeight = size.height + 2 * __classPrivateFieldGet(_this, _ToggleGroup_padding, "f");
            sizeCache.width = Math.max(sizeCache.width, size.width);
            sizeCache.height += BORDER.size + textHeight;
        }
        return [title, size];
    }), "f");
    if (__classPrivateFieldGet(this, _ToggleGroup_direction, "f") === 'horizontal') {
        sizeCache.width += BORDER.size;
        sizeCache.height += BORDER.size * 2 + 2 * __classPrivateFieldGet(this, _ToggleGroup_offAxisPadding, "f");
    }
    else {
        sizeCache.width += BORDER.size * 2 + 2 * __classPrivateFieldGet(this, _ToggleGroup_offAxisPadding, "f");
        sizeCache.height += BORDER.size;
    }
    __classPrivateFieldSet(this, _ToggleGroup_sizeCache, sizeCache, "f");
}, _ToggleGroup_renderGroupHorizontal = function _ToggleGroup_renderGroupHorizontal(viewport, text, size, index) {
    var maxIndex = __classPrivateFieldGet(this, _ToggleGroup_titlesCache, "f").length - 1;
    var isFirst = index === 0;
    var isLast = index === maxIndex;
    var textWidth = size.width + 2 * __classPrivateFieldGet(this, _ToggleGroup_padding, "f");
    var bottomPoint = geometry_1.Point.zero.offset(0, __classPrivateFieldGet(this, _ToggleGroup_sizeCache, "f").height - 1);
    var border;
    if (__classPrivateFieldGet(this, _ToggleGroup_selected, "f").has(index - 1) && __classPrivateFieldGet(this, _ToggleGroup_selected, "f").has(index)) {
        border = BORDER_BOTH;
    }
    else if (__classPrivateFieldGet(this, _ToggleGroup_selected, "f").has(index - 1)) {
        border = BORDER_PREV;
    }
    else if (__classPrivateFieldGet(this, _ToggleGroup_selected, "f").has(index)) {
        border = BORDER_CURR;
    }
    else {
        border = BORDER;
    }
    if (__classPrivateFieldGet(this, _ToggleGroup_hover, "f") === index && __classPrivateFieldGet(this, _ToggleGroup_selected, "f").has(index)) {
        border = __assign(__assign({}, border), { top: '━', bottom: '━', left: '┃', right: '┃', joinerHorizTop: '┏', joinerHorizBottom: '┗' });
    }
    else if (__classPrivateFieldGet(this, _ToggleGroup_hover, "f") === index) {
        border = __assign(__assign({}, border), { top: '─', bottom: '─', left: '│', right: '│', joinerHorizTop: '┌', joinerHorizBottom: '└' });
    }
    else if (__classPrivateFieldGet(this, _ToggleGroup_hover, "f") === index - 1 && __classPrivateFieldGet(this, _ToggleGroup_selected, "f").has(index - 1)) {
        border = __assign(__assign({}, border), { joinerHorizTop: '┓', joinerHorizBottom: '┛' });
    }
    else if (__classPrivateFieldGet(this, _ToggleGroup_hover, "f") === index - 1) {
        border = __assign(__assign({}, border), { left: '│', joinerHorizTop: '┐', joinerHorizBottom: '┘' });
    }
    if (isFirst && isLast) {
        var top_1 = border.tl + border.bottom.repeat(textWidth) + border.tr;
        var bottom = border.bl + border.bottom.repeat(textWidth) + border.br;
        viewport.write(top_1, geometry_1.Point.zero);
        viewport.write(bottom, bottomPoint);
    }
    else if (isFirst) {
        var top_2 = border.tl + border.bottom.repeat(textWidth);
        var bottom = border.bl + border.bottom.repeat(textWidth);
        viewport.write(top_2, geometry_1.Point.zero);
        viewport.write(bottom, bottomPoint);
    }
    else if (isLast) {
        var top_3 = border.joinerHorizTop + border.bottom.repeat(textWidth) + border.tr;
        var bottom = border.joinerHorizBottom + border.bottom.repeat(textWidth) + border.br;
        viewport.write(top_3, geometry_1.Point.zero);
        viewport.write(bottom, bottomPoint);
    }
    else {
        var top_4 = border.joinerHorizTop + border.bottom.repeat(textWidth);
        var bottom = border.joinerHorizBottom + border.bottom.repeat(textWidth);
        viewport.write(top_4, geometry_1.Point.zero);
        viewport.write(bottom, bottomPoint);
    }
    var offsetY = 1;
    var line = border.left + ' '.repeat(textWidth) + border.right;
    for (var i = __classPrivateFieldGet(this, _ToggleGroup_sizeCache, "f").height - 2 * BORDER.size; i-- > 0;) {
        viewport.write(line, geometry_1.Point.zero.offset(0, offsetY));
        offsetY += 1;
    }
    viewport.clipped(viewport.contentRect.offset(BORDER.size + __classPrivateFieldGet(this, _ToggleGroup_padding, "f"), BORDER.size + __classPrivateFieldGet(this, _ToggleGroup_offAxisPadding, "f")), function (inner) {
        inner.write(text, geometry_1.Point.zero);
    });
};
var BORDER = {
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
var BORDER_BOTH = __assign(__assign({}, BORDER), { top: '━', bottom: '━', left: '┃', right: '┃', joinerHorizTop: '┳', joinerHorizBottom: '┻', joinerVertRight: '┫', joinerVertLeft: '┣', tl: '┏', tr: '┓', bl: '┗', br: '┛' });
var BORDER_PREV = __assign(__assign({}, BORDER), { top: '━', left: '┃', joinerHorizTop: '┱', joinerHorizBottom: '┹', joinerVertRight: '┩', joinerVertLeft: '┡' });
var BORDER_CURR = __assign(__assign({}, BORDER_BOTH), { joinerHorizTop: '┲', joinerHorizBottom: '┺', joinerVertRight: '┪', joinerVertLeft: '┢' });
