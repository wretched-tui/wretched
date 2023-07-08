/**
 * colors.js - color-related functions for blessed.
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

var colorNames = {
  // special
  default: -1,
  normal: -1,
  bg: -1,
  fg: -1,
  // normal
  black: 0,
  red: 1,
  green: 2,
  yellow: 3,
  blue: 4,
  magenta: 5,
  cyan: 6,
  white: 7,
  // bright
  brightblack: 8,
  grey: 8,
  gray: 8,
  brightred: 9,
  brightgreen: 10,
  brightyellow: 11,
  brightblue: 12,
  brightmagenta: 13,
  brightcyan: 14,
  brightwhite: 15,
}

// Seed all 256 colors. Assume xterm defaults.
// Ported from the xterm color generation script.
const [indexToRGB, indexToHexString] = (function () {
  var rgb = [],
    hex = [],
    r,
    g,
    b,
    i,
    l
  const xtermColors = [
    '#000000', // black
    '#cd0000', // red3
    '#00cd00', // green3
    '#cdcd00', // yellow3
    '#0000ee', // blue2
    '#cd00cd', // magenta3
    '#00cdcd', // cyan3
    '#e5e5e5', // gray90
    '#7f7f7f', // gray50
    '#ff0000', // red
    '#00ff00', // green
    '#ffff00', // yellow
    '#5c5cff', // rgb:5c/5c/ff
    '#ff00ff', // magenta
    '#00ffff', // cyan
    '#ffffff', // white
  ]

  function set(i, r, g, b) {
    rgb[i] = [r, g, b]
    hex[i] = '#' + toHex2(r) + toHex2(g) + toHex2(b)
  }

  // 0 - 15
  xtermColors.forEach(function (c, i) {
    c = parseInt(c.substring(1), 16)
    set(i, (c >> 16) & 0xff, (c >> 8) & 0xff, c & 0xff)
  })

  // 16 - 231
  for (r = 0; r < 6; r++) {
    for (g = 0; g < 6; g++) {
      for (b = 0; b < 6; b++) {
        i = 16 + r * 36 + g * 6 + b
        set(i, r ? r * 51 : 0, g ? g * 51 : 0, b ? b * 51 : 0)
      }
    }
  }

  // 232 - 255 are grey.
  for (g = 0; g < 24; g++) {
    l = g * 10 + 8
    i = 232 + g
    set(i, l, l, l)
  }

  return [rgb, hex]
})()

const _cache = {}
exports.match = function (r1, g1, b1, lookup = indexToRGB) {
  if (typeof r1 === 'string') {
    const colorName = r1.replace(/[\- ]/g, '').toLowerCase()
    if (colorNames[colorName] != null) {
      return colorNames[colorName]
    }

    var hex = r1
    if (hex[0] !== '#') {
      return -1
    }

    ;[r1, g1, b1] = exports.hexToRGB(hex)
  } else if (Array.isArray(r1)) {
    ;(b1 = r1[2]), (g1 = r1[1]), (r1 = r1[0])
  }

  var hash = (r1 << 16) | (g1 << 8) | b1

  if (_cache[hash] !== undefined) {
    return _cache[hash]
  }

  var ldiff = Infinity,
    li = -1

  for (let i = 0; i < lookup.length; i++) {
    const c = lookup[i]
    const r2 = c[0]
    const g2 = c[1]
    const b2 = c[2]

    const diff = colorDistance(r1, g1, b1, r2, g2, b2)

    if (diff === 0) {
      li = i
      break
    }

    if (diff < ldiff) {
      ldiff = diff
      li = i
    }
  }

  return (_cache[hash] = li)
}
exports.indexToRGB = indexToRGB
exports.indexToHexString = indexToHexString

exports.RGBToHex = function (r, g, b) {
  if (Array.isArray(r)) {
    ;(b = r[2]), (g = r[1]), (r = r[0])
  }

  return '#' + toHex2(r) + toHex2(g) + toHex2(b)
}

exports.hexToRGB = function (hex) {
  if (hex[0] !== '#') {
    hex = '#' + hex
  }

  // #rgb
  if (hex.length === 4) {
    hex = hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
  }

  var col = parseInt(hex.substring(1), 16),
    r = (col >> 16) & 0xff,
    g = (col >> 8) & 0xff,
    b = col & 0xff

  return [r, g, b]
}

// As it happens, comparing how similar two colors are is really hard. Here is
// one of the simplest solutions, which doesn't require conversion to another
// color space, posted on stackoverflow[1]. Maybe someone better at math can
// propose a superior solution.
// [1] http://stackoverflow.com/questions/1633828

function colorDistance(r1, g1, b1, r2, g2, b2) {
  return (
    Math.pow(30 * (r1 - r2), 2) +
    Math.pow(59 * (g1 - g2), 2) +
    Math.pow(11 * (b1 - b2), 2)
  )
}

// Map higher colors to the first 8 colors.
// This allows translation of high colors to low colors on 8-color terminals.
const lowResColors = (function () {
  const lookupCopy = indexToRGB.slice(0, 8)
  return indexToHexString.map(color =>
    exports.match(color, undefined, undefined, lookupCopy),
  )
})()

exports.reduce = function (color, total) {
  if (total <= 16) {
    return color >= 16 ? lowResColors[color] : color
  } else if (total <= 8) {
    return color >= 8 ? color - 8 : color
  } else if (total <= 2) {
    return color % 2
  }

  return color
}

function toHex2(n) {
  n = n.toString(16)
  if (n.length < 2) n = '0' + n
  return n
}
