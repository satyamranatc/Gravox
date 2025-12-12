const Lexer = require('./Lexer');
const input = '[1, 2]';
const lexer = new Lexer(input);
const tokens = lexer.tokenize();
console.log(tokens);
