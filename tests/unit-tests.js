const esprima = require('esprima');
const escodegen = require('escodegen');
const fs = require('fs');
const should = require('should');

//   This is how far we're naviaging in this code:
//
const index = fs.readFileSync(`${__dirname}/../src/index.js`).toString()
let program = esprima.parse(index)
let mainBody = program.body[2].expression.callee.body.body
//
//   "use strict";
//   let server
//   (function() {
//     const http = require('http');
//
//   ^^^ Right there
//   If that code changes, this needs to change

mainBody.forEach((item) => {
	if (item.type === "VariableDeclaration") {
		// we need to remove 'let' and 'const' from variable declarations so 
		// that we can throw all of the functions from the source in global 
		// scope

		let name = item.declarations[0].id.name

		let src = `${name} = ${escodegen.generate(item.declarations[0].init)}`
		eval(src)
		return

	} else if (item.type === "ExpressionStatement") {
		if (item.expression.type === "AssignmentExpression") {
			let name = item.expression.left.name
			if (name === "server") {
				// we don't test the server here.
				return
			}			
		}
	}
	let src = escodegen.generate(item)
	eval(src)
})

describe("Parsing and eval confirmation", function() {
	it("Should put imports in global scope", function(done) {
		const httpForTest = require('http')
		should.deepEqual(httpForTest, http)
		done();
	})
	it("Should have color map in global scope", function(done) {
		should.exist(colors)
		colors.c.should.be.exactly('e63')
		done();
	})
})


describe("Password hashing", function() {
	let passwordHash;
	let password = "password";
	it("Should be able to generate a password", function(done) {
		passwordHash = genPassword(password)
		should.exist(passwordHash)
		done();
	})
	it("Should be able to correctly check password", function(done) {
		should.equal(
			checkPassword(password, passwordHash), 
			true
		)
		done();
	})
})
