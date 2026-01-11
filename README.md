# Drop Calendar - Fashion Product Drop Planning Tool

A production-ready web application for planning and managing fashion product launches (drops). Built with Next.js, TypeScript, and Prisma.

## Features

- **Authentication**: Sign up/login with credentials or Google OAuth
- **Drop Management**: Create, edit, and delete product drops with full CRUD
- **Calendar View**: Monthly calendar showing drops on their launch dates
- **Kanban Board**: Visual status tracking with drag-and-drop support
- **Task Management**: Add, edit, and track tasks for each drop
- **Email Reminders**: Optional email notifications for upcoming drops and tasks
- **Responsive Design**: Clean, minimal dashboard layout
- **Search & Filters**: Find drops by title, status, channel, and date ranges

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM, MySQL
- **Authentication**: NextAuth.js with Credentials and Google providers
- **Forms**: React Hook Form with Zod validation
- **Database**: MySQL with Prisma migrations
- **Email**: Resend (optional)

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database
- Google OAuth credentials (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd drop-calendar
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
DATABASE_URL="mysql://username:password@localhost:3306/drop_calendar"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
RESEND_API_KEY="your-resend-api-key" # optional
```

4. Set up the database:

**Option A: Using Prisma (Recommended)**
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

**Option B: Using SQL Script (Quick Start with Sample Data)**
```bash
# Create the database
mysql -u root -p -e "CREATE DATABASE drop_calendar;"

# Run the seed script
mysql -u root -p drop_calendar < prisma/seed.sql
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
drop-calendar/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/       # Dashboard routes group
│   │   ├── calendar/      # Calendar page
│   │   ├── kanban/        # Kanban page
│   │   ├── drops/         # Drop-related pages
│   │   └── settings/      # Settings page
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── drops/         # Drop CRUD endpoints
│   │   ├── tasks/         # Task CRUD endpoints
│   │   └── settings/      # Settings endpoints
│   └── auth/              # Authentication pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components (sidebar, header)
│   ├── calendar/         # Calendar components
│   ├── kanban/           # Kanban components
│   ├── drops/            # Drop components
│   ├── tasks/            # Task components
│   └── settings/         # Settings components
├── lib/                  # Utility libraries
│   ├── auth.ts          # Authentication configuration
│   ├── prisma.ts        # Prisma client
│   └── validations.ts   # Zod validation schemas
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seed script
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

## Database Schema

The application uses the following main entities:

- **User**: Authentication and user management
- **Drop**: Product launch with title, description, launch date, status, and channel
- **Task**: Tasks associated with drops, with categories, priorities, and due dates
- **Reminder**: Email reminders for drops and tasks

## Sample Data & Demo Accounts

The seed script (`prisma/seed.sql`) includes comprehensive sample data:

### Demo Accounts
All accounts use password: `password123`

1. **Demo User** - `demo@example.com`
   - 5 drops across different statuses and channels
   - Multiple tasks in various completion states
   - Reminders configured

2. **Sarah Johnson** - `sarah@fashionbrand.com`
   - Fashion brand owner with eco-friendly and athleisure drops
   - Email reminders enabled

3. **Alex Chen** - `alex@streetwear.co`
   - Streetwear designer with collaboration drops
   - Minimalist capsule collection

### Sample Data Includes:
- **9 Product Drops** spanning different channels (Website, Instagram, TikTok, Snapchat, Retail)
- **19 Tasks** with various statuses (Todo, Doing, Done) and priorities
- **10 Tags** including Summer, Limited Edition, Sustainable, Collaboration, etc.
- **8 Reminders** for drops and tasks
- **5 Status Types**: Planned, In Progress, Ready, Launched, Archived
- **Realistic Fashion Scenarios**: Summer collections, sneaker collabs, eco-friendly lines, etc.

### Quick Test Scenarios:
1. **Kanban Board**: Drag drops between status columns
2. **Calendar View**: See drops distributed across months
3. **Task Management**: Update task statuses and priorities
4. **Settings**: Configure email reminders
5. **Search & Filter**: Find drops by status, channel, or tags

## Testing

Run the test suite:
```bash
npm test
```

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
GOOGLE_CLIENT_ID="your-production-google-client-id"
GOOGLE_CLIENT_SECRET="your-production-google-client-secret"
RESEND_API_KEY="your-production-resend-key"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Features Overview

### Dashboard Overview
- Shows next 3 upcoming drops
- Tasks due in the next 7 days
- Progress widget for the current drop
- Quick "Create Drop" button

### Calendar View
- Monthly calendar grid with drop indicators
- Color-coded drop statuses
- Click on drops to see details in a drawer
- Navigation between months

### Kanban Board
- 5 columns for different drop statuses (Planned, In Progress, Ready, Launched, Archived)
- Move drops between columns
- Color-coded cards by status
- Drop count per column

### Drop Detail Page
- Drop information and header
- Progress widget showing task completion
- Add/edit/delete tasks
- Filter tasks by category, status, and priority

### Settings Page
- Enable/disable email reminders
- Configure reminder email address
- Save settings with validation
