// Gravox Standard Library: Time
// Provides date and time functions

module.exports = {
    // Get current Unix timestamp (seconds since epoch)
    now: {
        type: 'function',
        params: [],
        body: {
            type: 'NativeFunction',
            execute: (interpreter, args) => {
                return Math.floor(Date.now() / 1000);
            }
        }
    },
    
    // Get current date as string (YYYY-MM-DD)
    date: {
        type: 'function',
        params: [],
        body: {
            type: 'NativeFunction',
            execute: (interpreter, args) => {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
        }
    },
    
    // Sleep for specified milliseconds
    sleep: {
        type: 'function',
        params: [{ type: 'int', name: 'ms', defaultValue: null }],
        body: {
            type: 'NativeFunction',
            execute: (interpreter, args) => {
                const ms = args[0];
                const start = Date.now();
                while (Date.now() - start < ms) {
                    // Busy wait (blocking)
                }
                return null;
            }
        }
    }
};
