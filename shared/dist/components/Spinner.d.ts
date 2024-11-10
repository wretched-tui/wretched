import type { Viewport } from '../Viewport';
import type { Props as ViewProps } from '../View';
import { View } from '../View';
import { Size } from '../geometry';
interface Props extends ViewProps {
    isAnimating?: boolean;
}
export declare class Spinner extends View {
    #private;
    constructor({ isAnimating, ...props }?: Props);
    update({ isAnimating, ...props }: Props): void;
    naturalSize(): Size;
    receiveTick(dt: number): boolean;
    render(viewport: Viewport): void;
}
export {};
