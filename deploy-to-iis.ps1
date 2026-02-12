# PowerShell script to deploy MFE application to IIS
# Usage: .\deploy-to-iis.ps1 [-IISPath "C:\inetpub\wwwroot\"]

param(
    [string]$IISPath = "C:\inetpub\wwwroot\"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MFE Application IIS Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if IIS path exists
if (-not (Test-Path $IISPath)) {
    Write-Host "Error: IIS path does not exist: $IISPath" -ForegroundColor Red
    Write-Host "Please create the directory or specify a different path using -IISPath parameter" -ForegroundColor Yellow
    exit 1
}

# Build all projects
Write-Host "Step 1: Building all projects..." -ForegroundColor Green
npm run build:prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please check the errors above." -ForegroundColor Red
    exit 1
}

Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host ""

# Copy files to IIS directory
Write-Host "Step 2: Copying files to IIS directory ($IISPath)..." -ForegroundColor Green

$distPath = Join-Path $PSScriptRoot "dist"

# Copy authentication (shell) - root files
Write-Host "  - Copying shell application (authentication)..." -ForegroundColor Yellow
$authSource = Join-Path $distPath "authentication"
if (Test-Path $authSource) {
    Get-ChildItem -Path $authSource -File | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination $IISPath -Force
        Write-Host "    Copied: $($_.Name)" -ForegroundColor Gray
    }
    # Copy subdirectories
    Get-ChildItem -Path $authSource -Directory | ForEach-Object {
        $destDir = Join-Path $IISPath $_.Name
        Copy-Item -Path $_.FullName -Destination $destDir -Recurse -Force
        Write-Host "    Copied directory: $($_.Name)" -ForegroundColor Gray
    }
}

# Copy dealer remote
Write-Host "  - Copying dealer remote..." -ForegroundColor Yellow
$dealerSource = Join-Path $distPath "dealer"
$dealerDest = Join-Path $IISPath "dealer"
if (Test-Path $dealerSource) {
    if (-not (Test-Path $dealerDest)) {
        New-Item -ItemType Directory -Path $dealerDest -Force | Out-Null
    }
    Copy-Item -Path "$dealerSource\*" -Destination $dealerDest -Recurse -Force
    Write-Host "    Dealer remote copied successfully" -ForegroundColor Gray
}

# Copy commercial remote
Write-Host "  - Copying commercial remote..." -ForegroundColor Yellow
$commercialSource = Join-Path $distPath "commercial"
$commercialDest = Join-Path $IISPath "commercial"
if (Test-Path $commercialSource) {
    if (-not (Test-Path $commercialDest)) {
        New-Item -ItemType Directory -Path $commercialDest -Force | Out-Null
    }
    Copy-Item -Path "$commercialSource\*" -Destination $commercialDest -Recurse -Force
    Write-Host "    Commercial remote copied successfully" -ForegroundColor Gray
}

# Copy admin remote
Write-Host "  - Copying admin remote..." -ForegroundColor Yellow
$adminSource = Join-Path $distPath "admin"
$adminDest = Join-Path $IISPath "admin"
if (Test-Path $adminSource) {
    if (-not (Test-Path $adminDest)) {
        New-Item -ItemType Directory -Path $adminDest -Force | Out-Null
    }
    Copy-Item -Path "$adminSource\*" -Destination $adminDest -Recurse -Force
    Write-Host "    Admin remote copied successfully" -ForegroundColor Gray
}

# Copy web.config
Write-Host "  - Copying web.config..." -ForegroundColor Yellow
$webConfigSource = Join-Path $PSScriptRoot "web.config"
if (Test-Path $webConfigSource) {
    Copy-Item -Path $webConfigSource -Destination $IISPath -Force
    Write-Host "    web.config copied successfully" -ForegroundColor Gray
} else {
    Write-Host "    Warning: web.config not found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Ensure URL Rewrite Module is installed in IIS" -ForegroundColor White
Write-Host "2. Verify the application pool is set to 'No Managed Code'" -ForegroundColor White
Write-Host "3. Test the application at:" -ForegroundColor White
Write-Host "   - Shell: http://localhost/" -ForegroundColor Cyan
Write-Host "   - Dealer: http://localhost/dealer/" -ForegroundColor Cyan
Write-Host "   - Commercial: http://localhost/commercial/" -ForegroundColor Cyan
Write-Host "   - Admin: http://localhost/admin/" -ForegroundColor Cyan
Write-Host ""
