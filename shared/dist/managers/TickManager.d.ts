import { View } from '../View';
export declare class TickManager {
    #private;
    constructor(render: () => void);
    reset(): void;
    endRender(): void;
    stop(): void;
    registerTick(view: View): void;
    needsRender(): void;
    triggerTick(dt: number): void;
}
