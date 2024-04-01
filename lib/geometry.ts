export class Point {
  readonly x: number
  readonly y: number

  static zero = new Point(0, 0)

  constructor(...args: PointArgs) {
    const [x, y] = toXY(args)
    this.x = x
    this.y = y
  }

  copy() {
    return new Point(this.x, this.y)
  }

  mutableCopy() {
    return this.copy() as MutablePoint
  }

  offset(...args: PointArgs) {
    const [x, y] = toXY(args)
    return new Point(this.x + x, this.y + y)
  }
}

export interface MutablePoint extends Point {
  x: number
  y: number
}

export class Size {
  readonly width: number
  readonly height: number

  static zero = new Size(0, 0)

  constructor(...args: SizeArgs) {
    const [width, height] = toWH(args)
    this.width = Math.max(0, width)
    this.height = Math.max(0, height)
  }

  copy() {
    return new Size(this.width, this.height)
  }

  mutableCopy() {
    const copy = this.copy() as MutableSize
    Object.defineProperty(copy, 'width', {
      enumerable: true,
      writable: true,
    })
    Object.defineProperty(copy, 'height', {
      enumerable: true,
      writable: true,
    })
    return copy
  }

  shrink(...args: SizeArgs): Size {
    const [w, h] = toWH(args)
    return this.grow(-w, -h)
  }

  grow(...args: SizeArgs): Size {
    const [w, h] = toWH(args)
    return new Size(Math.max(0, this.width + w), Math.max(0, this.height + h))
  }

  /**
   * Restricts width to a maximum size (width must be <= maxWidth)
   */
  maxWidth(maxWidth: number): Size {
    return new Size(Math.min(maxWidth, this.width), this.height)
  }

  /**
   * Restricts height to a maximum size (height must be <= maxHeight)
   */
  maxHeight(maxHeight: number): Size {
    return new Size(this.width, Math.min(maxHeight, this.height))
  }

  /**
   * Restricts width to a minimum size (width must be >= minWidth)
   */
  minWidth(minWidth: number): Size {
    return new Size(Math.max(minWidth, this.width), this.height)
  }

  /**
   * Restricts height to a minimum size (height must be >= minHeight)
   */
  minHeight(minHeight: number): Size {
    return new Size(this.width, Math.max(minHeight, this.height))
  }

  /**
   * Restricts size to a maximum size (size must be <= maxSize)
   */
  max(...args: SizeArgs): Size {
    const [w, h] = toWH(args)
    return new Size(Math.min(w, this.width), Math.min(h, this.height))
  }

  /**
   * Restricts size to a minimum size (size must be >= minSize)
   */
  min(...args: SizeArgs): Size {
    const [w, h] = toWH(args)
    return new Size(Math.max(w, this.width), Math.max(h, this.height))
  }

  abs(): Size {
    if (this.width >= 0 && this.height >= 0) {
      return this
    } else {
      return new Size(Math.abs(this.width), Math.abs(this.height))
    }
  }
}

interface MutableSize extends Size {
  width: number
  height: number
}

export class Rect {
  readonly origin: Point
  readonly size: Size

  static zero = new Rect(Point.zero, Size.zero)

  constructor(origin: PointArg, size: SizeArg) {
    let [x, y] = toXY([origin])
    let [width, height] = toWH([size])
    if (width < 0) {
      x = x + width
      width = -width
    }
    if (height < 0) {
      y = y + height
      height = -height
    }
    this.origin = new Point(x, y)
    this.size = new Size(width, height)
  }

  copy() {
    return new Rect(this.origin.copy(), this.size.copy())
  }

  mutableCopy() {
    return this.copy() as MutableRect
  }

  isEmpty() {
    return this.size.width === 0 || this.size.height === 0
  }

  includes(point: Point) {
    return (
      point.x >= this.minX() &&
      point.x < this.maxX() &&
      point.y >= this.minY() &&
      point.y < this.maxY()
    )
  }

  intersection(rect: Rect): Rect {
    const minX = Math.max(this.minX(), rect.minX())
    const minY = Math.max(this.minY(), rect.minY())
    const width = Math.min(this.maxX(), rect.maxX()) - minX
    const height = Math.min(this.maxY(), rect.maxY()) - minY
    return new Rect(new Point(minX, minY), new Size(width, height))
  }

  inset(...args: InsetArgs) {
    const [top, right, bottom, left] = toInset(args)
    return new Rect(
      this.min().offset(left, top),
      this.size.abs().shrink(left + right, top + bottom),
    )
  }

  min(): Point {
    return new Point(this.minX(), this.minY())
  }
  max(): Point {
    return new Point(this.maxX(), this.maxY())
  }
  minX(): number {
    return this.origin.x
  }
  maxX(): number {
    return this.origin.x + this.size.width
  }
  minY(): number {
    return this.origin.y
  }
  maxY(): number {
    return this.origin.y + this.size.height
  }

  forEachPoint(fn: (point: Point) => void) {
    const minX = this.minX(),
      maxX = this.maxX(),
      minY = this.minY(),
      maxY = this.maxY()
    let pt = Point.zero.mutableCopy()
    for (let x = minX; x < maxX; ++x)
      for (let y = minY; y < maxY; ++y) {
        pt.x = x
        pt.y = y
        fn(pt)
      }
  }
}

export interface MutableRect extends Rect {
  origin: MutablePoint
  size: MutableSize
}

export function point(x: number, y: number) {
  return new Point(x, y)
}

export function size(w: number, h: number) {
  return new Size(w, h)
}

export function rect(x: number, y: number, w: number, h: number) {
  return new Rect(new Point(x, y), new Size(w, h))
}

export function interpolate(
  x: number,
  [x0, x1]: [number, number],
  [y0, y1]: [number, number],
): number {
  if (x0 === x1) {
    return y0
  }

  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0)
}

export type Mutable<T extends Point | Size | Rect> = T extends Point
  ? MutablePoint
  : T extends Size
  ? MutableSize
  : T extends Rect
  ? MutableRect
  : never

type PointArg = [number, number] | Pick<Point, 'x' | 'y'>
type PointArgs = [number, number] | [PointArg]

type SizeArg = [number, number] | Pick<Size, 'width' | 'height'>
type SizeArgs = [number, number] | [SizeArg]

export type Edge = 'top' | 'right' | 'bottom' | 'left'

// all | [all] | [tops, sides] | [top, sides, bottom] | [top, right, bottom, left]
// or {top?: number, bottom, left, right}
type InsetArg =
  | number
  | [number]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number]
  | {[K in Edge]?: number}
type InsetArgs =
  | [InsetArg]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number]

function toXY(args: PointArgs): [number, number] {
  if (args.length === 2) {
    return args
  } else {
    const [arg] = args
    if (Array.isArray(arg)) {
      return [arg[0], arg[1]]
    } else {
      return [arg.x, arg.y]
    }
  }
}

function toWH(args: SizeArgs): [number, number] {
  if (args.length === 2) {
    return args
  } else {
    const [arg] = args
    if (Array.isArray(arg)) {
      return [arg[0], arg[1]]
    } else {
      return [arg.width, arg.height]
    }
  }
}

function toInset(args: InsetArgs): [number, number, number, number] {
  if (args.length > 1) {
    return toInset([
      args as
        | [number, number]
        | [number, number, number]
        | [number, number, number, number],
    ])
  } else {
    const [arg] = args
    if (typeof arg === 'number') {
      return [arg, arg, arg, arg]
    } else if (Array.isArray(arg)) {
      const numbers = arg as number[]
      const [a, b, c, d] = numbers
      switch (numbers.length) {
        case 4:
          return [a, a, b, c]
        case 3:
          return [a, b, c, b]
        case 2:
          return [a, b, a, b]
        case 1:
          return [a, a, a, a]
        default:
          return [0, 0, 0, 0]
      }
    } else {
      return [arg.top ?? 0, arg.right ?? 0, arg.bottom ?? 0, arg.left ?? 0]
    }
  }
}
