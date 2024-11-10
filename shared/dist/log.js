"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interceptConsoleLog = interceptConsoleLog;
exports.decorateConsoleLog = decorateConsoleLog;
exports.fetchLogs = fetchLogs;
exports.flushLogs = flushLogs;
const Log_1 = require("./components/Log");
const inspect_1 = require("./inspect");
const levels = ['debug', 'error', 'info', 'log', 'warn'];
let logs = [];
const builtin = {};
levels.forEach(level => {
    builtin[level] = console[level];
});
function interceptConsoleLog(logListener = appendLog) {
    levels.forEach(level => {
        console[level] = function (...args) {
            logListener(level, args);
        };
    });
    process.on('exit', code => {
        flushLogs();
    });
}
function decorateConsoleLog() {
    levels.forEach(level => {
        const log = console[level];
        if (log.isDecorated) {
            return;
        }
        ;
        log.isDecorated = true;
        console[level] = function (...args) {
            log(...args.map(arg => (0, inspect_1.inspect)(arg, true)));
        };
    });
}
function appendLog(level, args) {
    logs.push({ level, args: args.map(arg => (0, inspect_1.inspect)(arg, true)) });
    Log_1.ConsoleLog.default?.invalidateSize();
}
function fetchLogs() {
    const copy = logs.filter(({ level }) => level !== 'debug');
    logs = logs.filter(({ level }) => level === 'debug');
    return copy;
}
function flushLogs() {
    logs.forEach(({ level, args }) => {
        builtin[level].apply(console, args);
    });
    logs.splice(0, logs.length);
    levels.forEach(level => {
        console[level] = builtin[level];
    });
}
//# sourceMappingURL=log.js.map