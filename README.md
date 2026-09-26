# PosterAI — AI Political Poster Maker

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.58-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**An AI-assisted platform for generating ready-to-print Bangladeshi political and cultural posters.**

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap--future-improvements)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 Overview

PosterAI is a full-stack web application that enables users to create professional, print-ready posters for various occasions — Victory Day, Eid greetings, condolence/tribute, election campaigns, and more — by simply filling out a form and letting the system automatically compose a professional poster. The platform features a template library, AI-assisted layout suggestions, photo upload with Cloudinary integration, and SVG-based high-resolution rendering.

The application is built with a modern tech stack and features a premium design system with theme customization, bilingual support (Bangla/English), and a fully responsive interface.

---

## 🚀 Live Demo

**[https://aipostermaker.vercel.app](https://aipostermaker.vercel.app)**

---

## ✨ Features

### Core Functionality
- **Template Library**: Categorized poster designs for Victory Day, Condolence/Tribute, Election Campaign, Eid Greeting, Eid Mubarak, Leadership, and Youth Rally occasions
- **Multi-step Poster Creation**: Guided form with personal details, organization information, poster content, and photo upload
- **Photo Upload**: Upload up to 4 photos with automatic preview and Cloudinary integration (or base64 fallback)
- **Template-based Layout**: Deterministic layout suggestions with color palettes and typography recommendations from template configurations
- **High-Resolution Rendering**: SVG-based poster generation (1200x1600) with proper Bangla font rendering (Hind Siliguri/Noto Sans Bengali)
- **Poster Dashboard**: View poster history, status tracking, and regenerate functionality (max 3 regenerates per poster)
- **User Authentication**: Secure Supabase Auth with JWT tokens and user profiles
- **Poster Regeneration**: Re-generate posters with updated layouts (limited to 3 regenerates per poster)

### Design & UX
- **5-Color Theme Switcher**: Deep Green (default), Maroon, Gold, Royal Blue, and Charcoal accent colors with smooth 400ms transitions
- **Dark/Light Mode**: Toggle between themes with smooth color transitions and proper contrast
- **Bangla/English Language Toggle**: Complete bilingual interface with smooth text crossfade animations
- **Password Visibility Toggle**: Eye/eye-slash icons on login and register forms
- **Premium Visual Polish**: Glassmorphism effects, hover animations, card lifts, and button glow effects
- **Responsive Design**: Mobile-first approach that works seamlessly across all devices
- **Accessibility**: Respects `prefers-reduced-motion` preferences and includes proper ARIA labels

### Technical Features
- **SVG-based Templates**: Vector-based poster templates for scalable, print-ready output
- **Puppeteer Rendering**: Server-side poster generation with proper font and image loading, including retry logic and timeout handling
- **Production-ready Rendering**: Enhanced font loading with Google Fonts preconnect, image preloading, and stabilization delays for reliable rendering
- **Real-time Validation**: Form validation with error messages using Zod and React Hook Form
- **Skeleton Loaders**: Loading states for better perceived performance
- **State Management**: React Context for themes and language with localStorage persistence
- **Error Handling**: Graceful degradation when services are unavailable (database, Cloudinary, etc.)

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript 5.2
- **Styling**: Tailwind CSS 3.3 with custom animations
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Theming**: next-themes for dark/light mode

### Backend
- **API**: Next.js API Routes
- **Authentication**: Supabase Auth (JWT-based)
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma 5.22

### Services & Integrations
- **Image Storage**: Cloudinary (with base64 fallback)
- **Rendering**: Puppeteer (for server-side poster generation with proper font and image loading)
- **Image Processing**: sharp (for image optimization)
- **Google Generative AI**: @google/generative-ai library (optional integration for future AI features)

### Deployment
- **Platform**: Vercel
- **Environment**: Production-ready with environment variables

---

## 📁 Project Structure

```
AI_Poster_Maker/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── posters/             # CRUD operations for posters
│   │   │   ├── [id]/           # Individual poster operations
│   │   │   │   └── regenerate/  # Regenerate poster
│   │   ├── templates/          # Template library API
│   │   │   └── [id]/           # Individual template operations
│   │   └── uploads/            # Image upload endpoint
│   │       └── images/         # Cloudinary integration
│   ├── create-poster/           # Multi-step poster creation form
│   ├── dashboard/              # User dashboard with poster history
│   ├── login/                  # Authentication page
│   ├── page.tsx                # Landing page
│   ├── posters/                # Poster detail and management
│   ├── register/               # User registration
│   ├── templates/              # Template library browsing
│   ├── globals.css             # Global styles and CSS variables
│   └── layout.tsx              # Root layout with providers
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── footer.tsx              # Footer with language support
│   ├── navbar.tsx              # Navigation with theme/language toggles
│   ├── password-input.tsx      # Password field with visibility toggle
│   ├── skeleton.tsx            # Loading skeleton components
│   └── template-thumbnail.tsx  # Template preview component
├── lib/                         # Utility libraries
│   ├── api.ts                  # API client functions
│   ├── auth.ts                 # Authentication utilities
│   ├── default-templates.ts    # Default template definitions
│   ├── translations.ts         # Bangla/English translations
│   ├── services/               # Business logic services
│   │   ├── cloudinary-service.ts    # Cloudinary upload handling
│   │   ├── gemini-service.ts         # AI layout suggestions
│   │   ├── poster-render-service.ts  # Poster HTML generation
│   │   └── puppeteer-render.ts      # Server-side rendering
│   ├── supabase-client.ts     # Supabase client configuration
│   └── utils.ts                # Utility functions
├── providers/                   # React Context providers
│   ├── auth-provider.tsx       # Authentication state
│   ├── language-provider.tsx   # Language state (Bangla/English)
│   └── theme-color-provider.tsx # Accent color theme state
├── supabase/                    # Supabase configuration
│   └── migrations/             # Database schema migrations
├── public/templates/            # SVG poster templates
│   └── svg/                    # SVG template files
├── hooks/                       # Custom React hooks
│   ├── use-require-auth.tsx    # Authentication guard hook
│   └── use-toast.ts             # Toast notification hook
├── prisma/                      # Prisma ORM
│   ├── schema.prisma            # Database schema
│   └── seed.ts                 # Database seeding
├── package.json                 # Dependencies and scripts
├── tailwind.config.ts           # Tailwind configuration
└── next.config.js               # Next.js configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Supabase Project**: Create a project at [supabase.com](https://supabase.com)
- **Cloudinary Account**: For image storage (optional, falls back to base64)
- **Google Gemini API Key**: For AI layout suggestions (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tamjid97/AI_Poster_Maker.git
   cd AI_Poster_Maker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Supabase Configuration (Required)
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

   # Cloudinary Configuration (Optional - falls back to base64)
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   CLOUDINARY_UPLOAD_PRESET=your-upload-preset

   # Google Gemini API (Optional - for future AI features)
   GEMINI_API_KEY=your-gemini-api-key

   # App Configuration (Required)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run Supabase migrations**
   ```bash
   # Apply the database schema to your Supabase project
   # Copy the SQL from supabase/migrations/20260924073138_create_posterai_schema.sql
   # and run it in your Supabase SQL editor at https://app.supabase.com/project/YOUR_PROJECT_ID/sql
   # This creates the profiles, templates, and posters tables with RLS policies
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📡 API Documentation

### Templates

#### GET /api/templates
**Public endpoint** - Fetch all available poster templates

**Query Parameters:**
- `search` (optional): Filter templates by title or occasion
- `occasion` (optional): Filter by occasion type (e.g., `victory_day`, `eid_greeting`)
- `active` (optional): Filter by active status (default: true)

**Response:**
```json
{
  "success": true,
  "message": "Templates fetched successfully",
  "data": {
    "templates": [
      {
        "id": "tpl-victory-day",
        "title": "মহান বিজয় দিবস — Victory Day Premium Poster (SVG)",
        "occasion_type": "victory_day",
        "thumbnail_url": "/templates/template-1.svg",
        "layout_config": { ... },
        "is_active": true,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### GET /api/templates/[id]
**Public endpoint** - Fetch a specific template by ID

**Response:**
```json
{
  "success": true,
  "message": "Template fetched successfully",
  "data": {
    "template": { ... }
  }
}
```

---

### Posters

#### POST /api/posters
**Authentication required** - Create a new poster

**Request Body:**
```json
{
  "templateId": "tpl-victory-day",
  "name": "John Doe",
  "designation": "Member of Parliament",
  "party": "Awami League",
  "organization": "Dhaka North Constituency",
  "unionOrThana": "Gulshan",
  "district": "Dhaka",
  "occasion": "victory_day",
  "headline": "বিজয় দিবসের শপথ",
  "message": "Vote for development",
  "photoUrls": ["https://res.cloudinary.com/.../photo1.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Poster created successfully",
  "data": {
    "poster": {
      "id": "uuid",
      "user_id": "uuid",
      "template_id": "uuid",
      "name": "John Doe",
      "headline": "বিজয় দিবসের শপথ",
      "status": "COMPLETED",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "html": "<html>...</html>",
    "layout": { ... }
  }
}
```

**Note:** Template selection is required. The API supports anonymous access for testing and returns temporary poster IDs when the database is unavailable.

#### GET /api/posters
**Authentication required** - Fetch user's posters with pagination

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Posters fetched successfully",
  "data": {
    "posters": [...],
    "total": 25,
    "page": 1,
    "totalPages": 3
  }
}
```

**Note:** The API supports anonymous access for testing and returns empty lists when authentication fails.

#### GET /api/posters/[id]
**Authentication required** - Fetch a specific poster by ID with generated HTML

**Response:**
```json
{
  "success": true,
  "message": "Poster fetched successfully",
  "data": {
    "poster": { ... },
    "html": "<html>...</html>"
  }
}
```

**Note:** Returns both the poster data and the generated HTML for preview. Template resolution follows the same priority order as regeneration.

#### DELETE /api/posters/[id]
**Authentication required** - Delete a poster

**Response:**
```json
{
  "success": true,
  "message": "Poster deleted successfully"
}
```

#### POST /api/posters/[id]/regenerate
**Authentication required** - Regenerate a poster (with limits)

**Response:**
```json
{
  "success": true,
  "message": "Poster regenerated successfully",
  "data": {
    "poster": {
      "id": "uuid",
      "status": "COMPLETED",
      "regenerate_count": 1
    },
    "html": "<html>...</html>",
    "layout": { ... }
  }
}
```

**Note:** Maximum 3 regenerates per poster. Supports temporary poster IDs for testing. Template resolution priority: layout_suggestion.templateId → poster.template_id → occasion match → default template.

---

### Uploads

#### POST /api/uploads/images
**Authentication optional** - Upload images to Cloudinary

**Request:** `multipart/form-data`
- `images`: Array of image files (max 4, max 5MB each, JPEG/PNG/WebP)

**Response:**
```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "data": {
    "urls": [
      "https://res.cloudinary.com/.../poster-1234567890-abc123.jpg"
    ]
  }
}
```

**Note:** The API supports anonymous upload for testing. Falls back to base64 data URLs if Cloudinary is not configured.

---

## 🗄 Database Schema

The application uses three main tables managed by Supabase:

### `profiles`
Extends Supabase `auth.users` with user profile information.
- `id` (uuid, PK, references auth.users ON DELETE CASCADE)
- `name` (text, user's full name, default '')
- `role` (text, default 'USER', values: 'USER' or 'ADMIN')
- `created_at` (timestamptz, default now())

**Security:** Users can read/update/insert their own profile. Auto-created via trigger on auth.users signup.

### `templates`
Stores poster template definitions with layout configurations.
- `id` (uuid, PK, default gen_random_uuid())
- `title` (text)
- `occasion_type` (text)
- `thumbnail_url` (text, default '')
- `layout_config` (jsonb, default '{}')
- `is_active` (boolean, default true)
- `created_at` (timestamptz, default now())

**Security:** Public read (anon + authenticated) for browsing. Authenticated users can write (admin in practice).

### `posters`
Stores user-generated posters with owner-scoped access.
- `id` (uuid, PK, default gen_random_uuid())
- `user_id` (uuid, FK to auth.users ON DELETE CASCADE, default auth.uid())
- `template_id` (uuid, FK to templates ON DELETE SET NULL, nullable)
- `name` (text)
- `designation` (text, nullable)
- `party` (text, nullable)
- `organization` (text, nullable)
- `union_or_thana` (text, nullable)
- `district` (text, nullable)
- `occasion` (text)
- `headline` (text)
- `message` (text, nullable)
- `phone` (text, nullable)
- `email` (text, nullable)
- `event_date` (text, nullable)
- `venue` (text, nullable)
- `event_time` (text, nullable)
- `photo_urls` (text[], default empty array)
- `generated_image_url` (text, nullable)
- `layout_suggestion` (jsonb, nullable - stores template-based layout suggestions)
- `status` (text, default 'DRAFT', values: DRAFT, GENERATING, COMPLETED, FAILED)
- `regenerate_count` (int, default 0)
- `created_at` (timestamptz, default now())

**Security:** Full owner-scoped CRUD — users can only access their own posters. user_id defaults to auth.uid() for client-side inserts.

**See full schema:** [`supabase/migrations/20260924073138_create_posterai_schema.sql`](supabase/migrations/20260924073138_create_posterai_schema.sql)

---

## 📸 Screenshots

<!-- Add screenshots here -->
- **Homepage**: Landing page with hero section, features, and categories
- **Template Library**: Browse and filter poster templates by occasion
- **Poster Creation**: Multi-step form with personal details, organization info, and photo upload
- **Dashboard**: View poster history with status tracking
- **Generated Poster**: Example of a final rendered poster

---

## 🗺 Roadmap / Future Improvements

- **Admin Panel**: Admin interface for managing templates and users
- **Bulk Generation**: CSV-based bulk poster generation for campaigns
- **PDF Export**: Direct PDF download option alongside image export
- **Advanced Customization**: More granular control over layout and design elements
- **Video Templates**: Support for video-based poster templates
- **Social Sharing**: Direct sharing to social media platforms
- **Payment Integration**: Premium templates or subscription model
- **Analytics**: Poster usage statistics and engagement tracking
- **Enhanced AI Integration**: Leverage Google Gemini API for more sophisticated layout suggestions
- **Multi-language Support**: Expand beyond Bangla/English to other languages

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

**Note:** A LICENSE file is not currently present in the repository. If you would like to add a specific license, please let me know and I can create one for you.

---

## 👤 Contact

**Author:** [Tamjid](https://github.com/tamjid97)

**Repository:** [https://github.com/tamjid97/AI_Poster_Maker](https://github.com/tamjid97/AI_Poster_Maker)

---

## 🙏 Acknowledgments

- **Supabase** for the excellent database and authentication platform
- **Cloudinary** for reliable image storage
- **shadcn/ui** for the beautiful UI component library
- **Radix UI** for the accessible primitive components
- **Next.js** for the powerful React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Puppeteer** for server-side rendering capabilities
