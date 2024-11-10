"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dropdown = void 0;
const sys_1 = require("../sys");
const View_1 = require("../View");
const Container_1 = require("../Container");
const geometry_1 = require("../geometry");
const components_1 = require("../components");
const events_1 = require("../events");
class Dropdown extends View_1.View {
    dropdownSelector;
    #title;
    #showModal = false;
    #multiple;
    #onSelectCallback;
    constructor({ multiple, ...props }) {
        super(props);
        this.#multiple = multiple ?? false;
        this.dropdownSelector = new DropdownSelector({
            theme: this.theme,
            multiple: this.#multiple,
            choices: [],
            selected: [],
            onSelect: () => this.#onSelect(),
        });
        this.#update(props);
    }
    update(props) {
        this.#update(props);
        super.update(props);
    }
    #update({ title, choices, selected, onSelect }) {
        this.#onSelectCallback = onSelect;
        this.#title = title ? title.split('\n') : undefined;
        this.choices = choices;
        this.selected = selected;
        this.dropdownSelector.theme = this.theme;
    }
    get choices() {
        return this.dropdownSelector.choices;
    }
    set choices(choices) {
        this.dropdownSelector.choices = choices;
    }
    #titleLines() {
        if (this.#title !== undefined &&
            this.dropdownSelector.selectedValues.length === 0) {
            return this.#title;
        }
        return this.dropdownSelector.selectedText ?? ['<select>'];
    }
    dismissModal() {
        this.#showModal = false;
    }
    get selected() {
        if (this.#multiple) {
            return this.dropdownSelector.selectedValues;
        }
        else {
            return this.dropdownSelector.selectedValue;
        }
    }
    set selected(selected) {
        this.dropdownSelector.selectedRows = dropdownSelectedRows(selected, this.dropdownSelector.choices, this.#multiple);
    }
    #onSelect() {
        if (this.#multiple) {
            ;
            this.#onSelectCallback?.(this.dropdownSelector.selectedValues);
        }
        else {
            this.dismissModal();
            const value = this.dropdownSelector.selectedValue;
            if (value !== undefined) {
                ;
                this.#onSelectCallback?.(value);
            }
        }
        this.invalidateSize();
    }
    naturalSize() {
        const size = new geometry_1.Size(sys_1.unicode.stringSize(this.#titleLines()));
        return size.grow(8, 0);
    }
    receiveMouse(event, system) {
        super.receiveMouse(event, system);
        if ((0, events_1.isMouseClicked)(event)) {
            this.#showModal = true;
        }
    }
    render(viewport) {
        if (viewport.isEmpty) {
            return;
        }
        if (this.#showModal) {
            viewport.requestModal(this.dropdownSelector, () => {
                this.#showModal = false;
            });
        }
        viewport.registerMouse(['mouse.move', 'mouse.button.left']);
        const lines = this.#titleLines();
        const textStyle = this.theme.ui({
            isHover: this.isHover && !this.#showModal,
        });
        viewport.paint(textStyle);
        const pt = new geometry_1.Point(0, 0).mutableCopy();
        const lineIndexOffset = ~~((viewport.contentSize.height - lines.length) / 2);
        for (; pt.y < viewport.contentSize.height; pt.y++) {
            const lineIndex = pt.y - lineIndexOffset;
            if (lineIndex >= 0 && lineIndex < lines.length) {
                viewport.write(lines[lineIndex], pt.offset(1, 0), textStyle);
            }
            viewport.write(`▏  `, pt.offset(viewport.contentSize.width - 3, 0), textStyle);
        }
        viewport.write(this.#showModal
            ? ARROWS.open
            : this.isHover
                ? ARROWS.hover
                : ARROWS.default, new geometry_1.Point(viewport.contentSize.width - 2, viewport.contentSize.height / 2), textStyle);
    }
}
exports.Dropdown = Dropdown;
class DropdownSelector extends Container_1.Container {
    #choices;
    #selected;
    #multiple;
    #onSelect;
    #scrollView;
    #box = new components_1.Box({ maxHeight: 24, border: BORDERS.below });
    #checkbox;
    constructor({ choices, selected, multiple, onSelect, ...viewProps }) {
        super({ ...viewProps });
        this.#choices = choices.map(([text, value]) => [
            text.split('\n'),
            value,
            text,
        ]);
        this.#selected = new Set(selected);
        this.#multiple = multiple;
        this.#onSelect = onSelect;
        this.#checkbox = new components_1.Checkbox({
            text: 'Select all',
            value: false,
            onChange: value => {
                if (value) {
                    this.#selected = new Set(Array(this.#choices.length).keys());
                }
                else {
                    this.#selected = new Set();
                }
                onSelect();
                this.#scrollView.invalidateAllRows('view');
            },
        });
        this.#scrollView = new components_1.ScrollableList({
            items: this.#choices.map(([, choice]) => choice),
            cellForItem: (choice, row) => this.cellForItem(choice, row),
        });
        const content = new components_1.Stack({ direction: 'down', children: [] });
        if (multiple) {
            content.add(this.#checkbox);
        }
        content.add(this.#scrollView);
        this.#box.add(content);
        this.add(this.#box);
        this.#checkbox.value = this.#isAllSelected();
    }
    #isAllSelected() {
        return this.#selected.size === this.#choices.length;
    }
    get selectedRows() {
        return [...this.#selected];
    }
    set selectedRows(rows) {
        new Set([...this.#selected, ...rows]).forEach(selected => {
            const item = this.#choices[selected][1];
            this.#scrollView.invalidateItem(item, 'view');
        });
        this.#selected = new Set(rows);
    }
    get selectedText() {
        if (this.#selected.size === 0) {
            return undefined;
        }
        if (this.#selected.size > 1) {
            const rows = [...this.#selected];
            rows.sort();
            // honestly, it's strange to use multiple lines in your dropdown choices...
            // but we support it! When multiple items are selected, the text becomes:
            // 1. join each line with a space
            // 2. join each entry with a comma
            // e.g. "Selected\n1", "Selected\n2" becomes "Selected 1, Selected 2"
            return [rows.map(index => this.#choices[index][0].join(' ')).join(', ')];
        }
        // if only one item is selected, make that the title, preserving multiple lines
        const [row] = [...this.#selected];
        return this.#choices[row][0];
    }
    get selectedValue() {
        if (this.#selected.size === 0) {
            return undefined;
        }
        const [row] = [...this.#selected];
        return this.#choices[row][1];
    }
    get selectedValues() {
        return [...this.#selected].map(index => this.#choices[index][1]);
    }
    get choices() {
        return this.#choices.map(([_, choice, text]) => [text, choice]);
    }
    /**
     * Sets new choices, preserving the previously selected items.
     */
    set choices(choices) {
        const selected = [...this.#selected].map(index => this.#choices[index][1]);
        this.#choices = choices.map(([text, choice]) => [
            text.split('\n'),
            choice,
            text,
        ]);
        this.#selected = new Set(selected.flatMap(item => {
            const index = choices.findIndex(([_, choice]) => choice === item);
            if (index === -1) {
                return [];
            }
            return [index];
        }));
        this.#scrollView.updateItems(choices.map(([, choice]) => choice));
    }
    cellForItem(choice, row) {
        const button = this.#cellButton(choice, row);
        return components_1.Stack.right({
            fill: false,
            children: [
                ['flex1', button],
                new components_1.Separator({ direction: 'vertical', border: 'single' }),
            ],
        });
    }
    #cellButton(choice, row) {
        const lines = this.#choices[row][0];
        const isSelected = [...this.#selected].some(index => index === row);
        return new components_1.Button({
            theme: isSelected ? 'selected' : undefined,
            border: 'none',
            align: 'left',
            child: new components_1.Text({
                lines: lines.map((line, index) => {
                    return dropdownPrefix(this.#multiple, index, isSelected) + line;
                }),
            }),
            onClick: () => {
                this.#selected.forEach(selected => {
                    const item = this.#choices[selected][1];
                    this.#scrollView.invalidateItem(item, 'view');
                });
                this.#scrollView.invalidateItem(choice, 'view');
                if (this.#multiple) {
                    if (this.#selected.has(row)) {
                        this.#selected.delete(row);
                    }
                    else {
                        this.#selected.add(row);
                    }
                }
                else {
                    this.#selected = new Set([row]);
                }
                this.#checkbox.value = this.#isAllSelected();
                this.#onSelect();
            },
        });
    }
    render(viewport) {
        if (viewport.isEmpty) {
            return super.render(viewport);
        }
        const naturalSize = this.naturalSize(viewport.contentSize).max(viewport.contentSize);
        const fitsBelow = viewport.parentRect.maxY() + naturalSize.height <
            viewport.contentSize.height;
        const fitsAbove = naturalSize.height <= viewport.parentRect.minY();
        // 1. doesn't fit above or below, pick the side that has more room
        // 2. prefer below
        // 3. otherwise above
        let placement;
        let height = naturalSize.height;
        if (!fitsBelow && !fitsAbove) {
            const spaceBelow = viewport.contentSize.height - viewport.parentRect.maxY() + 1;
            const spaceAbove = viewport.parentRect.minY() + 1;
            if (spaceAbove > spaceBelow) {
                placement = 'above';
                height = spaceAbove;
            }
            else {
                placement = 'below';
                height = spaceBelow;
            }
        }
        else if (fitsBelow) {
            placement = 'below';
        }
        else {
            placement = 'above';
        }
        const width = Math.max(viewport.parentRect.size.width, Math.min(naturalSize.width, viewport.contentSize.width - viewport.parentRect.minX()));
        const x = Math.max(0, viewport.parentRect.maxX() - width, viewport.parentRect.minX());
        let y;
        if (placement === 'below') {
            y = viewport.parentRect.maxY();
        }
        else {
            y = viewport.parentRect.minY() - height;
        }
        this.#box.border = BORDERS[placement];
        const rect = new geometry_1.Rect([x, y], [width, height]);
        viewport.clipped(rect, inside => super.render(inside));
    }
}
function dropdownSelectedRows(selected, choices, multiple) {
    let selectedItems;
    if (multiple) {
        selectedItems = selected;
    }
    else if (selected !== undefined) {
        selectedItems = [selected];
    }
    else {
        return [];
    }
    return selectedItems.flatMap(item => {
        const index = choices.findIndex(([_, choice]) => choice === item);
        if (index === -1) {
            return [];
        }
        return [index];
    });
}
function dropdownPrefix(multiple, index, isSelected) {
    if (index !== 0) {
        return '  ';
    }
    if (multiple) {
        return isSelected ? BOX.multiple.checked : BOX.multiple.unchecked;
    }
    else {
        return isSelected ? BOX.single.checked : BOX.single.unchecked;
    }
}
const ARROWS = { hover: '▼', default: '▽', open: '◇' };
const BORDERS = {
    control: ['─', '│', '╭', '╮', '╰', '╯'],
    hover: ['─', '│', '╭', '╮', '╰', '╯', '─', '│'],
    below: ['─', '│', '╭', '╮', '╰', '╯', '─', '│'],
    above: ['─', '│', '╭', '╮', '╰', '╯', '─', '│'],
};
const BOX = {
    multiple: {
        unchecked: '☐ ',
        checked: '☑ ',
    },
    single: {
        unchecked: '◯ ',
        checked: '⦿ ',
    },
};
//# sourceMappingURL=Dropdown.js.map