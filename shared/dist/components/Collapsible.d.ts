import type { Viewport } from '../Viewport';
import { View } from '../View';
import { type Props as ContainerProps, Container } from '../Container';
import { Size } from '../geometry';
import { type MouseEvent } from '../events';
import { System } from '../System';
interface StyleProps {
    /**
     * @default true
     */
    isCollapsed?: boolean;
    /**
     * If true, the collapsed view is always shown. Usually the expanded view
     * *replaces* the collapsed view.
     * @default false
     */
    showCollapsed?: boolean;
    collapsed?: View;
    expanded?: View;
}
type Props = StyleProps & ContainerProps;
export declare class Collapsible extends Container {
    #private;
    constructor(props: Props);
    update(props: Props): void;
    add(child: View, at?: number): void;
    removeChild(child: View): void;
    naturalSize(available: Size): Size;
    receiveMouse(event: MouseEvent, system: System): void;
    render(viewport: Viewport): void;
}
export {};
