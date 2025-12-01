# AokiCorePwd

一个安全、本地化的账号存储应用，支持自定义字段和回收站功能。

## 功能特点
- **项目管理**：将账号按项目进行分类管理。
- **账号管理**：存储账号凭据和自定义字段（如 URL、备注等）。
- **回收站**：支持软删除账号，提供恢复和永久删除选项。
- **安全性**：数据存储在本地 SQLite 数据库中。界面默认隐藏密码。
- **本地化**：全中文（简体）界面。

## 快速开始

### 前置要求
- Node.js (v18 或更高版本)
- npm

### 安装步骤

1.  **克隆仓库**：
    ```bash
    git clone https://github.com/Aoki2008/AokiCorePwd.git
    cd AokiCorePwd
    ```

2.  **设置后端**：
    ```bash
    cd server
    npm install
    
    # 创建 .env 文件
    echo DATABASE_URL="file:./dev.db" > .env
    
    # 初始化数据库 (这将创建 dev.db 文件)
    npx prisma migrate dev --name init
    
    # 启动服务器
    node index.js
    ```
    后端运行在 `http://localhost:3001`。

3.  **设置前端**：
    ```bash
    cd ../client
    npm install
    npm run dev
    ```
    前端运行在 `http://localhost:5173`。

4.  **使用**：
    打开浏览器并访问 `http://localhost:5173`。

## 技术栈
- **前端**：React, Vite, Tailwind CSS, Lucide React
- **后端**：Node.js, Express, Prisma
- **数据库**：SQLite

---

# English Version (May not be updated in real-time)

## AokiCorePwd

A secure, local account storage application with custom fields and recycle bin functionality.

## Features
- **Project Management**: Organize accounts into projects.
- **Account Management**: Store credentials and custom fields (e.g., URLs, Notes).
- **Recycle Bin**: Soft delete accounts with restore and permanent delete options.
- **Security**: Data stored locally in SQLite. Passwords masked in UI.
- **Localization**: Full Chinese (Simplified) interface.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Aoki2008/AokiCorePwd.git
    cd AokiCorePwd
    ```

2.  **Setup Backend**:
    ```bash
    cd server
    npm install
    
    # Create .env file
    echo DATABASE_URL="file:./dev.db" > .env
    
    # Initialize Database (This creates the dev.db file)
    npx prisma migrate dev --name init
    
    # Start Server
    node index.js
    ```
    Backend runs on `http://localhost:3001`.

3.  **Setup Frontend**:
    ```bash
    cd ../client
    npm install
    npm run dev
    ```
    Frontend runs on `http://localhost:5173`.

4.  **Usage**:
    Open your browser and navigate to `http://localhost:5173`.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express, Prisma
- **Database**: SQLite
