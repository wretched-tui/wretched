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
var _Accordion_instances, _Accordion_multiple, _Accordion_update, _Accordion_sectionDidChange, _Section_instances, _Section_isOpen, _Section_currentViewHeight, _Section_actualViewHeight, _Section_titleView, _Section_update, _Section_currentSize;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accordion = void 0;
var Container_1 = require("../Container");
var geometry_1 = require("../geometry");
var Text_1 = require("./Text");
var events_1 = require("../events");
var Style_1 = require("../Style");
var util_1 = require("../util");
// accordion = new Accordion()
// accordion.addSection('title1', section1)
// accordion.addSection(new Text({text: 'title2', style: …}), section2)
//
// accordion = Accordion.create([
//   ['title1', section1],
//   ['title2', section2],
//   Accordion.Section('title3', section3),
// ])
//
// accordion.add(new Section()) // well behaved
// accordion.add(new View()) // undefined behaviour
var Accordion = /** @class */ (function (_super) {
    __extends(Accordion, _super);
    function Accordion(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _Accordion_instances.add(_this);
        _Accordion_multiple.set(_this, false);
        __classPrivateFieldGet(_this, _Accordion_instances, "m", _Accordion_update).call(_this, props);
        return _this;
    }
    Accordion.create = function (sections, extraProps) {
        if (extraProps === void 0) { extraProps = {}; }
        var accordion = new Accordion(extraProps);
        for (var _i = 0, sections_1 = sections; _i < sections_1.length; _i++) {
            var section = sections_1[_i];
            if (section instanceof Section) {
                accordion.addSection(section);
            }
            else {
                var _a = section, title = _a[0], view = _a[1];
                accordion.addSection(title, view);
            }
        }
        return accordion;
    };
    Accordion.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Accordion_instances, "m", _Accordion_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Object.defineProperty(Accordion.prototype, "sections", {
        get: function () {
            return this.children.filter(function (view) { return view instanceof Section; });
        },
        enumerable: false,
        configurable: true
    });
    Accordion.prototype.addSection = function (titleOrSection, view) {
        var sectionView;
        if (titleOrSection instanceof Section) {
            sectionView = titleOrSection;
        }
        else {
            sectionView = Section.create(titleOrSection, view);
        }
        this.add(sectionView);
    };
    Accordion.prototype.add = function (child, at) {
        if (child instanceof Section) {
            child.onClick = __classPrivateFieldGet(this, _Accordion_instances, "m", _Accordion_sectionDidChange).bind(this);
            if (!__classPrivateFieldGet(this, _Accordion_multiple, "f") && child.isOpen) {
                this.sections.forEach(function (section) { return (section.isOpen = false); });
            }
        }
        _super.prototype.add.call(this, child, at);
    };
    Accordion.prototype.naturalSize = function (available) {
        var remainingSize = available.mutableCopy();
        return this.sections.reduce(function (size, section) {
            var sectionSize = section.naturalSize(remainingSize);
            remainingSize.height = Math.max(0, remainingSize.height - sectionSize.height);
            return size.growHeight(sectionSize);
        }, geometry_1.Size.zero.mutableCopy());
    };
    Accordion.prototype.render = function (viewport) {
        var remainingSize = viewport.contentSize.mutableCopy();
        var y = 0;
        var _loop_1 = function (section) {
            if (y >= viewport.contentSize.height) {
                return "break";
            }
            var sectionSize = section.naturalSize(remainingSize);
            remainingSize.height -= sectionSize.height;
            viewport.clipped(new geometry_1.Rect([0, y], [remainingSize.width, sectionSize.height]), function (inner) {
                section.render(inner);
            });
            y += sectionSize.height;
        };
        for (var _i = 0, _a = this.sections; _i < _a.length; _i++) {
            var section = _a[_i];
            var state_1 = _loop_1(section);
            if (state_1 === "break")
                break;
        }
    };
    return Accordion;
}(Container_1.Container));
exports.Accordion = Accordion;
_Accordion_multiple = new WeakMap(), _Accordion_instances = new WeakSet(), _Accordion_update = function _Accordion_update(_a) {
    var multiple = _a.multiple;
    __classPrivateFieldSet(this, _Accordion_multiple, multiple !== null && multiple !== void 0 ? multiple : false, "f");
}, _Accordion_sectionDidChange = function _Accordion_sectionDidChange(toggleSection, isOpen) {
    if (__classPrivateFieldGet(this, _Accordion_multiple, "f") || !isOpen) {
        return;
    }
    for (var _i = 0, _a = this.sections; _i < _a.length; _i++) {
        var section = _a[_i];
        if (toggleSection === section) {
            continue;
        }
        section.close();
    }
};
var Section = /** @class */ (function (_super) {
    __extends(Section, _super);
    function Section(_a) {
        var _this = this;
        var title = _a.title, isOpen = _a.isOpen, props = __rest(_a, ["title", "isOpen"]);
        _this = _super.call(this, props) || this;
        _Section_instances.add(_this);
        _Section_isOpen.set(_this, false);
        _Section_currentViewHeight.set(_this, 0);
        _Section_actualViewHeight.set(_this, 0);
        _Section_titleView.set(_this, void 0);
        __classPrivateFieldSet(_this, _Section_isOpen, isOpen !== null && isOpen !== void 0 ? isOpen : false, "f");
        __classPrivateFieldSet(_this, _Section_titleView, new Text_1.Text({
            text: title !== null && title !== void 0 ? title : '',
            style: _this.titleStyle,
        }), "f");
        __classPrivateFieldGet(_this, _Section_instances, "m", _Section_update).call(_this, { isOpen: isOpen });
        _this.add(__classPrivateFieldGet(_this, _Section_titleView, "f"));
        (0, util_1.define)(_this, 'title', { enumerable: true });
        return _this;
    }
    Section.create = function (title, child, extraProps) {
        if (extraProps === void 0) { extraProps = {}; }
        return new Section(__assign({ title: title, child: child }, extraProps));
    };
    Object.defineProperty(Section.prototype, "title", {
        get: function () {
            return __classPrivateFieldGet(this, _Section_titleView, "f").text;
        },
        set: function (value) {
            __classPrivateFieldGet(this, _Section_titleView, "f").text = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Section.prototype, "isOpen", {
        get: function () {
            return __classPrivateFieldGet(this, _Section_isOpen, "f");
        },
        set: function (value) {
            var _a;
            if (__classPrivateFieldGet(this, _Section_isOpen, "f") === value) {
                return;
            }
            __classPrivateFieldSet(this, _Section_isOpen, value, "f");
            __classPrivateFieldGet(this, _Section_titleView, "f").style = this.titleStyle;
            (_a = this.onClick) === null || _a === void 0 ? void 0 : _a.call(this, this, value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Section.prototype, "titleStyle", {
        get: function () {
            return new Style_1.Style({ underline: true, bold: __classPrivateFieldGet(this, _Section_isOpen, "f") || this.isHover });
        },
        enumerable: false,
        configurable: true
    });
    Section.prototype.open = function () {
        this.isOpen = true;
    };
    Section.prototype.close = function () {
        this.isOpen = false;
    };
    Section.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Section_instances, "m", _Section_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Section.prototype.naturalSize = function (available) {
        var _this = this;
        // 4 => left margin, right space/arrow/space
        // 1 => bottom separator
        var collapsedSize = __classPrivateFieldGet(this, _Section_titleView, "f").naturalSize(available).grow(4, 1);
        var remainingSize = available.shrink(0, collapsedSize.height);
        // 1 => left margin (no right margin)
        var width = 0;
        var height = 0;
        var children = this.children.filter(function (child) { return child !== __classPrivateFieldGet(_this, _Section_titleView, "f"); });
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            if (!child.isVisible) {
                continue;
            }
            var naturalSize = child.naturalSize(remainingSize);
            width = Math.max(width, naturalSize.width);
            height = Math.max(height, naturalSize.height);
        }
        width += 1;
        var viewSize = new geometry_1.Size(width, height);
        return __classPrivateFieldGet(this, _Section_instances, "m", _Section_currentSize).call(this, collapsedSize, viewSize);
    };
    Section.prototype.receiveMouse = function (event, system) {
        var _a;
        _super.prototype.receiveMouse.call(this, event, system);
        if ((0, events_1.isMouseClicked)(event)) {
            __classPrivateFieldSet(this, _Section_isOpen, !__classPrivateFieldGet(this, _Section_isOpen, "f"), "f");
            (_a = this.onClick) === null || _a === void 0 ? void 0 : _a.call(this, this, __classPrivateFieldGet(this, _Section_isOpen, "f"));
        }
        __classPrivateFieldGet(this, _Section_titleView, "f").style = this.titleStyle;
    };
    Section.prototype.receiveTick = function (dt) {
        if (__classPrivateFieldGet(this, _Section_actualViewHeight, "f") === 0) {
            __classPrivateFieldSet(this, _Section_currentViewHeight, 0, "f");
            return false;
        }
        var amount = dt / 25;
        var nextHeight;
        if (__classPrivateFieldGet(this, _Section_isOpen, "f")) {
            nextHeight = Math.min(__classPrivateFieldGet(this, _Section_actualViewHeight, "f"), __classPrivateFieldGet(this, _Section_currentViewHeight, "f") + amount);
        }
        else {
            nextHeight = Math.max(0, __classPrivateFieldGet(this, _Section_currentViewHeight, "f") - amount);
        }
        __classPrivateFieldSet(this, _Section_currentViewHeight, nextHeight, "f");
        this.invalidateSize();
        return true;
    };
    Section.prototype.render = function (viewport) {
        var _this = this;
        if (__classPrivateFieldGet(this, _Section_currentViewHeight, "f") !== (__classPrivateFieldGet(this, _Section_isOpen, "f") ? __classPrivateFieldGet(this, _Section_actualViewHeight, "f") : 0)) {
            viewport.registerTick();
        }
        viewport.registerMouse(['mouse.button.left', 'mouse.move']);
        var textStyle = this.theme.text();
        var textSize = __classPrivateFieldGet(this, _Section_titleView, "f")
            .naturalSize(viewport.contentSize)
            .mutableCopy();
        textSize.width = Math.max(0, Math.min(viewport.contentSize.width - 4, textSize.width));
        viewport.clipped(geometry_1.Rect.zero.atX(1).withSize(viewport.contentSize.width, textSize.height), function (inner) {
            __classPrivateFieldGet(_this, _Section_titleView, "f").render(inner);
        });
        if (__classPrivateFieldGet(this, _Section_currentViewHeight, "f") > 0) {
            viewport.clipped(geometry_1.Rect.zero
                .atY(textSize.height)
                .withSize(viewport.contentSize.width, __classPrivateFieldGet(this, _Section_currentViewHeight, "f")), function (inner) {
                var children = _this.children.filter(function (child) { return child !== __classPrivateFieldGet(_this, _Section_titleView, "f"); });
                for (var _i = 0, children_2 = children; _i < children_2.length; _i++) {
                    var child = children_2[_i];
                    if (!child.isVisible) {
                        continue;
                    }
                    child.render(viewport);
                }
            });
        }
        viewport.clipped(geometry_1.Rect.zero
            .at(viewport.contentSize.width - 3, 0)
            .withSize(viewport.contentSize.width, 1), textStyle, function (inner) {
            if (__classPrivateFieldGet(_this, _Section_currentViewHeight, "f") !==
                (__classPrivateFieldGet(_this, _Section_isOpen, "f") ? __classPrivateFieldGet(_this, _Section_actualViewHeight, "f") : 0)) {
                var arrows = _this.isHover ? ARROWS.animateHover : ARROWS.animate;
                var index = Math.round((0, geometry_1.interpolate)(__classPrivateFieldGet(_this, _Section_currentViewHeight, "f"), [0, __classPrivateFieldGet(_this, _Section_actualViewHeight, "f")], [0, arrows.length - 1]));
                if (arrows[index]) {
                    inner.write(arrows[index], new geometry_1.Point(1, 0));
                }
            }
            else if (__classPrivateFieldGet(_this, _Section_isOpen, "f")) {
                inner.write(_this.isHover ? ARROWS.openHover : ARROWS.open, new geometry_1.Point(1, 0));
            }
            else {
                inner.write(_this.isHover ? ARROWS.closedHover : ARROWS.closed, new geometry_1.Point(1, 0));
            }
        });
        viewport.clipped(geometry_1.Rect.zero
            .at(0, viewport.contentSize.height - 1)
            .withSize(viewport.contentSize.width, 1), textStyle, function (inner) {
            inner.write(SEPARATOR.left, new geometry_1.Point(0, 0));
            if (inner.contentSize.width > 2) {
                var middle = SEPARATOR.middle.repeat(inner.contentSize.width - 2);
                inner.write(middle, new geometry_1.Point(1, 0));
            }
            inner.write(SEPARATOR.right, new geometry_1.Point(inner.contentSize.width - 1, 0));
        });
    };
    return Section;
}(Container_1.Container));
_Section_isOpen = new WeakMap(), _Section_currentViewHeight = new WeakMap(), _Section_actualViewHeight = new WeakMap(), _Section_titleView = new WeakMap(), _Section_instances = new WeakSet(), _Section_update = function _Section_update(_a) {
    var isOpen = _a.isOpen, onClick = _a.onClick;
    __classPrivateFieldSet(this, _Section_isOpen, isOpen !== null && isOpen !== void 0 ? isOpen : false, "f");
    this.onClick = onClick;
}, _Section_currentSize = function _Section_currentSize(collapsedSize, viewSize) {
    if (__classPrivateFieldGet(this, _Section_actualViewHeight, "f") === 0) {
        __classPrivateFieldSet(this, _Section_currentViewHeight, __classPrivateFieldGet(this, _Section_isOpen, "f") ? viewSize.height : 0, "f");
    }
    __classPrivateFieldSet(this, _Section_actualViewHeight, viewSize.height, "f");
    return new geometry_1.Size(Math.max(viewSize.width, collapsedSize.width), collapsedSize.height + Math.round(__classPrivateFieldGet(this, _Section_currentViewHeight, "f")));
};
Accordion.Section = Section;
var ARROWS = {
    open: '△',
    openHover: '▲',
    closed: '▽',
    closedHover: '▼',
    animate: ['▽', '◁', '△'],
    animateHover: ['▼', '◀︎', '▲'],
};
var SEPARATOR = { left: '╶', middle: '─', right: '╴' };
/* ▷▶︎ ◀︎◁ ▼▽ ▲△

 S͟e͟c͟t͟i͟o͟n͟ ͟1   ▽
╶─────────────╴
 S͟e͟c͟t͟i͟o͟n͟ ͟2   ▼  // hover
╶─────────────╴
 S͟e͟c͟t͟i͟o͟n͟ ͟3   △  // open
Content........
goes here......
╶─────────────╴
 S͟e͟c͟t͟i͟o͟n͟ ͟3   ▽   ◺ ◁ ◸ △ // animation
╶─────────────╴

*/
