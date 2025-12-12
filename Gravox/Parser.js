class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    peek() {
        return this.tokens[this.current];
    }

    isAtEnd() {
        return this.peek().type === 'EOF';
    }

    advance() {
        if (!this.isAtEnd()) this.current++;
        return this.tokens[this.current - 1];
    }

    check(type) {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    match(...types) {
        for (let type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    consume(type, message) {
        if (this.check(type)) return this.advance();
        throw new Error(message + " found " + this.peek().type);
    }

    parse() {
        let statements = [];
        while (!this.isAtEnd()) {
            statements.push(this.declaration());
        }
        return { type: 'Program', body: statements };
    }

    declaration() {
        // Variable Declaration: int x... OR int[] x...
        let isType = this.check('TYPE');
        if (isType) {
            let offset = 1;
            if (this.tokens[this.current + offset].type === 'LBRACKET') {
                if (this.tokens[this.current + offset + 1].type === 'RBRACKET') {
                    offset += 2;
                } else {
                    // Invalid array syntax, let it fall through or fail later
                }
            }
            
            if (this.tokens[this.current + offset].type === 'IDENTIFIER') {
                if (this.tokens[this.current + offset + 1].type === 'LPAREN') {
                    return this.functionDeclaration();
                } else {
                    return this.varDeclaration();
                }
            }
        }
        
        return this.statement();
    }

    varDeclaration() {
        let typeToken = this.advance(); // int/float...
        let typename = typeToken.value;
        // Check for array type declaration e.g. int[]
        if (this.match('LBRACKET')) {
            this.consume('RBRACKET', "Expect ']' after '[' in type declaration.");
            typename += "[]";
        }

        let name = this.consume('IDENTIFIER', "Expect variable name.");
        let initializer = null;
        if (this.match('ASSIGN')) {
            initializer = this.expression();
        }
        this.consume('SEMICOLON', "Expect ';' after variable declaration.");
        return { type: 'VarDeclaration', varType: typename, name: name.value, initializer };
    }

    functionDeclaration() {
        let retType = this.advance();
        let name = this.consume('IDENTIFIER', "Expect function name.");
        this.consume('LPAREN', "Expect '(' after function name.");
        let params = [];
        if (!this.check('RPAREN')) {
            do {
                let type = this.consume('TYPE', "Expect parameter type.");
                let paramName = this.consume('IDENTIFIER', "Expect parameter name.");
                params.push({ type: type.value, name: paramName.value });
            } while (this.match('COMMA'));
        }
        this.consume('RPAREN', "Expect ')' after parameters.");
        let body = this.block();
        return { type: 'FunctionDeclaration', retType: retType.value, name: name.value, params, body };
    }

    statement() {
        if (this.match('KEYWORD')) {
            let keyword = this.tokens[this.current - 1].value;
            if (keyword === 'if') return this.ifStatement();
            if (keyword === 'while') return this.whileStatement();
            if (keyword === 'for') return this.forStatement();
            if (keyword === 'show') return this.showStatement();
            // TODO: return, etc.
        }
        if (this.check('LBRACE')) return this.block();

        return this.expressionStatement();
    }

    ifStatement() {
        this.consume('LPAREN', "Expect '(' after 'if'.");
        let condition = this.expression();
        this.consume('RPAREN', "Expect ')' after if condition.");
        let thenBranch = this.statement();
        let elseBranch = null;
        if (this.match('KEYWORD') && this.tokens[this.current - 1].value === 'else') {
            elseBranch = this.statement();
        }
        return { type: 'IfStatement', condition, thenBranch, elseBranch };
    }

    whileStatement() {
        this.consume('LPAREN', "Expect '(' after 'while'.");
        let condition = this.expression();
        this.consume('RPAREN', "Expect ')' after condition.");
        let body = this.statement();
        return { type: 'WhileStatement', condition, body };
    }

    forStatement() {
        this.consume('LPAREN', "Expect '(' after 'for'.");
        let variable = this.consume('IDENTIFIER', "Expect variable name after 'for'.");
        if (this.match('KEYWORD') && this.tokens[this.current - 1].value === 'in') {
             // Correctly consumed 'in'
        } else {
             throw new Error("Expect 'in' after variable.");
        }
        
        if (this.match('KEYWORD') && this.tokens[this.current - 1].value === 'range') {
             // Correctly consumed 'range'
        } else {
             throw new Error("Expect 'range' after 'in'.");
        }

        this.consume('LPAREN', "Expect '(' after 'range'.");
        let start = this.expression();
        this.consume('COMMA', "Expect ',' after start value.");
        let end = this.expression();
        this.consume('RPAREN', "Expect ')' after range arguments.");
        this.consume('RPAREN', "Expect ')' after loop header.");
        
        let body = this.statement();
        return { type: 'ForStatement', variable: variable.value, start, end, body };
    }

    showStatement() {
        this.consume('LPAREN', "Expect '(' after 'show'.");
        let args = [];
        if (!this.check('RPAREN')) {
            do {
                args.push(this.expression());
            } while (this.match('COMMA'));
        }
        this.consume('RPAREN', "Expect ')' after value.");
        this.consume('SEMICOLON', "Expect ';' after value.");
        return { type: 'ShowStatement', args };
    }

    block() {
        this.consume('LBRACE', "Expect '{' before block.");
        let statements = [];
        while (!this.check('RBRACE') && !this.isAtEnd()) {
            statements.push(this.declaration());
        }
        this.consume('RBRACE', "Expect '}' after block.");
        return { type: 'Block', body: statements };
    }

    expressionStatement() {
        let expr = this.expression();
        this.consume('SEMICOLON', "Expect ';' after expression.");
        return { type: 'ExpressionStatement', expression: expr };
    }

    expression() {
        return this.assignment();
    }

    assignment() {
        let expr = this.equality();

        if (this.match('ASSIGN')) {
            let equals = this.tokens[this.current - 1];
            let value = this.assignment();

            if (expr.type === 'Variable') {
                return { type: 'Assignment', name: expr.name, value: value };
            }

            throw new Error("Invalid assignment target.");
        }

        return expr;
    }

    equality() {
        let expr = this.comparison();
        while (this.match('EQUALS')) { // Add != later
            let operator = this.tokens[this.current - 1].value;
            let right = this.comparison();
            expr = { type: 'Binary', left: expr, operator, right };
        }
        return expr;
    }

    comparison() {
        let expr = this.term();
        while (this.match('LESS', 'GREATER')) { // Add <= >= later
            let operator = this.tokens[this.current - 1].value;
            let right = this.term();
            expr = { type: 'Binary', left: expr, operator, right };
        }
        return expr;
    }

    term() {
        let expr = this.factor();
        while (this.match('PLUS', 'MINUS')) {
            let operator = this.tokens[this.current - 1].value;
            let right = this.factor();
            expr = { type: 'Binary', left: expr, operator, right };
        }
        return expr;
    }

    factor() {
        let expr = this.unary();
        while (this.match('MULTIPLY', 'DIVIDE')) {
            let operator = this.tokens[this.current - 1].value;
            let right = this.unary();
            expr = { type: 'Binary', left: expr, operator, right };
        }
        return expr;
    }

    unary() {
        if (this.match('MINUS')) {
            let operator = '-';
            let right = this.unary();
            return { type: 'Unary', operator, right };
        }
        return this.primary();
    }

    primary() {
        if (this.match('NUMBER')) return { type: 'Literal', value: parseFloat(this.tokens[this.current - 1].value) };
        if (this.match('STRING')) return { type: 'Literal', value: this.tokens[this.current - 1].value };
        if (this.match('BOOLEAN')) return { type: 'Literal', value: this.tokens[this.current - 1].value === 'true' };
        if (this.match('IDENTIFIER')) return { type: 'Variable', name: this.tokens[this.current - 1].value };
        if (this.match('LPAREN')) {
            let expr = this.expression();
            this.consume('RPAREN', "Expect ')' after expression.");
            return expr;
        }
        if (this.match('LBRACKET')) {
            let elements = [];
            if (!this.check('RBRACKET')) {
                do {
                    elements.push(this.expression());
                } while (this.match('COMMA'));
            }
            this.consume('RBRACKET', "Expect ']' after array elements.");
            return { type: 'ArrayLiteral', elements };
        }
        throw new Error("Expect expression.");
    }
}

module.exports = Parser;
