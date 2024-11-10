import type { Viewport } from '../Viewport';
import { type Props as ContainerProps, Container } from '../Container';
import { Size } from '../geometry';
import { HotKey as HotKeyProp } from '../events';
export interface Props extends ContainerProps {
    hotKey: HotKeyProp;
}
export declare class HotKey extends Container {
    #private;
    constructor(props: Props);
    update(props: Props): void;
    naturalSize(): Size;
    render(viewport: Viewport): void;
}
