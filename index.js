var path = require('path')
var postcss = require('postcss')

module.exports = postcss.plugin('postcss-prefix', fileNamePrefix)

function fileNamePrefix (options) {
  options = options || {}
  return function (root) {
    var filePath = root.source.input.file
    var fileName = path.basename(filePath)
    var name = fileName.split('.')[0]
    if (name === 'index') {
      var parts = filePath.split('/')
      name = parts[parts.length - 2]
    }

    if (ignoreFileName(name)) return

    var prefix = name + '-'

    root.walkRules(function (rule) {
      if (!rule.selectors) return rule

      rule.selectors = rule.selectors.map(function (selector) {
        if (!isClassSelector(selector)) return selector

        return selector
          .split('.')
          .map(function (className) {
            if (/^root/.test(className)) return className.replace(/^root/, name)

            if (ignoreClassName(className, options)) return className

            return prefix + className
          })
          .join('.')
      })
    })
  }
}

function ignoreFileName (fileName) {
  return /^[^A-Z]/.test(fileName)
}

function ignoreClassName (className, options) {
  return classMatchesTest(className, options.ignore) ||
    className.trim().length === 0 || /^[A-Z-]/.test(className)
}

function classMatchesTest (className, ignore) {
  if (!ignore) return false

  className = className.trim()

  if (ignore instanceof RegExp) return ignore.exec(className)

  if (Array.isArray(ignore)) {
    return ignore.some(function (test) {
      if (test instanceof RegExp) return test.exec(className)

      return className === test
    })
  }

  return className === ignore
}

function isClassSelector (selector) {
  return selector.indexOf('.') === 0
}
