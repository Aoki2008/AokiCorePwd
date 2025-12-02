# Walkthrough - Local Mode Upgrade

## 1. Recycle Bin Preservation Fix
**Goal**: Ensure accounts in the Recycle Bin are not permanently deleted when their parent project is deleted.

### Changes
- **Backend**: Updated `server/index.js` to unlink accounts (set `projectId` to `null`) instead of deleting them when a project is removed.
- **Database**: Updated `server/prisma/schema.prisma` to make `projectId` optional.

### Verification
- **Script**: `server/verify_fix.js`
- **Result**: The script confirmed that after deleting a project, its associated accounts in the Recycle Bin remained with `projectId: null`.

![Recycle Bin Verification](file:///C:/Users/Aoki/.gemini/antigravity/brain/e00df7e6-2315-4da2-8fff-68d338f79305/verify_recycle_bin_fix_1764580216744.webp)

## 2. Account Creation Fix
**Goal**: Fix the "404 Not Found" error when creating accounts.

### Changes
- **Frontend**: Refactored `AccountForm.jsx` to correctly use the `onSubmit` prop instead of calling the API directly, ensuring the parent component handles the logic and state updates.

### Verification
- **Manual Test**: Successfully created a new account "Test Account" in "Test Project".

![Account Creation Verification](file:///C:/Users/Aoki/.gemini/antigravity/brain/e00df7e6-2315-4da2-8fff-68d338f79305/verify_account_creation_1764580008064.webp)

## 3. Local Mode Implementation
**Goal**: Enable a standalone "Local Mode" where data is stored client-side using IndexedDB.

### Changes
- **Dependencies**: Added `dexie` for IndexedDB management.
- **Data Layer**: Created `client/src/services/db.js` (schema) and `client/src/services/dataService.js` (CRUD operations).
- **Components**: Refactored `ProjectList`, `AccountList`, `RecycleBin`, and `App` to use `dataService` instead of Axios.
- **UI**: Replaced `window.prompt` with a custom modal for project creation to improve UX and testability.

### Verification
- **Browser Test**: Verified that projects and accounts can be created and persist after a page reload.
    1.  Created "Local Project 2".
    2.  Created "Local Account 2" under it.
    3.  Refreshed the page.
    4.  Confirmed data persistence.

![Local Mode Verification](file:///C:/Users/Aoki/.gemini/antigravity/brain/e00df7e6-2315-4da2-8fff-68d338f79305/verify_local_mode_final_retry_1764581794777.webp)

## 4. Windows Build (Electron)
**Goal**: Package the application as a standalone Windows executable.

### Configuration
- **Main Process**: Created `client/electron/main.js` to create the application window and load the React app.
- **Scripts**: Added `electron:dev` and `electron:build` to `package.json`.
- **Dependencies**: Installed `electron`, `electron-builder`, `concurrently`, `cross-env`, `wait-on`.

### Build Status
- **Configuration**: Complete.
- **Build**: Successful. The installer is located in `client/dist_electron/AokiCorePwd Setup 1.0.0.exe`.
- **Note**: The `.svg` icon configuration was removed to resolve a build error on Windows. To use a custom icon, please add an `.ico` file to `public/` and update `package.json`.

## 5. Android Build (Capacitor)
**Goal**: Prepare the application for Android deployment.

### Configuration
- **Setup**: Initialized Capacitor (`npx cap init`) and added Android platform (`npx cap add android`).
- **Scripts**: Added `cap:sync` and `cap:android` to `package.json`.
- **Sync**: Successfully built the web app and synced assets to the Android project.

### Build Instructions
- **Run**: `npx cap open android` to open the project in Android Studio.
- **Run**: `npx cap open android` to open the project in Android Studio.
- **Build**: Use Android Studio to build the APK or run on an emulator/device.
- **Note**: Fixed status bar overlap issue by adding `viewport-fit=cover` and safe-area padding with a minimum fallback of `32px` to ensure content is not obscured.

## 6. Final Project Cleanup & Verification
**Goal**: Remove unused files and verify the application still runs correctly.

### Cleanup
- Deleted: `server/verify_fix.js`, `server/cleanup_data.js`, `client/src/lib/api.js`, `client/src/App.css`.

### Runtime Verification
- **Action**: Ran `npm run dev` and verified the application loads in the browser.
- **Result**: Application loads successfully with all features intact.

![Final Runtime Verification](file:///C:/Users/Aoki/.gemini/antigravity/brain/e00df7e6-2315-4da2-8fff-68d338f79305/app_running_after_cleanup_1764603913984.png)

## 7. Architecture Isolation (Multi-Mode Support)
**Goal**: Decouple Electron-specific configurations from standard Web configurations to support future LAN/Server modes.

### Changes
- **Build Config**: Created `vite.config.electron.js` for Electron (relative paths) and restored `vite.config.js` for Web (absolute paths).
- **Routing**: Created `AppRouter` to dynamically select `HashRouter` (Electron) or `BrowserRouter` (Web) based on the environment.
- **Scripts**: Updated `package.json` to use the correct config for each build target.

### Verification
- **Web Build**: `npm run build` (Success)
- **Electron Build**: `npm run electron:build` (Success)

## 8. Source Code Refactoring
**Goal**: Organize source code to clearly separate Local/Remote logic and improve maintainability.

### Changes
- **Data Layer (`src/api/`)**:
    - `local/`: IndexedDB implementation (Dexie).
    - `remote/`: API implementation (Fetch).
    - `index.js`: Factory that exports the correct service based on `VITE_DATA_MODE`.
- **Layouts (`src/layouts/`)**: Moved `Layout.jsx` here.
- **Features (`src/components/features/`)**: Grouped `ProjectList`, `AccountList`, `AccountForm`, `RecycleBin`.

### Verification
- **Web Build**: `npm run build` (Success)
- **Electron Build**: `npm run electron:build` (Success)
