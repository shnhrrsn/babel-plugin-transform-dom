const t = require('babel-types')
const createTextNode = require('./createTextNode')
const svgNs = 'http://www.w3.org/2000/svg'
const svgTags = new Set([
	'svg', 'circle', 'clipPath', 'defs', 'g', 'gylph', 'line', 'linearGradient', 'path',
	'polygon', 'radialGradient', 'rect',

	'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
	'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood',
	'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge',
	'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
	'feSpotLight', 'feTile', 'feTurbulence',
])

class DomBuilder {

	constructor(path, kind, { jsx = false } = { }) {
		this.path = path
		this.element = path.scope.generateUidIdentifier(kind)
		this.statements = [ ]
		this.jsx = jsx
		this.createElement = t.identifier('createElement')
		this.createElementArgs = [ t.stringLiteral(kind) ]
		this.hasNamespace = false

		if(svgTags.has(kind)) {
			this.createElement.name = 'createElementNS'
			this.createElementArgs.unshift(t.stringLiteral(svgNs))
			this.hasNamespace = true
		}

		this.statements.push(t.variableDeclaration('var', [
			t.variableDeclarator(
				this.element,
				t.callExpression(
					t.memberExpression(
						t.identifier('document'),
						this.createElement
					),
					this.createElementArgs
				)
			)
		]))
	}

	build(args) {
		for(const arg of args) {
			if(typeof this[`build${arg.type}`] === 'function') {
				this[`build${arg.type}`](arg)
			} else {
				throw new Error(`Unexpected argument: ${arg.type}`)
			}
		}
	}

	buildStringLiteral(string) {
		const first = string.value.trim()[0]

		if(first === '.') {
			this.addClass(string)
		} else if(first === '#') {
			this.setId(string)
		} else {
			this.addText(string)
		}
	}

	buildTemplateLiteral(template) {
		// TODO: Try to parse templates for IDs and classes
		this.addText(template)
	}

	buildIdentifier(identifier) {
		if(!this.jsx) {
			throw new Error('Unexpected argument: Identifier')
		}

		this.append(createTextNode(identifier))
	}

	buildObjectExpression(object) {
		for(const attribute of object.properties) {
			let key = attribute.key

			if(!t.isStringLiteral(key) && !attribute.computed) {
				key = key.name
			}

			this.setAttribute(key, attribute.value)
		}
	}

	buildArrayExpression(children) {
		for(const child of children.elements) {
			this.append(child)
		}
	}

	buildCallExpression(child) {
		if(this.jsx) {
			this.addText(child)
		} else {
			this.append(child)
		}
	}

	buildNullLiteral() {
		// Ignore, needed for JSX
	}

	buildSequenceExpression(exp) {
		this.append(exp)
	}

	addClass(className) {
		let classes = null

		if(t.isStringLiteral(className)) {
			classes = className.value.replace(/\.(\b)/g, '$1').split(/\s+/).map(value => Object.assign({ },
				className,
				{ value }
			))
		} else {
			classes = [ className ]
		}

		this.add(t.callExpression(
			t.memberExpression(
				t.memberExpression(
					this.element,
					t.identifier('classList')
				),
				t.identifier('add')
			),
			classes
		))
	}

	setId(id) {
		if(t.isStringLiteral(id)) {
			id.value = id.value.replace(/#(\b)/g, '$1')
		}

		this.setAttribute('id', id)
	}

	addText(content) {
		this.append(createTextNode(content))
	}

	append(child) {
		this.add(t.callExpression(
			t.memberExpression(
				this.element,
				t.identifier('appendChild')
			),
			[ child ]
		))
	}

	setAttribute(attribute, value) {
		if(attribute === 'className') {
			attribute = 'class'
		}

		if(typeof attribute === 'string') {
			attribute = t.stringLiteral(attribute)
		}

		if(typeof value === 'string') {
			value = t.stringLiteral(value)
		}

		let method = null
		const args = [ attribute, value ]

		if(typeof attribute.value === 'string' && attribute.value.startsWith('on')) {
			attribute.value = attribute.value.substring(2).toLowerCase()

			if(attribute.value.endsWith('capture')) {
				attribute.value = attribute.value.substring(0, attribute.value.length - 7)
				args.push(t.booleanLiteral(true))
			}

			method = 'addEventListener'
		} else if(attribute.value === 'xmlns') {
			this.createElement.name = 'createElementNS'
			this.createElementArgs.unshift(value)
			this.hasNamespace = true
			return
		} else if(this.hasNamespace) {
			method = 'setAttributeNS'
			args.unshift(t.nullLiteral())
		} else {
			method = 'setAttribute'
		}

		this.add(t.callExpression(
			t.memberExpression(
				this.element,
				t.identifier(method)
			),
			args
		))
	}

	add(statement) {
		if(t.isExpression(statement)) {
			this.statements.push(t.expressionStatement(statement))
		} else {
			this.statements.push(statement)
		}
	}

	finalize(path) {
		path.replaceWithSourceString(this.element.name)

		if(this.statements.length > 0) {
			path.insertBefore(this.statements)
		}
	}

}

module.exports = DomBuilder
