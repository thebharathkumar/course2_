# Pace University - Course Equivalency Portal

A web application for Pace University's Education Abroad office to display and manage pre-approved foreign course equivalencies that transfer to Pace University.

## Tech Stack

- **Frontend**: Next.js 16 (React) with TypeScript and Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite via better-sqlite3 (Azure-ready - can migrate to Azure SQL)
- **Authentication**: JWT-based with HTTP-only cookies
- **Excel Parsing**: SheetJS (xlsx)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
npm install
```

### Seed the Database

```bash
npx tsx scripts/seed.ts
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public course search.

### Admin Access

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)

- **Username**: reb123
- **Password**: reb123

### Admin Features

1. **Upload Excel Files**: Upload .xlsx, .xls, or .csv files containing course equivalency data
2. **Column Management**: Choose which columns from the Excel file to display on the public website
3. **Filter Configuration**: Designate columns as filterable dropdowns with custom labels

## Project Structure

```
src/
  app/
    page.tsx                    # Public course search page
    admin/
      page.tsx                  # Admin login
      dashboard/page.tsx        # Admin dashboard
    api/
      auth/login/route.ts       # Login endpoint
      auth/verify/route.ts      # Auth verification & logout
      courses/route.ts          # Course search with filters
      upload/route.ts           # Excel file upload
      settings/route.ts         # Column/filter settings
  components/
    Header.tsx                  # Pace University branded header
    HeroSection.tsx             # Hero with search bar
    FilterSection.tsx           # Dynamic filter dropdowns
    CourseTable.tsx              # Course data table
  lib/
    db.ts                       # Database operations
    auth.ts                     # JWT authentication helpers
scripts/
  seed.ts                       # Database seeding script
data/
  database.sqlite               # SQLite database (auto-created)
```

## Azure Deployment

This application is designed for easy Azure integration:

- Deploy to **Azure App Service** or **Azure Static Web Apps**
- Migrate SQLite to **Azure SQL Database** by updating `src/lib/db.ts`
- Store uploaded files in **Azure Blob Storage**
- Use **Azure Key Vault** for secrets management
