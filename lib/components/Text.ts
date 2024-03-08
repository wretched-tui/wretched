import {unicode} from '../sys'

import type {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'
import {View} from '../View'
import {Style} from '../Style'
import {Point, Size} from '../geometry'

type Alignment = 'left' | 'right' | 'center'
export const FontFamilies = [
  'serif',
  'serif-bold',
  'serif-italic',
  'serif-italic-bold',
  'sans',
  'sans-bold',
  'sans-italic',
  'sans-italic-bold',
  'monospace',
  'double-struck',
  'fraktur',
  'fraktur-bold',
  'script',
  'script-bold',
] as const
export type FontFamily = (typeof FontFamilies)[number]

interface TextProps {
  text?: string
  lines?: undefined
}

interface LinesProps {
  text?: undefined
  lines: string[]
}

interface StyleProps {
  style?: Style
  alignment: Alignment
  wrap: boolean
  font?: FontFamily
}

type Props = Partial<StyleProps> & (TextProps | LinesProps) & ViewProps

export class Text extends View {
  #text: string = ''
  #lines: [string, number][] = []
  #style: StyleProps['style']
  #alignment: StyleProps['alignment'] = 'left'
  #wrap: StyleProps['wrap'] = false
  #font: FontFamily = 'serif'

  declare text: string
  declare font: FontFamily

  constructor(props: Props = {}) {
    super(props)

    this.#update(props)

    Object.defineProperty(this, 'text', {
      enumerable: true,
      get: () => this.#text,
      set: (value: string) => {
        if (this.#text === value) {
          return
        }

        this.#updateLines(value, value.split('\n'), this.#font)
        this.invalidateSize()
      },
    })

    Object.defineProperty(this, 'font', {
      enumerable: true,
      get: () => this.#font,
      set: (value: FontFamily) => {
        if (this.#font === value) {
          return
        }

        this.#updateLines(this.#text, undefined, value)
        this.invalidateSize()
      },
    })
  }

  update(props: Props) {
    this.#update(props)
    super.update(props)
  }

  #update({text, lines, style, alignment, wrap, font}: Props) {
    this.#style = style
    this.#alignment = alignment ?? 'left'
    this.#wrap = wrap ?? false
    this.#updateLines(text, lines, font)
  }

  #updateLines(
    text: string | undefined,
    lines: string[] | undefined,
    font: FontFamily | undefined,
  ) {
    this.#font = font ?? 'serif'
    const fontMap = font && FONTS[font]

    if (text !== undefined) {
      this.#text = text
      lines = text.split('\n')
    } else if (lines !== undefined) {
      this.#text = lines.join('\n')
    } else {
      this.#text = ''
      lines = []
    }

    this.#lines = lines.map(line => {
      if (fontMap) {
        line = [...line].map(c => fontMap.get(c) ?? c).join('')
      }

      return [line, unicode.lineWidth(line)]
    })
  }

  naturalSize(availableSize: Size): Size {
    return this.#lines.reduce((size, [, width]) => {
      if (this.#wrap) {
        const lineHeight = 1 + ~~(width / availableSize.width)
        size.width = availableSize.width
        size.height += lineHeight
        return size
      }

      size.width = Math.max(size.width, width)
      size.height += 1
      return size
    }, Size.zero.mutableCopy())
  }

  render(viewport: Viewport) {
    const lines: [string, number][] = this.#lines

    viewport.usingPen(this.#style, pen => {
      const point = new Point(0, 0).mutableCopy()
      for (const [line, width] of lines) {
        if (!line.length) {
          point.y += 1
          continue
        }

        let didWrap = false
        const offsetX =
          this.#alignment === 'left'
            ? 0
            : this.#alignment === 'center'
            ? ~~((viewport.contentSize.width - width) / 2)
            : viewport.contentSize.width - width
        point.x = offsetX
        for (const char of unicode.printableChars(line)) {
          const width = unicode.charWidth(char)
          if (width === 0) {
            // track the current style regardless of wether we are printing
            pen.replacePen(Style.fromSGR(char))
            continue
          }

          if (this.#wrap && point.x >= viewport.contentSize.width) {
            didWrap = true
            point.x = 0
            point.y += 1
          }

          if (didWrap && char.match(/\s/)) {
            continue
          }
          didWrap = false

          if (
            point.x >= viewport.visibleRect.minX() &&
            point.x + width - 1 < viewport.visibleRect.maxX()
          ) {
            viewport.write(char, point)
          }

          point.x += width
          // do not early exit when point.x >= maxX. 'line' may contain ANSI codes that
          // need to be picked up by replacePen.
        }

        point.y += 1
      }
    })
  }
}

type Font = Map<string, string>
function createFont(capitals: string, lowercase: string, digits = ''): Font {
  const font: Font = new Map()
  let letterCode = 'A'.charCodeAt(0)
  for (const c of [...capitals]) {
    const letter = String.fromCharCode(letterCode++)
    font.set(letter, c)
  }

  letterCode = 'a'.charCodeAt(0)
  for (const c of [...lowercase]) {
    const letter = String.fromCharCode(letterCode++)
    font.set(letter, c)
  }

  letterCode = '0'.charCodeAt(0)
  for (const c of [...digits]) {
    const letter = String.fromCharCode(letterCode++)
    font.set(letter, c)
  }

  return font
}

const FONTS: Record<FontFamily, Font> = {
  serif: new Map(), // this is just the default font
  'serif-bold': createFont(
    '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙',
    '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳',
    '𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗',
  ),
  'serif-italic': createFont(
    '𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍',
    '𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧',
  ),
  'serif-italic-bold': createFont(
    '𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁',
    '𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛',
  ),
  sans: createFont(
    '𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹',
    '𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓',
    '𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫',
  ),
  'sans-italic': createFont(
    '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡',
    '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻',
  ),
  'sans-bold': createFont(
    '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭',
    '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇',
    '𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵',
  ),
  'sans-italic-bold': createFont(
    '𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕',
    '𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯',
  ),
  script: createFont(
    '𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵',
    '𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏',
  ),
  'script-bold': createFont(
    '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩',
    '𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃',
  ),
  fraktur: createFont(
    '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ',
    '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷',
  ),
  'fraktur-bold': createFont(
    '𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅',
    '𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟',
  ),
  monospace: createFont(
    '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉',
    '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣',
    '𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿',
  ),
  'double-struck': createFont(
    '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ',
    '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫',
    '𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡',
  ),
}
