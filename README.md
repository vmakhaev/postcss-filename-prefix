# postcss-filename-prefix

A [PostCSS](https://github.com/postcss/postcss) plugin to prefix classes with corresponding filenames
The idea is to isolate styles in framework components

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

MyComponent.css

```css
.myclass { /* ... */ }
.-mymodifier { /* ... */ }
.Mycapitalclass { /* ... */ }
```

Output:

```css
.MyComponent-myclass { /* ... */ }
.-mymodifier { /* ... */ }
.Mycapitalclass { /* ... */ }
```

Ignores:
- filenames that starts from not capital letter
- modifiers (classes that starts from hyphen)
- classes that starts from capital letter

## Installation

```
npm install postcss-filename-prefix
```

## Usage

```javascript
var fs        = require('fs');
var postcss   = require('postcss');
var filenamePrefix = require('postcss-filename-prefix');

var css = fs.readFileSync('css/MyFile.css', 'utf8').toString();
var out = postcss()
          .use(filenamePrefix())
          .process(css);
```

### Using the `ignore` option

```javascript
var fs        = require('fs');
var postcss   = require('postcss');
var filenamePrefix = require('postcss-filename-prefix');

var css = fs.readFileSync('css/MyFile.css', 'utf8').toString();
var out = postcss()
          .use(filenamePrefix({ ignore: [/ng-/, 'some-class-to-ignore']}))
          .process(css);
```

## License

MIT

## Recommendation

* Use it with [react-prefix-loader](https://github.com/vmakhaev/react-prefix-loader) for React components

## Acknowledgements

* Inspired by [postcss-class-prefix](https://github.com/thompsongl/postcss-class-prefix)
