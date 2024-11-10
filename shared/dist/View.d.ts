import type { Viewport } from './Viewport';
import type { Screen } from './Screen';
import type { Purpose } from './Theme';
import { Theme } from './Theme';
import { Container } from './Container';
import { System } from './System';
import { type KeyEvent, type MouseEvent } from './events';
import { Size } from './geometry';
export type Dimension = number | 'fill' | 'shrink' | 'natural';
export type FlexSize = 'natural' | number;
export type FlexShorthand = FlexSize | `flex${number}`;
export declare function parseFlexShorthand(flex: FlexShorthand): FlexSize;
export interface Props {
    theme?: Theme | Purpose;
    x?: number;
    y?: number;
    width?: Dimension;
    height?: Dimension;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    padding?: number | Partial<Edges>;
    isVisible?: boolean;
    flex?: FlexShorthand;
    debug?: boolean;
}
export interface Edges {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
export declare abstract class View {
    #private;
    parent: Container | undefined;
    debug: boolean;
    padding: Edges | undefined;
    flex: FlexSize;
    constructor(props?: Props);
    update(props: Props): void;
    get theme(): Theme;
    set theme(value: Theme | undefined);
    childTheme(_view: View): Theme;
    get isVisible(): boolean;
    set isVisible(value: boolean);
    get screen(): Screen | undefined;
    get children(): View[];
    get contentSize(): Size;
    get isHover(): boolean;
    get isPressed(): boolean;
    get width(): Dimension | undefined;
    get height(): Dimension | undefined;
    abstract naturalSize(available: Size): Size;
    abstract render(viewport: Viewport): void;
    /**
     * Called from a view when a property change could affect naturalSize
     */
    invalidateSize(): void;
    /**
     * Indicates that a rerender is needed (but size is not affected)
     */
    invalidateRender(): void;
    /**
     * Called before being added to the parent View
     */
    willMoveTo(parent: View): void;
    /**
     * Called after being removed from the parent View
     */
    didMoveFrom(parent: View): void;
    /**
     * Called after being added to a Screen
     */
    didMount(screen: Screen): void;
    /**
     * Called after being removed from a Screen (even when about to be moved to a new
     * screen).
     */
    didUnmount(screen: Screen): void;
    removeFromParent(): void;
    moveToScreen(screen: Screen | undefined): void;
    /**
     * To register for this event, call `viewport.registerFocus()`, which returns `true`
     * if the current view has the keyboard focus.
     */
    receiveKey(event: KeyEvent): void;
    /**
     * To register for this event, call `viewport.registerMouse()`
     */
    receiveMouse(event: MouseEvent, system: System): void;
    /**
     * Receives the time-delta between previous and current render. Return 'true' if
     * this function causes the view to need a rerender.
     *
     * To register for this event, call `viewport.registerTick()`
     */
    receiveTick(dt: number): boolean;
}
