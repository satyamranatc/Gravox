// Gravox Standard Library: Math
// Provides basic mathematical functions

module.exports = {
    // Absolute value
    abs: {
        type: 'function',
        params: [{ type: 'any', name: 'n', defaultValue: null }],
        body: {
            type: 'NativeFunction',
            execute: (interpreter, args) => {
                return Math.abs(args[0]);
            }
        }
    },
    
    // Square root
    sqrt: {
        type: 'function',
        params: [{ type: 'any', name: 'n', defaultValue: null }],
        body: {
            type: 'NativeFunction',
            execute: (interpreter, args) => {
                return Math.sqrt(args[0]);
            }
        }
    },
    
    // Power
    pow: {
        type: 'function',
        params: [
            { type: 'any', name: 'base', defaultValue: null },
            { type: 'any', name: 'exp', defaultValue: null }
        ],
        body: {
            type: 'NativeFunction',
            execute: (interpreter, args) => {
                return Math.pow(args[0], args[1]);
            }
        }
    },
    
    // Floor (round down)
    floor: {
        type: 'function',
        params: [{ type: 'any', name: 'n', defaultValue: null }],
        body: {
            type: 'NativeFunction',
            execute: (interpreter, args) => {
                return Math.floor(args[0]);
            }
        }
    },
    
    // Ceiling (round up)
    ceil: {
        type: 'function',
        params: [{ type: 'any', name: 'n', defaultValue: null }],
        body: {
            type: 'NativeFunction',
            execute: (interpreter, args) => {
                return Math.ceil(args[0]);
            }
        }
    }
};
