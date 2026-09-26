# Spec: Full End-to-End Audit & Bug Fix for PosterAI Web App

## Problem

The PosterAI web application (Next.js frontend + Supabase-backed Next.js API routes) has 5 confirmed user-facing bugs on the poster detail/preview page and in the poster creation flow. These bugs prevent users from correctly seeing poster metadata (status, date, regeneration count, occasion, name) and cause poster generation to ignore the user's explicitly selected template choice and fall back to a default design, defeating the purpose of the template library.

## Users

- **End users** (authenticated poster creators): register, login, browse templates, create posters from selected templates, view preview pages, regenerate, download.
- **Operators / maintainers**: inspect browser console, network tab, and API logs to confirm fixes.

## Goals

1. Every poster created from the template library uses the **specific template the user selected** (Election Campaign, Condolence, Eid Greeting, Victory Day, Greeting, Eid Mubarak with leader photos, Leadership, etc.) and renders with that template's own SVG/design — not all collapsing into a single generic/fallback design.
2. Poster detail/preview page shows **all metadata correctly**: status (COMPLETED/GENERATING/FAILED/DRAFT), created date (real localized date, not "Invalid Date"), regeneration remaining count (real integer like "Regenerate (2 left)", not NaN), and Poster Information section (Occasion, Name, Designation, Party, Organization, Location, Photos) populated with the values the user entered.
3. The entire end-to-end user flow from home → register/login → browse templates → select → create → preview → regenerate → download runs without uncaught console errors, failed network requests, or silent auth state corruption.
4. Each fix addresses the **root cause** (field-name mismatch, missing fallback path, wrong resolution order, missing value propagation) rather than adding cosmetic patches or defensive undefined-checks that mask the underlying defect.

## Non-Goals

- No schema redesign or migration of the PostgreSQL/Supabase `posters` table.
- No replacement of the Supabase auth layer with a different auth provider.
- No migration from Next.js App Router API routes to the legacy `server/src/` Express/Prisma backend (that server is preserved but not the primary transport; fixes apply to the actively used Next.js `app/api/*` routes that the frontend calls in `lib/api.ts`).
- No UI/UX redesign or new features; only bug fixes and correctness.
- No optimization pass (performance, bundle size, caching) outside of what is required for correctness.

## Functional Requirements

### FR-1: Template selection propagates end-to-end
- `GET /api/templates` returns the 8 built-in templates with their `id` (e.g. `tpl-election-campaign`), `occasion_type`, and `thumbnail_url`.
- When a user navigates from `/templates?template=tpl-*` to `/create-poster?template=tpl-*`, the form step 4 pre-selects that template card (visual highlight).
- When the user manually clicks a different template on step 4, that click updates the React state and the final submit sends that `templateId` in the `POST /api/posters` JSON body; network tab shows the exact `templateId` field equal to the chosen template's id.
- `POST /api/posters` resolves the template **without falling back to a default** when an explicit `templateId` is provided and valid; if invalid it returns 404.
- The generated HTML returned by `POST /api/posters` and the regenerated HTML returned by `GET /api/posters/:id` both use the **resolved specific template**'s layout config and SVG path (color scheme, photo slot positions, text slot positions, decorations, name plate style, footer).
- `GET /api/posters/:id` resolves template using this priority order, stopping at the first hit:
  1. `poster.layout_suggestion.templateId` (JSONB, stores both UUID and built-in `tpl-*` ids)
  2. `poster.template_id` (UUID FK column)
  3. Match by `poster.occasion` against templates' `occasion_type`
  4. If all else fails, use the first template — AND log a structured warning to the server terminal so operators can detect fallback usage.
- The poster preview page's `[CRITICAL DEBUG]` console output shows the `RESOLVED template id` and `RESOLVED template title` that actually match what the user selected.

### FR-2: Status field displays correctly
- `GET /api/posters/:id` response includes `poster.status` with a value from `{DRAFT, GENERATING, COMPLETED, FAILED}` exactly matching the TypeScript `PosterStatus` union.
- The frontend `StatusBadge` component never receives `undefined`/`null` as `status`; if an unknown value arrives it renders a fallback "Unknown" badge rather than rendering blank.
- Frontend poster preview page sidebar row labeled **"Current Status"** displays a colored badge with one of: Draft / Generating / Completed / Failed — matching `STATUS_LABELS`.
- `POST /api/posters` creates with `status=GENERATING` and updates to `status=COMPLETED` after successful HTML generation. If generation throws, status is set to `FAILED` and persisted.
- `POST /api/posters/:id/regenerate` sets `status=GENERATING` at onset, then `status=COMPLETED` on success or `status=FAILED` on catch, and increments `regenerate_count` by 1.

### FR-3: Created date displays a real formatted date
- `GET /api/posters/:id` response includes `poster.created_at` as a valid ISO 8601 string (the Supabase `timestamptz` default of `now()` produces this).
- Frontend formats `poster.created_at` with `Intl`/`toLocaleDateString`. If the value is missing, null, or unparseable:
  - Backend ensures that temp-poster records always include `created_at: new Date().toISOString()`.
  - Frontend shows `"—"` or `"N/A"` instead of `"Invalid Date"`.
- Sidebar row labeled **"Created"** on poster detail page displays e.g. `Sep 26, 2026` for a real poster created today.

### FR-4: Regenerate count displays real integer
- `POST /api/posters` initializes `regenerate_count = 0` on insert (DB default and application payload both enforce this).
- `GET /api/posters/:id` includes `poster.regenerate_count` as a finite integer (`0..MAX_REGENERATE_COUNT`).
- Frontend computes `remainingRegens = MAX_REGENERATE_COUNT - (poster.regenerate_count ?? 0)` with a non-nullish fallback of `0`.
- Button label always shows a real integer: `Regenerate (N left)` where N ∈ [0, MAX_REGENERATE_COUNT].
- Sidebar **"Regenerations"** row displays fraction `X/3` (or whatever `MAX_REGENERATE_COUNT` is set to).
- `MAX_REGENERATE_COUNT` is defined in exactly one place (`types/index.ts`) and both sides import it; no hardcoded `3` elsewhere.

### FR-5: Poster Information section shows Occasion and Name
- `POST /api/posters` stores the user's form values in the top-level `posters` columns: `name`, `occasion`, `headline`, `designation`, `party`, `organization`, `union_or_thana`, `district`, `photo_urls`. None of these are stripped or silently dropped.
- `GET /api/posters/:id` returns all those fields in the `data.poster` object unchanged.
- For both DB-backed posters AND temp localStorage posters, the frontend `PosterPreviewContent` reads them from the top-level `poster` object (not from a nested `formData` that doesn't exist).
- Poster Information sidebar:
  - **Occasion** → `OCCASION_LABELS[poster.occasion] || poster.occasion` (never empty for valid posters).
  - **Name** → `poster.name` (non-empty per form validation).
  - **Designation / Party / Organization / Location / Photos** → shown only when non-empty and their values render truthily.

### FR-6: Auth flow works end-to-end
- Register page (`/register`) creates a Supabase user with email + password + name, inserts a matching `profiles` row (via the `handle_new_user` trigger), and redirects cleanly to `/dashboard` or the page the user came from.
- Login page (`/login`) exchanges credentials for a session, stores the JWT in Supabase client storage, and the `AuthProvider` context immediately reflects `user` with `{ id, email, name, role }`.
- Navbar shows the user's full name (e.g. "S M TAMJID HOSSAIN") in the avatar dropdown when logged in, and hides Dashboard / Create Poster links when logged out.
- `AuthGuard` on `/create-poster`, `/posters/*`, `/dashboard` redirects unauthenticated users to `/login` with a `next` query param so they come back after login.
- Every `apiCall` in `lib/api.ts` attaches `Authorization: Bearer <access_token>` from the session before fetching. Server-side `getAuthenticatedClient` validates this token and returns a concrete user id.

## Non-Functional Requirements

### NFR-1: No silent data corruption
- Every mismatch between expected and received field names on either side of the API must be resolved explicitly (either normalize to snake_case on response, or fix the frontend accessor). No "it works if the stars align" dependence on happy-path ordering.

### NFR-2: Observability
- Server terminal logs on template resolution include: poster id, `layout_suggestion.templateId`, `poster.template_id`, and final resolved template id. This lets operators reproduce Issue #1.
- Browser console logs on preview page load include the same resolution info plus `typeof` checks for `status`, `created_at`, `regenerate_count`, `occasion`, `name` so any regression can be diagnosed from a screenshot.

### NFR-3: Type safety
- The `Poster` TypeScript interface in `types/index.ts` must be an accurate description of what `data.poster` contains after JSON-deserialization from each API. Either the code that produces `data.poster` conforms to the interface, or the interface is updated in the same commit.

### NFR-4: Regression prevention
- After each fix the flow (login → select template → create → preview → check metadata → regenerate) is re-run and a passing screenshot/evidence is captured before moving on to the next bug.

## Constraints & Dependencies

- The project uses `next@^14.2.18` with App Router (`app/`) as the active frontend. The Express/Prisma backend at `server/src/` exists but the frontend `lib/api.ts` points at `/api/*` routes (Next.js), not the Express server; fixes target the Next.js routes.
- Database: Supabase Postgres using the SQL migration in `supabase/migrations/20260924073138_create_posterai_schema.sql`. Columns are snake_case; Prisma schema is for a MongoDB backend and is not the source of truth for the active API routes.
- Authentication: Supabase Auth (email + password). The `AuthProvider` wraps `@/providers/auth-provider.tsx`; `createServerSupabaseClient` in `@/lib/supabase-client.ts` validates tokens server-side.
- Templates are served in two ways: 8 built-in hardcoded templates with ids like `tpl-election-campaign` used in practice, plus a UUID-backed `templates` table in Postgres. The built-in templates cannot be stored in the `template_id` UUID FK column due to type constraints; the recoverable id is embedded in JSONB `layout_suggestion.templateId`.
- `MAX_REGENERATE_COUNT = 3` per `types/index.ts`; the regenerate endpoint guards against exceeding it.
- Images are uploaded via `/api/uploads/images` and photo URLs are passed as `photoUrls[]` during poster creation.

## Assumptions

- The existing `supabase/.env.local` / project config is already correctly provisioned for the Supabase project (anon key, service role key, URL, JWT secret). The audit uses these as-is; if configuration is missing, that is noted as a blocker rather than being in scope.
- User "S M TAMJID HOSSAIN" from the screenshots already has an account, or a new test account can be registered during audit.
- The 8 SVGs under `public/templates/` referenced by template thumbnails exist and render correctly in `<img>` tags. Broken SVG rendering (as opposed to wrong template choice) is only fixed if directly caused by one of the 5 confirmed issues.

## Open Questions (resolved during Implement via runtime evidence)

- **OQ-1**: At runtime, does the Supabase `from('posters').insert(...).select().single()` call succeed, or does it consistently throw due to RLS/missing FK/connection issues and the code falls back to `temp-*` posters? Evidence from both the server terminal AND a `console.log` of the insert payload vs DB row.
- **OQ-2**: Does the raw Supabase select result object have exactly the same field names as the migration (snake_case), or does any PostgREST/Supabase alias layer rename them? Evidence from network tab for a real `GET /api/posters/:id`.
- **OQ-3**: On the template browse page `/templates`, does clicking "Use Template" actually navigate to `/create-poster?template=<id>`? Or is there a missing event handler? Evidence from click trace during audit.
- **OQ-4**: Do `login` / `register` pages actually call Supabase auth correctly, or is `lib/auth.ts` unused in favor of `AuthProvider`? Evidence from network tab and localStorage inspection.
- **OQ-5**: Is `MAX_REGENERATE_COUNT` respected correctly by the regenerate API when regenerations hit 3? Evidence from submitting 4 regenerate requests.

---

## Acceptance Criteria

Every AC below is typed **rule** or **rubric**.

### AC-1 — rule: Template selection honors user's explicit choice.
**Pass condition:** Create posters for at least 3 distinct template ids (e.g. `tpl-condolence`, `tpl-eid-mubarak`, `tpl-victory-day`) using the Create Poster form with explicit selection. In the preview page console, the `[CRITICAL DEBUG] RESOLVED template id` log must equal the selected template id for each one, AND the visual rendering must visibly match that template's SVG thumbnail (background gradient, photo slot positions, decorative elements) rather than all looking like the election campaign default.
**Evidence source:** 3 annotated screenshots of preview pages plus the browser console showing the resolved template id for each; plus a single network screenshot of the `POST /api/posters` request payload showing `templateId`.

### AC-2 — rule: Current Status shows a non-empty valid label.
**Pass condition:** On every poster preview page sidebar, the "Current Status" row shows a badge containing one of Draft / Generating / Completed / Failed (matched case-insensitively). There is no blank/empty badge and no console error reading "Cannot read properties of undefined (reading 'xxx')".
**Evidence source:** Screenshot of the poster preview sidebar Status card; copy of server-side `GET /api/posters/:id` response JSON showing `poster.status`.

### AC-3 — rule: Created shows a localized date (never "Invalid Date").
**Pass condition:** On the poster preview sidebar "Created" row, the rendered text is either `N/A`/`—` OR a valid human-readable date matching `en-US` format (Month Short DD, YYYY). The exact string `Invalid Date` is never present in the DOM.
**Evidence source:** Screenshot of the Status card date row; browser console `typeof poster.created_at` + raw value log.

### AC-4 — rule: Regenerate button displays a real integer.
**Pass condition:** The Regenerate button label contains the literal substring `"left)"` preceded by a digit and `(`; e.g. `"Regenerate (3 left)"`, `"Regenerate (2 left)"`, `"Regenerate (1 left)"`, `"Regenerate (0 left)"`. The string `NaN` is never present in any button label on the page.
**Evidence source:** Screenshot of Actions card showing the button; browser console `remainingRegens` value log plus raw `poster.regenerate_count` value log.

### AC-5 — rule: Poster Information shows Occasion + Name non-empty.
**Pass condition:** On the poster preview sidebar Poster Information card:
- "Occasion" row value length ≥ 1 character.
- "Name" row value length ≥ 2 characters.
Both match the values submitted in the `POST /api/posters` request (case- and whitespace-sensitive after trim).
**Evidence source:** Side-by-side screenshot of the form submit values and the rendered Poster Information card; network payload JSON.

### AC-6 — rule: Full E2E flow from login through regenerate completes.
**Pass condition:** Starting from a logged-out state: (1) login succeeds, (2) `/templates` page loads with 8 thumbnails, (3) clicking one template navigates correctly, (4) form step 4 visually preselects that template, (5) submit succeeds and navigates to `/posters/:id`, (6) preview HTML renders the chosen template, (7) all 5 metadata rows pass AC-2 through AC-5, (8) clicking regenerate succeeds, regenerate count decrements by one, and status returns to COMPLETED. At no step does the browser console show uncaught red errors.
**Evidence source:** Continuous screenshot sequence or a single composite annotated screenshot capturing each step's confirmation plus network panel showing 0 failed requests.

### AC-7 — rubric: Root-cause correctness of fixes (scale 0-2, threshold 2).
**Anchors:**
- `2`: Every one of the 5 issues is traced to a specific code path whose defect explains the symptom (e.g. `GET /api/posters/:id` template lookup never consulting `layout_suggestion.templateId`, or `status === undefined` due to a field being omitted from the response) and the fix modifies that path rather than introducing downstream defensive guards. Evidence for each bug includes a "Before" code snippet plus "After" code snippet in the task completion evidence.
- `1`: Most fixes hit the root cause but one fix is a defensive palliative (e.g. adding `|| 0` to regenerate count without ensuring the backend ever emits it, or adding `|| 'DRAFT'` without ensuring the backend sets status).
- `0`: Fixes are purely cosmetic band-aids (e.g. hardcoding "Completed" text, showing a static date, displaying "Name: User") and the underlying API/flow bugs remain.
**Evidence source:** The diff for each bug fix, plus the rationale written under each task's Completion Evidence.

### AC-8 — rubric: Diagnostic output quality and testability (scale 0-2, threshold 1).
**Anchors:**
- `2`: Both server terminal and browser console contain structured, filterable logs for template resolution and the 5 metadata fields. A maintainer can screenshot these console logs and immediately verify every AC without opening the source.
- `1`: Console logs exist, but are noisy (duplicate prints) or missing one critical piece (e.g. no `typeof` for created_at).
- `0`: No structured diagnostic logging added; the only way to confirm a fix is visual DOM inspection without evidence.
**Evidence source:** Trimmed server terminal output and browser console log for a single poster load, annotated with arrows pointing to the new log lines.
