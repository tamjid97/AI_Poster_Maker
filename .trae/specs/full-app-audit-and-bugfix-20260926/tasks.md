# Tasks: Full End-to-End Audit & Bug Fix

Each task maps to one or more Acceptance Criteria from `spec.md`. Every task carries its own **Test Requirements (TRs)** typed as `rule` or `rubric`.

---

## Task 1: Bootstrap runtime environment & perform baseline audit

**Status: pending**
**Priority: high**

### Objective
Start the Next.js dev server, launch the integrated browser, and walk through the entire user flow once *before applying any fix*. Capture hard evidence of the 5 reported bugs plus any additional issues: browser console logs, network request/response bodies, and Next.js dev terminal output. This evidence validates our root-cause hypotheses (outlined in `spec.md` OQ-1..OQ-5) before we change code.

### Scope
- `package.json` scripts — ensure `npm run dev` works.
- Install dependencies if `node_modules` missing.
- Integrated browser: load home, `/templates`, `/register`, `/login`, `/create-poster`, `/posters/:id`.
- Console, Network, and server terminal captured at each step.
- Register a disposable test account (e.g. `audit+<date>@example.com`) to exercise auth RLS.

### Read-first paths
- [package.json](file:///c:/Users/ASUS/AI_Poster_Maker/package.json) — scripts, node engine.
- [app/layout.tsx](file:///c:/Users/ASUS/AI_Poster_Maker/app/layout.tsx) — global providers.
- [providers/auth-provider.tsx](file:///c:/Users/ASUS/AI_Poster_Maker/providers/auth-provider.tsx) — auth state.
- [lib/supabase-client.ts](file:///c:/Users/ASUS/AI_Poster_Maker/lib/supabase-client.ts) — server + client Supabase construction.

### TR-1.1 — rule: Dev server boots without fatal errors
Pass condition: `npm run dev` stays running, server logs show `ready started server on ...`, no `Error: Cannot find module` or `PrismaClientInitializationError`-level exceptions in the first 30 seconds.
Evidence source: Trimmed tail of the server terminal.

### TR-1.2 — rule: Baseline evidence captured of all 5 reported bugs
Pass condition: A single poster is created via the form using a non-default template. The resulting `/posters/:id` preview page clearly shows, in one screenshot or a composite:
  (a) Current Status = blank / empty badge OR undefined rendering,
  (b) Created = "Invalid Date",
  (c) Regenerate label = "Regenerate (NaN left)",
  (d) Occasion / Name in Poster Information = blank / whitespace only,
  (e) Visual rendering of the poster DOES NOT match the chosen template thumbnail (or matches the fallback election template regardless of choice).
Evidence source: Annotated screenshot plus the network tab JSON for `POST /api/posters` request body & response, and the preview page's `[CRITICAL DEBUG]` console output.

### TR-1.3 — rule: Open questions OQ-1..OQ-5 resolved
Pass condition: A short bulleted list written under Completion Evidence answering each OQ from spec.md with concrete runtime evidence (screenshot / payload / log line reference).
Evidence source: Text note inside Completion Evidence for this task.

---

## Task 2: Fix template resolution in GET /api/posters/:id (Issue #1 root cause)

**Status: pending**
**Priority: high**

### Objective
The current `GET /api/posters/:id` in `app/api/posters/[id]/route.ts` line 376 only checks `poster.template_id` and falls back to the first hardcoded template. Because built-in `tpl-*` template ids are stored in `poster.layout_suggestion.templateId` (JSONB), `poster.template_id` is NULL for all of them, so 100% of real posters render with the election-campaign default.

Fix: Reorder the template resolution in `GET /api/posters/:id` to the same precedence used in `POST /api/posters/:id/regenerate`: check `layout_suggestion.templateId` first, then `template_id`, then occasion-based match, then warn-and-fallback.

### Scope
- Edit single file: [app/api/posters/[id]/route.ts](file:///c:/Users/ASUS/AI_Poster_Maker/app/api/posters/[id]/route.ts) lines 373-382.
- Align with the regenerate route's precedence pattern already proven in [app/api/posters/[id]/regenerate/route.ts](file:///c:/Users/ASUS/AI_Poster_Maker/app/api/posters/[id]/regenerate/route.ts) lines 109-148.
- Import `DEFAULT_TEMPLATES` from `@/lib/default-templates` OR reuse the local `HARDCODED_TEMPLATES` already in the file (stay consistent within the file).

### TR-2.1 — rule: Preview uses `layout_suggestion.templateId` when present
Pass condition: With a built-in `tpl-*` poster, the server log `[CRITICAL DEBUG] RESOLVED template id` during preview load equals the stored `layout_suggestion.templateId` and does NOT equal the fallback `HARDCODED_TEMPLATES[0].id`.
Evidence source: Server terminal excerpt + browser console excerpt for one poster preview.

### TR-2.2 — rule: Fallback logs a structured warning
Pass condition: When ALL resolution paths fail (impossible in practice but covered for safety), the server writes a distinct `console.warn` line containing poster id, `layout_suggestion.templateId`, `template_id`, and `occasion` before returning the first template.
Evidence source: Artificially trigger the fallback (e.g. temporarily set all three fields to invalid values in a local test or unit-in-log) and capture the warning line.

---

## Task 3: Fix status, created_at, regenerate_count, occasion, name — field plumbing in API + frontend (Issues #2–#5)

**Status: pending**
**Priority: high**

### Objective
Resolve each of the 4 display bugs by tracing the data flow from DB → API response → frontend state → JSX. For each issue, the fix may reside in either the backend response or the frontend accessor; choose whichever side is "lying" relative to the shared `Poster` TypeScript interface.

### Sub-task 3a: Status (Issue #2)
- Inspect actual `poster.status` in network response from baseline audit (TR-1.2).
- If status is undefined/missing in response → fix `GET /api/posters/[id]/route.ts` to ensure Supabase selects it (it already uses `select('*')` so more likely the temp/localStorage path is stale or the StatusBadge needs a guard).
- Add defensive rendering in `StatusBadge`: if `status` is not a key of `STATUS_LABELS`, render a fallback badge with `Unknown` instead of blank.
- In `app/api/posters/route.ts` POST: ensure the creation response's poster always includes `status: 'COMPLETED'` (after update payload), never a stale GENERATING from the initial insert.

### Sub-task 3b: Created date (Issue #3)
- Inspect whether temp posters in `app/api/posters/route.ts` fallback path set `created_at: new Date().toISOString()` (currently do at line 537) AND whether the DB-backed path returns a parseable ISO string.
- Frontend: replace the ternary that only checks truthiness with a parseable check: call `isNaN(new Date(poster.created_at).getTime())` → show `"—"` instead of letting DOM render "Invalid Date".

### Sub-task 3c: Regenerate count (Issue #4)
- Ensure both:
  1. Backend temp poster + DB poster responses include `regenerate_count` (DB default is 0; temp poster already sets to 0).
  2. Frontend `remainingRegens` uses `MAX_REGENERATE_COUNT - (poster.regenerate_count ?? 0)` and the button label falls back safely if regenerate_count is not a finite number.
- If after checking, the bug is still reproducible with `NaN`, determine whether `poster.regenerate_count` was serialized as a string ("0") and coerce it with `Number(...)` on the frontend.

### Sub-task 3d: Occasion + Name (Issue #5)
- Inspect network response: if `poster.occasion` / `poster.name` are present but the sidebar shows blank, the bug is purely a frontend render bug (e.g. a typo accessing `poster.Occasion` / `poster.Name` or reading from a non-existent `formData` nested object).
- If fields are missing from response, fix the response builder (`POST /api/posters` → data.poster, and `GET /api/posters/:id` → data.poster).
- Confirm with static analysis that `PosterPreviewContent` JSX lines 487-500 actually reference `poster.occasion` and `poster.name` at the correct nesting level.

### Scope (files touched by any sub-task)
- [app/api/posters/route.ts](file:///c:/Users/ASUS/AI_Poster_Maker/app/api/posters/route.ts) — create poster payload integrity.
- [app/api/posters/[id]/route.ts](file:///c:/Users/ASUS/AI_Poster_Maker/app/api/posters/[id]/route.ts) — GET single poster payload integrity.
- [app/posters/[id]/page.tsx](file:///c:/Users/ASUS/AI_Poster_Maker/app/posters/[id]/page.tsx) — StatusBadge, Created, Regenerate label, Poster Information rendering.

### TR-3.1 — rule: StatusBadge never renders blank
Pass condition: In a browser DevTools console manually run: `document.querySelector('[data-testid=status-badge]')` (or closest Badge in the Status card) and the rendered text is non-empty after trimming. Also perform an explicit test: set poster.status to undefined via a local `setPoster({...poster, status: undefined})` in console (or temporarily via code injection for test) and verify Badge text is "Unknown" rather than empty.
Evidence source: Screenshot of StatusBadge for a valid poster + screenshot of the defensive Unknown render.

### TR-3.2 — rule: "Invalid Date" string absent from DOM
Pass condition: Search the rendered page HTML with browser DevTools `Ctrl+F` for literal text `Invalid Date` → 0 matches. Also, `new Date(poster.created_at).toString()` from console does NOT equal `"Invalid Date"` for any poster state.
Evidence source: Screenshot of the date row + browser console `poster.created_at` + `new Date(...)` check.

### TR-3.3 — rule: Regenerate button label is always a finite integer expression
Pass condition: Button label regex `/Regenerate \((\d) left\)/` matches for a freshly created poster (value = 3). After one regenerate (value = 2), after 3 regenerates (value = 0). `NaN` string has 0 occurrences anywhere in the DOM.
Evidence source: 3 screenshots (0 regenerations, 1, 3) OR a composite showing the count change via regenerate requests.

### TR-3.4 — rule: Poster Information Occasion and Name non-empty
Pass condition: For a poster created with occasion = "political_campaign", name = "Audit User Test", the rendered sidebar rows show exactly `OCCASION_LABELS['political_campaign']` = "Political Worker / Campaign" and name = "Audit User Test".
Evidence source: Side-by-side of creation form values + rendered Poster Information card.

---

## Task 4: Fix template selection flow from `/templates` browse → `/create-poster`

**Status: pending**
**Priority: medium**

### Objective
Ensure that when a user selects a template on the `/templates` page, the system correctly:
1. Navigates to `/create-poster?template=<id>`.
2. Step 4 of the form visually highlights the matching template card.
3. The correct `occasion_type` of the template auto-fills the Occasion Select dropdown on step 3.
4. The `selectedTemplate` React state actually equals the URL param on page load (confirm no stale closure bug).

Also check that form step 4 manual click (not from browse page) correctly sets `selectedTemplate` — currently code `setSelectedTemplate(selectedTemplate === template.id ? '' : template.id)` toggles correctly; verify it stays that way.

### Scope
- [app/templates/page.tsx](file:///c:/Users/ASUS/AI_Poster_Maker/app/templates/page.tsx) — "Use Template" click handler.
- [app/create-poster/page.tsx](file:///c:/Users/ASUS/AI_Poster_Maker/app/create-poster/page.tsx) lines 81-97 — template id + occasion_type seeding from URL param, and lines 437-466 — template card selection.

### TR-4.1 — rule: Browse → pre-seed works for each template id
Pass condition: Navigate to `/create-poster?template=tpl-condolence`, page loads, and on step 4 the condolence card has the primary ring/border class applied (visual highlight). Also the Occasion field on step 3 shows "Condolence / Mourning" before user edits anything.
Evidence source: Screenshot of `/create-poster` step 4 with condolence highlighted + network/console log showing `searchParams.get('template')` resolved correctly.

### TR-4.2 — rule: Manual click on step 4 toggles selection cleanly
Pass condition: On step 4, click template A → template A highlights and `selectedTemplate` logged to console = A. Click template B → template B highlights and A de-highlights, state = B. Click template B again → state = empty string, no card highlighted.
Evidence source: Console log sequence `[FORM] selectedTemplate:` for each click.

---

## Task 5: Add diagnostic observability logs (NFR-2, AC-8)

**Status: pending**
**Priority: medium**

### Objective
Add a small, focused set of structured `console.log` / `console.warn` lines so that operators can reproduce every bug/fix from logs alone, without reopening source files.

Do NOT add generic debug spray; restrict to:
- Server-side in `GET /api/posters/:id`: log the poster id, the three template resolution inputs (`layoutTemplateId`, `storedTemplateId`, `occasion`), the resolved template id and title, and which path won (e.g. `via layout_suggestion.templateId`).
- Frontend in `PosterPreviewContent.loadPoster`: immediately after `setPoster(p)`, log:
  - `typeof poster.status`, `poster.status`
  - `typeof poster.created_at`, `poster.created_at`
  - `typeof poster.regenerate_count`, `poster.regenerate_count`, `Number.isFinite(poster.regenerate_count)`
  - `typeof poster.occasion`, `poster.occasion`
  - `typeof poster.name`, `poster.name`

### Scope
- [app/api/posters/[id]/route.ts](file:///c:/Users/ASUS/AI_Poster_Maker/app/api/posters/[id]/route.ts) — server log block.
- [app/posters/[id]/page.tsx](file:///c:/Users/ASUS/AI_Poster_Maker/app/posters/[id]/page.tsx) — frontend log block inside `loadPoster` after `setPoster`.

### TR-5.1 — rule: Structured server log present on every preview GET
Pass condition: Request `GET /api/posters/:id` once via browser preview and the server terminal shows one block of 4 lines beginning with `[TEMPLATE-RESOLVE] poster=...`.
Evidence source: Trimmed server terminal screenshot.

### TR-5.2 — rule: Frontend field-typeness log present
Pass condition: After preview page load, browser console contains exactly 5 lines (or a single object dump) with the 5 `typeof` checks specified above.
Evidence source: Screenshot of browser console.

---

## Task 6: Full end-to-end verification run

**Status: pending**
**Priority: high**

### Objective
Re-run the *exact* sequence from AC-6 using the integrated browser, from logged-out state through a regenerate click. Capture final screenshots and JSON payloads proving every rule AC passes. Any regressions discovered return to earlier tasks for correction.

### Sub-steps
1. Hard refresh: clear localStorage + Supabase session, visit `/login`.
2. Register or log in with the audit account. Confirm Navbar shows user's real full name.
3. Navigate `/templates`, pick **Eid Mubarak with Leader Photos** (`tpl-eid-mobarak-v2`) → Use Template.
4. Land on `/create-poster?template=tpl-eid-mobarak-v2`, confirm pre-select, fill every field (real test data), upload 1 real photo, step 4 re-confirm the selection.
5. Submit, capture the `POST /api/posters` request body & response JSON.
6. On the resulting `/posters/:id` page:
   - Confirm Status badge = "Completed" (AC-2).
   - Confirm Created = real date, not "Invalid Date" (AC-3).
   - Confirm Regenerate button label = "Regenerate (3 left)" (AC-4).
   - Confirm Poster Information: Occasion = "Eid Mubarak", Name = submitted name (AC-5).
   - Confirm visual rendering matches the `tpl-eid-mobarak-v2` SVG thumbnail (cream background, leader photo slots, orange headline color) rather than election-campaign green/red (AC-1).
7. Click regenerate once. Confirm count drops to 2, status cycles GENERATING → COMPLETED.
8. Screenshot every step for Completion Evidence.

### TR-6.1 — rule: AC-1..AC-6 all pass for the chosen test run
Pass condition: Every rule AC in spec.md has its Evidence Source produced and attached as a screenshot/JSON snippet for this specific run, signed off in Completion Evidence.
Evidence source: The per-AC evidence list written in Completion Evidence of Task 6.

---

## Task 7: TypeScript typecheck + lint pass

**Status: pending**
**Priority: medium**

### Objective
Ensure the diff produces no TS diagnostics and no new lint warnings.

### Scope
- Run `npm run typecheck` → exit 0.
- Run `npm run lint` → no new errors introduced by the changes (pre-existing lint is OK but noted).

### TR-7.1 — rule: typecheck clean
Pass condition: `npx tsc --noEmit` (or `npm run typecheck`) exits with code 0, no `error TS(...)` lines printed referencing files touched in this audit.
Evidence source: Terminal output screenshot.

### TR-7.2 — rule: no new lint failures on touched files
Pass condition: `npm run lint` output lists 0 new errors compared to baseline. Specifically, no `react-hooks/exhaustive-deps`, no `@typescript-eslint/no-unused-vars`, and no `@typescript-eslint/no-explicit-any` *added* by the fix.
Evidence source: Diff of lint output lines vs baseline (or just terminal output for the touched files, marked clean).
