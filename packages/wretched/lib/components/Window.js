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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Window = void 0;
var Container_1 = require("../Container");
var Window = /** @class */ (function (_super) {
    __extends(Window, _super);
    function Window(_a) {
        if (_a === void 0) { _a = {}; }
        var children = _a.children, viewProps = __rest(_a, ["children"]);
        return _super.call(this, viewProps) || this;
    }
    Window.prototype.naturalSize = function (available) {
        // even though we use the parent size no matter what, we do need to give child
        // views a chance to "resize" according to the available frame
        _super.prototype.naturalSize.call(this, available);
        return available;
    };
    return Window;
}(Container_1.Container));
exports.Window = Window;
