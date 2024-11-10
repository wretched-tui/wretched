import { View } from './View';
import { FocusManager } from './managers/FocusManager';
export declare class System {
    readonly view: View;
    readonly focusManager: FocusManager;
    constructor(view: View, focusManager: FocusManager);
    requestFocus(): boolean;
}
export declare class UnboundSystem {
    readonly focusManager: FocusManager;
    constructor(focusManager: FocusManager);
    bind(view: View): System;
}
