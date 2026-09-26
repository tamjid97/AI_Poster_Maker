# PosterAI — AI-Powered Bangladeshi Poster Generator

> Create professional, print-ready Bangladeshi political, tribute, and festive posters in minutes. Fill a simple form, pick a design, and let PosterAI handle the layout.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://aipostermaker.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-database%20%26%20auth-3ECF8E?logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

**PosterAI** is a web platform built for local political workers, committee members, and publicity agents in Bangladesh to generate ready-to-print posters — victory day tributes, condolence/memorial posters, election campaign posters, and Eid greetings — without needing a graphic designer.

Users fill out a short form (name, designation, party/organization, occasion, and up to 3 photos), pick from a library of professionally designed SVG templates, and the platform composes a high-resolution, print-ready poster automatically — complete with proper Bangla typography, national flag motifs, and occasion-appropriate decorative styling.

The interface is **Bangla-first** with a full English toggle, and supports light/dark mode plus multiple accent color themes.

## Live Demo

🔗 **[aipostermaker.vercel.app](https://aipostermaker.vercel.app)**

## Features

- 🎨 **Template Library** — Curated, professionally designed poster templates by occasion: Victory Day, Condolence/Tribute, Election Campaign, and Eid Greeting
- 📝 **Multi-step Creation Form** — Guided flow for personal details, organization details, poster copy, and photo upload
- 📷 **Photo Upload** — Up to 3 photos per poster, stored via Cloudinary with automatic cropping into template photo slots
- 🤖 **AI-Assisted Layout** — Google Gemini API assists with layout/composition suggestions
- 🖼️ **High-Resolution SVG Rendering** — Print-ready output (1200×1600px) with crisp, correctly-rendered Bangla text (Hind Siliguri / Noto Sans Bengali)
- 🔁 **Regenerate** — Re-generate a poster with the same data (limited retries per poster)
- 📚 **Poster History / Dashboard** — Every generated poster is saved and re-downloadable
- 🔐 **Authentication** — Email/password auth via Supabase, with row-level security scoping each user to their own posters
- 🎨 **5-Color Theme Switcher** — Deep Green, Maroon, Gold, Royal Blue, and Charcoal accent themes
- 🌗 **Dark / Light Mode**
- 🌐 **Bangla / English Language Toggle** — Full site-wide translation
- 📱 **Fully Responsive** — Works on desktop and mobile

## Tech Stack

| Layer              | Technology                                   |
|---------------------|-----------------------------------------------|
| Frontend            | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend             | Next.js API Routes                            |
| Database & Auth     | Supabase (PostgreSQL, Row-Level Security, Auth) |
| Image Storage       | Cloudinary                                    |
| AI Layout Assist    | Google Gemini API                             |
| Poster Rendering    | SVG templates → high-res PNG                  |
| Deployment          | Vercel                                        |

## Project Structure

```
├── app/                     # Next.js App Router pages & API routes
│   ├── api/
│   │   ├── auth/            # Register / login
│   │   ├── templates/       # Template listing & detail
│   │   ├── posters/         # Poster CRUD, create, regenerate
│   │   └── uploads/         # Photo upload (Cloudinary)
│   ├── create-poster/       # Multi-step poster creation flow
│   ├── posters/[id]/        # Poster preview / detail page
│   ├── templates/           # Template library / browse page
│   └── dashboard/           # User poster history
├── components/              # Shared React components
├── lib/
│   ├── supabase-client.ts   # Supabase client setup
│   ├── default-templates.ts # Template definitions & metadata
│   └── services/            # Poster rendering, Cloudinary, Gemini helpers
├── templates/svg/           # SVG poster template source files
├── supabase/
│   └── migrations/          # SQL schema migrations
└── types/                   # Shared TypeScript types
```

> **Note:** Exact folder names may differ slightly from the current codebase — see the repository itself for the authoritative structure.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- A free [Supabase](https://supabase.com/) project
- A free [Cloudinary](https://cloudinary.com/) account
- A [Google AI Studio](https://aistudio.google.com/apikey) Gemini API key

### Installation

```bash
git clone https://github.com/tamjid97/AI_Poster_Maker.git
cd AI_Poster_Maker
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```dotenv
# Supabase
NEXT_PUBLIC_SUPABASE_URL=            # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=       # Your Supabase anon/public API key

# Cloudinary
CLOUDINARY_CLOUD_NAME=               # Your Cloudinary cloud name
CLOUDINARY_API_KEY=                  # Your Cloudinary API key
CLOUDINARY_API_SECRET=               # Your Cloudinary API secret

# Google Gemini
GEMINI_API_KEY=                      # Your Gemini API key from Google AI Studio
```

> ⚠️ Never commit `.env` to version control. It is already covered by `.gitignore`.

### Database Setup

1. Open your Supabase project's **SQL Editor**.
2. Run the migration found in `supabase/migrations/` to create the `profiles`, `templates`, and `posters` tables along with their Row-Level Security policies and the auto-profile-creation trigger.
3. (Optional) Seed the `templates` table with the built-in poster templates.

### Running Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## API Documentation

All routes are served from `/api`. Unless noted, request/response bodies are JSON.

### Auth — `/api/auth`

| Method | Path                | Auth | Description                  |
|--------|----------------------|------|-------------------------------|
| POST   | `/api/auth/register`| No   | Create a new user account     |
| POST   | `/api/auth/login`   | No   | Authenticate and receive a session |

### Templates — `/api/templates`

| Method | Path                    | Auth | Description                        |
|--------|--------------------------|------|-------------------------------------|
| GET    | `/api/templates`        | No   | List all active poster templates    |
| GET    | `/api/templates/:id`    | No   | Get a single template's details     |

### Posters — `/api/posters`

| Method | Path                              | Auth        | Description                                      |
|--------|-------------------------------------|-------------|---------------------------------------------------|
| POST   | `/api/posters`                    | Bearer      | Create a poster (form data + up to 5 photo URLs)  |
| GET    | `/api/posters/:id`                | No          | Get a single poster's status/result               |
| GET    | `/api/posters/user/:userId`       | No          | List a user's poster history                       |
| POST   | `/api/posters/:id/regenerate`     | Bearer      | Re-generate an existing poster (limited retries)   |
| DELETE | `/api/posters/:id`                | Bearer      | Delete a poster                                     |

**Example — Create Poster**

```http
POST /api/posters
Authorization: Bearer <token>
Content-Type: application/json

{
  "templateId": "tpl-victory-day",
  "name": "মোঃ করিম উদ্দিন",
  "designation": "সভাপতি, স্থানীয় শাখা",
  "party": "উদাহরণ সংগঠন",
  "district": "ঢাকা",
  "headline": "মহান বিজয় দিবস",
  "photoUrls": ["https://res.cloudinary.com/.../photo1.jpg"]
}
```

```json
{
  "success": true,
  "data": {
    "poster": {
      "id": "temp-1234567890-001",
      "status": "COMPLETED",
      "generatedImageUrl": "https://res.cloudinary.com/.../poster.png"
    }
  }
}
```

### Uploads — `/api/uploads`

| Method | Path                    | Auth | Description                                  |
|--------|--------------------------|------|------------------------------------------------|
| POST   | `/api/uploads/images`   | No   | Upload a photo (multipart `file` field), returns a Cloudinary URL |

### Users — `/api/users`

| Method | Path              | Auth | Description            |
|--------|--------------------|------|--------------------------|
| GET    | `/api/users/:id`  | No   | Get a user's public profile info |

## Database Schema

The Supabase database has three core tables (see `supabase/migrations/` for the full SQL):

- **`profiles`** — extends Supabase Auth's `auth.users` with `name` and `role` (`USER` / `ADMIN`). Auto-created via a trigger on signup.
- **`templates`** — poster template metadata: `title`, `occasion_type`, `thumbnail_url`, `layout_config` (JSONB), `is_active`. Publicly readable.
- **`posters`** — user-generated posters: form data (`name`, `designation`, `party`, `district`, `occasion`, `headline`), `photo_urls`, `generated_image_url`, `status` (`DRAFT` / `GENERATING` / `COMPLETED` / `FAILED`), `regenerate_count`. Owner-scoped via Row-Level Security.

## Screenshots

<!-- Add screenshots here -->
<!-- ![Homepage](./docs/screenshots/home.png) -->
<!-- ![Template Library](./docs/screenshots/templates.png) -->
<!-- ![Poster Creation](./docs/screenshots/create-poster.png) -->
<!-- ![Generated Poster Example](./docs/screenshots/poster-example.png) -->

## Roadmap

- [ ] Admin panel for template management and content moderation
- [ ] Bulk/CSV poster generation for local committees
- [ ] PDF export alongside PNG
- [ ] Payment integration (bKash/Nagad) for premium templates
- [ ] Watermark removal for a paid tier
- [ ] Additional poster layout options (2-up / 3-up photo grids)

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to your branch and open a Pull Request

## License

Distributed under the [MIT License](LICENSE).

## Contact

**S M Tamjid Hossain**
GitHub: [@tamjid97](https://github.com/tamjid97)
