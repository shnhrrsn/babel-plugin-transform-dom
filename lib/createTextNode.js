const t = require('babel-types')

module.exports = function createTextNode(...args) {
	return t.callExpression(
		t.memberExpression(
			t.identifier('document'),
			t.identifier('createTextNode')
		),
		args
	)
}
