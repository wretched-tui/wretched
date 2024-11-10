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
var _Spinner_instances, _Spinner_isAnimating, _Spinner_tick, _Spinner_frame, _Spinner_frameLen, _Spinner_update;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spinner = void 0;
var View_1 = require("../View");
var geometry_1 = require("../geometry");
var Spinner = /** @class */ (function (_super) {
    __extends(Spinner, _super);
    function Spinner(_a) {
        if (_a === void 0) { _a = {}; }
        var _this = this;
        var isAnimating = _a.isAnimating, props = __rest(_a, ["isAnimating"]);
        _this = _super.call(this, props) || this;
        _Spinner_instances.add(_this);
        _Spinner_isAnimating.set(_this, false);
        _Spinner_tick.set(_this, 0);
        _Spinner_frame.set(_this, 0);
        _Spinner_frameLen.set(_this, 1);
        __classPrivateFieldGet(_this, _Spinner_instances, "m", _Spinner_update).call(_this, { isAnimating: isAnimating });
        return _this;
    }
    Spinner.prototype.update = function (_a) {
        var isAnimating = _a.isAnimating, props = __rest(_a, ["isAnimating"]);
        _super.prototype.update.call(this, props);
        __classPrivateFieldGet(this, _Spinner_instances, "m", _Spinner_update).call(this, props);
    };
    Spinner.prototype.naturalSize = function () {
        return new geometry_1.Size(1, 1);
    };
    Spinner.prototype.receiveTick = function (dt) {
        __classPrivateFieldSet(this, _Spinner_tick, __classPrivateFieldGet(this, _Spinner_tick, "f") + dt, "f");
        if (__classPrivateFieldGet(this, _Spinner_tick, "f") > HZ) {
            __classPrivateFieldSet(this, _Spinner_tick, __classPrivateFieldGet(this, _Spinner_tick, "f") % HZ, "f");
            __classPrivateFieldSet(this, _Spinner_frame, (__classPrivateFieldGet(this, _Spinner_frame, "f") + 1) % __classPrivateFieldGet(this, _Spinner_frameLen, "f"), "f");
        }
        return true;
    };
    Spinner.prototype.render = function (viewport) {
        if (viewport.isEmpty) {
            return;
        }
        if (__classPrivateFieldGet(this, _Spinner_isAnimating, "f")) {
            viewport.registerTick();
        }
        var char = ONE[__classPrivateFieldGet(this, _Spinner_frame, "f")];
        viewport.write(char, geometry_1.Point.zero);
        __classPrivateFieldSet(this, _Spinner_frameLen, ONE.length, "f");
    };
    return Spinner;
}(View_1.View));
exports.Spinner = Spinner;
_Spinner_isAnimating = new WeakMap(), _Spinner_tick = new WeakMap(), _Spinner_frame = new WeakMap(), _Spinner_frameLen = new WeakMap(), _Spinner_instances = new WeakSet(), _Spinner_update = function _Spinner_update(_a) {
    var isAnimating = _a.isAnimating;
    __classPrivateFieldSet(this, _Spinner_isAnimating, isAnimating !== null && isAnimating !== void 0 ? isAnimating : true, "f");
};
var ONE = ['⣾', '⣷', '⣯', '⣟', '⡿', '⢿', '⣻', '⣽'];
var HZ = 1000 / 10;
