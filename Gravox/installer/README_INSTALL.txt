GRAVOX INSTALLATION INSTRUCTIONS
=================================

IMPORTANT: Gravox has TWO separate components:

1. COMPILER (Required)
   - Runs your .gvx programs
   - Install location: /usr/local/bin/gravox (Mac/Linux)
   
2. VS CODE EXTENSION (Optional)
   - Syntax highlighting and file icons
   - Install via VS Code Extensions panel

---

INSTALLATION STEPS:

macOS:
  1. Run: ./install.sh
  2. Enter your password when prompted
  3. Verify: gravox --version

Linux:
  1. Run: sudo ./install.sh
  2. Verify: gravox --version

Windows:
  1. Run: install.bat (as Administrator)
  2. Verify: gravox --version

VS Code Extension (All Platforms):
  1. Open VS Code
  2. Extensions panel (Cmd+Shift+X or Ctrl+Shift+X)
  3. Click "..." → Install from VSIX
  4. Select gravox-1.0.0.vsix

---

TESTING:

Run the test file:
  gravox run test.gvx

You should see output demonstrating all Gravox features.

---

NEW FEATURES:
✓ Array indexing: arr[0]
✓ Functions: action add(int a, int b)
✓ Default parameters
✓ Multiple return values
✓ Function aliasing: use add as plus
✓ Modulo operator: %

For more information, visit: https://github.com/satyamranatc/Gravox
