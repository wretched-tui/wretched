"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.styleTextForHotKey = exports.match = void 0;
exports.toHotKeyDef = toHotKeyDef;
exports.isKeyPrintable = isKeyPrintable;
const ansi_1 = require("../ansi");
function toHotKeyDef(hotKey) {
    if (typeof hotKey !== 'string') {
        return hotKey;
    }
    // hotkey string supports:
    // C- control
    // M- meta
    // S- shift
    const ctrl = hotKey.includes('C-');
    const meta = hotKey.includes('M-');
    const shift = hotKey.includes('S-');
    const char = hotKey.replace(/^([CMS]-)*/, '').toLowerCase();
    return { char, ctrl, meta, shift };
}
function isKeyPrintable(event) {
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
    if ((event.char.codePointAt(0) ?? 0) < 32) {
        return false;
    }
    return true;
}
const match = (key, event) => {
    if ((key.ctrl ?? false) !== event.ctrl) {
        return false;
    }
    if ((key.meta ?? false) !== event.meta) {
        return false;
    }
    if ((key.shift ?? false) !== event.shift) {
        return false;
    }
    return key.char === event.name;
};
exports.match = match;
const styleTextForHotKey = (text, key_) => {
    const key = toHotKeyDef(key_);
    const alt = '⌥';
    const shift = '⇧';
    const ctrl = '⌃';
    let mod = '';
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
    return `${text} ${mod}`;
};
exports.styleTextForHotKey = styleTextForHotKey;
//# sourceMappingURL=key.js.map