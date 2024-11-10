import type { KeyEvent as WretchedKeyEvent } from '../sys';
export type KeyEvent = WretchedKeyEvent & {
    type: 'key';
};
export type HotKeyDef = {
    char: string;
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
};
export type HotKey = string | HotKeyDef;
export declare function toHotKeyDef(hotKey: HotKey): HotKeyDef;
export declare function isKeyPrintable(event: KeyEvent): boolean;
export declare const match: (key: HotKeyDef, event: KeyEvent) => boolean;
export declare const styleTextForHotKey: (text: string, key_: HotKey) => string;
