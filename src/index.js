import path from 'path'
import postcss from 'postcss'

const classNameRegex = /\.([a-z][a-zA-Z\d_\-]*)/g

export default postcss.plugin('postcss-prefix', fileNamePrefix)

function fileNamePrefix (options = {}) {
  return function (root) {
    let filePath = root.source.input.file
    let fileName = path.basename(filePath)
    let [name] = fileName.split('.')
    if (name === 'index') {
      let parts = filePath.split(path.sep)
      name = parts[parts.length - 2]
    }

    if (ignoreFileName(fileName)) return

    let prefix = name + '-'

    root.walkRules((rule) => {
      if (!rule.selectors) return rule

      rule.selectors = rule.selectors.map((selector) => {
        if (!isClassSelector(selector)) return selector

        return selector.replace(classNameRegex, (match, className) => {
          if (ignoreClassName(className, options)) return '.' + className
          if (className === 'root') return '.' + name
          return '.' + prefix + className
        })
      })
    })
  }
}

function ignoreFileName (fileName) {
  // ignore files not beginning with capital letter
  // ignore css module files to avoid conflict
  return /^[^A-Z]/.test(fileName) || /(?:\.module).(css|sass|scss|less|styl)(?:.*)$/.test(fileName);
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
