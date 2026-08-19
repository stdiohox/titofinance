# PIPELINE BUILD PLAN

**Date:** 2026-08-16
**Adds:** lifecycle engagement engine · sales tracker · membership-expiry engine
**Status:** plan only. No code written, no migration run, no existing file modified.

**Companion document:** `TITO-INFRASTRUCTURE-EXPORT.md` in this directory. Every "as-built" claim below is verified against source; where the export already establishes a fact, this plan cites the file and line rather than repeating the evidence.

**Repos:** `titofinance-main` (public site, forms) · `tito-crm` (CRM, Supabase). Paths are prefixed when ambiguous.

---

## 0. VERIFICATION LEDGER

Read this first. Six things this plan depends on cannot be verified from the tree.

| # | Claim | Status | To verify, I would need |
|---|---|---|---|
| U-1 | The Google Apps Script writes to Supabase | **UNVERIFIED** | The Apps Script source. It is not in either repo. Forms POST to it with `mode:'no-cors'` (`LandingForm.tsx:98`), so the browser cannot observe what it does. Every field→column mapping in §9 is **inferred from name similarity only**. |
| U-2 | The trigger objects from migrations 0003–0007 exist in production | **UNVERIFIED** | `SELECT tgname, tgrelid::regclass FROM pg_trigger WHERE NOT tgisinternal;` against the live DB. Column existence is confirmed (export §9.5) but a column proves the `ALTER TABLE` ran, not the `CREATE TRIGGER`. |
| U-3 | `handle_new_user` was hand-repointed in the dashboard after 0006 | **UNVERIFIED** | Same query as U-2. The committed migration never repoints it (export D-2). If someone fixed it by hand, the tree cannot show that. |
| U-4 | "E go better Savings" is an existing product | **UNVERIFIED** | It appears **nowhere** in either repository. `grep -rni "e go better\|egobetter"` returns zero matches. It exists only in the brief. |
| U-5 | "Stock 101" and the site's "Personal Financial Management 101" card are the same product | **UNVERIFIED** | `ServicesSection.tsx:122` is titled `Personal Financial Management 101`; `FreeResources.tsx:44` says `Free Ebook: Stock 101`; the CRM enum value is `'stock101'`. Three names. Titobi must confirm whether these are one product, two, or three. |
| U-6 | Current Closed Group member count and term start dates | **UNVERIFIED** | No `memberships` table exists. Terms in flight today are recorded nowhere in this system. Needed as import data (§12 Q-8). |

---

# 1. VOCABULARY RECONCILIATION

## 1.1 The three-way mismatch

There are **three** product vocabularies in play and no two agree.

| Brief's product list | CRM `program_interest` | Marketing site card title |
|---|---|---|
| Stock 101 (FREE) | `'stock101'` | `Personal Financial Management 101` (`ServicesSection.tsx:122`) — **and** `Free Ebook: Stock 101` (`FreeResources.tsx:44`). See U-5. |
| E go better Savings (FREE) | **absent** | **absent** |
| Closed Group (PAID, 6mo) | `'closed_circuit'` | `Closed Circuit Group` (`ServicesSection.tsx:218`) |
| Mentorship (PAID) | `'mentorship'` | `Mentorship` (`ServicesSection.tsx:261`) |
| Beginner Portfolio (UNDETERMINED) | `'beginner_portfolio'` | `Beginner's Portfolio` (`ServicesSection.tsx:173`) |
| **absent from brief** | `'retirement'` | `Retirement Portfolio` (`ServicesSection.tsx:349`) |
| **absent from brief** | `'quick_fire'` | `Quick Fire One-on-One` (`ServicesSection.tsx:304`) |
| **absent from brief** | `'unknown'` | n/a — sentinel |

**`retirement` is the most consequential omission.** It is not merely a `program_interest` value: it is a `source` value, a full landing page (`RetirementPage.tsx`, 1635 lines), a seven-field lead form, three dedicated `leads` columns (`age_range`, `retirement_savings`, `how_heard`), and the second-highest scoring source (30). The brief's product list does not mention it. **This plan does not retire it.** Q-1 in §12.

## 1.2 `program_interest` — disposition

| Value | Action | Reason |
|---|---|---|
| `'stock101'` | **KEEP** | Live entry point. Pending U-5 on the display label only; the stored value does not change. |
| `'retirement'` | **KEEP** | Live entry point with its own form and page. Absent from the brief; see Q-1. |
| `'mentorship'` | **KEEP** | PAID per brief. |
| `'beginner_portfolio'` | **KEEP** | Free/paid undetermined; the value is stable either way (§1a.3). |
| `'closed_circuit'` | **RENAME → `'closed_group'`** | Brief calls it "Closed Group". Requires a backfill (§1.5). Site copy at `ServicesSection.tsx:218` also changes. |
| `'quick_fire'` | **HOLD, do not retire** | Absent from the brief but live on the site and in the enum. Retiring it orphans rows (§1.5). Q-2. |
| `'unknown'` | **KEEP** | Sentinel. `AddLeadModal.tsx:23` uses it as the form default, so it is written on every manual lead where the operator does not change the dropdown. |
| — | **ADD `'savings'`** | For "E go better Savings", subject to U-4 confirming the product exists. |

## 1.3 `source` — disposition

| Value | Action | Reason |
|---|---|---|
| `'stock101'` | **KEEP** | Produced by the Stock 101 form (assuming U-1). |
| `'retirement'` | **KEEP** | Produced by the Retirement form (assuming U-1). |
| `'manual'` | **KEEP** | `AddLeadModal.tsx:22` default. |
| `'whatsapp'` | **KEEP, but see below** | **No automated producer exists** (export D-15). Manual selection only, yet it carries the highest score weight (35) in `calculate_lead_score` (`0005:23`). §3 removes that weighting. |
| `'chatbot'` | **KEEP, but see below** | Same. `ChatBot.tsx` has zero network calls — verified, `grep` for `fetch\|supabase\|localStorage` returns nothing. |
| — | **ADD `'savings'`** | If the savings product has its own capture form. Pending U-4. |
| — | **ADD `'import'`** | Needed to distinguish the Closed Group member backfill (§11 step 9) from organic leads, so those rows do not distort `deriveSourcePerformance`. |

**`source` and `program_interest` are being asked to carry the same information.** Both hold `'stock101'` and `'retirement'`. §1a.4 separates them: `source` becomes *how they arrived*, `entry_product` becomes *what they arrived for*, and `program_interest` becomes *what they are being sold*.

## 1.4 `stage` and `tags` — disposition

**`stage`: all six KEEP, no additions.** The engagement engine must not add stages. Stage transitions are free-form (any→any, export §2.7) and adding `'member'` or `'expired'` would put membership state in a column with no ordering guarantee and no ownership. Membership state belongs in `memberships` (§4.2) where it has a term window and a latch.

The one change is semantic, not structural: `'converted'` must be redefined (§1a.5).

**`tags`: all six KEEP.** Do not model consent as a tag. Consent needs a timestamp, a source, and a text record of what was agreed; a tag has none of those and `tags` has an unrestricted `for all` RLS policy (`0001:194-195`) that lets any authenticated user delete one. Consent columns go on `leads` (§4.7).

## 1.5 Every redefinition site

The DDL CHECK is one of **eight** places the program vocabulary is written. All eight change together for the `closed_circuit → closed_group` rename and the `savings` addition.

| # | File:line | What it is | Change |
|---|---|---|---|
| 1 | `tito-crm/supabase/migrations/0001_phase1_schema.sql:41-44` | `program_interest` CHECK constraint | Drop and re-add with `'closed_group'`, `'savings'`; keep `'closed_circuit'` until backfill completes, then drop it |
| 2 | `tito-crm/src/types/database.ts:23-30` | `ProgramInterest` union | Same edits |
| 3 | `tito-crm/src/lib/constants.ts:51-59` | `PROGRAMS` array (value + label) | Rename label to `Closed Group`; add `Savings` |
| 4 | `tito-crm/supabase/migrations/0005_phase4_scoring_and_whatsapp.sql:30-36` | `calculate_lead_score` program CASE | **Replaced entirely** by §3 |
| 5 | `tito-crm/src/components/AddLeadModal.tsx:23` | `program_interest: 'unknown'` default | No value change; verify the new options render |
| 6 | `tito-crm/src/pages/LeadDetail.tsx:552-558` | Inline edit dropdown, maps `PROGRAMS` | Inherits from #3, no direct edit |
| 7 | `tito-crm/src/pages/Settings.tsx:29-31` | `SYNC_COLUMNS` string for the Sheets push | Add `entry_product` if the sheet should carry it |
| 8 | `titofinance-main/src/components/ServicesSection.tsx:218` | Public card title `Closed Circuit Group` | Rename to `Closed Group` |

`programLabel` (`constants.ts:113-114`) and `csv.ts:45` read `PROGRAMS` and need no edit. `Leads.tsx:522` likewise.

**The `source` vocabulary is redefined in five places:** `0001:37-39` (CHECK), `types/database.ts:8-13`, `constants.ts:43-49` (`SOURCES`), `metrics.ts:274-280` (`SOURCE_LABELS`, duplicated deliberately — the comment at `metrics.ts:272-273` says *"Must agree with SOURCES in lib/constants.ts… Duplicated rather than imported to keep this module free of React types"*), and `chartColors.ts:35-41` + `:72-78` (per-theme hues).

**The `stage` vocabulary is redefined in five places:** `0001:46-48`, `types/database.ts:15-21`, `constants.ts:33-41`, `metrics.ts:343-350` (literal object in `stageCounts`), `PipelineBar.tsx:9-16` (funnel order), and `chartHelpers.ts:~155-160`.

## 1.6 Orphan risk and backfill

**`closed_circuit → closed_group` orphans every existing row** carrying the old value the moment the CHECK is tightened. The migration must be ordered: widen, backfill, narrow.

```sql
-- Step 1: widen the constraint to accept both old and new.
alter table public.leads drop constraint if exists leads_program_interest_check;
alter table public.leads add constraint leads_program_interest_check
  check (program_interest in (
    'stock101', 'retirement', 'mentorship', 'beginner_portfolio',
    'closed_circuit',            -- retired, retained for the backfill window
    'closed_group', 'savings', 'quick_fire', 'unknown'
  ));

-- Step 2: backfill. Writes leads.updated_at via leads_touch_updated_at (0001:149)
-- and recomputes leads.score via on_lead_score_update (0005:67). Both are
-- expected. It does NOT write an activity: log_stage_change only fires when
-- stage changes (0003:25), and stage is untouched here.
update public.leads
   set program_interest = 'closed_group'
 where program_interest = 'closed_circuit';

-- Step 3: verify zero remain, then narrow.
-- select count(*) from public.leads where program_interest = 'closed_circuit';
alter table public.leads drop constraint leads_program_interest_check;
alter table public.leads add constraint leads_program_interest_check
  check (program_interest in (
    'stock101', 'retirement', 'mentorship', 'beginner_portfolio',
    'closed_group', 'savings', 'quick_fire', 'unknown'
  ));
```

**`quick_fire` must not be retired without a decision.** If it is dropped from the CHECK while rows hold it, step 3 fails outright. If it is backfilled to `'unknown'` first, the information is destroyed with no recovery path — `activities` does not record `program_interest` history (only `field_updated` payloads from `useUpdateLeadField`, `useLead.ts:154-159`, which fire on manual edits only, not on the original ingest). Q-2.

---

# 1a. PRODUCT MODEL

## 1a.1 Classification

| Product | Class | Term | Source |
|---|---|---|---|
| Stock 101 | **FREE** | none | Brief |
| E go better Savings | **FREE** | none | Brief. Product existence UNVERIFIED (U-4). |
| Closed Group | **PAID** | **6 months** | Brief |
| Mentorship | **PAID** | **UNDETERMINED** — term or open-ended | Brief. Q-3. |
| Beginner Portfolio | **UNDETERMINED** | unknown | Brief. Q-4. |
| Retirement | **UNCLASSIFIED** | unknown | Not in the brief. Live in the code. Q-1. |
| Quick Fire | **UNCLASSIFIED** | likely one-off | Not in the brief. Live in the code. Q-2. |

## 1a.2 What each product can produce

| Product | `payments` row? | `memberships` row? | Entry point? |
|---|---|---|---|
| Stock 101 | No | No | **Yes** |
| E go better Savings | No | No | **Yes** |
| Closed Group | **Yes** | **Yes** — 6-month window | No |
| Mentorship | **Yes** | **Conditional** — see 1a.3 | No |
| Beginner Portfolio | **Conditional** | **Conditional** | Possibly — Q-4 |
| Retirement | Unknown | Unknown | **Yes** (it has a live form) |
| Quick Fire | Probably (one-off) | Probably not | No |

A free product produces neither row. That is the whole point of the split: `payments` is a money ledger and `memberships` is a term window. Enrolling a free user in either would put a zero-amount row in the revenue table and corrupt every rollup in §6.

## 1a.3 Designing for the two undetermined answers

**Mentorship term structure.** The schema in §4.2 handles both without change:

- **If termed:** insert a `memberships` row with `starts_at` and `ends_at` set. The expiry sweep (§5.2) picks it up.
- **If open-ended:** insert a `memberships` row with `ends_at IS NULL`. The expiry sweep predicate is `ends_at is not null and ends_at between ...`, so a null-ended row is simply never selected. No branch, no second table.

**What changes per answer:** nothing in the DDL. `memberships.ends_at` is already nullable. What changes is **product configuration**, which is why §4.2 puts term length in a `products` table rather than hardcoding 6 months. If Mentorship is open-ended, its `products.term_months` is `NULL`.

**Beginner Portfolio free-or-paid.** Also absorbed by configuration:

- **If FREE:** `products.is_paid = false`. It becomes eligible as an `entry_product` value, produces no `payments` row, no `memberships` row.
- **If PAID:** `products.is_paid = true`, `term_months` set or null. Everything else follows.

**What changes per answer:** if FREE, it should also be added to the `entry_product` allowed set and given a scoring weight in §3 as an entry point. If PAID, it gets a price and stays out of `entry_product`. That is a data change in `products`, not a schema change — **except** the `entry_product` CHECK constraint, which is the one place the answer is baked into DDL. §4.7 therefore defines `entry_product` as a FK to `products.code` rather than a CHECK, so the answer becomes a row rather than a migration.

## 1a.4 Capturing entry product at ingest

**Today it is not captured.** Verified: neither form posts a product field. Stock 101 posts `{form_type, fullName, email, phone, location, howHeard}` (`Stock101Page.tsx:253-260`); Retirement posts the same plus `ageRange` and `retirementSavings` (`LandingForm.tsx:81-90`). `form_type` is the only product-adjacent field, and on the Retirement form it is **hardcoded to the literal `'retirement'`** (`LandingForm.tsx:82`) in a component that is otherwise generic — so any future page reusing `LandingForm` mislabels its leads silently (export D-1 neighbourhood).

**Two viable designs.**

**Design A — derive `entry_product` from `source` in the database.** A trigger maps `source='stock101' → entry_product='stock101'`. No form change.
*Against:* it only works while `source` and product are 1:1. The brief's funnel says two free entry points feed one community, so the moment the savings product ships on a shared page, or a lead arrives by WhatsApp having read the Stock 101 ebook, the mapping is wrong. It also cannot distinguish "arrived via the Stock 101 form" from "arrived via a Stock 101 ad but filled the retirement form".

**Design B — the form posts `entry_product` explicitly, and it is a required, validated field at ingest.** ✅ **Chosen.**
*For:* the brief states entry product is "the strongest available predictor of what someone buys". A predictor that is derived from a proxy is a proxy. Making it explicit also fixes `LandingForm.tsx:82`'s hardcoded `form_type` in the same edit, because both become props.

**Implementation, three edits:**

1. `LandingForm.tsx` — accept `formType: string` and `entryProduct: string` as props, use them at line 82 instead of the literal, and **actually read `webhookUrl`** (declared at line 14, never destructured at line 72 — export D-1).
2. `RetirementPage.tsx:1018-1045` and `Stock101Page.tsx:253-260` — pass the values.
3. The ingest endpoint (§9) validates `entry_product` against `products.code` and rejects unknown values with a 422 rather than defaulting.

**Never default `entry_product` to `'unknown'` at ingest.** A silent default produces a column that looks populated and predicts nothing. Reject and alert instead (§9.2).

## 1a.5 What "converted" must mean now

`'converted'` is currently a `leads.stage` value with **no definition of what was converted to**. It is used as a success metric in **nine** places:

| # | File:line | Use |
|---|---|---|
| 1 | `metrics.ts:153-154` | `repConversionRate` — all-time converted / assigned |
| 2 | `metrics.ts:167-168` | `globalConvertedThisMonth` — via `leadsMovedTo` on activities |
| 3 | `metrics.ts:141` | `repConvertedThisMonth` — same, per rep |
| 4 | `metrics.ts:178-179` | `globalConversionRate` — rolling 30d |
| 5 | `metrics.ts:300` | `deriveSourcePerformance` — converted per source |
| 6 | `metrics.ts:62` | `isActive` — treats converted as *not* open work |
| 7 | `useDashboardStats.ts:40` | `converted` count (legacy; only `ContextPanel` consumes it) |
| 8 | `ContextPanel.tsx:52` | Conversion rate in the right rail |
| 9 | `CommandCenter.tsx:288,308,469,483,588` | Roster column, stat card, filter links |

**The problem the brief creates.** With free products in the funnel, a lead who joins the free savings product has "converted" in the sense of taking the next step, and a lead who pays for Closed Group has "converted" in the sense that pays rent. Collapsing both into one stage value makes every one of the nine sites ambiguous, and #5 in particular — conversion by source — is explicitly described in `metrics.ts:286-287` as the number that *"decides where the ad money goes"*.

**Recommendation: `stage='converted'` keeps its current meaning of "reached the end of the sales conversation", and revenue gets its own metric that never reads `stage` at all.**

- Sites #1–#9 keep working unchanged and keep meaning *pipeline* conversion.
- New functions in §6 (`revenueByRep`, `revenueByProduct`, `inflowMTD`, `renewalRate`) read `payments` and `memberships` exclusively. **A paid conversion is a `payments` row, not a stage.**
- The one addition: `paidConversionRate` alongside `globalConversionRate`, reading `payments`, so the CEO screen can show both and the difference between them is itself the interesting number.

**Rejected alternative:** adding stages `'converted_free'` and `'converted_paid'`. It would touch all five stage-vocabulary sites (§1.5), break the existing `'converted'` filter links at `CommandCenter.tsx:474,483`, and still not answer "how much", which is the actual question. Money belongs in a ledger.

---

# 2. IDENTITY INTEGRITY

## 2.1 How duplicates exist today

**`leads.email` has no unique constraint.** Verified in the resolved DDL: `email text` with no `UNIQUE` and no partial unique index (`0001:34`; the full index list is export §2.6 — there are twelve indexes on `leads` and none is unique on `email`).

Four concrete paths to a duplicate person:

1. **The same person fills both forms.** Stock 101 then Retirement produces two `leads` rows with the same email, different `source`, different `program_interest`. This is the expected funnel behaviour described in the brief ("two free entry points feed one community"), so it is not an edge case — it is the main case.
2. **Manual entry over an existing lead.** `useFindLeadByEmail` (`useLeads.ts:261-276`) exists and is called from `AddLeadModal`, but it only **surfaces a warning**; `useAddLead` (`useLeads.ts:151-165`) performs the insert unconditionally. There is no `upsert`, no `onConflict`.
3. **Case and whitespace.** `useAddLead` lowercases and trims (`useLeads.ts:158`), but the ingest path does not — U-1 means the Apps Script's normalisation is unknown. `Titobi@x.com` and `titobi@x.com` would be two rows.
4. **Phone-only leads.** `email` is nullable. A WhatsApp-sourced lead may have a phone and no email, and phone is stored raw with no normalisation at ingest (`normalizePhone` exists at `utils.ts:20-39` but is applied only when *building* `wa.me` links, never on write).

## 2.2 Dedupe query

Run before adding any constraint. Read-only.

```sql
-- Duplicate clusters by normalised email, live rows only.
select
  lower(trim(email))                                as norm_email,
  count(*)                                          as row_count,
  array_agg(id order by created_at)                 as lead_ids,
  array_agg(source order by created_at)             as sources,
  array_agg(stage order by created_at)              as stages,
  array_agg(assigned_to order by created_at)        as assignees,
  min(created_at)                                   as first_seen,
  max(last_activity_at)                             as last_touched
from public.leads
where deleted_at is null
  and email is not null
  and trim(email) <> ''
group by lower(trim(email))
having count(*) > 1
order by count(*) desc, min(created_at);

-- Phone-based duplicates, which the email query cannot see.
-- Digits-only comparison mirrors normalizePhone's first step (utils.ts:23)
-- but NOT its Nigerian branches, so this over-groups rather than under-groups.
select
  regexp_replace(phone, '\D', '', 'g')  as digits,
  count(*)                              as row_count,
  array_agg(id)                         as lead_ids
from public.leads
where deleted_at is null
  and phone is not null
  and length(regexp_replace(phone, '\D', '', 'g')) >= 10
group by 1
having count(*) > 1;
```

## 2.3 Constraint to add

```sql
-- Partial unique: soft-deleted rows must be allowed to collide with a live
-- row of the same email, or an admin could never delete a duplicate.
create unique index if not exists leads_email_unique_live
  on public.leads (lower(trim(email)))
  where deleted_at is null and email is not null;
```

**Not a table constraint.** `UNIQUE (email)` cannot express the `deleted_at is null` predicate or the `lower(trim())` normalisation. A partial unique index does both and is what PostgREST's `on_conflict` needs to perform an upsert.

**The constraint alone is not enough.** Ingest must become an upsert. With a bare unique index, the second form submission from the same person raises `23505` and the Apps Script's `no-cors` response makes that failure invisible to the visitor (export D-4) — the lead is silently lost. §9 specifies upsert-on-conflict merge semantics: append the new `program_interest` to a history, fill null qualification fields, never overwrite a value a rep has edited, never reset `stage`.

## 2.4 What breaks if payments land before this

Stated plainly, worst first:

1. **Revenue is double-counted or split.** A person with two `leads` rows who pays once gets a `payments` row against one of them. `revenueByRep` (§6) attributes it to whichever row carries `assigned_to`. If both rows are assigned to different reps, the rollups disagree and there is no way to tell which is right.
2. **Membership expiry fires against the wrong row.** A `memberships` row hangs off `lead_id`. If the member's canonical row is the other duplicate, the expiry sweep (§5.2) emails a lead who is not the member, and the actual member's term lapses with no notice.
3. **Merging becomes destructive.** Once `payments.lead_id` and `memberships.lead_id` are `REFERENCES leads(id)`, merging duplicates means re-parenting financial rows. With `on delete cascade` (§4.1) a careless merge **deletes payment history**. Before money exists, a merge is a soft-delete and a note.
4. **The at-most-once latch splits.** `sequence_sends` is keyed on `(enrollment_id, step_id)` and enrollments hang off `lead_id`. Two rows for one person means two enrollments means **two copies of every lifecycle message to the same inbox** — the exact failure the brief's idempotency requirement exists to prevent.

**Therefore: §2.3 is a hard prerequisite for §4. It is step 2 in §11 and nothing involving money may precede it.**

---

# 3. SCORING REWRITE

## 3.1 Verifying the constant-per-source claim

`calculate_lead_score` (`0005:14-51`) reads four fields. Its behaviour at ingest:

| Field read | Value at ingest | Why |
|---|---|---|
| `source` | `'stock101'` or `'retirement'` | The only two `form_type` values the forms post. Assumes U-1. |
| `program_interest` | **NULL** | Neither form posts it. Verified: payload shapes at `Stock101Page.tsx:253-260` and `LandingForm.tsx:81-90` contain no such field. |
| `stage` | `'new'` | Column default (`0001:46`). |
| `follow_up_at` | **NULL** | Column default (`0004:11`). No ingest path sets it. |

A SQL `CASE … WHEN` never matches NULL, so a null `program_interest` falls to `ELSE 10`.

**Arithmetic per entry product:**

| Entry product | source | program | stage | follow-up | **Total** |
|---|---|---|---|---|---|
| Stock 101 (ingested) | 20 | 10 (NULL→ELSE) | 0 (`new`→ELSE) | 0 | **30** |
| Retirement (ingested) | 30 | 10 (NULL→ELSE) | 0 | 0 | **40** |
| Manual entry (`AddLeadModal` defaults) | 10 (`manual`) | 10 (`'unknown'`→ELSE) | 0 | 0 | **20** |
| E go better Savings | n/a — no `source` value exists | — | — | — | **n/a** |

**Claim confirmed.** Every ingested lead scores exactly 30 or 40. The score carries **one bit of information** — which form was filled — and that bit is already in `source`, indexed at `leads_source_idx`. The function is currently a rename of `source`.

Two further consequences:

- The two highest-weighted sources, `'whatsapp'` (35) and `'chatbot'`, have **no automated producer** (export D-15). The top of the scoring range is unreachable by ingest.
- `ContextPanel.tsx:51` filters `score >= 70` for its "hot leads" list. **No ingested lead can ever reach 70.** Maximum reachable at ingest is 40. That list can only populate after a rep manually sets `program_interest` and moves the stage — i.e. it shows leads a human already worked, not leads worth working.

## 3.2 What the forms already collect and discard

Both forms collect fields with matching columns that **nothing writes** (export D-16):

| Collected | Column | Written by |
|---|---|---|
| `location` | `leads.location` | Nothing (in-tree) |
| `howHeard` | `leads.how_heard` | Nothing |
| `ageRange` (retirement only) | `leads.age_range` | Nothing |
| `retirementSavings` (retirement only) | `leads.retirement_savings` | Nothing |

These are the highest-value scoring inputs available and all four are thrown away. `retirement_savings` in particular is a direct capacity-to-pay signal with four ordered values (`None yet`, `Just started`, `Have some`, `Well invested`, `RetirementPage.tsx:1036`).

## 3.3 The rewrite

Design constraints from the brief: deterministic, no LLM. Plus `IMMUTABLE` and firing on every write path.

```sql
-- Replaces 0005:14-51. Same name and signature, so the existing
-- update_lead_score() trigger function and the on_lead_score_update trigger
-- (0005:67-69, BEFORE INSERT OR UPDATE) bind to it with no change.
--
-- IMMUTABLE is retained and is still correct: the function reads only fields
-- of the row passed to it. It calls now(), no sequences, no other tables.
-- Adding a lookup against products(code) here would BREAK immutability, which
-- is why entry-product weights are a CASE and not a join.
create or replace function public.calculate_lead_score(lead_row public.leads)
returns integer
language plpgsql
immutable
as $$
declare
  s integer := 0;
begin
  -- 1. ENTRY PRODUCT (0-30). The brief's stated strongest predictor.
  --    NULL scores 0, not a default: an unknown entry product is an absence
  --    of signal, and paying it 10 points would make it indistinguishable
  --    from a weak-but-known one.
  s := s + case lead_row.entry_product
    when 'mentorship'         then 30
    when 'closed_group'       then 28
    when 'beginner_portfolio' then 20   -- provisional, see Q-4
    when 'retirement'         then 18
    when 'stock101'           then 12
    when 'savings'            then 10
    else 0
  end;

  -- 2. CAPACITY (0-25). retirement_savings is the only direct
  --    capacity-to-pay signal either form collects. Retirement form only;
  --    NULL for a Stock 101 lead, which scores 0 rather than a default.
  s := s + case lead_row.retirement_savings
    when 'Well invested' then 25
    when 'Have some'     then 18
    when 'Just started'  then 10
    when 'None yet'      then 4
    else 0
  end;

  -- 3. GEOGRAPHY (0-15). Diaspora currency capacity. Values are the exact
  --    option strings both forms post (Stock101Page.tsx:317-322 select,
  --    RetirementPage.tsx:1030).
  s := s + case lead_row.location
    when 'United Kingdom' then 15
    when 'United States'  then 15
    when 'Canada'         then 14
    when 'Other'          then 8
    when 'Nigeria'        then 6
    else 0
  end;

  -- 4. CHANNEL QUALITY (0-10). How they heard. A referral outperforms a
  --    cold ad impression. Values from the shared howHeard option list.
  s := s + case lead_row.how_heard
    when 'Friend'    then 10
    when 'WhatsApp'  then 8
    when 'YouTube'   then 6
    when 'Instagram' then 4
    when 'TikTok'    then 3
    when 'Other'     then 2
    else 0
  end;

  -- 5. AGE BAND (0-10). Retirement form only. Proximity to the decision.
  s := s + case lead_row.age_range
    when '46-55' then 10
    when '36-45' then 8
    when '55+'   then 7
    when '25-35' then 5
    else 0
  end;

  -- 6. PIPELINE PROGRESS (0-10). Deliberately reduced from the old 0-20.
  --    Stage is what a rep DID, not what the lead IS. Weighting it heavily
  --    made the score a restatement of the pipeline column beside it.
  s := s + case lead_row.stage
    when 'session_booked' then 10
    when 'nurturing'      then 7
    when 'contacted'      then 4
    else 0
  end;

  -- 7. COMMITMENT (0-5). A scheduled follow-up is a weak positive.
  if lead_row.follow_up_at is not null then
    s := s + 5;
  end if;

  -- 8. SUPPRESSION. An opted-out lead is not a prospect at any score.
  --    Zeroing rather than subtracting keeps every downstream band
  --    (ContextPanel.tsx:51, SCORE_BANDS in constants.ts:108-112) correct
  --    without any of them learning about consent.
  if lead_row.opted_out_at is not null then
    return 0;
  end if;

  return s;   -- range 0 .. 105
end;
$$;
```

### Weightings summary

| Component | Range | Rationale |
|---|---|---|
| Entry product | 0–30 | Brief: strongest available predictor |
| Capacity (`retirement_savings`) | 0–25 | Only direct ability-to-pay signal collected |
| Geography (`location`) | 0–15 | Diaspora currency capacity |
| Channel (`how_heard`) | 0–10 | Referral vs cold |
| Age band (`age_range`) | 0–10 | Decision proximity |
| Stage | 0–10 | Reduced from 20; describes rep effort, not lead quality |
| Follow-up set | 0–5 | Weak positive |
| **Maximum** | **105** | |
| Opted out | **0** | Hard override |

**`source` is deliberately dropped as an input.** It was worth 10–35 and is now worth nothing, because `entry_product` supersedes it and because two of its five values (`whatsapp`, `chatbot`) had no producer while carrying the highest weights. Keeping both would double-count the same signal.

### Tier boundaries

Tier selects **copy variant only** — it does not branch the sequence (brief).

| Tier | Score | Rationale |
|---|---|---|
| **A — Hot** | ≥ 70 | Preserves the existing `ContextPanel.tsx:51` threshold so that list keeps working, and is now actually reachable at ingest (a UK "Well invested" mentorship lead scores 30+25+15+10 = 80 before any rep touches it). |
| **B — Warm** | 40–69 | |
| **C — Cool** | 20–39 | |
| **D — Cold** | < 20 | Includes every opted-out lead at 0. |

**Tier is not stored.** It is derived in `metrics.ts` (§6) from the score, so a boundary change is one edit in one pure file and needs no backfill. Storing it would create a second definition (§6.4).

### Backfill

```sql
-- Recomputes every row against the new function. The trigger would do this
-- lazily on next write; this makes it immediate so the dashboards are not
-- reading a mix of old and new scores.
--
-- Fires leads_touch_updated_at (0001:149) on every row. Does NOT fire
-- log_stage_change (0003:38) because stage is unchanged, so no spurious
-- activity rows and no last_activity_at churn via on_activity_created
-- (0007). Verify that reasoning against U-2 before running.
update public.leads
   set score = public.calculate_lead_score(leads.*);
```

### Confirmations

- **Stays `IMMUTABLE`** — reads only fields of the passed row; no table access, no `now()`, no sequence. Entry-product weights are a `CASE`, not a join to `products`, specifically to preserve this.
- **Still fires on every write path** — the trigger `on_lead_score_update` (`0005:67-69`) is `BEFORE INSERT OR UPDATE FOR EACH ROW`, unchanged. It applies to client inserts, the future service-role ingest, and bulk updates alike. Subject to U-2.
- **New columns required first** — `entry_product` and `opted_out_at` (§4.7). The function will not compile until they exist.

---

# 4. SCHEMA — MIGRATION `0008`

One migration. Order within it matters: `products` before anything referencing it, `leads` columns before the scoring rewrite.

## 4.0 Why `payments` must not reuse `activities`

Three reasons, the first decisive.

**1. Anyone can forge an activity row.** `0001:188-189`:

```sql
create policy "Authenticated users can insert activities"
  on public.activities for insert to authenticated with check (true);
```

`with check (true)` means any authenticated user — every `sales_rep` — can insert an activity row with **any `actor_id`** and **any `payload`**. A rep could write a payment attributed to another rep, or to themselves, with any amount. For a message log that is a tolerable weakness; for a money ledger it is disqualifying. §4.1 pins `recorded_by` to `auth.uid()` in `WITH CHECK`, which this policy conspicuously does not do.

Note the 0001 comment above that policy said it would be dropped once triggers took over: *"The PRD (P0-6) moves this write into triggers in a later phase; at that point this INSERT policy is dropped."* Migration 0003 added the triggers and **did not drop the policy** (export D-3). The comment and the code disagree; the code is what runs.

**2. `payload` is untyped `jsonb` with no validation.** `activities.payload jsonb default '{}'` (`0001:89`). An amount stored there is a JSON number — IEEE 754 double — which is the float representation the brief forbids. There is no way to add a CHECK on a jsonb key that Postgres will enforce usefully across all rows.

**3. There is no correction path.** `activities` has no UPDATE and no DELETE policy, which is right for a log and wrong for money: a mistyped amount could never be voided. §4.1 handles this with an explicit `voided_at` + `void_reason` written by an admin, which is an append of intent rather than an edit.

## 4.1 `products` and `payments`

```sql
-- ---------------------------------------------------------------------------
-- products — the catalogue. A row, not a CHECK, so answering Q-3 and Q-4
-- is an INSERT/UPDATE rather than a migration (see 1a.3).
-- ---------------------------------------------------------------------------
create table public.products (
  code         text primary key,
  label        text not null,
  is_paid      boolean not null,
  is_entry     boolean not null default false,
  -- NULL means open-ended. This is how Mentorship absorbs either answer
  -- to Q-3 with no schema change.
  term_months  integer check (term_months is null or term_months > 0),
  -- Minor units. NULL where price is not yet decided (Q-5).
  list_amount  bigint check (list_amount is null or list_amount >= 0),
  currency     text check (currency is null or currency ~ '^[A-Z]{3}$'),
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table public.products enable row level security;

-- Every authenticated operator needs the catalogue to render a product picker.
create policy "Authenticated users can read products"
  on public.products for select to authenticated using (true);

-- Catalogue changes are a pricing decision, not a rep action.
create policy "Admins can write products"
  on public.products for all to authenticated
  using (exists (select 1 from public.crm_users u
                 where u.id = auth.uid() and u.role = 'admin'))
  with check (exists (select 1 from public.crm_users u
                      where u.id = auth.uid() and u.role = 'admin'));

-- Seed. Amounts deliberately NULL pending Q-5; is_paid/term per §1a.1.
-- beginner_portfolio and the two unclassified products carry NULL is_paid
-- placeholders resolved by Q-1/Q-2/Q-4 before any payment is recorded.
insert into public.products (code, label, is_paid, is_entry, term_months) values
  ('stock101',           'Stock 101',           false, true,  null),
  ('savings',            'E go better Savings', false, true,  null),
  ('closed_group',       'Closed Group',        true,  false, 6),
  ('mentorship',         'Mentorship',          true,  false, null),  -- Q-3
  ('beginner_portfolio', 'Beginner Portfolio',  true,  false, null),  -- Q-4
  ('retirement',         'Retirement',          false, true,  null),  -- Q-1
  ('quick_fire',         'Quick Fire',          true,  false, null)   -- Q-2
on conflict (code) do nothing;

-- ---------------------------------------------------------------------------
-- payments — append-only money ledger
-- ---------------------------------------------------------------------------
create table public.payments (
  id            uuid primary key default uuid_generate_v4(),
  lead_id       uuid not null references public.leads(id) on delete restrict,
  product_code  text not null references public.products(code),

  -- Minor units, never float. 50000 NGN = 5000000. bigint, not integer:
  -- NGN minor units overflow int4 above ~21.5m naira.
  amount_minor  bigint not null check (amount_minor > 0),
  currency      text   not null check (currency ~ '^[A-Z]{3}$'),

  paid_at       timestamptz not null,
  method        text check (method in ('transfer','card','cash','crypto','other')),
  reference     text,

  -- Corrections are a void write, never an edit or a delete.
  voided_at     timestamptz,
  void_reason   text,
  voided_by     uuid references public.crm_users(id),

  recorded_by   uuid not null references public.crm_users(id),
  created_at    timestamptz not null default now(),

  constraint payments_void_complete check (
    (voided_at is null and void_reason is null and voided_by is null) or
    (voided_at is not null and void_reason is not null and voided_by is not null)
  )
);

-- on delete restrict, NOT cascade: deleting a lead must never delete money.
-- leads uses soft delete (0002) so this should never fire, but if someone
-- ever hard-deletes a lead the ledger refuses rather than losing history.

create index payments_lead_idx     on public.payments (lead_id, paid_at desc);
create index payments_product_idx  on public.payments (product_code, paid_at desc);
create index payments_paid_at_idx  on public.payments (paid_at desc) where voided_at is null;
create index payments_recorder_idx on public.payments (recorded_by, paid_at desc);
-- Partial: rollups always exclude voids, so index only the live rows.
create index payments_live_idx     on public.payments (paid_at desc, product_code)
  where voided_at is null;
-- Duplicate-entry guard: the same reference cannot be banked twice.
create unique index payments_reference_unique
  on public.payments (lower(trim(reference)))
  where reference is not null and trim(reference) <> '' and voided_at is null;

alter table public.payments enable row level security;

-- Every operator sees revenue; the sales tracker is a shared board, matching
-- the existing all-read posture on leads (0001:166-167).
create policy "Authenticated users can read payments"
  on public.payments for select to authenticated using (true);

-- recorded_by is PINNED to auth.uid(). This is the specific control the
-- activities policy lacks (§4.0 reason 1): a rep cannot bank a payment in
-- another rep's name, so revenueByRep cannot be gamed.
create policy "Authenticated users can record a payment"
  on public.payments for insert to authenticated
  with check (recorded_by = auth.uid() and voided_at is null);

-- Void only, and only by an admin. USING restricts which rows are reachable;
-- WITH CHECK restricts what they may become, so an admin can void a live row
-- but cannot un-void, re-date, or re-price one.
create policy "Admins can void a payment"
  on public.payments for update to authenticated
  using (voided_at is null
         and exists (select 1 from public.crm_users u
                     where u.id = auth.uid() and u.role = 'admin'))
  with check (voided_at is not null and voided_by = auth.uid());

-- NO DELETE POLICY. Deliberate and permanent.
```

**Amount immutability caveat.** The void policy's `WITH CHECK` constrains `voided_at` and `voided_by` but Postgres RLS cannot express "and no other column changed". A determined admin could void and alter `amount_minor` in the same statement. Closing this needs a `BEFORE UPDATE` trigger raising on any change to `amount_minor`, `currency`, `paid_at`, `lead_id`, or `product_code` — the same shape as `enforce_admin_soft_delete` (`0002:21-39`). **Include it**; noted here because the policy alone reads stronger than it is.

## 4.2 `memberships`

```sql
create table public.memberships (
  id            uuid primary key default uuid_generate_v4(),
  lead_id       uuid not null references public.leads(id) on delete restrict,
  product_code  text not null references public.products(code),

  starts_at     timestamptz not null,
  -- NULL = open-ended. This is the whole of the Q-3 accommodation: the
  -- expiry sweep predicate requires `ends_at is not null`, so an open-ended
  -- membership is simply never selected. No branch, no second table.
  ends_at       timestamptz,

  -- The payment that opened this term. NULL for the Closed Group backfill
  -- (§11 step 9), where members exist but historic payments were never
  -- recorded in this system.
  payment_id    uuid references public.payments(id) on delete set null,

  -- Set when a later membership supersedes this one. Renewal is a new row,
  -- never an extension of ends_at, so the term history stays auditable.
  renewed_by    uuid references public.memberships(id) on delete set null,

  cancelled_at  timestamptz,
  cancel_reason text,

  created_by    uuid not null references public.crm_users(id),
  created_at    timestamptz not null default now(),

  constraint memberships_window check (ends_at is null or ends_at > starts_at)
);

create index memberships_lead_idx    on public.memberships (lead_id, starts_at desc);
create index memberships_product_idx on public.memberships (product_code);
-- The expiry sweep's exact predicate (§5.2), so it is one index scan.
create index memberships_expiry_idx  on public.memberships (ends_at)
  where ends_at is not null and cancelled_at is null and renewed_by is null;

-- At most one live term per person per product. Prevents a double-charge
-- producing two overlapping windows and therefore two expiry ladders.
create unique index memberships_one_live_per_product
  on public.memberships (lead_id, product_code)
  where cancelled_at is null and renewed_by is null;

alter table public.memberships enable row level security;

-- Reps need to see who is a member before they pitch.
create policy "Authenticated users can read memberships"
  on public.memberships for select to authenticated using (true);

-- Same pinning rationale as payments: creator is the acting operator.
create policy "Authenticated users can create a membership"
  on public.memberships for insert to authenticated
  with check (created_by = auth.uid());

-- Cancel and renew are updates. Admin-only: ending a paid term early is a
-- commercial decision.
create policy "Admins can update memberships"
  on public.memberships for update to authenticated
  using (exists (select 1 from public.crm_users u
                 where u.id = auth.uid() and u.role = 'admin'))
  with check (exists (select 1 from public.crm_users u
                      where u.id = auth.uid() and u.role = 'admin'));

-- NO DELETE POLICY.
```

## 4.3 `sequence_steps` — cadence as data

```sql
-- Cadence is a table, not workflow topology (brief). Changing the cadence is
-- an UPDATE, never an n8n edit and never a Wait node.
create table public.sequence_steps (
  id            uuid primary key default uuid_generate_v4(),
  sequence_code text not null,
  step_index    integer not null check (step_index >= 0),

  -- Offset from enrollment, not from the previous step: a step inserted in
  -- the middle then cannot silently shift every later step's due date.
  delay_hours   integer not null check (delay_hours >= 0),

  channel       text not null check (channel in ('email','whatsapp')),
  -- Copy is per tier (brief: tier selects the copy variant only).
  template_key  text not null,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),

  unique (sequence_code, step_index)
);

create index sequence_steps_active_idx
  on public.sequence_steps (sequence_code, step_index)
  where active;

alter table public.sequence_steps enable row level security;

-- Reps must be able to see what the system will send before it sends it.
create policy "Authenticated users can read sequence steps"
  on public.sequence_steps for select to authenticated using (true);

-- Editing cadence changes what every lead receives. Admin only.
create policy "Admins can write sequence steps"
  on public.sequence_steps for all to authenticated
  using (exists (select 1 from public.crm_users u
                 where u.id = auth.uid() and u.role = 'admin'))
  with check (exists (select 1 from public.crm_users u
                      where u.id = auth.uid() and u.role = 'admin'));
```

## 4.4 `sequence_enrollments`

```sql
create table public.sequence_enrollments (
  id            uuid primary key default uuid_generate_v4(),
  lead_id       uuid not null references public.leads(id) on delete cascade,
  sequence_code text not null,

  enrolled_at   timestamptz not null default now(),
  -- Frozen at enrollment. The brief says tier selects copy only; freezing it
  -- means a lead does not switch voice mid-sequence because a rep edited a
  -- field and the score moved.
  tier          text not null check (tier in ('A','B','C','D')),

  completed_at  timestamptz,
  -- Why it stopped early. 'replied' is written by the classifier (§8.2).
  exited_at     timestamptz,
  exit_reason   text check (exit_reason in
                  ('replied','converted','opted_out','bounced','manual','superseded')),

  created_at    timestamptz not null default now()
);

-- One live enrollment per lead per sequence. THE structural guard against
-- double-messaging: a second enrollment is refused by the database, not by
-- application logic.
create unique index enrollments_one_live
  on public.sequence_enrollments (lead_id, sequence_code)
  where completed_at is null and exited_at is null;

create index enrollments_live_idx
  on public.sequence_enrollments (sequence_code, enrolled_at)
  where completed_at is null and exited_at is null;

alter table public.sequence_enrollments enable row level security;

-- Reps need to see which sequence a lead is in before contacting them.
create policy "Authenticated users can read enrollments"
  on public.sequence_enrollments for select to authenticated using (true);

-- Enrollment and exit are performed by the sweep under service_role, which
-- bypasses RLS. A rep may exit a lead manually from the UI (§10).
create policy "Authenticated users can update enrollments"
  on public.sequence_enrollments for update to authenticated
  using (true) with check (true);

-- NO INSERT POLICY for authenticated. Enrollment is a system act.
-- NO DELETE POLICY.
```

## 4.5 `sequence_sends` — the at-most-once latch

```sql
-- Written BEFORE the send, never after (brief). The unique index IS the
-- latch: a second attempt raises 23505 and the sweep skips it.
create table public.sequence_sends (
  id            uuid primary key default uuid_generate_v4(),
  enrollment_id uuid not null references public.sequence_enrollments(id) on delete cascade,
  step_id       uuid not null references public.sequence_steps(id) on delete restrict,
  lead_id       uuid not null references public.leads(id) on delete cascade,

  -- claimed -> sent | failed. Never back to claimed.
  status        text not null default 'claimed'
                check (status in ('claimed','sent','failed')),
  channel       text not null check (channel in ('email','whatsapp')),

  claimed_at    timestamptz not null default now(),
  sent_at       timestamptz,
  failed_at     timestamptz,
  error         text,
  provider_id   text,          -- Resend message id, for webhook correlation

  created_at    timestamptz not null default now()
);

-- THE IDEMPOTENCY KEY. One row per (enrollment, step), forever.
create unique index sends_once
  on public.sequence_sends (enrollment_id, step_id);

create index sends_lead_idx     on public.sequence_sends (lead_id, claimed_at desc);
-- Finds crashed claims (§5.4).
create index sends_stuck_idx    on public.sequence_sends (claimed_at)
  where status = 'claimed';
create index sends_provider_idx on public.sequence_sends (provider_id)
  where provider_id is not null;

alter table public.sequence_sends enable row level security;

-- The timeline must show what was sent. Read-only to operators.
create policy "Authenticated users can read sends"
  on public.sequence_sends for select to authenticated using (true);

-- NO INSERT, NO UPDATE, NO DELETE for authenticated. The latch is written
-- exclusively by the sweep under service_role. An operator who could insert
-- here could release the latch and cause a duplicate send.
```

## 4.6 `membership_notifications` — milestone latch

```sql
create table public.membership_notifications (
  id             uuid primary key default uuid_generate_v4(),
  membership_id  uuid not null references public.memberships(id) on delete cascade,
  milestone      text not null check (milestone in
                   ('m3_midpoint','d30','d14','d7','d1','expired','lapsed_7')),
  audience       text not null check (audience in ('team','lead')),

  status         text not null default 'claimed'
                 check (status in ('claimed','sent','failed')),
  claimed_at     timestamptz not null default now(),
  sent_at        timestamptz,
  failed_at      timestamptz,
  error          text,
  provider_id    text,
  created_at     timestamptz not null default now()
);

-- One notification per membership per milestone per audience. A milestone
-- that goes to both team and lead is two rows, latched independently, so a
-- failed lead email never suppresses the team's warning.
create unique index membership_notifications_once
  on public.membership_notifications (membership_id, milestone, audience);

create index membership_notifications_stuck_idx
  on public.membership_notifications (claimed_at) where status = 'claimed';

alter table public.membership_notifications enable row level security;

create policy "Authenticated users can read membership notifications"
  on public.membership_notifications for select to authenticated using (true);

-- NO INSERT, NO UPDATE, NO DELETE. Same reasoning as sequence_sends.
```

## 4.7 `leads` — consent, opt-out, entry product

```sql
alter table public.leads
  -- FK, not CHECK: making this a row in products is what lets Q-1/Q-2/Q-4
  -- be answered without a migration (§1a.3).
  add column if not exists entry_product text references public.products(code),

  -- Consent. Three columns, because "did they agree" and "to what, when,
  -- and by what mechanism" are different questions and an audit needs all.
  add column if not exists consent_marketing_at timestamptz,
  add column if not exists consent_source text,        -- e.g. 'stock101_form_v1'
  add column if not exists consent_text text,          -- the exact wording shown

  -- Opt-out. Timestamp not boolean: when matters for a complaint.
  add column if not exists opted_out_at timestamptz,
  add column if not exists opt_out_channel text
    check (opt_out_channel is null or opt_out_channel in ('email','whatsapp','manual','all')),

  -- Set by the outbound sweep only. Distinct from last_activity_at (0007),
  -- which is bumped by every activity type including note_added and
  -- tag_added and therefore cannot answer "when did we last MESSAGE them".
  add column if not exists last_outbound_at timestamptz;

create index if not exists leads_entry_product_idx
  on public.leads (entry_product) where deleted_at is null;

-- The sequence sweep's suppression predicate (§5.1).
create index if not exists leads_contactable_idx
  on public.leads (id)
  where deleted_at is null and opted_out_at is null and consent_marketing_at is not null;

create index if not exists leads_last_outbound_idx
  on public.leads (last_outbound_at) where deleted_at is null;
```

**`last_outbound_at` maintenance.** A trigger on `sequence_sends` mirroring `update_lead_last_activity` (`0007:52-66`), firing `AFTER UPDATE` when `status` becomes `'sent'`, using `greatest()` for the same out-of-order reason. This is the anti-spam gap's data source (§5.1).

**No new RLS policies needed** — these are columns on `leads`, governed by the existing table policies. That is itself a finding: the existing `"Authenticated users can update leads"` policy (`0001:172-173`) is `using (true)` with no column restriction, so **any rep can clear another lead's `opted_out_at`**. Guard with a `BEFORE UPDATE` trigger refusing to move `opted_out_at` from non-null to null except by an admin — same shape as `enforce_admin_soft_delete` (`0002:21-39`). §13 R-4.

---

# 5. THE SWEEP CONTRACT

Universal rule: **claim, then send.** Every sweep writes its latch row inside a transaction that commits before any HTTP call leaves. All sweeps run under `service_role` (RLS bypass) because none of the latch tables grants INSERT to `authenticated` (§4.5, §4.6).

## 5.1 Sweep 1 — sequence step due

### Predicate

```sql
-- Returns at most one due step per enrollment: the lowest-index step that
-- has no sequence_sends row yet and whose delay has elapsed.
select
  e.id                as enrollment_id,
  e.lead_id,
  e.tier,
  s.id                as step_id,
  s.step_index,
  s.channel,
  s.template_key
from public.sequence_enrollments e
join public.leads l
  on l.id = e.lead_id
join lateral (
  select st.*
  from public.sequence_steps st
  where st.sequence_code = e.sequence_code
    and st.active
    and e.enrolled_at + make_interval(hours => st.delay_hours) <= now()
    and not exists (
      select 1 from public.sequence_sends sd
      where sd.enrollment_id = e.id and sd.step_id = st.id
    )
  order by st.step_index
  limit 1
) s on true
where e.completed_at is null
  and e.exited_at is null
  -- suppression
  and l.deleted_at is null
  and l.opted_out_at is null
  and l.consent_marketing_at is not null
  -- anti-spam minimum gap, 20 hours
  and (l.last_outbound_at is null
       or l.last_outbound_at < now() - interval '20 hours')
order by s.step_index, e.enrolled_at
limit 200;
```

`limit 200` bounds a run. The `not exists` against `sequence_sends` means a claimed-but-unsent step is never re-selected, which is what makes the sweep re-entrant.

### Latch, written before the send

```sql
insert into public.sequence_sends
  (enrollment_id, step_id, lead_id, channel, status)
values ($1, $2, $3, $4, 'claimed')
on conflict (enrollment_id, step_id) do nothing
returning id;
```

**No returned row means another worker already claimed it. Skip. Do not send.** This is the entire concurrency control; two n8n executions overlapping is safe.

### Idempotency key

`(enrollment_id, step_id)` — enforced by `sends_once` (§4.5). Also passed to Resend as its `Idempotency-Key` header, so a retry inside the provider cannot duplicate either.

### Crash between latch and send

The row stays `status='claimed'` with `sent_at IS NULL` forever, because the unique index prevents re-claiming.

**Failure mode: the step is silently skipped, and the lead never receives it.** Chosen deliberately — the alternative (retry on any stale claim) risks double-sending, and the brief's constraint is at-most-once.

Recovery is a **reconciliation sweep**, not an automatic retry:

```sql
-- Stuck claims. Alert only. A human decides whether it actually went out.
select sd.*, l.full_name, l.email
from public.sequence_sends sd
join public.leads l on l.id = sd.lead_id
where sd.status = 'claimed'
  and sd.claimed_at < now() - interval '30 minutes';
```

Surfaced in the CRM (§10) and in the daily digest. If Resend's API returned before the crash, its dashboard is the tiebreaker — which is why `provider_id` is written on success.

## 5.2 Sweep 2 — membership expiring

### Predicate

```sql
select
  m.id as membership_id,
  m.lead_id,
  m.product_code,
  m.ends_at,
  ms.milestone,
  ms.audience
from public.memberships m
join public.leads l on l.id = m.lead_id
cross join lateral (
  values
    ('m3_midpoint', 'team', m.starts_at + (m.ends_at - m.starts_at) / 2),
    ('d30',         'team', m.ends_at - interval '30 days'),
    ('d30',         'lead', m.ends_at - interval '30 days'),
    ('d14',         'team', m.ends_at - interval '14 days'),
    ('d7',          'team', m.ends_at - interval '7 days'),
    ('d7',          'lead', m.ends_at - interval '7 days'),
    ('d1',          'lead', m.ends_at - interval '1 day'),
    ('expired',     'team', m.ends_at),
    ('expired',     'lead', m.ends_at),
    ('lapsed_7',    'team', m.ends_at + interval '7 days')
) as ms(milestone, audience, due_at)
where m.ends_at is not null          -- open-ended memberships never selected
  and m.cancelled_at is null
  and m.renewed_by is null
  and l.deleted_at is null
  and ms.due_at <= now()
  and not exists (
    select 1 from public.membership_notifications n
    where n.membership_id = m.id
      and n.milestone = ms.milestone
      and n.audience  = ms.audience
  )
  -- Lead-facing milestones respect consent; team-facing ones do not,
  -- because an internal warning is not marketing.
  and (ms.audience = 'team'
       or (l.opted_out_at is null and l.consent_marketing_at is not null))
limit 200;
```

### 6-month milestone ladder

Values below are **provisional pending Q-6** (who receives what).

| Milestone | Fires at | Team | Lead | Purpose |
|---|---|---|---|---|
| `m3_midpoint` | start + 50% of term | ✅ | ❌ | Mid-term health check. Team-only: a "you are halfway" note to a member reads as a countdown to a bill. |
| `d30` | end − 30d | ✅ | ✅ | First renewal conversation. Rep gets a task; lead gets a soft heads-up. |
| `d14` | end − 14d | ✅ | ❌ | Escalation if the rep has not acted. Team-only to avoid a second lead nudge two weeks after the first. |
| `d7` | end − 7d | ✅ | ✅ | Final week. Both. |
| `d1` | end − 1d | ❌ | ✅ | Last call to the member only. |
| `expired` | end | ✅ | ✅ | Access change. Both. |
| `lapsed_7` | end + 7d | ✅ | ❌ | Win-back trigger for the rep. |

Ten rows in the ladder, each latched independently by `(membership_id, milestone, audience)`.

### Latch

```sql
insert into public.membership_notifications
  (membership_id, milestone, audience, status)
values ($1, $2, $3, 'claimed')
on conflict (membership_id, milestone, audience) do nothing
returning id;
```

### Idempotency key

`(membership_id, milestone, audience)`, enforced by `membership_notifications_once`.

### Crash between latch and send

Identical to §5.1: row stranded at `claimed`, milestone silently skipped, surfaced by the same stuck-claim reconciliation. **For `d1` and `expired` this is a materially worse outcome than for a marketing step** — a member can lose access with no warning. Those two milestones should additionally appear in the CRM as an unresolved alert until a human clears them (§10, §13 R-6).

## 5.3 Sweep 3 — stalled lead

The predicate already exists in TypeScript: `isStalled(l, days = 7, at)` (`metrics.ts:64-65`), backed by `leads.last_activity_at` (0007) and the `leads_last_activity_idx` partial index.

### Predicate — and the drift it creates

```sql
select l.id, l.full_name, l.assigned_to, l.last_activity_at, l.stage, l.score
from public.leads l
where l.deleted_at is null
  and l.stage not in ('converted','closed_lost')
  and l.last_activity_at < now() - interval '7 days'
order by l.score desc, l.last_activity_at asc
limit 200;
```

**This is a second definition of `isStalled`.** §6.4 addresses how the two are kept in sync. It is the only threshold in the whole plan that must exist twice, and it exists twice only because the sweep runs in SQL.

### Latch

**None, and that is deliberate.** This sweep produces an internal digest, not an outbound message to a lead. Latching would mean each lead is reported stale exactly once, when the desired behaviour is that it keeps appearing until someone acts. The idempotency concern does not apply because the recipient is the team, the frequency is once daily, and the content is a list rather than a per-lead send.

If a stalled lead ever triggers an **automated outbound**, it must gain a latch table of the same shape as §4.6.

## 5.4 Crash matrix

| Sweep | Crash before latch | Crash between latch and send | Crash after send, before status update |
|---|---|---|---|
| Sequence step | Nothing written. Next run re-selects. **Safe.** | Stranded `claimed`. Step never sent. **At-most-once holds; delivery is lost.** Reconciliation alert. | Row stays `claimed`, message went out. Reconciliation shows it; `provider_id` absent so Resend's dashboard is the tiebreaker. **No duplicate.** |
| Membership | Nothing written. Re-selected. **Safe.** | Stranded `claimed`. Milestone skipped. Worse for `d1`/`expired` (§5.2). | Same as above. **No duplicate.** |
| Stalled | No state. Re-runs cleanly. | n/a | n/a |

In every case the failure mode is **a missed message, never a duplicate one**. That is the trade the brief's at-most-once requirement selects.

---

# 6. METRICS EXTENSIONS

## 6.1 Purity constraint

`src/lib/metrics.ts` imports exactly two things today: `date-fns` and a **type-only** import from `types/database` (`metrics.ts:13-14`). No React, no Supabase, no DOM. Every additional function below preserves that, so the module runs unchanged inside a Node cron job.

`useScoreboard.ts` cannot be reused by a job — it is a React hook wrapping the browser Supabase client. A job supplies rows by its own query and passes them in.

## 6.2 New row shapes

```ts
/** The payments columns a rollup reads. Mirrors §4.1. */
export interface PaymentRow {
  id: string
  lead_id: string
  product_code: string
  amount_minor: number
  currency: string
  paid_at: string
  voided_at: string | null
  recorded_by: string
}

/** The memberships columns a rollup reads. Mirrors §4.2. */
export interface MembershipRow {
  id: string
  lead_id: string
  product_code: string
  starts_at: string
  ends_at: string | null
  renewed_by: string | null
  cancelled_at: string | null
}

/** Minimal lead shape for attributing revenue to a rep. */
export interface LeadOwnerRow {
  id: string
  assigned_to: string | null
}

/** Money is always carried with its currency. Never a bare number. */
export interface Money {
  amountMinor: number
  currency: string
}
```

## 6.3 New function signatures

```ts
/** A payment counts only if it is not voided. One predicate, used by all. */
export const isLivePayment = (p: PaymentRow): boolean

/**
 * Revenue per rep, attributed through leads.assigned_to at read time.
 * Returns one Money per currency per rep: mixed-currency books must not be
 * summed into a single number (Q-6).
 */
export const revenueByRep = (
  payments: PaymentRow[],
  leads: LeadOwnerRow[],
  since?: Date,
  at?: Date,
): { repId: string | null; totals: Money[]; count: number }[]

/** Revenue per product code, same currency-splitting rule. */
export const revenueByProduct = (
  payments: PaymentRow[],
  since?: Date,
  at?: Date,
): { productCode: string; totals: Money[]; count: number }[]

/** Month-to-date inflow, per currency. Uses startOfThisMonth (metrics.ts:56). */
export const inflowMTD = (payments: PaymentRow[], at?: Date): Money[]

/**
 * Live memberships whose term ends within N days. Open-ended memberships
 * (ends_at null) are excluded, matching the §5.2 predicate exactly.
 */
export const membershipsExpiringWithin = (
  memberships: MembershipRow[],
  days: number,
  at?: Date,
): MembershipRow[]

/**
 * Renewal rate over terms that ENDED in the window: renewed / ended.
 * Excludes cancellations from the denominator, because a cancelled term was
 * never up for renewal. Definition depends on Q-7.
 */
export const renewalRate = (
  memberships: MembershipRow[],
  windowDays: number,
  at?: Date,
): number

/**
 * Paid conversion: leads with at least one live payment, over all live leads
 * created in the window. The money counterpart to globalConversionRate
 * (metrics.ts:174-180), which stays as-is and keeps meaning pipeline
 * conversion (§1a.5).
 */
export const paidConversionRate = (
  leads: LeadRow[],
  payments: PaymentRow[],
  at?: Date,
): number

/** Tier from score. Boundaries live here only, never in SQL (§3). */
export type Tier = 'A' | 'B' | 'C' | 'D'
export const scoreTier = (score: number): Tier
```

All follow the existing convention of an optional trailing `at: Date` (`metrics.ts:8-10`), so the module stays deterministic under a fixed clock.

## 6.4 Threshold duplication

Auditing every threshold this plan introduces:

| Threshold | Defined in | Second definition? |
|---|---|---|
| Tier boundaries (70/40/20) | `scoreTier` in `metrics.ts` | **No.** Not stored on the row, not in SQL. A boundary change is one edit, no backfill. |
| Score weights | `calculate_lead_score` (SQL) | **No.** Computed by trigger, read as a plain integer. `metrics.ts` never recomputes it. |
| Anti-spam gap (20h) | §5.1 SQL predicate | **No.** Only the sweep enforces it. |
| Milestone offsets | `sequence_steps.delay_hours` and the §5.2 ladder | **No.** Cadence is data (brief); the ladder is one `VALUES` list in one query. |
| `LOW_N_THRESHOLD` (10) | `metrics.ts:283` | **No.** Display only. |
| **Stalled = 7 days** | `isStalled` (`metrics.ts:64`) **and** §5.3 SQL | **YES — the only one.** |

### Keeping the stalled threshold in sync

The duplication is unavoidable: the dashboard alert must compute it in the browser from already-fetched rows, and the sweep must compute it in SQL over the whole table without shipping every lead to a job.

Three options, best first:

**Option A — a single SQL view, and the job reads the view.** ✅ **Chosen.**

```sql
create or replace view public.stalled_leads as
select l.*
from public.leads l
where l.deleted_at is null
  and l.stage not in ('converted','closed_lost')
  and l.last_activity_at < now() - interval '7 days';
```

The number then appears in exactly two places — the view and `metrics.ts:64` — and the view carries a comment naming its counterpart. A CI grep asserting `interval '7 days'` in the view matches the `days = 7` default in `metrics.ts:64` catches drift.

**Option B — the job calls a Postgres function that returns the ids, and `metrics.ts` is not involved.** Rejected: the dashboard alert would then need a round trip for a number it can already compute from rows in hand.

**Option C — store `is_stalled` as a generated column.** Rejected outright: `now()` is not `IMMUTABLE`, so a generated column cannot reference it.

---

# 7. n8n WORKFLOW INVENTORY

Five workflows. Every one is a sweep over a database predicate or a webhook receiver; **none uses a Wait node** (brief).

## 7.1 `WF-01 — Form Ingest`

**Trigger:** Webhook, `POST /webhook/ingest-lead`.

| # | Node | Type | Notes |
|---|---|---|---|
| 1 | Webhook | Webhook | `responseMode: responseNode`. Returns a real receipt (§9.1). |
| 2 | Verify secret | IF | Timing-safe compare of `x-ingest-secret` against `[REDACTED — shared secret]`. |
| 3 | → 401 | Respond to Webhook | Dead-end. |
| 4 | Validate payload | Code | Required: `full_name`, `email` or `phone`, `entry_product`, `consent_marketing`. Validates `entry_product` against a fetched `products` list. **Not an agent** (§8.3). |
| 5 | → 422 | Respond to Webhook | Body names the failing field. Dead-end. |
| 6 | Normalise | Code | Lowercase/trim email; phone→E.164 porting `normalizePhone` (`utils.ts:20-39`) verbatim. |
| 7 | Upsert lead | Supabase | `on_conflict=leads_email_unique_live`. Merge rules per §2.3. |
| 8 | Enroll in sequence | Supabase | Insert `sequence_enrollments` with `tier` from the returned `score`. `enrollments_one_live` makes a repeat submission a no-op. |
| 9 | → 200 receipt | Respond to Webhook | `{ok:true, lead_id, created:bool}`. |
| 10 | On error → WF-05 | Error Trigger wiring | Any node failure. |

**Branches:** 2→3 (bad secret), 4→5 (invalid), 7 conflict→merge path, all→9.
**Dead-ends:** 3 and 5, both Respond nodes returning a status. No NoOp needed — a webhook must answer.
**Agent nodes:** none.
**Timeout:** 10s on node 7.

## 7.2 `WF-02 — Sequence Sweep`

**Trigger:** Schedule, every 15 minutes.

| # | Node | Type | Notes |
|---|---|---|---|
| 1 | Schedule | Schedule Trigger | `*/15 * * * *`. |
| 2 | Select due steps | Supabase | §5.1 predicate. `limit 200`. |
| 3 | Any due? | IF | Empty → 4. |
| 4 | NoOp | NoOp | Clean dead-end. Zero due is the normal case. |
| 5 | Split in batches | Split In Batches | Size 25, so a provider hiccup costs 25 not 200. |
| 6 | **Claim latch** | Supabase | §5.1 insert `on conflict do nothing … returning id`. |
| 7 | Claimed? | IF | No row → 8. |
| 8 | NoOp (already claimed) | NoOp | Dead-end. Another worker owns it. |
| 9 | Load template | Supabase | `sequence_steps.template_key` + `tier` → copy row. |
| 10 | **Generate copy** | HTTP Request | **AGENT — `POST /agents/copy`** (§8.1). Timeout 20s. |
| 11 | **Validate copy** | Code | Guard after the AI call: non-empty, length bounds, no unresolved `{{...}}`, no injected link. |
| 12 | Valid? | IF | Fail → 13. |
| 13 | Fall back to static | Set | Uses the stored template unmodified. **A failed agent never blocks a send.** |
| 14 | Send | HTTP Request | Resend. `Idempotency-Key = sequence_sends.id`. Timeout 30s. |
| 15 | Sent OK? | IF | |
| 16 | Mark sent | Supabase | `status='sent'`, `sent_at`, `provider_id`. Trigger bumps `leads.last_outbound_at`. |
| 17 | Mark failed | Supabase | `status='failed'`, `failed_at`, `error`. Dead-end. |
| 18 | Last step? | IF | → mark `completed_at` on the enrollment. |
| 19 | On error → WF-05 | Error wiring | |

**Distinct reachable routes:** empty (4), already-claimed (8), agent-fail-to-static (13→14), send-fail (17), send-ok (16), sequence-complete (18). Six, all reachable.
**One model node per job:** node 10 only.
**Agent nodes:** 10.

## 7.3 `WF-03 — Membership Expiry Sweep`

**Trigger:** Schedule, daily 07:00 Africa/Lagos.

| # | Node | Type | Notes |
|---|---|---|---|
| 1 | Schedule | Schedule Trigger | `0 7 * * *`, TZ `Africa/Lagos`. |
| 2 | Select due milestones | Supabase | §5.2 predicate. |
| 3 | Any due? | IF | Empty → 4 NoOp. |
| 5 | Split in batches | Split In Batches | Size 25. |
| 6 | **Claim latch** | Supabase | §5.2 insert. |
| 7 | Claimed? | IF | No → 8 NoOp. |
| 9 | Audience? | Switch | `team` → 10, `lead` → 12. |
| 10 | Send team notice | HTTP Request | Resend to the team address (Q-6). |
| 11 | Create follow-up | Supabase | Sets `leads.follow_up_at` so it enters `deriveQueue` (`metrics.ts:217`). |
| 12 | Send lead notice | HTTP Request | Resend. Static template. **No agent** — expiry copy is transactional. |
| 13 | Mark sent / 14 Mark failed | Supabase | As WF-02. |
| 15 | On error → WF-05 | | |

**Agent nodes:** none. Deliberate — §8.3.

## 7.4 `WF-04 — Inbound Reply Classification`

**Trigger:** Webhook, `POST /webhook/inbound-reply` (Resend inbound or forwarding).

| # | Node | Type | Notes |
|---|---|---|---|
| 1 | Webhook | Webhook | |
| 2 | Verify signature | IF | Svix/provider signature. Fail → 3 Respond 401. |
| 4 | Match lead | Supabase | By from-address, then `provider_id` from `sequence_sends`. |
| 5 | Matched? | IF | No → 6 Respond 202 + park for human review. Never guess an identity. |
| 7 | **Classify** | HTTP Request | **AGENT — `POST /agents/classify-reply`** (§8.2). Timeout 15s. |
| 8 | **Validate classification** | Code | Guard: label ∈ enum, confidence numeric 0–1. Anything else → 9. |
| 9 | Fallback `needs_human` | Set | Unparseable output is never a decision. |
| 10 | Route | Switch | 5 distinct branches, all reachable: |
| 10a | `opt_out` → | Supabase | Set `opted_out_at`, `opt_out_channel`; exit enrollment `exit_reason='opted_out'`. |
| 10b | `interested` → | Supabase | Exit `exit_reason='replied'`; set `follow_up_at = now()`; notify assignee. |
| 10c | `question` → | Supabase | Exit `replied`; create follow-up. |
| 10d | `bounce` → | Supabase | Exit `bounced`. |
| 10e | `needs_human` → | Supabase | Exit `replied`; flag for review. No automated response. |
| 11 | Respond 200 | Respond to Webhook | |
| 12 | On error → WF-05 | | |

**Agent nodes:** 7.
**Note:** the agent classifies; the Switch decides. No LLM chooses what happens next (brief).

## 7.5 `WF-05 — Global Error Handler`

**Trigger:** Error Trigger (set as the error workflow on WF-01 through WF-04).

| # | Node | Type | Notes |
|---|---|---|---|
| 1 | Error Trigger | Error Trigger | |
| 2 | Shape | Code | Workflow, node, execution id, message, stack. |
| 3 | Severity? | Switch | `ingest`/`send` → 4; else → 6. |
| 4 | Alert | HTTP Request | Resend to admin. Timeout 15s. |
| 5 | Log | Supabase | `integration_errors` (small table, not specified above — add to 0008 if adopted). |
| 6 | Log only | Supabase | Dead-end. |

**No agent nodes.** An error handler that depends on an LLM fails exactly when the system is already failing.

## 7.6 Checklist compliance

| Requirement | Status |
|---|---|
| Distinct reachable routes | ✅ WF-02 six, WF-04 five, all reachable |
| One model node per job | ✅ WF-02 node 10; WF-04 node 7; no others |
| Validation guard after every AI call | ✅ WF-02 node 11, WF-04 node 8 |
| Clean NoOp dead-ends | ✅ WF-02 nodes 4, 8; WF-03 nodes 4, 8 |
| Timeouts | ✅ agents 15–20s, Resend 30s, Supabase 10s |
| No Wait nodes | ✅ every schedule is a DB predicate |
| Error workflow wired | ✅ WF-05 on all four |

---

# 8. AGENT CONTRACT

Two agents. Both are **stateless HTTP endpoints**: no session, no memory, no DB access. Relocating from n8n to Trigger.dev is a URL change in one HTTP Request node per workflow and nothing else.

## 8.1 Agent 1 — Copy Generation

**Endpoint:** `POST /agents/copy` · **Auth:** `x-agent-secret: [REDACTED — shared secret]`

**Request**
```ts
{
  template_key: string
  tier: 'A' | 'B' | 'C' | 'D'
  channel: 'email' | 'whatsapp'
  base_subject: string | null
  base_body: string
  variables: {
    first_name: string
    entry_product: string
    program_interest: string | null
    location: string | null
  }
}
```

**Response**
```ts
{ ok: true, subject: string | null, body: string, model: string, tokens_used: number }
| { ok: false, error: string }
```

**Model:** Claude Haiku 4.5 (`claude-haiku-4-5-20251001`). Rewriting a stored template into one of four registers is a short, well-specified transformation; a larger model buys nothing and costs latency inside a 15-minute sweep.
**Temperature:** `0.4`. Enough variation to avoid identical phrasing across leads; low enough to stay on-message.
**Token cap:** `max_tokens: 600`.

**Validation guard (WF-02 node 11), all must pass:**
1. `ok === true` and `body` non-empty
2. `body.length` between 40 and 2000
3. No unresolved `{{` or `}}`
4. No URL not present in `base_body` — blocks link injection
5. `subject` non-null and ≤ 120 chars when `channel === 'email'`
6. No placeholder-looking token (`[name]`, `TODO`, `XXX`)

**Failure shape:** any guard failure → WF-02 node 13 sends `base_body` unmodified. **The agent is an enhancement, never a dependency.** A total agent outage degrades copy quality; it does not stop the cadence.

## 8.2 Agent 2 — Inbound Reply Classification

**Endpoint:** `POST /agents/classify-reply` · **Auth:** same header

**Request**
```ts
{
  body_text: string          // truncated to 4000 chars by the caller
  subject: string | null
  lead_context: { first_name: string; entry_product: string | null; stage: string }
}
```

**Response**
```ts
{
  ok: true
  label: 'interested' | 'question' | 'opt_out' | 'bounce' | 'not_relevant' | 'needs_human'
  confidence: number         // 0..1
  rationale: string          // ≤ 200 chars, for the human reviewing
}
| { ok: false, error: string }
```

**Model:** Claude Haiku 4.5. Six-way classification of short text.
**Temperature:** `0` — the same reply must classify identically every time.
**Token cap:** `max_tokens: 200`.

**Validation guard (WF-04 node 8):**
1. `ok === true`
2. `label` ∈ the six-value enum, exact match
3. `confidence` numeric, `0 ≤ c ≤ 1`
4. `confidence < 0.75` → coerce to `needs_human`
5. `label === 'opt_out'` **and** `confidence < 0.9` → coerce to `needs_human`

**Failure shape:** `needs_human`. A misread reply is routed to a person, never acted on automatically.

**Rule 5 is asymmetric on purpose.** A missed opt-out is a legal and reputational problem; a false opt-out only costs one lead's future messages. The threshold is stricter in the direction where being wrong is cheap.

## 8.3 Deliberately NOT agents

| Not an agent | Why |
|---|---|
| **Routing / what happens next** | Brief: "Routing and scoring are deterministic code. No LLM decides what happens next." WF-04's Switch reads a label; it does not ask for a decision. |
| **Lead scoring** | `calculate_lead_score` is `IMMUTABLE` SQL (§3). A model cannot be immutable, cannot run in a trigger, and would make an identical lead score differently on two writes. |
| **Tier assignment** | Pure arithmetic on the score (`scoreTier`, §6.3). |
| **Which step is due** | A SQL predicate (§5.1). An LLM here would be non-deterministic scheduling. |
| **Ingest field validation** | WF-01 node 4 is a Code node. Validation must fail identically every time; that is what a schema is for. |
| **Milestone selection** | Date arithmetic (§5.2). |
| **Duplicate detection** | A unique index (§2.3). A model asked "is this the same person" would sometimes say no to the same pair twice. |
| **Error handling** | WF-05. An error path must not depend on a service that may be the thing that is down. |

---

# 9. INGEST REPAIR

## 9.1 The write receipt

**Today both forms lie.** `LandingForm.tsx:103` sets `submitted = true` in `try`; line 107 sets it again in `catch`. `Stock101Page.tsx:277` and `:280` are identical. Combined with `mode:'no-cors'` (opaque response — status, headers and body all unreadable), **an outage is indistinguishable from success** (export D-4).

**Required change, per form:**

1. Drop `mode:'no-cors'`. The endpoint must return CORS headers, which means the ingest endpoint becomes the n8n webhook (WF-01) or a Supabase Edge Function — **not** the Apps Script, which cannot answer a preflight. (`Settings.tsx:125-128` already documents this exact constraint for the sync direction: *"text/plain keeps this a 'simple' request, so the browser skips the CORS preflight that Apps Script cannot answer."*)
2. Read the response. Success is `res.ok && json.ok === true && json.lead_id`.
3. On failure: show a real error, **preserve the entered values** (do not `form.reset()`), and offer retry plus the `wa.me` fallback.
4. Only set `submitted = true` on a verified receipt.

**Receipt shape** (WF-01 node 9):
```ts
{ ok: true, lead_id: string, created: boolean }        // 200
{ ok: false, error: string, field?: string }            // 422
{ ok: false, error: 'unauthorized' }                    // 401
```

`created: false` means the upsert merged into an existing lead — a returning visitor, not a failure.

**Keep the Apps Script write as a secondary target during migration.** WF-01 can fan out to it so the Sheet stays a running backup until the CRM has been correct for a few weeks.

## 9.2 What the CRM shows when ingest goes quiet

The failure to detect is **silence** — no error arrives, because nothing is running.

**Mechanism: a freshness check on the newest lead per source.**

```sql
select p.code as entry_product,
       max(l.created_at) as last_lead_at,
       now() - max(l.created_at) as quiet_for
from public.products p
left join public.leads l
  on l.entry_product = p.code and l.deleted_at is null
where p.is_entry
group by p.code;
```

**Surfacing:** a banner on the CommandCenter, above the existing stalled alert, when any entry product has produced nothing for longer than its threshold. Threshold is per-product because volumes differ; default 48h, configurable as a `products` column if adopted.

Copy: `"No Stock 101 leads for 3 days. The form may be broken."` — not "0 leads today", which is normal.

**This is a detection heuristic, not a health check.** A genuinely quiet week produces a false positive. The true fix is the receipt in §9.1, which makes failures loud at the moment they happen. The banner catches the case where the form itself stopped rendering or the site went down.

## 9.3 Shared-secret header

```
x-ingest-secret: [REDACTED — shared secret, 32+ bytes, generated once]
```

Compared with a **timing-safe** equality function in WF-01 node 2.

**The uncomfortable part, stated plainly.** The forms are public browser code. Any secret they carry is visible in the bundle to anyone who opens devtools. This header therefore **does not authenticate the visitor** — it only stops trivially scripted abuse from someone who has not looked.

This is not a regression: the current Apps Script endpoint has **no** secret at all and is committed in two public source files (export §Secrets #1–2), so anyone with the URL can already write rows.

Real protection requires, in order of value:
1. **Rate limiting by IP** at the webhook — 10/min. Cheap, effective against volume.
2. **A honeypot field** the form renders hidden; any submission that fills it is a bot.
3. **A signed nonce** minted server-side per page load. Meaningful but requires server-side rendering the site does not currently have.
4. **Turnstile or hCaptcha.** The only robust answer. A product decision (Q-9) because it adds friction to the funnel.

Recommendation: ship 1 and 2 with the header now; treat 4 as a follow-up if abuse appears.

## 9.4 Consent capture

**No consent exists today.** No column, no checkbox, no record. The Retirement form's footer reads *"🔒 No spam. Just your session confirmation."* (`LandingForm.tsx:224`) — a promise with **nothing enforcing it**, and one that arguably scopes the permission to a single transactional message.

**No automated send may go to any lead captured before consent capture ships.** That is a hard gate, and it is why §11 orders consent before the sequence engine.

**Required on both forms — an explicit, unticked checkbox:**

```
[ ] I'd like Tito Finance to send me financial education emails
    and WhatsApp messages. I can unsubscribe at any time.
```

**Rules:**
- Unticked by default. A pre-ticked box is not consent.
- **Not `required`.** The visitor must be able to book a session without accepting marketing — bundling them makes the consent worthless.
- Submits `consent_marketing: boolean` plus `consent_text: string` (the exact wording shown, so the record survives a copy change) and `consent_source: string` (e.g. `'stock101_form_v1'`).

**Landing at ingest:** `consent_marketing_at = now()` when true, else NULL. `consent_text` and `consent_source` stored verbatim (§4.7).

**Enforcement:** the §5.1 predicate requires `consent_marketing_at is not null`. A lead without consent is never selected, so the engine cannot message them regardless of what any workflow does.

**Existing leads have no consent and cannot be assumed to have given it.** Options: re-permission campaign (itself a send, so this is circular), or treat them as reachable by rep-initiated `wa.me` only — which is manual, human-sent, and outside the automated engine. Q-10.

## 9.5 Field mapping — stated as inference

Every mapping below is **inferred from name similarity only** (U-1). None is verified against the Apps Script.

| Payload field | Inferred column | Verified? |
|---|---|---|
| `fullName` | `leads.full_name` | **NO** |
| `email` | `leads.email` | **NO** |
| `phone` | `leads.phone` | **NO** |
| `location` | `leads.location` | **NO** |
| `howHeard` | `leads.how_heard` | **NO** |
| `ageRange` | `leads.age_range` | **NO** |
| `retirementSavings` | `leads.retirement_savings` | **NO** |
| `form_type` | `leads.source` | **NO.** Values `'stock101'`/`'retirement'` happen to match two `source` CHECK literals. |
| **new** `entry_product` | `leads.entry_product` | n/a |
| **new** `consent_marketing` | `leads.consent_marketing_at` | n/a |

Once WF-01 owns ingest, these stop being inferences: the mapping becomes code in this repo.

---

# 10. UI CHANGE LIST

## 10.1 New surfaces

| # | Surface | New file | Hook | Notes |
|---|---|---|---|---|
| 1 | **Record payment** | `src/components/payments/RecordPaymentModal.tsx` | `useRecordPayment` in `src/hooks/usePayments.ts` | Amount entered in **major** units, converted to minor before insert. Currency select. Product select from `products`. `recorded_by` omitted client-side — the RLS `WITH CHECK` pins it (§4.1). Follows `AddLeadModal.tsx` structure. |
| 2 | **Payment history on a lead** | `src/components/payments/PaymentList.tsx` | `usePayments(leadId)` | Rendered in `LeadDetail.tsx` right column, below the existing `DetailRow` block (~line 582). Voided rows shown struck through, never hidden. |
| 3 | **Void payment** | Inside `PaymentList.tsx` | `useVoidPayment` | Admin only via `useIsAdmin()` (`authStore.ts:110`). Requires a reason. |
| 4 | **Membership panel** | `src/components/memberships/MembershipPanel.tsx` | `useMemberships(leadId)` | Term window, days remaining, milestone history from `membership_notifications`. In `LeadDetail.tsx`. |
| 5 | **Create / renew membership** | `src/components/memberships/MembershipModal.tsx` | `useCreateMembership` | Renewal creates a **new row** and sets `renewed_by` on the old (§4.2). |
| 6 | **Revenue rollups** | `src/components/dashboard/RevenueCards.tsx` | `useRevenue()` | On `CommandCenter.tsx` between the stat band and the roster. Uses `revenueByRep` / `revenueByProduct` / `inflowMTD` (§6.3). Admin only. |
| 7 | **Expiring memberships** | `src/components/dashboard/ExpiringCard.tsx` | `useExpiringMemberships(30)` | `membershipsExpiringWithin`. On `CommandCenter.tsx`. |
| 8 | **Consent display** | Extend `LeadDetail.tsx` | existing `useLead` | Consent state, date, source, exact text. Opt-out shown as a **prominent banner**, not a field — a rep must not open a lead and miss it. |
| 9 | **Sequence status** | `src/components/sequences/SequencePanel.tsx` | `useEnrollment(leadId)` | Current step, next due, send history from `sequence_sends`. "Exit sequence" button. |
| 10 | **Stuck-claim alert** | Extend `CommandCenter.tsx` | `useStuckSends()` | §5.1 reconciliation. Admin only. |
| 11 | **Ingest-quiet banner** | Extend `CommandCenter.tsx` | `useIngestFreshness()` | §9.2. |

## 10.2 Modifications to existing files

| File | Change | Why |
|---|---|---|
| `src/lib/constants.ts:51-59` | `PROGRAMS`: rename Closed Circuit → Closed Group; add Savings | §1.5 #3 |
| `src/types/database.ts:23-30` | `ProgramInterest` union; add `entry_product`, consent, `opted_out_at`, `last_outbound_at` to `Lead` | §1.5 #2, §4.7 |
| `src/lib/metrics.ts` | Append §6.3 functions and row shapes. **Nothing existing changes.** | §6 |
| `src/hooks/useLeads.ts:29-32` | `LEAD_COLUMNS`: add `entry_product`, `opted_out_at`, `consent_marketing_at`, `last_outbound_at` | New columns must reach the client |
| `src/hooks/useScoreboard.ts:59-62` | Extend the leads select; add `payments` and `memberships` reads | §6 needs the rows |
| `src/components/AddLeadModal.tsx` | Add entry-product select; add a consent control for manually-entered leads | §1a.4, §9.4 |
| `src/pages/LeadDetail.tsx` | Mount surfaces 2, 4, 8, 9 | §10.1 |
| `src/pages/Leads.tsx:522` | Add an entry-product column; add an opt-out indicator | §1a.4 |
| `src/lib/csv.ts:38-57` | Export `entry_product` and consent state | Parity with the table |
| `src/pages/Settings.tsx:29-31` | `SYNC_COLUMNS`: add `entry_product` | §1.5 #7 |
| `titofinance-main/src/components/landing/LandingForm.tsx` | Read `webhookUrl`; accept `formType`/`entryProduct` props; consent checkbox; real receipt handling | §1a.4, §9.1, §9.4, export D-1 |
| `titofinance-main/src/pages/Stock101Page.tsx:239-285` | Same for the inline `RegisterForm` | §9.1, §9.4 |
| `titofinance-main/src/components/ServicesSection.tsx:218` | `Closed Circuit Group` → `Closed Group` | §1.5 #8 |

## 10.3 The two live defects

### Defect 1 — the 200-row ceiling

**Where:** `tito-crm/src/hooks/useLeads.ts:62` — `.limit(200)` with no `.range()` and no cursor.

**Comment vs code.** `useLeads.ts:26-27` says: *"at 200 rows per page it is pure weight the client never reads."* There is no page. 200 is a hard ceiling and **lead 201 is invisible** — silently, with no UI indication.

**Compounding risk:** at 201+ leads the sequence engine will enroll leads that reps cannot see in the inbox.

**Fix:** cursor pagination on `(created_at, id)` in `useLeads`, plus a `count: 'exact'` head request so the UI can show "showing 200 of N". Cursor, not offset — with realtime inserts (`useLeadsRealtime.ts:56-80`) offset pagination shows the same lead twice or skips one.

**Where fixed:** `useLeads.ts` `baseQuery` (line 55-84) and `useLeads` (86-134); pagination controls at the foot of `Leads.tsx`.

**Priority: before any membership backfill.** Importing existing Closed Group members (§11 step 9) will likely push the table past 200.

### Defect 2 — the invite trigger

**Where:** `0006:98-121` defines `public.handle_new_user()`, which reads `crm_invites`, applies the invited `full_name` and `role`, and deletes the invite. **No `create trigger` statement anywhere points to it.** The live trigger is still `on_auth_user_created → handle_new_auth_user()` from `0001:135-138`, which never reads `crm_invites`.

**Effects:** every invited user is provisioned `sales_rep` regardless of the chosen role; the invited name is discarded in favour of the email local-part; `crm_invites` rows accumulate forever.

**Fix — one statement in migration 0008:**

```sql
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

**Verify U-3 first.** If someone already repointed this by hand in the dashboard, re-running is harmless (`drop … if exists`), but confirming tells you whether existing `crm_users` rows have correct roles or need auditing.

**Also needed:** `Settings.tsx` currently says an invite was recorded. It should say what actually happens — that an admin must create the auth user in the Supabase dashboard — because **no email is sent to the invitee by anything** (export §7.5).

---

# 11. ORDER OF WORK

| # | Step | Depends on / breaks if out of order | Blocked on |
|---|---|---|---|
| 1 | **Answer Q-1…Q-5** (§12): Beginner Portfolio, Mentorship term, prices, currency, Retirement/Quick Fire disposition | The `products` seed and the §3 weights encode these. Guessing means a data migration later. | **Titobi decision** |
| 2 | **Dedupe audit + `leads_email_unique_live`** (§2) | **Hard prerequisite for everything involving money.** Attaching payments to duplicate rows splits revenue and double-messages people (§2.4). | Nothing |
| 3 | **Fix the 200-row ceiling** (§10.3 D-1) | Do before the member backfill (step 9) or reps cannot see the rows the engine is working. | Nothing |
| 4 | **Fix the invite trigger** (§10.3 D-2) | Independent, but do early: every user provisioned before the fix has the wrong role. | Verify U-3 |
| 5 | **Migration 0008 part A** — `products`, `leads` columns (`entry_product`, consent, opt-out, `last_outbound_at`), vocabulary widen + backfill + narrow (§1.6, §4.7) | Must precede the scoring rewrite — the function will not compile without the columns. | Step 1 |
| 6 | **Scoring rewrite + backfill** (§3) | Needs step 5's columns. Do before enrollment: `tier` is frozen at enrollment from the score, so enrolling on old scores freezes the wrong copy variant. | Step 5 |
| 7 | **Ingest repair + consent capture** (§9) | **Consent must precede any automated send.** Also fixes the false-success reporting. | Step 5; **deploy target** for WF-01 |
| 8 | **Migration 0008 part B** — `payments`, `memberships` + the amount-immutability trigger (§4.1, §4.2) | Needs step 2 (identity) and step 5 (`products`). | Steps 2, 5 |
| 9 | **Backfill existing Closed Group members** into `memberships` | Needs step 8. Needs step 3 or they are invisible. Terms in flight must exist before the expiry sweep, or the first run either misses them or fires a full ladder at once for everyone. | **Titobi data** (Q-8) |
| 10 | **Payment + membership UI** (§10.1 surfaces 1–5) | Needs step 8. | Nothing |
| 11 | **Migration 0008 part C** — `sequence_steps`, `sequence_enrollments`, `sequence_sends`, `membership_notifications` (§4.3–4.6) | Independent of money, but the sweeps need it. | Nothing |
| 12 | **Stand up the deploy target** for agents and sweeps | Everything from here needs somewhere to run. **There is no background execution capability today** (export §6) — no edge functions, no `pg_cron`, no Vercel crons, no CI. | **Deploy target must exist** |
| 13 | **WF-05 error handler + WF-01 ingest** (§7.5, §7.1) | Error handling before the workflows it protects. | Step 12 |
| 14 | **Agent endpoints** (§8) | Needed by WF-02 and WF-04. Deploy stateless so relocation is a URL swap. | Step 12 |
| 15 | **WF-02 sequence sweep** (§7.2) | Needs steps 7 (consent), 11 (tables), 14 (agent). **Sending before consent is the failure this ordering exists to prevent.** | Steps 7, 11, 14 |
| 16 | **WF-03 membership expiry sweep** (§7.3) | Needs steps 8, 9, 11. Running before step 9 means real members get no warning. | Steps 8, 9, 11 |
| 17 | **Metrics extensions + revenue UI** (§6, §10.1 surfaces 6–7) | Needs step 8 for rows to read. | Step 8 |
| 18 | **WF-04 inbound classification** (§7.4) | Needs step 15 — nothing replies to a message never sent. | Step 15 |
| 19 | **Stalled view + reconciliation surfaces** (§5.3, §6.4, §10.1 surfaces 10–11) | Needs step 15 for stuck claims to exist. | Step 15 |
| 20 | **WhatsApp Business API channel** | `sequence_steps.channel` already allows `'whatsapp'`; until approval, WhatsApp steps stay `active = false` and reps use `wa.me` click-to-chat (`utils.ts:41-46`). | **Meta approval** |

**Blocking summary:** Meta approval blocks only step 20. Titobi decisions block 1 and 9. A deploy target blocks 12 and everything after. Steps 2, 3, 4, 11 are blocked on nothing and can start immediately.

---

# 12. OPEN QUESTIONS FOR THE CLIENT

| # | Question | Blocks | Why it cannot be inferred |
|---|---|---|---|
| **Q-1** | **Retirement is a whole product in the code — a landing page, a 7-field form, a `source` value, three dedicated columns — and it is absent from your product list. Is it FREE, PAID, or being retired?** | `products` seed; §3 entry weight (currently 18, provisional) | The brief lists five products; the code has seven. Retirement is the second-highest-scoring source today. Guessing would either mis-price it or delete a live funnel. |
| **Q-2** | **Quick Fire One-on-One is live on the site (`ServicesSection.tsx:304`) and in the enum. Keep, or retire? If retire, what happens to existing leads holding `quick_fire`?** | §1.6 backfill | Retiring it without a backfill fails the CHECK narrow. Backfilling to `'unknown'` destroys the information with no recovery — `activities` never recorded the original `program_interest`. |
| **Q-3** | **Mentorship: fixed term or open-ended? If fixed, how many months?** | `products.term_months`; §5.2 sweep | The schema handles both (`ends_at` nullable), but the sweep only notifies termed memberships. Open-ended means no expiry ladder at all for the highest-value product. |
| **Q-4** | **Beginner Portfolio: FREE or PAID? If paid, is it termed?** | `products.is_paid`, `is_entry`; §3 weight (currently 20, provisional) | If free it becomes an entry product and should feed `entry_product`. If paid it produces payments. Opposite sides of the model. |
| **Q-5** | **Exact price for each paid product, in minor units, with currency.** Closed Group per 6-month term; Mentorship per term or per month; Beginner Portfolio if paid; Quick Fire if kept. | `products.list_amount`; every §6 rollup | Nothing in either repo mentions a price. `ServicesSection.tsx` cards carry no figures. |
| **Q-6** | **Diaspora currency: do UK/US/Canada clients pay in NGN or local currency?** If local: which currencies, and should rollups convert or report separately? If converting, whose rate and captured when? | `payments.currency`; `revenueByRep`/`revenueByProduct` shape | §6.3 currently returns `Money[]` per rep rather than one total, because summing mixed currencies silently is worse than showing two numbers. If everything is NGN, the API simplifies. |
| **Q-7** | **What counts as a renewal?** A new payment before `ends_at`? Within a grace period after? A membership row created by a rep with no payment attached? | `renewalRate` (§6.3); `memberships.renewed_by` | Three plausible definitions give three different rates on the same data. |
| **Q-8** | **Current Closed Group roster: who is a member, when did each term start, when does it end?** As a spreadsheet. | Step 9 backfill; WF-03's first run | No `memberships` table exists, so terms in flight today are recorded nowhere in this system (U-6). Without this, the first expiry sweep either misses every current member or fires a full ladder at everyone at once. |
| **Q-9** | **Refund and void policy.** Who may void a payment? Is a refund a void, or a separate negative entry? Is there a time limit? | §4.1 void policy; the amount-immutability trigger | The plan restricts voids to admins with a mandatory reason and no delete. If refunds are common, a distinct `refunds` concept may be better than voiding a real payment. |
| **Q-10** | **Notification recipients.** For each of the ten milestones in §5.2: the assigned rep, Titobi, a shared team address, or the member? What is the team address? | WF-03 routing; §5.2 ladder | The ladder in §5.2 is a proposal. `crm_users.email` exists but no shared address is configured anywhere. |
| **Q-11** | **Existing leads have no consent record.** May they receive automated messages? If yes, on what basis? If no, do we run a re-permission campaign, or contact them only by rep-initiated WhatsApp? | §9.4; whether the engine has any audience at launch | Circular: a re-permission email is itself an automated send. This is a judgement call about the promise at `LandingForm.tsx:224` (*"No spam. Just your session confirmation."*), which arguably scoped permission to one transactional message. |
| **Q-12** | **Is "Stock 101" the same product as the site's "Personal Financial Management 101" card and the "Free Ebook: Stock 101"?** | `products` seed; entry-product labels | Three names for what may be one, two, or three things (U-5). |
| **Q-13** | **Does the Google Apps Script currently write to Supabase, and can its source be shared?** | §9 migration plan; validating every mapping in §9.5 | U-1. Until this is answered, no one can state where a form submission actually lands. |
| **Q-14** | **Bot protection on the public forms: acceptable to add Turnstile/hCaptcha, or is funnel friction unacceptable?** | §9.3 | A product trade-off, not a technical one. |

---

# 13. RISKS

| # | Risk | Consequence | Guard | Where the guard lives |
|---|---|---|---|---|
| **R-1** | **Double-messaging a real lead** | Same person gets the same step twice. Highest-visibility failure. | Latch written **before** send; `sends_once` unique index makes a second claim raise `23505`; `enrollments_one_live` prevents two enrollments per lead per sequence. | `sequence_sends.sends_once` (§4.5); `enrollments_one_live` (§4.4); WF-02 node 6 |
| **R-2** | **Duplicate people → duplicate everything** | Two lead rows = two enrollments = two message streams; revenue split across rows. | `leads_email_unique_live` + upsert-on-conflict at ingest. **Must land before payments.** | §2.3; step 2 of §11 |
| **R-3** | **Messaging someone who never consented** | Legal exposure; breaks the promise at `LandingForm.tsx:224`. | The §5.1 predicate requires `consent_marketing_at is not null`. Structural — no workflow edit can bypass it. | §5.1; `leads_contactable_idx` (§4.7) |
| **R-4** | **A rep clears another lead's opt-out** | Contacting someone who explicitly refused. | `"Authenticated users can update leads"` (`0001:172-173`) is `using (true)` with no column restriction, so RLS alone does not stop this. Needs a `BEFORE UPDATE` trigger refusing non-null→null on `opted_out_at` except by admin. | New trigger in 0008, shape of `enforce_admin_soft_delete` (`0002:21-39`) |
| **R-5** | **Money lost to float rounding** | Revenue reports that do not reconcile. | `amount_minor bigint`, never numeric/float. UI converts at the boundary only. | §4.1; `RecordPaymentModal` (§10.1 #1) |
| **R-6** | **Membership lapses with no warning** | Member loses access unannounced; renewal missed. | Ten-milestone ladder with independent latches; `d1`/`expired` stuck claims raise a CRM alert until cleared. | §5.2; §10.1 #10 |
| **R-7** | **Payment attributed to the wrong rep** | Commission disputes; `revenueByRep` untrustworthy. | `recorded_by = auth.uid()` pinned in the INSERT `WITH CHECK` — the exact control `activities` lacks (§4.0). | §4.1 |
| **R-8** | **A payment is edited rather than corrected** | Ledger stops being a ledger. | No DELETE policy; UPDATE restricted to void; `WITH CHECK` forces `voided_at is not null`; amount-immutability trigger closes the gap RLS cannot express. | §4.1 |
| **R-9** | **Deleting a lead deletes its payments** | Silent, unrecoverable revenue loss. | `payments.lead_id … on delete restrict` (not cascade). Leads use soft delete (0002) so it should never fire; if someone hard-deletes, the ledger refuses. | §4.1 |
| **R-10** | **Ingest dies silently** | Leads vanish with no trace. Currently **live**: both forms report success in `catch` (`LandingForm.tsx:107`, `Stock101Page.tsx:280`) behind an opaque `no-cors` response. | Real write receipt; error state that preserves entered values; freshness banner. | §9.1, §9.2 |
| **R-11** | **The sweep sends before the latch commits** | Duplicate on retry. Inverts the whole design. | Claim node ordered before send node in WF-02/WF-03; latch insert is its own committed statement; Resend `Idempotency-Key = sequence_sends.id` as a second line of defence. | §5.1; WF-02 nodes 6→14 |
| **R-12** | **Agent outage stops the cadence** | Lifecycle engine halts on a dependency that is only cosmetic. | Validation guard falls back to the static template. The agent enhances copy; it is never required to send. | §8.1; WF-02 node 13 |
| **R-13** | **A misclassified reply auto-opts-out a hot lead** | Losing a buyer to a parsing error. | `confidence < 0.9` on `opt_out` coerces to `needs_human`; `< 0.75` on anything coerces likewise. Asymmetric by design. | §8.2 guard rules 4–5 |
| **R-14** | **Stalled threshold drifts between SQL and TS** | Dashboard and digest disagree about the same leads. | Single `stalled_leads` view; CI grep asserting `interval '7 days'` matches `days = 7` at `metrics.ts:64`. | §6.4 Option A |
| **R-15** | **Forged activity rows** | Audit log is not evidence. **Live today.** `0001:188-189` is `with check (true)` — any rep can insert any activity with any `actor_id`. The 0001 comment says it *"is dropped"* once triggers land; 0003 added the triggers and did not drop it. | Drop the policy now that triggers own `stage_change`/`lead_created`. Note client code still inserts `note_added`, `tag_added`/`tag_removed`, `email_sent`, `whatsapp_sent`, `field_updated` — those paths must move to triggers or a definer function first, or dropping it breaks them. | 0008; `useLead.ts:80,154,195,216`; `useLeads.ts:176,244`; `LeadDetail.tsx:208,235` |
| **R-16** | **Lead 201+ invisible while being messaged** | Engine works leads reps cannot see. | Cursor pagination + exact count. | §10.3 D-1; `useLeads.ts:62` |
| **R-17** | **The public ingest secret is in the bundle** | Anyone can inject leads, poisoning scoring and rollups. | Rate limit by IP, honeypot field; Turnstile if abuse appears (Q-14). Note this is **not a regression** — the current endpoint has no secret at all and is committed in two public files. | §9.3; WF-01 node 2 |
| **R-18** | **First expiry sweep fires a full ladder at every existing member at once** | Ten emails to everyone in one morning. | Backfill `memberships` (step 9) **before** enabling WF-03, and seed `membership_notifications` rows as already-`sent` for milestones whose date has passed. | §11 steps 9→16 |

---

*End of plan. No application code written, no migration executed, no existing file modified.*
