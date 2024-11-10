"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wretched_1 = require("wretched");
const demo_1 = require("./demo");
const choices = [
    ['One\n1', 1],
    ['Two\n2', 2],
    ['Three\n3', 3],
    ['Four\n4', 4],
    ['Five\n5', 5],
    ['Six\n6', 6],
    ['Seven\n7', 7],
    ['Eight\n8', 8],
    ['Nine\n9', 9],
    ['Ten\n10', 10],
    ['Eleven\n11', 11],
    ['Twelve\n12', 12],
    ['Thirteen\n13', 13],
    ['Fourteen\n14', 14],
    ['Fifteen\n15', 15],
    ['Sixteen\n16', 16],
    ['Seventeen\n17', 17],
    ['Eighteen\n18', 18],
    ['Nineteen\n19', 19],
    ['Twenty\n20', 20],
    ['21', 21],
    ['22', 22],
    ['23', 23],
    ['24', 24],
    ['25', 25],
    ['26', 26],
    ['27', 27],
    ['28', 28],
    ['29', 29],
    ['30', 30],
    ['31', 31],
    ['32', 32],
    ['33', 33],
    ['34', 34],
    ['35', 35],
];
const dropdown = new wretched_1.Dropdown({
    multiple: true,
    theme: 'proceed',
    onSelect(value) {
        console.info(value);
    },
    padding: { left: 2, right: 2 },
    height: 1,
    choices,
    selected: [1],
});
const button = new wretched_1.Button({
    height: 3,
    padding: { left: 1, right: 1 },
    theme: 'primary',
    text: 'Launch',
    onClick() {
        const choices = [
            ...dropdown.choices,
            [`${dropdown.choices.length}`, dropdown.choices.length],
        ];
        // reverse order of choices
        dropdown.choices = choices.reverse();
    },
});
(0, demo_1.demo)(wretched_1.Stack.down({
    children: [
        new wretched_1.Dropdown({
            theme: 'primary',
            onSelect(value) {
                dropdown.selected = [value];
            },
            padding: { left: 2, right: 2 },
            choices,
            selected: 1,
        }),
        new wretched_1.Space({ height: 1 }),
        new wretched_1.Dropdown({
            theme: 'secondary',
            onSelect(value) {
                dropdown.selected = [value];
            },
            padding: { left: 2, right: 2 },
            choices,
            selected: 1,
        }),
        new wretched_1.Space({ height: 1 }),
        new wretched_1.Dropdown({
            padding: { left: 2, right: 2 },
            onSelect(value) {
                dropdown.selected = [value];
            },
            height: 1,
            choices,
            selected: 1,
        }),
        ['flex1', new wretched_1.Space()],
        button,
        [
            'flex1',
            new wretched_1.Separator({
                direction: 'horizontal',
                border: 'trailing',
                padding: 1,
            }),
        ],
        dropdown,
        new wretched_1.Space({ height: 1 }),
        new wretched_1.Dropdown({
            multiple: true,
            theme: 'plain',
            title: 'Select many options…',
            onSelect(value) {
                dropdown.selected = value;
            },
            padding: { left: 2, right: 2 },
            choices,
            selected: [],
        }),
        new wretched_1.Space({ height: 1 }),
        new wretched_1.Dropdown({
            theme: 'cancel',
            onSelect(value) {
                dropdown.selected = [value];
            },
            padding: { left: 2, right: 2 },
            choices: choices.slice(0, 4),
            selected: 1,
        }),
    ],
}));
//# sourceMappingURL=dropdown.js.map