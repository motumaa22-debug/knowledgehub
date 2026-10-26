# 📚 KnowledgeHub — Digital Knowledge Library

> **KnowledgeHub** is a full-stack digital library platform where visitors can browse and read verified digital knowledge resources, while registered contributors can submit cultural and educational content—including digital books in PDF format, traditional proverbs, poetry, and short fiction stories. Administrative review workflows ensure all public contributions meet quality and curation standards before publishing.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Single Page Application (SPA) with fast HMR |
| **Routing** | React Router v6 | Client-side routing with protected routes |
| **Styling** | Vanilla CSS (App.css & index.css) | Library/academic design system |
| **Backend** | PHP 8+ REST API | Stateless JSON REST endpoints |
| **Database** | MySQL / MariaDB via PDO | Relational database schema with foreign keys |
| **Database Tool** | phpMyAdmin | Visual database inspection and queries |
| **Local Environment** | Windows + XAMPP + Node.js | Standard developer environment |

---

## 📂 Exact Project Directory Structure

```text
knowledgehub/
│
├── frontend/
│   ├── public/
│   │   └── index.html               # Main HTML entry document
│   │
│   ├── src/
│   │   ├── assets/                  # Static assets & images
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Global navigation bar with auth badges
│   │   │   ├── Footer.jsx           # Platform footer & resource links
│   │   │   ├── SearchBar.jsx        # Search input for titles/authors/keywords
│   │   │   ├── ContentCard.jsx      # Card for books, poems, proverbs
│   │   │   ├── CategoryCard.jsx     # Card for browsing categories
│   │   │   └── ProtectedRoute.jsx   # Route guard for auth & admin permissions
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Hero landing page & category showcase
│   │   │   ├── BrowseLibrary.jsx    # Filterable catalog & search results
│   │   │   ├── ContentDetails.jsx   # Reader view & PDF download trigger
│   │   │   ├── Login.jsx            # Contributor/admin login form
│   │   │   ├── Register.jsx         # Contributor account registration
│   │   │   ├── SubmitContent.jsx    # Direct text input & PDF upload form
│   │   │   ├── MySubmissions.jsx    # Contributor submission status tracker
│   │   │   └── AdminDashboard.jsx   # Administrative review & moderation queue
│   │   │
│   │   ├── services/
│   │   │   ├── api.js               # Centralized Fetch client with JWT handling
│   │   │   ├── authService.js       # Authentication endpoints client
│   │   │   └── contentService.js    # Content & moderation API client
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global user session & auth state provider
│   │   │
│   │   ├── App.jsx                  # Main application component & routing
│   │   ├── main.jsx                 # Vite React entry point
│   │   ├── App.css                  # UI layout and component styling
│   │   └── index.css                # Global theme variables & typography
│   │
│   ├── package.json                 # Frontend dependencies & run scripts
│   ├── vite.config.js               # Vite configuration & dev server rules
│   ├── .env                         # Local environment variables
│   └── .gitignore                   # Frontend version control ignore list
│
├── backend/
│   ├── config/
│   │   └── database.php             # PDO MySQL connection handler
│   │
│   ├── api/
│   │   ├── index.php                # API health check & endpoint index
│   │   │
│   │   ├── auth/
│   │   │   ├── register.php         # User registration API endpoint
│   │   │   ├── login.php            # User authentication endpoint
│   │   │   ├── logout.php           # Session invalidation endpoint
│   │   │   └── me.php               # Current user profile endpoint
│   │   │
│   │   ├── categories/
│   │   │   └── list.php             # Categories retrieval endpoint
│   │   │
│   │   ├── contents/
│   │   │   ├── list.php             # Approved content list endpoint
│   │   │   ├── details.php          # Single item detail retrieval
│   │   │   ├── create.php           # Submit new content endpoint
│   │   │   ├── my-submissions.php   # User submissions retrieval
│   │   │   └── upload.php           # Secure PDF upload endpoint
│   │   │
│   │   └── admin/
│   │       ├── pending.php          # Pending submissions queue
│   │       └── moderate.php         # Approve/reject moderation endpoint
│   │
│   ├── storage/
│   │   └── .gitkeep                 # Preserves uploads storage folder
│   │
│   └── .htaccess                    # Apache CORS, security, and rewrite rules
│
├── database/
│   ├── schema.sql                   # MySQL tables: users, categories, contents
│   └── seed.sql                     # Seed categories and starter sample records
│
├── .gitignore                       # Root repository ignore rules
└── README.md                        # Documentation & setup instructions
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure the following tools are installed on your Windows development environment:
- **Node.js** (v18+ or v20+ recommended) and **npm**
- **XAMPP** (with Apache and MySQL services installed)
- **Visual Studio Code** (or your favorite code editor)

---

### 2. Frontend Installation & Local Dev Server

1. Open your terminal (PowerShell, Command Prompt, or VS Code integrated terminal).
2. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
3. Install the required Node dependencies:
   ```bash
   npm install
   ```
4. Start the Vite local development server:
   ```bash
   npm run dev
   ```
5. Open your web browser and navigate to:
   ```text
   http://localhost:5173
   ```
   You will see the **KnowledgeHub — Digital Knowledge Library** starter application with working navigation, categories, and responsive layout.

---

### 3. Backend & XAMPP Setup

1. Start **XAMPP Control Panel**.
2. Click **Start** for both **Apache** and **MySQL**.
3. Place or symlink the project inside your XAMPP web root (`htdocs`):
   ```text
   C:\xampp\htdocs\knowledgehub
   ```
   *(Or keep it in your workspace and configure an Apache VirtualHost or Alias pointing to `c:\Users\motuma\Downloads\knowledgehub\backend`)*.
4. Verify the backend API is reachable in your browser:
   ```text
   http://localhost/knowledgehub/backend/api/index.php
   ```

---

### 4. Database Setup via phpMyAdmin

1. Open your browser and navigate to **phpMyAdmin**:
   ```text
   http://localhost/phpmyadmin
   ```
2. Click on the **Import** tab (or create a database named `knowledgehub_db`).
3. Import the schema file:
   - Browse to `knowledgehub/database/schema.sql` and click **Go**.
4. Import the sample seed data:
   - Browse to `knowledgehub/database/seed.sql` and click **Go**.
5. The following tables will be created:
   - `users`: Contributor and administrator accounts.
   - `categories`: `Books (PDF)`, `Traditional Proverbs`, `Poems`, `Fiction & Short Stories`.
   - `contents`: Text submissions and uploaded PDF records with moderation statuses (`pending`, `approved`, `rejected`).

---

## 🔒 Security & Upload Storage Guidelines

- **Protected Upload Storage**: Uploaded PDF books are saved in `backend/storage/`. An accompanying `storage/.htaccess` file disables script execution (`php_flag engine off`, blocks `.php`, `.cgi`, `.exe`), preventing malicious scripts from being uploaded or executed.
- **Credential Protection**: Database passwords and production API secrets are never committed into version control. Environment variables are managed through `.env` files and `.env.example` templates.
- **Input Validation**: Backend endpoints validate file types (checking MIME `application/pdf` and file extensions) and sanitize input data before database insertion.

---

## 🛠️ Next Development Milestones

1. **Phase 1 (Complete)**: Folder structure, starter files, routing layout, and starter React application.
2. **Phase 2**: Connect `frontend/src/services/api.js` to MySQL database via PHP backend endpoints.
3. **Phase 3**: Authentication system with password hashing and JWT/session handling.
4. **Phase 4**: File upload handling with drag-and-drop PDF submission.
5. **Phase 5**: Administrator moderation workflow for approving public content.
