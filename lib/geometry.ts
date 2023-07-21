export class Point {
  readonly x: number
  readonly y: number

  static zero = new Point(0, 0)

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  copy() {
    return new Point(this.x, this.y)
  }

  mutableCopy() {
    return this.copy() as MutablePoint
  }

  offset(dp: Point): Point
  offset(dx: number, dy: number): Point
  offset(...args: [number, number] | [pt: Point]) {
    if (args.length === 2) {
      return new Point(this.x + args[0], this.y + args[1])
    } else {
      return new Point(this.x + args[0].x, this.y + args[0].y)
    }
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

  constructor(width: number, height: number) {
    this.width = Math.max(0, width)
    this.height = Math.max(0, height)
  }

  #toWH(args: [number, number] | [Size]): [number, number] {
    if (args.length === 2) {
      return args
    } else {
      return [args[0].width, args[0].height]
    }
  }

  copy() {
    return new Size(this.width, this.height)
  }

  mutableCopy() {
    const copy = this.copy() as MutableSize
    let width = copy.width
    let height = copy.height
    Object.defineProperty(copy, 'width', {
      enumerable: true,
      get() {
        return width
      },
      set(value: number) {
        width = value
      },
    })
    Object.defineProperty(copy, 'height', {
      enumerable: true,
      get() {
        return height
      },
      set(value: number) {
        height = value
      },
    })
    return copy
  }

  shrink(...args: [number, number] | [Size]): Size {
    const [w, h] = this.#toWH(args)
    return this.grow(-w, -h)
  }

  grow(...args: [number, number] | [Size]): Size {
    const [w, h] = this.#toWH(args)
    return new Size(Math.max(0, this.width + w), Math.max(0, this.height + h))
  }

  maxWidth(width: number): Size {
    return new Size(Math.min(width, this.width), this.height)
  }

  maxHeight(height: number): Size {
    return new Size(this.width, Math.min(height, this.height))
  }

  max(...args: [number, number] | [Size]): Size {
    const [w, h] = this.#toWH(args)
    return new Size(Math.min(w, this.width), Math.min(h, this.height))
  }

  min(...args: [number, number] | [Size]): Size {
    const [w, h] = this.#toWH(args)
    return new Size(Math.max(w, this.width), Math.max(h, this.height))
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

  constructor(origin: Point, size: Size) {
    let {x, y} = origin
    let {width, height} = size
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

  intersection(rect: Rect): Rect {
    const minX = Math.max(this.minX(), rect.minX())
    const minY = Math.max(this.minY(), rect.minY())
    const width = Math.min(this.maxX(), rect.maxX()) - minX
    const height = Math.min(this.maxY(), rect.maxY()) - minY
    return new Rect(new Point(minX, minY), new Size(width, height))
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
  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0)
}

export type Mutable<T extends Point | Size | Rect> = T extends Point
  ? MutablePoint
  : T extends Size
  ? MutableSize
  : T extends Rect
  ? MutableRect
  : never
