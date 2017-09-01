const t = require('babel-types')
const DomBuilder = require('./DomBuilder')
const createTextNode = require('./createTextNode')

module.exports = function() {
	return {
		visitor: {
			CallExpression: transform
		}
	}
}

function transform(path, state) {
	if(!path.node || !path.node.callee) {
		return
	}

	const node = path.node.callee
	const args = path.node.arguments || [ ]
	let kind = null

	if(node.name === 'dom') {
		if(args.length === 0) {
			return
		}

		kind = args.shift().value
	} else {
		if(!node.object || node.object.name !== 'dom' || !node.property) {
			return
		}

		kind = node.property.name
	}

	if(kind === 'text') {
		path.replaceWith(createTextNode(...args))
		return
	} else if(args.length === 0) {
		path.replaceWithSourceString(`document.createElement('${kind}')`)
		return
	}

	const builder = new DomBuilder(path, kind)
	builder.build(args)
	builder.finalize(path)
}
