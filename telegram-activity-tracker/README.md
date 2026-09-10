# Tito Finance — Telegram Daily Activity Tracker

Three scheduled Telegram prompts per weekday drive team accountability. Replies are
auto-logged to a dedicated Google Sheet, and a compiled summary goes to Mr Tito at 18:30.

This component is **standalone**. It does not touch Supabase, the tito-crm codebase, the
titofinance.com site, or the existing leads/activities tables. Its only shared surface is
the n8n instance it runs on.

---

## Status: what is built vs. what you must do

The workflows exist on the live n8n instance and are **inactive**, because the
credentials they need do not exist on that instance yet. Nothing will run — and nothing
can run — until [Manual setup](#manual-setup) is complete.

| Piece | State |
|---|---|
| 5 n8n workflows | ✅ Created, validated, timezone set, **inactive** |
| `Tito Daily Prompt IDs` data table | ✅ Created (`UclN0JC7VWt19l9S`) |
| Google Sheet | ⛔ **You create it** — one-click script provided |
| Telegram bot + chat IDs | ⛔ **You create them** — BotFather, then paste IDs in |
| Google Sheets / Drive credentials | ⛔ **You create them** in n8n |

### Why the sheet and credentials are not done for you

The n8n instance (`dancheezy.app.n8n.cloud`, personal project
`infinitytech228@gmail.com`) has exactly **one** credential on it: a Gmail OAuth2
account. There is no Telegram credential, no Google Sheets credential and no Google
Drive credential. Without a Google credential nothing on the instance can create a
spreadsheet, so the sheet is delivered as a one-click Apps Script instead
(`setup/create-tracker-sheet.gs`).

> Note: this is **not** the `n8n.srv1759554.hstgr.cloud` Hostinger instance referenced in
> `TITO-INFRASTRUCTURE-EXPORT.md` and `tito-finance-crm-prd.md`. That is a past project.
> There are no pre-existing "Tito Finance Google credentials" on this instance to reuse.

---

## Architecture

```
                     ┌──────────────────────────────────────────┐
  09:00 weekday ───► │ 1. Sign-In Prompt                        │
  13:00 weekday ───► │ 2. Midday Check-In Prompt                │ ──► team Telegram group
  18:00 weekday ───► │ 3. End-Of-Day Prompt                     │
                     └───────────────┬──────────────────────────┘
                                     │ stores message_id
                                     ▼
                     ┌──────────────────────────────────────────┐
                     │  Data table: Tito Daily Prompt IDs        │
                     │  day │ chat_id │ signin/midday/eod_msg_id │
                     └───────────────┬──────────────────────────┘
                                     │ read to classify
  team member replies ──────────────►│
                     ┌───────────────┴──────────────────────────┐
                     │ 4. Reply Router (Telegram Trigger)       │
                     │    match reply_to_message.message_id     │
                     │    identify sender via message.from.id   │
                     │    photo ──► Google Drive ──► share link  │
                     └───────────────┬──────────────────────────┘
                                     ▼
                     ┌──────────────────────────────────────────┐
                     │  Google Sheet: Team tab + Tracker tab     │
                     └───────────────┬──────────────────────────┘
                                     │
  18:30 weekday ───► ┌───────────────┴──────────────────────────┐
                     │ 5. Daily Report                          │
                     │    fill blanks as "missing", compile     │ ──► Mr Tito's DM
                     └──────────────────────────────────────────┘
```

### The reply-threading mechanism

Each scheduled prompt is posted as a new message in the team group, and its
`message_id` is written to that day's row of the **Tito Daily Prompt IDs** data table.

Team members must use Telegram's native **Reply** feature on that specific prompt
message. The Telegram Trigger reads:

- `message.reply_to_message.message_id` → matched against the three stored IDs to
  classify the reply as sign-in / midday / EOD
- `message.from.id` → looked up in the **Team** tab to resolve `rep_name`

A reply that is not a reply to one of today's three prompts is dropped. A reply from
someone not listed in the **Team** tab is dropped. Neither writes anything.

### Workflows on the instance

| # | Workflow | ID | Trigger |
|---|---|---|---|
| 1 | Tito Daily — 09:00 Sign-In Prompt | `7vCh9BQJVEQ4dzjS` | Cron `0 9 * * 1-5` |
| 2 | Tito Daily — 13:00 Midday Check-In Prompt | `IYuP8Q6uyD0JedS0` | Cron `0 13 * * 1-5` |
| 3 | Tito Daily — 18:00 End-Of-Day Prompt | `WLlDEUtTqWQGWxiJ` | Cron `0 18 * * 1-5` |
| 4 | Tito Daily — Telegram Reply Router | `V49Lek2Ise7fAgnv` | Telegram Trigger |
| 5 | Tito Daily — 18:30 Report to Mr Tito | `A6U0h8vJAljEzlZO` | Cron `30 18 * * 1-5` |

Open any of them at `https://dancheezy.app.n8n.cloud/workflow/<ID>`.

All five have `settings.timezone = Africa/Lagos`, so the cron expressions above are WAT
(UTC+1, no DST). **The timezone is a per-workflow setting** — if you clone a workflow,
re-check it under Workflow settings → Timezone.

### Source of record

`workflows/*.ts` are the n8n Workflow SDK source. `workflows/exported/*.json` are
snapshots of what is actually deployed. If you edit a workflow in the n8n canvas, the
`.ts` file goes stale — re-export, or make the change in the `.ts` and redeploy.

---

## The Google Sheet

Name: **Tito Finance – Daily Activity Tracker** (note: en-dash, matching the cached
names in the workflow nodes). Two tabs.

### Tab `Team` — the roster, maintained by hand

| Column | Notes |
|---|---|
| `telegram_user_id` | Numeric Telegram user ID. See [capturing user IDs](#5-populate-the-team-tab). |
| `telegram_username` | Convenience only; nothing matches on it. |
| `full_name` | **This is the join key into `Tracker.rep_name`.** Must be stable. |
| `active` | `Y` or `N`. The 18:30 report walks only `Y` rows. |

### Tab `Tracker` — one row per rep per day, written by n8n

| Column | Written by | Values |
|---|---|---|
| `date` | router / report | `YYYY-MM-DD` (Lagos) |
| `rep_name` | router / report | from `Team.full_name` |
| `signin_time` | router | `HH:mm` |
| `signin_status` | router / report | `on_time` / `late` / `missing` |
| `midday_time` | router | `HH:mm` |
| `midday_proof_link` | router | Drive link, or `no photo attached` |
| `midday_status` | router / report | `submitted` / `missing` |
| `eod_time` | router | `HH:mm` |
| `eod_report_text` | router | the reply text |
| `eod_status` | router / report | `submitted` / `missing` |

Rows are upserted matching on **`date` + `rep_name`** together.

### Status logic

- **`signin_status`** — `on_time` if the reply lands at or before **09:15**, otherwise
  `late`. Any reply to the sign-in prompt counts; the 13:00 boundary in the original
  spec is implicit, since at 13:00 the midday prompt supersedes it and a sign-in reply
  after that is still recorded as `late`. Never replied → `missing` at 18:30.
- **`midday_status`** — `submitted` on any reply, with or without a photo. A reply with
  no photo is still logged and `midday_proof_link` reads `no photo attached`. Never
  replied → `missing` at 18:30.
- **`eod_status`** — `submitted` on any reply. Anything still blank when the 18:30
  report runs → `missing`.

`missing` is never written by the router — only by the 18:30 report, which is what
closes out the day.

### Why the router reads before it writes

Google Sheets `appendOrUpdate` overwrites every column you hand it. If the router wrote
only `midday_*`, the blank `signin_*` fields in the same payload would wipe that
morning's sign-in. So the router reads the existing row first and **Merge Tracker Row**
overlays only the checkpoint that just arrived. Keep that shape if you edit it.

---

## Manual setup

Do these in order. Steps 1–4 are prerequisites for anything working at all.

### 1. Create the Telegram bot

1. Message [@BotFather](https://t.me/BotFather) on Telegram → `/newbot`.
2. Give it a name and a username ending in `bot`.
3. BotFather replies with a **bot token** like `8123456789:AAF...`. Keep it secret —
   it is a full credential. Do not commit it.
4. Recommended: `/setprivacy` → **Disable**. With group privacy *enabled* (the default)
   a bot only receives messages that @mention it or reply to its own messages. Replies
   to the bot's own prompts do reach it either way, so the tracker works with privacy
   on — but disabling it makes debugging far less confusing.

### 2. Add the bot to the group and to Mr Tito's chat

- Add the bot to the team Telegram group as an ordinary member. It does not need admin.
- Mr Tito must **send the bot at least one message** (`/start` in a DM). Telegram bots
  cannot open a conversation with a user who has never written to them; without this the
  18:30 report will fail with `chat not found`.

### 3. Get the two chat IDs

With the bot in the group and at least one message sent in each chat:

```bash
curl -s "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates" | python3 -m json.tool
```

Read `result[].message.chat.id`:

- The **team group** ID is negative, typically `-100…` for a supergroup.
- **Mr Tito's** DM ID is a positive number.

If `getUpdates` comes back empty, send a fresh message in each chat and retry — Telegram
only retains recent updates. Note that `getUpdates` stops working once the workflow is
active, because the Telegram Trigger consumes updates via webhook; grab the IDs first.

### 4. Create the credentials in n8n

In n8n → **Credentials** → **New**, create all three. The names below are what the
workflow nodes already reference, so matching them means the nodes bind on import:

| Credential type | Name to use |
|---|---|
| Telegram API | `Tito Finance Telegram Bot` |
| Google Sheets OAuth2 API | `Tito Finance Google Sheets` |
| Google Drive OAuth2 API | `Tito Finance Google Drive` |

For the two Google credentials you can use either OAuth2 (sign in as the Google account
that owns the sheet) or a service account. **If you use a service account, you must
share the spreadsheet and the Drive proof folder with the service account's email
address** — it is a distinct identity and sees nothing by default.

Then open each of the five workflows and confirm every Telegram / Sheets / Drive node
shows the credential in its dropdown. Newly created credentials sometimes need to be
re-picked once per node.

### 5. Create the Google Sheet

Run `setup/create-tracker-sheet.gs` once — see the header comment in that file. It
creates the spreadsheet with both tabs, the exact headers, a frozen bold header row, and
trims the sheets to the schema width.

Do it by hand instead if you prefer; the headers must match the tables above exactly,
in that order, in row 1.

### 6. Point the workflows at the sheet

The `documentId` fields ship **unset** — an ID cannot be invented, and pointing them at
the wrong spreadsheet silently writes to the wrong place. In each of these nodes, open
the **Document** dropdown and pick *Tito Finance – Daily Activity Tracker*:

- Reply Router → `Look Up Rep`, `Read Existing Tracker Row`, `Upsert Tracker Row`
- Daily Report → `Get Active Team`, `Get Today's Tracker Rows`, `Write Back Final Statuses`

The **Sheet** field is already set by name (`Team` / `Tracker`) and needs no change.

### 7. Populate the Team tab

You need each rep's numeric `telegram_user_id`. Have every rep send one message in the
group (or DM the bot), then read the IDs off `getUpdates` as in step 3 —
`result[].message.from.id` alongside `from.username`.

Set `active` to `Y` for anyone who should appear in the 18:30 report.

`full_name` must match for the lifetime of the tracker: it is the row key. Renaming
someone mid-quarter orphans their earlier rows rather than updating them.

### 8. Set the Drive proof folder (optional)

`Upload Proof Photo` defaults to Drive root. Point its **Parent Folder** at a dedicated
folder to keep proof screenshots together.

Uploaded photos are shared **anyone-with-the-link**, so the links in the sheet and in
Mr Tito's report open without a Google login. If that is too open for you, change
`Share Proof Photo` to `type: domain` (with your Workspace domain) or remove it — but
then the links only open for people with explicit access.

---

## Configuration values

Everything tunable, and exactly where it lives. All times are Africa/Lagos.

| Value | Default | Where |
|---|---|---|
| Sign-in time | 09:00 Mon–Fri | WF1 trigger, cron `0 9 * * 1-5` |
| Midday time | 13:00 Mon–Fri | WF2 trigger, cron `0 13 * * 1-5` |
| EOD time | 18:00 Mon–Fri | WF3 trigger, cron `0 18 * * 1-5` |
| Report time | 18:30 Mon–Fri | WF5 trigger, cron `30 18 * * 1-5` |
| **Sign-in grace cutoff** | `09:15` | WF4 → `Classify Reply` → `SIGNIN_ON_TIME_CUTOFF` |
| Timezone | `Africa/Lagos` | Each workflow's settings, **and** the `TIMEZONE` const in the two Code nodes |
| Team group chat ID | `REPLACE_WITH_TEAM_GROUP_CHAT_ID` | `Config` node in WF1/2/3, **and** the `chatIds` field of WF4's Telegram Trigger |
| Mr Tito's chat ID | `REPLACE_WITH_TITOBI_CHAT_ID` | `Config` node in WF5 |
| MISSING flag | 🔴 MISSING | WF5 → `Compile Daily Report` → `FLAG` |
| Prompt wording | — | The `text` field of each prompt's Telegram node |
| Data table ID | `UclN0JC7VWt19l9S` | Hard-coded in WF1–4 |

**Grep for `REPLACE_WITH_` before going live** — four places across four workflows. The
team group chat ID is needed in two different kinds of place: the `Config` Set node in
the three prompt workflows, and the trigger's own `chatIds` filter in the router. Miss
the router one and the bot will happily process replies from any chat it is added to.

Changing a schedule means editing the cron in that workflow's trigger. Weekday-only is
the `1-5` field; `* * *` would make it every day.

---

## Testing end to end

Test in order — each step depends on the one before. Keep everything **inactive** until
step 5; a manual execution runs the whole workflow regardless of active state.

### 1. Prompt workflows (1, 2, 3)

Open WF1 → **Execute Workflow**. Expect:

- the sign-in message appears in the team group
- `Store Sign-In Prompt ID` shows one output row
- in n8n → **Data tables** → *Tito Daily Prompt IDs*, today's row now has
  `signin_msg_id`

Repeat for WF2 and WF3. All three must land on the **same** row for today — one row per
day, three columns filled. If you get three separate rows, the `day` values disagree,
which means a timezone is off.

### 2. Reply router — the happy path

The Telegram Trigger only listens while the workflow is active or while you are in
**Listen for test event**. Click **Listen for test event**, then in the group:

1. **Reply** to the sign-in prompt with any text.
   → `Classify Reply` outputs `kind: signin`, and a Tracker row appears with
   `signin_time` and `signin_status`.
2. **Reply** to the midday prompt **with a screenshot attached**.
   → the photo lands in Drive, and `midday_proof_link` holds an opening link.
3. **Reply** to the midday prompt **without** a photo.
   → `midday_status: submitted`, `midday_proof_link: no photo attached`.
4. **Reply** to the EOD prompt.
   → `eod_report_text` holds your text.

After all four, **the sign-in cells must still be populated.** If they went blank, the
read-modify-write in `Merge Tracker Row` is broken — that is the specific regression to
watch for when editing this workflow.

### 3. Reply router — the paths that should do nothing

- Send a message in the group that is **not** a reply → `Is a Reply to a Prompt?` sends
  it down the false branch and nothing is written.
- Reply to some unrelated older message → `Classify Reply` returns no items, and the
  chain stops there.
- Have someone **not** in the `Team` tab reply to a prompt → `Look Up Rep` returns no
  rows and nothing is written.

All three are "no output, no error". A workflow execution that ends early here is
correct behaviour, not a failure.

### 4. Daily report

Open WF5 → **Execute Workflow**. Expect:

- Mr Tito receives a message, one line per **active** team member
- someone who never replied shows `🔴 MISSING`, and their Tracker row now exists with
  `missing` statuses
- proof links appear as a list at the end

To test the empty case, set every `Team.active` to `N` and run it — you should get the
"No active team members found" warning rather than silence.

### 5. Go live

Activate all five. The Telegram Trigger registers its webhook on activation — **from
this point `getUpdates` returns nothing**, because the webhook consumes updates. That is
expected; deactivate the router if you need `getUpdates` back.

Verify the next morning that the 09:00 prompt fired on its own.

---

## Operational notes

- **Each workflow runs independently.** If the 13:00 prompt fails to send, the day's row
  keeps its `midday_msg_id` empty, and midday replies simply match nothing. The 18:30
  report then marks everyone `missing` for midday. Check the prompt actually posted
  before reading anything into a wall of MISSING.
- **The report walks the roster, not the sheet.** A rep who never replied still gets a
  line. Someone who replies but is not in the `Team` tab appears nowhere.
- **Missed schedules do not catch up.** If n8n is down at 09:00, there is no 09:00
  prompt and no sign-in for that day.
- **Telegram nodes retry** three times with a 5s backoff. Drive share failures are
  non-fatal (the upload link still gets written). In the report workflow the Sheets
  write-back is non-fatal so a Sheets hiccup cannot swallow Mr Tito's report.
- **Error notifications are not configured.** n8n's Error Trigger can notify you when a
  workflow fails, either as a shared error-handler workflow or an Error Trigger inside
  each workflow. Nothing was wired up silently — say the word and it can be added.

---

## Files

```
telegram-activity-tracker/
├── README.md                          this file
├── setup/
│   └── create-tracker-sheet.gs        one-click Google Sheet creation
└── workflows/
    ├── 01-signin-prompt.ts            n8n Workflow SDK source
    ├── 02-midday-prompt.ts
    ├── 03-eod-prompt.ts
    ├── 04-reply-router.ts
    ├── 05-daily-report.ts
    └── exported/                      deployed-state snapshots
        └── *.json
```
