export function GpmClient(options: any): GpmClient;
export class GpmClient {
    constructor(options: any);
    __proto__: EventEmitter<any>;
    stop(): void;
    ButtonName(btn: any): "" | "right" | "left" | "middle";
    hasShiftKey(mod: any): boolean;
    hasCtrlKey(mod: any): boolean;
    hasMetaKey(mod: any): boolean;
}
import { EventEmitter } from 'node:events';
