# Insightonix Academic Journal

A professional Scopus-level journal website built with React, Express, and Prisma (MySQL).

## Features

- **Public Interface**:
  - Home page with journal overview and latest issue
  - Issue archives
  - Article details with PDF download
  - Editorial Board listing
  - Contact information
- **Admin Dashboard**:
  - Secure login
  - Manage Issues (Create, Edit, Delete)
  - Manage Articles
  - Manage Editorial Board Members
  - Update Site Settings (Title, ISSN, etc.)

## Prerequisites

- Node.js (v18+)
- MySQL Database

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your credentials:
     ```env
     # Database
     DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
     JWT_SECRET="your-secure-secret-key"
     
     # Cloudflare R2
     CLOUDFLARE_ACCOUNT_ID="your-account-id"
     CLOUDFLARE_ACCESS_KEY_ID="your-access-key"
     CLOUDFLARE_SECRET_ACCESS_KEY="your-secret-key"
     CLOUDFLARE_R2_BUCKET_NAME="your-bucket-name"
     CLOUDFLARE_R2_ENDPOINT="https://xxxx.r2.cloudflarestorage.com"
     CLOUDFLARE_R2_PUBLIC_URL="https://pub-xxxx.r2.dev"
     ```

3. **Initialize Database**
   Push the schema to your database:
   ```bash
   npx prisma db push
   ```
   
   *Note: This will create the necessary tables.*

4. **Migrate Existing Files (If Upgrading)**
   If you have existing files in the local uploads folder, migrate them to R2:
   ```bash
   npm run migrate:r2
   ```
   
   This will:
   - Update all database references from local paths to R2 URLs
   - Supports: Articles (PDFs), Issues (cover images), Board members, Certificates, Awards, eBooks

5. **Create Admin User**
   Insert an admin user into the `admins` table:
   ```sql
   INSERT INTO admins (username, password_hash, email) 
   VALUES ('admin', '$2a$10/...', 'admin@example.com');
   ```
   
   Or use the default fallback credentials for development:
   - Username: `admin`
   - Password: `admin123`

## Running the Application

Start both the frontend and backend server concurrently:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Project Structure

- `src/`: React Frontend
  - `pages/`: Page components
  - `components/`: Reusable components
  - `lib/`: Utilities and API wrapper
  - `store/`: State management (Zustand)
- `api/`: Express Backend
  - `routes/`: API endpoints
  - `middleware/`: Auth middleware
  - `prisma.ts`: Prisma client instance
- `prisma/`: Database Schema

## Deployment

### Vercel Deployment

1. **Connect Repository**
   - Push your code to GitHub
   - Connect your GitHub repo to Vercel

2. **Set Environment Variables**
   In Vercel Dashboard → Project Settings → Environment Variables, add:
   ```
   DATABASE_URL
   JWT_SECRET
   CLOUDFLARE_ACCOUNT_ID
   CLOUDFLARE_ACCESS_KEY_ID
   CLOUDFLARE_SECRET_ACCESS_KEY
   CLOUDFLARE_R2_BUCKET_NAME
   CLOUDFLARE_R2_ENDPOINT
   CLOUDFLARE_R2_PUBLIC_URL
   ```

3. **Deploy**
   - Vercel will automatically deploy on push
   - Frontend builds with Vite
   - API routes deploy as Serverless Functions

4. **Important Notes**
   - All file uploads go to Cloudflare R2 (not local disk)
   - Database must be accessible from Vercel (configure IP whitelist in your hosting)
   - `vercel.json` rewrites API calls correctly

## Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide Icons, Zustand
- **Backend**: Express.js
- **Database**: MySQL, Prisma ORM
- **File Storage**: Cloudflare R2
- **Deployment**: Vercel
- **Tooling**: Vite, TypeScript
