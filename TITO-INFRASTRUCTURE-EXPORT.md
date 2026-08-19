# TITO INFRASTRUCTURE EXPORT

**Generated:** 2026-08-16
**Purpose:** Extraction and assessment for a reader deciding which parts of a separate lead-conversion pipeline can be ported onto this codebase.
**Method:** Static read of both trees. Nothing was executed against the live database except two read-only PostgREST probes (noted in §9).

## SCOPE NOTE

This is **two repositories, one system**:

| Repo | Path | Role |
|---|---|---|
| `titofinance` | `/Users/mac/Downloads/titofinance-main` | Public marketing site. Owns the two lead-capture forms and the chatbot. |
| `tito-crm` | `/Users/mac/Downloads/tito-crm` | Authenticated internal CRM. Owns Supabase, all schema, all metrics. |

The sections the brief asks for split across both: §3 (ingest) is almost entirely `titofinance`; §2, §4, §5, §6, §7 are almost entirely `tito-crm`. Both are documented.

---

## ⚠ SECRETS FOUND COMMITTED IN THE TREE

Four items are hardcoded in source rather than read from env. None is a private key; all four are **capability URLs** — possession of the URL is the authorisation.

| # | Value | File:line | Type | Assessment |
|---|---|---|---|---|
| 1 | `https://script.google.com/macros/s/[REDACTED — Apps Script deployment ID]/exec` | `titofinance/src/components/landing/LandingForm.tsx:95` | Unauthenticated write endpoint | Anyone with this URL can POST arbitrary lead rows into the sheet. No secret header, no origin check possible (`no-cors`). |
| 2 | Same URL as #1 | `titofinance/src/pages/Stock101Page.tsx:268` | Unauthenticated write endpoint | Duplicated literal, not a shared constant. |
| 3 | Same URL as #1 | `tito-crm/src/pages/Settings.tsx:22-23` (`SHEETS_SYNC_URL`) | Unauthenticated write endpoint | Same deployment serves both ingest and the CRM→Sheets push. |
| 4 | `https://n8n.srv1759554.hstgr.cloud/webhook/retirement-intake` | `titofinance/src/pages/RetirementPage.tsx:1019` | Webhook endpoint | **Dead.** Passed as a prop that is never read (§9 D-1). Receives nothing. |

**Not committed, correctly:** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are read from `import.meta.env` (`tito-crm/src/lib/supabase.ts:3-4`). `.env.local` is covered by `.gitignore:34` (`.env*`). No service-role JWT, no Resend key, no webhook shared secret exists anywhere in either tree.

**Anon key note:** the Supabase anon key is public by design and is shipped in the bundle. It is not a secret. RLS is the actual boundary (§7).

---

# 1. TREE AND STACK

## 1.1 `titofinance` (marketing site)

Excludes `node_modules`, `.git`, `dist`, `.agents`, `*.lock`.

| Lines | Path | Type | Purpose |
|---|---|---|---|
| 35 | `index.html` | HTML | Vite entry; Google Fonts, Meta Pixel script in `<head>`, pixel `<noscript>` in `<body>`. |
| 39 | `package.json` | config | Deps and scripts. |
| 13 | `vite.config.ts` | config | Vite + React plugin. |
| 5 | `vercel.json` | config | SPA rewrite, all paths → `/index.html`. |
| 9 | `tailwind.config.ts` | config | Tailwind v3 config. |
| 6 | `postcss.config.js` | config | Tailwind + autoprefixer. |
| 37 | `src/main.tsx` | TSX | Router; routes `/`, `/stock-101`, `/retirement`. |
| 65 | `src/App.tsx` | TSX | Home page section composition. |
| 189 | `src/index.css` | CSS | Global tokens and base styles. |
| 184 | `src/App.css` | CSS | Home-page-specific styles. |
| 327 | `src/components/ChatBot.tsx` | TSX | Scripted keyword responder. **No network call of any kind.** |
| 207 | `src/components/Navbar.tsx` | TSX | Main nav, desktop links + mobile overlay. |
| 250 | `src/components/Footer.tsx` | TSX | Footer nav, Kit (ConvertKit) newsletter POST, socials. |
| 376 | `src/components/ServicesSection.tsx` | TSX | Six programme cards, each CTA a `wa.me` link. |
| 259 | `src/components/GDRSection.tsx` | TSX | GDR strategy explainer. |
| 154 | `src/components/HeroSection.tsx` | TSX | Home hero. |
| 235 | `src/components/TestimonialsSection.tsx` | TSX | Testimonial cards. |
| 187 | `src/components/DarkQuoteSection.tsx` | TSX | Quote block + CTA. |
| 150 | `src/components/StorySection.tsx` | TSX | Founder story. |
| 107 | `src/components/DifferentiatorsSection.tsx` | TSX | Approach points. |
| 159 | `src/components/FreeResources.tsx` | TSX | Resource links. |
| 66 | `src/components/InstitutionsRow.tsx` | TSX | Logo row. |
| 55 | `src/components/CredentialMarquee.tsx` | TSX | Marquee strip. |
| 58 | `src/components/WhoItsForSection.tsx` | TSX | Audience block + CTA. |
| 51 | `src/components/FinalCTA.tsx` | TSX | Closing CTA. |
| **228** | **`src/components/landing/LandingForm.tsx`** | **TSX** | **Retirement lead-capture form. The ingest surface. See §3.** |
| 114 | `src/components/landing/LandingNav.tsx` | TSX | Landing-page nav. |
| 87 | `src/components/landing/LandingFaq.tsx` | TSX | Landing FAQ. |
| 70 | `src/components/landing/ModuleRows.tsx` | TSX | Curriculum rows. |
| 36 | `src/components/landing/PullText.tsx` | TSX | Pull-quote. |
| 29 | `src/components/landing/useReveal.ts` | TS | IntersectionObserver reveal hook. |
| 261 | `src/components/landing/landing.css` | CSS | Landing styles. |
| 184 | `src/components/ui/RetirementShaderCards.tsx` | TSX | Paper-shaders cards. |
| 208 | `src/components/ui/ScrollFaqAccordion.tsx` | TSX | Scroll-driven FAQ. |
| 386 | `src/components/ui/WorldMap.tsx` | TSX | Dotted-map visual. |
| 116 | `src/hooks/useAnimations.ts` | TS | GSAP scroll animations. |
| **1421** | **`src/pages/Stock101Page.tsx`** | **TSX** | **Stock 101 landing page. Contains its own inline `RegisterForm`. See §3.** |
| **1635** | **`src/pages/RetirementPage.tsx`** | **TSX** | **Retirement landing page. Renders `LandingForm`. See §3.** |
| 1457 | `tito-finance-crm-prd.md` | MD | Design document. Not executable. |
| 32 | `README.md` | MD | Setup notes. |

### Framework and runtime dependencies

React `^19.2.7` · Vite `^8.1.1` · TypeScript `~6.0.2` · Tailwind `^3.4.19`

| Package | Version | Used for |
|---|---|---|
| `react`, `react-dom` | ^19.2.7 | UI runtime |
| `react-router-dom` | ^7.18.1 | 3 routes in `main.tsx` |
| `framer-motion` | ^12.42.2 | Scroll/entrance animation on landing pages |
| `gsap`, `@gsap/react` | ^3.15.0 / ^2.1.2 | `useAnimations.ts` scroll choreography |
| `split-type` | ^0.3.4 | Per-character heading animation |
| `@paper-design/shaders-react` | ^0.0.78 | `RetirementShaderCards` |
| `dotted-map` | ^3.1.0 | `WorldMap` |
| `@radix-ui/react-accordion` | ^1.2.20 | FAQ accordion |
| `lucide-react` | ^1.24.0 | Icons |
| `react-icons` | ^5.7.0 | Brand icons (`FaWhatsapp`) |

## 1.2 `tito-crm` (CRM)

Excludes `node_modules`, `.git`, `dist`, `.agents`, `*.lock`.

| Lines | Path | Type | Purpose |
|---|---|---|---|
| 41 | `index.html` | HTML | Vite entry. Carries `<meta name="robots" content="noindex, nofollow">` (line 26). |
| 39 | `package.json` | config | Deps and scripts. |
| 11 | `vite.config.ts` | config | Vite + React + Tailwind v4 plugin. |
| 5 | `vercel.json` | config | SPA rewrite only. **No headers block.** |
| 124 | `src/main.tsx` | TSX | Router, QueryClient, route guards, lazy boundaries. |
| 627 | `src/index.css` | CSS | Tailwind v4 `@theme`, role tokens, light/dark, motion keyframes. |
| 22 | `src/lib/supabase.ts` | TS | Supabase client. Throws at startup if env missing. |
| **353** | **`src/lib/metrics.ts`** | **TS** | **Pure derivation layer. See §4.** |
| 77 | `src/lib/sparkline.ts` | TS | Pure SVG sparkline geometry + daily bucketing. |
| 244 | `src/lib/chartHelpers.ts` | TS | Pure SVG path/area/donut/bar geometry. |
| 114 | `src/lib/constants.ts` | TS | Stage/source/program/tag label + badge style tables. |
| 104 | `src/lib/chartColors.ts` | TS | JS mirror of the themed palette for SVG fills. |
| 73 | `src/lib/csv.ts` | TS | `leadsToCsv`, `downloadCsv`. Client-side export. |
| 110 | `src/lib/utils.ts` | TS | `cn`, `normalizePhone`, `whatsappLink`, time formatters, `authErrorMessage`. |
| 134 | `src/types/database.ts` | TS | Hand-written row types mirroring the schema. |
| 110 | `src/stores/authStore.ts` | TS | Zustand: session, user, profile, `signIn`, `signOut`, `initialize`. |
| 68 | `src/stores/themeStore.ts` | TS | Light/dark persistence. |
| 36 | `src/stores/toastStore.ts` | TS | Transient toast state. |
| 86 | `src/hooks/useScoreboard.ts` | TS | **The single dashboard fetch.** 3 reads, one cache key. |
| 294 | `src/hooks/useLeads.ts` | TS | List query + `useAddLead`, `useBulkUpdateStage`, `useBulkAddTag`, `useFindLeadByEmail`, `useCrmUsers`. |
| 228 | `src/hooks/useLead.ts` | TS | Detail query + `useAddNote`, `useUpdateStage`, `useUpdateLeadField`, `useToggleTag`, `useLogEmail`. |
| 89 | `src/hooks/useLeadsRealtime.ts` | TS | Postgres realtime subscription → query invalidation. |
| 55 | `src/hooks/useDashboardStats.ts` | TS | Legacy aggregate. Now only used by `ContextPanel`. |
| 38 | `src/hooks/useRecentActivity.ts` | TS | Recent activity join. Only used by `ContextPanel`. |
| 58 | `src/hooks/useTeam.ts` | TS | `useTeam`, `useSetDeactivated`. |
| 64 | `src/pages/Dashboard.tsx` | TSX | Role split wrapper + admin page frame. |
| 749 | `src/pages/Leads.tsx` | TSX | Lead inbox: table, filters, bulk actions, CSV export. |
| 720 | `src/pages/LeadDetail.tsx` | TSX | Lead profile: timeline, inline edit, WhatsApp, soft delete. |
| 349 | `src/pages/Login.tsx` | TSX | Email/password sign-in. |
| 464 | `src/pages/Settings.tsx` | TSX | Team table, invite modal, Sheets sync. Admin only. |
| 78 | `src/pages/RepDashboard.tsx` | TSX | Admin drill-down into one rep. |
| 716 | `src/components/dashboard/CommandCenter.tsx` | TSX | Admin: stat band, alert row, roster, source table, scope switcher. |
| 480 | `src/components/dashboard/MyDashboard.tsx` | TSX | Rep: stat band, queue, pipeline, recent. |
| 323 | `src/components/dashboard/ChartCards.tsx` | TSX | Hand-rolled SVG area/bar/donut cards. |
| 227 | `src/components/dashboard/StatCards.tsx` | TSX | `CountUp`, `PrimaryCard`, `SecondaryCard`, motion variants. |
| 92 | `src/components/dashboard/PipelineBar.tsx` | TSX | Stacked stage bar. |
| 61 | `src/components/dashboard/RepSwitcherStrip.tsx` | TSX | Rep pills on the drill-down. |
| 385 | `src/components/layout/AppShell.tsx` | TSX | 3-column shell, top bar, sidebar, realtime, bell, theme toggle. |
| 260 | `src/components/layout/ContextPanel.tsx` | TSX | Right rail on `/leads`. |
| 48 | `src/components/layout/ProtectedRoute.tsx` | TSX | `ProtectedRoute`, `AdminRoute`. |
| 243 | `src/components/AddLeadModal.tsx` | TSX | Manual lead creation. |
| 112 | `src/components/EmailModal.tsx` | TSX | `mailto:` composer. |
| 204 | `src/components/ui/primitives.tsx` | TSX | Button, Input, Skeleton, EmptyState, FieldError. |
| 94 | `src/components/ui/badges.tsx` | TSX | `StageBadge`, `SourceBadge`, `ScoreBadge`, `TagChip`. |
| 72 | `src/components/ui/Modal.tsx` | TSX | Radix Dialog wrapper. |
| 47 | `src/components/ui/Toast.tsx` | TSX | Toast. |
| 42 | `src/components/ui/AnimatedBorderButton.tsx` | TSX | Conic-gradient border CTA. |
| 213 | `supabase/migrations/0001_phase1_schema.sql` | SQL | §2. |
| 45 | `supabase/migrations/0002_leads_soft_delete.sql` | SQL | §2. |
| 115 | `supabase/migrations/0003_phase2_triggers_and_users.sql` | SQL | §2. |
| 42 | `supabase/migrations/0004_phase3_followup_and_search.sql` | SQL | §2. |
| 91 | `supabase/migrations/0005_phase4_scoring_and_whatsapp.sql` | SQL | §2. |
| 121 | `supabase/migrations/0006_login_activity_and_invites.sql` | SQL | §2. |
| 70 | `supabase/migrations/0007_last_activity_and_scoreboard.sql` | SQL | §2. |
| 141 | `README.md` | MD | Setup + migration order. |

### Framework and runtime dependencies

React `^19.2.8` · Vite `^8.2.0` · TypeScript `~6.0.2` · Tailwind `^4.3.3` (CSS-first, no `tailwind.config.js`)

| Package | Version | Used for |
|---|---|---|
| `react`, `react-dom` | ^19.2.8 | UI runtime |
| `react-router-dom` | ^7.18.2 | Routing, route guards |
| `@supabase/supabase-js` | ^2.112.2 | **Only** network client in the app. Auth, PostgREST, Realtime. |
| `@tanstack/react-query` | ^5.101.4 | All server state |
| `zustand` | ^5.0.14 | Session, theme, toast, fresh-lead set |
| `date-fns` | ^4.4.0 | Every date computation in `metrics.ts` and `utils.ts` |
| `framer-motion` | ^13.1.0 | `StatCards` / `ChartCards` entrance + count-up |
| `@radix-ui/react-dialog` | ^1.1.23 | `Modal` |
| `@radix-ui/react-select` | ^2.3.7 | Select controls |
| `@radix-ui/react-dropdown-menu` | ^2.1.24 | Row/bulk menus |
| `lucide-react` | ^1.30.0 | Icons |
| `clsx` + `tailwind-merge` | ^2.1.1 / ^3.6.0 | `cn()` |
| `@tailwindcss/vite`, `tailwindcss` | ^4.3.3 | Styling |

**There is no charting library.** `recharts` was removed; all charts are hand-rolled SVG in `chartHelpers.ts` + `ChartCards.tsx` + `sparkline.ts`.

---

# 2. STATE MODEL

## 2.1 Migrations, verbatim, in order

### `0001_phase1_schema.sql`

```sql
-- Tito Finance CRM, Phase 1 schema
-- Run this in the Supabase SQL editor of the "tito-finance-crm" project.
--
-- ONE CORRECTION was made to the schema as supplied in the build brief.
-- See the comment on crm_users.id below. Everything else is as specified.

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- crm_users (CRM operators, not website visitors)
-- ---------------------------------------------------------------------------
-- CORRECTION: id references auth.users(id) instead of defaulting to a fresh
-- uuid. Supabase Auth issues a JWT whose auth.uid() is the auth.users id. If
-- crm_users.id were an unrelated random uuid, auth.uid() would never match a
-- crm_users row, so the app could not resolve "who am I" and could not set
-- notes.author_id or activities.actor_id. Note authorship would be impossible.
-- This is the same shape the PRD specifies in section 5.2.
create table public.crm_users (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text unique not null,
  full_name  text not null,
  role       text not null default 'sales_rep' check (role in ('admin', 'sales_rep')),
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------
create table public.leads (
  id        uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email     text,
  phone     text,

  source text not null check (source in (
    'stock101', 'retirement', 'whatsapp', 'chatbot', 'manual'
  )),

  program_interest text check (program_interest in (
    'stock101', 'retirement', 'mentorship',
    'beginner_portfolio', 'closed_circuit', 'quick_fire', 'unknown'
  )),

  stage text not null default 'new' check (stage in (
    'new', 'contacted', 'nurturing', 'session_booked', 'converted', 'closed_lost'
  )),

  location           text,
  age_range          text,
  how_heard          text,
  retirement_savings text,

  assigned_to uuid references public.crm_users(id) on delete set null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index leads_stage_idx      on public.leads (stage);
create index leads_source_idx     on public.leads (source);
create index leads_assigned_idx   on public.leads (assigned_to);
create index leads_created_at_idx on public.leads (created_at desc);

-- ---------------------------------------------------------------------------
-- notes
-- ---------------------------------------------------------------------------
create table public.notes (
  id         uuid primary key default uuid_generate_v4(),
  lead_id    uuid not null references public.leads(id) on delete cascade,
  author_id  uuid not null references public.crm_users(id),
  content    text not null,
  created_at timestamptz default now()
);

create index notes_lead_idx on public.notes (lead_id, created_at desc);

-- ---------------------------------------------------------------------------
-- activities (append-only, never delete)
-- ---------------------------------------------------------------------------
create table public.activities (
  id       uuid primary key default uuid_generate_v4(),
  lead_id  uuid not null references public.leads(id) on delete cascade,
  actor_id uuid references public.crm_users(id) on delete set null,
  type     text not null check (type in (
    'stage_change', 'note_added', 'email_sent', 'lead_created',
    'field_updated', 'tag_added', 'tag_removed', 'assigned'
  )),
  payload    jsonb default '{}',
  created_at timestamptz default now()
);

create index activities_lead_idx on public.activities (lead_id, created_at desc);

-- ---------------------------------------------------------------------------
-- tags
-- ---------------------------------------------------------------------------
create table public.tags (
  id      uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  label   text not null check (label in (
    'hot', 'warm', 'cold', 'diaspora', 'nigeria', 'follow_up'
  )),
  created_at timestamptz default now(),
  unique (lead_id, label)
);

create index tags_lead_idx on public.tags (lead_id);

-- ---------------------------------------------------------------------------
-- Provision a crm_users row whenever an auth user is created.
-- Without this, a user created in the Auth dashboard can sign in but has no
-- CRM profile, so notes and activities have nothing to attribute to.
-- Every new user starts as sales_rep. Promotion to admin is a manual act.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.crm_users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'sales_rep')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Keep updated_at honest.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_touch_updated_at
  before update on public.leads
  for each row execute function public.touch_updated_at();

create trigger crm_users_touch_updated_at
  before update on public.crm_users
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.leads      enable row level security;
alter table public.notes      enable row level security;
alter table public.activities enable row level security;
alter table public.tags       enable row level security;
alter table public.crm_users  enable row level security;

create policy "Authenticated users can read leads"
  on public.leads for select to authenticated using (true);

create policy "Authenticated users can insert leads"
  on public.leads for insert to authenticated with check (true);

create policy "Authenticated users can update leads"
  on public.leads for update to authenticated using (true);

create policy "Authenticated users can read notes"
  on public.notes for select to authenticated using (true);

create policy "Authenticated users can insert notes"
  on public.notes for insert to authenticated with check (true);

create policy "Authenticated users can read activities"
  on public.activities for select to authenticated using (true);

-- Phase 1 writes activities from the client, because Phase 1 has no
-- database triggers for them. There is deliberately no UPDATE and no DELETE
-- policy, so the log stays append-only. The PRD (P0-6) moves this write into
-- triggers in a later phase; at that point this INSERT policy is dropped.
create policy "Authenticated users can insert activities"
  on public.activities for insert to authenticated with check (true);

create policy "Authenticated users can read tags"
  on public.tags for select to authenticated using (true);

create policy "Authenticated users can manage tags"
  on public.tags for all to authenticated using (true);

create policy "Authenticated users can read crm_users"
  on public.crm_users for select to authenticated using (true);

-- Users may edit their own display name, but not their own role.
-- The role check in WITH CHECK is what blocks self-promotion to admin.
create policy "Users can update their own profile"
  on public.crm_users for update to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.crm_users where id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.leads;
```

### `0002_leads_soft_delete.sql`

```sql
-- Tito Finance CRM, soft delete for leads.
--
-- RUN THIS BEFORE DEPLOYING THE FRONTEND THAT GOES WITH IT.
-- useLeads filters `.is('deleted_at', null)`. Until this column exists that
-- filter is a PostgREST error, so the leads list renders empty for everyone.

alter table public.leads
  add column if not exists deleted_at timestamptz default null;

-- Every list query now filters on deleted_at is null and orders by created_at,
-- so index the live rows only. A partial index stays small as deletions grow.
create index if not exists leads_live_created_at_idx
  on public.leads (created_at desc)
  where deleted_at is null;

-- PRD 2.2 restricts deletion to admins. The existing policy
-- ("Authenticated users can update leads", 0001 line 172) lets any
-- authenticated rep PATCH any column, so hiding the button in the UI is not
-- enforcement. This trigger rejects a change to deleted_at from a non-admin
-- and leaves every other update on the table untouched.
create or replace function public.enforce_admin_soft_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.deleted_at is distinct from old.deleted_at then
    if not exists (
      select 1 from public.crm_users
      where id = auth.uid() and role = 'admin'
    ) then
      raise exception 'Only an admin can delete a lead.'
        using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists leads_admin_soft_delete on public.leads;
create trigger leads_admin_soft_delete
  before update on public.leads
  for each row
  execute function public.enforce_admin_soft_delete();
```

### `0003_phase2_triggers_and_users.sql`

```sql
-- Tito Finance CRM, Phase 2.
--
-- RUN THIS BEFORE DEPLOYING THE FRONTEND THAT GOES WITH IT.
-- This migration moves activity logging from the client into the database
-- (PRD P0-6, anticipated by the comment above the activities INSERT policy in
-- 0001). The matching commit REMOVES the client-side inserts for stage_change
-- and lead_created. Run the SQL and ship the frontend together: run this alone
-- and every stage change logs twice, ship the frontend alone and stage changes
-- stop logging at all.

-- ---------------------------------------------------------------------------
-- Stage changes
-- ---------------------------------------------------------------------------
-- actor_id is auth.uid(), not null. crm_users.id IS the auth.users id (see the
-- CORRECTION note in 0001), so auth.uid() resolves to the acting operator and
-- the timeline can still say who moved the lead. Omitting it would attribute
-- every future stage change to "Unknown".
create or replace function public.log_stage_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if OLD.stage is distinct from NEW.stage then
    insert into public.activities (lead_id, actor_id, type, payload)
    values (
      NEW.id,
      auth.uid(),
      'stage_change',
      jsonb_build_object('from', OLD.stage, 'to', NEW.stage)
    );
  end if;
  return NEW;
end;
$$;

drop trigger if exists on_stage_change on public.leads;
create trigger on_stage_change
  after update on public.leads
  for each row execute function public.log_stage_change();

-- ---------------------------------------------------------------------------
-- Lead creation
-- ---------------------------------------------------------------------------
create or replace function public.log_lead_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.activities (lead_id, actor_id, type, payload)
  values (
    NEW.id,
    auth.uid(),
    'lead_created',
    jsonb_build_object('source', NEW.source, 'full_name', NEW.full_name)
  );
  return NEW;
end;
$$;

drop trigger if exists on_lead_created on public.leads;
create trigger on_lead_created
  after insert on public.leads
  for each row execute function public.log_lead_created();

-- ---------------------------------------------------------------------------
-- Deactivating a team member
-- ---------------------------------------------------------------------------
-- Soft, like the lead delete in 0002: the row stays so notes and activities
-- keep their author, and the person drops out of the assignee picker.
alter table public.crm_users
  add column if not exists deactivated_at timestamptz default null;

-- Only an admin may deactivate, and nobody may deactivate themselves (that
-- would let the last admin lock the whole team out of settings).
create or replace function public.enforce_admin_deactivate()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.deactivated_at is distinct from old.deactivated_at then
    if not exists (
      select 1 from public.crm_users
      where id = auth.uid() and role = 'admin'
    ) then
      raise exception 'Only an admin can deactivate a team member.'
        using errcode = '42501';
    end if;

    if new.id = auth.uid() then
      raise exception 'You cannot deactivate your own account.'
        using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists crm_users_admin_deactivate on public.crm_users;
create trigger crm_users_admin_deactivate
  before update on public.crm_users
  for each row execute function public.enforce_admin_deactivate();

-- 0001 grants UPDATE on crm_users only for a user's own row ("Users can update
-- their own profile"), so an admin cannot deactivate anyone else without this.
-- The trigger above is what actually restricts it to admins.
create policy "Admins can update crm_users"
  on public.crm_users for update to authenticated using (
    exists (select 1 from public.crm_users u where u.id = auth.uid() and u.role = 'admin')
  );
```

### `0004_phase3_followup_and_search.sql`

```sql
-- Tito Finance CRM, Phase 3.
--
-- RUN THIS BEFORE DEPLOYING THE FRONTEND THAT GOES WITH IT.
-- useLeads selects follow_up_at and runs textSearch against search_vector.
-- Without these columns the leads list errors out for everyone.

-- ---------------------------------------------------------------------------
-- Follow-up reminders
-- ---------------------------------------------------------------------------
alter table public.leads
  add column if not exists follow_up_at timestamptz default null;

-- The "Due Today" filter asks for rows with a follow-up at or before end of
-- day. Index the rows that have one at all; most leads never will.
create index if not exists leads_follow_up_idx
  on public.leads (follow_up_at)
  where follow_up_at is not null and deleted_at is null;

-- ---------------------------------------------------------------------------
-- Full-text search
-- ---------------------------------------------------------------------------
-- Replaces the leading-wildcard ILIKE that 0001 flagged as a Phase 1
-- shortcut ("a leading-wildcard LIKE cannot use an index and degrades once
-- the table passes a few thousand rows").
--
-- phone is included deliberately: to_tsvector('english', ...) keeps digit
-- runs as tokens, so "08031" matches a phone starting with it only as a whole
-- token, not as a substring. Substring phone matching stays on the ILIKE
-- fallback in useLeads.
alter table public.leads
  add column if not exists search_vector tsvector
  generated always as (
    to_tsvector('english',
      coalesce(full_name, '') || ' ' ||
      coalesce(email, '') || ' ' ||
      coalesce(phone, '') || ' ' ||
      coalesce(location, '')
    )
  ) stored;

create index if not exists leads_search_idx
  on public.leads using gin (search_vector);
```

### `0005_phase4_scoring_and_whatsapp.sql`

```sql
-- Tito Finance CRM, Phase 4.
--
-- RUN THIS BEFORE DEPLOYING THE FRONTEND THAT GOES WITH IT.
-- useLeads selects and sorts on leads.score, and the WhatsApp template
-- picker writes activities of type 'whatsapp_sent'. Without this migration
-- the leads list errors and every template click fails its activity insert.

-- ---------------------------------------------------------------------------
-- Lead scoring
-- ---------------------------------------------------------------------------
alter table public.leads
  add column if not exists score integer default 0;

create or replace function public.calculate_lead_score(lead_row public.leads)
returns integer
language plpgsql
immutable
as $$
declare
  s integer := 0;
begin
  s := s + case lead_row.source
    when 'whatsapp'   then 35
    when 'retirement' then 30
    when 'stock101'   then 20
    when 'manual'     then 10
    else 10
  end;

  s := s + case lead_row.program_interest
    when 'mentorship' then 30
    when 'retirement' then 25
    when 'quick_fire' then 20
    when 'stock101'   then 15
    else 10
  end;

  s := s + case lead_row.stage
    when 'session_booked' then 20
    when 'nurturing'      then 15
    when 'contacted'      then 10
    else 0
  end;

  if lead_row.follow_up_at is not null then
    s := s + 10;
  end if;

  return s;
end;
$$;

create or replace function public.update_lead_score()
returns trigger
language plpgsql
as $$
begin
  NEW.score := public.calculate_lead_score(NEW);
  return NEW;
end;
$$;

-- Fires before the row is written, so score is never stale by even one read.
-- Ordering against the other BEFORE UPDATE triggers on this table does not
-- matter: each touches a different column and all return NEW.
drop trigger if exists on_lead_score_update on public.leads;
create trigger on_lead_score_update
  before insert or update on public.leads
  for each row execute function public.update_lead_score();

-- Backfill. Runs after the trigger exists, which is harmless: the trigger
-- recomputes the same value the statement is setting.
update public.leads set score = public.calculate_lead_score(leads.*);

-- Sorting by score is a list default, so it needs an index on the live rows.
create index if not exists leads_score_idx
  on public.leads (score desc)
  where deleted_at is null;

-- ---------------------------------------------------------------------------
-- WhatsApp activity type
-- ---------------------------------------------------------------------------
alter table public.activities
  drop constraint if exists activities_type_check;

alter table public.activities
  add constraint activities_type_check
  check (type in (
    'stage_change', 'note_added', 'email_sent', 'lead_created',
    'field_updated', 'tag_added', 'tag_removed', 'assigned', 'whatsapp_sent'
  ));
```

### `0006_login_activity_and_invites.sql`

```sql
-- Tito Finance CRM, login activity and invites.
--
-- RUN THIS BEFORE DEPLOYING THE FRONTEND THAT GOES WITH IT.
-- Settings selects crm_users.last_sign_in_at and calls invite_crm_user().

-- ---------------------------------------------------------------------------
-- Login activity
-- ---------------------------------------------------------------------------
-- auth.users is not readable from the client, so the timestamp is mirrored
-- onto crm_users where existing RLS already governs who can see it.
alter table public.crm_users
  add column if not exists last_sign_in_at timestamptz default null;

create or replace function public.sync_user_last_sign_in()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.crm_users
  set last_sign_in_at = NEW.last_sign_in_at
  where id = NEW.id;
  return NEW;
end;
$$;

drop trigger if exists on_auth_sign_in on auth.users;
create trigger on_auth_sign_in
  after update of last_sign_in_at on auth.users
  for each row execute function public.sync_user_last_sign_in();

-- Backfill so the table is not empty until everyone signs in again.
update public.crm_users c
set last_sign_in_at = u.last_sign_in_at
from auth.users u
where u.id = c.id;

-- ---------------------------------------------------------------------------
-- Invites
-- ---------------------------------------------------------------------------
-- NOT a row in crm_users. crm_users.id is a foreign key onto auth.users(id),
-- so inserting a generated uuid there fails the constraint; and if it did not,
-- the unique email would then block the real signup when on_auth_user_created
-- fires. An invite is intent, recorded until the auth user actually exists.
create table if not exists public.crm_invites (
  email      text primary key,
  full_name  text not null,
  role       text not null default 'sales_rep' check (role in ('admin', 'sales_rep')),
  invited_by uuid references public.crm_users(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.crm_invites enable row level security;

create policy "Admins can read invites"
  on public.crm_invites for select to authenticated using (
    exists (select 1 from public.crm_users u where u.id = auth.uid() and u.role = 'admin')
  );

create or replace function public.invite_crm_user(
  invite_email text,
  invite_name text,
  invite_role text
) returns json
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.crm_users where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'Only an admin can invite a team member.' using errcode = '42501';
  end if;

  if invite_role not in ('admin', 'sales_rep') then
    raise exception 'Unknown role.' using errcode = '22023';
  end if;

  if exists (select 1 from public.crm_users where email = lower(trim(invite_email))) then
    return json_build_object('success', false, 'reason', 'already_a_member');
  end if;

  insert into public.crm_invites (email, full_name, role, invited_by)
  values (lower(trim(invite_email)), trim(invite_name), invite_role, auth.uid())
  on conflict (email) do update
    set full_name = excluded.full_name,
        role = excluded.role,
        invited_by = excluded.invited_by;

  return json_build_object('success', true, 'email', lower(trim(invite_email)));
end;
$$;

-- The provisioning trigger now consumes the invite, so an invited person gets
-- the name and role the admin chose instead of defaulting to sales_rep.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  inv public.crm_invites%rowtype;
begin
  select * into inv from public.crm_invites where email = NEW.email;

  insert into public.crm_users (id, email, full_name, role)
  values (
    NEW.id,
    NEW.email,
    coalesce(inv.full_name, NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    coalesce(inv.role, 'sales_rep')
  )
  on conflict (id) do nothing;

  delete from public.crm_invites where email = NEW.email;
  return NEW;
end;
$$;
```

### `0007_last_activity_and_scoreboard.sql`

```sql
-- ---------------------------------------------------------------------------
-- 0007  last_activity_at, the staleness clock behind the scoreboard
-- ---------------------------------------------------------------------------
-- The dual dashboard needs one question answered cheaply: when did a human
-- last do something to this lead. Deriving it at read time means a max() over
-- the whole activities table per lead, so it is stored on the lead and
-- maintained by a trigger.
--
-- updated_at is NOT a substitute. on_lead_score_update fires before every
-- insert or update, so updated_at tracks writes of any kind, including a
-- score recompute. A lead nobody has spoken to would look freshly worked.
-- ---------------------------------------------------------------------------

alter table public.leads
  add column if not exists last_activity_at timestamptz not null default now();

-- Partial on the live rows, matching every other index on this table. The
-- stalled query is "oldest first among leads that still exist".
create index if not exists leads_last_activity_idx
  on public.leads (last_activity_at desc)
  where deleted_at is null;

-- ---------------------------------------------------------------------------
-- Maintenance trigger
-- ---------------------------------------------------------------------------
-- security definer, matching log_stage_change and log_lead_created in 0003:
-- activities are written from several paths (client inserts for notes and
-- tags, security-definer triggers for stage changes, and later the ingest
-- Edge Function). The bump must succeed from all of them, not only from the
-- ones whose caller happens to hold an update policy on leads.
--
-- greatest() rather than a plain assignment: an out-of-order insert, which a
-- backfill or a future import will produce, must not drag the clock backwards
-- and make a freshly worked lead look abandoned.
--
-- No recursion risk. This updates leads, which fires on_stage_change, which
-- only inserts an activity when OLD.stage is distinct from NEW.stage. Stage
-- is untouched here, so the chain stops. It does fire leads_touch_updated_at,
-- which is the intended cost of keeping the clock honest.
create or replace function public.update_lead_last_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.leads
  set last_activity_at = greatest(last_activity_at, NEW.created_at)
  where id = NEW.lead_id;
  return NEW;
end;
$$;

drop trigger if exists on_activity_created on public.activities;
create trigger on_activity_created
  after insert on public.activities
  for each row execute function public.update_lead_last_activity();

-- ---------------------------------------------------------------------------
-- Backfill
-- ---------------------------------------------------------------------------
-- A lead with no activity rows falls back to its creation time, which is the
-- honest answer: nothing has happened to it since it arrived. Runs after the
-- trigger exists, which is harmless because the trigger is on activities and
-- this statement writes leads.
update public.leads l
set last_activity_at = coalesce(
  (select max(created_at) from public.activities where lead_id = l.id),
  l.created_at
);
```

## 2.2 Full DDL, resolved across all seven migrations

### `public.crm_users`

| Column | Type | Default | Nullable | Constraint |
|---|---|---|---|---|
| `id` | uuid | — | NO | PK; FK → `auth.users(id)` ON DELETE CASCADE |
| `email` | text | — | NO | UNIQUE |
| `full_name` | text | — | NO | |
| `role` | text | `'sales_rep'` | NO | CHECK `role in ('admin','sales_rep')` |
| `avatar_url` | text | — | YES | |
| `created_at` | timestamptz | `now()` | YES | |
| `updated_at` | timestamptz | `now()` | YES | maintained by `touch_updated_at` |
| `deactivated_at` | timestamptz | `null` | YES | added 0003 |
| `last_sign_in_at` | timestamptz | `null` | YES | added 0006, mirrored from `auth.users` |

### `public.leads`

| Column | Type | Default | Nullable | Constraint |
|---|---|---|---|---|
| `id` | uuid | `uuid_generate_v4()` | NO | PK |
| `full_name` | text | — | NO | |
| `email` | text | — | YES | **no unique constraint** |
| `phone` | text | — | YES | |
| `source` | text | — | NO | CHECK (5 values, below) |
| `program_interest` | text | — | YES | CHECK (7 values, below) |
| `stage` | text | `'new'` | NO | CHECK (6 values, below) |
| `location` | text | — | YES | |
| `age_range` | text | — | YES | |
| `how_heard` | text | — | YES | |
| `retirement_savings` | text | — | YES | |
| `assigned_to` | uuid | — | YES | FK → `crm_users(id)` ON DELETE SET NULL |
| `created_at` | timestamptz | `now()` | YES | |
| `updated_at` | timestamptz | `now()` | YES | maintained by `touch_updated_at` |
| `deleted_at` | timestamptz | `null` | YES | added 0002 |
| `follow_up_at` | timestamptz | `null` | YES | added 0004 |
| `search_vector` | tsvector | GENERATED ALWAYS STORED | YES | added 0004; `to_tsvector('english', full_name ‖ email ‖ phone ‖ location)` |
| `score` | integer | `0` | YES | added 0005; overwritten every write by `update_lead_score` |
| `last_activity_at` | timestamptz | `now()` | **NO** | added 0007 |

### `public.notes`

| Column | Type | Default | Nullable | Constraint |
|---|---|---|---|---|
| `id` | uuid | `uuid_generate_v4()` | NO | PK |
| `lead_id` | uuid | — | NO | FK → `leads(id)` ON DELETE CASCADE |
| `author_id` | uuid | — | NO | FK → `crm_users(id)` (no ON DELETE clause → RESTRICT) |
| `content` | text | — | NO | |
| `created_at` | timestamptz | `now()` | YES | |

### `public.activities`

| Column | Type | Default | Nullable | Constraint |
|---|---|---|---|---|
| `id` | uuid | `uuid_generate_v4()` | NO | PK |
| `lead_id` | uuid | — | NO | FK → `leads(id)` ON DELETE CASCADE |
| `actor_id` | uuid | — | YES | FK → `crm_users(id)` ON DELETE SET NULL. NULL = system |
| `type` | text | — | NO | CHECK (9 values after 0005) |
| `payload` | jsonb | `'{}'` | YES | unvalidated |
| `created_at` | timestamptz | `now()` | YES | |

### `public.tags`

| Column | Type | Default | Nullable | Constraint |
|---|---|---|---|---|
| `id` | uuid | `uuid_generate_v4()` | NO | PK |
| `lead_id` | uuid | — | NO | FK → `leads(id)` ON DELETE CASCADE |
| `label` | text | — | NO | CHECK (6 values) |
| `created_at` | timestamptz | `now()` | YES | |
| — | — | — | — | UNIQUE `(lead_id, label)` |

### `public.crm_invites`

| Column | Type | Default | Nullable | Constraint |
|---|---|---|---|---|
| `email` | text | — | NO | PK |
| `full_name` | text | — | NO | |
| `role` | text | `'sales_rep'` | NO | CHECK `role in ('admin','sales_rep')` |
| `invited_by` | uuid | — | YES | FK → `crm_users(id)` ON DELETE SET NULL |
| `created_at` | timestamptz | `now()` | YES | |

## 2.3 Exact string literals the code can write

No PostgreSQL `ENUM` types exist. Every constrained field is `text` + `CHECK`.

**`leads.source`** — 5 values:
`'stock101'` · `'retirement'` · `'whatsapp'` · `'chatbot'` · `'manual'`

**`leads.program_interest`** — 7 values:
`'stock101'` · `'retirement'` · `'mentorship'` · `'beginner_portfolio'` · `'closed_circuit'` · `'quick_fire'` · `'unknown'`

**`leads.stage`** — 6 values:
`'new'` · `'contacted'` · `'nurturing'` · `'session_booked'` · `'converted'` · `'closed_lost'`

**`activities.type`** — 9 values (after 0005 replaced the 8-value constraint):
`'stage_change'` · `'note_added'` · `'email_sent'` · `'lead_created'` · `'field_updated'` · `'tag_added'` · `'tag_removed'` · `'assigned'` · `'whatsapp_sent'`

**`tags.label`** — 6 values:
`'hot'` · `'warm'` · `'cold'` · `'diaspora'` · `'nigeria'` · `'follow_up'`

**`crm_users.role`** / **`crm_invites.role`** — 2 values:
`'admin'` · `'sales_rep'`

## 2.4 Triggers and functions

All reproduced verbatim in §2.1. Summary of what fires each:

| Trigger | Table | Timing | Function | Fired by |
|---|---|---|---|---|
| `on_auth_user_created` | `auth.users` | AFTER INSERT | `handle_new_auth_user()` | Any auth user creation (dashboard, signup) |
| `leads_touch_updated_at` | `leads` | BEFORE UPDATE | `touch_updated_at()` | Every lead update, including trigger-driven ones |
| `crm_users_touch_updated_at` | `crm_users` | BEFORE UPDATE | `touch_updated_at()` | Every profile update |
| `leads_admin_soft_delete` | `leads` | BEFORE UPDATE | `enforce_admin_soft_delete()` | Any update; raises `42501` only when `deleted_at` changes and caller is not admin |
| `on_stage_change` | `leads` | AFTER UPDATE | `log_stage_change()` | Any lead update; inserts only when `OLD.stage IS DISTINCT FROM NEW.stage` |
| `on_lead_created` | `leads` | AFTER INSERT | `log_lead_created()` | Every lead insert |
| `crm_users_admin_deactivate` | `crm_users` | BEFORE UPDATE | `enforce_admin_deactivate()` | Any profile update; raises on non-admin or self-deactivation when `deactivated_at` changes |
| `on_lead_score_update` | `leads` | BEFORE INSERT OR UPDATE | `update_lead_score()` | Every lead write; always overwrites `score` |
| `on_auth_sign_in` | `auth.users` | AFTER UPDATE OF `last_sign_in_at` | `sync_user_last_sign_in()` | Every successful sign-in |
| `on_activity_created` | `activities` | AFTER INSERT | `update_lead_last_activity()` | Every activity insert, from any path |

**Functions with no trigger attached:**

| Function | Called by |
|---|---|
| `calculate_lead_score(leads)` | `update_lead_score()`, and the 0005 backfill statement |
| `invite_crm_user(text,text,text)` | Client RPC, `Settings.tsx:74` |
| `handle_new_user()` | **NOTHING.** See §9 D-2 — defined in 0006 but no trigger was ever repointed to it. |

## 2.5 RLS policies, verbatim

RLS is **enabled** on: `leads`, `notes`, `activities`, `tags`, `crm_users`, `crm_invites`.

```sql
-- leads
create policy "Authenticated users can read leads"
  on public.leads for select to authenticated using (true);
create policy "Authenticated users can insert leads"
  on public.leads for insert to authenticated with check (true);
create policy "Authenticated users can update leads"
  on public.leads for update to authenticated using (true);
-- NO DELETE POLICY

-- notes
create policy "Authenticated users can read notes"
  on public.notes for select to authenticated using (true);
create policy "Authenticated users can insert notes"
  on public.notes for insert to authenticated with check (true);
-- NO UPDATE, NO DELETE POLICY

-- activities
create policy "Authenticated users can read activities"
  on public.activities for select to authenticated using (true);
create policy "Authenticated users can insert activities"
  on public.activities for insert to authenticated with check (true);
-- NO UPDATE, NO DELETE POLICY

-- tags
create policy "Authenticated users can read tags"
  on public.tags for select to authenticated using (true);
create policy "Authenticated users can manage tags"
  on public.tags for all to authenticated using (true);

-- crm_users
create policy "Authenticated users can read crm_users"
  on public.crm_users for select to authenticated using (true);
create policy "Users can update their own profile"
  on public.crm_users for update to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.crm_users where id = auth.uid())
  );
create policy "Admins can update crm_users"
  on public.crm_users for update to authenticated using (
    exists (select 1 from public.crm_users u where u.id = auth.uid() and u.role = 'admin')
  );

-- crm_invites
create policy "Admins can read invites"
  on public.crm_invites for select to authenticated using (
    exists (select 1 from public.crm_users u where u.id = auth.uid() and u.role = 'admin')
  );
-- NO INSERT POLICY. Writes go through invite_crm_user() (security definer).
```

**Observation:** `activities` has an INSERT policy allowing any authenticated user to write any activity row with any `actor_id` and any `payload`. The log is append-only (no UPDATE/DELETE policy) but **not** forgery-resistant. The 0001 comment states this policy would be dropped once triggers took over; 0003 added the triggers and did **not** drop it (§9 D-3).

## 2.6 Indexes

| Index | Table | Definition | Added |
|---|---|---|---|
| `crm_users_pkey` | crm_users | PK `(id)` | 0001 |
| `crm_users_email_key` | crm_users | UNIQUE `(email)` | 0001 |
| `leads_pkey` | leads | PK `(id)` | 0001 |
| `leads_stage_idx` | leads | `(stage)` | 0001 |
| `leads_source_idx` | leads | `(source)` | 0001 |
| `leads_assigned_idx` | leads | `(assigned_to)` | 0001 |
| `leads_created_at_idx` | leads | `(created_at desc)` | 0001 |
| `leads_live_created_at_idx` | leads | `(created_at desc) WHERE deleted_at is null` | 0002 |
| `leads_follow_up_idx` | leads | `(follow_up_at) WHERE follow_up_at is not null and deleted_at is null` | 0004 |
| `leads_search_idx` | leads | GIN `(search_vector)` | 0004 |
| `leads_score_idx` | leads | `(score desc) WHERE deleted_at is null` | 0005 |
| `leads_last_activity_idx` | leads | `(last_activity_at desc) WHERE deleted_at is null` | 0007 |
| `notes_pkey` | notes | PK `(id)` | 0001 |
| `notes_lead_idx` | notes | `(lead_id, created_at desc)` | 0001 |
| `activities_pkey` | activities | PK `(id)` | 0001 |
| `activities_lead_idx` | activities | `(lead_id, created_at desc)` | 0001 |
| `tags_pkey` | tags | PK `(id)` | 0001 |
| `tags_lead_idx` | tags | `(lead_id)` | 0001 |
| `tags_lead_id_label_key` | tags | UNIQUE `(lead_id, label)` | 0001 |
| `crm_invites_pkey` | crm_invites | PK `(email)` | 0006 |

**No index on `activities.created_at` alone.** `useScoreboard` filters `created_at >= now() - 30 days` across the whole table with no `lead_id` predicate, so that query is a sequential scan.

## 2.7 Lead lifecycle as actually implemented

### Stage values and where each transition is written

```
                    ┌──────────────────────────────────────────┐
                    │  ALL SIX STAGES ARE MUTUALLY REACHABLE   │
                    │  There is no enforced ordering anywhere. │
                    └──────────────────────────────────────────┘

  new ──┐
        ├──> contacted ──┐
        │                ├──> nurturing ──┐
        │                │                ├──> session_booked ──┐
        │                │                │                     ├──> converted
        │                │                │                     └──> closed_lost
        └────────────────┴────────────────┴─────────────────────┘
                    (any → any, both directions)
```

**`'new'` is the only stage written by anything other than an operator picking it from a dropdown.**

| Transition | Written by | File:line | Guard |
|---|---|---|---|
| `→ 'new'` (on create) | Column default `'new'`, plus explicit `stage: 'new'` | `useLeads.ts:159` | none |
| any → any (single) | `useUpdateStage` | `useLead.ts:100-133` | none. Optimistic with rollback. |
| any → any (bulk) | `useBulkUpdateStage` | `useLeads.ts:198-211` | none. One `.in('id', ids)` update. |

UI entry points: the stage `<select>` on `LeadDetail.tsx`, the inline stage control in the `Leads.tsx` table row, and the bulk action bar in `Leads.tsx`.

### Enforcement facts

- **No transition is validated.** `closed_lost → new` is permitted and requires no reason. There is no `closed_lost_reason` column.
- **No terminal state.** `converted` can be moved back out.
- **No `converted_at` column.** The moment of conversion is recoverable only from an `activities` row of type `stage_change` with `payload->>'to' = 'converted'`, which is exactly what `metrics.ts:leadsMovedTo` does.
- **No timestamp for any other stage entry.** `contacted` has no `contacted_at`.

### Stages written but never read

**None.** All six are read by `stageCounts` (`metrics.ts:338`), by `STAGES` in `constants.ts:33-41`, and by `buildStageBars` in `chartHelpers.ts:169`.

### Stages read but never written

**None.** All six are reachable from the UI dropdown, which is populated from `STAGES`.

### Values in a CHECK constraint that no code path can produce

| Value | Field | Finding |
|---|---|---|
| `'chatbot'` | `leads.source` | **Never written by any automated path.** `ChatBot.tsx` contains zero network calls (verified: no `fetch`, no `supabase`, no storage). Reachable only if an operator picks it in `AddLeadModal`. |
| `'whatsapp'` | `leads.source` | Same. No WhatsApp inbound integration exists. Manual selection only. Note it carries the **highest** score weight (35) in `calculate_lead_score`. |

### Columns populated by nothing

| Column | Finding |
|---|---|
| `leads.retirement_savings` | Collected by the Retirement form (§3), but that form's payload terminates at Google Apps Script. **No code in either tree writes this column.** `AddLeadModal` does not offer the field. It is read by `LeadDetail` and by `LEAD_COLUMNS`. |
| `leads.age_range` | Same. Collected by the Retirement form only, written by nothing. |
| `leads.how_heard` | Same. Collected by both forms, written by nothing. |
| `crm_users.avatar_url` | Never written. Never read (UI uses `initials()`). |
| `crm_invites.*` | Written by `invite_crm_user()`. **Never consumed** (§9 D-2). |

---

# 3. INGEST PATH

## 3.1 Headline finding

**There is no code path in either repository that inserts a lead into Supabase from a public form.**

Both landing-page forms POST to a Google Apps Script `/exec` URL. **The Apps Script is not in this tree.** Whether it forwards to Supabase, writes only to a Sheet, or does nothing is unverifiable from the code available. Every automated `leads` row therefore depends on a component that is not version-controlled here.

The only *verified* write path into `leads` is `AddLeadModal` → `useAddLead` (manual entry by a signed-in operator).

## 3.2 Form A — Stock 101

**File:** `titofinance/src/pages/Stock101Page.tsx`, inline `RegisterForm` component (line 239).

### Fields collected

| Input `name` | Label | Type | Required | Options |
|---|---|---|---|---|
| `fullName` | Full Name | text | yes | — |
| `email` | Email Address | email | yes | — |
| `phone` | WhatsApp Number | tel | yes | — |
| `location` | Where are you based? | select | yes | Nigeria, United States, United Kingdom, Canada, Other |
| `howHeard` | How did you hear about us? | select | yes | Instagram, WhatsApp, YouTube, TikTok, Friend, Other |

### Payload posted (`Stock101Page.tsx:253-260`)

```js
{
  form_type: 'stock101',
  fullName:  string,
  email:     string,
  phone:     string,
  location:  string,
  howHeard:  string
}
```

### Transport (`Stock101Page.tsx:265-274`)

`POST` → `https://script.google.com/macros/s/[REDACTED — Apps Script deployment ID]/exec`
`mode: 'no-cors'`, `Content-Type: application/json`.

**The response is opaque.** Status, headers and body are unreadable. Line 277 sets `showThankYou(true)` on success and line 280 sets it again inside `catch`. **A total outage of the Apps Script is indistinguishable from success, for the visitor and for the operator.**

## 3.3 Form B — Retirement

**File:** `titofinance/src/components/landing/LandingForm.tsx`, rendered by `RetirementPage.tsx:1018`.

### Fields collected (defined at `RetirementPage.tsx:1021-1044`)

| Input `name` | Label | Type | Required | Options |
|---|---|---|---|---|
| `fullName` | Full Name | text | yes | — |
| `email` | Email Address | email | yes | — |
| `phone` | Phone Number (WhatsApp) | tel | yes | — |
| `ageRange` | Age Range | select | yes | `25–35`, `36–45`, `46–55`, `55+` — **note en-dashes, not hyphens** |
| `location` | Where are you based? | select | yes | Nigeria, United States, United Kingdom, Canada, Other |
| `retirementSavings` | Current retirement savings? | select | yes | None yet, Just started, Have some, Well invested |
| `howHeard` | How did you hear about this? | select | yes | Instagram, WhatsApp, YouTube, TikTok, Friend, Other |

### Payload posted (`LandingForm.tsx:81-90`)

```js
{
  form_type: 'retirement',          // HARDCODED LITERAL, see D-1
  fullName:          string,
  email:             string,
  phone:             string,
  ageRange:          string,
  location:          string,
  retirementSavings: string,
  howHeard:          string
}
```

### Transport (`LandingForm.tsx:94-102`)

Identical: same Apps Script URL, same `no-cors`, same double-success at lines 103 and 107.

**`webhookUrl` is declared on the props interface (line 14) but the component destructures only `{ fields, submitLabel }` (line 72).** The `n8n` URL passed at `RetirementPage.tsx:1019` is never read. That endpoint receives nothing.

## 3.4 Form C — Newsletter (Footer)

**File:** `titofinance/src/components/Footer.tsx:11-33`. POSTs `email_address` to `https://app.kit.com/forms/9676481/subscriptions`. Goes to ConvertKit, not to Supabase. Checks `res.ok` and the JSON `status` field, so unlike the lead forms it reports real failures.

## 3.5 Chatbot

**File:** `titofinance/src/components/ChatBot.tsx`, 327 lines. Fixed `QUICK_REPLIES` array and a `RESPONSES` keyword map with a fallback. **Zero network calls, zero storage.** It captures nothing. The `'chatbot'` source value has no producer.

## 3.6 Field → column mapping

Mapping is **inferred from name similarity**, not from code, because the transformation happens inside the Apps Script.

| Payload field | Expected `leads` column | Confirmed by code? |
|---|---|---|
| `fullName` | `full_name` | NO |
| `email` | `email` | NO |
| `phone` | `phone` | NO |
| `location` | `location` | NO |
| `howHeard` | `how_heard` | NO |
| `ageRange` | `age_range` | NO |
| `retirementSavings` | `retirement_savings` | NO |
| `form_type` | `source` | NO. Values `'stock101'` / `'retirement'` happen to match two `source` CHECK literals. |

### Fields collected but with no column at all

None — every collected field has a matching column.

### Columns the forms cannot populate

`program_interest`, `assigned_to`, `stage`, `follow_up_at`, `score`, `deleted_at`, `last_activity_at`. Of these, `stage`, `score` and `last_activity_at` have defaults or triggers; `program_interest` and `assigned_to` would be left NULL by any Apps Script that maps only the fields above.

## 3.7 What the Apps Script must deliver

**The Google Apps Script is not in this tree.** For a Supabase-bound rewrite to satisfy the schema, it must produce a `leads` row with:

**Required (NOT NULL, no default):**
- `full_name` ← `fullName`
- `source` ← must be one of exactly `'stock101'`, `'retirement'`, `'whatsapp'`, `'chatbot'`, `'manual'`. The payload's `form_type` supplies the first two only.

**Optional, but supplied by the forms:**
- `email` ← `email`
- `phone` ← `phone` (raw; `normalizePhone` lives client-side in the CRM and is not applied at ingest)
- `location` ← `location`
- `how_heard` ← `howHeard`
- `age_range` ← `ageRange` (retirement only)
- `retirement_savings` ← `retirementSavings` (retirement only)

**Must NOT be supplied:** `score` (trigger overwrites), `last_activity_at` (trigger + default), `search_vector` (generated column, insert would error).

**Auth:** the ingest caller needs either the `service_role` key or a `service_role`-signed request. The anon key alone cannot insert, because the `leads` INSERT policy is `to authenticated`. No such key exists in this tree.

---

# 4. DERIVATION LAYER

## 4.1 Purity classification

| Module | Lines | Pure? | Touches React? | Touches network? |
|---|---|---|---|---|
| `src/lib/metrics.ts` | 353 | **YES — fully pure** | no | no |
| `src/lib/sparkline.ts` | 77 | **YES — fully pure** | no | no |
| `src/lib/chartHelpers.ts` | 244 | **YES — fully pure** | no | no |
| `src/lib/csv.ts` | 73 | Mixed | no | no (`downloadCsv` touches DOM/`URL`) |
| `src/lib/utils.ts` | 110 | Mixed | no | no (`cn` is pure; all others pure) |
| `src/lib/constants.ts` | 114 | Data only | type-only `CSSProperties` import | no |
| `src/lib/chartColors.ts` | 104 | Data only | no | no |
| `src/hooks/*.ts` | — | **NO** | yes | **yes** |

`metrics.ts` imports exactly two things: `date-fns` and a type-only import from `types/database`. It has no runtime dependency on React, Supabase, or the DOM. Every time-dependent export takes an optional trailing `at: Date` defaulting to `now()`, so the module is deterministic under a fixed clock without mocking.

## 4.2 `src/lib/metrics.ts` — full export list

| Export | Signature | Computes | Reads |
|---|---|---|---|
| `LeadRow` | interface | Query shape: 11 fields | — |
| `ActivityRow` | interface | Query shape: 5 fields | — |
| `now` | `() => Date` | Current time | clock |
| `daysAgo` | `(n: number, at?: Date) => Date` | `at` minus n days | clock |
| `startOfThisWeek` | `(at?: Date) => Date` | Monday of `at`'s week | clock |
| `startOfThisMonth` | `(at?: Date) => Date` | 1st of `at`'s month | clock |
| `isActive` | `(l: LeadRow) => boolean` | Open work | `deleted_at`, `stage` |
| `isStalled` | `(l, days?, at?) => boolean` | **THRESHOLD — verbatim below** | `last_activity_at` |
| `isUntouched` | `(l, at?) => boolean` | **THRESHOLD — verbatim below** | `stage`, `created_at` |
| `isOverdue` | `(l, at?) => boolean` | **THRESHOLD — verbatim below** | `follow_up_at` |
| `isDueToday` | `(l, at?) => boolean` | **THRESHOLD — verbatim below** | `follow_up_at` |
| `repOpenCount` | `(leads, repId) => number` | Open leads for rep | `assigned_to`, `stage` |
| `repContactedThisWeek` | `(activities, repId, at?) => number` | Distinct leads → `contacted` since Monday | `activities` |
| `repBookedThisMonth` | `(activities, repId, at?) => number` | Distinct leads → `session_booked` MTD | `activities` |
| `repConvertedThisMonth` | `(activities, repId, at?) => number` | Distinct leads → `converted` MTD | `activities` |
| `repConversionRate` | `(leads, repId) => number` | All-time converted / assigned, 1dp | `leads` |
| `globalOpenCount` | `(leads) => number` | All open | `leads` |
| `globalNewThisWeek` | `(leads, at?) => number` | Created since Monday | `created_at` |
| `globalBookedThisMonth` | `(activities, at?) => number` | Distinct → `session_booked` MTD | `activities` |
| `globalConvertedThisMonth` | `(activities, at?) => number` | Distinct → `converted` MTD | `activities` |
| `globalConversionRate` | `(leads, at?) => number` | **TIME WINDOW — verbatim below** | `leads` |
| `globalUnassignedCount` | `(leads) => number` | Unowned new leads | `assigned_to`, `stage` |
| `globalStalledCount` | `(leads, at?) => number` | Count of `isStalled` at 7 days | `leads` |
| `QueueGroup` | type | `'overdue' \| 'due_today' \| 'untouched'` | — |
| `QueueLead` | interface | `LeadRow` + `queueReason` + `queueGroup` | — |
| `deriveQueue` | `(leads, repId, at?) => QueueLead[]` | **BUCKETING — verbatim below** | `leads` |
| `SourceRow` | interface | 6 fields | — |
| `LOW_N_THRESHOLD` | `const = 10` | Sample-size floor | — |
| `deriveSourcePerformance` | `(leads) => SourceRow[]` | **BUCKETING — verbatim below** | `leads` |
| `Tone` | type | `'success' \| 'warning' \| 'danger' \| 'neutral'` | — |
| `conversionTone` | `(rate) => Tone` | **THRESHOLD — verbatim below** | — |
| `stalledTone` | `(count) => Tone` | **THRESHOLD — verbatim below** | — |
| `unassignedTone` | `(count) => Tone` | **THRESHOLD — verbatim below** | — |
| `StageCounts` | type | `Record<LeadStage, number>` | — |
| `stageCounts` | `(leads, repId?) => StageCounts` | Per-stage tally | `leads` |

## 4.3 Threshold, window and bucketing functions, verbatim

### Lead predicates

```ts
/** Open work: not deleted, not finished either way. */
export const isActive = (l: LeadRow) =>
  !l.deleted_at && l.stage !== 'converted' && l.stage !== 'closed_lost'

export const isStalled = (l: LeadRow, days = 7, at: Date = now()) =>
  isActive(l) && differenceInDays(at, new Date(l.last_activity_at)) >= days

export const isUntouched = (l: LeadRow, at: Date = now()) =>
  isActive(l) && l.stage === 'new' && differenceInDays(at, new Date(l.created_at)) >= 2

export const isOverdue = (l: LeadRow, at: Date = now()) =>
  isActive(l) && l.follow_up_at !== null && new Date(l.follow_up_at) < at

/**
 * Due later today, and not yet past. A follow-up set for 9am, read at 2pm, is
 * overdue rather than due, and isOverdue owns it.
 *
 * The isActive guard is load-bearing: without it a converted lead carrying an
 * old follow-up date lands in the rep's queue as work still to do.
 */
export const isDueToday = (l: LeadRow, at: Date = now()) => {
  if (!isActive(l) || !l.follow_up_at) return false
  const due = new Date(l.follow_up_at)
  return (
    due.getFullYear() === at.getFullYear() &&
    due.getMonth() === at.getMonth() &&
    due.getDate() === at.getDate() &&
    due >= at
  )
}
```

### Activity bucketing

```ts
/** payload is jsonb, so its shape is unverified at the type level. */
const stageTarget = (a: ActivityRow): string | null =>
  typeof a.payload?.to === 'string' ? a.payload.to : null

/**
 * Distinct leads moved into `stage` since `since`, optionally by one actor.
 * Distinct, because a lead bounced out of a stage and back counts once: this
 * measures leads progressed, not clicks made.
 */
const leadsMovedTo = (
  activities: ActivityRow[],
  stage: LeadStage,
  since: Date,
  actorId?: string,
) =>
  new Set(
    activities
      .filter(
        (a) =>
          a.type === 'stage_change' &&
          stageTarget(a) === stage &&
          new Date(a.created_at) >= since &&
          (actorId === undefined || a.actor_id === actorId),
      )
      .map((a) => a.lead_id),
  ).size
```

### Rolling window

```ts
/**
 * Rolling 30 days, not all time. An all-time rate over a growing denominator
 * barely moves, so it cannot show whether anything the team changed helped.
 */
export const globalConversionRate = (leads: LeadRow[], at: Date = now()): number => {
  const since = daysAgo(30, at)
  const recent = leads.filter((l) => !l.deleted_at && new Date(l.created_at) >= since)
  if (recent.length === 0) return 0
  const converted = recent.filter((l) => l.stage === 'converted').length
  return Math.round((converted / recent.length) * 1000) / 10
}

export const globalStalledCount = (leads: LeadRow[], at: Date = now()) =>
  leads.filter((l) => isStalled(l, 7, at)).length
```

### Queue derivation

```ts
export type QueueGroup = 'overdue' | 'due_today' | 'untouched'

export interface QueueLead extends LeadRow {
  queueReason: string
  queueGroup: QueueGroup
}

/** "1 day" / "2 days", never "1 days". */
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

/**
 * Overdue by less than a full day reads as 0 days, which is nonsense on
 * screen. Hours-late gets its own sentence.
 */
const overdueReason = (l: LeadRow, at: Date) => {
  const days = differenceInDays(at, new Date(l.follow_up_at!))
  return days < 1
    ? 'Follow-up was earlier today'
    : `Follow-up was ${plural(days, 'day')} ago`
}

/**
 * The rep's ordered worklist. Groups are mutually exclusive and concatenated
 * in priority order, so the caller can render them in sequence or split on
 * queueGroup without re-sorting.
 */
export const deriveQueue = (
  leads: LeadRow[],
  repId: string,
  at: Date = now(),
): QueueLead[] => {
  const mine = leads.filter((l) => l.assigned_to === repId)

  // Oldest debt first. Score does not outrank a promise already broken.
  const overdue: QueueLead[] = mine
    .filter((l) => isOverdue(l, at))
    .sort(
      (a, b) =>
        new Date(a.follow_up_at!).getTime() - new Date(b.follow_up_at!).getTime(),
    )
    .map((l) => ({
      ...l,
      queueGroup: 'overdue' as const,
      queueReason: overdueReason(l, at),
    }))

  const dueToday: QueueLead[] = mine
    .filter((l) => isDueToday(l, at))
    .sort((a, b) => b.score - a.score)
    .map((l) => ({
      ...l,
      queueGroup: 'due_today' as const,
      queueReason: 'Follow-up today',
    }))

  // Copy says "Added", not "Assigned": there is no assignment timestamp on
  // the row, so created_at is lead age. Claiming otherwise would be a number
  // the schema cannot support.
  const untouched: QueueLead[] = mine
    .filter((l) => isUntouched(l, at) && !isOverdue(l, at) && !isDueToday(l, at))
    .sort((a, b) => b.score - a.score)
    .map((l) => ({
      ...l,
      queueGroup: 'untouched' as const,
      queueReason: `Added ${plural(differenceInDays(at, new Date(l.created_at)), 'day')} ago, still new`,
    }))

  return [...overdue, ...dueToday, ...untouched]
}
```

### Source bucketing

```ts
/** Under this many leads, a percentage is noise wearing a decimal point. */
export const LOW_N_THRESHOLD = 10

/**
 * Volume by source is vanity. Conversion by source decides where the ad money
 * goes, which is why this returns both and sorts on rate.
 *
 * Thin samples sort last regardless of rate. One conversion out of two is not
 * a 50% channel, and letting it top the table is how a real budget gets moved
 * on three data points.
 */
export const deriveSourcePerformance = (leads: LeadRow[]): SourceRow[] => {
  const groups = new Map<string, { total: number; converted: number }>()

  for (const l of leads) {
    if (l.deleted_at) continue
    const g = groups.get(l.source) ?? { total: 0, converted: 0 }
    g.total += 1
    if (l.stage === 'converted') g.converted += 1
    groups.set(l.source, g)
  }

  return [...groups.entries()]
    .map(([source, { total, converted }]) => ({
      source,
      label: SOURCE_LABELS[source] ?? source,
      total,
      converted,
      rate: total === 0 ? 0 : Math.round((converted / total) * 1000) / 10,
      lowN: total < LOW_N_THRESHOLD,
    }))
    .sort((a, b) => {
      if (a.lowN !== b.lowN) return a.lowN ? 1 : -1
      if (b.rate !== a.rate) return b.rate - a.rate
      return b.total - a.total
    })
}
```

### Tone banding

```ts
export type Tone = 'success' | 'warning' | 'danger' | 'neutral'

export const conversionTone = (rate: number): Tone =>
  rate >= 10 ? 'success' : rate >= 5 ? 'warning' : 'danger'

export const stalledTone = (count: number): Tone =>
  count === 0 ? 'neutral' : count <= 3 ? 'warning' : 'danger'

export const unassignedTone = (count: number): Tone =>
  count === 0 ? 'neutral' : 'danger'
```

## 4.4 `src/lib/sparkline.ts` — full exports

| Export | Signature | Computes |
|---|---|---|
| `SPARK_W` | `const = 56` | viewBox width |
| `SPARK_H` | `const = 24` | viewBox height |
| `SPARKLINE_VIEWBOX` | `` `0 0 56 24` `` | viewBox string |
| `SparkPoint` | interface `{x,y}` | — |
| `sparklinePoints` | `(values: number[]) => SparkPoint[]` | Min/max normalisation into the box; flat series pins to `SPARK_H/2` |
| `normalizeSparkline` | `(values: number[]) => string` | The above, joined as an SVG `points` attribute |
| `dailyCounts` | `(timestamps: string[], days = 7, at = new Date()) => number[]` | **BUCKETING — verbatim below** |

```ts
/**
 * Counts per day for the last `days` days, oldest first.
 *
 * Buckets are seeded before counting, so a quiet Tuesday is a zero in the
 * series rather than a missing point that would shorten the line.
 */
export function dailyCounts(timestamps: string[], days = 7, at: Date = new Date()): number[] {
  const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`

  const buckets = new Map<string, number>()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(at)
    d.setDate(d.getDate() - i)
    buckets.set(key(d), 0)
  }

  for (const ts of timestamps) {
    const k = key(new Date(ts))
    const current = buckets.get(k)
    if (current !== undefined) buckets.set(k, current + 1)
  }

  return [...buckets.values()]
}
```

## 4.5 `src/lib/chartHelpers.ts` — full exports

Pure SVG geometry. No thresholds; `weeklyLeadCounts` contains the only bucketing rule.

| Export | Signature | Computes |
|---|---|---|
| `Point` | interface | `{x,y}` |
| `smoothPath` | `(pts: Point[]) => string` | Catmull-Rom-ish cubic path |
| `closeToBaseline` | `(path, pts, baseline) => string` | Closes a line path into a fill |
| `WeekBucket` | interface | week label + counts |
| `AreaSeries` | interface | paths + points + max |
| `AREA_VIEWBOX` | `{w:300,h:120}` | area chart box |
| `weeklyLeadCounts` | `(leads, weeks, at?) => WeekBucket[]` | Week-start bucketing, seeded |
| `buildAreaSeries` | `(buckets) => AreaSeries` | Bucket array → SVG paths |
| `AREA_LABEL_Y` | `= 116` | label baseline |
| `StageBar` | interface | per-stage bar geometry |
| `buildStageBars` | `(counts: Record<LeadStage, number>) => StageBar[]` | Stage counts → bar widths |
| `DonutArc` | interface | arc geometry |
| `DONUT` | `{size:200,cx:100,cy:100,r:70,stroke:24}` | donut geometry |
| `DONUT_CIRCUMFERENCE` | `2πr` | stroke-dasharray base |
| `buildDonutArcs` | `(...) => DonutArc[]` | Source counts → dash offsets |

## 4.6 `src/lib/csv.ts`

| Export | Signature | Purity |
|---|---|---|
| `leadsToCsv` | `(leads: LeadWithRelations[]) => string` | Pure |
| `downloadCsv` | `(filename: string, csv: string) => void` | **Impure** — creates a Blob, an object URL and a synthetic `<a>` click |

## 4.7 `src/lib/utils.ts`

All pure. `normalizePhone` is the only one with branching rules:

```ts
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null

  const digits = raw.replace(/\D/g, '')
  if (!digits) return null

  // Local Nigerian format: leading 0 plus 10 digits.
  if (digits.startsWith('0') && digits.length === 11) return `234${digits.slice(1)}`

  // Already country-coded.
  if (digits.startsWith('234') && digits.length === 13) return digits

  // Bare 10-digit Nigerian subscriber number.
  if (digits.length === 10 && !digits.startsWith('0')) return `234${digits}`

  // Any other international number that is plausibly complete.
  if (digits.length >= 11 && digits.length <= 15) return digits

  return null
}
```

---

# 5. WRITE PATHS AND SIDE EFFECTS

## 5.1 Every mutation

| # | Writes | Table(s) | Hook / site | UI action | Guards |
|---|---|---|---|---|---|
| 1 | INSERT lead | `leads` (+ `notes`, `activities` if a note is supplied) | `useAddLead` — `useLeads.ts:146-190` | "Add lead" → `AddLeadModal` save | Client-side required-field check only. `stage` forced to `'new'`. Email lowercased/trimmed. **No dedupe enforcement.** |
| 2 | UPDATE `stage` (single) | `leads` | `useUpdateStage` — `useLead.ts:100-133` | Stage dropdown on `LeadDetail` / `Leads` row | None. Optimistic + rollback. |
| 3 | UPDATE `stage` (bulk) | `leads` | `useBulkUpdateStage` — `useLeads.ts:198-211` | Bulk bar in `Leads.tsx` | Returns early on empty array. No confirmation. |
| 4 | UPDATE arbitrary column | `leads` + INSERT `activities` | `useUpdateLeadField` — `useLead.ts:136-166` | Inline field edit on `LeadDetail` | **None.** `field: keyof Lead` — any column. Logs `'assigned'` when field is `assigned_to`, else `'field_updated'`. |
| 5 | INSERT note | `notes` + INSERT `activities` | `useAddNote` — `useLead.ts:63-93` | Note composer | Requires signed-in profile; rejects empty body. |
| 6 | INSERT/DELETE tag | `tags` + INSERT `activities` | `useToggleTag` — `useLead.ts:168-207` | Tag chips | Temperature tags mutually exclusive (client-enforced). |
| 7 | UPSERT tags (bulk) | `tags` + INSERT `activities[]` | `useBulkAddTag` — `useLeads.ts:218-257` | Bulk bar | Same temperature rule. `ignoreDuplicates: true`. |
| 8 | INSERT `email_sent` activity | `activities` | `useLogEmail` — `useLead.ts:210-228` | "Send email" in `EmailModal` | **Records intent only.** Payload `{to, subject, via:'mailto'}`. |
| 9 | INSERT `whatsapp_sent` activity | `activities` | `logWhatsApp` — `LeadDetail.tsx:206-219` | WhatsApp button / template pick | Fires after `window.open`. Records that a draft was opened. |
| 10 | UPDATE `deleted_at` | `leads` + INSERT `activities` | `softDelete` — `LeadDetail.tsx:228-243` | Delete in `LeadDetail` | **DB-enforced admin-only** via `leads_admin_soft_delete` (0002). Confirmation dialog in UI. |
| 11 | UPDATE `deactivated_at` | `crm_users` | `useSetDeactivated` — `useTeam.ts:43-58` | Settings row toggle | **DB-enforced** admin-only + no self-deactivation (0003). |
| 12 | RPC `invite_crm_user` | `crm_invites` | `Settings.tsx:74-78` | Invite modal | **DB-enforced** admin-only. Rejects existing members. |

**Trigger-written rows (not client mutations):** `stage_change` and `lead_created` activities, `score`, `updated_at`, `last_activity_at`, and the `crm_users` provisioning row.

## 5.2 Outbound messages and external calls

| Channel | Trigger | Recipient | Template | Throttle |
|---|---|---|---|---|
| **`mailto:`** — `EmailModal.tsx:51` | Operator clicks "Send" | `lead.email` | Operator-typed subject + body. No stored templates. | **None** |
| **`wa.me` deep link** — `LeadDetail.tsx:318` via `whatsappLink` | Operator clicks WhatsApp or a template | `normalizePhone(lead.phone)` | `WHATSAPP_TEMPLATES` array in `LeadDetail.tsx`, `message(firstName)` | **None** |
| **Sheets sync** — `Settings.tsx:129` | Admin clicks "Sync" | Apps Script URL | `{action:'sync', leads:[...]}` , 10 columns | **None** |
| **Kit newsletter** — `Footer.tsx:18` (site) | Visitor submits footer form | ConvertKit form `9676481` | `email_address` only | **None** |
| **Form POST** — `LandingForm.tsx:94`, `Stock101Page.tsx:265` | Visitor submits | Apps Script URL | Payloads in §3 | **None** |

**Neither `mailto:` nor `wa.me` sends anything.** Both hand off to an external client and open a draft. The system cannot observe a send. The code is explicit about this — `LeadDetail.tsx:205`: *"The app can see the draft open. It cannot see a send, and does not claim one."*

## 5.3 Explicit answers

> **Is there ANY mechanism that prevents contacting the same lead twice?**

**NONE.** No cooldown, no gap check, no "last contacted" comparison anywhere. The WhatsApp button and the email modal can be clicked without limit. Nothing reads prior `email_sent` or `whatsapp_sent` rows before allowing another.

> **Any per-lead action log?**

**YES — `public.activities`.** Append-only by policy (no UPDATE/DELETE policy). Records `lead_id`, `actor_id`, `type`, `payload`, `created_at`. Includes `email_sent` and `whatsapp_sent`. **It is written but never read as a guard** — no code path queries it before performing an action. It is read only for display (`useLead`, `useRecentActivity`) and for metrics (`leadsMovedTo`, `dailyCounts`).

> **Any "already acted" check?**

**NONE.** The only near-miss is `useFindLeadByEmail` (`useLeads.ts:261-276`), which checks for a duplicate **lead** at creation time in `AddLeadModal`. It is a duplicate-record check, not a duplicate-contact check, and it does not block the insert — it only surfaces a warning in the modal.

> **Any opt-out field?**

**NONE.** No `unsubscribed`, `do_not_contact`, `opted_out`, or `consent` column on `leads` or anywhere else. No such value in any CHECK constraint. The tag vocabulary (`hot`, `warm`, `cold`, `diaspora`, `nigeria`, `follow_up`) contains no suppression label. The Retirement form's footer text reads *"🔒 No spam. Just your session confirmation."* (`LandingForm.tsx:224`) — a promise with no mechanism behind it.

---

# 6. SCHEDULED AND BACKGROUND WORK

## 6.1 Finding

**There is no background execution capability of any kind in either repository.**

| Mechanism | Present? | Evidence |
|---|---|---|
| Supabase Edge Functions | **NO** | No `supabase/functions/` directory. `supabase/` contains only `migrations/`. |
| `pg_cron` | **NO** | No `create extension`… `pg_cron`, no `cron.schedule` in any migration. Only extension enabled: `uuid-ossp` (0001:7). |
| `pg_net` / outbound HTTP from Postgres | **NO** | Not enabled. |
| Vercel Cron | **NO** | `tito-crm/vercel.json` contains only a rewrites block. No `crons` key. |
| GitHub Actions | **NO** | No `.github/` directory in either repo. |
| Webhook receiver | **NO** | No serverless function, no API route. Both apps are static SPAs. |
| Queue | **NO** | No queue library, no table with a `status`/`claimed_at` shape. |
| Service worker | **NO** | None registered. |

**Everything in this system runs in a browser tab belonging to a signed-in operator.** If nobody has the CRM open, nothing executes. The one apparent exception, the Google Apps Script, is outside both trees and its trigger configuration is unknown.

The `n8n` instance referenced at `RetirementPage.tsx:1019` would be a background execution host, but that URL is passed to a prop that is never read (§9 D-1), so it receives nothing.

## 6.2 What a scheduled job would need

| Requirement | Current state | Gap |
|---|---|---|
| **Deploy target** | None exists | Choose one: Supabase Edge Function + `pg_cron` invoking `pg_net`; Vercel Cron hitting a serverless route (the CRM is a static SPA, so `api/` would be new); or an external runner (n8n, GitHub Actions). |
| **Secrets store** | None. Only `VITE_`-prefixed public vars exist. | Needs a non-`VITE_` secret path. `VITE_` is inlined into the bundle and is public by definition. |
| **DB access path** | Anon key only, client-side | A job writing leads or sending mail needs `service_role`, which does not exist in this tree. RLS policies are all `to authenticated`; a job has no session. |
| **Outbound HTTP** | None from Postgres | `pg_net` not enabled, or the job runs off-database. |
| **Idempotency store** | None | No table records "this job ran for this lead on this date". §8c. |
| **Observability** | None | No error reporting, no log sink, no dead-letter table. |

---

# 7. AUTH AND ROLES

## 7.1 Role values

Exactly two, defined by CHECK on `crm_users.role` and `crm_invites.role`:

- `'admin'`
- `'sales_rep'` (column default)

`types/database.ts:6` mirrors this as `export type CrmRole = 'admin' | 'sales_rep'`.

## 7.2 How role is resolved

1. `authStore.initialize()` (`authStore.ts:40`) calls `supabase.auth.getSession()`.
2. If a session exists, `loadProfile(userId)` (`authStore.ts:24-31`) selects the whole `crm_users` row where `id = userId`.
3. The row is held in Zustand as `profile`.
4. `useIsAdmin()` (`authStore.ts:110`) is `profile?.role === 'admin'`.
5. `onAuthStateChange` re-resolves on user change; skips the refetch on token refresh when the user id is unchanged.

**Sign-in refuses a session with no CRM profile** (`authStore.ts:86-93`): it calls `signOut()` and returns *"This account has no CRM profile yet. An admin needs to add a row to crm_users for it."*

## 7.3 What each role can do

| Capability | `sales_rep` | `admin` | Enforced where |
|---|---|---|---|
| Read all leads | ✅ | ✅ | RLS `to authenticated using (true)` |
| Read all notes / activities / tags | ✅ | ✅ | RLS |
| Read all `crm_users` | ✅ | ✅ | RLS |
| Insert lead | ✅ | ✅ | RLS |
| Update **any** lead column | ✅ | ✅ | RLS — **no ownership check** |
| Insert note (as self) | ✅ | ✅ | RLS + client sets `author_id = profile.id` |
| Insert **any** activity row | ✅ | ✅ | RLS `with check (true)` |
| Manage tags | ✅ | ✅ | RLS `for all` |
| Soft-delete a lead | ❌ | ✅ | **DB trigger** `enforce_admin_soft_delete` (0002) |
| Deactivate a member | ❌ | ✅ | **DB trigger** `enforce_admin_deactivate` (0003) |
| Deactivate self | ❌ | ❌ | Same trigger |
| Change own role | ❌ | ❌ | RLS `WITH CHECK` re-reads current role (0001) |
| Change another's role | ❌ | ⚠️ policy permits, no UI | `"Admins can update crm_users"` (0003) grants UPDATE with no column restriction |
| Invite a member | ❌ | ✅ | **RPC** `invite_crm_user` security-definer check |
| Read invites | ❌ | ✅ | RLS on `crm_invites` |
| View `/settings` | ❌ (403 surface) | ✅ | `AdminRoute` |
| View `/dashboard/rep/:id` | ❌ (403 surface) | ✅ | `AdminRoute` |
| See `CommandCenter` | ❌ | ✅ | `Dashboard.tsx:28` role split |

## 7.4 Route guards

`tito-crm/src/main.tsx`:

| Route | Component | Guard |
|---|---|---|
| `/login` | `Login` | **Public** |
| `/` | → `/leads` | `ProtectedRoute` |
| `/dashboard` | `Dashboard` (lazy) | `ProtectedRoute` |
| `/dashboard/rep/:repId` | `RepDashboard` (lazy) | `ProtectedRoute` + **`AdminRoute`** |
| `/leads` | `Leads` | `ProtectedRoute` |
| `/leads/:id` | `LeadDetail` | `ProtectedRoute` |
| `/settings` | `Settings` (lazy) | `ProtectedRoute` + **`AdminRoute`** |
| `*` | `NotFound` | `ProtectedRoute` |

`ProtectedRoute` (`ProtectedRoute.tsx:9-22`) renders a blank surface until `initialized`, then `<Navigate to="/login" replace state={{from}}>` when there is no session.

`AdminRoute` (`ProtectedRoute.tsx:26-47`) renders an `EmptyState` reading *"This area is admin only"* with a Go-back button. Not a redirect, not a blank screen.

**Guards are client-side only.** They control rendering, not data access. A `sales_rep` who calls PostgREST directly can read and update every lead, because that is what the RLS policies permit. The two genuine server-side restrictions are the soft-delete and deactivate triggers.

## 7.5 Invite flow and its current failure

**Intended flow:**
1. Admin opens Settings → Invite modal, enters name, email, role.
2. `Settings.tsx:74` calls RPC `invite_crm_user(invite_email, invite_name, invite_role)`.
3. The function (0006:61-94) verifies caller is admin, validates the role, rejects existing members, and upserts a `crm_invites` row.
4. **An admin then creates the auth user manually in the Supabase dashboard** — Settings surfaces a link built by `authUsersUrl()` (`Settings.tsx:15-20`).
5. `on_auth_user_created` fires and provisions the `crm_users` row, consuming the invite so the person gets the chosen name and role.

**The failure — step 5 never consumes the invite.**

`0006` defines `public.handle_new_user()`, which reads `crm_invites`, applies the invited `full_name` and `role`, and deletes the invite row. **`0006` never creates or repoints a trigger to it.** The only trigger on `auth.users` INSERT is still `on_auth_user_created` from `0001:135-138`, which calls `handle_new_auth_user()` — a function that does **not** read `crm_invites`.

Consequences, in order:

1. **Every invited user is provisioned as `sales_rep`**, regardless of the role chosen in the modal. `handle_new_auth_user` falls back to `raw_user_meta_data ->> 'role'` then `'sales_rep'`.
2. **The invited `full_name` is discarded.** The user gets `raw_user_meta_data.full_name` or the email local-part.
3. **`crm_invites` rows are never deleted.** The table accumulates permanently.
4. Promoting a new admin requires a manual `UPDATE crm_users SET role = 'admin'` in SQL. No UI does it.

There is also **no email delivery** at any point. `invite_crm_user` writes a row and returns JSON. No mail provider is configured in either tree. The "invite" notifies nobody; the admin must create the auth user by hand and communicate credentials out of band.

---

# 8. PORT READINESS

Assessment of ten targets against this codebase.

### a. Per-lead "already acted / do not contact" guard

**ABSENT.**

Nothing reads prior actions before acting. `activities` records `email_sent` and `whatsapp_sent` but no code path queries it as a precondition. No `do_not_contact` column, no opt-out tag, no suppression list.

**Attach point:** the guard would sit in `tito-crm/src/pages/LeadDetail.tsx` in `openWhatsApp` (line 311) and in `EmailModal.tsx` `handleSend` (line ~45), both of which currently proceed unconditionally. A durable version needs a column on `leads` (e.g. `do_not_contact boolean not null default false`) added by a new migration, surfaced through `LEAD_COLUMNS` (`useLeads.ts:29-32`) and `LeadRow` (`metrics.ts:19-31`), and a predicate in `metrics.ts` alongside `isActive`.

### b. Anti-spam minimum gap between outbound messages

**ABSENT.**

No throttle, cooldown, or rate limit exists anywhere. No `last_contacted_at` column. `last_activity_at` (0007) is the closest existing field but is bumped by **every** activity type including `note_added` and `tag_added`, so it cannot distinguish "we touched this record" from "we messaged this person".

**Attach point:** a `last_outbound_at` column maintained by a partial trigger on `activities` — the existing `update_lead_last_activity()` in `0007` is the exact shape to copy, narrowed to `NEW.type IN ('email_sent','whatsapp_sent')`. The client-side check belongs in the same two call sites as (a).

### c. At-most-once sequence step latch (step written before send)

**ABSENT.**

There is no sequence concept: no `sequence`, `step`, `campaign`, or `enrollment` table; no `status` field with a claimable state; no unique constraint that could serve as a latch. Every outbound action is a fire-and-forget `window.open` / `mailto:` with the activity row written **after** (`LeadDetail.tsx:319-320` — `window.open` then `logWhatsApp.mutate`), which is the opposite of write-before-send.

**Attach point:** a new table with `UNIQUE (lead_id, sequence_id, step_index)` is the natural latch — the existing `tags` table's `unique (lead_id, label)` (0001:105) is the precedent already in the schema. Nothing in the current code can host this; it is new surface.

### d. Deterministic lead scoring on ingest

**ALREADY EXISTS.**

`public.calculate_lead_score(public.leads)` — `supabase/migrations/0005_phase4_scoring_and_whatsapp.sql:14-51`. Declared `immutable`, pure arithmetic over `source`, `program_interest`, `stage`, and `follow_up_at is not null`. Applied by `update_lead_score()` on the `on_lead_score_update` trigger, `BEFORE INSERT OR UPDATE`, so it runs on ingest regardless of the write path — including a future service-role insert.

Range: minimum 20 (`manual`/unknown source 10 + fallback program 10 + stage `new` 0), maximum 95 (`whatsapp` 35 + `mentorship` 30 + `session_booked` 20 + follow-up 10).

**Caveat:** the two highest-weighted sources, `whatsapp` (35) and `chatbot`, have no automated producer (§2.7), so in practice ingested leads score from the `stock101` (20) and `retirement` (30) bands only.

### e. Auto-assignment of a new lead to a rep

**ABSENT.**

`leads.assigned_to` is nullable with no default. No round-robin, no load-balancing, no assignment rule anywhere. `useAddLead` (`useLeads.ts:151-165`) does not set it. `globalUnassignedCount` (`metrics.ts:183`) exists specifically to count the leads nobody picked up, which confirms the gap is known and unhandled.

Assignment happens only through `useUpdateLeadField` with `field: 'assigned_to'` (`useLead.ts:136-166`), driven by a dropdown on `LeadDetail`.

**Attach point:** a `BEFORE INSERT` trigger on `leads` is the correct home, sitting alongside `on_lead_score_update` — it must be `BEFORE` so the assignment lands in the same row write. `useCrmUsers` (`useLeads.ts:278-294`) already shows the active-rep query shape (`deactivated_at is null`). For client-side assignment instead, `useAddLead` is the attach point.

### f. Stalled / stuck lead detection and recovery

**PARTIAL.**

*Present:* detection. `isStalled(l, days = 7, at)` — `metrics.ts:64-65` — and `globalStalledCount` — `metrics.ts:186-187`. Backed by the indexed `leads.last_activity_at` column (0007) and surfaced as an alert row in `CommandCenter.tsx` linking to `/leads?filter=stalled`. `isUntouched` (`metrics.ts:67-68`, 2-day threshold on `stage = 'new'`) and `isOverdue` (`metrics.ts:70-71`) cover two adjacent cases, and `deriveQueue` (`metrics.ts:217`) orders all three into a rep worklist.

*Missing:* recovery. Detection is **read-only and browser-only**. Nothing reassigns, re-queues, escalates, or notifies. A stalled lead stays stalled until a human opens the dashboard, notices the alert row, clicks through, and acts. There is no background evaluation (§6).

**Attach point:** the predicate already exists and is pure, so recovery needs an executor, not a detector. The scheduled-job requirements in §6.2 are the blocker. If recovery runs in the database, `isStalled`'s logic must be reimplemented in SQL — `last_activity_at < now() - interval '7 days' and deleted_at is null and stage not in ('converted','closed_lost')` — which introduces a second definition that can drift from `metrics.ts:64`.

### g. Scheduled daily digest to an admin

**ABSENT.**

No scheduler (§6), no email transport (§5.2 — `mailto:` only), no digest template, no recipient configuration. Every ingredient is missing.

The **content** is nearly free, however: `useScoreboard` + `metrics.ts` already compute every figure a digest would carry (`globalStalledCount`, `globalUnassignedCount`, `globalNewThisWeek`, `deriveSourcePerformance`), and `metrics.ts` is pure, dependency-light, and would run unmodified in a Node or Deno job.

**Attach point:** `src/lib/metrics.ts` is directly reusable as the digest's computation layer. Everything else — trigger, transport, recipient, template — is new. Note `useScoreboard.ts:44-85` cannot be reused: it is a React hook and depends on the browser Supabase client.

### h. Structured webhook parsing with a sentinel for unparseable input

**ABSENT.**

There is no webhook receiver in either tree (§6). Nothing parses inbound structured input. There is no validation library (no Zod, no Yup, no Valibot in either `package.json`), no sentinel value, no quarantine table, and no `raw_payload` column on `leads` to preserve a body that failed to map.

The nearest thing is `stageTarget` (`metrics.ts:94-95`), which defensively narrows `activities.payload.to` and returns `null` when it is not a string — a sentinel pattern, but applied to reads of the app's own jsonb, not to inbound data.

**Attach point:** entirely new surface. A `raw_payload jsonb` column on `leads` would be the minimum durable landing spot, and the `payload jsonb default '{}'` column on `activities` (0001:89) is the existing precedent for storing unvalidated structure.

### i. Opt-out handling

**ABSENT.**

Covered in §5.3. No column, no tag, no CHECK value, no UI, no suppression at any send site. The Retirement form displays *"🔒 No spam. Just your session confirmation."* (`LandingForm.tsx:224`) with nothing enforcing it.

**Attach point:** same as (a) — a new column on `leads`, threaded through `LEAD_COLUMNS` (`useLeads.ts:29`), `LeadRow` (`metrics.ts:19`), and `types/database.ts:61`, then enforced at `LeadDetail.tsx:311` (`openWhatsApp`) and `EmailModal.tsx` (`handleSend`).

### j. Outbound messaging channel of any kind

**PARTIAL — and the distinction matters.**

*Present:* two **handoff** channels. `whatsappLink()` (`utils.ts:41-46`) builds a `wa.me` URL from a normalised phone number and `LeadDetail.tsx:318` opens it in a tab. `EmailModal.tsx:51` builds a `mailto:` URL. `LeadDetail.tsx` carries a `WHATSAPP_TEMPLATES` array with per-template message functions.

*Missing:* **the system cannot send anything.** Both channels open a draft in an external client that the operator must then send by hand. There is no SMTP, no Resend/SendGrid/Postmark, no WhatsApp Business API, no Twilio — no transactional provider of any kind in either `package.json`. There is no server from which a send could originate (§6). Delivery, opens, bounces and replies are all unobservable; `useLogEmail` records only that a draft was composed, and its payload marks this explicitly with `via: 'mailto'` (`useLead.ts:220`).

**Attach point:** `whatsappLink()` in `src/lib/utils.ts:41` is the correct seam for WhatsApp — every caller already routes through it, so swapping deep-link construction for an API call is a single-function change plus a transport. For email, `EmailModal.tsx:51` and `useLogEmail` (`useLead.ts:210`) are the pair to replace. Both require the server-side execution and secret storage described in §6.2, neither of which exists.

## 8.1 Summary

| Target | Verdict |
|---|---|
| a. Already-acted / do-not-contact guard | **ABSENT** |
| b. Anti-spam minimum gap | **ABSENT** |
| c. At-most-once step latch | **ABSENT** |
| d. Deterministic scoring on ingest | **ALREADY EXISTS** — `0005:14` |
| e. Auto-assignment | **ABSENT** |
| f. Stalled detection and recovery | **PARTIAL** — detection only |
| g. Scheduled daily digest | **ABSENT** |
| h. Structured webhook parsing + sentinel | **ABSENT** |
| i. Opt-out handling | **ABSENT** |
| j. Outbound messaging channel | **PARTIAL** — handoff only, cannot send |

**One of ten exists. Two are partial. Seven are absent.** The single largest structural blocker is §6: there is no place for code to run that is not a browser tab belonging to a signed-in operator.

---

# 9. DEFECTS AND CONFLICTS

## 9.1 Broken

**D-1 — `LandingForm` ignores its `webhookUrl` prop.**
`titofinance/src/components/landing/LandingForm.tsx:14` declares `webhookUrl: string` on `LandingFormProps`. Line 72 destructures `{ fields, submitLabel }` only. Line 95 hardcodes the Apps Script URL. The value passed at `RetirementPage.tsx:1019` (`https://n8n.srv1759554.hstgr.cloud/webhook/retirement-intake`) is dead. **That n8n endpoint receives nothing.**

**D-2 — The invite trigger was never repointed.**
`0006:98` defines `public.handle_new_user()` which consumes `crm_invites`. No `create trigger` statement points to it. The live trigger is still `on_auth_user_created → handle_new_auth_user()` from `0001:135-138`. Result: invited users are always provisioned `sales_rep` with a name derived from the email, invite rows are never deleted, and the role chosen in the Settings modal is silently discarded. Full analysis in §7.5.

**D-3 — The `activities` INSERT policy outlived its stated deadline.**
`0001:184-189` comments: *"The PRD (P0-6) moves this write into triggers in a later phase; at that point this INSERT policy is dropped."* `0003` added `log_stage_change` and `log_lead_created` but did not drop the policy. Any authenticated user can still insert an arbitrary activity row with any `actor_id` and any `payload`. The append-only log is tamper-resistant for edits and deletes, but **not** forgery-resistant for inserts.

**D-4 — Both lead forms report success on failure.**
`LandingForm.tsx:103` sets `submitted = true` in `try`; line 107 sets it again in `catch`. `Stock101Page.tsx:277` and `:280` are identical. Combined with `mode: 'no-cors'` (opaque response, status unreadable), an Apps Script outage, rate limit, or 500 is indistinguishable from success. **No measurement of "leads received" can be trusted, because the denominator is unknown.**

## 9.2 Contradicted — comment versus code

**D-5 — `useDashboardStats` comment describes a query it no longer serves.**
`useDashboardStats.ts:20-22`: *"One read of the two columns the dashboard actually needs…"* — the select is `'stage, source, created_at'`, which is three columns, and the dashboard no longer calls this hook at all. Its only remaining consumer is `ContextPanel.tsx`.

**D-6 — `useLeads` comment claims 200-row pagination the code does not paginate.**
`useLeads.ts:26-27`: *"at 200 rows per page it is pure weight the client never reads."* Line 62 is `.limit(200)` with no `.range()` and no cursor. There is no pagination — 200 is a hard ceiling. **Lead 201 is invisible in the inbox**, silently.

**D-7 — `metrics.ts` header claim versus `deriveQueue` reality.**
`metrics.ts:246-248` acknowledges the mismatch honestly in a comment (*"Copy says 'Added', not 'Assigned'"*), but the underlying issue stands: the untouched queue reason is computed from `created_at`, and there is no assignment timestamp anywhere in the schema. Any port that needs "time since assignment" has no column to read.

## 9.3 Duplicated — values defined twice that can drift

**D-8 — Source labels, twice.**
`metrics.ts:274-280` (`SOURCE_LABELS`) and `constants.ts:43-49` (`SOURCES`). `metrics.ts:272-273` documents the duplication deliberately (*"Must agree with SOURCES in lib/constants.ts… Duplicated rather than imported to keep this module free of React types"*). Both currently agree on all five values. Adding a sixth source requires two edits.

**D-9 — Stage colours, twice.**
`constants.ts:33-41` (badge tints, via `light-dark()`) and `chartColors.ts:42-49` / `:79-86` (saturated hues per theme). Different purposes, but a new stage requires edits in both plus `metrics.ts:343-350` (`stageCounts` literal object) plus `chartHelpers.ts` bar ordering.

**D-10 — Stage list, four times.**
The six stage strings appear in: the DDL CHECK (`0001:46-48`), `types/database.ts:15-21`, `constants.ts:33-41`, and as an explicit literal object in `metrics.ts:343-350`. Plus a hardcoded funnel order in `PipelineBar.tsx:9-16`. Five places; none derives from another.

**D-11 — The Apps Script URL, three times.**
`LandingForm.tsx:95`, `Stock101Page.tsx:268`, `Settings.tsx:22-23`. Not a shared constant, not an env var. Rotating the deployment requires three edits across two repositories.

**D-12 — Phone normalisation exists only in the CRM.**
`normalizePhone` (`utils.ts:20-39`) is applied when building `wa.me` links. The ingest path does not normalise: `phone` arrives raw from the form and is stored as typed. `leads.phone` therefore holds mixed formats, and `search_vector` (0004:36) tokenises whatever was stored.

## 9.4 Dead and unreachable

**D-13 — `handle_new_user()`** — defined, never called. See D-2.

**D-14 — `crm_invites` is write-only.** Rows are inserted by `invite_crm_user`, read by a Settings query, and never deleted (the deletion lives in the dead `handle_new_user`). It accumulates permanently.

**D-15 — `leads.source` values `'chatbot'` and `'whatsapp'` have no producer.** `ChatBot.tsx` has zero network calls. No WhatsApp inbound path exists. Both are reachable only by manual selection, yet `'whatsapp'` carries the highest score weight (35) in `calculate_lead_score`.

**D-16 — Three lead columns are written by nothing:** `age_range`, `retirement_savings`, `how_heard`. All three are collected by the public forms, all three have columns, and no code in either tree writes them — the transformation happens inside the untracked Apps Script. `retirement_savings` is additionally excluded from `SYNC_COLUMNS` (`Settings.tsx:29-30`), so the CRM→Sheets push drops it too.

**D-17 — `crm_users.avatar_url`** — never written, never read. The UI uses `initials()` everywhere.

**D-18 — `leads_stage_idx`, `leads_source_idx`, `leads_created_at_idx`** (0001) are non-partial and were superseded by partial `WHERE deleted_at is null` variants in 0002/0005/0007. The originals remain and are maintained on every write.

## 9.5 Migration state

**All seven migrations are applied in production.** Verified 2026-08-16 by two read-only PostgREST probes against the configured project using the public anon key:

- `GET /rest/v1/leads?select=id,last_activity_at&limit=1` → **HTTP 200**
- Control: `GET /rest/v1/leads?select=id,not_a_real_column&limit=1` → **HTTP 400**, `{"code":"42703","message":"column leads.not_a_real_column does not exist"}`
- Full `useScoreboard` select shape (11 columns + `deleted_at=is.null`) → **HTTP 200**

`last_activity_at` (0007, the most recent) resolves, so every earlier migration necessarily does too. Both 200s returned `[]`, which is RLS correctly withholding rows from an unauthenticated key, not an absence of data.

**Unverifiable from this tree:** whether the *trigger* objects in 0003/0005/0006/0007 exist, and whether `handle_new_user` was manually repointed in the dashboard after 0006. D-2 is a defect **in the migration file as committed**; a hand-applied fix in production would not appear here.

## 9.6 TODO / FIXME

**None.** `grep -rn "TODO\|FIXME\|XXX\|HACK"` across `src/` and `supabase/` in both repositories returns zero matches.

The single marker-style comment is `{/* TODO Step 6: <CommandCenter /> slots in here */}`, which was in `tito-crm/src/pages/Dashboard.tsx` and has since been replaced by the actual `<CommandCenter />` render. It is no longer present.

## 9.7 Security observations

| # | Observation | Location |
|---|---|---|
| S-1 | Any authenticated user can UPDATE any column of any lead. No ownership check exists in RLS. Only `deleted_at` is trigger-protected. | `0001:172-173` |
| S-2 | Any authenticated user can INSERT an activity with an arbitrary `actor_id`, forging attribution in the audit log. | `0001:188-189` |
| S-3 | `"Admins can update crm_users"` grants UPDATE with no `WITH CHECK` and no column restriction, so an admin can set any user's `role`. No UI exposes this; the capability is latent. | `0003:112-115` |
| S-4 | The Apps Script `/exec` endpoint is unauthenticated and world-writable by anyone holding the URL, which is committed in two public-site source files. | §Secrets #1, #2 |
| S-5 | The CRM sets `<meta name="robots" content="noindex, nofollow">` but `vercel.json` has **no headers block** — no `X-Robots-Tag`, no CSP, no `X-Frame-Options`. | `tito-crm/vercel.json` |
| S-6 | No rate limiting anywhere: not on the forms, not on sign-in, not on the Sheets sync. | — |

---

*End of export. Sections 1-9 complete; total under the 4000-line split threshold, so no part 2.*
