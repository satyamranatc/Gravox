#!/usr/bin/env node

const fs = require('fs');
const Lexer = require('./Lexer');
const Parser = require('./Parser');
const Interpreter = require('./Interpreter');

const args = process.argv.slice(2);

if (args.length < 2 || args[0] !== 'run') {
    console.error("Usage: gravox run <filename.gvx>");
    process.exit(1);
}

const filePath = args[1];

if (!fs.existsSync(filePath)) {
    console.error(`Error: File '${filePath}' not found.`);
    process.exit(1);
}

const code = fs.readFileSync(filePath, 'utf8');
const lexer = new Lexer(code);
const tokens = lexer.tokenize();
const parser = new Parser(tokens);
const ast = parser.parse();

// console.log("AST:", JSON.stringify(ast, null, 2));

// console.log("Output:");
const interpreter = new Interpreter();
interpreter.interpret(ast);
