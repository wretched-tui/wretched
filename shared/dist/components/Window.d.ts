import { type Props as ContainerProps, Container } from '../Container';
import { Size } from '../geometry';
export declare class Window extends Container {
    constructor({ children, ...viewProps }?: ContainerProps);
    naturalSize(available: Size): Size;
}
