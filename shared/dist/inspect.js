"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDebugging = isDebugging;
exports.inspect = inspect;
const ansi_1 = require("./ansi");
let _debug = false;
function isDebugging(enabled) {
    if (enabled !== undefined) {
        _debug = enabled;
    }
    return _debug;
}
function isEmpty(object) {
    for (const key in object) {
        return false;
    }
    return true;
}
const MAX = 200;
function inspect(value, wrap = true, recursionDepth = 0, visited = new Set()) {
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
        return `new Set(${inspect(Array.from(value.values()), wrap, recursionDepth, visited)})`;
    }
    if (value instanceof Map) {
        return `new Map(${inspect(value.entries(), wrap, recursionDepth, visited)})`;
    }
    const tab = '  '.repeat(recursionDepth);
    const innerTab = tab + '  ';
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return '[]';
        }
        const values = value.map(val => inspect(val, wrap, recursionDepth + 1, visited));
        const count = values.reduce((len, val) => len + val.length, 0);
        const newline = wrap && count > MAX;
        let inner;
        if (newline) {
            const [prev, line] = values.reduce(([prev, line], value) => {
                if (line.length + value.length > MAX) {
                    return [(prev ? prev + `,\n${innerTab}` : '') + line, value];
                }
                return [prev, line ? line + ', ' + value : value];
            }, ['', '']);
            inner = (prev ? prev + `,\n${innerTab}` : '') + line;
        }
        else {
            inner = values.join(', ');
        }
        return newline ? `[\n${innerTab}${inner}\n${tab}]` : `[ ${inner} ]`;
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
        return `function${value.name ? ` ${value.name}` : ''}() {…}`;
    }
    else if (value instanceof Object &&
        value.constructor !== Object &&
        isEmpty(value)) {
        return `${value.constructor.name}({})`;
    }
    const name = value.constructor === undefined
        ? ''
        : value.constructor.name === 'Object'
            ? ''
            : value.constructor.name.concat(' ');
    const keys = Object.keys(value);
    if (keys.length === 0) {
        return '{}';
    }
    // weird ReactFiberNode one-off
    if ('$$typeof' in value && '_owner' in value) {
        const { _owner: _, ...remainder } = value;
        return inspect(remainder, wrap, recursionDepth, visited);
    }
    const values = keys.map(key => `${ansi_1.colorize.key(key)}: ${inspect(value[key], wrap, recursionDepth + 1, visited)}`);
    const count = values.reduce((len, val) => len + val.length, 0);
    const newline = wrap && count > MAX;
    let inner;
    if (newline) {
        const [prev, line] = values.reduce(([prev, line], value) => {
            if (line.length + value.length > MAX) {
                return [(prev ? prev + `,\n${innerTab}` : '') + line, value];
            }
            return [prev, line ? line + ', ' + value : line];
        }, ['', '']);
        inner = (prev ? prev + `,\n${innerTab}` : '') + line;
        inner = values.join(`,\n${innerTab}`);
    }
    else {
        inner = values.join(', ');
    }
    return newline
        ? `${name}{\n${innerTab}${inner}\n${tab}}`
        : `${name}{ ${inner} }`;
}
//# sourceMappingURL=inspect.js.map