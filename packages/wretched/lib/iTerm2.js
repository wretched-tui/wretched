"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iTerm2 = void 0;
var string_decoder_1 = require("string_decoder");
var Color_1 = require("./Color");
/**
 * Sets iTerm2 proprietary ANSI codes
 */
var iTerm2 = /** @class */ (function () {
    function iTerm2() {
    }
    /**
     * Returns a promise in case you really want to do flow control here, but it's not
     * necessary; you can fire and forget this as part of `Screen.start()`
     *
     * @example
     * Screen.start(async (program) => {
     *   await iTerm2.setBackground(program, [23, 23, 23])
     *   return new Box({ … })
     * })
     */
    iTerm2.setBackground = function (program, bg) {
        process.on('exit', function () {
            iTerm2.restoreBg(program);
        });
        return new Promise(function (resolve) {
            var hex = (0, Color_1.colorToHex)(bg).slice(1);
            program.once('data', function (input) {
                var decoder = new string_decoder_1.StringDecoder('utf8');
                var response = decoder.write(input);
                iTerm2._restoreBg = parseBackgroundResponse(response);
                program.write(setBackgroundCommand(hex));
                setTimeout(resolve, 5);
            });
            setTimeout(resolve, 10);
            program.write(getBackgroundColorCommand());
        });
    };
    iTerm2.restoreBg = function (program) {
        if (iTerm2._restoreBg) {
            program.write(setBackgroundCommand(iTerm2._restoreBg));
        }
    };
    return iTerm2;
}());
exports.iTerm2 = iTerm2;
function getBackgroundColorCommand() {
    return '\x1b]4;-2;?\x07';
}
function parseBackgroundResponse(response) {
    var match = response.match(/\x1b\]4;-2;rgb:(\w{2})\w*\/(\w{2})\w*\/(\w{2})/);
    if (match) {
        return match[1] + match[2] + match[3];
    }
}
/**
 * @param rgb should not include the '#' symbol
 */
function setBackgroundCommand(rgb) {
    return "\u001B]Ph".concat(rgb.replace('#', ''), "\u001B\\");
}
