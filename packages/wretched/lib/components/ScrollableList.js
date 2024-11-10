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
var _ScrollableList_instances, _ScrollableList_items, _ScrollableList_cellForItem, _ScrollableList_keepAtBottom, _ScrollableList_isAtBottom, _ScrollableList_showScrollbars, _ScrollableList_scrollHeight, _ScrollableList_contentOffset, _ScrollableList_maxWidth, _ScrollableList_viewCache, _ScrollableList_sizeCache, _ScrollableList_totalHeight, _ScrollableList_update, _ScrollableList_checkScrollDown, _ScrollableList_scrollDownToNextRow, _ScrollableList_scrollUpToPrevRow;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollableList = void 0;
var Container_1 = require("../Container");
var Style_1 = require("../Style");
var geometry_1 = require("../geometry");
var events_1 = require("../events");
var ScrollableList = /** @class */ (function (_super) {
    __extends(ScrollableList, _super);
    function ScrollableList(_a) {
        var _this = this;
        var cellForItem = _a.cellForItem, items = _a.items, keepAtBottom = _a.keepAtBottom, scrollHeight = _a.scrollHeight, showScrollbars = _a.showScrollbars, viewProps = __rest(_a, ["cellForItem", "items", "keepAtBottom", "scrollHeight", "showScrollbars"]);
        _this = _super.call(this, viewProps) || this;
        _ScrollableList_instances.add(_this);
        /**
         * Your function here need not return "stable" views; the views returned by this
         * function will be cached until you call `scrollableList.invalidateCache()` or
         * `scrollableList.invalidateRow(row)`.
         */
        _ScrollableList_items.set(_this, void 0);
        _ScrollableList_cellForItem.set(_this, void 0);
        _ScrollableList_keepAtBottom.set(_this, void 0);
        _ScrollableList_isAtBottom.set(_this, true);
        _ScrollableList_showScrollbars.set(_this, void 0);
        _ScrollableList_scrollHeight.set(_this, void 0);
        _ScrollableList_contentOffset.set(_this, void 0);
        _ScrollableList_maxWidth.set(_this, 0);
        _ScrollableList_viewCache.set(_this, new Map());
        _ScrollableList_sizeCache.set(_this, new Map());
        _ScrollableList_totalHeight.set(_this, void 0);
        __classPrivateFieldSet(_this, _ScrollableList_showScrollbars, showScrollbars !== null && showScrollbars !== void 0 ? showScrollbars : true, "f");
        __classPrivateFieldSet(_this, _ScrollableList_contentOffset, { row: 0, offset: 0 }, "f");
        __classPrivateFieldSet(_this, _ScrollableList_cellForItem, cellForItem, "f");
        __classPrivateFieldSet(_this, _ScrollableList_scrollHeight, scrollHeight !== null && scrollHeight !== void 0 ? scrollHeight : 1, "f");
        __classPrivateFieldSet(_this, _ScrollableList_items, items, "f");
        __classPrivateFieldSet(_this, _ScrollableList_keepAtBottom, keepAtBottom !== null && keepAtBottom !== void 0 ? keepAtBottom : false, "f");
        return _this;
    }
    ScrollableList.prototype.update = function (props) {
        __classPrivateFieldGet(this, _ScrollableList_instances, "m", _ScrollableList_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    ScrollableList.prototype.naturalSize = function (available) {
        var _a = __classPrivateFieldGet(this, _ScrollableList_contentOffset, "f"), row = _a.row, y = _a.offset;
        var scrollWidth = __classPrivateFieldGet(this, _ScrollableList_showScrollbars, "f") ? 1 : 0;
        while (y < available.height) {
            var view = this.viewForRow(row);
            if (!view) {
                break;
            }
            var rowSize = this.sizeForRow(row, available.width - scrollWidth, view);
            // persist #maxWidth so that the largest row _remains_ the largest row even
            // after it scrolls out of the visible window
            __classPrivateFieldSet(this, _ScrollableList_maxWidth, Math.max(__classPrivateFieldGet(this, _ScrollableList_maxWidth, "f"), rowSize.width), "f");
            y += rowSize.height;
            row += 1;
        }
        return new geometry_1.Size(__classPrivateFieldGet(this, _ScrollableList_maxWidth, "f") + scrollWidth, available.height);
    };
    /**
     * Tells ScrollableList to re-fetch all rows.
     */
    ScrollableList.prototype.invalidate = function () {
        __classPrivateFieldSet(this, _ScrollableList_maxWidth, 0, "f");
        this.invalidateAllRows('view');
        _super.prototype.invalidateSize.call(this);
    };
    /**
     * Tells ScrollableList to re-fetch the visible rows.
     * @param forCache: 'size' | 'view' representing which cache to invalidate
     */
    ScrollableList.prototype.invalidateAllRows = function (forCache) {
        if (forCache === 'view') {
            __classPrivateFieldSet(this, _ScrollableList_viewCache, new Map(), "f");
        }
        __classPrivateFieldSet(this, _ScrollableList_sizeCache, new Map(), "f");
    };
    /**
     * Tells ScrollableList to refetch a specific row
     * @param row: the row to invalidate
     * @param forCache: 'size' | 'view'   representing which cache to invalidate
     */
    ScrollableList.prototype.invalidateItem = function (item, forCache) {
        if (forCache === 'view') {
            __classPrivateFieldGet(this, _ScrollableList_viewCache, "f").delete(item);
        }
        __classPrivateFieldGet(this, _ScrollableList_sizeCache, "f").delete(item);
    };
    ScrollableList.prototype.invalidateSize = function () {
        __classPrivateFieldSet(this, _ScrollableList_maxWidth, 0, "f");
        this.invalidateAllRows('size');
        _super.prototype.invalidateSize.call(this);
    };
    ScrollableList.prototype.receiveMouse = function (event) {
        var _a;
        if (event.name === 'mouse.wheel.up') {
            this.scrollBy(__classPrivateFieldGet(this, _ScrollableList_scrollHeight, "f") * -1);
        }
        else if (event.name === 'mouse.wheel.down') {
            this.scrollBy(__classPrivateFieldGet(this, _ScrollableList_scrollHeight, "f"));
        }
        else if ((0, events_1.isMouseDragging)(event) && __classPrivateFieldGet(this, _ScrollableList_totalHeight, "f")) {
            if (__classPrivateFieldGet(this, _ScrollableList_totalHeight, "f") <= this.contentSize.height) {
                __classPrivateFieldSet(this, _ScrollableList_contentOffset, { row: 0, offset: 0 }, "f");
                return;
            }
            var maxY = __classPrivateFieldGet(this, _ScrollableList_totalHeight, "f") - this.contentSize.height;
            var heightY = Math.round((0, geometry_1.interpolate)(Math.max(0, Math.min(this.contentSize.height - 1, event.position.y)), [0, this.contentSize.height - 1], [0, maxY]));
            __classPrivateFieldSet(this, _ScrollableList_isAtBottom, heightY === maxY, "f");
            var cellWidth = this.contentSize.width;
            for (var row = 0, y = 0; row < __classPrivateFieldGet(this, _ScrollableList_items, "f").length; row++) {
                var rowHeight = (_a = this.sizeForRow(row, cellWidth)) === null || _a === void 0 ? void 0 : _a.height;
                if (rowHeight === undefined) {
                    break;
                }
                if (y + rowHeight >= heightY) {
                    __classPrivateFieldSet(this, _ScrollableList_contentOffset, { row: row, offset: y - heightY }, "f");
                    return;
                }
                y += rowHeight;
            }
        }
    };
    /**
     * Moves the visible region. The visible region is stored as a pointer to the
     * top-most row and an offset from the top of that row (see `interface ContentOffset`)
     *
     * Positive offset scrolls *down* (currentOffset goes more negative)
     *
     * When current cell is entirely above the top, we set the `contentOffset` to the
     * row that is at the top of the screen and still visible, similarly if the current
     * cell is below the top, we fetch enough rows about and update the `contentOffset`
     * to point to the top-most row.
     */
    ScrollableList.prototype.scrollBy = function (offset) {
        var _a;
        if (offset === 0) {
            return;
        }
        this.invalidateSize();
        var _b = __classPrivateFieldGet(this, _ScrollableList_contentOffset, "f"), row = _b.row, currentOffset = _b.offset;
        var height = (_a = this.sizeForRow(row, this.contentSize.width)) === null || _a === void 0 ? void 0 : _a.height;
        if (height === undefined) {
            __classPrivateFieldSet(this, _ScrollableList_contentOffset, { row: 0, offset: 0 }, "f");
            return;
        }
        // prevent scrolling if there is no more content
        if (offset > 0) {
            var doScroll = __classPrivateFieldGet(this, _ScrollableList_instances, "m", _ScrollableList_checkScrollDown).call(this, row, currentOffset, height);
            if (!doScroll) {
                __classPrivateFieldSet(this, _ScrollableList_isAtBottom, true, "f");
                return;
            }
        }
        else if (row === 0 && currentOffset >= 0) {
            // no helper function necessary here - if offset < 0, do not scroll if we are
            // already at the top
            return;
        }
        __classPrivateFieldSet(this, _ScrollableList_isAtBottom, false, "f");
        var nextOffset = currentOffset - offset;
        if (nextOffset <= -height) {
            __classPrivateFieldSet(this, _ScrollableList_contentOffset, __classPrivateFieldGet(this, _ScrollableList_instances, "m", _ScrollableList_scrollDownToNextRow).call(this, row, nextOffset, height), "f");
        }
        else if (nextOffset > 0) {
            __classPrivateFieldSet(this, _ScrollableList_contentOffset, __classPrivateFieldGet(this, _ScrollableList_instances, "m", _ScrollableList_scrollUpToPrevRow).call(this, row, nextOffset, height), "f");
        }
        else {
            __classPrivateFieldSet(this, _ScrollableList_contentOffset, { row: row, offset: nextOffset }, "f");
        }
    };
    ScrollableList.prototype.updateItems = function (items) {
        __classPrivateFieldSet(this, _ScrollableList_items, items, "f");
        this.invalidateAllRows('view');
        this.invalidateSize();
    };
    ScrollableList.prototype.viewForRow = function (row) {
        if (row < 0 || row >= __classPrivateFieldGet(this, _ScrollableList_items, "f").length) {
            return;
        }
        var item = __classPrivateFieldGet(this, _ScrollableList_items, "f")[row];
        var view = __classPrivateFieldGet(this, _ScrollableList_viewCache, "f").get(item);
        if (!view) {
            view = __classPrivateFieldGet(this, _ScrollableList_cellForItem, "f").call(this, item, row);
            if (view) {
                __classPrivateFieldGet(this, _ScrollableList_viewCache, "f").set(item, view);
            }
        }
        return view;
    };
    ScrollableList.prototype.sizeForRow = function (row, contentWidth, view) {
        var item = __classPrivateFieldGet(this, _ScrollableList_items, "f")[row];
        if (contentWidth === this.contentSize.width && item) {
            var size_1 = __classPrivateFieldGet(this, _ScrollableList_sizeCache, "f").get(item);
            if (size_1 !== undefined) {
                return size_1;
            }
        }
        view = view !== null && view !== void 0 ? view : this.viewForRow(row);
        if (view === undefined) {
            return undefined;
        }
        var size = view.naturalSize(new geometry_1.Size(contentWidth, 0));
        if (contentWidth === this.contentSize.width && item) {
            __classPrivateFieldGet(this, _ScrollableList_sizeCache, "f").set(item, size);
        }
        return size;
    };
    Object.defineProperty(ScrollableList.prototype, "contentSize", {
        get: function () {
            return _super.prototype.contentSize.shrink(__classPrivateFieldGet(this, _ScrollableList_showScrollbars, "f") ? 1 : 0, 0);
        },
        enumerable: false,
        configurable: true
    });
    ScrollableList.prototype.lastOffset = function () {
        var _a;
        var cellCount = __classPrivateFieldGet(this, _ScrollableList_items, "f").length;
        var cellWidth = this.contentSize.width;
        var row = cellCount - 1;
        var y = 0;
        while (y < this.contentSize.height) {
            var height = (_a = this.sizeForRow(row, cellWidth)) === null || _a === void 0 ? void 0 : _a.height;
            if (height === undefined) {
                return { row: 0, offset: 0 };
            }
            y += height;
            if (y >= this.contentSize.height) {
                break;
            }
            row -= 1;
        }
        return { row: row, offset: this.contentSize.height - y };
    };
    ScrollableList.prototype.render = function (viewport) {
        var _a, _b, _c, _d;
        if (viewport.isEmpty) {
            return _super.prototype.render.call(this, viewport);
        }
        viewport.registerMouse('mouse.wheel');
        if (__classPrivateFieldGet(this, _ScrollableList_contentOffset, "f").row >= __classPrivateFieldGet(this, _ScrollableList_items, "f").length ||
            (__classPrivateFieldGet(this, _ScrollableList_keepAtBottom, "f") && __classPrivateFieldGet(this, _ScrollableList_isAtBottom, "f"))) {
            var offset = this.lastOffset();
            __classPrivateFieldSet(this, _ScrollableList_contentOffset, offset, "f");
        }
        var cellWidth = this.contentSize.width;
        var prevRows = new Set(this.children);
        var visibleRows = new Set();
        var _e = __classPrivateFieldGet(this, _ScrollableList_contentOffset, "f"), row = _e.row, y = _e.offset;
        var heights = [0, 0, 0];
        if (__classPrivateFieldGet(this, _ScrollableList_showScrollbars, "f")) {
            for (var i = 0; i < row; i++) {
                heights[0] += (_b = (_a = this.sizeForRow(i, cellWidth)) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0;
            }
            heights[1] = heights[0];
        }
        var _loop_1 = function () {
            var view = this_1.viewForRow(row);
            if (!view) {
                return "break";
            }
            var height = (_c = this_1.sizeForRow(row, cellWidth, view)) === null || _c === void 0 ? void 0 : _c.height;
            if (y === __classPrivateFieldGet(this_1, _ScrollableList_contentOffset, "f").offset && y + height <= 0) {
                y = __classPrivateFieldGet(this_1, _ScrollableList_contentOffset, "f").offset = 0;
            }
            row += 1;
            heights[1] += height;
            if (view.parent !== this_1) {
                this_1.add(view);
            }
            visibleRows.add(view);
            if (y < viewport.visibleRect.maxY() &&
                y + height >= viewport.visibleRect.minY()) {
                var rect = new geometry_1.Rect(new geometry_1.Point(0, y), new geometry_1.Size(cellWidth, height));
                viewport.clipped(rect, function (inside) {
                    view.render(inside);
                });
            }
            y += height;
            if (y >= viewport.contentSize.height) {
                return "break";
            }
        };
        var this_1 = this;
        while (y < viewport.contentSize.height) {
            var state_1 = _loop_1();
            if (state_1 === "break")
                break;
        }
        for (var _i = 0, prevRows_1 = prevRows; _i < prevRows_1.length; _i++) {
            var prevRow = prevRows_1[_i];
            if (!visibleRows.has(prevRow)) {
                this.removeChild(prevRow);
            }
        }
        if (__classPrivateFieldGet(this, _ScrollableList_showScrollbars, "f")) {
            viewport.registerMouse('mouse.button.left', new geometry_1.Rect(new geometry_1.Point(cellWidth, 0), new geometry_1.Size(1, viewport.contentSize.height)));
            heights[2] = heights[1];
            for (var i = row; i < __classPrivateFieldGet(this, _ScrollableList_items, "f").length; i++) {
                var rowHeight = (_d = this.sizeForRow(i, cellWidth)) === null || _d === void 0 ? void 0 : _d.height;
                if (rowHeight === undefined) {
                    break;
                }
                heights[2] += rowHeight;
            }
            __classPrivateFieldSet(this, _ScrollableList_totalHeight, heights[2], "f");
            for (var y_1 = 0; y_1 < viewport.contentSize.height; y_1++) {
                var h = (0, geometry_1.interpolate)(y_1, [0, viewport.contentSize.height - 1], [0, heights[2]]);
                var inRange = ~~h >= heights[0] && ~~h <= heights[1] + 1;
                viewport.write(inRange ? '█' : ' ', new geometry_1.Point(cellWidth, y_1), new Style_1.Style(inRange
                    ? {
                        foreground: this.theme.highlightColor,
                        background: this.theme.highlightColor,
                    }
                    : {
                        foreground: this.theme.darkenColor,
                        background: this.theme.darkenColor,
                    }));
            }
        }
    };
    return ScrollableList;
}(Container_1.Container));
exports.ScrollableList = ScrollableList;
_ScrollableList_items = new WeakMap(), _ScrollableList_cellForItem = new WeakMap(), _ScrollableList_keepAtBottom = new WeakMap(), _ScrollableList_isAtBottom = new WeakMap(), _ScrollableList_showScrollbars = new WeakMap(), _ScrollableList_scrollHeight = new WeakMap(), _ScrollableList_contentOffset = new WeakMap(), _ScrollableList_maxWidth = new WeakMap(), _ScrollableList_viewCache = new WeakMap(), _ScrollableList_sizeCache = new WeakMap(), _ScrollableList_totalHeight = new WeakMap(), _ScrollableList_instances = new WeakSet(), _ScrollableList_update = function _ScrollableList_update(_a) { }, _ScrollableList_checkScrollDown = function _ScrollableList_checkScrollDown(row, currentOffset, height) {
    var _a;
    // add heights of visible cells – if we run out of cells before
    // y > this.contentSize, exit. Otherwise, scroll.
    var y = currentOffset;
    var nextRow = row;
    var nextHeight = height;
    while (nextHeight !== undefined) {
        y += nextHeight;
        if (y > this.contentSize.height) {
            return true;
        }
        nextHeight = (_a = this.sizeForRow(++nextRow, this.contentSize.width)) === null || _a === void 0 ? void 0 : _a.height;
        if (nextHeight === undefined) {
            return false;
        }
    }
}, _ScrollableList_scrollDownToNextRow = function _ScrollableList_scrollDownToNextRow(row, nextOffset, height) {
    var _a;
    var nextRow = row;
    while (nextOffset <= -height) {
        var nextHeight = (_a = this.sizeForRow(nextRow + 1, this.contentSize.width)) === null || _a === void 0 ? void 0 : _a.height;
        if (nextHeight === undefined) {
            nextOffset = -height;
            break;
        }
        nextOffset += height;
        height = nextHeight;
        nextRow += 1;
    }
    return { row: nextRow, offset: nextOffset };
}, _ScrollableList_scrollUpToPrevRow = function _ScrollableList_scrollUpToPrevRow(row, nextOffset, height) {
    var _a;
    var nextRow = row;
    while (nextOffset > 0) {
        var nextHeight = (_a = this.sizeForRow(nextRow - 1, this.contentSize.width)) === null || _a === void 0 ? void 0 : _a.height;
        if (nextHeight === undefined) {
            nextOffset = 0;
            break;
        }
        height = nextHeight;
        nextOffset -= height;
        nextRow -= 1;
    }
    return { row: nextRow, offset: nextOffset };
};
