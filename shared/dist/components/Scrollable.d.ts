import type { Viewport } from '../Viewport';
import { type Props as ContainerProps, Container } from '../Container';
import { Size } from '../geometry';
import { type MouseEvent } from '../events';
interface Props extends ContainerProps {
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
}
/**
 * Scrollable is meant to scroll _a single view_, ie a Stack view. But all the
 * container views are optimized to check their _visibleRect_, and won't render
 * children that are not in view, saving some CPU cycles.
 */
export declare class Scrollable extends Container {
    #private;
    constructor(props: Props);
    update(props: Props): void;
    naturalSize(available: Size): Size;
    receiveMouse(event: MouseEvent): void;
    receiveMouseDown(event: MouseEvent): void;
    receiveWheel(event: MouseEvent): void;
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
    scrollBy(offsetX: number, offsetY: number): void;
    get contentSize(): Size;
    render(viewport: Viewport): void;
}
export {};
