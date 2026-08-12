# Tito Finance CRM: Product Requirements Document

**Version:** 1.0
**Date:** 2026-08-08
**Owner:** Titobi (Tito Finance)
**Builder:** Claude Code
**Status:** Approved for build, pending decisions in §12

---

## 0. How to read this document

This PRD is written to be built from directly. Schema is real DDL. Colors are real hex with measured contrast ratios. Field names are pulled from the live forms in this repository, not invented.

Three things to read before building anything:

1. **§7.1 Reality check.** Three defects in the current lead capture were found while writing this document. They must be fixed as part of Phase 3, or the CRM will ingest wrong data.
2. **§10.0 Design conflict resolution.** The nine skill files loaded for this document contain genuinely contradictory instructions for a CRM. §10.0 resolves them explicitly and states which skill governs which surface. Do not apply all nine uniformly.
3. **§11.2 What is not in four weeks.** The scope in §3 is achievable. Several items commonly assumed to come with it are not.

---

## 1. Executive summary

### What it does

Tito Finance CRM is an internal, authenticated web application that replaces Google Sheets as the working surface for lead management. Every lead from every channel lands in one inbox, carries its source, moves through a six-stage pipeline, and accumulates a permanent record of every note, stage change, and email sent.

It is not analytics software and not a marketing tool. It is a work surface for a two-to-five person sales team that spends its day contacting people and recording what happened.

### Who uses it

Two roles, three-to-five humans total at launch: Titobi as Super Admin, and one or two assistants as Sales Reps. Every user is authenticated. There is no public surface and no customer-facing view.

### Why it exists

Google Sheets fails at four specific things the business now needs:

| Problem with Sheets | Cost today | CRM answer |
|---|---|---|
| No stage tracking | Nobody knows which of 400 leads were contacted | Pipeline stages with enforced transitions and timestamps |
| No history | "Did we already email her?" has no answer | Append-only activity log per lead |
| No real-time | Two reps overwrite each other's cells | Postgres row-level updates pushed to every open tab |
| No context at the moment of contact | Rep opens WhatsApp, does not know the lead filled the retirement form last week | Lead profile with source, program interest, and full timeline |

### Success criteria

The CRM is working when:

- Every lead from every source appears in the inbox within 10 seconds of submitting the form, with the correct source tag.
- No lead sits in `new` for more than 48 hours without either a stage change or a note explaining why.
- Titobi can answer "what is our conversion rate from the Stock 101 form" from the dashboard, without opening a spreadsheet.
- A rep can go from opening the app to sending a contextual WhatsApp message in under 15 seconds.

### Non-goals

Explicitly out of scope, permanently: customer self-service portal, payment processing, course delivery, marketing automation sequences, call recording, lead scoring by machine learning.

---

## 2. User personas

### 2.1 Sales Rep (Titobi's assistant)

**Context:** Works from a laptop, often with a phone in hand for WhatsApp. Sessions are long: 2 to 4 hours of continuous work, cycling through the same three screens. Uses the app tens to hundreds of times per day. This frequency is the single most important input to the motion budget in §10.5.

**State of mind:** Focused, repetitive, mildly time-pressured. Not exploring. Wants the tool to disappear.

**Primary job:** Move leads out of `new`. Contact, record, follow up.

**Can see:** All leads, all notes, all activities, all tags, the dashboard, all other users' names.

**Can do:**
- Create leads manually
- Edit any lead field except `id` and `source`
- Change stage
- Add notes (own notes only; cannot edit or delete another rep's note)
- Add and remove tags
- Send email from the CRM
- Open the WhatsApp deep link
- Assign a lead to themselves or another rep
- Export a filtered view to CSV (V2)

**Cannot do:**
- Delete a lead
- Edit or delete any activity log entry
- Edit or delete another user's note
- Invite, deactivate, or change the role of a user
- Change the sending domain or email configuration
- View or rotate API keys

**Why shared visibility:** At three-to-five people, partitioning leads by owner creates more coordination cost than it removes. Reps need to see that Titobi already spoke to someone. `assigned_to` exists and is filterable, but it is a workflow convenience, not a security boundary. Revisit only above roughly 8 reps.

### 2.2 Super Admin (Titobi)

**Context:** Uses the app in shorter, less frequent bursts than the reps. Two distinct modes: a morning check of the dashboard, and deep work on specific high-value leads. Also the person who onboards a new assistant.

**State of mind:** Evaluating. Wants the shape of the business at a glance, then the ability to drill in.

**Primary job:** Understand pipeline health, and personally handle high-value leads.

**Can see and do:** Everything a Sales Rep can, plus:
- Delete a lead (soft delete: sets `deleted_at`, hides from all views, retains the row and its activity trail)
- Edit or delete any user's note
- Invite a user by email, set their role, deactivate them
- Change role between `super_admin` and `sales_rep`
- View the email configuration screen (sending domain, verification status, monthly send count)
- Run the Google Sheets import
- View the system activity feed across all leads

**Still cannot do:** Edit or delete an activity log entry. The activity log is append-only for every role including Super Admin. If it were editable it would not be evidence.

### 2.3 Permission matrix

| Action | Sales Rep | Super Admin |
|---|---|---|
| View all leads | Yes | Yes |
| Create lead | Yes | Yes |
| Edit lead fields | Yes | Yes |
| Change stage | Yes | Yes |
| Soft-delete lead | No | Yes |
| Add note | Yes | Yes |
| Edit or delete own note | Yes | Yes |
| Edit or delete another's note | No | Yes |
| Read activity log | Yes | Yes |
| Write or edit activity log | No (system-written only) | No (system-written only) |
| Send email | Yes | Yes |
| Manage tags (create, rename, delete) | Create and apply only | Full |
| Invite or deactivate user | No | Yes |
| Change a user's role | No | Yes |
| Email configuration screen | No | Yes |
| Run Sheets import | No | Yes |

---

## 3. Core features

### 3.1 Must-have (MVP)

Priority order below is build order. Each item states its acceptance criteria.

#### P0-1. Authentication and role gate
Email plus password. No public signup: users exist only by Super Admin invite. Unauthenticated visitors to any route redirect to `/login`. A `sales_rep` hitting `/settings/users` sees a 403 surface, not a blank page and not a crash.

**Acceptance:** A new browser session cannot read a single lead row without valid credentials, verified by hitting the Supabase REST endpoint directly with an anon key.

#### P0-2. Lead inbox
A dense table of all non-deleted leads. Default sort: `last_activity_at` descending, so the freshest work is at the top. Default filter: none, all stages visible.

Columns, left to right: Name, Source, Stage, Program interest, Location, Tags, Assigned, Last activity. Row height 44px. Approximately 18 rows visible at 1440x900 without scrolling.

Source renders as a text badge, not an icon, because five sources with icons becomes a guessing game. Values: `Stock 101`, `Retirement`, `WhatsApp`, `Chatbot`, `Manual`, `Import`.

**Acceptance:** 500 leads render in under 200ms with no visible layout shift. New leads appear at the top without a page refresh (see P0-9).

#### P0-3. Lead profile
Full record on a single screen. Three regions: identity header (name, email, phone, stage control, WhatsApp button, Email button), detail panel (source, programs, location, age range, retirement savings, how heard, assigned, first seen), and timeline (notes and activities interleaved, newest first).

Editing is inline. Click a field, it becomes an input, blur commits. No edit modal. Modals are the lazy answer for a record the user edits dozens of times a day.

**Acceptance:** Every field captured by either public form is visible on this screen. Nothing requires a second click to discover.

#### P0-4. Pipeline stages
Six stages, in order: `new`, `contacted`, `nurturing`, `session_booked`, `converted`, `closed_lost`.

Transitions are free-form: any stage to any stage. Enforcing a linear funnel is wrong here, because a lead who books a session and no-shows genuinely goes backward to `nurturing`. Every transition writes an activity row recording from, to, actor, and timestamp.

Moving to `converted` stamps `converted_at`. Moving to `closed_lost` prompts for a one-line reason, stored on `closed_lost_reason`. The prompt is inline in the stage control, not a modal.

**Acceptance:** Stage change is optimistic in the UI and reconciled from the server. If the write fails, the badge reverts and an inline error appears next to it, not as a toast that the rep will miss.

#### P0-5. Notes
Timestamped, authored, plain text. Rendered in the timeline alongside activities. Author name and relative time shown ("Titobi, 2h ago"), absolute time on hover.

Plain text, not rich text. A rich text editor is a week of work and a lifetime of paste bugs, for a surface where every note is one to three sentences.

**Acceptance:** Note appears in the timeline immediately on submit, without refetching the whole lead.

#### P0-6. Activity log
Append-only. Written by database triggers, never by client code, so it cannot drift from reality.

Logged events: `lead_created`, `stage_changed`, `note_added`, `email_sent`, `email_failed`, `tag_added`, `tag_removed`, `assigned`, `field_updated`, `form_resubmitted`, `whatsapp_opened`.

`whatsapp_opened` is written client-side on click. It records that the rep opened the chat, not that a message was sent. The UI must label it honestly: "Opened WhatsApp", never "Messaged on WhatsApp". See §7.4.

**Acceptance:** No client code path can insert, update, or delete an activity row. Enforced by RLS, verified by attempting it with a rep's JWT.

#### P0-7. Email sending
Compose and send from the lead profile. Subject plus plain-body composer. Sends through a Supabase Edge Function that calls Resend server-side.

The Resend API key never reaches the browser. This is not a preference. A key in a Vite bundle is a public key.

Every send writes an `email_logs` row and an activity entry. Delivery status updates arrive via Resend webhook and update the same row.

**Acceptance:** Viewing the compiled JS bundle with a text search for the key prefix returns nothing.

#### P0-8. WhatsApp quick-link
One click opens `https://wa.me/<e164>?text=<prefilled>` in a new tab.

Requires normalized phone numbers. Nigerian users type `08184750870`, `+234 818 475 0870`, and `234-818-475-0870`. All three must become `2348184750870`. Normalization runs at ingestion and stores to `phone_e164`, leaving `phone_raw` untouched for audit.

Default prefilled text is a short greeting including the lead's first name and the program they enquired about. Rep can edit before sending, because it opens in WhatsApp, not in the CRM.

**Acceptance:** All three input formats above produce an identical, working `wa.me` link.

#### P0-9. Real-time updates
Supabase Realtime subscription on the `leads` table. A new lead arriving via webhook appears in every open inbox within 10 seconds, with no refresh.

Implementation: the Realtime event invalidates the relevant TanStack Query cache key rather than patching component state directly. This keeps one source of truth for server data and avoids the class of bug where a realtime patch and a refetch disagree.

New rows arriving while the rep is scrolled down must not shift the viewport. Insert above with the scroll position anchored, and show a quiet "3 new leads" affordance at the top of the table.

**Acceptance:** Two browsers open on the inbox. Submitting the live Stock 101 form updates both within 10 seconds without interaction.

#### P0-10. Tags
Six seeded tags: `Hot`, `Warm`, `Cold`, `Diaspora`, `Nigeria`, `Follow-up`. Many-to-many. Reps can create new tags; only Super Admin can rename or delete one, because deleting a tag silently changes the meaning of every saved filter.

`Hot`, `Warm`, and `Cold` are mutually exclusive in the UI (selecting one clears the others). Enforced in the client, not the schema, because the schema should not encode a workflow rule this likely to change.

#### P0-11. Search and filter
Search: single input, matches name, email, and phone. Postgres full-text on a generated tsvector column, not `ILIKE '%x%'`, because leading-wildcard `LIKE` cannot use an index and will degrade visibly past a few thousand rows.

Filters: stage (multi-select), source (multi-select), tag (multi-select), assigned (single), location (single), date range on `first_seen_at`.

Filter state serializes to the URL query string. A rep can bookmark "unassigned hot leads from the retirement form" and send that link to Titobi. This is a small feature with a large payoff for a small team.

**Acceptance:** Filters compose with AND across categories and OR within a category. Clearing all filters is one click and is always visible when any filter is active.

#### P0-12. Dashboard
Five numbers and two breakdowns, no more:

- Total leads
- New this week
- Conversion rate (`converted` / all non-deleted, as a percentage to one decimal)
- Leads in `new` older than 48 hours (the number that should drive behavior)
- Sessions booked this month

Breakdowns: leads by source (horizontal bars), leads by stage (funnel-ordered bars).

Numbers use DM Mono with tabular figures so they do not shift width as they update.

No line charts in MVP. A trend line over a three-month-old dataset is decoration.

### 3.2 Nice-to-have (V2)

Ordered by ratio of value to effort. Do not start any of these before all P0 items ship.

| # | Feature | Effort | Note |
|---|---|---|---|
| V2-1 | CSV export of the current filtered view | 0.5 day | Highest value per hour of any item here. Client-side generation from the already-fetched rows. |
| V2-2 | Email templates | 1.5 days | Stored templates with `{{first_name}}` and `{{program}}` interpolation. Blocked on nothing. |
| V2-3 | Reminders and follow-up tasks | 3 days | `tasks` table, due date, assignee, a "Due today" section on the dashboard. Needs a decision on notification channel. |
| V2-4 | Google Sheets one-time import | 1 day | See §7.2. Recommended as a Phase 3 item rather than V2. |
| V2-5 | Bulk email | 2 days | Requires per-send rate limiting and a confirm step showing the exact recipient count. Meaningful spam risk if built carelessly. |
| V2-6 | WhatsApp message log | 1 day manual / 3+ weeks real | See §7.4. The honest version is a manual "log a WhatsApp touch" button. The real version requires the WhatsApp Cloud API and Meta Business verification. |
| V2-7 | Mobile view | 3 days | Not a separate app. A responsive breakpoint set: inbox collapses to a card list, sidebar to a bottom bar, profile stacks to one column. |

---

## 4. Tech stack recommendation

### 4.1 Recommended combination

| Layer | Choice |
|---|---|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS |
| Backend and database | **Supabase** (Postgres, Auth, Realtime, Edge Functions, RLS) |
| Email | **Resend**, called from a Supabase Edge Function |
| Hosting | **Vercel** (frontend) + **Supabase Cloud** (backend) |
| Server state | **TanStack Query** |
| Client state | **Zustand**, minimal |
| Routing | React Router 7 |
| Tables | TanStack Table (headless) |
| Icons | Phosphor Icons |
| Forms | React Hook Form + Zod |

### 4.2 Backend: why Supabase over Firebase and PocketBase

The deciding argument is not realtime and not auth. All three do those. It is **query shape**.

A CRM's core job is multi-dimensional filtering: stage AND source AND tag AND date range AND assignee, with full-text search on top, sorted by a sixth column. In Postgres that is one query against a handful of indexes. In Firestore, every distinct combination of filters and sort orders requires its own composite index, declared ahead of time. With six filter dimensions the index count is combinatorial, and Firestore additionally forbids range filters on more than one field per query, which kills "leads created between two dates, sorted by last activity."

Second argument: **the data is relational.** Leads have many notes, many activities, many tags. Tags belong to many leads. Firestore models this by denormalizing or by client-side joins, both of which create write-amplification and consistency bugs the moment a tag is renamed.

Third argument: **RLS is SQL.** Access rules live next to the data, are testable with a SQL client, and cannot be bypassed by a client that constructs its own query. Firestore Security Rules are a separate language with no join support, so "a rep may edit their own note" requires either denormalizing the author onto the note (fine) or a `get()` call per rule evaluation (billed, and slow).

| Criterion | Supabase | Firebase | PocketBase |
|---|---|---|---|
| Multi-dimensional filtering | Native SQL, one index set | Composite index per query shape, single range field limit | SQLite, good, but weaker full-text |
| Relational integrity | Foreign keys, cascades, triggers | None, application-enforced | Foreign keys, lighter |
| Role-based access | RLS in SQL, testable | Rules DSL, no joins | Collection rules, simpler and less expressive |
| Realtime | Postgres logical replication | Mature, excellent | SSE, works, smaller ecosystem |
| Ops burden for 2-5 users | Zero, managed | Zero, managed | **You run and back up a server** |
| Cost at this scale | Free tier is sufficient | Free tier sufficient, reads billed per document | VPS cost only |
| Server-side functions | Deno Edge Functions | Cloud Functions, mature | Go hooks, requires recompiling |

**PocketBase is rejected on ops burden alone.** It is genuinely excellent software, and for a two-person finance business with no dedicated engineer, "you now own a Linux box, its backups, and its uptime" is a real recurring cost that a managed service removes. Reconsider only if data residency requirements appear.

**Firebase is rejected on query shape.** It would work, and it would get progressively more painful exactly as the lead count grows, which is the wrong direction for the pain to run.

**Risk of Supabase, stated honestly:** the free tier pauses a project after 7 days of inactivity. For a tool used daily this will not trigger, but the moment this is business-critical, move to the Pro plan for daily backups and no pausing. Budget for it.

### 4.3 Email: why Resend

| Criterion | Resend | SendGrid | Nodemailer + SMTP |
|---|---|---|---|
| Time to first sent email | Under 30 minutes | Half a day | Half a day plus deliverability tuning |
| Free tier | 3,000/month, 100/day | 100/day | Cost of the SMTP provider |
| Delivery webhooks | Yes, clean payloads | Yes, verbose | You build it |
| Deliverability defaults | Managed, guided DNS setup | Managed | **Yours to solve** |
| Edge runtime support | HTTP API, works in Deno | HTTP API, works | Requires Node TCP, does **not** run in Deno Edge Functions |

Nodemailer is disqualified on a technical fact, not a preference: it opens a raw SMTP socket, and Supabase Edge Functions run on Deno Deploy, which does not permit arbitrary outbound TCP. It would require a separate Node server, which reintroduces the ops burden that Supabase was chosen to remove.

At 3,000 emails per month free, and realistic volume in the low hundreds, cost is zero for the foreseeable future.

**Hard dependency, flag early:** Resend requires DNS records (SPF, DKIM, and ideally DMARC) on the sending domain before it will deliver reliably. This is a task for whoever controls the `titofinance` DNS, and it is the single most likely thing to block Phase 2. Start it in Week 1, not Week 3.

### 4.4 Hosting: Vercel plus Supabase

The repository already contains `vercel.json`, so the main site is on Vercel. Putting the CRM on the same account means one dashboard, one deploy model, and one place to manage environment variables.

Deploy the CRM as a **separate Vercel project** on a subdomain such as `crm.titofinance.com`, not as a route inside the marketing site. Reasons: the marketing site is public and SEO-indexed; the CRM must never be crawled; and a bad CRM deploy must not be able to take down the funnel that feeds it.

Railway and Render are both fine platforms and both lose here for the same reason: they solve a problem (running a persistent server) that this architecture does not have. A static SPA plus managed Postgres plus edge functions needs no container.

### 4.5 State: TanStack Query and Zustand, not either-or

This is framed as an either-or in the brief, but they solve different problems and the correct answer is both, with a strict boundary.

**TanStack Query owns everything that lives in the database:** leads, notes, activities, tags, users, dashboard aggregates. It handles caching, deduplication, background refetch, and optimistic updates with rollback. The optimistic-update-with-rollback behavior is exactly what P0-4 (stage change) requires, and hand-rolling it in Zustand is how you get a UI that lies about server state.

**Zustand owns only ephemeral client state:** which filter panel is open, which rows are selected for a bulk action, the composer draft before send. Roughly 30 lines of store.

**The rule:** if a value could be different in another user's browser, it belongs to TanStack Query. If it dies when the tab closes and nobody else could ever see it, it belongs to Zustand.

**Realtime wiring:** the Supabase Realtime subscription does not write to either store. It calls `queryClient.invalidateQueries` for the affected key. One data path, no reconciliation bugs.

### 4.6 Frontend libraries and the reuse question

React 19, Vite, TypeScript, and Tailwind carry over from the main site, which is the right call: the same person maintains both, and the mental model transfers.

Two deliberate divergences from the main site's conventions:

1. **Tailwind classes, not inline `style` objects.** The existing site uses inline style objects extensively (see `Navbar.tsx`, `Footer.tsx`). That is workable for a dozen marketing components. For a CRM with a shared component vocabulary across many screens, it prevents the consistency the product register demands: you cannot enforce "every button looks the same" when every button carries its own style literal. Use Tailwind with a token layer (§10.2).

2. **Add Tailwind v4 or stay on v3.** The site is on Tailwind 3.4. Staying on v3 for the CRM is the lower-risk choice and keeps one mental model. Recommended: **stay on v3.4**, revisit after launch.

**Icons:** Phosphor (`@phosphor-icons/react`) at a globally standardized weight of `regular`. The main site uses `lucide-react`; do not carry it over, and do not mix the two families. One icon family per project.

**Tables:** TanStack Table headless, styled by hand. Do not install a batteries-included data grid (AG Grid, MUI DataGrid). They arrive with their own design system, which will fight the brand tokens on every cell.

---

## 5. Data models

### 5.1 Extensions and enums

```sql
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "citext";     -- case-insensitive email

create type user_role     as enum ('super_admin', 'sales_rep');
create type lead_source   as enum ('stock101', 'retirement', 'whatsapp', 'chatbot', 'manual', 'import');
create type lead_stage    as enum ('new', 'contacted', 'nurturing', 'session_booked', 'converted', 'closed_lost');
create type program       as enum (
  'stock101_session',      -- free
  'retirement_session',    -- free lead-in
  'paid_mentorship',
  'beginner_portfolio',
  'closed_circuit',
  'quick_fire'
);
create type activity_type as enum (
  'lead_created', 'stage_changed', 'note_added', 'email_sent', 'email_failed',
  'tag_added', 'tag_removed', 'assigned', 'field_updated',
  'form_resubmitted', 'whatsapp_opened'
);
create type email_status  as enum ('queued', 'sent', 'delivered', 'opened', 'bounced', 'complained', 'failed');
```

### 5.2 `profiles` (CRM users)

Mirrors `auth.users`. Supabase owns authentication; this table owns everything the application needs to know about a person.

```sql
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       citext not null unique,
  full_name   text not null,
  role        user_role not null default 'sales_rep',
  avatar_url  text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index profiles_role_idx on profiles (role) where is_active;
```

| Field | Type | Notes |
|---|---|---|
| `id` | uuid PK | Same value as `auth.users.id`. Cascade delete. |
| `email` | citext, unique | Case-insensitive. `Titobi@x.com` and `titobi@x.com` are one person. |
| `full_name` | text, required | Shown as note and activity author. |
| `role` | enum | Drives every RLS policy. |
| `is_active` | boolean | Deactivation instead of deletion, so authored notes keep their author. |

**Trigger:** on insert into `auth.users`, insert a matching `profiles` row with role `sales_rep`. Promotion to `super_admin` is a deliberate manual act.

### 5.3 `leads`

The central table. Field names mirror the live forms exactly, so ingestion needs no translation layer.

```sql
create table leads (
  id                  uuid primary key default gen_random_uuid(),

  -- identity
  full_name           text not null,
  email               citext not null,
  phone_raw           text,
  phone_e164          text,

  -- classification
  source              lead_source not null,
  stage               lead_stage not null default 'new',
  programs            program[] not null default '{}',

  -- qualification, from the public forms
  location            text,           -- Nigeria | United States | United Kingdom | Canada | Other
  age_range           text,           -- 25-35 | 36-45 | 46-55 | 55+   (retirement form only)
  retirement_savings  text,           -- None yet | Just started | Have some | Well invested
  how_heard           text,           -- Instagram | WhatsApp | YouTube | TikTok | Friend | Other

  -- ownership and lifecycle
  assigned_to         uuid references profiles(id) on delete set null,
  first_seen_at       timestamptz not null default now(),
  last_activity_at    timestamptz not null default now(),
  converted_at        timestamptz,
  closed_lost_reason  text,

  -- audit
  raw_payload         jsonb not null default '{}'::jsonb,
  deleted_at          timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint leads_converted_consistency
    check ((stage = 'converted') = (converted_at is not null))
);

create unique index leads_email_unique on leads (email) where deleted_at is null;
create index leads_stage_idx          on leads (stage)            where deleted_at is null;
create index leads_source_idx         on leads (source)           where deleted_at is null;
create index leads_assigned_idx       on leads (assigned_to)      where deleted_at is null;
create index leads_last_activity_idx  on leads (last_activity_at desc) where deleted_at is null;
create index leads_first_seen_idx     on leads (first_seen_at desc)    where deleted_at is null;
create index leads_programs_idx       on leads using gin (programs);

-- full-text search over name, email, phone
alter table leads add column search_vector tsvector
  generated always as (
    to_tsvector('simple',
      coalesce(full_name, '') || ' ' || coalesce(email::text, '') || ' ' || coalesce(phone_raw, ''))
  ) stored;
create index leads_search_idx on leads using gin (search_vector);
```

**Four design decisions worth defending:**

1. **`email` is unique among non-deleted leads.** A person who fills the Stock 101 form and later the Retirement form is one lead, not two. The second submission upserts: it appends to `programs`, fills any null qualification fields, and writes a `form_resubmitted` activity carrying the new payload. Creating a duplicate row would split that person's history in half, which defeats the reason the CRM exists.

2. **`programs` is an enum array, not a join table.** Six fixed values, no per-relationship metadata, and a GIN index gives fast containment filtering. A join table here would add a file, a query, and no capability.

3. **`raw_payload` retains the original webhook body.** When a form field is added next month and ingestion has not caught up, the data is not lost. This has saved every integration I have seen that included it.

4. **Soft delete via `deleted_at`.** Every index and every RLS policy is partial on `deleted_at is null`. Deleting a lead must never orphan its activity trail.

### 5.4 `notes`

```sql
create table notes (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references leads(id) on delete cascade,
  author_id  uuid not null references profiles(id) on delete restrict,
  body       text not null check (length(trim(body)) between 1 and 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notes_lead_idx on notes (lead_id, created_at desc);
```

`on delete restrict` on the author is deliberate: a user who wrote notes cannot be hard-deleted, only deactivated. Notes must keep their author.

### 5.5 `activities`

Append-only. Written by triggers and by the ingestion function. No client-side inserts.

```sql
create table activities (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references leads(id) on delete cascade,
  actor_id    uuid references profiles(id) on delete set null,  -- null = system
  type        activity_type not null,
  summary     text not null,      -- pre-rendered, human-readable, display-ready
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index activities_lead_idx on activities (lead_id, created_at desc);
create index activities_type_idx on activities (type, created_at desc);
```

`summary` is denormalized on purpose. The timeline renders thousands of rows; resolving "who was this actor and what did stage 3 mean" at read time is unnecessary work for data that is immutable by definition.

`metadata` examples:
- `stage_changed`: `{"from": "new", "to": "contacted"}`
- `email_sent`: `{"email_log_id": "...", "subject": "..."}`
- `form_resubmitted`: `{"source": "retirement", "payload": {...}}`

### 5.6 `tags` and `lead_tags`

```sql
create table tags (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  color_token text not null default 'neutral',  -- see §10.3
  created_by  uuid references profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

create unique index tags_name_lower_idx on tags (lower(name));

create table lead_tags (
  lead_id   uuid not null references leads(id) on delete cascade,
  tag_id    uuid not null references tags(id)  on delete cascade,
  tagged_by uuid references profiles(id) on delete set null,
  tagged_at timestamptz not null default now(),
  primary key (lead_id, tag_id)
);

create index lead_tags_tag_idx on lead_tags (tag_id);
```

`color_token` stores a semantic name (`hot`, `warm`, `cold`, `neutral`, `region`), not a hex value. Storing hex in the database means a palette change becomes a data migration.

**Seed:**

| name | slug | color_token |
|---|---|---|
| Hot | `hot` | `hot` |
| Warm | `warm` | `warm` |
| Cold | `cold` | `cold` |
| Diaspora | `diaspora` | `region` |
| Nigeria | `nigeria` | `region` |
| Follow-up | `follow-up` | `neutral` |

### 5.7 `email_logs`

```sql
create table email_logs (
  id             uuid primary key default gen_random_uuid(),
  lead_id        uuid not null references leads(id) on delete cascade,
  sender_id      uuid not null references profiles(id) on delete restrict,
  to_email       citext not null,
  from_email     citext not null,
  subject        text not null,
  body           text not null,
  status         email_status not null default 'queued',
  provider       text not null default 'resend',
  provider_id    text,               -- Resend message id, for webhook correlation
  error_message  text,
  sent_at        timestamptz,
  delivered_at   timestamptz,
  opened_at      timestamptz,
  created_at     timestamptz not null default now()
);

create index email_logs_lead_idx     on email_logs (lead_id, created_at desc);
create index email_logs_provider_idx on email_logs (provider_id) where provider_id is not null;
create index email_logs_status_idx   on email_logs (status);
```

`to_email` is stored separately from `leads.email` on purpose: it records where the message actually went, which stays correct even if the lead later corrects their address.

### 5.8 Relationships

```
auth.users 1---1 profiles
profiles   1---* leads        (assigned_to, nullable)
profiles   1---* notes        (author_id, restrict)
profiles   1---* activities   (actor_id, nullable = system)
profiles   1---* email_logs   (sender_id, restrict)
profiles   1---* tags         (created_by, nullable)

leads      1---* notes        (cascade)
leads      1---* activities   (cascade)
leads      1---* email_logs   (cascade)
leads      *---* tags         (via lead_tags, cascade both sides)
```

### 5.9 Triggers

```sql
-- 1. Keep updated_at honest on every table that has one.
-- 2. Bump leads.last_activity_at whenever a child row is written.
-- 3. Write an activity row on: lead insert, stage change, assignment change,
--    note insert, tag add/remove, email_logs insert and status change.
-- 4. Stamp converted_at when stage becomes 'converted', clear it when it leaves.
-- 5. Normalize phone to E.164 on insert and update of phone_raw.
```

All five are database triggers, not application code. Anything that must be true of every write belongs in the database, because the application will eventually have more than one write path (UI, webhook, import script) and only one of them will remember.

---

## 6. UI/UX architecture

### 6.1 Layout system

A three-region app shell, fixed, present on every authenticated screen.

```
+----------------+--------------------------------------------------+
|                |  TOP BAR                    56px                  |
|   SIDEBAR      +--------------------------------------------------+
|   224px        |                                                  |
|   dark         |  MAIN CONTENT                                    |
|   #0D0B08      |  ivory #F8F5EE                                   |
|                |  max-width: none (tables want the width)         |
|                |                                                  |
|   [nav items]  |                                                  |
|                |                                                  |
|   ---          |                                                  |
|   [user chip]  |                                                  |
+----------------+--------------------------------------------------+
```

**Sidebar, 224px, `#0D0B08`.** Fixed, never scrolls with content. Contains the Tito Finance mark at top, five nav items, and the current user chip pinned to the bottom. Active item is marked with a 2px gold left indicator plus gold text. Gold on `#0D0B08` measures **8.60:1**, comfortably AAA (§10.3).

Nav items, named for their contents rather than as generic umbrellas: `Dashboard`, `Leads`, `Activity`, `Settings`. Four items, one line each. No icons-only mode, no collapse toggle in MVP: a 224px sidebar on a 1440px screen costs 15% of width and a collapse control costs a decision every session.

**Top bar, 56px.** Left: the current screen's title and, on the lead profile, a back affordance. Center: global search, `⌘K` focusable. Right: the primary action for the current screen (`New lead` on the inbox), then nothing else. No notification bell in MVP (see §6.7).

**Main content.** No max-width. A 500-row lead table wants every available pixel; centering it in a 1200px column to look tidy costs two visible columns.

**A note on the dark sidebar next to a light content area.** The `design-taste-frontend` skill bans mid-page theme inversion (its §4.11 Page Theme Lock). That rule targets marketing pages where a light section is sandwiched between dark sections mid-scroll. A dark structural chrome layer beside a light content surface is a different thing: it is the "second neutral layer for sidebars, toolbars, and panels" that the product register explicitly calls for. It is Linear, Notion, Stripe, and Figma. It is permitted here, deliberately, and it is the only place in the app where two surfaces of different lightness meet.

### 6.2 Login screen

The one surface in the entire product that is a brand surface rather than a product surface, and therefore the one place where the marketing-oriented skills apply (§10.0).

Split composition, not centered: left 45% is a solid forest `#1A3A16` panel carrying the Tito Finance mark and the line "Building Wealth. Building Lives." set in Cormorant Garamond italic. Right 55% is ivory, carrying the form.

Form: email, password, submit. Labels above inputs, never placeholder-as-label. Error text below the input, inline, specific ("No account found for that email", not "Login failed"). Submit shows an inline spinner and stays enabled-looking rather than dimming to unreadable.

No signup link. No social login. No "remember me" checkbox: the session is 7 days by default (§8.4).

Cormorant Garamond appears here at 32px and above, which is where it belongs. It appears almost nowhere else (§10.4).

### 6.3 Dashboard

Entry screen after login. Answers "what should I do today" in under five seconds.

Top row: five stat readouts in a single horizontal band, separated by 1px vertical hairlines, **not** in cards. At the cockpit density this app targets, card containers around single numbers are pure chrome. Numbers set in DM Mono, tabular figures, 32px. Labels in DM Sans 12px uppercase, tracking 0.08em, muted ink.

The fourth stat, "In New over 48h", is the only one that renders in an alert treatment when non-zero, and it is a link that navigates to the inbox with that filter pre-applied. A number you cannot act on is trivia.

Below: two breakdown panels side by side. Leads by source, leads by stage. Horizontal bars, gold fill, value at the end of each bar in DM Mono. Bars use the accent as a fill behind no text, which sidesteps the gold-on-ivory contrast problem entirely (§10.3).

Below that: the ten most recent activities across all leads, as a compact list. Each row links to its lead.

**Empty state:** before any leads exist, the dashboard shows a single line and the two things a new user can do: connect the forms, or add a lead manually. Not "No data available."

### 6.4 Lead inbox

The screen the reps live in.

**Filter bar**, directly under the top bar, 48px, sticky. Six controls left to right: Stage, Source, Tag, Assigned, Location, Date range. Each is a dropdown showing the active count when filtered. A `Clear all` appears only when at least one filter is active, and is always visible when it does.

**Table.** Row height 44px. Header row 36px, sticky, uppercase 11px labels, muted. Rows separated by 1px hairlines at 8% ink, no zebra striping, no card wrappers, no border on every side. Hover raises the row background by one step. The entire row is the click target; the row navigates to the profile.

Column widths are fixed, not content-derived, so the columns do not jump between filter states.

| Column | Width | Content |
|---|---|---|
| Name | 200px | Full name, DM Sans 14px medium. Email 12px muted below it. |
| Source | 110px | Text badge |
| Stage | 130px | Stage badge, click to change inline |
| Programs | 150px | Up to 2 shown, then `+N` |
| Location | 110px | Text |
| Tags | 160px | Up to 3 shown, then `+N` |
| Assigned | 120px | First name, or `Unassigned` in muted |
| Last activity | 100px | Relative ("2h"), absolute on hover, DM Mono |

**Pagination:** cursor-based, 50 rows per page, on `last_activity_at`. Not offset pagination: with realtime inserts, offset pagination shows the same lead twice or skips one. Not infinite scroll: reps need to be able to say "she was on page 2."

**Loading:** skeleton rows matching exact final row height, so nothing shifts when data arrives. Never a centered spinner.

**Empty states, three distinct ones:**
- No leads at all: teaches the interface, offers `Add lead` and a link to integration setup.
- No leads match the filter: says which filters are active and offers `Clear all`.
- Search returned nothing: echoes the query and suggests checking spelling.

### 6.5 Lead profile

```
+-------------------------------------------------------------------+
|  < Leads                                                          |
+-------------------------------------------------------------------+
|  Adaeze Okonkwo                    [Stage: Contacted v]           |
|  adaeze.o@gmail.com · +234 818 475 0870                           |
|  [ WhatsApp ]  [ Email ]                                          |
+---------------------------------------+---------------------------+
|  TIMELINE                             |  DETAILS                  |
|                                       |                           |
|  [ Add a note...              ]       |  Source     Retirement    |
|                                       |  Programs   Retirement    |
|  Titobi · 2h ago                      |  Location   Nigeria       |
|  Called. Asked to follow up Friday.   |  Age range  46-55         |
|                                       |  Savings    Just started  |
|  Stage changed: New to Contacted      |  How heard  Instagram     |
|  Titobi · 2h ago                      |  Assigned   Titobi        |
|                                       |  First seen 3 Aug 2026    |
|  Email sent: "Your retirement..."     |                           |
|  Titobi · 1d ago · Delivered          |  TAGS                     |
|                                       |  [Hot] [Nigeria] [+]      |
|  Lead created from Retirement form    |                           |
|  System · 3 Aug 2026                  |                           |
+---------------------------------------+---------------------------+
```

Two columns: timeline at 62%, details at 38%. Details is a definition list with hairline separators, not a card, not a form until clicked.

**Inline editing.** Click any detail value, it becomes an input in place, blur or Enter commits, Escape cancels. Optimistic, with rollback and an inline error on failure. Never a modal: a rep edits these fields many times a day and a modal costs two extra interactions each time.

**Stage control.** A dropdown in the header, showing the current stage as a badge. Selecting `Closed lost` expands a single-line reason input beneath it before committing.

**WhatsApp button.** Disabled with an explanatory tooltip when `phone_e164` is null. Never a button that silently does nothing.

**Email composer.** Opens as a panel that slides up from the bottom of the timeline column, not as a modal over the whole screen, so the rep can still read the lead's history while writing. Subject, body, send. Shows the resolved `from` address so there is no ambiguity about which mailbox this comes from.

### 6.6 Add lead manually

A right-side drawer, 480px, over a scrim. This is the one place a drawer is right: it is an occasional action, it needs the list visible behind it for context, and it has a clear enter and exit path from the same edge.

Fields: Name (required), Email (required), Phone, Source (defaults to `manual`, editable), Programs (multi), Location, How heard, Assign to, Initial note.

**Duplicate handling is the important behavior.** On email blur, check for an existing lead. If found, replace the form with a short message naming the existing lead, its stage, and its last activity, plus two buttons: `Open existing lead` and `Add note to existing`. Do not let the rep create the duplicate and discover it later.

### 6.7 Settings

Two sections, both Super Admin only.

**Users.** Table of profiles: name, email, role, status, last sign-in. Actions: invite by email, change role, deactivate. Deactivating shows what will happen to that user's notes (nothing: they stay, attributed).

**Email.** Read-mostly. Sending domain and its verification status pulled live from Resend, the configured `from` address, and this month's send count against the plan limit. If the domain is unverified, this screen states exactly which DNS records are missing. This is the screen that turns "email is broken" into a solvable task.

A `sales_rep` navigating to `/settings` sees only a 403 surface explaining that this area is admin-only, with a link back to Leads. Never a blank screen, never a crash, and never a hidden route that a rep discovers by URL guessing.

### 6.8 The notification panel: deliberately deferred

The brief lists a notification/activity panel as part of the layout. It is **not** in MVP, and this is a considered rejection rather than an oversight.

At three-to-five users sharing one inbox, a notification panel duplicates information the inbox already shows in real time. It would be a second place to check, which is a second place to forget to check. The `Activity` nav item covers the "what happened recently" need with a full screen instead of a cramped drawer.

Revisit when either the team exceeds roughly six people, or task assignment (V2-3) ships, at which point "something is assigned to you" becomes information the inbox genuinely does not carry.

---

## 7. Integration plan

### 7.1 Reality check: three defects in the current capture

Found by reading the live code. All three affect what the CRM will receive, and all three must be fixed as part of this work.

**Defect 1: `LandingForm` ignores its `webhookUrl` prop.**
`src/components/landing/LandingForm.tsx:72` destructures `{ fields, submitLabel }` from props. `webhookUrl` is declared on the interface at line 14 but never read. Line 95 hardcodes the Google Apps Script URL. `RetirementPage.tsx:1019` passes `https://n8n.srv1759554.hstgr.cloud/webhook/retirement-intake`, which is therefore **dead code and receives nothing**. If anyone believes an n8n workflow is processing retirement leads, it is not.

**Defect 2: `form_type` is hardcoded to `'retirement'`.**
`LandingForm.tsx:82` sets `form_type: 'retirement'` as a literal. The component is generic and named generically. Any future page reusing it will silently mislabel its leads. Today only RetirementPage uses it, so the data is accidentally correct, but the CRM's entire source attribution depends on this field and it must be derived from a prop.

**Defect 3: submissions report success even when they fail.**
Both forms use `mode: 'no-cors'`, which makes the response opaque: status code, headers, and body are all unreadable. `LandingForm.tsx:103` sets `submitted = true` immediately after the fetch resolves, and the `catch` block at line 105 **also** sets `submitted = true`. The result: if Apps Script is down, rate-limited, or erroring, the visitor sees the success screen and the lead is lost with no trace anywhere.

`Stock101Page.tsx` (lines 256 to 281) has the same shape.

**Required fix, before or alongside CRM ingestion:**
- Pass `webhookUrl` and `formType` through as props and use them.
- Move ingestion to a Supabase Edge Function that returns proper CORS headers, so `no-cors` is no longer needed and the response is readable.
- Show a real error state on failure, with the visitor's data preserved in the form so they can retry.
- Keep the Apps Script write as a secondary target so the Sheet remains a backup during migration.

Until Defect 3 is fixed, no measurement of "leads received" can be trusted, because the denominator is unknown.

### 7.2 Existing lead data in Google Sheets

**One-time import, not a sync.** Two-way sync between a spreadsheet and a database is a well-known trap: it needs conflict resolution, it needs a change-detection mechanism the Sheets API does not really provide, and it guarantees that "which one is right" becomes a daily question.

Process:
1. Export the sheet to CSV.
2. Run a Node script (`scripts/import-leads.ts`) that reads the CSV, normalizes phone numbers, maps the sheet's columns to the schema, and upserts on `email` with `source = 'import'` and `first_seen_at` taken from the sheet's timestamp column.
3. Every imported row gets a `lead_created` activity with `metadata.imported_from = 'google_sheets'` and the original row in `raw_payload`.
4. The script runs in dry-run mode by default, printing a diff and a count of would-be duplicates. It writes only with an explicit `--commit` flag.

After import, the Sheet becomes read-only history. It is not deleted, and it is not updated.

### 7.3 Form webhooks (Stock 101 and Retirement)

**Recommended architecture: Apps Script forwards to Supabase.**

```
Browser form
    |
    v
Google Apps Script  (unchanged endpoint, still writes the Sheet)
    |
    +--> Sheet row            (backup, unchanged)
    |
    +--> UrlFetchApp.fetch()  --> Supabase Edge Function /ingest-lead
                                       |
                                       +--> upsert leads
                                       +--> insert activities
                                       +--> Realtime broadcast
```

**Why forward from Apps Script rather than point the browser at Supabase directly:**
The public forms are the top of the revenue funnel. Changing where the browser posts is a change to live, working, revenue-generating code. Forwarding server-side adds the CRM without touching the browser path at all, and keeps the Sheet as a running backup. Once the CRM has been correct for a few weeks, migrate the browser to post directly and retire the forward.

**Apps Script addition:**

```javascript
function forwardToCrm(data) {
  UrlFetchApp.fetch('https://<project>.supabase.co/functions/v1/ingest-lead', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-webhook-secret': PropertiesService.getScriptProperties().getProperty('CRM_SECRET') },
    payload: JSON.stringify(data),
    muteHttpExceptions: true   // never let a CRM outage break the Sheet write
  });
}
```

**Edge Function `ingest-lead` contract:**

```
POST /functions/v1/ingest-lead
Header: x-webhook-secret: <shared secret, compared with timing-safe equality>

Body:
{
  "form_type": "stock101" | "retirement",
  "fullName":  string,   // required
  "email":     string,   // required
  "phone":     string,
  "ageRange":  string,   // retirement only
  "location":  string,
  "retirementSavings": string,  // retirement only
  "howHeard":  string
}

200 { "ok": true, "lead_id": "...", "created": true | false }
400 { "ok": false, "error": "..." }   // validation, Zod
401 { "ok": false, "error": "unauthorized" }
```

Behavior:
1. Verify the shared secret. Reject with 401 otherwise.
2. Validate with Zod. Reject with 400 and a field-level message.
3. Normalize email to lowercase, phone to E.164.
4. Map `form_type` to `source` and to the matching `program` value.
5. Upsert on `email`:
   - **New:** insert with `stage = 'new'`, write `lead_created`.
   - **Existing:** append the program if absent, fill any null qualification fields (never overwrite a value a rep has edited), write `form_resubmitted` with the full payload, bump `last_activity_at`. **Do not reset the stage.** A converted client filling a second form is not a new lead.
6. Store the full body in `raw_payload`.
7. Return 200. Apps Script ignores the response, but the status makes the function debuggable from a terminal.

**Idempotency:** Apps Script may retry. The upsert makes repeats safe, but add a guard so an identical payload within 60 seconds returns the existing lead without writing a second `form_resubmitted`.

### 7.4 WhatsApp: deep link only, and what that honestly means

WhatsApp integration is a **one-way deep link**. Clicking `WhatsApp` on a lead opens `https://wa.me/<phone_e164>?text=<encoded greeting>` in a new tab. That is the whole integration.

**What this cannot do, stated plainly so nobody plans around a capability that does not exist:**
- It cannot confirm the message was sent. The rep may close the tab.
- It cannot read replies.
- It cannot log conversation content.
- It cannot show whether the lead has read anything.

The `whatsapp_opened` activity therefore records exactly one fact: a rep clicked the button at a time. The UI must say "Opened WhatsApp", never "Messaged on WhatsApp", because the second is a claim the system cannot support and a rep would reasonably rely on.

**Getting real WhatsApp logging** requires the WhatsApp Cloud API: a Meta Business account, business verification (typically 1 to 3 weeks, and it can be rejected), a registered phone number that then **cannot be used in the normal WhatsApp app**, and pre-approved message templates for any conversation the business initiates. That last constraint is usually the deal-breaker for a coaching business whose whole approach is unscripted personal conversation, and it is why the deep link is the right answer, not just the cheap one.

`+2348184750870` is the number used across the public site. Confirm whether that is Titobi's personal WhatsApp before anyone considers the Cloud API, because registering it would take it out of normal use.

### 7.5 Chatbot: currently captures nothing

`src/components/ChatBot.tsx` is 327 lines of fully client-side scripted responder. It has a fixed `QUICK_REPLIES` list, a `RESPONSES` keyword map, and a fallback. **It contains no network call of any kind.** No fetch, no webhook, no storage.

"Main site chatbot" as a lead source therefore does not exist today. It must be built.

**Recommended minimum, roughly one day:** add a capture step. After the second bot response, offer "Want Titobi to reach out?" and collect name, email, and WhatsApp number in the chat surface. On submit, POST to the same `ingest-lead` function with `form_type: 'chatbot'` and the conversation transcript in the payload, which lands in `raw_payload` and gives the rep real context before the first contact.

Do not replace the scripted bot with an LLM in this project. It is a separate product decision with its own cost, latency, safety, and accuracy questions, and a coaching business giving unsupervised financial answers to strangers is a risk that needs its own conversation.

### 7.6 Email (Resend)

**Sending path:** client calls Edge Function `send-email` with the lead id, subject, and body, authenticated with the user's Supabase JWT. The function verifies the JWT, confirms the sender is an active profile, writes an `email_logs` row as `queued`, calls Resend, updates the row to `sent` with the Resend message id, and writes an `email_sent` activity. On failure it sets `failed` with the provider error and writes `email_failed`, so a failure is visible in the timeline rather than silent.

**Status path:** Resend webhook posts to Edge Function `resend-webhook`, verified via the Svix signature headers Resend sends. Events `email.delivered`, `email.opened`, `email.bounced`, and `email.complained` update the matching row by `provider_id`.

**DNS, the blocking dependency:** SPF, DKIM, and DMARC records on the sending domain. Whoever controls DNS for `titofinance` must add three to four records. Start this in Week 1. Until the domain is verified, every email either lands in spam or is rejected, and this is the most common reason a CRM email feature "does not work."

**Sending identity:** send from a real, monitored address (for example `titobi@titofinance.com`), with `Reply-To` set to the same. Never `noreply@`. A lead replying to a coaching email and hitting a black hole is worse than not sending.

---

## 8. Security and auth

### 8.1 Authentication

Supabase Auth, email plus password. No public signup: disable it in the Supabase dashboard so `signUp()` is rejected at the API even if a client calls it. Users exist only via Super Admin invite, which sends a Supabase invite email with a set-password link.

Password policy: minimum 12 characters, checked against Supabase's HaveIBeenPwned integration (enable it). No composition rules about symbols and digits; length and breach-checking do more real work.

Enable MFA for `super_admin` accounts. Supabase supports TOTP. For an account that can delete leads and change roles, this is proportionate.

### 8.2 Row-level security

RLS enabled on **every** table, with no exceptions and no `service_role` usage from the browser.

```sql
alter table profiles   enable row level security;
alter table leads      enable row level security;
alter table notes      enable row level security;
alter table activities enable row level security;
alter table tags       enable row level security;
alter table lead_tags  enable row level security;
alter table email_logs enable row level security;

-- Helper: is the caller an active super admin?
create or replace function is_super_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'super_admin' and is_active
  );
$$;

-- Helper: is the caller any active user?
create or replace function is_active_user() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and is_active);
$$;

-- LEADS
create policy leads_select on leads for select
  using (is_active_user() and deleted_at is null);

create policy leads_insert on leads for insert
  with check (is_active_user());

create policy leads_update on leads for update
  using (is_active_user() and deleted_at is null)
  with check (is_active_user());

-- Only super admins soft-delete, and they do it via a SECURITY DEFINER
-- function, never a direct DELETE. No delete policy exists at all.

-- NOTES
create policy notes_select on notes for select using (is_active_user());
create policy notes_insert on notes for insert with check (author_id = auth.uid() and is_active_user());
create policy notes_update on notes for update using (author_id = auth.uid() or is_super_admin());
create policy notes_delete on notes for delete using (author_id = auth.uid() or is_super_admin());

-- ACTIVITIES: readable by all active users, writable by NOBODY.
-- Triggers run as the table owner and bypass RLS; clients cannot write.
create policy activities_select on activities for select using (is_active_user());
-- No insert, update, or delete policy. Deliberate.

-- EMAIL LOGS: readable by all, written only by the Edge Function
-- (service role). No client insert policy.
create policy email_logs_select on email_logs for select using (is_active_user());

-- PROFILES
create policy profiles_select on profiles for select using (is_active_user());
create policy profiles_update_self on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()));
  -- the role check prevents self-promotion
create policy profiles_admin_all on profiles for all using (is_super_admin());
```

**The two policies that matter most:**

1. **`activities` has no write policy of any kind.** Not for reps, not for admins. Every activity row is written by a trigger or by the service role inside an Edge Function, both of which bypass RLS. An audit log a user can write is not an audit log.

2. **`profiles_update_self` re-checks `role` in its `WITH CHECK`.** Without that clause, any rep could `UPDATE profiles SET role = 'super_admin' WHERE id = auth.uid()` and the policy would permit it, because the row is theirs. This is the single most common RLS privilege-escalation bug and it is worth a test of its own.

### 8.3 Secrets

| Secret | Location | Never |
|---|---|---|
| Supabase anon key | Vite env, shipped to browser | Treated as secret. It is public by design; RLS is the actual boundary. |
| Supabase service role key | Edge Function env only | In any client code, any `VITE_` variable, or any commit |
| Resend API key | Edge Function env only | In client code |
| Webhook shared secret | Apps Script properties + Edge Function env | Hardcoded in a repo |

Any variable prefixed `VITE_` is inlined into the bundle and is public. Treat that prefix as meaning "publish this."

Add a CI check that greps the built `dist/` for known secret prefixes (`re_`, `sb_secret_`, `eyJ...service_role`) and fails the build on a hit.

### 8.4 Sessions

JWT expiry 1 hour, refresh token 7 days with rotation enabled. A rep signing in on Monday works through Friday without re-authenticating; a stolen refresh token stops working the moment the real user's client rotates it.

Sign-out revokes the refresh token server-side, not just locally.

Deactivating a user (`is_active = false`) takes effect on the next request, because every RLS policy calls `is_active_user()`. There is no window where a deactivated user keeps working until their token expires.

### 8.5 Other

- HTTPS only, enforced by Vercel.
- `X-Robots-Tag: noindex, nofollow` on every CRM response, plus a `robots.txt` disallowing everything. The CRM must never appear in a search result.
- CSP header restricting `connect-src` to the Supabase project origin.
- Rate limit `ingest-lead` at the Edge Function: 60 requests per minute per IP, returning 429 above it.
- Zod validation on every Edge Function input. Never trust a webhook body.

---

## 9. Build phases

Assumes one builder (Claude Code) with Titobi available for decisions and DNS access.

### Phase 1, Weeks 1 to 2: foundation and the working loop

**Goal:** A rep can log in, see leads, move them through the pipeline, and write notes. Leads are entered manually; no ingestion yet.

| # | Task | Est. |
|---|---|---|
| 1.1 | Vite + React 19 + TS + Tailwind + React Router scaffold, separate Vercel project | 0.5d |
| 1.2 | Supabase project, all enums, all seven tables, all indexes | 1d |
| 1.3 | All RLS policies, plus a test script that asserts a rep JWT cannot escalate role or write an activity | 1d |
| 1.4 | Triggers: `updated_at`, `last_activity_at`, activity writers, `converted_at`, phone normalization | 1d |
| 1.5 | Design tokens: colors, type scale, spacing, radii, shadows, motion (§10) | 0.5d |
| 1.6 | App shell: sidebar, top bar, content region, route guards, 403 surface | 1d |
| 1.7 | Login screen, auth flow, session handling | 0.5d |
| 1.8 | Lead inbox: table, cursor pagination, skeleton and three empty states | 1.5d |
| 1.9 | Lead profile: header, details panel, inline editing with optimistic rollback | 1.5d |
| 1.10 | Stage control, including the closed-lost reason path | 0.5d |
| 1.11 | Notes: compose, timeline render, author and time | 0.5d |
| 1.12 | Add lead drawer, including duplicate detection on email blur | 0.5d |
| 1.13 | **Start Resend DNS verification** (blocks Phase 2) | 0.25d + waiting |

**Milestone:** Titobi logs in, adds a lead by hand, moves it to `contacted`, writes a note, and reloads to find all of it intact.

### Phase 2, Week 3: ingestion, email, activity, dashboard

**Goal:** Leads arrive on their own. Reps can contact them from the CRM. Titobi can see the shape of the pipeline.

| # | Task | Est. |
|---|---|---|
| 2.1 | Edge Function `ingest-lead`: secret check, Zod validation, upsert, idempotency | 1d |
| 2.2 | Apps Script forwarding, deployed and verified against a real submission | 0.5d |
| 2.3 | **Fix Defects 1 to 3** in the public forms (§7.1) | 0.5d |
| 2.4 | Realtime subscription wired to query invalidation, with scroll anchoring | 0.5d |
| 2.5 | Edge Function `send-email` (Resend), `email_logs` write, activity write | 1d |
| 2.6 | Edge Function `resend-webhook`, signature verification, status updates | 0.5d |
| 2.7 | Email composer panel on the lead profile | 0.5d |
| 2.8 | WhatsApp deep link, E.164 normalization verified against all three input formats | 0.25d |
| 2.9 | Activity timeline rendering, interleaved with notes | 0.5d |
| 2.10 | Dashboard: five stats, two breakdowns, recent activity, empty state | 1d |
| 2.11 | Activity screen (all leads) | 0.25d |

**Milestone:** A real submission on the live Stock 101 form appears in the inbox within 10 seconds, tagged `Stock 101`, and a reply email sent from the CRM arrives in the lead's inbox and shows `Delivered` in the timeline.

### Phase 3, Week 4: tags, filtering, import, polish

**Goal:** The tool is fast to work in at 500 leads, and the history is in it.

| # | Task | Est. |
|---|---|---|
| 3.1 | Tags: seed, apply and remove, mutual exclusion for temperature, admin management | 0.75d |
| 3.2 | Search: tsvector query, debounced input, `⌘K` focus | 0.5d |
| 3.3 | Filter bar: six controls, AND across, OR within, clear-all | 1d |
| 3.4 | URL serialization of filter and search state | 0.5d |
| 3.5 | Google Sheets import script, dry-run first, then commit | 0.75d |
| 3.6 | Settings: user management (invite, role, deactivate) | 0.75d |
| 3.7 | Settings: email configuration status | 0.25d |
| 3.8 | CSV export of the filtered view (pulled forward from V2, it is half a day and high value) | 0.5d |
| 3.9 | Accessibility pass: focus rings everywhere, keyboard navigation through the table, contrast verification against §10.3 | 0.75d |
| 3.10 | Motion pass: apply the §10.5 budget, remove anything that fails the frequency gate | 0.5d |
| 3.11 | Error boundaries, offline state, session-expiry handling | 0.5d |
| 3.12 | Seed data, walkthrough with Titobi, fix list | 0.75d |

**Milestone:** Titobi and one assistant use the CRM as their only lead tool for a full working day, and the Sheet is not opened.

---

## 10. Design direction

### 10.0 Conflict resolution: which skill governs what

Nine skill files were loaded for this document. Applied uniformly they would produce an incoherent product, because several of them contradict each other on this specific brief. Two conflicts are structural and are resolved here explicitly.

**Conflict A: three of the skills exclude this product by their own terms.**

`design-taste-frontend` §13 "Out of scope" states that it is not for "dashboards / dense product UI / admin panels" and instructs: *"If the brief is one of the above, say so explicitly, point to the right tool, and only apply this skill's marketing-page parts to the surfaces where they apply."* This document does exactly that. A CRM is the canonical example of what that skill excludes.

`high-end-visual-design` targets Awwwards-tier agency work: double-bezel nested containers, `py-24` to `py-40` section padding, `rounded-[2rem]` radii, mandatory scroll-entry animation on every element. Every one of those is actively wrong for a table of 500 leads. `py-40` on a data screen means two rows visible per viewport.

`brandkit` generates brand-guidelines presentation boards. It is an image-generation skill and has no application to a functional UI. Its color-discipline principle ("one dominant palette, accents repeat across panels, one accent can carry the entire system") is the only part that transfers, and it agrees with the product register anyway.

**Resolution:** `impeccable`'s product register (§reference/product.md) governs the application. The brand-oriented skills govern exactly one surface, the login screen (§6.2), which is the only place a user is not in a task.

**Conflict B: the brief's motion direction conflicts with the motion skills' own gate.**

The brief asks for "smooth micro-animations on state changes." `emil-design-eng` and `find-animation-opportunities` both open with a frequency gate: 100+ views per day means *"No animation. Ever."* Tens per day means *"Remove or drastically reduce."* A rep uses the inbox and the stage control hundreds of times a day.

**Resolution:** motion is applied where it survives the gate, and only there. §10.5 lists what animates, and §10.6 lists what deliberately does not. The result is a smaller motion budget than the brief implies, and it is the reason the tool will feel fast.

**Conflict C: Cormorant Garamond in a product UI.**

The brief asks for Cormorant Garamond on headings. The product register bans "display fonts in UI labels, buttons, data" and observes that "one family is often right" for product UI. Both positions are defensible: brand fidelity matters for a tool the founder uses daily.

**Resolution:** Cormorant appears only at 24px and above, and only on the login panel and the dashboard page title. It never appears in a table header, a button, a label, a badge, an input, or any number. §10.4.

### 10.1 The design read

**Reading this as:** an internal, authenticated, high-frequency product tool for a two-to-five person sales team, with a brand-expressive login as the single exception. Leaning toward the product register: earned familiarity, cockpit density, and near-zero decorative motion.

**Dials**, using `design-taste-frontend`'s vocabulary for the surfaces where it applies:

| Dial | Value | Reasoning |
|---|---|---|
| `DESIGN_VARIANCE` | **2** | Consistency is the virtue here. A rep should never wonder what a screen does. Asymmetry costs recognition. |
| `MOTION_INTENSITY` | **2** | Forced by the frequency gate, not by taste. |
| `VISUAL_DENSITY` | **8** | Cockpit. Per that skill's own §4.4 and §7: at density above 7, card containers are banned and numbers use a mono face. Both follow. |

**Color strategy:** Restrained. Tinted neutrals plus a single accent used only for primary actions, current selection, and state.

**Scene sentence** (which forces the light or dark decision): *A rep sits at a desk in Lagos at 11am with daylight through the window, working a list for three hours straight while switching to a phone every few minutes.* Daylight and long reading sessions force a **light content surface**. The dark sidebar is structural chrome, not a theme.

**Anchor references:** Linear (density and restraint), Stripe Dashboard (data tables and status vocabulary), Notion (inline editing without modals).

### 10.2 Tokens

```css
:root {
  /* Surfaces */
  --bg-app:          #F8F5EE;  /* ivory, main content */
  --bg-surface:      #FFFFFF;  /* raised panels, inputs */
  --bg-sidebar:      #0D0B08;  /* near-black, structural chrome */
  --bg-hover:        #F1EDE3;  /* row hover, one step from bg-app */
  --bg-selected:     #EAE4D6;

  /* Ink */
  --ink-primary:     #0D0B08;  /* 18.05:1 on bg-app */
  --ink-secondary:   #5A5A52;  /*  6.39:1 on bg-app, passes AA body */
  --ink-muted:       #6B6B6B;  /*  4.89:1 on bg-app, passes AA body */
  --ink-inverse:     #F8F5EE;  /* 11.61:1 on bg-forest */

  /* Brand */
  --forest:          #1A3A16;  /* primary action fill */
  --forest-hover:    #245020;
  --gold:            #C9A84C;  /* accent, see §10.3 for where it may NOT go */

  /* Semantic state */
  --state-success:   #2D6A3E;
  --state-warning:   #8A6A16;
  --state-danger:    #8C2F22;
  --state-info:      #2C5670;

  /* Lines */
  --line-hairline:   rgba(13, 11, 8, 0.08);
  --line-strong:     rgba(13, 11, 8, 0.16);
  --line-focus:      #1A3A16;

  /* Radii: one scale, no exceptions */
  --radius-sm:  4px;   /* badges, inputs, buttons */
  --radius-md:  8px;   /* panels, drawers, popovers */
  --radius-full: 9999px; /* avatar only */

  /* Motion */
  --dur-instant: 100ms;  /* press feedback */
  --dur-fast:    150ms;  /* hover, focus, badge change */
  --dur-base:    200ms;  /* dropdown, popover */
  --dur-slow:    250ms;  /* drawer */
  --ease-out:    cubic-bezier(0.23, 1, 0.32, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);

  /* Z-index: a named scale, never an arbitrary number */
  --z-sticky:  10;
  --z-dropdown: 20;
  --z-scrim:   30;
  --z-drawer:  40;
  --z-toast:   50;
}
```

**Shape lock:** every interactive element uses `--radius-sm` (4px), every container uses `--radius-md` (8px). Nothing in this application is more rounded than 8px. The main site's marketing components use 12px to 24px radii; that is correct there and wrong here. Large radii on dense data read as toy-like and waste horizontal space at every cell edge.

**No shadow scale.** At this density, elevation is communicated by hairlines and background steps. Shadows appear on exactly two elements: the drawer and dropdown popovers, both `0 4px 16px rgba(13,11,8,0.10)`. The product register's ban on the ghost-card pattern (1px border plus a wide soft shadow on the same element) applies: pick a border or a shadow, never both.

### 10.3 Color, with measured contrast

Every ratio below was computed against the actual hex values, not estimated.

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `--ink-primary` #0D0B08 | `--bg-app` #F8F5EE | **18.05:1** | AAA |
| `--ink-secondary` #5A5A52 | `--bg-app` | **6.39:1** | AA body, AAA large |
| `--ink-muted` #6B6B6B | `--bg-app` | **4.89:1** | AA body, minimum acceptable |
| `--forest` #1A3A16 | `--bg-app` | **11.61:1** | AAA |
| `--ink-inverse` #F8F5EE | `--forest` #1A3A16 | **11.61:1** | AAA, primary button |
| `--gold` #C9A84C | `--bg-sidebar` #0D0B08 | **8.60:1** | AAA |
| `--gold` #C9A84C | `--forest` #1A3A16 | **5.53:1** | AA |
| **`--gold` #C9A84C** | **`--bg-app` #F8F5EE** | **2.10:1** | **FAILS. Never ship this pair.** |

**The gold rule, stated as a hard constraint because it is the most likely mistake in this build:**

Gold at #C9A84C on ivory measures 2.10:1. WCAG AA requires 4.5:1 for body text and 3:1 for large text. It fails both. Gold text on the ivory content area is not a close call and not a judgment call.

Where gold **may** be used:
- Text and indicators on the dark sidebar (8.60:1)
- As a **fill** behind dark ink, for example a badge with `--ink-primary` text on a gold background
- As a bar fill, border, underline, or 2px active indicator, where it is a graphical element rather than text
- On the forest panel of the login screen (5.53:1)

Where gold **may not** be used:
- Any text on `--bg-app` or `--bg-surface`
- Any icon that carries meaning on a light background
- Focus rings on light surfaces (use `--forest`, 11.61:1)

The brief calls for "gold accents for CTAs and active states." On the sidebar, that works exactly as intended. On the light content area, the primary CTA is a **forest fill with ivory text** at 11.61:1, and gold appears as the 2px active indicator instead. This preserves the brand read and passes AA everywhere.

**Status badge vocabulary.** Every badge is a tinted background with dark ink, never a saturated fill with light text, because at 11px a saturated fill is a bright rectangle that pulls the eye away from the data.

| Stage | Background | Text |
|---|---|---|
| New | `rgba(44,86,112,0.12)` | `--state-info` |
| Contacted | `rgba(13,11,8,0.06)` | `--ink-secondary` |
| Nurturing | `rgba(138,106,22,0.14)` | `--state-warning` |
| Session booked | `rgba(201,168,76,0.22)` | `--ink-primary` |
| Converted | `rgba(45,106,62,0.14)` | `--state-success` |
| Closed lost | `rgba(140,47,34,0.10)` | `--state-danger` |

Tag temperature uses the same construction: `Hot` on the danger tint, `Warm` on the warning tint, `Cold` on the info tint. Region tags (`Nigeria`, `Diaspora`) and `Follow-up` use the neutral tint. Six tags do not need six colors; that is decoration wearing a semantics costume.

### 10.4 Typography

Two families, with a strict boundary.

**DM Sans** carries the entire application: headings, buttons, labels, table cells, body, badges. **DM Mono** carries every number that a user compares or scans: stat values, counts, relative times, dates, phone numbers, percentages. Mono for numbers is not stylistic; it gives tabular figures, so a column of numbers aligns and a live-updating counter does not shift width.

**Cormorant Garamond** appears in exactly two places: the login panel line (§6.2) and the dashboard page title. Both at 24px or larger. Nowhere else, ever. It is a brand signature, not a UI face, and Cormorant at 13px in a table header is unreadable and looks like a mistake.

Fixed rem scale, not `clamp()`. Product users work at consistent DPI, and a fluid heading that shrinks inside a panel looks worse, not better.

| Token | Size | Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|
| `display` | 32px | 500 | 1.15 | -0.02em | Cormorant. Login line, dashboard title. |
| `stat` | 32px | 500 | 1.1 | -0.01em | DM Mono. Dashboard numbers. |
| `h1` | 20px | 600 | 1.3 | -0.01em | Screen titles |
| `h2` | 16px | 600 | 1.4 | 0 | Section headings |
| `body` | 14px | 400 | 1.5 | 0 | Default. Table cells, notes. |
| `body-medium` | 14px | 500 | 1.5 | 0 | Lead names, emphasis |
| `small` | 13px | 400 | 1.45 | 0 | Secondary line under a name |
| `label` | 11px | 500 | 1.3 | 0.08em | Uppercase. Table headers, field labels. |
| `mono-sm` | 12px | 400 | 1.4 | 0 | DM Mono. Times, counts, phone. |

Scale ratio is roughly 1.15, which is the tight ratio the product register calls for. Exaggerated type contrast creates noise on a screen with this many distinct text elements.

Tracking is size-specific, per the Apple typography guidance: negative at display sizes, zero at body, positive only on the 11px uppercase label where letterforms need the air.

**Copy rules for every visible string:**
- Zero em-dashes and zero en-dashes. Use a comma, a period, a colon, or a hyphen. This applies to headings, labels, buttons, badges, empty states, error messages, tooltips, and email templates.
- Labels name their contents, not a vague umbrella. "Leads", not "Home". "In New over 48h", not "Attention needed".
- Errors are specific and actionable. "No account found for that email", not "Login failed". "WhatsApp needs a phone number for this lead", not "Unavailable".
- No uppercase tracked eyebrow above every section. The 11px uppercase label exists for table headers and field labels, which is a functional use, not a decorative kicker.

### 10.5 Motion: what animates

Everything below passes all four gates: frequency, named purpose, duration budget, and function.

| Element | Motion | Duration and curve | Purpose |
|---|---|---|---|
| Any pressable element | `transform: scale(0.97)` on `:active` | 100ms `--ease-out` | Feedback. On pointer-down, not on release. |
| Row hover | Background to `--bg-hover` | 150ms `ease` | Feedback |
| Focus ring | Opacity and ring width | 150ms `--ease-out` | Feedback, accessibility |
| Stage badge change | Cross-fade between old and new label | 150ms `ease` | State indication. Not a slide: the badge does not move. |
| Dropdown, popover | `opacity 0 to 1`, `scale(0.97) to 1`, origin at the trigger | 200ms `--ease-out` | Spatial consistency |
| Add-lead drawer | `translateX(100%) to 0` | 250ms `--ease-drawer` | Spatial consistency. Exits the same edge. |
| Email composer panel | `translateY(100%) to 0` | 250ms `--ease-drawer` | Spatial consistency. Exits the same edge. |
| New note appearing | `opacity 0 to 1`, `translateY(-4px) to 0` | 200ms `--ease-out` | Preventing a jarring change |
| New realtime lead row | Background flash from gold at 12% to transparent | 400ms `ease-out` | Preventing a jarring change. Once, then never again for that row. |
| Skeleton loading | Shimmer sweep | 1200ms linear loop | Perceived performance |
| Toast (errors only) | `translateY(100%) to 0`, exits the same edge | 250ms `--ease-out` | Preventing a jarring change |

**Rules that apply to all of the above:**
- `transform` and `opacity` only. Never `width`, `height`, `top`, or `left`.
- CSS transitions, never keyframes, for anything that can retrigger quickly (rows, badges, toasts). Keyframes restart from zero on interruption; transitions retarget from their current value.
- Never `scale(0)`. Entrances start at `scale(0.97)` with opacity, because nothing in the physical world appears from nothing.
- Popovers use `transform-origin` at their trigger. Modals and the drawer are exempt; they are not anchored to a point.
- Hover motion is gated behind `@media (hover: hover) and (pointer: fine)`, so a tap on a touch device does not trigger a stuck hover state.
- Exit is faster than enter, roughly 60% of the duration. The user has already decided; the system should get out of the way.
- `prefers-reduced-motion: reduce` replaces every transform with an opacity cross-fade at 150ms. It does not remove feedback: reduced motion means gentler, not absent.

### 10.6 Motion: what deliberately does not animate

This list is as much a specification as the previous one, and it is the harder half to hold.

| Element | Why not |
|---|---|
| Search input, `⌘K` focus | Keyboard-initiated, hundreds of times a day. Never animate a keyboard action. |
| Route changes between the four nav screens | Navigation used 100+ times a day. A page transition adds latency to the most repeated action in the app. |
| Table rows on initial load | A staggered entrance on 50 rows delays first read by 400ms, every single load. |
| Inline field edit entering edit mode | Used dozens of times per lead. Instant is correct. |
| Dashboard numbers on load | A count-up animation makes the reader wait to learn a number they came to read. |
| Filter application | The rep is mid-thought. Results should be there. |
| Sidebar nav active indicator | Used constantly. The indicator moves instantly. |
| Any scroll-triggered reveal, anywhere | This is a tool, not a page. Content is visible on arrival. |

**No orchestrated page-load sequence exists anywhere in this application.** The product loads into a task. Nobody wants to watch it arrive.

### 10.7 Component states

Every interactive component ships with all seven states: default, hover, focus-visible, active, disabled, loading, error. Shipping four of them is shipping a broken component.

- **Loading** is a skeleton matching the exact final layout shape, never a spinner centered in a content area. Skeleton rows use the exact final row height so nothing shifts.
- **Empty** states teach. Each of the three inbox empty states (§6.4) says something different and offers a next action.
- **Error** is inline and adjacent to its cause. Toasts are reserved for transient failures with no on-screen anchor, such as a lost connection.
- **Disabled** always carries a reason on hover. A disabled WhatsApp button says "No phone number on this lead."
- **Focus-visible** is a 2px `--forest` ring at 2px offset on every interactive element, including table rows. The table is keyboard-navigable: arrow keys move the row selection, Enter opens the profile.

### 10.8 The product slop test

The test for this build is not "would someone say AI made this." Familiarity is a feature here.

The test is: **would someone fluent in Linear, Stripe, and Notion sit down at this and trust it, or pause at every subtly-off component?**

Failure modes to watch for, in the order they are most likely to appear:
1. Cormorant Garamond leaking into a table header, button, or badge.
2. Gold text on the ivory content area.
3. A modal used where inline editing belongs.
4. Card wrappers around dashboard stats.
5. Two buttons that do the same thing looking different on two screens.
6. Radii above 8px on a data container.
7. A `border: 1px solid` and a wide `box-shadow` on the same element.
8. Decorative motion that survived the frequency gate by not being checked against it.

---

## 11. Estimated timeline and effort

### 11.1 The honest assessment

**The MVP in §3.1 is achievable in four weeks.** It is roughly 26 to 30 working days of estimated tasks against 20 working days, which sounds impossible and is not, because Claude Code compresses the mechanical parts (schema DDL, RLS policies, table components, form wiring, CRUD) far more than it compresses the parts that need judgment.

**What Claude Code compresses well, roughly 3 to 5x:**
Schema and migrations, RLS policy authoring, TypeScript types from schema, table and list components, form wiring with validation, Edge Function boilerplate, empty and loading states, CRUD plumbing.

**What it compresses barely at all, roughly 1x:**
- **DNS propagation for Resend.** Hours to a day, and it is wall-clock time, not work time. This is why §9 starts it in Week 1.
- **Debugging RLS.** Policy bugs present as "the query returns zero rows" with no error, and they need methodical isolation.
- **Getting the Apps Script forward working against a live endpoint.** Apps Script's debugging story is poor.
- **Design judgment.** Deciding that gold cannot go on ivory, that a modal is wrong here, that this motion fails the frequency gate. Each is a small decision and there are hundreds.
- **Titobi's review cycles.** Feedback is wall-clock time.

**The three genuine risks, in order of likelihood:**

1. **DNS access.** If nobody can add records to the `titofinance` domain quickly, email sending slips out of Phase 2 entirely. Mitigation: start Week 1, day 1. This is the single highest-probability schedule risk and it is not a coding problem.
2. **Scope creep at the demo.** Titobi sees the working inbox in Week 2 and asks for reminders, a mobile view, and bulk email. All three are V2. Mitigation: §3.2 exists so those requests have a written home rather than a negotiation.
3. **Sheet data quality.** The import in Phase 3 assumes reasonably consistent columns. If the existing sheet has merged cells, inconsistent date formats, and free-text in the location column, the import script grows from half a day to two days. Mitigation: look at the actual sheet in Week 1, not Week 4.

### 11.2 What is not in four weeks

Stated plainly so nobody discovers it in Week 4:

- **WhatsApp message logging.** Not a scope decision, a platform one. Meta Business verification alone is 1 to 3 weeks and can be rejected (§7.4).
- **A native mobile app.** V2-7 is a responsive breakpoint set, not an app. An App Store build is a separate project with its own review cycle.
- **Bulk email.** Buildable, but shipping an untested bulk sender against a real list risks the sending domain's reputation. It needs a week of its own with rate limiting and a dry-run mode.
- **An LLM chatbot.** §7.5. Separate product decision with its own risk profile.
- **Two-way Google Sheets sync.** Not deferred, rejected (§7.2).
- **Reporting beyond the five dashboard numbers.** Cohort analysis and trend lines need a few months of data before they say anything true.

### 11.3 Effort summary

| Phase | Working days | Cumulative | Ships |
|---|---|---|---|
| Phase 1 | 10 | Week 2 | Auth, inbox, pipeline, notes, manual entry |
| Phase 2 | 6 | Week 3 | Ingestion, realtime, email, activity, dashboard |
| Phase 3 | 7 | Week 4 | Tags, search, filters, import, settings, export, polish |
| **Total** | **23** | **4 weeks** | Full MVP |

Twenty-three estimated days into twenty available. The three-day gap is the buffer, and it is thinner than it should be. If something must be cut to protect the date, cut in this order: CSV export (3.8), the Activity screen (2.11), and the Sheets import (3.5), which can run any time after launch without blocking daily use.

---

## 12. Decisions needed before Week 1

Six items. Each blocks something specific.

| # | Decision | Blocks | Recommendation |
|---|---|---|---|
| 1 | Who controls DNS for the sending domain, and can they add records this week? | All of Phase 2 email | Resolve on day 1 |
| 2 | Which address does the CRM send from? | Email templates, Resend setup | `titobi@titofinance.com`, monitored, with `Reply-To` the same. Never `noreply@`. |
| 3 | Is `+2348184750870` Titobi's personal WhatsApp? | Any future Cloud API decision | If yes, the Cloud API is off the table without a second number |
| 4 | CRM subdomain | Vercel project setup | `crm.titofinance.com` |
| 5 | Can we see the existing Google Sheet in Week 1? | Import estimate accuracy (§11.1 risk 3) | Yes, before Phase 3 planning |
| 6 | Is the n8n instance at `n8n.srv1759554.hstgr.cloud` in use for anything else? | Whether to remove the dead reference or wire it up | It currently receives nothing (§7.1 Defect 1) |

Everything else in this document is decided. Where a question had an obvious default, the default was chosen and written down rather than listed here.

---

## Appendix A: Environment variables

```bash
# Client, PUBLIC, inlined into the bundle
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>

# Edge Functions only, NEVER prefixed VITE_
SUPABASE_SERVICE_ROLE_KEY=<service role key>
RESEND_API_KEY=<re_...>
RESEND_WEBHOOK_SECRET=<svix signing secret>
INGEST_WEBHOOK_SECRET=<generated, also set in Apps Script properties>
CRM_FROM_EMAIL=titobi@titofinance.com
```

## Appendix B: Route map

| Route | Screen | Access |
|---|---|---|
| `/login` | Login | Public |
| `/` | Redirect to `/dashboard` | Authenticated |
| `/dashboard` | Dashboard | Authenticated |
| `/leads` | Lead inbox (filters in query string) | Authenticated |
| `/leads/:id` | Lead profile | Authenticated |
| `/activity` | All-lead activity feed | Authenticated |
| `/settings/users` | User management | `super_admin` |
| `/settings/email` | Email configuration | `super_admin` |
| `*` | Not found | Any |

## Appendix C: Edge Functions

| Function | Auth | Purpose |
|---|---|---|
| `ingest-lead` | Shared secret header | Receives form and chatbot submissions, upserts leads |
| `send-email` | User JWT | Sends via Resend, writes `email_logs` and activity |
| `resend-webhook` | Svix signature | Updates delivery status on `email_logs` |
| `soft-delete-lead` | User JWT, admin check inside | Sets `deleted_at`, writes activity |
| `invite-user` | User JWT, admin check inside | Creates the auth user and the profile |
