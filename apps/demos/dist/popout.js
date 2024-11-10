"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wretched_1 = require("wretched");
const demo_1 = require("./demo");
(0, demo_1.demo)(new wretched_1.Box({
    border: 'popout',
    width: 10,
    height: 5,
    children: [new wretched_1.Text({ text: '' })],
}));
//# sourceMappingURL=popout.js.map