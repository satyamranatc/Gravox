# Gravox Programming Language - Technical Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Component Details](#component-details)
4. [Execution Flow](#execution-flow)
5. [VS Code Integration](#vs-code-integration)
6. [Distribution](#distribution)

---

## 1. Overview

**Gravox** is a custom programming language with C-style syntax, implemented in Node.js. It features:

- Strong type checking
- Arrays with type safety
- For loops with `range()`
- String interpolation with `{{variables}}`
- Control flow (if/else, while, for)

**File Extension**: `.gvx`

---

## 2. Architecture

Gravox uses a **tree-walk interpreter** architecture with three main phases:

```
Source Code (.gvx)
    ↓
┌─────────────┐
│   LEXER     │ → Tokens
└─────────────┘
    ↓
┌─────────────┐
│   PARSER    │ → Abstract Syntax Tree (AST)
└─────────────┘
    ↓
┌─────────────┐
│ INTERPRETER │ → Execution & Output
└─────────────┘
```

---

## 3. Component Details

### 3.1 Lexer (Lexer.js)

**Purpose**: Converts source code into tokens (lexical analysis).

**Process**:

1. Reads source code character by character
2. Recognizes patterns (keywords, identifiers, numbers, strings)
3. Produces a stream of tokens

**Example**:

```gravox
int x = 10;
```

**Tokens produced**:

```javascript
[
  { type: "TYPE", value: "int" },
  { type: "IDENTIFIER", value: "x" },
  { type: "ASSIGN", value: "=" },
  { type: "NUMBER", value: "10" },
  { type: "SEMICOLON", value: ";" },
  { type: "EOF", value: null },
];
```

**Key Features**:

- Skips whitespace
- Handles comments (`//`)
- Recognizes keywords: `if`, `else`, `while`, `for`, `in`, `range`, `show`
- Recognizes types: `int`, `float`, `string`, `bool`, `any`
- Handles operators: `+`, `-`, `*`, `/`, `<`, `>`, `==`, `=`
- Handles delimiters: `{`, `}`, `[`, `]`, `(`, `)`, `;`, `,`

---

### 3.2 Parser (Parser.js)

**Purpose**: Converts tokens into an Abstract Syntax Tree (AST) (syntax analysis).

**Process**:

1. Consumes tokens from the Lexer
2. Checks syntax rules
3. Builds a hierarchical tree structure (AST)

**Example**:

```gravox
int x = 10;
show(x);
```

**AST produced**:

```javascript
{
  type: 'Program',
  body: [
    {
      type: 'VarDeclaration',
      varType: 'int',
      name: 'x',
      initializer: { type: 'Literal', value: 10 }
    },
    {
      type: 'ShowStatement',
      args: [
        { type: 'Variable', name: 'x' }
      ]
    }
  ]
}
```

**Key Features**:

- **Recursive Descent Parsing**: Top-down parsing strategy
- **Operator Precedence**: Handles `*` before `+`, etc.
- **Expression Grammar**:
  - Assignment → Equality → Comparison → Term → Factor → Unary → Primary
- **Statement Types**: VarDeclaration, IfStatement, WhileStatement, ForStatement, ShowStatement
- **Type Detection**: Recognizes `int[]` as array type

---

### 3.3 Interpreter (Interpreter.js)

**Purpose**: Executes the AST (semantic analysis & execution).

**Process**:

1. Traverses the AST tree
2. Executes each node
3. Manages variable storage (Environment)
4. Produces output

**Key Components**:

#### Environment Class

Manages variable storage with scoping:

```javascript
class Environment {
  values = new Map();
  parent = null; // For nested scopes

  define(name, value) { ... }
  get(name) { ... }
  assign(name, value) { ... }
}
```

#### Type Checking

```javascript
checkType(expectedType, value) {
  // Validates types at runtime
  // Supports: int, float, string, bool, any
  // Supports arrays: int[], string[], etc.
}
```

#### String Interpolation

```javascript
interpolate(text) {
  // Replaces {{varName}} with actual values
  return text.replace(/\{\{\s*([a-zA-Z_]\w*)\s*\}\}/g, ...);
}
```

**Execution Flow**:

- **VarDeclaration**: Define variable, check type, store in environment
- **Assignment**: Update variable value
- **ShowStatement**: Evaluate arguments, interpolate strings, print
- **IfStatement**: Evaluate condition, execute branch
- **WhileStatement**: Loop while condition is true
- **ForStatement**: Create loop variable, iterate from start to end
- **Block**: Create new scope, execute statements

---

## 4. Execution Flow

### When You Run: `gravox run test.gvx`

**Step-by-step process**:

#### 1. Entry Point (index.js)

```javascript
// Parse command line arguments
const command = process.argv[2]; // "run"
const filename = process.argv[3]; // "test.gvx"

// Read source file
const sourceCode = fs.readFileSync(filename, "utf-8");
```

#### 2. Lexical Analysis

```javascript
const lexer = new Lexer(sourceCode);
const tokens = lexer.tokenize();
// Produces: [{ type: 'TYPE', value: 'int' }, ...]
```

#### 3. Syntax Analysis

```javascript
const parser = new Parser(tokens);
const ast = parser.parse();
// Produces: { type: 'Program', body: [...] }
```

#### 4. Execution

```javascript
const interpreter = new Interpreter();
interpreter.interpret(ast);
// Executes the program, prints output
```

**Complete Flow Diagram**:

```
┌──────────────────┐
│  gravox run      │
│  test.gvx        │
└────────┬─────────┘
         ↓
┌──────────────────┐
│  index.js        │
│  - Parse args    │
│  - Read file     │
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Lexer.js        │
│  - Tokenize      │
│  - Output tokens │
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Parser.js       │
│  - Build AST     │
│  - Check syntax  │
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Interpreter.js  │
│  - Execute AST   │
│  - Manage vars   │
│  - Print output  │
└──────────────────┘
```

---

## 5. VS Code Integration

### 5.1 Extension Structure

**Files**:

- `package.json` - Extension manifest
- `syntaxes/gravox.tmLanguage.json` - Syntax highlighting grammar
- `language-configuration.json` - Editor behaviors
- `assets/GravoxLogo.png` - File icon

### 5.2 How the Logo Appears

**In package.json**:

```json
{
  "contributes": {
    "languages": [
      {
        "id": "gravox",
        "extensions": [".gvx"],
        "icon": {
          "light": "./assets/GravoxLogo.png",
          "dark": "./assets/GravoxLogo.png"
        }
      }
    ]
  }
}
```

**Process**:

1. VS Code reads `package.json`
2. Registers `.gvx` file association
3. Displays logo next to `.gvx` files in explorer
4. Shows logo in file tabs

### 5.3 Syntax Highlighting

**TextMate Grammar** (`gravox.tmLanguage.json`):

```json
{
  "scopeName": "source.gravox",
  "patterns": [
    {
      "name": "keyword.control.gravox",
      "match": "\\b(if|else|while|for)\\b"
    },
    {
      "name": "storage.type.gravox",
      "match": "\\b(int|float|string|bool)\\b"
    }
  ]
}
```

**How it works**:

1. VS Code applies regex patterns to source code
2. Assigns scope names (e.g., `keyword.control.gravox`)
3. Theme maps scope names to colors
4. Result: Keywords appear in purple, types in blue, etc.

### 5.4 IntelliSense Features

**Language Configuration** (`language-configuration.json`):

#### Auto-Closing Pairs

```json
{
  "autoClosingPairs": [
    { "open": "{", "close": "}" },
    { "open": "[", "close": "]" },
    { "open": "(", "close": ")" },
    { "open": "\"", "close": "\"" }
  ]
}
```

**Result**: Type `{` → VS Code automatically adds `}`

#### Comment Toggle

```json
{
  "comments": {
    "lineComment": "//"
  }
}
```

**Result**: Press `Cmd+/` → Toggles `//` comment

#### Smart Indentation

```json
{
  "indentationRules": {
    "increaseIndentPattern": "^.*\\{[^}]*$",
    "decreaseIndentPattern": "^\\s*\\}.*$"
  }
}
```

**Result**: Press Enter after `{` → Auto-indents next line

### 5.5 VS Code Settings Integration

**How Gravox integrates**:

1. **Language Registration**:

   - VS Code reads `contributes.languages` from `package.json`
   - Registers `gravox` as a language ID
   - Associates `.gvx` extension

2. **Grammar Loading**:

   - VS Code loads `syntaxes/gravox.tmLanguage.json`
   - Applies patterns for syntax highlighting

3. **Configuration Loading**:

   - VS Code loads `language-configuration.json`
   - Enables auto-closing, indentation, comments

4. **Icon Display**:
   - VS Code loads icon from `assets/GravoxLogo.png`
   - Displays in file explorer and tabs

**User Experience**:

- Open `.gvx` file → Automatic syntax highlighting
- Type `{` → Auto-closes to `{}`
- Press `Cmd+/` → Toggles comment
- See Gravox logo next to files

---

## 6. Distribution

### 6.1 Standalone Executables

**Created with `pkg`**:

```bash
pkg . --targets node18-macos-x64,node18-linux-x64,node18-win-x64
```

**Process**:

1. Bundles Node.js runtime + your code
2. Creates single executable file
3. No Node.js installation required

**Output**:

- `gravox-macos` (49 MB)
- `gravox-linux` (44 MB)
- `gravox-win.exe` (36 MB)

### 6.2 VS Code Extension Package

**Created with `vsce`**:

```bash
vsce package
```

**Output**: `gravox-1.0.0.vsix` (42 KB)

**Contains**:

- Syntax grammar
- Language configuration
- Icon
- Extension metadata

**Installation**:

1. Open VS Code
2. Extensions → Install from VSIX
3. Select `gravox-1.0.0.vsix`

### 6.3 Mac DMG Installer

**Created with `hdiutil`**:

```bash
hdiutil create -volname "Gravox Installer" -srcfolder installer -format UDZO Gravox-1.0.0.dmg
```

**Contains**:

- `gravox` executable
- `install.sh` script
- `README.md`

**Installation**:

1. Open DMG
2. Run `install.sh`
3. Installs to `/usr/local/bin/gravox`

---

## 7. Summary

### Complete Architecture

```
┌─────────────────────────────────────────────┐
│           GRAVOX ECOSYSTEM                  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐      ┌─────────────┐     │
│  │   Compiler  │      │  VS Code    │     │
│  │             │      │  Extension  │     │
│  │  Lexer      │      │             │     │
│  │  Parser     │      │  Syntax     │     │
│  │  Interpreter│      │  Icon       │     │
│  │             │      │  IntelliSense│    │
│  └─────────────┘      └─────────────┘     │
│         ↓                     ↓            │
│  ┌─────────────┐      ┌─────────────┐     │
│  │ Executables │      │   .vsix     │     │
│  │ Mac/Win/Lin │      │  Package    │     │
│  └─────────────┘      └─────────────┘     │
│         ↓                                  │
│  ┌─────────────┐                          │
│  │  DMG/Installer                         │
│  └─────────────┘                          │
└─────────────────────────────────────────────┘
```

### Key Takeaways

1. **Lexer**: Converts text → tokens
2. **Parser**: Converts tokens → AST
3. **Interpreter**: Executes AST
4. **VS Code Extension**: Provides editor support
5. **Distribution**: Executables + Extension for complete experience

---

**Gravox** - A complete programming language from source to distribution! 🚀
