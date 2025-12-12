#!/bin/bash

echo "Installing Gravox..."

# Create /usr/local/bin if it doesn't exist
sudo mkdir -p /usr/local/bin

# Copy gravox to /usr/local/bin
sudo cp "$(dirname "$0")/gravox" /usr/local/bin/gravox

# Make it executable
sudo chmod +x /usr/local/bin/gravox

echo "✅ Gravox installed successfully!"
echo ""
echo "Usage: gravox run yourfile.gvx"
echo ""
echo "To uninstall: sudo rm /usr/local/bin/gravox"
