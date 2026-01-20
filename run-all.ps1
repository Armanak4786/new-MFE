Write-Host "Starting MFE Applications..."

Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx ng serve authentication --open"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx ng serve dealer --port 4201"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx ng serve commercial --port 4202"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx ng serve admin --port 4203"

Write-Host "All applications started."
