import {Container, type Props as ContainerProps} from '../Container'
import {Point, Rect, Size} from '../geometry'
import {Style} from '../Style'
import {Text} from './Text'
import {View} from '../View'
import {Viewport} from '../Viewport'
import {System} from '../System'
import {isMouseClicked, type MouseEvent} from '../events'

interface Props extends ContainerProps {}

interface TabProps extends ContainerProps {
  title?: string
  view: View
}

// tabs = new Tabs()
// tabs.addTab('title', tab)
// tabs.addTab(new Text({text: 'title', style: …}), tab)
//
// tabs.add()
export class Tabs extends Container {
  static Tab: typeof Tab
  #selectedTab = 0
  #separatorLocation: [number, number] | undefined
  #separatorWidths: number[] = []

  static create(tabs: ([string, View] | Tab)[], extraProps: Props = {}): Tabs {
    const tabsView = new Tabs(extraProps)
    tabsView.debug = true
    for (const tab of tabs) {
      if (tab instanceof Tab) {
        tabsView.addTab(tab)
      } else {
        const [title, view] = tab as [string, View]
        tabsView.addTab(title, view)
      }
    }

    return tabsView
  }

  constructor(props: Props = {}) {
    super(props)
  }

  get tabs() {
    return this.children.filter(view => view instanceof Tab)
  }

  addTab(tab: Tab): void
  addTab(title: string, view: View): void
  addTab(titleOrTab: string | Tab, view?: View) {
    let tabView: Tab
    if (titleOrTab instanceof Tab) {
      tabView = titleOrTab
    } else {
      tabView = Tab.create(titleOrTab as string, view as View)
    }

    tabView.onClick = tab => this.#selected(tab)

    this.add(tabView)
    this.add(tabView.view)
  }

  #selected(tab: Tab) {
    const index = this.tabs.indexOf(tab)
    if (index === -1) {
      return
    }

    this.#selectedTab = index
  }

  naturalSize(available: Size) {
    const remainingSize = available.mutableCopy()
    const tabTitleSize = this.tabs.reduce((size, tab, index) => {
      const tabSize = tab.naturalSize(remainingSize).mutableCopy()
      size.width += tabSize.width
      size.height = Math.max(size.height, tabSize.height)
      remainingSize.width = Math.max(0, remainingSize.width - tabSize.width)

      return size
    }, Size.zero.mutableCopy())

    tabTitleSize.height += TAB_SEPARATOR_HEIGHT

    const childSize = Size.zero.mutableCopy()
    const availableChildSize = available.shrink(0, tabTitleSize.height)
    for (const child of this.tabs.map(tab => tab.view)) {
      childSize.width = Math.max(
        childSize.width,
        child.naturalSize(availableChildSize).width,
      )
      childSize.height = Math.max(
        childSize.height,
        child.naturalSize(availableChildSize).height,
      )
    }

    return new Size(
      Math.max(tabTitleSize.width, childSize.width),
      tabTitleSize.height + childSize.height,
    )
  }

  receiveTick(dt: number) {
    if (
      this.#separatorLocation === undefined ||
      this.#selectedTab >= this.#separatorWidths.length
    ) {
      return false
    }

    const [start, stop] = this.#separatorWidths.reduce(
      ([start, stop, prev], width, index) =>
        index === this.#selectedTab
          ? [start, stop + width, 0]
          : index > this.#selectedTab
          ? [start, stop, 0]
          : [start + width, stop + width, width],
      [0, 0, 0] as [number, number, number],
    )
    const dx = dt / 20
    if (start < this.#separatorLocation[0]) {
      this.#separatorLocation[0] = Math.max(
        start,
        this.#separatorLocation[0] - dx,
      )
    } else if (start > this.#separatorLocation[0]) {
      this.#separatorLocation[0] = Math.min(
        start,
        this.#separatorLocation[0] + dx,
      )
    }

    if (stop > this.#separatorLocation[1]) {
      this.#separatorLocation[1] = Math.min(
        stop,
        this.#separatorLocation[1] + dx,
      )
    } else if (stop < this.#separatorLocation[1]) {
      this.#separatorLocation[1] = Math.max(
        stop,
        this.#separatorLocation[1] - dx,
      )
    } else {
      return false
    }

    if (this.#separatorLocation[1] <= this.#separatorLocation[0] + 1) {
      this.#separatorLocation[1] = Math.min(
        stop,
        this.#separatorLocation[0] + 1,
      )
    }

    return true
  }

  render(viewport: Viewport) {
    viewport.registerTick()

    const remainingSize = viewport.contentSize.mutableCopy()
    const tabInfo: [Rect, Tab][] = []
    const separatorWidths: number[] = []
    let x = 0,
      tabHeight = 0
    this.tabs.forEach((tab, index) => {
      const tabRect = Rect.zero.withSize(tab.naturalSize(remainingSize)).atX(x)
      tabInfo.push([tabRect, tab])
      remainingSize.width -= tabRect.size.width

      if (
        this.#separatorLocation === undefined &&
        this.#selectedTab === index
      ) {
        this.#separatorLocation = [x, x + tabRect.size.width]
      }

      x += tabRect.size.width
      tabHeight = Math.max(
        tabHeight,
        tabRect.size.height - TAB_SEPARATOR_HEIGHT,
      )

      separatorWidths.push(tabRect.size.width)
    })

    this.#selectedTab =
      this.#selectedTab >= separatorWidths.length ? 0 : this.#selectedTab
    this.#separatorWidths = separatorWidths
    if (this.#separatorLocation) {
      this.#renderSeparator(
        viewport,
        tabHeight,
        separatorWidths,
        this.#separatorLocation,
      )
    }

    tabInfo.forEach(([tabRect, tab]) => {
      viewport.clipped(tabRect, inner => tab.render(inner))
    })

    const selectedTab = this.tabs.at(this.#selectedTab)
    if (selectedTab) {
      const childRect = viewport.contentRect.inset(
        tabHeight + TAB_SEPARATOR_HEIGHT,
        0,
        0,
        0,
      )
      viewport.clipped(childRect, inner => {
        selectedTab.view.render(inner)
      })
    }
  }

  #renderSeparator(
    viewport: Viewport,
    tabHeight: number,
    separatorWidths: number[],
    separatorLocation: [number, number],
  ) {
    const [separatorStart, separatorStop] = [
      ~~separatorLocation[0],
      ~~separatorLocation[1],
    ]
    // separatorLocation is rounded down in this function
    let xLeft = 0,
      xRight = 0,
      didDrawSeparator = false

    separatorWidths.forEach((separatorWidth, index) => {
      const tab = this.tabs.at(index)
      const isHover = tab?.isHover ?? false
      xRight = xLeft + separatorWidth
      let underline
      if (xLeft >= separatorStart && xLeft <= separatorStop) {
        const xMid = Math.min(separatorStop, xRight)
        const u1 = '━'.repeat(xMid - xLeft)
        const u2 = dashesLeft(xRight - separatorStop, isHover)
        underline = u1 + u2
        didDrawSeparator = false
      } else if (xRight >= separatorStart && xLeft < separatorStop) {
        const xMid = Math.min(separatorStop, xRight)
        const u0 = dashesRight(separatorStart - xLeft, isHover)
        const u1 = '━'.repeat(xMid - separatorStart)
        const u2 = dashesLeft(xRight - separatorStop, isHover)
        underline = u0 + u1 + u2
        didDrawSeparator = xRight > separatorStop
      } else if (didDrawSeparator) {
        underline = dashesLeft(separatorWidth, isHover)
        didDrawSeparator = false
      } else if (xRight === separatorStart) {
        underline = dashesRight(separatorWidth, isHover)
      } else {
        underline = dashes(separatorWidth, isHover)
      }
      viewport.write(underline, new Point(xLeft, tabHeight))
      xLeft += separatorWidth
    })
    this.debug = false
  }
}

class Tab extends Container {
  #titleView: Text
  view: View
  onClick: ((tab: Tab) => void) | undefined

  declare title: string

  static create(
    title: string,
    view: View,
    extraProps: Omit<TabProps, 'title' | 'view'> = {},
  ) {
    return new Tab({title, view, ...extraProps})
  }

  constructor({title, view, ...props}: TabProps) {
    super(props)

    this.view = view

    this.#titleView = new Text({
      text: title ?? '',
      style: this.titleStyle,
    })
    this.add(this.#titleView)

    Object.defineProperty(this, 'title', {
      enumerable: true,
      get() {
        return this.#titleView.text
      },
      set(value: string) {
        this.#titleView.text = value
      },
    })
  }

  get titleStyle() {
    return new Style({bold: this.isHover})
  }

  naturalSize(available: Size) {
    return this.#titleView
      .naturalSize(available)
      .grow(TAB_TITLE_PAD, TAB_SEPARATOR_HEIGHT)
  }

  receiveMouse(event: MouseEvent, system: System) {
    super.receiveMouse(event, system)

    if (isMouseClicked(event)) {
      this.onClick?.(this)
    }

    this.#titleView.style = this.titleStyle
  }

  render(viewport: Viewport) {
    viewport.registerMouse(['mouse.button.left', 'mouse.move'])

    viewport.clipped(
      new Rect([1, 0], viewport.contentSize.shrink(TAB_TITLE_PAD, 0)),
      inner => {
        this.#titleView.render(inner)
      },
    )
  }
}

function dashesLeft(w: number, isHover: boolean) {
  if (w <= 0) {
    return ''
  }

  return (isHover ? '╺' : '╶') + dashes(w - 1, isHover)
}

function dashesRight(w: number, isHover: boolean) {
  if (w <= 0) {
    return ''
  }

  return dashes(w - 1, isHover) + (isHover ? '╸' : '╴')
}

function dashes(w: number, isHover: boolean) {
  if (w <= 0) {
    return ''
  }

  return (isHover ? '━' : '─').repeat(w)
}

const TAB_TITLE_PAD = 2
const TAB_SEPARATOR_HEIGHT = 1

/*
 𝐓𝐚𝐛1  Tab2  Tab3
━━━━━━╶───────────
━━━━━━╶───────────
━━━━━━━━━╶────────
 Tab1  𝐓𝐚𝐛2  Tab3
━━━━━━━━━━━╶──────
─────╴━━━━━━╶─────
 Tab1  𝐓𝐚𝐛2  Tab3
─────╴━━━━━━╶─────
 Tab1  Tab2  𝐓𝐚𝐛3
───────────╴━━━━━━
*/
