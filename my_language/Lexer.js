class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.char = this.input[this.position];
    this.tokens = [];
  }

  advance() {
    this.position++;
    this.char =
      this.position < this.input.length ? this.input[this.position] : null;
  }

  peek() {
    let peekPos = this.position + 1;
    return peekPos < this.input.length ? this.input[peekPos] : null;
  }

  skipWhitespace() {
    while (this.char !== null && /\s/.test(this.char)) {
      this.advance();
    }
  }

  isAlpha(char) {
    return /[a-zA-Z_]/.test(char);
  }

  isDigit(char) {
    return /\d/.test(char);
  }

  readIdentifier() {
    let start = this.position;
    while (
      this.char !== null &&
      (this.isAlpha(this.char) || this.isDigit(this.char))
    ) {
      this.advance();
    }
    return this.input.slice(start, this.position);
  }

  readNumber() {
    let start = this.position;
    while (this.char !== null && this.isDigit(this.char)) {
      this.advance();
    }
    // Handle float
    if (this.char === "." && this.isDigit(this.peek())) {
      this.advance();
      while (this.char !== null && this.isDigit(this.char)) {
        this.advance();
      }
    }
    return this.input.slice(start, this.position);
  }

  readString() {
    this.advance(); // Skip opening quote
    let start = this.position;
    while (this.char !== null && this.char !== '"') {
      this.advance();
    }
    let str = this.input.slice(start, this.position);
    this.advance(); // Skip closing quote
    return str;
  }

  tokenize() {
    while (this.char !== null) {
      if (/\s/.test(this.char)) {
        this.skipWhitespace();
        continue;
      }

      if (this.isAlpha(this.char)) {
        let text = this.readIdentifier();
        let type = this.getKeywordType(text) || "IDENTIFIER";
        this.tokens.push({ type, value: text });
        continue;
      }

      if (this.isDigit(this.char)) {
        this.tokens.push({ type: "NUMBER", value: this.readNumber() });
        continue;
      }

      if (this.char === '"') {
        this.tokens.push({ type: "STRING", value: this.readString() });
        continue;
      }

      // Single and Double character operators
      if (this.char === "=") {
        if (this.peek() === "=") {
          this.tokens.push({ type: "EQUALS", value: "==" });
          this.advance();
          this.advance();
        } else {
          this.tokens.push({ type: "ASSIGN", value: "=" });
          this.advance();
        }
        continue;
      }

      switch (this.char) {
        case '{': this.tokens.push({ type: 'LBRACE', value: '{' }); break;
        case '}': this.tokens.push({ type: 'RBRACE', value: '}' }); break;
        case '[': this.tokens.push({ type: 'LBRACKET', value: '[' }); break;
        case ']': this.tokens.push({ type: 'RBRACKET', value: ']' }); break;
        case '(': this.tokens.push({ type: 'LPAREN', value: '(' }); break;
        case ")":
          this.tokens.push({ type: "RPAREN", value: ")" });
          break;
        case ";":
          this.tokens.push({ type: "SEMICOLON", value: ";" });
          break;
        case ",":
          this.tokens.push({ type: "COMMA", value: "," });
          break;
        case "+":
          this.tokens.push({ type: "PLUS", value: "+" });
          break;
        case "-":
          this.tokens.push({ type: "MINUS", value: "-" });
          break;
        case "*":
          this.tokens.push({ type: "MULTIPLY", value: "*" });
          break;
        case "/": // Check for comments
          if (this.peek() === "/") {
            while (this.char !== null && this.char !== "\n") this.advance();
            break; // Skip comment
          }
          this.tokens.push({ type: "DIVIDE", value: "/" });
          break;
        case "<":
          this.tokens.push({ type: "LESS", value: "<" });
          break;
        case ">":
          this.tokens.push({ type: "GREATER", value: ">" });
          break;
        default:
          console.error(`Unknown character: ${this.char}`);
      }
      this.advance();
    }
    this.tokens.push({ type: "EOF", value: null });
    return this.tokens;
  }

  getKeywordType(text) {
    const keywords = {
      int: "TYPE",
      float: "TYPE",
      string: "TYPE",
      bool: "TYPE",
      any: "TYPE",
      if: "KEYWORD",
      else: "KEYWORD",
      while: "KEYWORD",
      for: "KEYWORD",
      in: "KEYWORD",
      range: "KEYWORD",
      return: "KEYWORD",
      show: "KEYWORD",
      true: "BOOLEAN",
      false: "BOOLEAN",
    };
    return keywords[text];
  }
}

module.exports = Lexer;
