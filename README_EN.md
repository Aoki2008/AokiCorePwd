# AokiCorePwd

A secure and flexible password manager that supports both local standalone usage and LAN collaboration.

[中文版 (Chinese Version)](README.md)

## Features
- **Dual Mode**:
    - **Local Mode**: Data stored locally in browser (IndexedDB) or Windows client. No backend required, fully offline.
    - **Remote Mode**: Connects to Node.js backend for LAN synchronization and data sharing.
- **Multi-Platform**: Web (Browser), Windows (Electron), Android (Capacitor).
- **Project Management**: Organize accounts by projects.
- **Account Management**: Store credentials and custom fields.
- **Recycle Bin**: Soft delete with restore and permanent delete options.
- **Security**: Passwords hidden by default.

## Quick Start

### 1. Local Mode (Recommended for Personal Use)
No backend configuration needed.

**Web Dev/Preview**:
```bash
cd client
npm install
npm run dev
```
Visit `http://localhost:5173`.

**Windows Client Build**:
```bash
# Local Mode
npm run electron:build

# Remote Mode (Configure VITE_API_URL in .env first)
npm run electron:build:remote
```
Installer located in `client/dist_electron/`.

**Android Client Build**:
```bash
# Local Mode
npm run cap:android

# Remote Mode (Configure VITE_API_URL in .env first)
npm run cap:android:remote
```

### 2. Remote/LAN Mode (Recommended for Team/Sync)
Requires backend service.

**Backend Setup**:
```bash
cd server
npm install
# Initialize Database
npx prisma migrate dev --name init
# Start Server (Default port 3001)
node index.js
```

**Frontend Connection**:
Set environment variables in `client/.env` or during build:
```bash
VITE_DATA_MODE=remote
VITE_API_URL=http://<Server_IP>:3001/api
```

**Build & Deploy**:
```bash
cd client
npm run build
```
Deploy `client/dist` to any Web Server (e.g., Nginx).

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Dexie.js (Local DB)
- **Backend**: Node.js, Express, Prisma (Remote DB)
- **Client**: Electron (Windows), Capacitor (Android)
- **Database**: IndexedDB (Local), SQLite (Remote)

## Documentation
See `docs/` directory for details:
- [Walkthrough](docs/walkthrough.md)
- [Tasks](docs/task.md)
- [Implementation Plan](docs/implementation_plan.md)
- [Isolation Plan](docs/isolation_plan.md)
