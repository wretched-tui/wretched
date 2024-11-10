"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demo = demo;
const wretched_1 = require("wretched");
async function demo(demoContent, showConsoleLog = true) {
    (0, wretched_1.interceptConsoleLog)();
    process.title = 'Wretched';
    if (process.argv.includes('--no-log')) {
        showConsoleLog = false;
    }
    const consoleLog = new wretched_1.ConsoleLog({
        height: typeof showConsoleLog === 'number' ? showConsoleLog : 10,
    });
    const [screen, program] = await wretched_1.Screen.start(async (program) => {
        // await iTerm2.setBackground(program, [23, 23, 23])
        return new wretched_1.Window({
            child: new wretched_1.TrackMouse({
                content: wretched_1.Stack.down({
                    children: showConsoleLog
                        ? [
                            ['flex1', demoContent],
                            ['natural', consoleLog],
                        ]
                        : [['flex1', demoContent]],
                }),
            }),
        });
    }, { quitChar: 'q' });
    program.key('escape', function () {
        consoleLog.clear();
        screen.render();
    });
}
//# sourceMappingURL=demo.js.map