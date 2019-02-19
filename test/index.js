const test = require('ava')
const plugin = require('../lib/index')
const { transform } = require('babel-core')
const readdir = require('recursive-readdir-sync')
const path = require('path')
const fs = require('fs')
const { JSDOM } = require("jsdom")

const { window } = new JSDOM(``, { runScripts: 'outside-only' })
const options = {
	plugins: [
		[ 'babel-plugin-transform-react-jsx', { pragma: 'dom.jsx' } ],
		plugin
	]
}

const fixtures = `${__dirname}/fixtures`

const files = readdir(fixtures).sort((a, b) => {
	const ain = a.includes('.in.')
	const bin = b.includes('.in.')

	if(ain && !bin) {
		return -1
	} else if(!ain && bin) {
		return 1
	}

	return a.localeCompare(b)
})

const candidates = new Set
const tests = new Set

for(const file of files) {
	if(file.endsWith('in.js')) {
		candidates.add(file)
		continue
	} else if(!file.endsWith('.out.js')) {
		continue
	}

	const inFile = `${file.substring(0, file.length - 7)}.in.js`
	const htmlFile = `${file.substring(0, file.length - 7)}.html`

	if(!candidates.has(inFile)) {
		continue
	}

	tests.add({
		in: inFile,
		out: file,
		html: htmlFile
	})
}

for(const { in: inFile, out: outFile, html: htmlFile } of Array.from(tests).sort()) {
	let name = path.relative(fixtures, inFile)
	name = name.substring(0, name.length - 6)

	test(name, t => {
		const transformed = transform(fs.readFileSync(inFile), options).code

		t.is(
			fs.readFileSync(outFile).toString().trim(),
			transformed.trim()
		)

		if(!fs.existsSync(htmlFile)) {
			return
		}

		const element = window.eval(transformed)
		if(!element || !element.nodeType) {
			t.fail('Missing rendered HTML value')
		}

		const value = element.nodeType === 3 ? element.textContent : element.outerHTML

		t.is(
			fs.readFileSync(htmlFile).toString().trim().replace(/[\n\t]/g, ''),
			value.trim()
		)
	})
}

