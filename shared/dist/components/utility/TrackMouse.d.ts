import { Viewport } from '../../Viewport';
import { type Props as ViewProps, View } from '../../View';
import { Container } from '../../Container';
import { Size } from '../../geometry';
import type { MouseEvent } from '../../events';
interface Props extends ViewProps {
    content: View;
}
export declare class TrackMouse extends Container {
    #private;
    constructor({ content, ...viewProps }: Props);
    naturalSize(available: Size): Size;
    receiveMouse(event: MouseEvent): void;
    render(viewport: Viewport): void;
}
export {};
