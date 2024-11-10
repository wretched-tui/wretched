"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorize = exports.BG_DRAW = exports.RESET = void 0;
exports.styled = styled;
exports.style = style;
exports.ansi = ansi;
exports.bold = bold;
exports.dim = dim;
exports.italic = italic;
exports.underline = underline;
exports.invert = invert;
exports.hide = hide;
exports.strikeout = strikeout;
exports.red = red;
exports.green = green;
exports.yellow = yellow;
exports.blue = blue;
exports.magenta = magenta;
exports.cyan = cyan;
exports.gray = gray;
var sys_1 = require("./sys");
exports.RESET = '\x1b[0m';
// unicode.charWidth considers this "drawable" (width: 1). Buffer translates it
// to a space when it flushes to a terminal. It's used by Viewport.paint to
// put foreground/background colors into a region – subsequent draws that do
// _not_ specify foreground/background (value: undefined) will "inherit" this
// "paint" color.
exports.BG_DRAW = '\x14';
function styled(input, attr) {
    var _a, _b;
    return (_b = (_a = sys_1.program.global) === null || _a === void 0 ? void 0 : _a.text(input, attr)) !== null && _b !== void 0 ? _b : input;
}
function style(attr) {
    var _a, _b;
    if (attr.startsWith('\x1b[')) {
        return attr;
    }
    return (_b = (_a = sys_1.program.global) === null || _a === void 0 ? void 0 : _a.style(attr)) !== null && _b !== void 0 ? _b : '';
}
function ansi(code, input) {
    var opener = '\x1b['.concat(String(code), 'm');
    return opener.concat(input.replace(exports.RESET, opener), exports.RESET);
}
function bold(input) {
    return ansi(1, input);
}
function dim(input) {
    return ansi(2, input);
}
function italic(input) {
    return ansi(3, input);
}
function underline(input) {
    return ansi(4, input);
}
function invert(input) {
    return ansi(7, input);
}
function hide(input) {
    return ansi(8, input);
}
function strikeout(input) {
    return ansi(9, input);
}
function red(input) {
    return ansi(31, input);
}
function green(input) {
    return ansi(32, input);
}
function yellow(input) {
    return ansi(33, input);
}
function blue(input) {
    return ansi(34, input);
}
function magenta(input) {
    return ansi(35, input);
}
function cyan(input) {
    return ansi(36, input);
}
function gray(input) {
    return ansi(90, input);
}
exports.colorize = {
    format: function (input) {
        switch (typeof input) {
            case 'string':
                return exports.colorize.string(input);
            case 'symbol':
                return exports.colorize.symbol(input);
            case 'number':
                return exports.colorize.number(input);
            case 'undefined':
                return exports.colorize.undefined();
            case 'object':
                return exports.colorize['null']();
            default:
                return String(input);
        }
    },
    number: function (input) {
        return yellow(''.concat(String(input)));
    },
    symbol: function (input) {
        return red(''.concat(String(input)));
    },
    string: function (input, doQuote) {
        if (doQuote === void 0) { doQuote = true; }
        var quote;
        if (doQuote) {
            if (input.includes("'")) {
                quote = '"';
                input = input.replaceAll('"', '\\"');
            }
            else {
                quote = "'";
                input = input.replaceAll("'", "\\'");
            }
        }
        else {
            quote = '';
        }
        input = input.replaceAll(/\n/g, '⤦');
        return green(quote.concat(input, quote));
    },
    key: function (input) {
        return cyan(String(input));
    },
    boolean: function (input) {
        return yellow(''.concat(String(input)));
    },
    undefined: function () {
        return gray('undefined');
    },
    null: function () {
        return bold('null');
    },
};
