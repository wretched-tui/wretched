"use strict";
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
var _Buffer_meta, _Buffer_canvas, _Buffer_prev;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buffer = void 0;
var sys_1 = require("./sys");
var ansi_1 = require("./ansi");
var Style_1 = require("./Style");
var geometry_1 = require("./geometry");
var Buffer = /** @class */ (function () {
    function Buffer() {
        this.size = geometry_1.Size.zero;
        _Buffer_meta.set(this, '');
        _Buffer_canvas.set(this, new Map());
        _Buffer_prev.set(this, new Map());
    }
    Buffer.prototype.setForeground = function (fg) { };
    Buffer.prototype.setBackground = function (bg) { };
    Buffer.prototype.resize = function (size) {
        if (size.width !== this.size.width || size.height !== this.size.height) {
            __classPrivateFieldSet(this, _Buffer_prev, new Map(), "f");
        }
        this.size = size;
    };
    /**
     * Writes the string at the cursor from left to write. Exits on newline (no default
     * wrapping behavior).
     */
    Buffer.prototype.writeChar = function (char, x, y, style) {
        x = ~~x;
        y = ~~y;
        if (char === '\n') {
            return;
        }
        var width = sys_1.unicode.charWidth(char);
        if (width === 0) {
            return;
        }
        if (x < 0 || x >= this.size.width || y < 0 || y >= this.size.height) {
            return;
        }
        var line = __classPrivateFieldGet(this, _Buffer_canvas, "f").get(y);
        if (line) {
            var prev = line.get(x);
            if ((prev === null || prev === void 0 ? void 0 : prev.char) === ansi_1.BG_DRAW) {
                var _a = prev.style, foreground = _a.foreground, background = _a.background;
                style = style.merge({ foreground: foreground, background: background });
            }
            var leftChar = line.get(x - 1);
            if (leftChar && leftChar.width === 2) {
                // hides a 2-width character that this character is overlapping
                line.set(x - 1, { char: ' ', width: 1, style: leftChar.style });
                // actually writes the character, and records the hidden character
                line.set(x, { char: char, width: width, style: style, hiding: leftChar });
                if (width === 2) {
                    line.delete(x + 1);
                }
                var hiding = leftChar.hiding;
                if (hiding) {
                    line.set(x - 2, hiding);
                }
            }
            else {
                // actually writes the character
                line.set(x, { char: char, width: width, style: style });
                if (width === 2) {
                    line.delete(x + 1);
                }
                var next = line.get(x + 1);
                if (next && next.hiding) {
                    // the next character can no longer be "hiding" the previous character (this
                    // character)
                    line.set(x + 1, __assign(__assign({}, next), { hiding: undefined }));
                }
            }
        }
        else {
            line = new Map([[x, { char: char, width: width, style: style }]]);
            __classPrivateFieldGet(this, _Buffer_canvas, "f").set(y, line);
        }
    };
    /**
     * For ANSI sequences that aren't related to any specific character.
     */
    Buffer.prototype.writeMeta = function (str) {
        __classPrivateFieldSet(this, _Buffer_meta, __classPrivateFieldGet(this, _Buffer_meta, "f") + str, "f");
    };
    Buffer.prototype.flush = function (terminal) {
        var _a, _b, _c;
        if (__classPrivateFieldGet(this, _Buffer_meta, "f")) {
            terminal.write(__classPrivateFieldGet(this, _Buffer_meta, "f"));
        }
        var prevStyle = Style_1.Style.NONE;
        for (var y = 0; y < this.size.height; y++) {
            var line = (_a = __classPrivateFieldGet(this, _Buffer_canvas, "f").get(y)) !== null && _a !== void 0 ? _a : new Map();
            var prevLine = (_b = __classPrivateFieldGet(this, _Buffer_prev, "f").get(y)) !== null && _b !== void 0 ? _b : new Map();
            __classPrivateFieldGet(this, _Buffer_prev, "f").set(y, prevLine);
            var didWrite = false;
            var dx = 1;
            for (var x = 0; x < this.size.width; x += dx) {
                var chrInfo = (_c = line.get(x)) !== null && _c !== void 0 ? _c : { char: ' ', style: Style_1.Style.NONE, width: 1 };
                var prevInfo = prevLine.get(x);
                dx = chrInfo.width;
                if (prevInfo && isCharEqual(chrInfo, prevInfo)) {
                    didWrite = false;
                    continue;
                }
                if (!didWrite) {
                    didWrite = true;
                    terminal.move(x, y);
                }
                var char = chrInfo.char, style = chrInfo.style;
                if (char === ansi_1.BG_DRAW) {
                    char = ' ';
                }
                if (!prevStyle.isEqual(style)) {
                    terminal.write(style.toSGR(prevStyle));
                    prevStyle = style;
                }
                terminal.write(char);
                prevLine.set(x, chrInfo);
                if (chrInfo.width === 2) {
                    prevLine.delete(x + 1);
                }
            }
        }
        if (prevStyle !== Style_1.Style.NONE) {
            terminal.write('\x1b[0m');
        }
        terminal.flush();
        __classPrivateFieldSet(this, _Buffer_canvas, new Map(), "f");
    };
    return Buffer;
}());
exports.Buffer = Buffer;
_Buffer_meta = new WeakMap(), _Buffer_canvas = new WeakMap(), _Buffer_prev = new WeakMap();
function isCharEqual(lhs, rhs) {
    return (lhs.char === rhs.char &&
        lhs.width === rhs.width &&
        lhs.style.isEqual(rhs.style));
}
