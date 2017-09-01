const t = require('babel-types')
const createTextNode = require('./createTextNode')

class DomBuilder {

	constructor(path, kind, { jsx = false } = { }) {
		this.path = path
		this.element = path.scope.generateUidIdentifier(kind)
		this.statements = [ ]
		this.jsx = jsx

		this.statements.push(t.variableDeclaration('var', [
			t.variableDeclarator(
				this.element,
				t.callExpression(
					t.memberExpression(
						t.identifier('document'),
						t.identifier('createElement')
					),
					[ t.stringLiteral(kind) ]
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
		if(typeof attribute === 'string') {
			attribute = t.stringLiteral(attribute)
		}

		if(typeof value === 'string') {
			value = t.stringLiteral(value)
		}

		this.add(t.callExpression(
			t.memberExpression(
				this.element,
				t.identifier('setAttribute')
			),
			[ attribute, value ]
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
