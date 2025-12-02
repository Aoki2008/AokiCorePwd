# AokiCorePwd

一个安全、灵活的账号存储应用，支持本地独立运行或局域网协作。

[English Version (英文版)](README_EN.md)

## 功能特点
- **双模式运行**：
    - **本地模式 (Local Mode)**：数据存储在本地浏览器 (IndexedDB) 或 Windows 客户端中，无需后端服务器，完全离线可用。
    - **远程模式 (Remote Mode)**：连接 Node.js 后端，支持局域网内多端数据同步和共享。
- **多平台支持**：Web (浏览器), Windows (Electron), Android (Capacitor)。
- **项目管理**：将账号按项目进行分类管理。
- **账号管理**：存储账号凭据和自定义字段（如 URL、备注等）。
- **回收站**：支持软删除账号，提供恢复和永久删除选项。
- **安全性**：界面默认隐藏密码。
- **本地化**：全中文（简体）界面。

## 快速开始

### 1. 本地模式 (推荐个人使用)
无需配置后端，直接运行前端即可。

**Web 端开发/预览**:
```bash
cd client
npm install
npm run dev
```
访问 `http://localhost:5173`。

**Windows 客户端打包**:
```bash
# 本地模式 (Local Mode)
npm run electron:build

# 远程模式 (Remote Mode) - 需配置 .env 中的 VITE_API_URL
npm run electron:build:remote
```
生成的安装包位于 `client/dist_electron/`。

**Android 客户端打包**:
```bash
# 本地模式 (Local Mode)
npm run cap:android

# 远程模式 (Remote Mode) - 需配置 .env 中的 VITE_API_URL
npm run cap:android:remote
```

### 2. 远程/局域网模式 (推荐团队/多端同步)
需要启动后端服务。

**后端设置**:
```bash
cd server
npm install
# 初始化数据库
npx prisma migrate dev --name init
# 启动服务 (默认端口 3001)
node index.js
```

**前端连接设置**:
修改 `client/.env` 或在构建时指定环境变量：
```bash
VITE_DATA_MODE=remote
VITE_API_URL=http://<服务器IP>:3001/api
```

**构建部署**:
```bash
cd client
npm run build
```
将 `client/dist` 目录下的文件部署到任意 Web 服务器 (如 Nginx)。

## 技术栈
- **前端**：React, Vite, Tailwind CSS, Dexie.js (Local DB)
- **后端**：Node.js, Express, Prisma (Remote DB)
- **客户端**：Electron (Windows), Capacitor (Android)
- **数据库**：IndexedDB (Local), SQLite (Remote)

## 文档
详细文档请查看 `docs/` 目录：
- [开发记录 (Walkthrough)](docs/walkthrough.md)
- [任务清单 (Tasks)](docs/task.md)
- [本地模式计划](docs/implementation_plan.md)
- [架构隔离计划](docs/isolation_plan.md)
