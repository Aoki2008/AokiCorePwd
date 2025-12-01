# AokiCorePwd

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
