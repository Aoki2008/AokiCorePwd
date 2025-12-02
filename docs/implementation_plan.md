# Implementation Plan - Local Mode Upgrade

## Goal
Upgrade the AokiCorePwd project to support "Local Mode" where data is stored exclusively on the local device. This is the first step towards a multi-mode architecture (Local, LAN, Server). We will also package the application for Windows and Android.

## Architecture Changes

### Current Architecture
- **Frontend**: React -> Axios (`api.js`) -> HTTP REST API
- **Backend**: Node.js/Express -> Prisma -> SQLite
- **Data Storage**: Server-side SQLite database

### New "Local Mode" Architecture
- **Frontend**: React -> Data Service Adapter -> Local Storage (IndexedDB via Dexie.js)
- **Backend**: None (for Local Mode). The app runs entirely in the client.
- **Data Storage**: Client-side IndexedDB.

### Platform Strategy
- **Windows**: Electron. Wraps the React application.
- **Android**: Capacitor. Wraps the React application.

## Proposed Changes

### 1. Data Layer Refactoring
- **Create `src/services/db.js`**: Initialize Dexie.js database with a schema matching the current Prisma schema.
- **Create `src/services/dataService.js`**: An abstraction layer that switches between "Local" (Dexie) and "Remote" (API) modes.
    - For now, we will implement the "Local" strategy.
- **Update Components**: Refactor `AccountList`, `ProjectList`, `RecycleBin`, `AccountForm` to use `dataService` instead of direct `api` calls.

### 2. Windows Application (Electron)
- **Install Electron**: Add `electron` and `electron-builder`.
- **Configure Main Process**: Create `electron/main.js` to load the React app.
- **Build Script**: Add `npm run build:win` to package the app.

### 3. Android Application (Capacitor)
- **Install Capacitor**: Add `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`.
- **Initialize Capacitor**: Run `npx cap init`.
- **Build Script**: Add `npm run build:android` to sync and open Android Studio.

## Verification Plan

### Automated Tests
- Verify `dataService` CRUD operations using the browser subagent.
- Verify data persistence in IndexedDB across reloads.

### Manual Verification
- **Windows**: Build and run the `.exe`.
- **Android**: Build and run the `.apk` (User will need to do this via Android Studio, or we provide the build artifacts if environment allows).

## User Review Required
> [!IMPORTANT]
> **Data Migration**: This change introduces a *new* local database (IndexedDB). Existing data in the server-side SQLite database will **NOT** be automatically migrated to the client-side IndexedDB in this step. The "Local Mode" app will start empty.
>
> **Server Process**: In "Local Mode", the Node.js server is not used. The app is standalone.

