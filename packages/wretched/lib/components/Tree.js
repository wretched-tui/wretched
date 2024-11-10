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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _Tree_instances, _Tree_titleView, _Tree_data, _Tree_getChildren, _Tree_render, _Tree_expanded, _Tree_itemViews, _Tree_viewPaths, _Tree_contentView, _Tree_update, _Tree_resetViews, _Tree_addViews, _Tree_isChildExpanded, _TreeChild_pathData, _TreeChild_hasChildren, _TreeChild_onToggle;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = void 0;
var Stack_1 = require("./Stack");
var Container_1 = require("../Container");
var geometry_1 = require("../geometry");
var events_1 = require("../events");
var Style_1 = require("../Style");
var TREE_BULLET_WIDTH = 4;
var Tree = /** @class */ (function (_super) {
    __extends(Tree, _super);
    function Tree(props) {
        var _this = _super.call(this, props) || this;
        _Tree_instances.add(_this);
        _Tree_titleView.set(_this, void 0);
        _Tree_data.set(_this, []);
        _Tree_getChildren.set(_this, function () { return []; });
        _Tree_render.set(_this, function () { return null; });
        _Tree_expanded.set(_this, new Set());
        _Tree_itemViews.set(_this, new Map());
        _Tree_viewPaths.set(_this, new Map());
        _Tree_contentView.set(_this, Stack_1.Stack.down());
        __classPrivateFieldGet(_this, _Tree_instances, "m", _Tree_update).call(_this, props);
        _this.add(__classPrivateFieldGet(_this, _Tree_contentView, "f"));
        return _this;
    }
    Tree.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Tree.prototype.naturalSize = function (available) {
        var titleSize = geometry_1.Size.zero;
        if (__classPrivateFieldGet(this, _Tree_titleView, "f")) {
            titleSize = __classPrivateFieldGet(this, _Tree_titleView, "f").naturalSize(available);
        }
        var remainingSize = available.shrink(0, titleSize.height);
        var contentSize = __classPrivateFieldGet(this, _Tree_contentView, "f").naturalSize(remainingSize);
        return new geometry_1.Size(Math.max(titleSize.width, contentSize.width), titleSize.height + contentSize.height);
    };
    Tree.prototype.render = function (viewport) {
        var _this = this;
        var _a;
        if (viewport.isEmpty) {
            return _super.prototype.render.call(this, viewport);
        }
        var titleView = __classPrivateFieldGet(this, _Tree_titleView, "f");
        var titleSize = (_a = titleView === null || titleView === void 0 ? void 0 : titleView.naturalSize(viewport.contentSize)) !== null && _a !== void 0 ? _a : geometry_1.Size.zero;
        if (titleView) {
            viewport.clipped(new geometry_1.Rect(geometry_1.Point.zero, titleSize), function (inside) {
                return titleView.render(inside);
            });
        }
        viewport.clipped(viewport.contentRect.inset({ top: titleSize.height }), function (inside) { return __classPrivateFieldGet(_this, _Tree_contentView, "f").render(inside); });
    };
    return Tree;
}(Container_1.Container));
exports.Tree = Tree;
_Tree_titleView = new WeakMap(), _Tree_data = new WeakMap(), _Tree_getChildren = new WeakMap(), _Tree_render = new WeakMap(), _Tree_expanded = new WeakMap(), _Tree_itemViews = new WeakMap(), _Tree_viewPaths = new WeakMap(), _Tree_contentView = new WeakMap(), _Tree_instances = new WeakSet(), _Tree_update = function _Tree_update(_a) {
    var _b;
    var titleView = _a.titleView, data = _a.data, render = _a.render, getChildren = _a.getChildren;
    if (titleView && titleView !== __classPrivateFieldGet(this, _Tree_titleView, "f")) {
        (_b = __classPrivateFieldGet(this, _Tree_titleView, "f")) === null || _b === void 0 ? void 0 : _b.removeFromParent();
        this.add(titleView);
        __classPrivateFieldSet(this, _Tree_titleView, titleView, "f");
    }
    __classPrivateFieldSet(this, _Tree_data, data, "f");
    __classPrivateFieldSet(this, _Tree_getChildren, getChildren !== null && getChildren !== void 0 ? getChildren : (function () { return []; }), "f");
    __classPrivateFieldSet(this, _Tree_render, render, "f");
    __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_resetViews).call(this);
}, _Tree_resetViews = function _Tree_resetViews() {
    var prevChildren = new Set(__spreadArray([], __classPrivateFieldGet(this, _Tree_itemViews, "f"), true).map(function (_a) {
        var child = _a[1];
        return child;
    }));
    __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_addViews).call(this, __classPrivateFieldGet(this, _Tree_data, "f"), prevChildren);
    for (var _i = 0, prevChildren_1 = prevChildren; _i < prevChildren_1.length; _i++) {
        var view = prevChildren_1[_i];
        view.removeFromParent();
    }
}, _Tree_addViews = function _Tree_addViews(data, prevChildren, count, pathPrefix, prevData) {
    var _this = this;
    if (count === void 0) { count = { current: 0 }; }
    if (pathPrefix === void 0) { pathPrefix = ''; }
    if (prevData === void 0) { prevData = []; }
    var _loop_1 = function (index) {
        var path = "".concat(pathPrefix, ".").concat(index);
        var datum = data[index];
        var isExpanded = __classPrivateFieldGet(this_1, _Tree_instances, "m", _Tree_isChildExpanded).call(this_1, path);
        var children = __classPrivateFieldGet(this_1, _Tree_getChildren, "f").call(this_1, datum, path);
        var hasChildren = children ? children.length > 0 : false;
        var isLast = index === data.length - 1;
        var currentPathData = {
            isLast: isLast,
            isExpanded: isExpanded,
            hasChildren: hasChildren,
        };
        var pathData = __spreadArray(__spreadArray([], prevData, true), [currentPathData], false);
        var view = __classPrivateFieldGet(this_1, _Tree_itemViews, "f").get(path);
        if (view) {
            view.pathData = pathData;
        }
        else {
            var itemView = __classPrivateFieldGet(this_1, _Tree_render, "f").call(this_1, datum, path);
            view = new TreeChild({
                view: itemView,
                pathData: pathData,
                onToggle: function () {
                    if (__classPrivateFieldGet(_this, _Tree_expanded, "f").has(path)) {
                        __classPrivateFieldGet(_this, _Tree_expanded, "f").delete(path);
                    }
                    else {
                        __classPrivateFieldGet(_this, _Tree_expanded, "f").add(path);
                    }
                    __classPrivateFieldGet(_this, _Tree_instances, "m", _Tree_resetViews).call(_this);
                    __classPrivateFieldGet(_this, _Tree_contentView, "f").invalidateSize();
                },
            });
            __classPrivateFieldGet(this_1, _Tree_itemViews, "f").set(path, view);
            __classPrivateFieldGet(this_1, _Tree_viewPaths, "f").set(view, path);
        }
        if (!view.parent) {
            __classPrivateFieldGet(this_1, _Tree_contentView, "f").add(view, count.current);
        }
        count.current += 1;
        prevChildren.delete(view);
        if (isExpanded && children) {
            __classPrivateFieldGet(this_1, _Tree_instances, "m", _Tree_addViews).call(this_1, children, prevChildren, count, path, pathData);
        }
    };
    var this_1 = this;
    for (var index = 0; index < data.length; index++) {
        _loop_1(index);
    }
}, _Tree_isChildExpanded = function _Tree_isChildExpanded(path) {
    return __classPrivateFieldGet(this, _Tree_expanded, "f").has(path);
};
var TreeChild = /** @class */ (function (_super) {
    __extends(TreeChild, _super);
    function TreeChild(_a) {
        var _this = this;
        var _b, _c;
        var pathData = _a.pathData, onToggle = _a.onToggle, props = __rest(_a, ["pathData", "onToggle"]);
        _this = _super.call(this, __assign(__assign({}, props), { child: props.view })) || this;
        _TreeChild_pathData.set(_this, []);
        _TreeChild_hasChildren.set(_this, false);
        _TreeChild_onToggle.set(_this, function () { });
        __classPrivateFieldSet(_this, _TreeChild_pathData, pathData, "f");
        __classPrivateFieldSet(_this, _TreeChild_hasChildren, (_c = (_b = pathData.at(-1)) === null || _b === void 0 ? void 0 : _b.hasChildren) !== null && _c !== void 0 ? _c : false, "f");
        __classPrivateFieldSet(_this, _TreeChild_onToggle, onToggle, "f");
        return _this;
    }
    TreeChild.prototype.receiveMouse = function (event, system) {
        _super.prototype.receiveMouse.call(this, event, system);
        if ((0, events_1.isMouseClicked)(event) && __classPrivateFieldGet(this, _TreeChild_hasChildren, "f")) {
            __classPrivateFieldGet(this, _TreeChild_onToggle, "f").call(this);
            this.invalidateSize();
        }
    };
    Object.defineProperty(TreeChild.prototype, "pathData", {
        set: function (value) {
            __classPrivateFieldSet(this, _TreeChild_pathData, value, "f");
            this.invalidateSize();
        },
        enumerable: false,
        configurable: true
    });
    TreeChild.prototype.naturalSize = function (available) {
        var size = _super.prototype.naturalSize.call(this, available).mutableCopy();
        size.width += TREE_BULLET_WIDTH * __classPrivateFieldGet(this, _TreeChild_pathData, "f").length;
        return size;
    };
    TreeChild.prototype.render = function (viewport) {
        var _this = this;
        if (viewport.isEmpty) {
            return _super.prototype.render.call(this, viewport);
        }
        if (__classPrivateFieldGet(this, _TreeChild_hasChildren, "f")) {
            viewport.registerMouse(['mouse.move', 'mouse.button.left']);
        }
        var treeSize = this.naturalSize(viewport.contentSize).shrink(TREE_BULLET_WIDTH * __classPrivateFieldGet(this, _TreeChild_pathData, "f").length, 0);
        var treeRect = new geometry_1.Rect(new geometry_1.Point(TREE_BULLET_WIDTH * __classPrivateFieldGet(this, _TreeChild_pathData, "f").length, 0), treeSize);
        var textStyle;
        if (this.isPressed || this.isHover) {
            textStyle = new Style_1.Style({ bold: true });
        }
        else {
            textStyle = Style_1.Style.NONE;
        }
        var firstLine = '', middleLine = '', lastLine = '';
        for (var index = 0; index < __classPrivateFieldGet(this, _TreeChild_pathData, "f").length; index++) {
            var _a = __classPrivateFieldGet(this, _TreeChild_pathData, "f")[index], hasChildren = _a.hasChildren, isExpanded = _a.isExpanded, isLast = _a.isLast;
            if (index === __classPrivateFieldGet(this, _TreeChild_pathData, "f").length - 1) {
                if (hasChildren) {
                    if (isLast) {
                        firstLine += '└';
                    }
                    else {
                        firstLine += '├';
                    }
                    if (isExpanded) {
                        if (this.isHover) {
                            firstLine += '─╴▾';
                        }
                        else if (this.isPressed) {
                            firstLine += '━╸▾';
                        }
                        else {
                            firstLine += '─╴▿';
                        }
                    }
                    else {
                        if (this.isHover) {
                            firstLine += '─╴▸';
                        }
                        else if (this.isPressed) {
                            firstLine += '━╸▸';
                        }
                        else {
                            firstLine += '─╴▹';
                        }
                    }
                }
                else {
                    if (isLast) {
                        firstLine += '└──╴';
                    }
                    else {
                        firstLine += '├──╴';
                    }
                }
                if (isLast) {
                    middleLine += '    ';
                    lastLine += '    ';
                }
                else {
                    middleLine += '│   ';
                    lastLine += '│   ';
                }
            }
            else if (isLast) {
                firstLine += '    ';
                middleLine += '    ';
                lastLine += '    ';
            }
            else {
                firstLine += '│   ';
                middleLine += '│   ';
                lastLine += '│   ';
            }
        }
        var origin = geometry_1.Point.zero;
        viewport.write(firstLine, origin, textStyle);
        for (var offsetY = 1; offsetY < treeSize.height - 1; offsetY++) {
            viewport.write(middleLine, origin.offset(0, offsetY));
        }
        if (treeSize.height > 1) {
            viewport.write(lastLine, origin.offset(0, treeSize.height - 1));
        }
        viewport.clipped(treeRect, function (inside) { return _super.prototype.render.call(_this, inside); });
    };
    return TreeChild;
}(Container_1.Container));
_TreeChild_pathData = new WeakMap(), _TreeChild_hasChildren = new WeakMap(), _TreeChild_onToggle = new WeakMap();
