import type { Viewport } from '../Viewport';
import { type Props as ViewProps, View } from '../View';
import { Container } from '../Container';
import { Size } from '../geometry';
type RenderFn<T> = (datum: T, path: string) => View;
type GetChildrenFn<T> = (datum: T, path: string) => T[] | undefined;
interface StyleProps<T> {
    data: T[];
    render: RenderFn<T>;
    getChildren?: GetChildrenFn<T>;
    titleView: View;
}
type Props<T> = StyleProps<T> & ViewProps;
export declare class Tree<T extends any> extends Container {
    #private;
    constructor(props: Props<T>);
    update(props: Props<T>): void;
    naturalSize(available: Size): Size;
    render(viewport: Viewport): void;
}
export {};
