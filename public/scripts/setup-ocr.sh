#!/bin/bash
# OCR MCP Server Setup Script for Linux/Mac
# This script helps set up the OCR MCP server for viewing images

echo "OCR MCP Server Setup Script"
echo "============================"
echo ""

# Check if Python is installed
echo "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed or not in PATH"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

PYTHON_VERSION=$(python3 --version)
echo "Found: $PYTHON_VERSION"
echo ""

# Check if Poetry is installed
echo "Checking Poetry installation..."
if ! command -v poetry &> /dev/null; then
    echo "Poetry not found. Checking if pip is available..."
    if ! command -v pip3 &> /dev/null; then
        echo "ERROR: Neither Poetry nor pip is available"
        exit 1
    fi
    echo "Using pip for installation"
    USE_POETRY=false
else
    POETRY_VERSION=$(poetry --version)
    echo "Found: $POETRY_VERSION"
    USE_POETRY=true
fi
echo ""

# Clone the repository
OCR_REPO_PATH="ocr-mcp"
if [ -d "$OCR_REPO_PATH" ]; then
    echo "OCR-MCP repository already exists at $OCR_REPO_PATH"
    read -p "Do you want to remove and re-clone? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$OCR_REPO_PATH"
        echo "Cloning OCR-MCP repository..."
        git clone https://github.com/sandraschi/ocr-mcp.git
    else
        echo "Using existing repository"
    fi
else
    echo "Cloning OCR-MCP repository..."
    git clone https://github.com/sandraschi/ocr-mcp.git
fi

if [ ! -d "$OCR_REPO_PATH" ]; then
    echo "ERROR: Failed to clone repository"
    exit 1
fi

echo "Repository cloned successfully"
echo ""

# Install dependencies
cd "$OCR_REPO_PATH"
echo "Installing dependencies..."

if [ "$USE_POETRY" = true ]; then
    echo "Using Poetry to install dependencies..."
    poetry install
    if [ $? -ne 0 ]; then
        echo "ERROR: Poetry install failed"
        cd ..
        exit 1
    fi
else
    echo "Using pip to install dependencies..."
    if [ -f "requirements.txt" ]; then
        pip3 install -r requirements.txt
    else
        echo "WARNING: requirements.txt not found. You may need to install dependencies manually."
    fi
fi

echo "Dependencies installed successfully"
echo ""

# Ask about GPU support
read -p "Do you want to install GPU support (CUDA)? This requires NVIDIA GPU. (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Installing GPU support (CUDA 12.1)..."
    if [ "$USE_POETRY" = true ]; then
        poetry run pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
    else
        pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
    fi
    echo "GPU support installed"
else
    echo "Skipping GPU support. Using CPU mode."
fi

cd ..

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure the MCP server in Cursor settings"
echo "2. Add the configuration from ocr-setup.md to your Cursor MCP settings"
echo "3. Update the OCR_CACHE_DIR path to your preferred location"
echo "4. Set OCR_DEVICE to 'cuda' if you installed GPU support, or 'cpu' otherwise"
echo ""
echo "The OCR-MCP repository is located at: $(pwd)/$OCR_REPO_PATH"
