# Project: Gravox

![Gravox Logo](assets/GravoxLogo.png)

## Overview

Gravox is a custom programming language implemented in Node.js. It features a complete pipeline including a Lexer (tokenizer), Parser (AST generator), and Interpreter (execution engine). The language is designed with a C-style syntax, supporting strong typing syntax, control structures, and variable scoping.

## Project Structure

- **`index.js`**: The command-line interface (CLI) entry point. It handles argument parsing, file reading, and coordinates the execution pipeline.
  - Usage: `gravox run <filename.gvx>`
- **`Lexer.js`**: Converts raw source code into a stream of tokens.
- **`Parser.js`**: Analyzes the token stream to build an Abstract Syntax Tree (AST).
- **`Interpreter.js`**: Traverses the AST to execute the program logic.
- **`test.gvx`**: A sample source file for testing language features.

## Language Specification

### Data Types

- `int`: Integers
- `float`: Floating-point numbers
- `string`: String literals (surrounded by double quotes `"`)
- `bool`: Boolean values (`true`, `false`)

### Syntax & Grammar

#### Variables

Variables must be declared with a type, though the underlying system is flexible.

```gravox
int x = 10;
string name = "Gravox";
```

#### I/O

- `show(expression);`: A built-in statement to print values to the console.

```gravox
show(x);
```

#### Control Flow

**If-Else Statements:**

```gravox
if (x > 5) {
    show("Greater");
} else {
    show("Smaller");
}
```

**While Loops:**

```gravox
while (x > 0) {
    x = x - 1;
}
```

#### Blocks & Scoping

Code blocks `{ ... }` create new scopes. Variables defined inside a block are shadowed or local to that block.

#### Comments

- Single-line comments start with `//`.

### Operators

- **Arithmetic:** `+`, `-`, `*`, `/`
- **Comparison:** `<`, `>`, `==`
- **Assignment:** `=`

## Implementation Details

### Lexer (`Lexer.js`)

- scanned character-by-character.
- Supports whitespace skipping.
- Recognizes keywords (`if`, `else`, `while`, `int`, etc.) and literals.

### Parser (`Parser.js`)

- Implements a Recursive Descent Parser.
- **Precedence Hierarchy** (Lowest to Highest):
  1. Equality (`==`)
  2. Comparison (`<`, `>`)
  3. Term (`+`, `-`)
  4. Factor (`*`, `/`)
  5. Unary (`-`)
  6. Primary (Literals, Identifiers, Grouping)

### Interpreter (`Interpreter.js`)

- **Tree-Walk Interpretation**: Executes nodes directly.
- **Environment**: Handles variable storage and lookup. Supports nested environments for scoping (e.g., inside `if` or `while` blocks).
- **Current Limitations**:
  - Function declarations and function calls are parsed but **not yet implemented** in the Interpreter.

## Usage

To run a Gravox program:

1. Ensure Node.js is installed.
2. Run via CLI:
   ```bash
   node index.js run test.gvx
   # OR if installed globally/linked
   gravox run test.gvx
   ```
