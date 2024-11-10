"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollableList = void 0;
const Container_1 = require("../Container");
const Style_1 = require("../Style");
const geometry_1 = require("../geometry");
const events_1 = require("../events");
class ScrollableList extends Container_1.Container {
    /**
     * Your function here need not return "stable" views; the views returned by this
     * function will be cached until you call `scrollableList.invalidateCache()` or
     * `scrollableList.invalidateRow(row)`.
     */
    #items;
    #cellForItem;
    #keepAtBottom;
    #isAtBottom = true;
    #showScrollbars;
    #scrollHeight;
    #contentOffset;
    #maxWidth = 0;
    #viewCache = new Map();
    #sizeCache = new Map();
    #totalHeight;
    constructor({ cellForItem, items, keepAtBottom, scrollHeight, showScrollbars, ...viewProps }) {
        super(viewProps);
        this.#showScrollbars = showScrollbars ?? true;
        this.#contentOffset = { row: 0, offset: 0 };
        this.#cellForItem = cellForItem;
        this.#scrollHeight = scrollHeight ?? 1;
        this.#items = items;
        this.#keepAtBottom = keepAtBottom ?? false;
    }
    update(props) {
        this.#update(props);
        super.update(props);
    }
    #update({}) { }
    naturalSize(available) {
        let { row, offset: y } = this.#contentOffset;
        const scrollWidth = this.#showScrollbars ? 1 : 0;
        while (y < available.height) {
            const view = this.viewForRow(row);
            if (!view) {
                break;
            }
            const rowSize = this.sizeForRow(row, available.width - scrollWidth, view);
            // persist #maxWidth so that the largest row _remains_ the largest row even
            // after it scrolls out of the visible window
            this.#maxWidth = Math.max(this.#maxWidth, rowSize.width);
            y += rowSize.height;
            row += 1;
        }
        return new geometry_1.Size(this.#maxWidth + scrollWidth, available.height);
    }
    /**
     * Tells ScrollableList to re-fetch all rows.
     */
    invalidate() {
        this.#maxWidth = 0;
        this.invalidateAllRows('view');
        super.invalidateSize();
    }
    /**
     * Tells ScrollableList to re-fetch the visible rows.
     * @param forCache: 'size' | 'view' representing which cache to invalidate
     */
    invalidateAllRows(forCache) {
        if (forCache === 'view') {
            this.#viewCache = new Map();
        }
        this.#sizeCache = new Map();
    }
    /**
     * Tells ScrollableList to refetch a specific row
     * @param row: the row to invalidate
     * @param forCache: 'size' | 'view'   representing which cache to invalidate
     */
    invalidateItem(item, forCache) {
        if (forCache === 'view') {
            this.#viewCache.delete(item);
        }
        this.#sizeCache.delete(item);
    }
    invalidateSize() {
        this.#maxWidth = 0;
        this.invalidateAllRows('size');
        super.invalidateSize();
    }
    receiveMouse(event) {
        if (event.name === 'mouse.wheel.up') {
            this.scrollBy(this.#scrollHeight * -1);
        }
        else if (event.name === 'mouse.wheel.down') {
            this.scrollBy(this.#scrollHeight);
        }
        else if ((0, events_1.isMouseDragging)(event) && this.#totalHeight) {
            if (this.#totalHeight <= this.contentSize.height) {
                this.#contentOffset = { row: 0, offset: 0 };
                return;
            }
            const maxY = this.#totalHeight - this.contentSize.height;
            const heightY = Math.round((0, geometry_1.interpolate)(Math.max(0, Math.min(this.contentSize.height - 1, event.position.y)), [0, this.contentSize.height - 1], [0, maxY]));
            this.#isAtBottom = heightY === maxY;
            const cellWidth = this.contentSize.width;
            for (let row = 0, y = 0; row < this.#items.length; row++) {
                const rowHeight = this.sizeForRow(row, cellWidth)?.height;
                if (rowHeight === undefined) {
                    break;
                }
                if (y + rowHeight >= heightY) {
                    this.#contentOffset = { row, offset: y - heightY };
                    return;
                }
                y += rowHeight;
            }
        }
    }
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
    scrollBy(offset) {
        if (offset === 0) {
            return;
        }
        this.invalidateSize();
        const { row, offset: currentOffset } = this.#contentOffset;
        let height = this.sizeForRow(row, this.contentSize.width)?.height;
        if (height === undefined) {
            this.#contentOffset = { row: 0, offset: 0 };
            return;
        }
        // prevent scrolling if there is no more content
        if (offset > 0) {
            const doScroll = this.#checkScrollDown(row, currentOffset, height);
            if (!doScroll) {
                this.#isAtBottom = true;
                return;
            }
        }
        else if (row === 0 && currentOffset >= 0) {
            // no helper function necessary here - if offset < 0, do not scroll if we are
            // already at the top
            return;
        }
        this.#isAtBottom = false;
        let nextOffset = currentOffset - offset;
        if (nextOffset <= -height) {
            this.#contentOffset = this.#scrollDownToNextRow(row, nextOffset, height);
        }
        else if (nextOffset > 0) {
            this.#contentOffset = this.#scrollUpToPrevRow(row, nextOffset, height);
        }
        else {
            this.#contentOffset = { row: row, offset: nextOffset };
        }
    }
    updateItems(items) {
        this.#items = items;
        this.invalidateAllRows('view');
        this.invalidateSize();
    }
    viewForRow(row) {
        if (row < 0 || row >= this.#items.length) {
            return;
        }
        const item = this.#items[row];
        let view = this.#viewCache.get(item);
        if (!view) {
            view = this.#cellForItem(item, row);
            if (view) {
                this.#viewCache.set(item, view);
            }
        }
        return view;
    }
    sizeForRow(row, contentWidth, view) {
        const item = this.#items[row];
        if (contentWidth === this.contentSize.width && item) {
            const size = this.#sizeCache.get(item);
            if (size !== undefined) {
                return size;
            }
        }
        view = view ?? this.viewForRow(row);
        if (view === undefined) {
            return undefined;
        }
        const size = view.naturalSize(new geometry_1.Size(contentWidth, 0));
        if (contentWidth === this.contentSize.width && item) {
            this.#sizeCache.set(item, size);
        }
        return size;
    }
    get contentSize() {
        return super.contentSize.shrink(this.#showScrollbars ? 1 : 0, 0);
    }
    lastOffset() {
        const cellCount = this.#items.length;
        const cellWidth = this.contentSize.width;
        let row = cellCount - 1;
        let y = 0;
        while (y < this.contentSize.height) {
            const height = this.sizeForRow(row, cellWidth)?.height;
            if (height === undefined) {
                return { row: 0, offset: 0 };
            }
            y += height;
            if (y >= this.contentSize.height) {
                break;
            }
            row -= 1;
        }
        return { row, offset: this.contentSize.height - y };
    }
    render(viewport) {
        if (viewport.isEmpty) {
            return super.render(viewport);
        }
        viewport.registerMouse('mouse.wheel');
        if (this.#contentOffset.row >= this.#items.length ||
            (this.#keepAtBottom && this.#isAtBottom)) {
            const offset = this.lastOffset();
            this.#contentOffset = offset;
        }
        const cellWidth = this.contentSize.width;
        const prevRows = new Set(this.children);
        const visibleRows = new Set();
        let { row, offset: y } = this.#contentOffset;
        let heights = [0, 0, 0];
        if (this.#showScrollbars) {
            for (let i = 0; i < row; i++) {
                heights[0] += this.sizeForRow(i, cellWidth)?.height ?? 0;
            }
            heights[1] = heights[0];
        }
        while (y < viewport.contentSize.height) {
            const view = this.viewForRow(row);
            if (!view) {
                break;
            }
            const height = this.sizeForRow(row, cellWidth, view)?.height;
            if (y === this.#contentOffset.offset && y + height <= 0) {
                y = this.#contentOffset.offset = 0;
            }
            row += 1;
            heights[1] += height;
            if (view.parent !== this) {
                this.add(view);
            }
            visibleRows.add(view);
            if (y < viewport.visibleRect.maxY() &&
                y + height >= viewport.visibleRect.minY()) {
                const rect = new geometry_1.Rect(new geometry_1.Point(0, y), new geometry_1.Size(cellWidth, height));
                viewport.clipped(rect, inside => {
                    view.render(inside);
                });
            }
            y += height;
            if (y >= viewport.contentSize.height) {
                break;
            }
        }
        for (const prevRow of prevRows) {
            if (!visibleRows.has(prevRow)) {
                this.removeChild(prevRow);
            }
        }
        if (this.#showScrollbars) {
            viewport.registerMouse('mouse.button.left', new geometry_1.Rect(new geometry_1.Point(cellWidth, 0), new geometry_1.Size(1, viewport.contentSize.height)));
            heights[2] = heights[1];
            for (let i = row; i < this.#items.length; i++) {
                const rowHeight = this.sizeForRow(i, cellWidth)?.height;
                if (rowHeight === undefined) {
                    break;
                }
                heights[2] += rowHeight;
            }
            this.#totalHeight = heights[2];
            for (let y = 0; y < viewport.contentSize.height; y++) {
                const h = (0, geometry_1.interpolate)(y, [0, viewport.contentSize.height - 1], [0, heights[2]]);
                const inRange = ~~h >= heights[0] && ~~h <= heights[1] + 1;
                viewport.write(inRange ? '█' : ' ', new geometry_1.Point(cellWidth, y), new Style_1.Style(inRange
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
    }
    /**
     * Returns 'true' if the scroll should be allowed, returns 'false' if there
     * is no more content to be shown (do not scroll down)
     */
    #checkScrollDown(row, currentOffset, height) {
        // add heights of visible cells – if we run out of cells before
        // y > this.contentSize, exit. Otherwise, scroll.
        let y = currentOffset;
        let nextRow = row;
        let nextHeight = height;
        while (nextHeight !== undefined) {
            y += nextHeight;
            if (y > this.contentSize.height) {
                return true;
            }
            nextHeight = this.sizeForRow(++nextRow, this.contentSize.width)?.height;
            if (nextHeight === undefined) {
                return false;
            }
        }
    }
    #scrollDownToNextRow(row, nextOffset, height) {
        let nextRow = row;
        while (nextOffset <= -height) {
            const nextHeight = this.sizeForRow(nextRow + 1, this.contentSize.width)?.height;
            if (nextHeight === undefined) {
                nextOffset = -height;
                break;
            }
            nextOffset += height;
            height = nextHeight;
            nextRow += 1;
        }
        return { row: nextRow, offset: nextOffset };
    }
    #scrollUpToPrevRow(row, nextOffset, height) {
        let nextRow = row;
        while (nextOffset > 0) {
            const nextHeight = this.sizeForRow(nextRow - 1, this.contentSize.width)?.height;
            if (nextHeight === undefined) {
                nextOffset = 0;
                break;
            }
            height = nextHeight;
            nextOffset -= height;
            nextRow -= 1;
        }
        return { row: nextRow, offset: nextOffset };
    }
}
exports.ScrollableList = ScrollableList;
//# sourceMappingURL=ScrollableList.js.map