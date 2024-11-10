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
var _Stack_instances, _Stack_direction, _Stack_gap, _Stack_fill, _Stack_sizes, _Stack_updateChildren, _Stack_update;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
var View_1 = require("../View");
var Container_1 = require("../Container");
var geometry_1 = require("../geometry");
var util_1 = require("../util");
function fromShorthand(props, direction, extraProps) {
    if (extraProps === void 0) { extraProps = {}; }
    if (Array.isArray(props)) {
        return __assign({ children: props, direction: direction }, extraProps);
    }
    else {
        return __assign(__assign(__assign({}, props), { direction: direction }), extraProps);
    }
}
var Stack = /** @class */ (function (_super) {
    __extends(Stack, _super);
    function Stack(_a) {
        var _this = this;
        var children = _a.children, child = _a.child, direction = _a.direction, fill = _a.fill, gap = _a.gap, viewProps = __rest(_a, ["children", "child", "direction", "fill", "gap"]);
        _this = _super.call(this, viewProps) || this;
        _Stack_instances.add(_this);
        _Stack_direction.set(_this, 'down');
        _Stack_gap.set(_this, 0);
        _Stack_fill.set(_this, true);
        _Stack_sizes.set(_this, new Map());
        (0, util_1.define)(_this, 'direction', { enumerable: true });
        (0, util_1.define)(_this, 'gap', { enumerable: true });
        __classPrivateFieldGet(_this, _Stack_instances, "m", _Stack_update).call(_this, { direction: direction, fill: fill, gap: gap });
        __classPrivateFieldGet(_this, _Stack_instances, "m", _Stack_updateChildren).call(_this, children, child);
        return _this;
    }
    Stack.down = function (props, extraProps) {
        if (props === void 0) { props = {}; }
        if (extraProps === void 0) { extraProps = {}; }
        var direction = 'down';
        return new Stack(fromShorthand(props, direction, extraProps));
    };
    Stack.up = function (props, extraProps) {
        if (props === void 0) { props = {}; }
        if (extraProps === void 0) { extraProps = {}; }
        var direction = 'up';
        return new Stack(fromShorthand(props, direction, extraProps));
    };
    Stack.right = function (props, extraProps) {
        if (props === void 0) { props = {}; }
        if (extraProps === void 0) { extraProps = {}; }
        var direction = 'right';
        return new Stack(fromShorthand(props, direction, extraProps));
    };
    Stack.left = function (props, extraProps) {
        if (props === void 0) { props = {}; }
        if (extraProps === void 0) { extraProps = {}; }
        var direction = 'left';
        return new Stack(fromShorthand(props, direction, extraProps));
    };
    Object.defineProperty(Stack.prototype, "direction", {
        get: function () {
            return __classPrivateFieldGet(this, _Stack_direction, "f");
        },
        set: function (value) {
            __classPrivateFieldSet(this, _Stack_direction, value, "f");
            this.invalidateSize();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stack.prototype, "gap", {
        get: function () {
            return __classPrivateFieldGet(this, _Stack_gap, "f");
        },
        set: function (value) {
            __classPrivateFieldSet(this, _Stack_gap, value, "f");
            this.invalidateSize();
        },
        enumerable: false,
        configurable: true
    });
    Stack.prototype.update = function (_a) {
        var children = _a.children, child = _a.child, props = __rest(_a, ["children", "child"]);
        __classPrivateFieldGet(this, _Stack_instances, "m", _Stack_update).call(this, props);
        __classPrivateFieldGet(this, _Stack_instances, "m", _Stack_updateChildren).call(this, children, child);
        _super.prototype.update.call(this, props);
    };
    Stack.prototype.naturalSize = function (available) {
        var size = geometry_1.Size.zero.mutableCopy();
        var remainingSize = available.mutableCopy();
        var hasFlex = false;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var childSize = child.naturalSize(remainingSize);
            if (!child.isVisible) {
                continue;
            }
            if (this.isVertical) {
                if (size.height) {
                    size.height += __classPrivateFieldGet(this, _Stack_gap, "f");
                }
                remainingSize.height = Math.max(0, remainingSize.height - childSize.height);
                size.width = Math.max(size.width, childSize.width);
                size.height += childSize.height;
            }
            else {
                if (size.width) {
                    size.width += __classPrivateFieldGet(this, _Stack_gap, "f");
                }
                remainingSize.width = Math.max(0, remainingSize.width - childSize.width);
                size.width += childSize.width;
                size.height = Math.max(size.height, childSize.height);
            }
            var flexSize = __classPrivateFieldGet(this, _Stack_sizes, "f").get(child);
            if (flexSize && flexSize !== 'natural') {
                hasFlex = true;
            }
        }
        if (hasFlex && __classPrivateFieldGet(this, _Stack_fill, "f")) {
            if (this.isVertical) {
                var height = Math.max(size.height, available.height);
                return new geometry_1.Size(size.width, height);
            }
            else {
                var width = Math.max(size.width, available.width);
                return new geometry_1.Size(width, size.height);
            }
        }
        return size;
    };
    Stack.prototype.add = function (child, at) {
        _super.prototype.add.call(this, child, at);
        __classPrivateFieldGet(this, _Stack_sizes, "f").set(child, child.flex);
    };
    Stack.prototype.addFlex = function (flexSize, child, at) {
        _super.prototype.add.call(this, child, at);
        __classPrivateFieldGet(this, _Stack_sizes, "f").set(child, flexSize);
    };
    Object.defineProperty(Stack.prototype, "isVertical", {
        get: function () {
            return __classPrivateFieldGet(this, _Stack_direction, "f") === 'down' || __classPrivateFieldGet(this, _Stack_direction, "f") === 'up';
        },
        enumerable: false,
        configurable: true
    });
    Stack.prototype.render = function (viewport) {
        var _a;
        if (viewport.isEmpty) {
            return _super.prototype.render.call(this, viewport);
        }
        var remainingSize = viewport.contentSize.mutableCopy();
        var flexTotal = 0;
        var flexCount = 0;
        // first pass, calculate all the naturalSizes and subtract them from the
        // contentSize - leftovers are divided to the flex views. naturalSizes might
        // as well be memoized along with the flex amounts
        var flexViews = [];
        for (var _i = 0, _b = this.children; _i < _b.length; _i++) {
            var child = _b[_i];
            if (!child.isVisible) {
                continue;
            }
            if (flexViews.length) {
                if (this.isVertical) {
                    remainingSize.height = Math.max(0, remainingSize.height - __classPrivateFieldGet(this, _Stack_gap, "f"));
                }
                else {
                    remainingSize.width = Math.max(0, remainingSize.width - __classPrivateFieldGet(this, _Stack_gap, "f"));
                }
            }
            var flexSize = (_a = __classPrivateFieldGet(this, _Stack_sizes, "f").get(child)) !== null && _a !== void 0 ? _a : 'natural';
            if (flexSize === 'natural') {
                var childSize = child.naturalSize(remainingSize);
                if (this.isVertical) {
                    flexViews.push(['natural', childSize.height, child]);
                    remainingSize.height -= childSize.height;
                }
                else {
                    flexViews.push(['natural', childSize.width, child]);
                    remainingSize.width -= childSize.width;
                }
                remainingSize.height = Math.max(0, remainingSize.height);
                remainingSize.width = Math.max(0, remainingSize.width);
            }
            else {
                flexTotal += flexSize;
                flexViews.push([flexSize, flexSize, child]);
                flexCount += 1;
            }
        }
        var origin;
        switch (__classPrivateFieldGet(this, _Stack_direction, "f")) {
            case 'right':
            case 'down':
                origin = geometry_1.Point.zero.mutableCopy();
                break;
            case 'left':
                origin = new geometry_1.Point(viewport.contentSize.width, 0);
                break;
            case 'up':
                origin = new geometry_1.Point(0, viewport.contentSize.height);
                break;
        }
        // stores the leftover rounding errors, and added to view once it exceeds 1
        var correctAmount = 0;
        // second pass, divide up the remainingSize to the flex views, subtracting off
        // of remainingSize. The last view receives any leftover height
        var totalRemainingSize = this.isVertical
            ? remainingSize.height
            : remainingSize.width;
        var remainingDimension = totalRemainingSize;
        var isFirst = true;
        var _loop_1 = function (flexSize, amount, child) {
            var childSize = viewport.contentSize.mutableCopy();
            if (!isFirst) {
                remainingDimension -= __classPrivateFieldGet(this_1, _Stack_gap, "f");
            }
            if (flexSize === 'natural') {
                if (this_1.isVertical) {
                    childSize.height = amount;
                }
                else {
                    childSize.width = amount;
                }
            }
            else {
                // rounding errors can compound, so we track the error and add it to subsequent
                // views; the last view receives the amount left in remainingSize (0..1)
                var size = (totalRemainingSize / flexTotal) * amount + correctAmount;
                correctAmount = size - ~~size;
                remainingDimension -= ~~size;
                // --flexCount === 0 checks for the last flex view
                if (--flexCount === 0) {
                    size += remainingDimension;
                }
                if (this_1.isVertical) {
                    childSize.height = ~~size;
                }
                else {
                    childSize.width = ~~size;
                }
            }
            if (__classPrivateFieldGet(this_1, _Stack_direction, "f") === 'left') {
                origin.x -= childSize.width;
            }
            else if (__classPrivateFieldGet(this_1, _Stack_direction, "f") === 'up') {
                origin.y -= childSize.height;
            }
            if (!isFirst) {
                if (__classPrivateFieldGet(this_1, _Stack_direction, "f") === 'right') {
                    origin.x += __classPrivateFieldGet(this_1, _Stack_gap, "f");
                }
                else if (__classPrivateFieldGet(this_1, _Stack_direction, "f") === 'down') {
                    origin.y += __classPrivateFieldGet(this_1, _Stack_gap, "f");
                }
            }
            viewport.clipped(new geometry_1.Rect(origin, childSize), function (inside) {
                child.render(inside);
            });
            if (!isFirst) {
                if (__classPrivateFieldGet(this_1, _Stack_direction, "f") === 'left') {
                    origin.x -= __classPrivateFieldGet(this_1, _Stack_gap, "f");
                }
                else if (__classPrivateFieldGet(this_1, _Stack_direction, "f") === 'up') {
                    origin.y -= __classPrivateFieldGet(this_1, _Stack_gap, "f");
                }
            }
            if (__classPrivateFieldGet(this_1, _Stack_direction, "f") === 'right') {
                origin.x += childSize.width;
            }
            else if (__classPrivateFieldGet(this_1, _Stack_direction, "f") === 'down') {
                origin.y += childSize.height;
            }
            isFirst = false;
        };
        var this_1 = this;
        for (var _c = 0, flexViews_1 = flexViews; _c < flexViews_1.length; _c++) {
            var _d = flexViews_1[_c], flexSize = _d[0], amount = _d[1], child = _d[2];
            _loop_1(flexSize, amount, child);
        }
    };
    return Stack;
}(Container_1.Container));
exports.Stack = Stack;
_Stack_direction = new WeakMap(), _Stack_gap = new WeakMap(), _Stack_fill = new WeakMap(), _Stack_sizes = new WeakMap(), _Stack_instances = new WeakSet(), _Stack_updateChildren = function _Stack_updateChildren(children, child) {
    // this logic comes from Container
    if (child !== undefined) {
        children = (children !== null && children !== void 0 ? children : []).concat([child]);
    }
    if (children === undefined) {
        return;
    }
    if (children.length) {
        var childrenSet = new Set(children);
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child_1 = _a[_i];
            if (!childrenSet.has(child_1)) {
                this.removeChild(child_1);
            }
        }
        for (var _b = 0, children_1 = children; _b < children_1.length; _b++) {
            var info = children_1[_b];
            var flexSize = void 0, child_2 = void 0;
            if (info instanceof View_1.View) {
                flexSize = info.flex;
                child_2 = info;
            }
            else {
                ;
                flexSize = info[0], child_2 = info[1];
                flexSize = (0, View_1.parseFlexShorthand)(flexSize);
            }
            this.addFlex(flexSize, child_2);
        }
    }
    else {
        this.removeAllChildren();
    }
}, _Stack_update = function _Stack_update(_a) {
    var direction = _a.direction, fill = _a.fill, gap = _a.gap;
    __classPrivateFieldSet(this, _Stack_direction, direction !== null && direction !== void 0 ? direction : 'down', "f");
    __classPrivateFieldSet(this, _Stack_fill, fill !== null && fill !== void 0 ? fill : true, "f");
    __classPrivateFieldSet(this, _Stack_gap, gap !== null && gap !== void 0 ? gap : 0, "f");
};
