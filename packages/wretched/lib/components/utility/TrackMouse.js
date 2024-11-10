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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _TrackMouse_position;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackMouse = void 0;
var Style_1 = require("../../Style");
var Container_1 = require("../../Container");
var geometry_1 = require("../../geometry");
var TrackMouse = /** @class */ (function (_super) {
    __extends(TrackMouse, _super);
    function TrackMouse(_a) {
        var _this = this;
        var content = _a.content, viewProps = __rest(_a, ["content"]);
        _this = _super.call(this, viewProps) || this;
        _TrackMouse_position.set(_this, void 0);
        __classPrivateFieldSet(_this, _TrackMouse_position, geometry_1.Point.zero, "f");
        _this.add(content);
        return _this;
    }
    TrackMouse.prototype.naturalSize = function (available) {
        return _super.prototype.naturalSize.call(this, available.shrink(1, 1)).grow(1, 1);
    };
    TrackMouse.prototype.receiveMouse = function (event) {
        __classPrivateFieldSet(this, _TrackMouse_position, event.position, "f");
    };
    TrackMouse.prototype.render = function (viewport) {
        var _this = this;
        viewport.registerMouse('mouse.move');
        var maxX = viewport.contentSize.width;
        var maxY = viewport.contentSize.height;
        var borderStyle = new Style_1.Style({ foreground: 'white', background: 'default' });
        viewport.clipped(new geometry_1.Rect(new geometry_1.Point(1, 1), viewport.contentSize.shrink(1, 1)), function (inside) {
            _super.prototype.render.call(_this, inside);
        });
        var highlight = new Style_1.Style({ inverse: true });
        viewport.usingPen(borderStyle, function (pen) {
            var _a, _b;
            for (var x = 1; x < maxX; ++x) {
                var cx = x - 1;
                pen.replacePen(x === __classPrivateFieldGet(_this, _TrackMouse_position, "f").x ? highlight : Style_1.Style.NONE);
                var char = cx % 10 === 0
                    ? ((_a = ['0', '⠁', '⠉', '⠋', '⠛', '⠟', '⠿', '⡿', '⣿'][cx / 10]) !== null && _a !== void 0 ? _a : 'X')
                    : "".concat(cx % 10);
                viewport.write(char, new geometry_1.Point(x, 0));
            }
            for (var y = 1; y < maxY; ++y) {
                var cy = y - 1;
                pen.replacePen(y === __classPrivateFieldGet(_this, _TrackMouse_position, "f").y ? highlight : Style_1.Style.NONE);
                var char = cy % 10 === 0
                    ? ((_b = ['0', '⠁', '⠉', '⠋', '⠛', '⠟', '⠿', '⡿', '⣿'][cy / 10]) !== null && _b !== void 0 ? _b : 'X')
                    : "".concat(cy % 10);
                viewport.write(char, new geometry_1.Point(0, y));
            }
            pen.replacePen(Style_1.Style.NONE);
            var pos = "".concat(__classPrivateFieldGet(_this, _TrackMouse_position, "f").x, ", ").concat(__classPrivateFieldGet(_this, _TrackMouse_position, "f").y);
            viewport.write(pos, new geometry_1.Point(viewport.contentSize.width - pos.length, viewport.contentSize.height - 1));
        });
    };
    return TrackMouse;
}(Container_1.Container));
exports.TrackMouse = TrackMouse;
_TrackMouse_position = new WeakMap();
