const t = require('@babel/types')

module.exports = function createTextNode(...args) {
	if(
		args.length === 1
		&& args[0].type === 'CallExpression'
		&& args[0].arguments.length > 0
		&& args[0].arguments[0].name === '$domInternal'
	) {
		args[0].arguments = args[0].arguments.slice(1)
		return args[0]
	}

	return t.callExpression(
		t.memberExpression(
			t.identifier('document'),
			t.identifier('createTextNode')
		),
		args
	)
}
