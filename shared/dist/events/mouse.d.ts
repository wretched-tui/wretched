import type { MouseButton } from '../sys';
import { View } from '../View';
import { Point, Rect } from '../geometry';
export type MouseMove = 'enter' | 'in' | 'below' | 'exit';
export type MouseClick = 'down' | 'exit' | 'enter' | 'dragInside' | 'dragOutside' | 'up' | 'cancel';
export type MouseWheel = 'down' | 'up';
export type MouseEventListenerName = 'mouse.move' | 'mouse.button.all' | `mouse.button.${MouseButton}` | 'mouse.wheel';
export type SystemMouseEventName = 'mouse.move.in' | 'mouse.button.down' | 'mouse.button.up' | 'mouse.wheel.down' | 'mouse.wheel.up';
export type MouseEventName = `mouse.move.${MouseMove}` | `mouse.button.${MouseClick}` | `mouse.wheel.${MouseWheel}`;
export type MouseEvent = {
    position: Point;
    type: 'mouse';
    name: MouseEventName;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
    button: MouseButton;
};
export type SystemMouseEvent = Omit<MouseEvent, 'name' | 'position'> & {
    name: SystemMouseEventName;
    x: number;
    y: number;
};
export type MouseDownEvent = {
    target?: MouseEventTarget & {
        wasInside: boolean;
    };
    button: MouseButton;
};
export type MouseEventTarget = {
    view: View;
    offset: Point;
};
export type MouseEventListener = {
    move: MouseEventTarget[];
    buttonAll?: MouseEventTarget;
    buttonLeft?: MouseEventTarget;
    buttonMiddle?: MouseEventTarget;
    buttonRight?: MouseEventTarget;
    wheel?: MouseEventTarget;
};
export declare function isMouseClicked(event: MouseEvent, inside?: Rect): boolean;
/**
 * A mouse press event is started with a 'down' event, but can also begin again
 * after the mouse is dragged outside the component ('exit' event), and then
 * dragged back inside ('enter').
 */
export declare function isMousePressStart(event: SystemMouseEvent | MouseEvent): boolean;
/**
 * Press-exit is an uncomfortable name, it refers to either ending the press event
 * ('up', 'cancel') or dragging the mouse outside the component ('exit'). If the
 * component has has a 'pressed' highlight effect, `isMousePressExit` should turn
 * that effect off.
 */
export declare function isMousePressExit(event: SystemMouseEvent | MouseEvent): boolean;
export declare function isMousePressEnd(event: SystemMouseEvent | MouseEvent): boolean;
/**
 * Dragging events (dragInside, dragOutside), but *also* mouse.button.down
 */
export declare function isMouseDragging(event: SystemMouseEvent | MouseEvent): boolean;
export declare function isMouseEnter(event: MouseEvent): boolean;
export declare function isMouseExit(event: MouseEvent): boolean;
export declare function isMouseButton(event: SystemMouseEvent): boolean;
export declare function isMouseWheel(event: SystemMouseEvent | MouseEvent): boolean;
export declare function isMouseMove(event: SystemMouseEvent | MouseEvent): boolean;
