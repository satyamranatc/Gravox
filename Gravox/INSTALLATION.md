# Gravox Installation Guide

## What You Need

Gravox has **two separate components**:

### 1. Gravox Compiler (Required to run code)

The compiler executable that runs your `.gvx` programs.

**Install:**

- **macOS**: Run `installer/install.sh`
- **Linux**: Extract tarball and run `install.sh`
- **Windows**: Extract zip and run `install.bat`

**Verify:** `gravox --version`

---

### 2. VS Code Extension (Optional, for better editing)

Provides syntax highlighting, file icons, and IntelliSense.

**Install:**

- Open VS Code
- Go to Extensions (Cmd+Shift+X / Ctrl+Shift+X)
- Install from `.vsix` file or search "Gravox"

**Features:**

- Syntax highlighting for `.gvx` files
- Gravox logo icon for files
- Auto-closing brackets
- Smart indentation

---

## Quick Start

### macOS Installation

1. **Install Compiler:**

   ```bash
   cd installer
   ./install.sh
   ```

2. **Install VS Code Extension:**

   - Open VS Code
   - Extensions → Install from VSIX
   - Select `gravox-1.0.0.vsix`

3. **Test:**
   ```bash
   gravox run test.gvx
   ```

### Linux Installation

1. **Extract and Install:**

   ```bash
   tar -xzf gravox-linux.tar.gz
   cd Gravox-Linux-Installer
   sudo ./install.sh
   ```

2. **Install VS Code Extension** (same as macOS)

### Windows Installation

1. **Extract and Install:**

   - Extract `gravox-win.zip`
   - Run `install.bat` as Administrator

2. **Install VS Code Extension** (same as macOS)

---

## Important Notes

⚠️ **The compiler and VS Code extension are separate!**

- You can use the compiler without VS Code
- You can install the VS Code extension without the compiler (but can't run code)
- For the best experience, install both

✅ **Recommended:** Install both for full Gravox development experience
