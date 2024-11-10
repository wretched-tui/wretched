"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interceptConsoleLog = interceptConsoleLog;
exports.decorateConsoleLog = decorateConsoleLog;
exports.fetchLogs = fetchLogs;
exports.flushLogs = flushLogs;
var Log_1 = require("./components/Log");
var inspect_1 = require("./inspect");
var levels = ['debug', 'error', 'info', 'log', 'warn'];
var logs = [];
var builtin = {};
levels.forEach(function (level) {
    builtin[level] = console[level];
});
function interceptConsoleLog(logListener) {
    if (logListener === void 0) { logListener = appendLog; }
    levels.forEach(function (level) {
        console[level] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            logListener(level, args);
        };
    });
    process.on('exit', function (code) {
        flushLogs();
    });
}
function decorateConsoleLog() {
    levels.forEach(function (level) {
        var log = console[level];
        if (log.isDecorated) {
            return;
        }
        ;
        log.isDecorated = true;
        console[level] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            log.apply(void 0, args.map(function (arg) { return (0, inspect_1.inspect)(arg, true); }));
        };
    });
}
function appendLog(level, args) {
    var _a;
    logs.push({ level: level, args: args.map(function (arg) { return (0, inspect_1.inspect)(arg, true); }) });
    (_a = Log_1.ConsoleLog.default) === null || _a === void 0 ? void 0 : _a.invalidateSize();
}
function fetchLogs() {
    var copy = logs.filter(function (_a) {
        var level = _a.level;
        return level !== 'debug';
    });
    logs = logs.filter(function (_a) {
        var level = _a.level;
        return level === 'debug';
    });
    return copy;
}
function flushLogs() {
    logs.forEach(function (_a) {
        var level = _a.level, args = _a.args;
        builtin[level].apply(console, args);
    });
    logs.splice(0, logs.length);
    levels.forEach(function (level) {
        console[level] = builtin[level];
    });
}
