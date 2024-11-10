"use strict";
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
exports.isDebugging = isDebugging;
exports.inspect = inspect;
var ansi_1 = require("./ansi");
var _debug = false;
function isDebugging(enabled) {
    if (enabled !== undefined) {
        _debug = enabled;
    }
    return _debug;
}
function isEmpty(object) {
    for (var key in object) {
        return false;
    }
    return true;
}
var MAX = 200;
function inspect(value, wrap, recursionDepth, visited) {
    if (wrap === void 0) { wrap = true; }
    if (recursionDepth === void 0) { recursionDepth = 0; }
    if (visited === void 0) { visited = new Set(); }
    if (value && (typeof value === 'object' || typeof value === 'function')) {
        if (visited.has(value)) {
            return (0, ansi_1.red)('[Circular]');
        }
        else {
            visited = new Set(visited);
            visited.add(value);
        }
    }
    if (recursionDepth >= 10) {
        return (0, ansi_1.red)('...');
    }
    if (value instanceof Set) {
        return "new Set(".concat(inspect(Array.from(value.values()), wrap, recursionDepth, visited), ")");
    }
    if (value instanceof Map) {
        return "new Map(".concat(inspect(value.entries(), wrap, recursionDepth, visited), ")");
    }
    var tab = '  '.repeat(recursionDepth);
    var innerTab = tab + '  ';
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return '[]';
        }
        var values_1 = value.map(function (val) {
            return inspect(val, wrap, recursionDepth + 1, visited);
        });
        var count_1 = values_1.reduce(function (len, val) { return len + val.length; }, 0);
        var newline_1 = wrap && count_1 > MAX;
        var inner_1;
        if (newline_1) {
            var _a = values_1.reduce(function (_a, value) {
                var prev = _a[0], line = _a[1];
                if (line.length + value.length > MAX) {
                    return [(prev ? prev + ",\n".concat(innerTab) : '') + line, value];
                }
                return [prev, line ? line + ', ' + value : value];
            }, ['', '']), prev = _a[0], line = _a[1];
            inner_1 = (prev ? prev + ",\n".concat(innerTab) : '') + line;
        }
        else {
            inner_1 = values_1.join(', ');
        }
        return newline_1 ? "[\n".concat(innerTab).concat(inner_1, "\n").concat(tab, "]") : "[ ".concat(inner_1, " ]");
    }
    else if (typeof value === 'string') {
        return ansi_1.colorize.string(value, recursionDepth > 0);
    }
    else if (typeof value === 'symbol') {
        return ansi_1.colorize.symbol(value);
    }
    else if (typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === undefined ||
        value === null) {
        return ansi_1.colorize.format(value);
    }
    else if (typeof value === 'function') {
        return "function".concat(value.name ? " ".concat(value.name) : '', "() {\u2026}");
    }
    else if (value instanceof Object &&
        value.constructor !== Object &&
        isEmpty(value)) {
        return "".concat(value.constructor.name, "({})");
    }
    var name = value.constructor === undefined
        ? ''
        : value.constructor.name === 'Object'
            ? ''
            : value.constructor.name.concat(' ');
    var keys = Object.keys(value);
    if (keys.length === 0) {
        return '{}';
    }
    // weird ReactFiberNode one-off
    if ('$$typeof' in value && '_owner' in value) {
        var _ = value._owner, remainder = __rest(value, ["_owner"]);
        return inspect(remainder, wrap, recursionDepth, visited);
    }
    var values = keys.map(function (key) {
        return "".concat(ansi_1.colorize.key(key), ": ").concat(inspect(value[key], wrap, recursionDepth + 1, visited));
    });
    var count = values.reduce(function (len, val) { return len + val.length; }, 0);
    var newline = wrap && count > MAX;
    var inner;
    if (newline) {
        var _b = values.reduce(function (_a, value) {
            var prev = _a[0], line = _a[1];
            if (line.length + value.length > MAX) {
                return [(prev ? prev + ",\n".concat(innerTab) : '') + line, value];
            }
            return [prev, line ? line + ', ' + value : line];
        }, ['', '']), prev = _b[0], line = _b[1];
        inner = (prev ? prev + ",\n".concat(innerTab) : '') + line;
        inner = values.join(",\n".concat(innerTab));
    }
    else {
        inner = values.join(', ');
    }
    return newline
        ? "".concat(name, "{\n").concat(innerTab).concat(inner, "\n").concat(tab, "}")
        : "".concat(name, "{ ").concat(inner, " }");
}
