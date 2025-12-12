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
        // Import Statement: import { items } from "file.gvx"
        if (this.check('KEYWORD') && this.peek().value === 'import') {
            return this.importStatement();
        }
        
        // Function Declaration: action name(...) { }
        if (this.check('KEYWORD') && this.peek().value === 'action') {
            return this.actionDeclaration();
        }
        
        // Alias Statement: use funcName as newName
        if (this.check('KEYWORD') && this.peek().value === 'use') {
            return this.aliasStatement();
        }
        
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

    actionDeclaration() {
        this.advance(); // consume 'action'
        let name = this.consume('IDENTIFIER', "Expect function name.");
        this.consume('LPAREN', "Expect '(' after function name.");
        let params = [];
        if (!this.check('RPAREN')) {
            do {
                let type = this.consume('TYPE', "Expect parameter type.");
                let paramName = this.consume('IDENTIFIER', "Expect parameter name.");
                let defaultValue = null;
                // Check for default parameter: param = value
                if (this.match('ASSIGN')) {
                    defaultValue = this.expression();
                }
                params.push({ type: type.value, name: paramName.value, defaultValue });
            } while (this.match('COMMA'));
        }
        this.consume('RPAREN', "Expect ')' after parameters.");
        let body = this.block();
        return { type: 'ActionDeclaration', name: name.value, params, body };
    }

    aliasStatement() {
        this.advance(); // consume 'use'
        let originalName = this.consume('IDENTIFIER', "Expect function name after 'use'.");
        if (this.match('KEYWORD') && this.tokens[this.current - 1].value === 'as') {
            // Correctly consumed 'as'
        } else {
            throw new Error("Expect 'as' after function name.");
        }
        let aliasName = this.consume('IDENTIFIER', "Expect alias name after 'as'.");
        this.consume('SEMICOLON', "Expect ';' after alias statement.");
        return { type: 'AliasStatement', originalName: originalName.value, aliasName: aliasName.value };
    }

    importStatement() {
        this.advance(); // consume 'import'
        
        let imports = [];
        let source = null;
        
        // Check for named imports: import { ... } from "file"
        if (this.match('LBRACE')) {
            if (!this.check('RBRACE')) {
                do {
                    let itemName = this.consume('IDENTIFIER', "Expect import item name.");
                    let alias = null;
                    
                    // Check for renaming: item as newName
                    if (this.match('KEYWORD') && this.tokens[this.current - 1].value === 'as') {
                        alias = this.consume('IDENTIFIER', "Expect alias name after 'as'.");
                    }
                    
                    imports.push({
                        name: itemName.value,
                        alias: alias ? alias.value : null
                    });
                } while (this.match('COMMA'));
            }
            this.consume('RBRACE', "Expect '}' after import items.");
            
            // Expect 'from'
            if (this.match('KEYWORD') && this.tokens[this.current - 1].value === 'from') {
                // Correctly consumed 'from'
            } else {
                throw new Error("Expect 'from' after import items.");
            }
            
            source = this.consume('STRING', "Expect file path after 'from'.");
        } else {
            // Simple import: import "file"
            source = this.consume('STRING', "Expect file path.");
        }
        
        this.consume('SEMICOLON', "Expect ';' after import statement.");
        
        return {
            type: 'ImportStatement',
            imports: imports.length > 0 ? imports : null,
            source: source.value
        };
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
            if (keyword === 'return') return this.returnStatement();
        }
        if (this.check('LBRACE')) return this.block();

        return this.expressionStatement();
    }

    returnStatement() {
        let values = [];
        if (!this.check('SEMICOLON')) {
            do {
                values.push(this.expression());
            } while (this.match('COMMA'));
        }
        this.consume('SEMICOLON', "Expect ';' after return statement.");
        return { type: 'ReturnStatement', values };
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
        while (this.match('MULTIPLY', 'DIVIDE', 'MODULO')) {
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
        if (this.match('IDENTIFIER')) {
            let name = this.tokens[this.current - 1].value;
            // Check for function call: func(args)
            if (this.check('LPAREN')) {
                this.advance(); // consume '('
                let args = [];
                if (!this.check('RPAREN')) {
                    do {
                        args.push(this.expression());
                    } while (this.match('COMMA'));
                }
                this.consume('RPAREN', "Expect ')' after arguments.");
                return { type: 'FunctionCall', name: name, args };
            }
            // Check for array access: arr[index]
            if (this.check('LBRACKET')) {
                this.advance(); // consume '['
                let index = this.expression();
                this.consume('RBRACKET', "Expect ']' after array index.");
                return { type: 'ArrayAccess', name: name, index: index };
            }
            return { type: 'Variable', name: name };
        }
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
