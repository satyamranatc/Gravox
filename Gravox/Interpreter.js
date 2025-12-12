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

class ReturnException {
    constructor(values) {
        this.values = values;
    }
}

class Interpreter {
    constructor() {
        this.environment = new Environment();
        this.fs = require('fs');
        this.path = require('path');
        this.currentDir = process.cwd();
    }

    interpret(ast) {
        try {
            for (let statement of ast.body) {
                this.execute(statement);
            }
        } catch (error) {
            if (error instanceof ReturnException) {
                console.error("Runtime Error: Return statement outside of function.");
            } else {
                console.error("Runtime Error:", error.message);
            }
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
            case 'ActionDeclaration':
                // Store function in environment
                this.environment.define(stmt.name, {
                    type: 'function',
                    params: stmt.params,
                    body: stmt.body
                });
                break;
            case 'AliasStatement':
                // Create alias for function
                let originalFunc = this.environment.get(stmt.originalName);
                this.environment.define(stmt.aliasName, originalFunc);
                break;
            case 'ReturnStatement':
                // Evaluate all return values
                let returnValues = stmt.values.map(v => this.evaluate(v));
                // If multiple values, return as array; if single, return value; if none, return null
                if (returnValues.length > 1) {
                    throw new ReturnException(returnValues);
                } else if (returnValues.length === 1) {
                    throw new ReturnException([returnValues[0]]);
                } else {
                    throw new ReturnException([null]);
                }
            case 'ImportStatement':
                this.executeImport(stmt);
                break;
            default:
                throw new Error(`Unknown statement type: ${stmt.type}`);
        }
    }

    executeImport(stmt) {
        const source = stmt.source;
        let exports = {};
        
        // Check if it's a standard library
        if (source.startsWith('std:')) {
            const libName = source.substring(4); // Remove 'std:' prefix
            const libPath = this.path.join(__dirname, 'stdlib', `${libName}.js`);
            
            if (!this.fs.existsSync(libPath)) {
                throw new Error(`Standard library '${libName}' not found.`);
            }
            
            // Load standard library
            delete require.cache[require.resolve(libPath)];
            exports = require(libPath);
        } else {
            // Load user file
            const filePath = this.path.resolve(this.currentDir, source);
            
            if (!this.fs.existsSync(filePath)) {
                throw new Error(`File '${source}' not found.`);
            }
            
            // Read and parse the file
            const Lexer = require('./Lexer');
            const Parser = require('./Parser');
            
            const code = this.fs.readFileSync(filePath, 'utf-8');
            const lexer = new Lexer(code);
            const tokens = lexer.tokenize();
            const parser = new Parser(tokens);
            const ast = parser.parse();
            
            // Execute in isolated environment to collect exports
            const importEnv = new Environment(this.environment);
            const previous = this.environment;
            this.environment = importEnv;
            
            try {
                for (let statement of ast.body) {
                    this.execute(statement);
                }
            } finally {
                this.environment = previous;
            }
            
            // Collect all defined items as exports
            for (let [key, value] of importEnv.values) {
                exports[key] = value;
            }
        }
        
        // Import items into current environment
        if (stmt.imports) {
            // Named imports
            for (let item of stmt.imports) {
                const name = item.name;
                const alias = item.alias || name;
                
                if (!(name in exports)) {
                    throw new Error(`'${name}' is not exported from '${source}'.`);
                }
                
                this.environment.define(alias, exports[name]);
            }
        } else {
            // Import all
            for (let [key, value] of Object.entries(exports)) {
                this.environment.define(key, value);
            }
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
            case 'ArrayAccess':
                let array = this.environment.get(expr.name);
                if (!Array.isArray(array)) {
                    throw new Error(`'${expr.name}' is not an array.`);
                }
                let index = this.evaluate(expr.index);
                if (typeof index !== 'number' || index < 0 || index >= array.length) {
                    throw new Error(`Array index out of bounds: ${index} (array length: ${array.length})`);
                }
                return array[Math.floor(index)];
            case 'FunctionCall':
                let func = this.environment.get(expr.name);
                if (!func || func.type !== 'function') {
                    throw new Error(`'${expr.name}' is not a function.`);
                }
                
                // Evaluate arguments
                let evaluatedArgs = expr.args.map(arg => this.evaluate(arg));
                
                // Check if it's a native function
                if (func.body.type === 'NativeFunction') {
                    return func.body.execute(this, evaluatedArgs);
                }
                
                // User-defined function
                // Create new environment for function execution
                let funcEnv = new Environment(this.environment);
                // Bind parameters
                for (let i = 0; i < func.params.length; i++) {
                    let param = func.params[i];
                    let argValue;
                    if (i < evaluatedArgs.length) {
                        // Argument provided
                        argValue = evaluatedArgs[i];
                    } else if (param.defaultValue !== null) {
                        // Use default value
                        argValue = this.evaluate(param.defaultValue);
                    } else {
                        throw new Error(`Missing argument for parameter '${param.name}' in function '${expr.name}'.`);
                    }
                    funcEnv.define(param.name, argValue);
                }
                // Execute function body
                let previous = this.environment;
                this.environment = funcEnv;
                try {
                    this.executeBlock(func.body.body, funcEnv);
                    // If no return statement, return null
                    return null;
                } catch (e) {
                    if (e instanceof ReturnException) {
                        // Return the values (as array if multiple, single value otherwise)
                        if (e.values.length > 1) {
                            return e.values;
                        } else {
                            return e.values[0];
                        }
                    }
                    throw e;
                } finally {
                    this.environment = previous;
                }
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
                    case '%': return left % right;
                    case '>': return left > right;
                    case '<': return left < right;
                    case '==': return left === right;
                    // Add others...
                }
                break;
            case 'Unary':
                let operand = this.evaluate(expr.right);
                if (expr.operator === '-') {
                    return -operand;
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
