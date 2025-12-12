# Gravox Programming Language

Welcome to Gravox! 🚀

## Installation

Double-click `install.sh` or run in Terminal:

```bash
./install.sh
```

This will install the `gravox` command to `/usr/local/bin`.

## Usage

```bash
gravox run yourfile.gvx
```

## Features

- C-style syntax with modern features
- Strong type checking
- Arrays with type safety
- For loops with range()
- String interpolation with {{variables}}
- While loops and if/else statements

## Example

```gravox
string name = "World";
int count = 5;

for (i in range(0, count)) {
    show("Hello {{name}} - iteration {{i}}");
}
```

## Uninstall

```bash
sudo rm /usr/local/bin/gravox
```

---

For VS Code syntax highlighting, install the `gravox-1.0.0.vsix` extension.
