import { View } from '../View';
import { Point } from '../geometry';
import { UnboundSystem } from '../System';
import type { MouseEventListener, MouseEventListenerName, SystemMouseEvent } from '../events';
export declare class MouseManager {
    #private;
    reset(): void;
    /**
     * @return boolean Whether the mouse.move targets changed
     */
    commit(system: UnboundSystem): boolean;
    /**
     * Multiple views can claim the mouse.move event; they will all receive it.
     * Only the last view to claim button or wheel events will receive those events.
     */
    registerMouse(view: View, offset: Point, point: Point, eventNames: MouseEventListenerName[]): void;
    checkMouse(view: View, x: number, y: number): void;
    hasMouseDownListener(x: number, y: number, event: SystemMouseEvent): boolean;
    getMouseListener(x: number, y: number): MouseEventListener | undefined;
    trigger(systemEvent: SystemMouseEvent, system: UnboundSystem): void;
}
