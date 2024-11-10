export declare class Point {
    readonly x: number;
    readonly y: number;
    static zero: Point;
    constructor(point: Point);
    constructor(_: {
        x: number;
        y: number;
    });
    constructor(_: [number, number]);
    constructor(x: number, y: number);
    constructor(...args: PointArgs);
    copy(): Point;
    mutableCopy(): MutablePoint;
    offset(point: Point): Point;
    offset(_: {
        x: number;
        y: number;
    }): Point;
    offset(_: [number, number]): Point;
    offset(x: number, y: number): Point;
    isEqual(point: Point): boolean;
    isEqual(_: {
        x: number;
        y: number;
    }): boolean;
    isEqual(_: [number, number]): boolean;
    isEqual(x: number, y: number): boolean;
}
export interface MutablePoint extends Point {
    x: number;
    y: number;
}
export declare class Size {
    readonly width: number;
    readonly height: number;
    static zero: Size;
    static one: Size;
    constructor(size: Size);
    constructor(_: {
        width: number;
        height: number;
    });
    constructor(_: [number, number]);
    constructor(width: number, height: number);
    copy(): Size;
    mutableCopy(): MutableSize;
    isEqual(size: Size): boolean;
    isEqual(_: {
        width: number;
        height: number;
    }): boolean;
    isEqual(_: [number, number]): boolean;
    isEqual(width: number, height: number): boolean;
    shrink(size: Size): Size;
    shrink(_: {
        width: number;
        height: number;
    }): Size;
    shrink(_: [number, number]): Size;
    shrink(width: number, height: number): Size;
    grow(size: Size): Size;
    grow(_: {
        width: number;
        height: number;
    }): Size;
    grow(_: [number, number]): Size;
    grow(width: number, height: number): Size;
    /**
     * Expand the width, but only increase the height if the new height is taller than
     * the previous height.
     */
    growWidth(size: Size): Size;
    growWidth(_: {
        width: number;
        height: number;
    }): Size;
    growWidth(_: [number, number]): Size;
    growWidth(width: number): Size;
    /**
     * Expand the height, but only increase the width if the new width is taller than
     * the previous width.
     */
    growHeight(size: Size): Size;
    growHeight(_: {
        width: number;
        height: number;
    }): Size;
    growHeight(_: [number, number]): Size;
    growHeight(height: number): Size;
    /**
     * Restricts width to a maximum size (width must be <= maxWidth)
     */
    maxWidth(maxWidth: number): Size;
    /**
     * Restricts height to a maximum size (height must be <= maxHeight)
     */
    maxHeight(maxHeight: number): Size;
    /**
     * Restricts width to a minimum size (width must be >= minWidth)
     */
    minWidth(minWidth: number): Size;
    /**
     * Restricts height to a minimum size (height must be >= minHeight)
     */
    minHeight(minHeight: number): Size;
    /**
     * Assigns width
     */
    withWidth(value: number): Size;
    /**
     * Assigns height
     */
    withHeight(value: number): Size;
    /**
     * Restricts size to a maximum size (size must be <= maxSize)
     */
    max(...args: SizeArgs): Size;
    /**
     * Restricts size to a minimum size (size must be >= minSize)
     */
    min(...args: SizeArgs): Size;
    abs(): Size;
    get isEmpty(): boolean;
}
interface MutableSize extends Size {
    width: number;
    height: number;
}
export declare class Rect {
    readonly origin: Point;
    readonly size: Size;
    static zero: Rect;
    constructor(origin: PointArg, size: SizeArg);
    atX(value: number): Rect;
    atY(value: number): Rect;
    at(...value: PointArgs): Rect;
    offset(point: Point): Rect;
    offset(_: {
        x: number;
        y: number;
    }): Rect;
    offset(_: [number, number]): Rect;
    offset(x: number, y: number): Rect;
    withWidth(value: number): Rect;
    withHeight(value: number): Rect;
    withSize(...value: SizeArgs): Rect;
    copy(): Rect;
    mutableCopy(): MutableRect;
    isEqual(rect: Rect): boolean;
    get isEmpty(): boolean;
    includes(point: Point): boolean;
    intersection(rect: Rect): Rect;
    inset(...args: InsetArgs): Rect;
    min(): Point;
    max(): Point;
    minX(): number;
    maxX(): number;
    minY(): number;
    maxY(): number;
    forEachPoint(fn: (point: Point) => void): void;
}
export interface MutableRect extends Rect {
    origin: MutablePoint;
    size: MutableSize;
}
export declare function interpolate(x: number, [x0, x1]: [number, number], [y0, y1]: [number, number], clamp?: boolean): number;
export type Mutable<T extends Point | Size | Rect> = T extends Point ? MutablePoint : T extends Size ? MutableSize : T extends Rect ? MutableRect : never;
type PointArg = [number, number] | Pick<Point, 'x' | 'y'>;
type PointArgs = [number, number] | [PointArg];
type SizeArg = [number, number] | Pick<Size, 'width' | 'height'>;
type SizeArgs = [number, number] | [SizeArg];
export type Edge = 'top' | 'right' | 'bottom' | 'left';
type InsetArg = number | [number] | [number, number] | [number, number, number] | [number, number, number, number] | {
    [K in Edge]?: number;
};
type InsetArgs = [InsetArg] | [number, number] | [number, number, number] | [number, number, number, number];
export {};
