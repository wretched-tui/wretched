import type { BlessedProgram } from './sys';
import type { SGRTerminal } from './terminal';
import type { Rect, Point } from './geometry';
import { View } from './View';
import type { HotKeyDef, KeyEvent, MouseEventListenerName, SystemEvent, SystemMouseEvent } from './events';
import { Window } from './components/Window';
type ViewConstructor<T extends View> = (program: BlessedProgram) => T | Promise<T>;
export declare class Screen {
    #private;
    rootView: View;
    static reset(): void;
    static start(): Promise<[Screen, BlessedProgram, Window]>;
    static start<T extends View>(viewConstructor: T | ViewConstructor<T>, opts: {
        quitChar?: 'c' | 'q' | '' | undefined | false;
    }): Promise<[Screen, BlessedProgram, T]>;
    static start<T extends View>(viewConstructor: T | ViewConstructor<T>): Promise<[Screen, BlessedProgram, T]>;
    constructor(program: SGRTerminal, rootView: View);
    onExit(callback: () => void): void;
    start(): void;
    exit(): void;
    trigger(event: SystemEvent): void;
    /**
     * Requests a modal. A modal will be created if:
     * (a) no modal is already displayed
     * or
     * (b) a modal is requesting a nested modal
     */
    requestModal(parent: View, modal: View, onClose: () => void, rect: Rect): boolean;
    /**
     * @return boolean Whether the current view has focus
     */
    registerFocus(view: View): boolean;
    registerHotKey(view: View, key: HotKeyDef): void;
    requestFocus(view: View): boolean;
    nextFocus(): void;
    prevFocus(): void;
    triggerKeyboard(event: KeyEvent): void;
    /**
     * @see MouseManager.registerMouse
     */
    registerMouse(view: View, offset: Point, point: Point, eventNames: MouseEventListenerName[]): void;
    checkMouse(view: View, x: number, y: number): void;
    triggerMouse(systemEvent: SystemMouseEvent): void;
    registerTick(view: View): void;
    triggerTick(dt: number): void;
    preRender(view: View): void;
    /**
     * @return boolean Whether or not to rerender the view due to focus or mouse change
     */
    commit(): boolean;
    needsRender(): void;
    render(): void;
}
export {};
