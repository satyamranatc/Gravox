# Gravox - Complete Setup

## 📦 What's Included

This distribution contains:

1. **Gravox Compiler** - Executable to run `.gvx` programs
2. **VS Code Extension** - Syntax highlighting and editor support (separate install)

## 🚀 Installation

### Step 1: Install the Compiler

Choose your platform:

**macOS:**

```bash
cd installer
./install.sh
```

**Linux:**

```bash
tar -xzf gravox-linux.tar.gz
cd Gravox-Linux-Installer
sudo ./install.sh
```

**Windows:**

```cmd
Extract gravox-win.zip
Run install.bat as Administrator
```

### Step 2: Install VS Code Extension (Optional but Recommended)

1. Open Visual Studio Code
2. Press `Cmd+Shift+X` (Mac) or `Ctrl+Shift+X` (Windows/Linux)
3. Click the `...` menu → `Install from VSIX...`
4. Select `gravox-1.0.0.vsix` from the distribution

## ✅ Verify Installation

```bash
gravox --version
gravox run test.gvx
```

## 📚 What Each Component Does

### Compiler (Required)

- Executes `.gvx` programs
- Command-line tool: `gravox run file.gvx`
- Installed to system PATH

### VS Code Extension (Optional)

- **Syntax Highlighting**: Colors for keywords, strings, etc.
- **File Icons**: Gravox logo for `.gvx` files
- **IntelliSense**: Auto-completion, bracket matching
- **Smart Indentation**: Automatic code formatting

## 🎯 Quick Start

1. Create a file `hello.gvx`:

```gravox
show("Hello, Gravox!");

action greet(string name = "World") {
    show("Hello, {{name}}!");
}

greet();
greet("Alice");
```

2. Run it:

```bash
gravox run hello.gvx
```

## 🆕 New Features

- ✅ Array indexing: `arr[0]`
- ✅ Functions: `action add(int a, int b) { return a + b; }`
- ✅ Default parameters: `action greet(string name = "World")`
- ✅ Multiple returns: `return a, b` (creates array)
- ✅ Function aliasing: `use add as plus`
- ✅ Modulo operator: `%`

## 📖 Documentation

See `test_all_features.gvx` for comprehensive examples of all features.

## 🔗 Links

- GitHub: https://github.com/satyamranatc/Gravox
- Issues: https://github.com/satyamranatc/Gravox/issues
