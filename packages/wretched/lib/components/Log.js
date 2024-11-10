"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Log_logs, _Log_scrollableList;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLog = exports.Log = void 0;
var log_1 = require("../log");
var util_1 = require("../util");
var ansi_1 = require("../ansi");
var Container_1 = require("../Container");
var Text_1 = require("./Text");
var ScrollableList_1 = require("./ScrollableList");
var Collapsible_1 = require("./Collapsible");
var Stack_1 = require("./Stack");
var Log = /** @class */ (function (_super) {
    __extends(Log, _super);
    function Log(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _Log_logs.set(_this, []);
        _Log_scrollableList.set(_this, new ScrollableList_1.ScrollableList({
            scrollHeight: 10,
            items: __classPrivateFieldGet(_this, _Log_logs, "f"),
            cellForItem: function (log) {
                return new LogLineView(log);
            },
            keepAtBottom: true,
        }));
        _this.add(__classPrivateFieldGet(_this, _Log_scrollableList, "f"));
        return _this;
    }
    Log.prototype.setLogs = function (logs) {
        __classPrivateFieldSet(this, _Log_logs, logs, "f");
        __classPrivateFieldGet(this, _Log_scrollableList, "f").updateItems(logs);
    };
    Log.prototype.appendLog = function (log) {
        __classPrivateFieldGet(this, _Log_logs, "f").push(log);
    };
    Log.prototype.clear = function () {
        __classPrivateFieldSet(this, _Log_logs, [], "f");
        __classPrivateFieldGet(this, _Log_scrollableList, "f").updateItems(__classPrivateFieldGet(this, _Log_logs, "f"));
    };
    return Log;
}(Container_1.Container));
exports.Log = Log;
_Log_logs = new WeakMap(), _Log_scrollableList = new WeakMap();
var LogLineView = /** @class */ (function (_super) {
    __extends(LogLineView, _super);
    function LogLineView(_a) {
        var level = _a.level, args = _a.args;
        var _this = _super.call(this, {}) || this;
        var headerStyle;
        switch (level) {
            case 'error':
                headerStyle = 'red bg';
                break;
            case 'warn':
                headerStyle = 'yellow bg';
                break;
            case 'info':
                headerStyle = 'white bg';
                break;
            case 'debug':
                headerStyle = 'green bg';
                break;
            default:
                headerStyle = 'white bg';
                break;
        }
        var header = (0, ansi_1.styled)((0, util_1.centerPad)(level.toUpperCase(), 7), "black fg;".concat(headerStyle));
        var lines = args.flatMap(function (arg) {
            return "".concat(arg).split('\n').map(function (line) {
                switch (level) {
                    case 'error':
                        return (0, ansi_1.styled)(line, 'red fg');
                    case 'warn':
                        return (0, ansi_1.styled)(line, 'yellow fg');
                    case 'info':
                        return (0, ansi_1.styled)(line, 'white fg');
                    case 'debug':
                        return (0, ansi_1.styled)(line, 'green fg');
                    default:
                        return line;
                }
            });
        });
        var logView;
        var firstLine = lines[0], _ = lines.slice(1);
        if (lines.length > 1) {
            logView = new Collapsible_1.Collapsible({
                isCollapsed: false,
                collapsed: new Text_1.Text({
                    text: firstLine,
                    wrap: false,
                }),
                expanded: new Text_1.Text({
                    lines: lines,
                    wrap: true,
                }),
            });
        }
        else {
            logView = new Text_1.Text({
                text: firstLine,
                wrap: true,
            });
        }
        _this.add(Stack_1.Stack.right({
            gap: 1,
            children: [
                new Text_1.Text({
                    text: header,
                    wrap: false,
                }),
                logView,
            ],
        }));
        return _this;
    }
    return LogLineView;
}(Container_1.Container));
var ConsoleLog = /** @class */ (function (_super) {
    __extends(ConsoleLog, _super);
    function ConsoleLog(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        ConsoleLog.default = _this;
        return _this;
    }
    ConsoleLog.prototype.render = function (viewport) {
        var _this = this;
        (0, log_1.fetchLogs)().forEach(function (log) { return _this.appendLog(log); });
        _super.prototype.render.call(this, viewport);
    };
    return ConsoleLog;
}(Log));
exports.ConsoleLog = ConsoleLog;
