"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wretched_1 = require("wretched");
const demo_1 = require("./demo");
const wretched_2 = require("wretched");
(0, wretched_1.interceptConsoleLog)();
// Log,
// ScrollableList,
const OBJ = {
    word: 'something',
    tags: ['tag1', 'tag2', 'tag3', 'tag4'],
    sentences: {
        short: 'this is a short sentence.',
        medium: 'this is another sentence, slightly longer.',
        long: 'finally, a long sentence, one that goes on a little too long, it could be argued.',
    },
};
const inspect1 = (0, wretched_2.inspect)(OBJ, false);
const inspect2 = (0, wretched_2.inspect)(OBJ, true);
const primary1 = new wretched_1.Button({
    height: 3,
    theme: 'primary',
    text: 'Primary',
});
const primary2 = new wretched_1.Button({
    theme: 'primary',
    text: 'Primary',
});
const button1 = new wretched_1.Button({
    height: 3,
    text: 'Default',
});
const button2 = new wretched_1.Button({
    text: 'Default',
});
const progress0 = new wretched_1.Progress({ value: 0, showPercent: true });
const progress1 = new wretched_1.Progress({ theme: 'blue', value: 15, showPercent: true });
const progress2 = new wretched_1.Progress({ theme: 'orange', value: 46, showPercent: true });
const progress3 = new wretched_1.Progress({
    theme: 'red',
    height: 2,
    value: 55,
    showPercent: true,
});
const progress4 = new wretched_1.Progress({
    theme: 'green',
    height: 3,
    value: 75,
    showPercent: true,
});
const progress5 = new wretched_1.Progress({
    theme: 'plain',
    height: 4,
    value: 100,
    showPercent: true,
});
const progress = [
    progress0,
    progress1,
    progress2,
    progress3,
    progress4,
    progress5,
];
const checkboxes = [1, 2, 3, 4].map((num, index) => new wretched_1.Checkbox({
    text: `Choice ${num}`,
    value: true,
    onChange: value => (progress[index].isVisible = value),
}));
const slider0 = new wretched_1.Slider({
    width: 1,
    height: 'shrink',
    direction: 'vertical',
    range: [0, 100],
    value: progress0.value,
    buttons: true,
    step: 1,
    onChange: value => {
        progress0.value = value;
    },
});
const slider1 = new wretched_1.Slider({
    direction: 'vertical',
    range: [0, 100],
    value: progress1.value,
    onChange: value => {
        progress1.value = value;
    },
    buttons: true,
    step: 1,
    border: true,
});
const slider2 = new wretched_1.Slider({
    height: 1,
    direction: 'horizontal',
    range: [0, 100],
    value: progress2.value,
    onChange: value => {
        progress2.value = value;
    },
    buttons: true,
    step: 1,
});
const slider3 = new wretched_1.Slider({
    direction: 'horizontal',
    range: [0, 100],
    value: progress3.value,
    onChange: value => {
        progress3.value = value;
    },
    buttons: true,
    step: 1,
    border: true,
});
const summary = new wretched_1.Text();
const titleInput = new wretched_1.Input({
    text: '',
    placeholder: 'Title',
    onChange() {
        summary.text = titleInput.text + '\n' + storyInput.text;
    },
});
const storyInput = new wretched_1.Input({
    text: '',
    placeholder: 'Story',
    wrap: true,
    multiline: true,
    onChange() {
        summary.text = titleInput.text + '\n' + storyInput.text;
    },
});
const wrapCheckbox = new wretched_1.Checkbox({
    text: `Wrap lines?`,
    value: true,
    onChange(value) {
        storyInput.wrap = value;
    },
});
const fontSelect = new wretched_1.Dropdown({
    theme: 'proceed',
    onSelect(value) {
        titleInput.font = value;
        storyInput.font = value;
    },
    height: 1,
    choices: wretched_1.FontFamilies.map(f => [f, f]),
    selected: 'default',
});
const storybox = wretched_1.Stack.down([
    wretched_1.Stack.right([wrapCheckbox, wretched_1.Space.horizontal(1), fontSelect]),
    titleInput,
    storyInput,
    wretched_1.Space.vertical(1),
    summary,
]);
const tree = new wretched_1.Tree({
    titleView: new wretched_1.Text({ text: 'Title view' }),
    data: [{ path: '1' }, { path: '2' }, { path: '3' }],
    render({ path }, index) {
        return new wretched_1.Text({ text: `Item ${path}` });
    },
    getChildren({ path }) {
        return [{ path: `${path}.1` }, { path: `${path}.2` }, { path: `${path}.3` }];
    },
});
const collapsible = new wretched_1.Collapsible({
    isCollapsed: true,
    collapsed: new wretched_1.Text({ text: inspect1 }),
    expanded: new wretched_1.Text({ text: inspect2 }),
});
const expandible = new wretched_1.Collapsible({
    isCollapsed: true,
    showCollapsed: true,
    collapsed: new wretched_1.Text({ text: inspect1 }),
    expanded: new wretched_1.Text({ text: inspect2 }),
});
const collapsibleText = new wretched_1.CollapsibleText({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur molestie faucibus. Phasellus iaculis pellentesque felis eu fringilla. Ut in sollicitudin nisi. Praesent in mauris tortor. Nam interdum, magna eu pellentesque scelerisque, dui ipsum adipiscing ante, vel ullamcorper nisl sapien id arcu. Nullam egestas diam eu felis mollis sit amet cursus enim vehicula. Quisque eu tellus id erat pellentesque consequat. Maecenas fermentum faucibus magna, eget dictum nisi congue sed. Quisque a justo a nisi eleifend facilisis sit amet at augue. Sed a sapien vitae augue hendrerit porta vel eu ligula. Proin enim urna, faucibus in vestibulum tincidunt, commodo sit amet orci. Vestibulum ac sem urna, quis mattis urna. Nam eget ullamcorper ligula. Nam volutpat, arcu vel auctor dignissim, tortor nisi sodales enim, et vestibulum nulla dui id ligula. Nam ullamcorper, augue ut interdum vulputate, eros mauris lobortis sapien, ac sodales dui eros ac elit.'.replaceAll('. ', '.\n'),
});
const tabs = new wretched_1.Box({
    height: 8,
    highlight: true,
    child: wretched_1.Tabs.create([
        ['Single', new wretched_1.Box({ flex: 1 })],
        ['Double', new wretched_1.Box({ border: 'double', flex: 1 })],
        ['Dotted', new wretched_1.Box({ border: 'dotted', flex: 1 })],
        ['Rounded', new wretched_1.Box({ border: 'rounded', flex: 1 })],
        [
            'Custom',
            new wretched_1.Box({
                border: [
                    '\n╌\n─', //top
                    ' ╎│', // left
                    '┌╌┐\n└┐└\n ╎┌', // tl
                    '┌╌┐\n┘┌┘\n┐╎', // tr
                    ' ╎└\n └╌', // bl
                    '┘╎\n╌┘', // br
                    '─\n╌', // bottom
                    '│╎', // right
                ],
                flex: 1,
            }),
        ],
    ]),
});
const digits1 = new wretched_1.Digits({
    text: 'Sphinx of black\nquartz, judge my vow.\n123,456.7890\n(1)[2]{3}\n+-*/ %#:!\n2^⁴',
});
const digits2 = new wretched_1.Digits({
    bold: true,
    text: 'How vexingly quick\ndaft zebras jump!\n123,456.7890\n(1)[2]{3}\n+-*/ %#:!\n2^⁴',
});
const scrollable = new wretched_1.Scrollable({
    child: wretched_1.Stack.down([digits1, digits2]),
    width: 40,
    height: 5,
});
const drawerView = wretched_1.Stack.down({
    maxWidth: 40,
    children: [
        new wretched_1.Text({ text: 'Drawer' }),
        wretched_1.Separator.horizontal(),
        wretched_1.Accordion.create(Array(10)
            .fill(0)
            .map((_, index) => wretched_1.Accordion.Section.create(`title ${index + 1}`, new wretched_1.Text({
            text: Array(10)
                .fill(`section ${index + 1}.`)
                .map((line, index) => line + (index + 1))
                .join('\n'),
        }))), { multiple: true }),
    ],
});
const contentView = wretched_1.Stack.right([
    wretched_1.Stack.down([
        wretched_1.Stack.right([
            wretched_1.Stack.down([
                wretched_1.Stack.right([
                    wretched_1.Stack.down([primary1, primary2], { gap: 1 }),
                    wretched_1.Stack.down([button1, button2], { gap: 1 }),
                    wretched_1.Stack.down(checkboxes, { padding: 1 }),
                ]),
                wretched_1.Stack.right([
                    wretched_1.Stack.down([(0, wretched_1.H1)('Header 1'), (0, wretched_1.H4)('Header 4')]),
                    wretched_1.Stack.down([(0, wretched_1.H2)('Header 2'), (0, wretched_1.H5)('Header 5')]),
                    wretched_1.Stack.down([(0, wretched_1.H3)('Header 3'), (0, wretched_1.H6)('Header 6')]),
                ]),
            ]),
            wretched_1.Stack.down(progress, { width: 40 }),
            slider0,
            storybox,
        ]),
        slider2,
        slider3,
        collapsible,
        expandible,
        collapsibleText,
        tabs,
        wretched_1.Stack.right([
            scrollable,
            new wretched_1.Spinner({
                padding: 1,
                isAnimating: false,
            }),
            new wretched_1.ToggleGroup({
                titles: [(0, wretched_1.bold)('B'), (0, wretched_1.italic)('I'), (0, wretched_1.underline)('U'), (0, wretched_1.strikeout)('S')],
                multiple: true,
                selected: [],
            }),
        ]),
        tree,
    ], { flex: 1 }),
    wretched_1.Stack.down([['flex1', slider1], wretched_1.Space.vertical(1)]),
]);
(0, demo_1.demo)(new wretched_1.Drawer({
    theme: 'secondary',
    drawer: drawerView,
    content: contentView,
}), false);
//# sourceMappingURL=components.js.map