# OCR MCP Server Setup Script for Windows
# This script helps set up the OCR MCP server for viewing images

Write-Host "OCR MCP Server Setup Script" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host ""

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
$pythonCmd = $null
$pythonVersion = $null

# Try 'python' command first
$pythonCheck = python --version 2>&1
if ($LASTEXITCODE -eq 0) {
    $pythonCmd = "python"
    $pythonVersion = $pythonCheck
} else {
    # Try 'py' launcher (common on Windows)
    $pyCheck = py --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $pythonCmd = "py"
        $pythonVersion = $pyCheck
    } else {
        # Try 'python3' as fallback
        $python3Check = python3 --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            $pythonCmd = "python3"
            $pythonVersion = $python3Check
        }
    }
}

if (-not $pythonCmd) {
    Write-Host "Python not found in PATH. Checking common installation locations..." -ForegroundColor Yellow
    
    # Check common Windows Python locations
    $commonPaths = @(
        "$env:LOCALAPPDATA\Programs\Python",
        "$env:ProgramFiles\Python*",
        "$env:ProgramFiles(x86)\Python*",
        "$env:USERPROFILE\AppData\Local\Programs\Python"
    )
    
    $foundPython = $null
    foreach ($basePath in $commonPaths) {
        $pythonDirs = Get-ChildItem -Path $basePath -ErrorAction SilentlyContinue -Directory | 
            Where-Object { $_.Name -match "Python\d+" } | 
            Sort-Object Name -Descending
        
        foreach ($pythonDir in $pythonDirs) {
            $pythonExe = Join-Path $pythonDir.FullName "python.exe"
            if (Test-Path $pythonExe) {
                $versionCheck = & $pythonExe --version 2>&1
                if ($LASTEXITCODE -eq 0) {
                    $foundPython = $pythonExe
                    Write-Host "Found Python at: $pythonExe" -ForegroundColor Green
                    Write-Host "Version: $versionCheck" -ForegroundColor Green
                    break
                }
            }
        }
        if ($foundPython) { break }
    }
    
    if ($foundPython) {
        $pythonCmd = $foundPython
        $pythonVersion = & $foundPython --version 2>&1
        Write-Host "Using Python from: $pythonCmd" -ForegroundColor Cyan
        Write-Host "Version: $pythonVersion" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
        Write-Host "" -ForegroundColor Yellow
        Write-Host "Please install Python 3.8 or higher:" -ForegroundColor Yellow
        Write-Host "1. Download from https://www.python.org/downloads/" -ForegroundColor White
        Write-Host "2. During installation, check 'Add Python to PATH'" -ForegroundColor White
        Write-Host "3. Restart your terminal after installation" -ForegroundColor White
        Write-Host "" -ForegroundColor Yellow
        Write-Host "Alternatively, if Python is installed but not in PATH:" -ForegroundColor Yellow
        Write-Host "- Add Python to your system PATH manually" -ForegroundColor White
        Write-Host "- Or use the full path to python.exe in the script" -ForegroundColor White
        exit 1
    }
}

Write-Host "Found: $pythonVersion" -ForegroundColor Green
Write-Host "Using command: $pythonCmd" -ForegroundColor Cyan
Write-Host ""

# Check if Poetry is installed
Write-Host "Checking Poetry installation..." -ForegroundColor Yellow
$poetryVersion = poetry --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Poetry not found. Checking if pip is available..." -ForegroundColor Yellow
    # Try pip with the detected Python command
    $pipVersion = & $pythonCmd -m pip --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        # Fallback to direct pip command
        $pipVersion = pip --version 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Trying to install pip..." -ForegroundColor Yellow
            # Try to ensure pip is installed
            & $pythonCmd -m ensurepip --upgrade 2>&1 | Out-Null
            if ($LASTEXITCODE -ne 0) {
                Write-Host "ERROR: Could not install pip. Please install pip manually." -ForegroundColor Red
                exit 1
            }
            $pipVersion = & $pythonCmd -m pip --version 2>&1
        }
    }
    Write-Host "Using pip for installation: $pipVersion" -ForegroundColor Green
    $usePoetry = $false
} else {
    Write-Host "Found: $poetryVersion" -ForegroundColor Green
    $usePoetry = $true
}
Write-Host ""

# Clone the repository
$ocrRepoPath = "ocr-mcp"
if (Test-Path $ocrRepoPath) {
    Write-Host "OCR-MCP repository already exists at $ocrRepoPath" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to remove and re-clone? (y/N)"
    if ($overwrite -eq "y" -or $overwrite -eq "Y") {
        Remove-Item -Recurse -Force $ocrRepoPath
        Write-Host "Cloning OCR-MCP repository..." -ForegroundColor Yellow
        git clone https://github.com/sandraschi/ocr-mcp.git
    } else {
        Write-Host "Using existing repository" -ForegroundColor Green
    }
} else {
    Write-Host "Cloning OCR-MCP repository..." -ForegroundColor Yellow
    git clone https://github.com/sandraschi/ocr-mcp.git
}

if (-not (Test-Path $ocrRepoPath)) {
    Write-Host "ERROR: Failed to clone repository" -ForegroundColor Red
    exit 1
}

Write-Host "Repository cloned successfully" -ForegroundColor Green
Write-Host ""

# Install dependencies
Set-Location $ocrRepoPath
Write-Host "Installing dependencies..." -ForegroundColor Yellow

if ($usePoetry) {
    Write-Host "Using Poetry to install dependencies..." -ForegroundColor Cyan
    poetry install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Poetry install failed" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
} else {
    Write-Host "Using pip to install dependencies..." -ForegroundColor Cyan
    if (Test-Path "requirements.txt") {
        & $pythonCmd -m pip install -r requirements.txt
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: pip install failed" -ForegroundColor Red
            Set-Location ..
            exit 1
        }
    } else {
        Write-Host "WARNING: requirements.txt not found. You may need to install dependencies manually." -ForegroundColor Yellow
    }
}

Write-Host "Dependencies installed successfully" -ForegroundColor Green
Write-Host ""

# Ask about GPU support
$installGPU = Read-Host "Do you want to install GPU support (CUDA)? This requires NVIDIA GPU. (y/N)"
if ($installGPU -eq "y" -or $installGPU -eq "Y") {
    Write-Host "Installing GPU support (CUDA 12.1)..." -ForegroundColor Yellow
    if ($usePoetry) {
        poetry run pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
    } else {
        & $pythonCmd -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
    }
    Write-Host "GPU support installed" -ForegroundColor Green
} else {
    Write-Host "Skipping GPU support. Using CPU mode." -ForegroundColor Yellow
}

Set-Location ..

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Configure the MCP server in Cursor settings" -ForegroundColor White
Write-Host "2. Add the configuration from ocr-setup.md to your Cursor MCP settings" -ForegroundColor White
Write-Host "3. Update the MCP config to use: $pythonCmd (instead of 'python')" -ForegroundColor Yellow
Write-Host "4. Update the OCR_CACHE_DIR path to your preferred location" -ForegroundColor White
Write-Host "5. Set OCR_DEVICE to 'cuda' if you installed GPU support, or 'cpu' otherwise" -ForegroundColor White
Write-Host ""
Write-Host "The OCR-MCP repository is located at: $(Resolve-Path $ocrRepoPath)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Example MCP configuration (update mcp-config.json):" -ForegroundColor Cyan
Write-Host '{' -ForegroundColor Gray
Write-Host '  "mcpServers": {' -ForegroundColor Gray
Write-Host '    "ocr-mcp": {' -ForegroundColor Gray
Write-Host "      `"command`": `"$pythonCmd`"," -ForegroundColor White
Write-Host '      "args": ["-m", "ocr_mcp.server"],' -ForegroundColor Gray
Write-Host '      "env": {' -ForegroundColor Gray
Write-Host "        `"OCR_CACHE_DIR`": `"./ocr-mcp/.cache`"," -ForegroundColor Gray
Write-Host '        "OCR_DEVICE": "cpu"' -ForegroundColor Gray
Write-Host '      }' -ForegroundColor Gray
Write-Host '    }' -ForegroundColor Gray
Write-Host '  }' -ForegroundColor Gray
Write-Host '}' -ForegroundColor Gray
