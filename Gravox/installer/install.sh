#!/bin/bash

echo "Installing Gravox..."

BIN_NAME="gravox"
INSTALL_DIR="/usr/local/bin"

# Detect OS
OS="$(uname -s)"
if [ "$OS" == "Darwin" ]; then
    echo "Detected macOS"
elif [ "$OS" == "Linux" ]; then
    echo "Detected Linux"
else
    echo "Unsupported OS for this script: $OS"
    exit 1
fi

# Check if gravox binary exists in current directory
if [ -f "./gravox" ]; then
    SOURCE="./gravox"
elif [ -f "../gravox" ]; then
    SOURCE="../gravox"
else
    echo "Error: gravox binary not found in current directory."
    exit 1
fi

# Make executable
chmod +x "$SOURCE"

# Copy to install directory
echo "Copying $BIN_NAME to $INSTALL_DIR..."

if [ -w "$INSTALL_DIR" ]; then
    cp "$SOURCE" "$INSTALL_DIR/$BIN_NAME"
else
    echo "Sudo permission required to install to $INSTALL_DIR"
    sudo cp "$SOURCE" "$INSTALL_DIR/$BIN_NAME"
fi

if [ $? -eq 0 ]; then
    echo "Success! Gravox installed."
    echo "Run 'gravox --help' to get started."
else
    echo "Installation failed."
    exit 1
fi
