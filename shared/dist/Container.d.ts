import { Size } from './geometry';
import type { Viewport } from './Viewport';
import { type Props as ViewProps, View } from './View';
import { Screen } from './Screen';
export interface Props extends ViewProps {
    child?: View;
    children?: View[];
}
export declare abstract class Container extends View {
    #private;
    constructor({ child, children, ...viewProps }?: Props);
    get children(): View[];
    update(props: Props): void;
    naturalSize(available: Size): Size;
    render(viewport: Viewport): void;
    renderChildren(viewport: Viewport): void;
    add(child: View, at?: number): void;
    removeAllChildren(): void;
    removeChild(child: View): void;
    moveToScreen(screen: Screen | undefined): void;
}
