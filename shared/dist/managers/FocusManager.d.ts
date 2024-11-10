import { View } from '../View';
import { type HotKeyDef, type KeyEvent } from '../events';
export declare class FocusManager {
    #private;
    /**
     * If the previous focus-view is not mounted, we can clear out the current
     * focus-view and focus the first that registers.
     *
     * If the previous focus-view is mounted but does not request focus, we can't know
     * that until _after_ the first render. In that case, after render, 'needsRerender'
     * selects the first focus-view and triggers a re-render.
     */
    reset(isRootView: boolean): void;
    trigger(event: KeyEvent): void;
    /**
     * Returns whether the current view has focus.
     */
    registerFocus(view: View): boolean;
    registerHotKey(view: View, key: HotKeyDef): void;
    requestFocus(view: View): boolean;
    unfocus(): void;
    /**
     * @return boolean Whether the focus changed
     */
    commit(): boolean;
    prevFocus(): View | undefined;
    nextFocus(): View | undefined;
}
