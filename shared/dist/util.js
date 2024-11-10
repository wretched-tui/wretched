"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = debug;
exports.leftPad = leftPad;
exports.rightPad = rightPad;
exports.centerPad = centerPad;
exports.define = define;
const sys_1 = require("./sys");
let _debug = false;
/**
 * A global function to turn debugging on/off, useful to test things that would
 * otherwise output way too much, ie console in render()
 */
function debug(value) {
    return (_debug = value ?? _debug);
}
/**
 * Left pads (with spaces) according to terminal width
 */
function leftPad(str, length) {
    const lines = str.split('\n');
    if (lines.length > 1) {
        return lines.map(line => leftPad(line, length)).join('\n');
    }
    const width = sys_1.unicode.lineWidth(str);
    if (width >= length) {
        return str;
    }
    return ' '.repeat(length - width).concat(str);
}
/**
 * Right pads (with spaces) according to terminal width
 */
function rightPad(str, length) {
    const lines = str.split('\n');
    if (lines.length > 1) {
        return lines.map(line => rightPad(line, length)).join('\n');
    }
    const width = sys_1.unicode.lineWidth(str);
    if (width >= length) {
        return str;
    }
    return str.concat(' '.repeat(length - width));
}
/**
 * Center pads (with spaces) according to terminal width
 */
function centerPad(str, length) {
    const lines = str.split('\n');
    if (lines.length > 1) {
        return lines.map(line => centerPad(line, length)).join('\n');
    }
    const width = sys_1.unicode.lineWidth(str);
    if (width >= length) {
        return str;
    }
    const left = ' '.repeat(~~((length - width) / 2));
    const right = ' '.repeat(~~((length - width) / 2 + 0.5));
    return left.concat(str, right);
}
/**
 * Used to add {enumerable: true} to defined properties on Components, so they
 * are picked up by inspect().
 */
function define(object, property, attributes) {
    let kls = object;
    do {
        const descriptor = Object.getOwnPropertyDescriptor(kls, property);
        if (descriptor) {
            const modified_descriptor = Object.assign(descriptor, attributes);
            Object.defineProperty(object, property, modified_descriptor);
            return;
        }
        else {
            kls = Object.getPrototypeOf(kls);
        }
    } while (kls && kls !== Object.prototype);
}
//# sourceMappingURL=util.js.map