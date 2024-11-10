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
var _Space_instances, _Space_update, _Space_prev;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Space = void 0;
var Style_1 = require("../Style");
var View_1 = require("../View");
var geometry_1 = require("../geometry");
var Space = /** @class */ (function (_super) {
    __extends(Space, _super);
    function Space(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _Space_instances.add(_this);
        _Space_prev.set(_this, _this.background);
        __classPrivateFieldGet(_this, _Space_instances, "m", _Space_update).call(_this, props);
        return _this;
    }
    Space.horizontal = function (value, extraProps) {
        if (extraProps === void 0) { extraProps = {}; }
        return new Space(__assign({ width: value }, extraProps));
    };
    Space.vertical = function (value, extraProps) {
        if (extraProps === void 0) { extraProps = {}; }
        return new Space(__assign({ height: value }, extraProps));
    };
    Space.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Space_instances, "m", _Space_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Space.prototype.naturalSize = function () {
        return geometry_1.Size.zero;
    };
    Space.prototype.render = function (viewport) {
        if (viewport.isEmpty) {
            return;
        }
        if (!this.background) {
            return;
        }
        if (__classPrivateFieldGet(this, _Space_prev, "f") !== this.background) {
            __classPrivateFieldSet(this, _Space_prev, this.background, "f");
        }
        var style = new Style_1.Style({ background: this.background });
        viewport.paint(style);
    };
    return Space;
}(View_1.View));
exports.Space = Space;
_Space_prev = new WeakMap(), _Space_instances = new WeakSet(), _Space_update = function _Space_update(_a) {
    var background = _a.background;
    this.background = background;
};
