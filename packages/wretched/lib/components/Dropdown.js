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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _Dropdown_instances, _Dropdown_title, _Dropdown_showModal, _Dropdown_multiple, _Dropdown_onSelectCallback, _Dropdown_update, _Dropdown_titleLines, _Dropdown_onSelect, _DropdownSelector_instances, _DropdownSelector_choices, _DropdownSelector_selected, _DropdownSelector_multiple, _DropdownSelector_onSelect, _DropdownSelector_scrollView, _DropdownSelector_box, _DropdownSelector_checkbox, _DropdownSelector_isAllSelected, _DropdownSelector_cellButton;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dropdown = void 0;
var sys_1 = require("../sys");
var View_1 = require("../View");
var Container_1 = require("../Container");
var geometry_1 = require("../geometry");
var components_1 = require("../components");
var events_1 = require("../events");
var Dropdown = /** @class */ (function (_super) {
    __extends(Dropdown, _super);
    function Dropdown(_a) {
        var _this = this;
        var multiple = _a.multiple, props = __rest(_a, ["multiple"]);
        _this = _super.call(this, props) || this;
        _Dropdown_instances.add(_this);
        _Dropdown_title.set(_this, void 0);
        _Dropdown_showModal.set(_this, false);
        _Dropdown_multiple.set(_this, void 0);
        _Dropdown_onSelectCallback.set(_this, void 0);
        __classPrivateFieldSet(_this, _Dropdown_multiple, multiple !== null && multiple !== void 0 ? multiple : false, "f");
        _this.dropdownSelector = new DropdownSelector({
            theme: _this.theme,
            multiple: __classPrivateFieldGet(_this, _Dropdown_multiple, "f"),
            choices: [],
            selected: [],
            onSelect: function () { return __classPrivateFieldGet(_this, _Dropdown_instances, "m", _Dropdown_onSelect).call(_this); },
        });
        __classPrivateFieldGet(_this, _Dropdown_instances, "m", _Dropdown_update).call(_this, props);
        return _this;
    }
    Dropdown.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Dropdown_instances, "m", _Dropdown_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Object.defineProperty(Dropdown.prototype, "choices", {
        get: function () {
            return this.dropdownSelector.choices;
        },
        set: function (choices) {
            this.dropdownSelector.choices = choices;
        },
        enumerable: false,
        configurable: true
    });
    Dropdown.prototype.dismissModal = function () {
        __classPrivateFieldSet(this, _Dropdown_showModal, false, "f");
    };
    Object.defineProperty(Dropdown.prototype, "selected", {
        get: function () {
            if (__classPrivateFieldGet(this, _Dropdown_multiple, "f")) {
                return this.dropdownSelector.selectedValues;
            }
            else {
                return this.dropdownSelector.selectedValue;
            }
        },
        set: function (selected) {
            this.dropdownSelector.selectedRows = dropdownSelectedRows(selected, this.dropdownSelector.choices, __classPrivateFieldGet(this, _Dropdown_multiple, "f"));
        },
        enumerable: false,
        configurable: true
    });
    Dropdown.prototype.naturalSize = function () {
        var size = new geometry_1.Size(sys_1.unicode.stringSize(__classPrivateFieldGet(this, _Dropdown_instances, "m", _Dropdown_titleLines).call(this)));
        return size.grow(8, 0);
    };
    Dropdown.prototype.receiveMouse = function (event, system) {
        _super.prototype.receiveMouse.call(this, event, system);
        if ((0, events_1.isMouseClicked)(event)) {
            __classPrivateFieldSet(this, _Dropdown_showModal, true, "f");
        }
    };
    Dropdown.prototype.render = function (viewport) {
        var _this = this;
        if (viewport.isEmpty) {
            return;
        }
        if (__classPrivateFieldGet(this, _Dropdown_showModal, "f")) {
            viewport.requestModal(this.dropdownSelector, function () {
                __classPrivateFieldSet(_this, _Dropdown_showModal, false, "f");
            });
        }
        viewport.registerMouse(['mouse.move', 'mouse.button.left']);
        var lines = __classPrivateFieldGet(this, _Dropdown_instances, "m", _Dropdown_titleLines).call(this);
        var textStyle = this.theme.ui({
            isHover: this.isHover && !__classPrivateFieldGet(this, _Dropdown_showModal, "f"),
        });
        viewport.paint(textStyle);
        var pt = new geometry_1.Point(0, 0).mutableCopy();
        var lineIndexOffset = ~~((viewport.contentSize.height - lines.length) / 2);
        for (; pt.y < viewport.contentSize.height; pt.y++) {
            var lineIndex = pt.y - lineIndexOffset;
            if (lineIndex >= 0 && lineIndex < lines.length) {
                viewport.write(lines[lineIndex], pt.offset(1, 0), textStyle);
            }
            viewport.write("\u258F  ", pt.offset(viewport.contentSize.width - 3, 0), textStyle);
        }
        viewport.write(__classPrivateFieldGet(this, _Dropdown_showModal, "f")
            ? ARROWS.open
            : this.isHover
                ? ARROWS.hover
                : ARROWS.default, new geometry_1.Point(viewport.contentSize.width - 2, viewport.contentSize.height / 2), textStyle);
    };
    return Dropdown;
}(View_1.View));
exports.Dropdown = Dropdown;
_Dropdown_title = new WeakMap(), _Dropdown_showModal = new WeakMap(), _Dropdown_multiple = new WeakMap(), _Dropdown_onSelectCallback = new WeakMap(), _Dropdown_instances = new WeakSet(), _Dropdown_update = function _Dropdown_update(_a) {
    var title = _a.title, choices = _a.choices, selected = _a.selected, onSelect = _a.onSelect;
    __classPrivateFieldSet(this, _Dropdown_onSelectCallback, onSelect, "f");
    __classPrivateFieldSet(this, _Dropdown_title, title ? title.split('\n') : undefined, "f");
    this.choices = choices;
    this.selected = selected;
    this.dropdownSelector.theme = this.theme;
}, _Dropdown_titleLines = function _Dropdown_titleLines() {
    var _a;
    if (__classPrivateFieldGet(this, _Dropdown_title, "f") !== undefined &&
        this.dropdownSelector.selectedValues.length === 0) {
        return __classPrivateFieldGet(this, _Dropdown_title, "f");
    }
    return (_a = this.dropdownSelector.selectedText) !== null && _a !== void 0 ? _a : ['<select>'];
}, _Dropdown_onSelect = function _Dropdown_onSelect() {
    var _a, _b;
    if (__classPrivateFieldGet(this, _Dropdown_multiple, "f")) {
        ;
        (_a = __classPrivateFieldGet(this, _Dropdown_onSelectCallback, "f")) === null || _a === void 0 ? void 0 : _a(this.dropdownSelector.selectedValues);
    }
    else {
        this.dismissModal();
        var value = this.dropdownSelector.selectedValue;
        if (value !== undefined) {
            ;
            (_b = __classPrivateFieldGet(this, _Dropdown_onSelectCallback, "f")) === null || _b === void 0 ? void 0 : _b(value);
        }
    }
    this.invalidateSize();
};
var DropdownSelector = /** @class */ (function (_super) {
    __extends(DropdownSelector, _super);
    function DropdownSelector(_a) {
        var _this = this;
        var choices = _a.choices, selected = _a.selected, multiple = _a.multiple, onSelect = _a.onSelect, viewProps = __rest(_a, ["choices", "selected", "multiple", "onSelect"]);
        _this = _super.call(this, __assign({}, viewProps)) || this;
        _DropdownSelector_instances.add(_this);
        _DropdownSelector_choices.set(_this, void 0);
        _DropdownSelector_selected.set(_this, void 0);
        _DropdownSelector_multiple.set(_this, void 0);
        _DropdownSelector_onSelect.set(_this, void 0);
        _DropdownSelector_scrollView.set(_this, void 0);
        _DropdownSelector_box.set(_this, new components_1.Box({ maxHeight: 24, border: BORDERS.below }));
        _DropdownSelector_checkbox.set(_this, void 0);
        __classPrivateFieldSet(_this, _DropdownSelector_choices, choices.map(function (_a) {
            var text = _a[0], value = _a[1];
            return [
                text.split('\n'),
                value,
                text,
            ];
        }), "f");
        __classPrivateFieldSet(_this, _DropdownSelector_selected, new Set(selected), "f");
        __classPrivateFieldSet(_this, _DropdownSelector_multiple, multiple, "f");
        __classPrivateFieldSet(_this, _DropdownSelector_onSelect, onSelect, "f");
        __classPrivateFieldSet(_this, _DropdownSelector_checkbox, new components_1.Checkbox({
            text: 'Select all',
            value: false,
            onChange: function (value) {
                if (value) {
                    __classPrivateFieldSet(_this, _DropdownSelector_selected, new Set(Array(__classPrivateFieldGet(_this, _DropdownSelector_choices, "f").length).keys()), "f");
                }
                else {
                    __classPrivateFieldSet(_this, _DropdownSelector_selected, new Set(), "f");
                }
                onSelect();
                __classPrivateFieldGet(_this, _DropdownSelector_scrollView, "f").invalidateAllRows('view');
            },
        }), "f");
        __classPrivateFieldSet(_this, _DropdownSelector_scrollView, new components_1.ScrollableList({
            items: __classPrivateFieldGet(_this, _DropdownSelector_choices, "f").map(function (_a) {
                var choice = _a[1];
                return choice;
            }),
            cellForItem: function (choice, row) { return _this.cellForItem(choice, row); },
        }), "f");
        var content = new components_1.Stack({ direction: 'down', children: [] });
        if (multiple) {
            content.add(__classPrivateFieldGet(_this, _DropdownSelector_checkbox, "f"));
        }
        content.add(__classPrivateFieldGet(_this, _DropdownSelector_scrollView, "f"));
        __classPrivateFieldGet(_this, _DropdownSelector_box, "f").add(content);
        _this.add(__classPrivateFieldGet(_this, _DropdownSelector_box, "f"));
        __classPrivateFieldGet(_this, _DropdownSelector_checkbox, "f").value = __classPrivateFieldGet(_this, _DropdownSelector_instances, "m", _DropdownSelector_isAllSelected).call(_this);
        return _this;
    }
    Object.defineProperty(DropdownSelector.prototype, "selectedRows", {
        get: function () {
            return __spreadArray([], __classPrivateFieldGet(this, _DropdownSelector_selected, "f"), true);
        },
        set: function (rows) {
            var _this = this;
            new Set(__spreadArray(__spreadArray([], __classPrivateFieldGet(this, _DropdownSelector_selected, "f"), true), rows, true)).forEach(function (selected) {
                var item = __classPrivateFieldGet(_this, _DropdownSelector_choices, "f")[selected][1];
                __classPrivateFieldGet(_this, _DropdownSelector_scrollView, "f").invalidateItem(item, 'view');
            });
            __classPrivateFieldSet(this, _DropdownSelector_selected, new Set(rows), "f");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DropdownSelector.prototype, "selectedText", {
        get: function () {
            var _this = this;
            if (__classPrivateFieldGet(this, _DropdownSelector_selected, "f").size === 0) {
                return undefined;
            }
            if (__classPrivateFieldGet(this, _DropdownSelector_selected, "f").size > 1) {
                var rows = __spreadArray([], __classPrivateFieldGet(this, _DropdownSelector_selected, "f"), true);
                rows.sort();
                // honestly, it's strange to use multiple lines in your dropdown choices...
                // but we support it! When multiple items are selected, the text becomes:
                // 1. join each line with a space
                // 2. join each entry with a comma
                // e.g. "Selected\n1", "Selected\n2" becomes "Selected 1, Selected 2"
                return [rows.map(function (index) { return __classPrivateFieldGet(_this, _DropdownSelector_choices, "f")[index][0].join(' '); }).join(', ')];
            }
            // if only one item is selected, make that the title, preserving multiple lines
            var row = __spreadArray([], __classPrivateFieldGet(this, _DropdownSelector_selected, "f"), true)[0];
            return __classPrivateFieldGet(this, _DropdownSelector_choices, "f")[row][0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DropdownSelector.prototype, "selectedValue", {
        get: function () {
            if (__classPrivateFieldGet(this, _DropdownSelector_selected, "f").size === 0) {
                return undefined;
            }
            var row = __spreadArray([], __classPrivateFieldGet(this, _DropdownSelector_selected, "f"), true)[0];
            return __classPrivateFieldGet(this, _DropdownSelector_choices, "f")[row][1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DropdownSelector.prototype, "selectedValues", {
        get: function () {
            var _this = this;
            return __spreadArray([], __classPrivateFieldGet(this, _DropdownSelector_selected, "f"), true).map(function (index) { return __classPrivateFieldGet(_this, _DropdownSelector_choices, "f")[index][1]; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DropdownSelector.prototype, "choices", {
        get: function () {
            return __classPrivateFieldGet(this, _DropdownSelector_choices, "f").map(function (_a) {
                var _ = _a[0], choice = _a[1], text = _a[2];
                return [text, choice];
            });
        },
        /**
         * Sets new choices, preserving the previously selected items.
         */
        set: function (choices) {
            var _this = this;
            var selected = __spreadArray([], __classPrivateFieldGet(this, _DropdownSelector_selected, "f"), true).map(function (index) { return __classPrivateFieldGet(_this, _DropdownSelector_choices, "f")[index][1]; });
            __classPrivateFieldSet(this, _DropdownSelector_choices, choices.map(function (_a) {
                var text = _a[0], choice = _a[1];
                return [
                    text.split('\n'),
                    choice,
                    text,
                ];
            }), "f");
            __classPrivateFieldSet(this, _DropdownSelector_selected, new Set(selected.flatMap(function (item) {
                var index = choices.findIndex(function (_a) {
                    var _ = _a[0], choice = _a[1];
                    return choice === item;
                });
                if (index === -1) {
                    return [];
                }
                return [index];
            })), "f");
            __classPrivateFieldGet(this, _DropdownSelector_scrollView, "f").updateItems(choices.map(function (_a) {
                var choice = _a[1];
                return choice;
            }));
        },
        enumerable: false,
        configurable: true
    });
    DropdownSelector.prototype.cellForItem = function (choice, row) {
        var button = __classPrivateFieldGet(this, _DropdownSelector_instances, "m", _DropdownSelector_cellButton).call(this, choice, row);
        return components_1.Stack.right({
            fill: false,
            children: [
                ['flex1', button],
                new components_1.Separator({ direction: 'vertical', border: 'single' }),
            ],
        });
    };
    DropdownSelector.prototype.render = function (viewport) {
        var _this = this;
        if (viewport.isEmpty) {
            return _super.prototype.render.call(this, viewport);
        }
        var naturalSize = this.naturalSize(viewport.contentSize).max(viewport.contentSize);
        var fitsBelow = viewport.parentRect.maxY() + naturalSize.height <
            viewport.contentSize.height;
        var fitsAbove = naturalSize.height <= viewport.parentRect.minY();
        // 1. doesn't fit above or below, pick the side that has more room
        // 2. prefer below
        // 3. otherwise above
        var placement;
        var height = naturalSize.height;
        if (!fitsBelow && !fitsAbove) {
            var spaceBelow = viewport.contentSize.height - viewport.parentRect.maxY() + 1;
            var spaceAbove = viewport.parentRect.minY() + 1;
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
        var width = Math.max(viewport.parentRect.size.width, Math.min(naturalSize.width, viewport.contentSize.width - viewport.parentRect.minX()));
        var x = Math.max(0, viewport.parentRect.maxX() - width, viewport.parentRect.minX());
        var y;
        if (placement === 'below') {
            y = viewport.parentRect.maxY();
        }
        else {
            y = viewport.parentRect.minY() - height;
        }
        __classPrivateFieldGet(this, _DropdownSelector_box, "f").border = BORDERS[placement];
        var rect = new geometry_1.Rect([x, y], [width, height]);
        viewport.clipped(rect, function (inside) { return _super.prototype.render.call(_this, inside); });
    };
    return DropdownSelector;
}(Container_1.Container));
_DropdownSelector_choices = new WeakMap(), _DropdownSelector_selected = new WeakMap(), _DropdownSelector_multiple = new WeakMap(), _DropdownSelector_onSelect = new WeakMap(), _DropdownSelector_scrollView = new WeakMap(), _DropdownSelector_box = new WeakMap(), _DropdownSelector_checkbox = new WeakMap(), _DropdownSelector_instances = new WeakSet(), _DropdownSelector_isAllSelected = function _DropdownSelector_isAllSelected() {
    return __classPrivateFieldGet(this, _DropdownSelector_selected, "f").size === __classPrivateFieldGet(this, _DropdownSelector_choices, "f").length;
}, _DropdownSelector_cellButton = function _DropdownSelector_cellButton(choice, row) {
    var _this = this;
    var lines = __classPrivateFieldGet(this, _DropdownSelector_choices, "f")[row][0];
    var isSelected = __spreadArray([], __classPrivateFieldGet(this, _DropdownSelector_selected, "f"), true).some(function (index) { return index === row; });
    return new components_1.Button({
        theme: isSelected ? 'selected' : undefined,
        border: 'none',
        align: 'left',
        child: new components_1.Text({
            lines: lines.map(function (line, index) {
                return dropdownPrefix(__classPrivateFieldGet(_this, _DropdownSelector_multiple, "f"), index, isSelected) + line;
            }),
        }),
        onClick: function () {
            __classPrivateFieldGet(_this, _DropdownSelector_selected, "f").forEach(function (selected) {
                var item = __classPrivateFieldGet(_this, _DropdownSelector_choices, "f")[selected][1];
                __classPrivateFieldGet(_this, _DropdownSelector_scrollView, "f").invalidateItem(item, 'view');
            });
            __classPrivateFieldGet(_this, _DropdownSelector_scrollView, "f").invalidateItem(choice, 'view');
            if (__classPrivateFieldGet(_this, _DropdownSelector_multiple, "f")) {
                if (__classPrivateFieldGet(_this, _DropdownSelector_selected, "f").has(row)) {
                    __classPrivateFieldGet(_this, _DropdownSelector_selected, "f").delete(row);
                }
                else {
                    __classPrivateFieldGet(_this, _DropdownSelector_selected, "f").add(row);
                }
            }
            else {
                __classPrivateFieldSet(_this, _DropdownSelector_selected, new Set([row]), "f");
            }
            __classPrivateFieldGet(_this, _DropdownSelector_checkbox, "f").value = __classPrivateFieldGet(_this, _DropdownSelector_instances, "m", _DropdownSelector_isAllSelected).call(_this);
            __classPrivateFieldGet(_this, _DropdownSelector_onSelect, "f").call(_this);
        },
    });
};
function dropdownSelectedRows(selected, choices, multiple) {
    var selectedItems;
    if (multiple) {
        selectedItems = selected;
    }
    else if (selected !== undefined) {
        selectedItems = [selected];
    }
    else {
        return [];
    }
    return selectedItems.flatMap(function (item) {
        var index = choices.findIndex(function (_a) {
            var _ = _a[0], choice = _a[1];
            return choice === item;
        });
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
var ARROWS = { hover: '▼', default: '▽', open: '◇' };
var BORDERS = {
    control: ['─', '│', '╭', '╮', '╰', '╯'],
    hover: ['─', '│', '╭', '╮', '╰', '╯', '─', '│'],
    below: ['─', '│', '╭', '╮', '╰', '╯', '─', '│'],
    above: ['─', '│', '╭', '╮', '╰', '╯', '─', '│'],
};
var BOX = {
    multiple: {
        unchecked: '☐ ',
        checked: '☑ ',
    },
    single: {
        unchecked: '◯ ',
        checked: '⦿ ',
    },
};
