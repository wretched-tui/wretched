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

  copy() {
    return new Size(this.width, this.height)
  }

  mutableCopy() {
    return this.copy() as MutableSize
  }

  shrink(...args: [number, number] | [Size]): Size {
    if (args.length === 2) {
      return this.grow(-args[0], -args[1])
    } else {
      return this.grow(-args[0].width, -args[0].height)
    }
  }

  grow(...args: [number, number] | [Size]): Size {
    if (args.length === 2) {
      return new Size(Math.max(0, this.width + args[0]), Math.max(0, this.height + args[1]))
    } else {
      return new Size(
        Math.max(0, this.width + args[0].width),
        Math.max(0, this.height + args[0].height),
      )
    }
  }
}

export interface MutableSize extends Size {
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
