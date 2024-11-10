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
const sys_1 = require("./sys");
exports.RESET = '\x1b[0m';
// unicode.charWidth considers this "drawable" (width: 1). Buffer translates it
// to a space when it flushes to a terminal. It's used by Viewport.paint to
// put foreground/background colors into a region – subsequent draws that do
// _not_ specify foreground/background (value: undefined) will "inherit" this
// "paint" color.
exports.BG_DRAW = '\x14';
function styled(input, attr) {
    return sys_1.program.global?.text(input, attr) ?? input;
}
function style(attr) {
    if (attr.startsWith('\x1b[')) {
        return attr;
    }
    return sys_1.program.global?.style(attr) ?? '';
}
function ansi(code, input) {
    const opener = '\x1b['.concat(String(code), 'm');
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
    string: function (input, doQuote = true) {
        let quote;
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
//# sourceMappingURL=ansi.js.map