const test = require('ava')
const plugin = require('../lib/index')
const { transform } = require('babel-core')
const readdir = require('recursive-readdir-sync')
const path = require('path')
const fs = require('fs')

const options = {
	plugins: [ plugin ]
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

	if(!candidates.has(inFile)) {
		continue
	}

	tests.add({
		in: inFile,
		out: file
	})
}

for(const { in: inFile, out: outFile } of Array.from(tests).sort()) {
	let name = path.relative(fixtures, inFile)
	name = name.substring(0, name.length - 6)

	test(name, t => {
		t.is(
			transform(fs.readFileSync(inFile), options).code.trim(),
			fs.readFileSync(outFile).toString().trim()
		)
	})
}

