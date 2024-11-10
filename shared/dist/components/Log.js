"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLog = exports.Log = void 0;
const log_1 = require("../log");
const util_1 = require("../util");
const ansi_1 = require("../ansi");
const Container_1 = require("../Container");
const Text_1 = require("./Text");
const ScrollableList_1 = require("./ScrollableList");
const Collapsible_1 = require("./Collapsible");
const Stack_1 = require("./Stack");
class Log extends Container_1.Container {
    #logs = [];
    #scrollableList = new ScrollableList_1.ScrollableList({
        scrollHeight: 10,
        items: this.#logs,
        cellForItem: log => {
            return new LogLineView(log);
        },
        keepAtBottom: true,
    });
    constructor(props = {}) {
        super(props);
        this.add(this.#scrollableList);
    }
    setLogs(logs) {
        this.#logs = logs;
        this.#scrollableList.updateItems(logs);
    }
    appendLog(log) {
        this.#logs.push(log);
    }
    clear() {
        this.#logs = [];
        this.#scrollableList.updateItems(this.#logs);
    }
}
exports.Log = Log;
class LogLineView extends Container_1.Container {
    constructor({ level, args }) {
        super({});
        let headerStyle;
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
        const header = (0, ansi_1.styled)((0, util_1.centerPad)(level.toUpperCase(), 7), `black fg;${headerStyle}`);
        const lines = args.flatMap(arg => {
            return `${arg}`.split('\n').map(line => {
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
        let logView;
        const [firstLine, ..._] = lines;
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
        this.add(Stack_1.Stack.right({
            gap: 1,
            children: [
                new Text_1.Text({
                    text: header,
                    wrap: false,
                }),
                logView,
            ],
        }));
    }
}
class ConsoleLog extends Log {
    static default;
    constructor(props = {}) {
        super(props);
        ConsoleLog.default = this;
    }
    render(viewport) {
        (0, log_1.fetchLogs)().forEach(log => this.appendLog(log));
        super.render(viewport);
    }
}
exports.ConsoleLog = ConsoleLog;
//# sourceMappingURL=Log.js.map