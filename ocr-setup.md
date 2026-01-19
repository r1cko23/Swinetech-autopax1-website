# OCR MCP Server Setup Guide

This guide will help you set up the OCR MCP server to view and analyze images in this project.

## Prerequisites

- Python 3.8 or higher
- Poetry (recommended) or pip
- Git

## Installation Steps

### 1. Clone the OCR MCP Repository

```bash
git clone https://github.com/sandraschi/ocr-mcp.git
cd ocr-mcp
```

### 2. Install Dependencies

#### Using Poetry (Recommended)

```bash
poetry install
```

#### For GPU Support (Optional but Recommended)

```bash
poetry run pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

#### Using pip (Alternative)

```bash
pip install -r requirements.txt
# For GPU support:
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

### 3. Configure MCP Server in Cursor

Add the following configuration to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "ocr-mcp": {
      "command": "python",
      "args": ["-m", "ocr_mcp.server"],
      "env": {
        "OCR_CACHE_DIR": "/path/to/model/cache",
        "OCR_DEVICE": "cuda"
      }
    }
  }
}
```

**Note:** 
- Update `OCR_CACHE_DIR` to your preferred cache directory path
- Change `OCR_DEVICE` to `"cpu"` if you don't have CUDA/GPU support
- Ensure the path to the `ocr-mcp` repository is in your Python path, or use the full path to the Python executable in the cloned repository

### 4. Windows-Specific Configuration

For Windows, you may need to adjust the configuration:

```json
{
  "mcpServers": {
    "ocr-mcp": {
      "command": "python",
      "args": ["-m", "ocr_mcp.server"],
      "env": {
        "OCR_CACHE_DIR": "C:\\path\\to\\model\\cache",
        "OCR_DEVICE": "cpu"
      }
    }
  }
}
```

## Usage

Once configured, you can use the OCR MCP server to analyze images like `Swine Tech_Funnel Web_Assets.jpg` directly in Cursor.

## Troubleshooting

- If you encounter import errors, ensure the `ocr-mcp` directory is in your Python path
- For GPU issues, verify CUDA installation and compatibility
- Check that all dependencies are properly installed
