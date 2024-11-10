"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.styleTextForHotKey = exports.match = void 0;
exports.toHotKeyDef = toHotKeyDef;
exports.isKeyPrintable = isKeyPrintable;
var ansi_1 = require("../ansi");
function toHotKeyDef(hotKey) {
    if (typeof hotKey !== 'string') {
        return hotKey;
    }
    // hotkey string supports:
    // C- control
    // M- meta
    // S- shift
    var ctrl = hotKey.includes('C-');
    var meta = hotKey.includes('M-');
    var shift = hotKey.includes('S-');
    var char = hotKey.replace(/^([CMS]-)*/, '').toLowerCase();
    return { char: char, ctrl: ctrl, meta: meta, shift: shift };
}
function isKeyPrintable(event) {
    var _a;
    switch (event.name) {
        case 'up':
        case 'down':
        case 'left':
        case 'right':
        case 'pageup':
        case 'pagedown':
        case 'home':
        case 'end':
        case 'insert':
        case 'clear':
        case 'enter':
        case 'return':
        case 'escape':
        case 'tab':
        case 'delete':
        case 'backspace':
        case 'f1':
        case 'f2':
        case 'f3':
        case 'f4':
        case 'f1':
        case 'f2':
        case 'f3':
        case 'f4':
        case 'f1':
        case 'f2':
        case 'f3':
        case 'f4':
        case 'f5':
        case 'f5':
        case 'f6':
        case 'f7':
        case 'f8':
        case 'f9':
        case 'f10':
        case 'f11':
        case 'f12':
            return false;
    }
    if (((_a = event.char.codePointAt(0)) !== null && _a !== void 0 ? _a : 0) < 32) {
        return false;
    }
    return true;
}
var match = function (key, event) {
    var _a, _b, _c;
    if (((_a = key.ctrl) !== null && _a !== void 0 ? _a : false) !== event.ctrl) {
        return false;
    }
    if (((_b = key.meta) !== null && _b !== void 0 ? _b : false) !== event.meta) {
        return false;
    }
    if (((_c = key.shift) !== null && _c !== void 0 ? _c : false) !== event.shift) {
        return false;
    }
    return key.char === event.name;
};
exports.match = match;
var styleTextForHotKey = function (text, key_) {
    var key = toHotKeyDef(key_);
    var alt = '⌥';
    var shift = '⇧';
    var ctrl = '⌃';
    var mod = '';
    if (key.ctrl) {
        mod += ctrl;
    }
    if (key.meta) {
        mod += alt;
    }
    if (key.shift) {
        mod += shift;
    }
    if (!mod) {
        return text;
    }
    mod = (0, ansi_1.underline)(mod + key.char);
    if (!text) {
        return mod;
    }
    return "".concat(text, " ").concat(mod);
};
exports.styleTextForHotKey = styleTextForHotKey;
