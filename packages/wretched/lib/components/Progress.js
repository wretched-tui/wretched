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
var _Progress_instances, _Progress_direction, _Progress_range, _Progress_value, _Progress_showPercent, _Progress_update, _Progress_renderHorizontal, _Progress_renderVertical;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = void 0;
var View_1 = require("../View");
var geometry_1 = require("../geometry");
var Style_1 = require("../Style");
var Progress = /** @class */ (function (_super) {
    __extends(Progress, _super);
    function Progress(props) {
        var _this = _super.call(this, props) || this;
        _Progress_instances.add(_this);
        _Progress_direction.set(_this, 'horizontal');
        _Progress_range.set(_this, [0, 100]);
        _Progress_value.set(_this, 0);
        _Progress_showPercent.set(_this, false);
        __classPrivateFieldGet(_this, _Progress_instances, "m", _Progress_update).call(_this, props);
        return _this;
    }
    Progress.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Progress_instances, "m", _Progress_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Object.defineProperty(Progress.prototype, "value", {
        get: function () {
            return __classPrivateFieldGet(this, _Progress_value, "f");
        },
        set: function (value) {
            __classPrivateFieldSet(this, _Progress_value, value, "f");
            if (value !== __classPrivateFieldGet(this, _Progress_value, "f")) {
                __classPrivateFieldSet(this, _Progress_value, value, "f");
                this.invalidateRender();
            }
        },
        enumerable: false,
        configurable: true
    });
    Progress.prototype.naturalSize = function (available) {
        return new geometry_1.Size(available.width, 1);
    };
    Progress.prototype.render = function (viewport) {
        if (viewport.isEmpty) {
            return;
        }
        var pt = geometry_1.Point.zero.mutableCopy();
        var percent = '';
        if (__classPrivateFieldGet(this, _Progress_showPercent, "f")) {
            var percentNum = (0, geometry_1.interpolate)(__classPrivateFieldGet(this, _Progress_value, "f"), __classPrivateFieldGet(this, _Progress_range, "f"), [0, 100], true);
            percent = "".concat(Math.round(percentNum), "%");
        }
        var percentStartPoint = new geometry_1.Point(~~((viewport.contentSize.width - percent.length) / 2), viewport.contentSize.height <= 1 ? 0 : 1);
        var textStyle = this.theme.text();
        var controlStyle = this.theme.ui({ isHover: true }).invert().merge({
            background: textStyle.background,
        });
        var altTextStyle = new Style_1.Style({
            foreground: textStyle.foreground,
            background: controlStyle.foreground,
        });
        if (__classPrivateFieldGet(this, _Progress_direction, "f") === 'horizontal') {
            __classPrivateFieldGet(this, _Progress_instances, "m", _Progress_renderHorizontal).call(this, viewport, percent, percentStartPoint, textStyle, controlStyle, altTextStyle);
        }
        else {
            __classPrivateFieldGet(this, _Progress_instances, "m", _Progress_renderVertical).call(this, viewport, percent, percentStartPoint, textStyle, controlStyle, altTextStyle);
        }
    };
    return Progress;
}(View_1.View));
exports.Progress = Progress;
_Progress_direction = new WeakMap(), _Progress_range = new WeakMap(), _Progress_value = new WeakMap(), _Progress_showPercent = new WeakMap(), _Progress_instances = new WeakSet(), _Progress_update = function _Progress_update(_a) {
    var direction = _a.direction, min = _a.min, max = _a.max, value = _a.value, showPercent = _a.showPercent;
    __classPrivateFieldSet(this, _Progress_direction, direction !== null && direction !== void 0 ? direction : 'horizontal', "f");
    __classPrivateFieldSet(this, _Progress_range, [min !== null && min !== void 0 ? min : 0, max !== null && max !== void 0 ? max : 100], "f");
    __classPrivateFieldSet(this, _Progress_showPercent, showPercent !== null && showPercent !== void 0 ? showPercent : false, "f");
    __classPrivateFieldSet(this, _Progress_value, value !== null && value !== void 0 ? value : __classPrivateFieldGet(this, _Progress_range, "f")[0], "f");
}, _Progress_renderHorizontal = function _Progress_renderHorizontal(viewport, percent, percentStartPoint, textStyle, controlStyle, altTextStyle) {
    var _this = this;
    var progressX = Math.round((0, geometry_1.interpolate)(__classPrivateFieldGet(this, _Progress_value, "f"), __classPrivateFieldGet(this, _Progress_range, "f"), [0, viewport.contentSize.width - 1], true));
    viewport.visibleRect.forEachPoint(function (pt) {
        var char, style = textStyle;
        if (__classPrivateFieldGet(_this, _Progress_showPercent, "f") &&
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
            var min = Math.min.apply(Math, __classPrivateFieldGet(_this, _Progress_range, "f"));
            if (pt.x <= progressX && __classPrivateFieldGet(_this, _Progress_value, "f") > min) {
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
}, _Progress_renderVertical = function _Progress_renderVertical(viewport, _percent, _percentStartPoint, textStyle, controlStyle, _altTextStyle) {
    var progressY = Math.round((0, geometry_1.interpolate)(__classPrivateFieldGet(this, _Progress_value, "f"), __classPrivateFieldGet(this, _Progress_range, "f"), [viewport.contentSize.height - 1, 0], true));
    viewport.visibleRect.forEachPoint(function (pt) {
        var char, style = textStyle;
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
};
