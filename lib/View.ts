import type {Mutable} from './geometry'
import type {Viewport} from './Viewport'
import type {Screen} from './Screen'
import type {Purpose} from './Theme'
import {Theme} from './Theme'
import type {KeyEvent, MouseEvent} from './events'
import {Point, Size, Rect} from './geometry'

export interface Props {
  theme?: Theme | Purpose
  x?: number
  y?: number
  //
  width?: number | 'fill' | 'natural'
  height?: number | 'fill' | 'natural'
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  //
  padding?: number | Partial<Edges>
  debug?: boolean
}

interface Edges {
  top: number
  right: number
  bottom: number
  left: number
}

export abstract class View {
  parent: View | null = null

  #screen: Screen | null = null
  #theme: Theme | undefined
  #prevSizeCache: Map<string, Size> = new Map()
  #contentSize: Size = Size.zero
  #invalidateParent = true

  #x: Props['x']
  #y: Props['y']
  #width: Props['width']
  #height: Props['height']
  #minWidth: Props['minWidth']
  #minHeight: Props['minHeight']
  #maxWidth: Props['maxWidth']
  #maxHeight: Props['maxHeight']
  #padding: Edges | undefined
  #debug: boolean

  constructor({
    theme,
    x,
    y,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    padding,
    debug,
  }: Props = {}) {
    this.#theme = typeof theme === 'string' ? Theme[theme] : theme
    this.#x = x
    this.#y = y
    this.#width = width
    this.#height = height
    this.#minWidth = minWidth
    this.#minHeight = minHeight
    this.#maxWidth = maxWidth
    this.#maxHeight = maxHeight

    this.#padding = toEdges(padding)
    this.#debug = debug ?? false

    const render = this.render.bind(this)
    this.render = this.#renderWrap(render).bind(this)
    const naturalSize = this.naturalSize.bind(this)
    this.naturalSize = this.#naturalSizeWrap(naturalSize).bind(this)

    Object.defineProperties(this, {
      render: {
        enumerable: false,
      },
      naturalSize: {
        enumerable: false,
      },
      parent: {
        enumerable: false,
      },
    })
  }

  get theme(): Theme {
    return this.#theme ?? this.parent?.theme ?? Theme.plain
  }

  get screen(): Screen | null {
    return this.#screen
  }

  get debug() {
    return this.#debug
  }

  #toDimension(
    dim: number | 'fill' | 'natural',
    available: number,
    natural: () => number,
  ): number {
    if (dim === 'fill') {
      return available
    } else if (dim === 'natural') {
      return natural()
    }
    return dim
  }

  #restrictSize(
    _calcSize: () => Size,
    availableSize: Size,
    prefer: 'grow' | 'shrink',
  ): Mutable<Size> {
    let memo: Size | undefined
    const calcSize = () => {
      return (memo ??= _calcSize())
    }

    if (this.#width !== undefined && this.#height !== undefined) {
      // shortcut for explicit or 'fill' on both width & height, skip all the rest
      const width = this.#toDimension(
        this.#width,
        availableSize.width,
        () => calcSize().width,
      ),
        height = this.#toDimension(
          this.#height,
          availableSize.height,
          () => calcSize().height,
        )
      return new Size(width, height).mutableCopy()
    }

    const size = (
      prefer === 'shrink' ? calcSize() : availableSize
    ).mutableCopy()

    if (this.#width !== undefined) {
      size.width = this.#toDimension(
        this.#width,
        availableSize.width,
        () => calcSize().width,
      )
    } else {
      if (this.#minWidth !== undefined) {
        size.width = Math.max(this.#minWidth, size.width)
      }
      if (this.#maxWidth !== undefined) {
        size.width = Math.min(this.#maxWidth, size.width)
      }
    }

    if (this.#height !== undefined) {
      size.height = this.#toDimension(
        this.#height,
        availableSize.height,
        () => calcSize().height,
      )
    } else {
      if (this.#minHeight !== undefined) {
        size.height = Math.max(this.#minHeight, size.height)
      }
      if (this.#maxHeight !== undefined) {
        size.height = Math.min(this.#maxHeight, size.height)
      }
    }

    return size
  }

  #naturalSizeWrap(
    naturalSize: (availableSize: Size) => Size,
  ): (availableSize: Size) => Size {
    return availableSize => {
      const cached = this.#prevSizeCache.get(cacheKey(availableSize))
      if (cached) {
        return cached
      }

      if (this.#x || this.#y) {
        availableSize = availableSize.shrink(this.#x ?? 0, this.#y ?? 0)
      }

      const size = this.#restrictSize(
        () => {
          let contentSize = naturalSize(availableSize)
          if (this.#padding) {
            contentSize = contentSize.grow(
              this.#padding.left + this.#padding.right,
              this.#padding.top + this.#padding.bottom,
            )
          }
          return contentSize
        },
        availableSize,
        'shrink',
      )

      if (this.#x) {
        size.width += this.#x
      }
      if (this.#y) {
        size.height += this.#y
      }

      this.#prevSizeCache.set(cacheKey(availableSize), size)
      return size
    }
  }

  get contentSize(): Size {
    return this.#contentSize
  }

  #renderWrap(
    render: (viewport: Viewport) => void,
  ): (viewport: Viewport) => void {
    return viewport => {
      if (this.#contentSize.width !== viewport.contentSize.width || this.#contentSize.height !== viewport.contentSize.height) {
        this.#invalidateParent = false
        this.invalidateSize()
        this.#invalidateParent = true
      }

      this.#contentSize = viewport.contentSize
      let origin: Point
      let contentSize: Size = viewport.contentSize
      if (this.#x || this.#y) {
        origin = new Point(this.#x ?? 0, this.#y ?? 0)
        contentSize = contentSize.shrink(origin.x, origin.y)
      } else {
        origin = Point.zero
      }

      contentSize = this.#restrictSize(
        () => this.naturalSize(contentSize),
        contentSize,
        'grow',
      )

      if (this.#padding) {
        origin = origin.offset(this.#padding.left, this.#padding.top)
        contentSize = contentSize.shrink(
          this.#padding.left + this.#padding.right,
          this.#padding.top + this.#padding.bottom,
        )
      }

      const rect = new Rect(origin, contentSize)
      viewport._render(this, rect, render)
    }
  }

  abstract naturalSize(availableSize: Size): Size
  abstract render(viewport: Viewport): void
  /**
   * Called from a view when a property change could affect naturalSize
   */
  invalidateSize() {
    this.#prevSizeCache = new Map()
    if (this.#invalidateParent) {
      this.parent?.invalidateSize()
    }
  }

  receiveKey(event: KeyEvent) {}
  receiveMouse(event: MouseEvent) {}
  receiveTick(dt: number): boolean | undefined {
    return
  }

  willMoveTo(parent: View) {}
  didMoveFrom(parent: View) {}
  didMount(screen: Screen) {}
  didUnmount(screen: Screen) {}

  moveToScreen(screen: Screen | null) {
    if (this.#screen !== screen) {
      const prev = this.#screen
      this.#screen = screen

      if (screen) {
        if (prev) {
          this.didUnmount(prev)
        }
        this.didMount(screen)
      } else {
        this.didUnmount(prev!)
      }
    }
  }
}

function toEdges(
  edges: number | Partial<Edges> | undefined,
): Edges | undefined {
  if (!edges) {
    return
  }

  if (typeof edges === 'number') {
    return {
      top: edges,
      right: edges,
      bottom: edges,
      left: edges,
    }
  }

  return {
    top: edges.top ?? 0,
    right: edges.right ?? 0,
    bottom: edges.bottom ?? 0,
    left: edges.left ?? 0,
  }
}

function cacheKey(size: Size) {
  return `${size.width}x${size.height}`
}
