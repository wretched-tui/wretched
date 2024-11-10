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
var _HotKey_instances, _HotKey_hotKey, _HotKey_update;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotKey = void 0;
var Container_1 = require("../Container");
var geometry_1 = require("../geometry");
var events_1 = require("../events");
var HotKey = /** @class */ (function (_super) {
    __extends(HotKey, _super);
    function HotKey(props) {
        var _this = _super.call(this, props) || this;
        _HotKey_instances.add(_this);
        _HotKey_hotKey.set(_this, { char: '' });
        __classPrivateFieldGet(_this, _HotKey_instances, "m", _HotKey_update).call(_this, props);
        return _this;
    }
    HotKey.prototype.update = function (props) {
        __classPrivateFieldGet(this, _HotKey_instances, "m", _HotKey_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    HotKey.prototype.naturalSize = function () {
        return geometry_1.Size.zero;
    };
    HotKey.prototype.render = function (viewport) {
        if (viewport.isEmpty) {
            return _super.prototype.render.call(this, viewport);
        }
        viewport.registerHotKey((0, events_1.toHotKeyDef)(__classPrivateFieldGet(this, _HotKey_hotKey, "f")));
    };
    return HotKey;
}(Container_1.Container));
exports.HotKey = HotKey;
_HotKey_hotKey = new WeakMap(), _HotKey_instances = new WeakSet(), _HotKey_update = function _HotKey_update(_a) {
    var hotKey = _a.hotKey;
    __classPrivateFieldSet(this, _HotKey_hotKey, hotKey, "f");
};
