import path from 'path'
import postcss from 'postcss'

export default postcss.plugin('postcss-prefix', fileNamePrefix)

function fileNamePrefix (options = {}) {
  return function (root) {
    let filePath = root.source.input.file
    let fileName = path.basename(filePath)

    if (ignoreFileName(fileName)) return

    let prefix = fileName.split('.')[0] + '-'

    root.walkRules((rule) => {
      if (!rule.selectors) return rule

      rule.selectors = rule.selectors.map((selector) => {
        if (!isClassSelector(selector)) return selector

        return selector
          .split('.')
          .map((className) => {
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
    return ignore.some((test) => {
      if (test instanceof RegExp) return test.exec(className)

      return className === test
    })
  }

  return className === ignore
}

function isClassSelector (selector) {
  return selector.indexOf('.') === 0
}
