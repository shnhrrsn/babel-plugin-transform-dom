<p align="center">
<a href="https://travis-ci.org/shnhrrsn/babel-plugin-transform-dom"><img src="https://img.shields.io/travis/shnhrrsn/babel-plugin-transform-dom.svg" alt="Build Status"></a>
<a href="https://www.npmjs.com/package/babel-plugin-transform-dom"><img src="https://img.shields.io/npm/dt/babel-plugin-transform-dom.svg" alt="Total Downloads"></a>
<a href="https://www.npmjs.com/package/babel-plugin-transform-dom"><img src="https://img.shields.io/npm/v/babel-plugin-transform-dom.svg" alt="Latest Version"></a>
<a href="https://www.npmjs.com/package/babel-plugin-transform-dom"><img src="https://img.shields.io/npm/l/babel-plugin-transform-dom.svg" alt="License"></a>
</p>

# babel-plugin-transform-dom

`babel-plugin-transform-dom` provides a `dom` interface while writing code that will transform to `document.createElement` and friends when you process through Babel.

## Documentation

The method you invoke on `dom` will be your HTML tag, so `dom.span` becomes `<span>` and `dom.fake` will become `<fake>`.

The only exception to this `dom.text` which will reaturen a text node.

## Arguments

The order of the arguments you pass to `dom.tag` doesn’t matter.  Here’s a list of acceptable arguments:

* Class name, as indicated by a string started with a period
* ID, as indicated by a string started with a number sign
* Text content for the tag, any string that does not start with a period or number sign
* Child elements to add to your tag.  These can be passed as top level args or in as an array of args
* Tag attributes via the optiosns argument: `{ attributes: { text: "hello" } }`

You can also nest `dom.tag` calls to create complex trees.

### Alternative Invocation

Rather than calling `dom.div`, you can also call `dom('div')`.  When you invoke with the tag as an argument, everything above is true except the first argument _must_ always be the tag name.  After the first argument the order of arguments do not matter.

## Example

Here’s an example of creating a simple span element with a class and some text:

#### In
```js
const hello = dom.div('.hello', 'Hello there!')
```

#### Out
```js
var _div;

const hello = (_div = document.createElement('div'), _div.classList.add('hello'), _div.appendChild(document.createTextNode('Hello there!')), _div);
```

---

Here’s a more complex example:

#### In
```js

const body = dom.body(
  '.page',
  dom.h1('Title', '#header'),
  dom.div(
    '.content',
    dom.p('Paragraph 1'),
    dom.p('Paragraph 2', '.small')
  ),
  dom.aside('#sidebar', {
    attributes: {
      'data-affixed': '.content'
    }
  }, dom.span('.sidebar-content .sticky', dom.p('Sidebar')))
)

```

#### Out
```js
var _h, _div, _p, _p2, _aside, _span, _p3;

var _body = document.createElement('body');

_body.classList.add('page');

_body.appendChild((_h = document.createElement('h1'), _h.appendChild(document.createTextNode('Title')), _h.setAttribute('id', 'header'), _h));

_body.appendChild((_div = document.createElement('div'), _div.classList.add('content'), _div.appendChild((_p = document.createElement('p'), _p.appendChild(document.createTextNode('Paragraph 1')), _p)), _div.appendChild((_p2 = document.createElement('p'), _p2.appendChild(document.createTextNode('Paragraph 2')), _p2.classList.add('small'), _p2)), _div));

_body.appendChild((_aside = document.createElement('aside'), _aside.setAttribute('id', 'sidebar'), _aside.setAttribute('data-affixed', '.content'), _aside.appendChild((_span = document.createElement('span'), _span.classList.add('sidebar-content', 'sticky'), _span.appendChild((_p3 = document.createElement('p'), _p3.appendChild(document.createTextNode('Sidebar')), _p3)), _span)), _aside));

const body = _body;
```

## JSX

You can also use `babel-plugin-transform-dom` to compile JSX!  To enable control over JSX, just use `dom.jsx` as the JSX pragma and make sure to add `babel-plugin-transform-dom` _after_ jsx in your plugins list:

*.babelrc*
```json
{
  "plugins": [
    [ "transform-react-jsx", { "pragma": "dom.jsx" } ],
    "transform-dom"
  ]
}
```

### Example

#### In

```jsx
var profile = <div>
  <img src="avatar.png" class="profile" />
  <h3>{[user.firstName, user.lastName].join(' ')}</h3>
</div>;
```

#### Out

```js
var _img, _h, _div;

var profile = (_div = document.createElement("div"), _div.appendChild((_img = document.createElement("img"), _img.setAttribute("src", "avatar.png"), _img.setAttribute("class", "profile"), _img)), _div.appendChild((_h = document.createElement("h3"), _h.appendChild(document.createTextNode([user.firstName, user.lastName].join(' '))), _h)), _div);
```

## License

`babel-plugin-transform-dom` was created by [Shaun Harrison](https://github.com/shnhrrsn) and is made available under the [MIT license](LICENSE).
