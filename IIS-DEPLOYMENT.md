# IIS Deployment Guide for Micro-Frontend Application

This guide explains how to deploy the Micro-Frontend (MFE) application to IIS (Internet Information Services).

## Important Note

**You do NOT need `server.js` for IIS deployment.** The `server.js` file is only used for Node.js/Express server deployment. IIS serves static files directly, so you only need:
- `web.config` - IIS configuration file (required)
- Built application files from `dist/` folder

## Prerequisites

- IIS installed on Windows Server
- URL Rewrite Module for IIS installed ([Download here](https://www.iis.net/downloads/microsoft/url-rewrite))
- Node.js installed (for building the application only - not needed for serving)

## Build Process

### 1. Build All Projects

```bash
npm run build:prod
```

This will create the following directories in the `dist` folder:
- `dist/authentication/` - Shell application
- `dist/dealer/` - Dealer remote
- `dist/commercial/` - Commercial remote
- `dist/admin/` - Admin remote

## IIS Setup

### Step 1: Copy Files to IIS Directory

1. Copy the entire `dist` folder contents to your IIS website directory (typically `C:\inetpub\wwwroot\` or your custom website directory)

2. Copy `web.config` to the root of your IIS website directory

**Directory Structure:**
```
C:\inetpub\wwwroot\
├── web.config
├── index.html (from dist/authentication/)
├── authentication/ (all files from dist/authentication/)
├── dealer/ (all files from dist/dealer/)
├── commercial/ (all files from dist/commercial/)
└── admin/ (all files from dist/admin/)
```

**OR** if you want to keep the structure as-is:

```
C:\inetpub\wwwroot\
├── web.config
├── index.html (from dist/authentication/)
├── (all other files from dist/authentication/)
├── dealer/
│   ├── index.html
│   ├── remoteEntry.js
│   └── (all other files from dist/dealer/)
├── commercial/
│   ├── index.html
│   ├── remoteEntry.js
│   └── (all other files from dist/commercial/)
└── admin/
    ├── index.html
    ├── remoteEntry.js
    └── (all other files from dist/admin/)
```

### Step 2: Install URL Rewrite Module

1. Download URL Rewrite Module from: https://www.iis.net/downloads/microsoft/url-rewrite
2. Install the module
3. Restart IIS

### Step 3: Configure IIS Website

1. Open **IIS Manager**
2. Right-click on your website → **Properties**
3. Go to **Home Directory** tab
4. Ensure **Local Path** points to your website directory
5. Click **OK**

### Step 4: Set Application Pool

1. Select your website in IIS Manager
2. Click **Basic Settings** in the right panel
3. Click **Select** next to Application Pool
4. Choose **.NET CLR Version: No Managed Code** (since this is a static Angular app)
5. Click **OK**

### Step 5: Enable Static Content Compression (Optional but Recommended)

1. In IIS Manager, select your server (not the website)
2. Double-click **Compression**
3. Enable **Enable dynamic content compression**
4. Enable **Enable static content compression**
5. Click **Apply**

## Configuration

### Base Href Configuration

If your application is deployed to a subdirectory (e.g., `http://yourserver.com/myapp/`), you need to update the base href:

1. Update `angular.json` for each project to set the baseHref:

```json
"build": {
  "options": {
    "baseHref": "/myapp/",
    ...
  }
}
```

2. Or build with base href:

```bash
ng build authentication --base-href /myapp/
ng build dealer --base-href /myapp/dealer/
ng build commercial --base-href /myapp/commercial/
ng build admin --base-href /myapp/admin/
```

### Environment Configuration

The production environment (`src/environments/environment.prod.ts`) is configured to use same-origin paths, which works perfectly with IIS:

```typescript
remotes: {
  dealer: `${origin}/dealer`,
  commercial: `${origin}/commercial`,
  admin: `${origin}/admin`,
}
```

If your application is in a subdirectory, update the environment file:

```typescript
remotes: {
  dealer: `${origin}/myapp/dealer`,
  commercial: `${origin}/myapp/commercial`,
  admin: `${origin}/myapp/admin`,
}
```

## Testing

After deployment, test the following URLs:

- Shell (Authentication): `http://yourserver.com/`
- Dealer: `http://yourserver.com/dealer/`
- Commercial: `http://yourserver.com/commercial/`
- Admin: `http://yourserver.com/admin/`

## Troubleshooting

### Module Federation Not Loading

1. **Check Browser Console**: Look for CORS errors or 404 errors for `remoteEntry.js`
2. **Verify File Paths**: Ensure `remoteEntry.js` files exist in:
   - `/dealer/remoteEntry.js`
   - `/commercial/remoteEntry.js`
   - `/admin/remoteEntry.js`
3. **Check IIS Logs**: Located at `C:\inetpub\logs\LogFiles\`

### 404 Errors for Routes

1. Ensure URL Rewrite Module is installed
2. Verify `web.config` is in the root directory
3. Check that rewrite rules are working (test with IIS Manager → URL Rewrite → View Server Variables)

### CORS Issues

1. Verify `web.config` includes CORS headers
2. Check that `Access-Control-Allow-Origin` header is set to `*` or your specific domain

### Assets Not Loading

1. Check MIME types in `web.config`
2. Verify file paths are correct
3. Ensure `auro-ui-assets` folder is copied correctly

### Performance Issues

1. Enable static content compression in IIS
2. Enable HTTP/2 if available
3. Consider using a CDN for static assets

## Advanced Configuration

### Using HTTPS

1. Install SSL certificate in IIS
2. Update `web.config` to redirect HTTP to HTTPS:

```xml
<rule name="Redirect to HTTPS" stopProcessing="true">
  <match url="(.*)" />
  <conditions>
    <add input="{HTTPS}" pattern="^OFF$" />
  </conditions>
  <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" redirectType="Permanent" />
</rule>
```

### Custom Error Pages

Add to `web.config`:

```xml
<httpErrors>
  <remove statusCode="404" />
  <error statusCode="404" path="/index.html" responseMode="ExecuteURL" />
</httpErrors>
```

### Security Headers

Add security headers in `web.config`:

```xml
<httpProtocol>
  <customHeaders>
    <add name="X-Content-Type-Options" value="nosniff" />
    <add name="X-Frame-Options" value="DENY" />
    <add name="X-XSS-Protection" value="1; mode=block" />
  </customHeaders>
</httpProtocol>
```

## Automated Deployment Script

Create a PowerShell script (`deploy-to-iis.ps1`):

```powershell
# Build all projects
Write-Host "Building all projects..." -ForegroundColor Green
npm run build:prod

# Copy files to IIS directory
$iisPath = "C:\inetpub\wwwroot\"
$distPath = ".\dist\"

Write-Host "Copying files to IIS..." -ForegroundColor Green

# Copy authentication (shell)
Copy-Item -Path "$distPath\authentication\*" -Destination $iisPath -Recurse -Force

# Copy remotes
Copy-Item -Path "$distPath\dealer" -Destination "$iisPath\dealer" -Recurse -Force
Copy-Item -Path "$distPath\commercial" -Destination "$iisPath\commercial" -Recurse -Force
Copy-Item -Path "$distPath\admin" -Destination "$iisPath\admin" -Recurse -Force

# Copy web.config
Copy-Item -Path ".\web.config" -Destination $iisPath -Force

Write-Host "Deployment complete!" -ForegroundColor Green
```

Run with:
```powershell
.\deploy-to-iis.ps1
```

## Support

For issues specific to:
- **IIS Configuration**: Check IIS logs and Event Viewer
- **Module Federation**: Check browser console and network tab
- **Routing**: Verify URL Rewrite rules in IIS Manager
