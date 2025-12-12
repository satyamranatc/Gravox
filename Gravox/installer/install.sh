#!/bin/bash

# Gravox Installation Script for macOS
# Professional version with colors and enhanced UI

# Color definitions
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
MAGENTA='\033[1;35m'
CYAN='\033[1;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
RESET='\033[0m'

# Unicode symbols
CHECK="✓"
CROSS="✗"
ARROW="➜"
STAR="★"

# Clear screen for clean installation
clear

# Banner
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${CYAN}║                                                            ║${RESET}"
echo -e "${CYAN}║${RESET}  ${BOLD}${MAGENTA}    ██████╗ ██████╗  █████╗ ██╗   ██╗ ██████╗ ██╗  ██╗${RESET}   ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}  ${BOLD}${MAGENTA}   ██╔════╝ ██╔══██╗██╔══██╗██║   ██║██╔═══██╗╚██╗██╔╝${RESET}   ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}  ${BOLD}${MAGENTA}   ██║  ███╗██████╔╝███████║██║   ██║██║   ██║ ╚███╔╝${RESET}    ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}  ${BOLD}${MAGENTA}   ██║   ██║██╔══██╗██╔══██║╚██╗ ██╔╝██║   ██║ ██╔██╗${RESET}    ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}  ${BOLD}${MAGENTA}   ╚██████╔╝██║  ██║██║  ██║ ╚████╔╝ ╚██████╔╝██╔╝ ██╗${RESET}   ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}  ${BOLD}${MAGENTA}    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝   ╚═════╝ ╚═╝  ╚═╝${RESET}   ${CYAN}║${RESET}"
echo -e "${CYAN}║                                                            ║${RESET}"
echo -e "${CYAN}║${RESET}           ${BOLD}${WHITE}Programming Language Installer${RESET}                    ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}                    ${YELLOW}Version 1.0.0${RESET}                                  ${CYAN}║${RESET}"
echo -e "${CYAN}║                                                            ║${RESET}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${RESET}"
echo ""

# Detect OS
echo -e "${BLUE}${ARROW}${RESET} ${BOLD}Detecting system...${RESET}"
sleep 0.5

if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${GREEN}  ${CHECK} macOS detected${RESET}"
    PLATFORM="macos"
else
    echo -e "${RED}  ${CROSS} This installer is for macOS only${RESET}"
    echo -e "${YELLOW}  ${ARROW} For other platforms, please use the appropriate installer${RESET}"
    exit 1
fi

echo ""

# Check if gravox binary exists
if [ ! -f "gravox" ]; then
    echo -e "${RED}${CROSS} Error: gravox binary not found in current directory${RESET}"
    echo -e "${YELLOW}  ${ARROW} Please run this script from the installer directory${RESET}"
    exit 1
fi

echo -e "${BLUE}${ARROW}${RESET} ${BOLD}Installation Details:${RESET}"
echo -e "${WHITE}  • Binary:${RESET} gravox"
echo -e "${WHITE}  • Target:${RESET} /usr/local/bin/gravox"
echo -e "${WHITE}  • Requires:${RESET} sudo privileges"
echo ""

# Confirm installation
echo -e "${YELLOW}${ARROW}${RESET} ${BOLD}Ready to install Gravox${RESET}"
read -p "  Continue? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}  Installation cancelled${RESET}"
    exit 0
fi

echo ""
echo -e "${BLUE}${ARROW}${RESET} ${BOLD}Installing Gravox...${RESET}"
echo ""

# Copy binary
echo -e "${WHITE}  [1/3]${RESET} Copying binary to /usr/local/bin..."
if sudo cp gravox /usr/local/bin/; then
    echo -e "${GREEN}        ${CHECK} Binary copied successfully${RESET}"
else
    echo -e "${RED}        ${CROSS} Failed to copy binary${RESET}"
    exit 1
fi

# Set permissions
echo -e "${WHITE}  [2/3]${RESET} Setting executable permissions..."
if sudo chmod +x /usr/local/bin/gravox; then
    echo -e "${GREEN}        ${CHECK} Permissions set successfully${RESET}"
else
    echo -e "${RED}        ${CROSS} Failed to set permissions${RESET}"
    exit 1
fi

# Verify installation
echo -e "${WHITE}  [3/3]${RESET} Verifying installation..."
if command -v gravox &> /dev/null; then
    VERSION=$(gravox --version 2>&1 | head -n 1 || echo "1.0.0")
    echo -e "${GREEN}        ${CHECK} Installation verified${RESET}"
else
    echo -e "${RED}        ${CROSS} Verification failed${RESET}"
    exit 1
fi

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${CYAN}║                                                            ║${RESET}"
echo -e "${CYAN}║${RESET}  ${GREEN}${BOLD}${STAR}  Installation Complete!  ${STAR}${RESET}                          ${CYAN}║${RESET}"
echo -e "${CYAN}║                                                            ║${RESET}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${RESET}"
echo ""

echo -e "${BOLD}${WHITE}New Features Available:${RESET}"
echo -e "${GREEN}  ${CHECK}${RESET} Array indexing: ${CYAN}arr[0]${RESET}"
echo -e "${GREEN}  ${CHECK}${RESET} Functions: ${CYAN}action add(int a, int b) { return a + b; }${RESET}"
echo -e "${GREEN}  ${CHECK}${RESET} Default parameters: ${CYAN}action greet(string name = \"World\")${RESET}"
echo -e "${GREEN}  ${CHECK}${RESET} Multiple returns: ${CYAN}return a, b${RESET}"
echo -e "${GREEN}  ${CHECK}${RESET} Function aliasing: ${CYAN}use add as plus${RESET}"
echo -e "${GREEN}  ${CHECK}${RESET} Modulo operator: ${CYAN}%${RESET}"
echo ""

echo -e "${BOLD}${WHITE}Quick Start:${RESET}"
echo -e "${YELLOW}  ${ARROW}${RESET} Run: ${CYAN}gravox --help${RESET}"
echo -e "${YELLOW}  ${ARROW}${RESET} Execute: ${CYAN}gravox run yourfile.gvx${RESET}"
echo -e "${YELLOW}  ${ARROW}${RESET} Examples: ${CYAN}cd examples && gravox run demo.gvx${RESET}"
echo ""

echo -e "${MAGENTA}${BOLD}Thank you for installing Gravox!${RESET}"
echo ""
