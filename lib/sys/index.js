/**
 * wretched - a low-level terminal interface library for node.js
 *
 * based on blessed - a high-level terminal interface library for node.js
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/colinta/wretched
 */

function wretched() {
  return wretched.program.apply(null, arguments)
}

wretched.program = require('./program')
wretched.tput = require('./tput')
wretched.colors = require('./colors')
wretched.unicode = require('./unicode')

/**
 * Expose
 */

module.exports = wretched
