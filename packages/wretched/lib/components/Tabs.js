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
var _Tabs_instances, _Tabs_selectedTab, _Tabs_separatorLocation, _Tabs_separatorWidths, _Tabs_border, _Tabs_update, _Tabs_selected, _Tabs_renderBorder, _Tabs_renderSeparator, _TabTitle_textView;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tabs = void 0;
var Container_1 = require("../Container");
var geometry_1 = require("../geometry");
var Style_1 = require("../Style");
var Text_1 = require("./Text");
var events_1 = require("../events");
var util_1 = require("../util");
// tabs = new Tabs()
// tabs.addTab('title', tab)
// tabs.addTab(new Text({text: 'title', style: …}), tab)
//
// tabs.add()
var Tabs = /** @class */ (function (_super) {
    __extends(Tabs, _super);
    function Tabs(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _Tabs_instances.add(_this);
        _Tabs_selectedTab.set(_this, 0);
        _Tabs_separatorLocation.set(_this, void 0);
        _Tabs_separatorWidths.set(_this, []);
        _Tabs_border.set(_this, false);
        __classPrivateFieldGet(_this, _Tabs_instances, "m", _Tabs_update).call(_this, props);
        return _this;
    }
    Tabs.create = function (tabs, extraProps) {
        if (extraProps === void 0) { extraProps = {}; }
        var tabsView = new Tabs(extraProps);
        for (var _i = 0, tabs_1 = tabs; _i < tabs_1.length; _i++) {
            var tab = tabs_1[_i];
            if (tab instanceof Section) {
                tabsView.addTab(tab);
            }
            else {
                var _a = tab, title = _a[0], view = _a[1];
                tabsView.addTab(title, view);
            }
        }
        return tabsView;
    };
    Object.defineProperty(Tabs.prototype, "tabs", {
        get: function () {
            return this.children.filter(function (view) { return view instanceof Section; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tabs.prototype, "tabTitles", {
        get: function () {
            return this.children.filter(function (view) { return view instanceof TabTitle; });
        },
        enumerable: false,
        configurable: true
    });
    Tabs.prototype.update = function (props) {
        _super.prototype.update.call(this, props);
        __classPrivateFieldGet(this, _Tabs_instances, "m", _Tabs_update).call(this, props);
    };
    Tabs.prototype.addTab = function (titleOrTab, child) {
        var tabView;
        if (titleOrTab instanceof Section) {
            tabView = titleOrTab;
        }
        else {
            tabView = Section.create(titleOrTab, child);
        }
        this.add(tabView);
    };
    Tabs.prototype.add = function (child, at) {
        var _this = this;
        if (child instanceof Section) {
            child.titleView.onClick = function (tab) { return __classPrivateFieldGet(_this, _Tabs_instances, "m", _Tabs_selected).call(_this, tab); };
            _super.prototype.add.call(this, child.titleView);
        }
        _super.prototype.add.call(this, child, at);
    };
    Tabs.prototype.removeChild = function (child) {
        if (child instanceof Section && child.titleView) {
            _super.prototype.removeChild.call(this, child.titleView);
        }
        _super.prototype.removeChild.call(this, child);
    };
    Tabs.prototype.naturalSize = function (available) {
        var remainingSize = available.mutableCopy();
        var tabTitleSize = this.tabTitles.reduce(function (size, tab, index) {
            var tabSize = tab.naturalSize(remainingSize).mutableCopy();
            size.width += tabSize.width;
            size.height = Math.max(size.height, tabSize.height);
            remainingSize.width = Math.max(0, remainingSize.width - tabSize.width);
            return size;
        }, geometry_1.Size.zero.mutableCopy());
        var childSize = geometry_1.Size.zero.mutableCopy();
        var availableChildSize = available.shrink(0, tabTitleSize.height);
        for (var _i = 0, _a = this.tabs; _i < _a.length; _i++) {
            var tab = _a[_i];
            var tabSize = tab.naturalSize(availableChildSize);
            childSize.width = Math.max(childSize.width, tabSize.width);
            childSize.height = Math.max(childSize.height, tabSize.height);
        }
        return new geometry_1.Size(Math.max(tabTitleSize.width, childSize.width) + (__classPrivateFieldGet(this, _Tabs_border, "f") ? 3 : 0), tabTitleSize.height + childSize.height + (__classPrivateFieldGet(this, _Tabs_border, "f") ? 1 : 0));
    };
    Tabs.prototype.receiveTick = function (dt) {
        var _this = this;
        if (__classPrivateFieldGet(this, _Tabs_separatorLocation, "f") === undefined ||
            __classPrivateFieldGet(this, _Tabs_selectedTab, "f") >= __classPrivateFieldGet(this, _Tabs_separatorWidths, "f").length) {
            return false;
        }
        var _a = __classPrivateFieldGet(this, _Tabs_separatorWidths, "f").reduce(function (_a, width, index) {
            var start = _a[0], stop = _a[1], prev = _a[2];
            return index === __classPrivateFieldGet(_this, _Tabs_selectedTab, "f")
                ? [start, stop + width, 0]
                : index > __classPrivateFieldGet(_this, _Tabs_selectedTab, "f")
                    ? [start, stop, 0]
                    : [start + width, stop + width, width];
        }, [0, 0, 0]), start = _a[0], stop = _a[1];
        var dx = dt / 20;
        if (start < __classPrivateFieldGet(this, _Tabs_separatorLocation, "f")[0]) {
            __classPrivateFieldGet(this, _Tabs_separatorLocation, "f")[0] = Math.max(start, __classPrivateFieldGet(this, _Tabs_separatorLocation, "f")[0] - dx);
        }
        else if (start > __classPrivateFieldGet(this, _Tabs_separatorLocation, "f")[0]) {
            __classPrivateFieldGet(this, _Tabs_separatorLocation, "f")[0] = Math.min(start, __classPrivateFieldGet(this, _Tabs_separatorLocation, "f")[0] + dx);
        }
        if (stop > __classPrivateFieldGet(this, _Tabs_separatorLocation, "f")[1]) {
            __classPrivateFieldGet(this, _Tabs_separatorLocation, "f")[1] = Math.min(stop, __classPrivateFieldGet(this, _Tabs_separatorLocation, "f")[1] + dx);
        }
        else if (stop < __classPrivateFieldGet(this, _Tabs_separatorLocation, "f")[1]) {
            __classPrivateFieldGet(this, _Tabs_separatorLocation, "f")[1] = Math.max(stop, __classPrivateFieldGet(this, _Tabs_separatorLocation, "f")[1] - dx);
        }
        else {
            return false;
        }
        if (__classPrivateFieldGet(this, _Tabs_separatorLocation, "f")[1] <= __classPrivateFieldGet(this, _Tabs_separatorLocation, "f")[0] + 1) {
            __classPrivateFieldGet(this, _Tabs_separatorLocation, "f")[1] = Math.min(stop, __classPrivateFieldGet(this, _Tabs_separatorLocation, "f")[0] + 1);
        }
        return true;
    };
    Tabs.prototype.render = function (viewport) {
        var _this = this;
        viewport.registerTick();
        var remainingSize = viewport.contentSize.mutableCopy();
        var tabInfo = [];
        var separatorWidths = [];
        var x = __classPrivateFieldGet(this, _Tabs_border, "f") ? 2 : 0, tabHeight = 0;
        this.tabTitles.forEach(function (tab, index) {
            var tabRect = new geometry_1.Rect(new geometry_1.Point(x, 0), tab.naturalSize(remainingSize));
            tabInfo.push([tabRect, tab]);
            remainingSize.width -= tabRect.size.width;
            if (__classPrivateFieldGet(_this, _Tabs_separatorLocation, "f") === undefined &&
                __classPrivateFieldGet(_this, _Tabs_selectedTab, "f") === index) {
                __classPrivateFieldSet(_this, _Tabs_separatorLocation, [x, x + tabRect.size.width], "f");
            }
            x += tabRect.size.width;
            tabHeight = Math.max(tabHeight, tabRect.size.height - TAB_SEPARATOR_HEIGHT);
            separatorWidths.push(tabRect.size.width);
        });
        __classPrivateFieldSet(this, _Tabs_selectedTab, Math.min(separatorWidths.length - 1, __classPrivateFieldGet(this, _Tabs_selectedTab, "f")), "f");
        __classPrivateFieldSet(this, _Tabs_separatorWidths, separatorWidths, "f");
        if (__classPrivateFieldGet(this, _Tabs_separatorLocation, "f")) {
            __classPrivateFieldGet(this, _Tabs_instances, "m", _Tabs_renderSeparator).call(this, viewport, tabHeight, separatorWidths, __classPrivateFieldGet(this, _Tabs_separatorLocation, "f"));
        }
        if (__classPrivateFieldGet(this, _Tabs_border, "f")) {
            var borderRect = viewport.contentRect.inset(tabHeight + TAB_SEPARATOR_HEIGHT - 1, 0, 0);
            viewport.clipped(borderRect, function (inner) {
                return __classPrivateFieldGet(_this, _Tabs_instances, "m", _Tabs_renderBorder).call(_this, inner, __classPrivateFieldGet(_this, _Tabs_separatorWidths, "f"));
            });
        }
        tabInfo.forEach(function (_a) {
            var tabRect = _a[0], tab = _a[1];
            viewport.clipped(tabRect, function (inner) { return tab.render(inner); });
        });
        var selectedTab = this.tabs.at(__classPrivateFieldGet(this, _Tabs_selectedTab, "f"));
        if (selectedTab) {
            var childRect = viewport.contentRect.inset(tabHeight + TAB_SEPARATOR_HEIGHT, __classPrivateFieldGet(this, _Tabs_border, "f") ? 1 : 0, __classPrivateFieldGet(this, _Tabs_border, "f") ? 1 : 0);
            viewport.clipped(childRect, function (inner) {
                selectedTab.render(inner);
            });
        }
    };
    return Tabs;
}(Container_1.Container));
exports.Tabs = Tabs;
_Tabs_selectedTab = new WeakMap(), _Tabs_separatorLocation = new WeakMap(), _Tabs_separatorWidths = new WeakMap(), _Tabs_border = new WeakMap(), _Tabs_instances = new WeakSet(), _Tabs_update = function _Tabs_update(_a) {
    var border = _a.border;
    __classPrivateFieldSet(this, _Tabs_border, border !== null && border !== void 0 ? border : true, "f");
}, _Tabs_selected = function _Tabs_selected(tab) {
    var tabTitles = this.tabTitles;
    var index = tabTitles.indexOf(tab);
    if (index === -1) {
        return;
    }
    __classPrivateFieldSet(this, _Tabs_selectedTab, index, "f");
}, _Tabs_renderBorder = function _Tabs_renderBorder(viewport, separatorWidths) {
    var totalWidth = separatorWidths.reduce(function (a, b) { return a + b; }, 2);
    for (var x = viewport.contentSize.width - 2; x > 0; x--) {
        if (x === totalWidth) {
            viewport.write('╶', new geometry_1.Point(x, 0));
        }
        else if (x > totalWidth) {
            viewport.write('─', new geometry_1.Point(x, 0));
        }
        viewport.write('─', new geometry_1.Point(x, viewport.contentSize.height - 1));
    }
    for (var y = viewport.contentSize.height - 2; y > 0; y--) {
        viewport.write('│', new geometry_1.Point(0, y));
        viewport.write('│', new geometry_1.Point(viewport.contentSize.width - 1, y));
    }
    viewport.write('┌╴', new geometry_1.Point(0, 0));
    viewport.write('┐', new geometry_1.Point(viewport.contentSize.width - 1, 0));
    viewport.write('└', new geometry_1.Point(0, viewport.contentSize.height - 1));
    viewport.write('┘', new geometry_1.Point(viewport.contentSize.width - 1, viewport.contentSize.height - 1));
}, _Tabs_renderSeparator = function _Tabs_renderSeparator(viewport, tabHeight, separatorWidths, separatorLocation) {
    var _this = this;
    // separatorLocation is rounded down in this function
    var xLeft = __classPrivateFieldGet(this, _Tabs_border, "f") ? 2 : 0, xRight = 0, didDrawSeparator = false;
    var _a = [
        ~~separatorLocation[0] + xLeft,
        ~~separatorLocation[1] + xLeft,
    ], separatorStart = _a[0], separatorStop = _a[1];
    separatorWidths.forEach(function (separatorWidth, index) {
        var _a;
        var tab = _this.tabs.at(index);
        var isHover = (_a = tab === null || tab === void 0 ? void 0 : tab.isHover) !== null && _a !== void 0 ? _a : false;
        xRight = xLeft + separatorWidth;
        var underline;
        if (xLeft >= separatorStart && xLeft <= separatorStop) {
            var xMid = Math.min(separatorStop, xRight);
            var u1 = '━'.repeat(xMid - xLeft);
            var u2 = dashesLeft(xRight - separatorStop, isHover);
            underline = u1 + u2;
            didDrawSeparator = false;
        }
        else if (xRight >= separatorStart && xLeft < separatorStop) {
            var xMid = Math.min(separatorStop, xRight);
            var u0 = dashesRight(separatorStart - xLeft, isHover);
            var u1 = '━'.repeat(xMid - separatorStart);
            var u2 = dashesLeft(xRight - separatorStop, isHover);
            underline = u0 + u1 + u2;
            didDrawSeparator = xRight > separatorStop;
        }
        else if (didDrawSeparator) {
            underline = dashesLeft(separatorWidth, isHover);
            didDrawSeparator = false;
        }
        else if (xRight === separatorStart) {
            underline = dashesRight(separatorWidth, isHover);
        }
        else {
            underline = dashes(separatorWidth, isHover);
        }
        viewport.write(underline, new geometry_1.Point(xLeft, tabHeight));
        xLeft += separatorWidth;
    });
};
var TabTitle = /** @class */ (function (_super) {
    __extends(TabTitle, _super);
    function TabTitle(title) {
        var _this = _super.call(this, {}) || this;
        _TabTitle_textView.set(_this, void 0);
        __classPrivateFieldSet(_this, _TabTitle_textView, new Text_1.Text({
            text: title !== null && title !== void 0 ? title : '',
            style: _this.titleStyle,
        }), "f");
        _this.add(__classPrivateFieldGet(_this, _TabTitle_textView, "f"));
        return _this;
    }
    Object.defineProperty(TabTitle.prototype, "title", {
        get: function () {
            return __classPrivateFieldGet(this, _TabTitle_textView, "f").text;
        },
        set: function (value) {
            __classPrivateFieldGet(this, _TabTitle_textView, "f").text = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TabTitle.prototype, "titleStyle", {
        get: function () {
            return new Style_1.Style({ bold: this.isHover });
        },
        enumerable: false,
        configurable: true
    });
    TabTitle.prototype.naturalSize = function (available) {
        return __classPrivateFieldGet(this, _TabTitle_textView, "f")
            .naturalSize(available)
            .grow(TAB_TITLE_PAD, TAB_SEPARATOR_HEIGHT);
    };
    TabTitle.prototype.receiveMouse = function (event, system) {
        var _a;
        _super.prototype.receiveMouse.call(this, event, system);
        if ((0, events_1.isMouseClicked)(event)) {
            (_a = this.onClick) === null || _a === void 0 ? void 0 : _a.call(this, this);
        }
        __classPrivateFieldGet(this, _TabTitle_textView, "f").style = this.titleStyle;
    };
    TabTitle.prototype.render = function (viewport) {
        var _this = this;
        viewport.registerMouse(['mouse.button.left', 'mouse.move']);
        viewport.clipped(new geometry_1.Rect([1, 0], viewport.contentSize.shrink(TAB_TITLE_PAD, 0)), function (inner) {
            __classPrivateFieldGet(_this, _TabTitle_textView, "f").render(inner);
        });
    };
    return TabTitle;
}(Container_1.Container));
_TabTitle_textView = new WeakMap();
var Section = /** @class */ (function (_super) {
    __extends(Section, _super);
    function Section(_a) {
        var _this = this;
        var title = _a.title, props = __rest(_a, ["title"]);
        _this = _super.call(this, props) || this;
        _this.titleView = new TabTitle('');
        _this.titleView.title = title !== null && title !== void 0 ? title : '';
        (0, util_1.define)(_this, 'title', { enumerable: true });
        return _this;
    }
    Section.create = function (title, child, extraProps) {
        if (extraProps === void 0) { extraProps = {}; }
        return new Section(__assign({ title: title, child: child }, extraProps));
    };
    Object.defineProperty(Section.prototype, "title", {
        get: function () {
            return this.titleView.title;
        },
        set: function (value) {
            this.titleView.title = value;
        },
        enumerable: false,
        configurable: true
    });
    return Section;
}(Container_1.Container));
function dashesLeft(w, isHover) {
    if (w <= 0) {
        return '';
    }
    return (isHover ? '╺' : '╶') + dashes(w - 1, isHover);
}
function dashesRight(w, isHover) {
    if (w <= 0) {
        return '';
    }
    return dashes(w - 1, isHover) + (isHover ? '╸' : '╴');
}
function dashes(w, isHover) {
    if (w <= 0) {
        return '';
    }
    return (isHover ? '━' : '─').repeat(w);
}
Tabs.Section = Section;
var TAB_TITLE_PAD = 2;
var TAB_SEPARATOR_HEIGHT = 1;
