# Implementation Plan - Multi-Mode Isolation

## Goal
Decouple "Local Mode" (Electron) configurations from "Server/LAN Mode" (Web) to ensure future scalability. Specifically, isolate build configurations and routing logic.

## Problem
Currently, we modified the main `vite.config.js` and `App.jsx` to force `HashRouter` and relative paths (`base: './'`). While this fixes the Electron build, it is suboptimal for a standard Web application (LAN/Server mode), which typically uses `BrowserRouter` and absolute paths.

## Proposed Changes

### 1. Build Configuration Isolation
- **Create `vite.config.electron.js`**: A dedicated config for Electron.
    - `base: './'`
    - `mode: 'electron'`
- **Revert `vite.config.js`**: Restore standard web settings for future Server Mode.
    - `base: '/'`

### 2. Routing Isolation
- **Create `src/router/AppRouter.jsx`**: A wrapper component that selects the router based on the environment.
    - If `VITE_IS_ELECTRON` is true -> use `HashRouter`.
    - Otherwise -> use `BrowserRouter`.
- **Update `App.jsx`**: Use `AppRouter` instead of hardcoding `HashRouter`.

### 3. Script Updates (`package.json`)
- **`electron:build`**: Use `vite build -c vite.config.electron.js`.
- **`build`**: Keep default `vite build` for Web/Server mode.

## Verification
- **Electron Build**: Verify `npm run electron:build` still works and produces a working `.exe`.
- **Web Build**: Verify `npm run build` produces a standard web build (we can test this via `npm run dev` in standard mode).
