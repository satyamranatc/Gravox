class Environment {
    constructor(parent = null) {
        this.values = new Map();
        this.parent = parent;
    }

    define(name, value) {
        this.values.set(name, value);
    }

    get(name) {
        if (this.values.has(name)) {
            return this.values.get(name);
        }
        if (this.parent !== null) {
            return this.parent.get(name);
        }
        throw new Error(`Undefined variable '${name}'.`);
    }

    assign(name, value) {
        if (this.values.has(name)) {
            this.values.set(name, value);
            return;
        }
        if (this.parent !== null) {
            this.parent.assign(name, value);
            return;
        }
        throw new Error(`Undefined variable '${name}'.`);
    }
}

class Interpreter {
    constructor() {
        this.environment = new Environment();
    }

    interpret(ast) {
        try {
            for (let statement of ast.body) {
                this.execute(statement);
            }
        } catch (error) {
            console.error("Runtime Error:", error.message);
        }
    }

    execute(stmt) {
        switch (stmt.type) {
            case 'VarDeclaration':
                let value = null;
                if (stmt.initializer) {
                    value = this.evaluate(stmt.initializer);
                    if (!this.checkType(stmt.varType, value)) {
                        throw new Error(`Type Error: Cannot assign value to type '${stmt.varType}'.`);
                    }
                }
                this.environment.define(stmt.name, value);
                break;
            case 'ShowStatement':
                let output = stmt.args.map(argExpr => {
                    let val = this.evaluate(argExpr);
                    if (typeof val === 'string') {
                        return this.interpolate(val);
                    }
                    return val;
                });
                console.log(...output);
                break;
            case 'Block':
                this.executeBlock(stmt.body, new Environment(this.environment));
                break;
            case 'IfStatement':
                if (this.evaluate(stmt.condition)) {
                    this.execute(stmt.thenBranch);
                } else if (stmt.elseBranch) {
                    this.execute(stmt.elseBranch);
                }
                break;
            case 'WhileStatement':
                while (this.evaluate(stmt.condition)) {
                    this.execute(stmt.body);
                }
                break;
            case 'ForStatement':
                let start = this.evaluate(stmt.start);
                let end = this.evaluate(stmt.end);
                // Create a new environment for the loop variable
                let previous = this.environment;
                this.environment = new Environment(previous);
                try {
                    this.environment.define(stmt.variable, 0); // Define first
                    for (let i = start; i < end; i++) {
                        this.environment.assign(stmt.variable, i);
                        this.execute(stmt.body);
                    }
                } finally {
                    this.environment = previous;
                }
                break;
            case 'ExpressionStatement':
                this.evaluate(stmt.expression);
                break;
            default:
                throw new Error(`Unknown statement type: ${stmt.type}`);
        }
    }

    executeBlock(statements, environment) {
        let previous = this.environment;
        try {
            this.environment = environment;
            for (let statement of statements) {
                this.execute(statement);
            }
        } finally {
            this.environment = previous;
        }
    }

    evaluate(expr) {
        switch (expr.type) {
            case 'Literal':
                return expr.value;
            case 'ArrayLiteral':
                return expr.elements.map(e => this.evaluate(e));
            case 'Variable':
                return this.environment.get(expr.name);
            case 'Assignment':
                let value = this.evaluate(expr.value);
                this.environment.assign(expr.name, value);
                return value;
            case 'Binary':
                let left = this.evaluate(expr.left);
                let right = this.evaluate(expr.right);
                switch (expr.operator) {
                    case '+': return left + right;
                    case '-': return left - right;
                    case '*': return left * right;
                    case '/': return left / right;
                    case '>': return left > right;
                    case '<': return left < right;
                    case '==': return left === right;
                    // Add others...
                }
                break;
            // Add other expression types...
        }
        throw new Error(`Unknown expression type: ${expr.type}`);
    }
    checkType(expectedType, value) {
        if (expectedType === 'any') return true;
        
        if (expectedType.endsWith('[]')) {
            if (!Array.isArray(value)) return false;
            let innerType = expectedType.slice(0, -2);
            for (let item of value) {
                if (!this.checkType(innerType, item)) return false;
            }
            return true;
        }

        switch (expectedType) {
            case 'int':
            case 'float':
                return typeof value === 'number';
            case 'string':
                return typeof value === 'string';
            case 'bool':
                return typeof value === 'boolean';
            case 'any':
                return true;
            default:
                return true; // Unknown types (like classes) ignored for now
        }
    }
    interpolate(text) {
        return text.replace(/\{\{\s*([a-zA-Z_]\w*)\s*\}\}/g, (match, varName) => {
            try {
                return this.environment.get(varName);
            } catch (e) {
                return match; 
            }
        });
    }
}

module.exports = Interpreter;
