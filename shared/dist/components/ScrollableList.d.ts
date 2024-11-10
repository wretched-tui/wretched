import type { Viewport } from '../Viewport';
import { type Props as ViewProps, View } from '../View';
import { Container } from '../Container';
import { Size } from '../geometry';
import { type MouseEvent } from '../events';
interface Props<T> extends ViewProps {
    items: T[];
    cellForItem: (item: T, row: number) => View;
    /**
     * Show/hide the scrollbars
     * @default true
     */
    showScrollbars?: boolean;
    /**
     * How many rows to scroll by when using the mouse wheel.
     * @default 1
     */
    scrollHeight?: number;
    /**
     * Useful for log views
     */
    keepAtBottom?: boolean;
}
interface ContentOffset {
    row: number;
    offset: number;
}
export declare class ScrollableList<T> extends Container {
    #private;
    constructor({ cellForItem, items, keepAtBottom, scrollHeight, showScrollbars, ...viewProps }: Props<T>);
    update(props: Props<T>): void;
    naturalSize(available: Size): Size;
    /**
     * Tells ScrollableList to re-fetch all rows.
     */
    invalidate(): void;
    /**
     * Tells ScrollableList to re-fetch the visible rows.
     * @param forCache: 'size' | 'view' representing which cache to invalidate
     */
    invalidateAllRows(forCache: 'size' | 'view'): void;
    /**
     * Tells ScrollableList to refetch a specific row
     * @param row: the row to invalidate
     * @param forCache: 'size' | 'view'   representing which cache to invalidate
     */
    invalidateItem(item: T, forCache: 'size' | 'view'): void;
    invalidateSize(): void;
    receiveMouse(event: MouseEvent): void;
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
    scrollBy(offset: number): void;
    updateItems(items: T[]): void;
    viewForRow(row: number): View | undefined;
    sizeForRow(row: number, contentWidth: number, view: View): Size;
    sizeForRow(row: number, contentWidth: number): Size | undefined;
    get contentSize(): Size;
    lastOffset(): ContentOffset;
    render(viewport: Viewport): void;
}
export {};
