const t = require('babel-types')
const DomBuilder = require('./DomBuilder')

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

	if(!node.object || node.object.name !== 'dom' || !node.property) {
		return
	}

	if(node.property.name === 'text') {
		node.object.name = 'document'
		node.property.name = 'createTextNode'
		return
	}

	const args = path.node.arguments || [ ]

	if(args.length === 0) {
		path.replaceWithSourceString(`document.createElement('${node.property.name}')`)
		return
	}

	const builder = new DomBuilder(path, node.property.name)
	builder.build(args)
	builder.finalize(path)
}
