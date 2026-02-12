# Deployment Options Summary

This project supports two deployment methods:

## 1. IIS Deployment (Windows Server) ✅ Recommended for Windows

**Files Needed:**
- ✅ `web.config` - IIS configuration
- ✅ Built files from `dist/` folder
- ❌ `server.js` - **NOT NEEDED** (IIS serves files directly)

**Steps:**
1. Build: `npm run build:prod`
2. Copy files to IIS directory
3. Copy `web.config` to IIS root
4. Configure IIS (see `IIS-DEPLOYMENT.md`)

**See:** `IIS-DEPLOYMENT.md` for detailed instructions

---

## 2. Node.js/Express Deployment (Cross-platform)

**Files Needed:**
- ✅ `server.js` - Express server
- ✅ Built files from `dist/` folder
- ❌ `web.config` - **NOT NEEDED** (only for IIS)

**Steps:**
1. Build: `npm run build:prod`
2. Run: `npm run serve:prod` or `node server.js`

**See:** `DEPLOYMENT.md` for detailed instructions

---

## Quick Reference

| Deployment Method | web.config | server.js | Server Type |
|------------------|------------|-----------|-------------|
| **IIS** | ✅ Required | ❌ Not needed | IIS (Windows) |
| **Express** | ❌ Not needed | ✅ Required | Node.js |

---

## Which Should You Use?

- **Use IIS** if:
  - You're on Windows Server
  - You want native Windows integration
  - You prefer IIS management tools
  - You don't want to run Node.js in production

- **Use Express** if:
  - You're on Linux/Mac
  - You want cross-platform deployment
  - You need custom server logic
  - You prefer Node.js ecosystem
