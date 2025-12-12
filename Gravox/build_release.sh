#!/bin/bash

# Clean dist directory
rm -rf dist
mkdir -p dist

# Run pkg to build executables
echo "Building executables..."
npm run build:all

echo "Creating distribution packages..."

# Mac DMG
if command -v hdiutil &> /dev/null; then
    echo "Creating Mac DMG..."
    # Create a temporary folder for DMG content
    mkdir -p dist/Gravox-Mac-Installer
    cp dist/gravox-macos dist/Gravox-Mac-Installer/gravox
    cp installer/install.sh dist/Gravox-Mac-Installer/
    chmod +x dist/Gravox-Mac-Installer/install.sh
    cp installer/README_INSTALL.txt dist/Gravox-Mac-Installer/
    
    # Create DMG
    hdiutil create -volname "Gravox Installer" -srcfolder dist/Gravox-Mac-Installer -ov -format UDZO dist/Gravox-1.0.0.dmg
    
    # Clean up temp folder
    rm -rf dist/Gravox-Mac-Installer
else
    echo "Skipping DMG creation (hdiutil not found)"
fi

# Linux Tarball
echo "Creating Linux Tarball..."
mkdir -p dist/Gravox-Linux-Installer
cp dist/gravox-linux dist/Gravox-Linux-Installer/gravox
cp installer/install.sh dist/Gravox-Linux-Installer/
chmod +x dist/Gravox-Linux-Installer/install.sh
cp installer/README_INSTALL.txt dist/Gravox-Linux-Installer/

tar -czf dist/gravox-linux.tar.gz -C dist Gravox-Linux-Installer
rm -rf dist/Gravox-Linux-Installer

# Windows Zip
echo "Creating Windows Zip..."
mkdir -p dist/Gravox-Windows-Installer
cp dist/gravox-win.exe dist/Gravox-Windows-Installer/gravox.exe
cp installer/install.bat dist/Gravox-Windows-Installer/
cp installer/README_INSTALL.txt dist/Gravox-Windows-Installer/

# Zip command availability check
if command -v zip &> /dev/null; then
    cd dist
    zip -r gravox-win.zip Gravox-Windows-Installer
    cd ..
    rm -rf dist/Gravox-Windows-Installer
else
    echo "Warning: 'zip' command not found. Windows folder left unzipped in dist/Gravox-Windows-Installer"
fi

echo "Build complete! Check dist/ folder."
