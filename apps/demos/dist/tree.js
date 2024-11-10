"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wretched_1 = require("wretched");
const demo_1 = require("./demo");
(0, wretched_1.interceptConsoleLog)();
const data = [
    {
        title: 'Item 1',
        items: [
            {
                title: 'Item 1.1',
                items: [
                    { title: 'Lonely Item 1.1.1', items: [] },
                    { title: 'Lonely Item 1.1.2', items: [] },
                    { title: 'Lonely Item 1.1.3', items: [] },
                ],
            },
            { title: 'Lonely Item 1.2', items: [] },
            { title: 'Lonely Item 1.3\n[ ] more lines', items: [] },
        ],
    },
    {
        title: 'Item 2',
        items: [
            { title: 'Lonely 2.1', items: [] },
            {
                title: 'Item 2.2',
                items: [
                    { title: 'Lonely 2.2.1', items: [] },
                    { title: 'Lonely 2.2.2', items: [] },
                    { title: 'Lonely 2.2.3', items: [] },
                ],
            },
            { title: 'Lonely 2.3\n[ ] more lines', items: [] },
        ],
    },
    {
        title: 'Item 3',
        items: [
            { title: 'Lonely 3.1', items: [] },
            { title: 'Lonely 3.2', items: [] },
            {
                title: 'Item 3.3\n[ ] more lines',
                items: [
                    { title: 'Lonely 3.3.1', items: [] },
                    { title: 'Lonely 3.3.2', items: [] },
                    { title: 'Lonely 3.3.3', items: [] },
                ],
            },
        ],
    },
];
(0, demo_1.demo)(new wretched_1.Tree({
    titleView: new wretched_1.Text({ text: 'Title view' }),
    data,
    render({ title }, path) {
        return new wretched_1.Text({ text: title + ` (${path})` });
    },
    getChildren({ items }) {
        return items;
    },
}));
//# sourceMappingURL=tree.js.map