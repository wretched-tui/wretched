import type { Viewport } from '../Viewport';
import { View } from '../View';
import { Container, Props as ContainerProps } from '../Container';
import { Size, type Edge } from '../geometry';
import { type MouseEvent } from '../events';
import { Theme } from '../Theme';
import { System } from '../System';
interface Props extends ContainerProps {
    location?: Edge;
    isOpen?: boolean;
    onToggle?: (isOpen: boolean) => void;
}
interface ConstructorProps extends Props {
    drawer?: View;
    content?: View;
}
export declare class Drawer extends Container {
    #private;
    drawerView?: View;
    contentView?: View;
    constructor({ content, drawer, ...props }: ConstructorProps);
    get location(): Edge;
    set location(value: Edge);
    update(props: Props): void;
    /**
     * Opens the drawer (does not trigger onToggle)
     */
    open(): void;
    /**
     * Closes the drawer (does not trigger onToggle)
     */
    close(): void;
    /**
     * Toggles the drawer open/closed (does not trigger onToggle)
     */
    toggle(): void;
    add(child: View, at?: number): void;
    naturalSize(available: Size): Size;
    receiveTick(dt: number): boolean;
    receiveMouse(event: MouseEvent, system: System): void;
    childTheme(view: View): Theme;
    render(viewport: Viewport): void;
}
export {};
