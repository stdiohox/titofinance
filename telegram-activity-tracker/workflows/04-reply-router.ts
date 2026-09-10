import {
  workflow,
  node,
  trigger,
  sticky,
  ifElse,
  merge,
  newCredential,
  expr,
} from '@n8n/workflow-sdk';

const telegramTrigger = trigger({
  type: 'n8n-nodes-base.telegramTrigger',
  version: 1.5,
  config: {
    name: 'Telegram Trigger',
    parameters: {
      updates: ['message'],
      additionalFields: {
        chatIds: '-5457770656',
      },
    },
    credentials: { telegramApi: newCredential('Tito Finance Telegram Bot') },
    output: [
      {
        message: {
          message_id: 501,
          from: { id: 777001, is_bot: false, first_name: 'Ada', username: 'ada_tf' },
          chat: { id: -1001234567890, type: 'supergroup' },
          date: 1789000000,
          text: 'Signing in for today',
          reply_to_message: { message_id: 101 },
        },
      },
    ],
  },
});

const isReply = ifElse({
  version: 2.2,
  config: {
    name: 'Is a Reply to a Prompt?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' },
        conditions: [
          {
            leftValue: expr('{{ $json.message.reply_to_message.message_id }}'),
            operator: { type: 'number', operation: 'exists', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      looseTypeValidation: true,
    },
  },
});

const getPromptIds = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: "Get Today's Prompt IDs",
    parameters: {
      resource: 'row',
      operation: 'get',
      dataTableId: {
        __rl: true,
        mode: 'id',
        value: 'UclN0JC7VWt19l9S',
        cachedResultName: 'Tito Daily Prompt IDs',
      },
      matchType: 'allConditions',
      filters: {
        conditions: [
          {
            keyName: 'day',
            condition: 'eq',
            keyValue: expr("{{ $now.setZone('Africa/Lagos').toFormat('yyyy-MM-dd') }}"),
          },
        ],
      },
      options: {},
    },
    output: [
      {
        id: 1,
        day: '2026-09-10',
        chat_id: '-1001234567890',
        signin_msg_id: '101',
        midday_msg_id: '102',
        eod_msg_id: '103',
      },
    ],
  },
});

const classifyReply = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Classify Reply',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode:
        "// ---- Tunable configuration ------------------------------------------\n" +
        "const TIMEZONE = 'Africa/Lagos';\n" +
        "const SIGNIN_ON_TIME_CUTOFF = '09:15'; // reply at or before this = on_time\n" +
        "// ----------------------------------------------------------------------\n" +
        "\n" +
        "const msg = $('Telegram Trigger').first().json.message;\n" +
        "const row = $input.first().json;\n" +
        "\n" +
        "const replyTo = msg.reply_to_message ? String(msg.reply_to_message.message_id) : '';\n" +
        "let kind = '';\n" +
        "if (replyTo && replyTo === String(row.signin_msg_id)) kind = 'signin';\n" +
        "else if (replyTo && replyTo === String(row.midday_msg_id)) kind = 'midday';\n" +
        "else if (replyTo && replyTo === String(row.eod_msg_id)) kind = 'eod';\n" +
        "\n" +
        "// Replies to anything other than today's three prompts are ignored.\n" +
        "if (!kind) return [];\n" +
        "\n" +
        "const now = $now.setZone(TIMEZONE);\n" +
        "const time = now.toFormat('HH:mm');\n" +
        "\n" +
        "const photos = msg.photo || [];\n" +
        "const largest = photos.length ? photos[photos.length - 1] : null;\n" +
        "\n" +
        "return [{ json: {\n" +
        "  kind: kind,\n" +
        "  today: now.toFormat('yyyy-MM-dd'),\n" +
        "  time: time,\n" +
        "  signinStatus: time <= SIGNIN_ON_TIME_CUTOFF ? 'on_time' : 'late',\n" +
        "  telegramUserId: String(msg.from.id),\n" +
        "  text: msg.text || msg.caption || '',\n" +
        "  hasPhoto: !!largest,\n" +
        "  fileId: largest ? largest.file_id : '',\n" +
        "} }];\n",
    },
    output: [
      {
        kind: 'midday',
        today: '2026-09-10',
        time: '13:07',
        signinStatus: 'late',
        telegramUserId: '777001',
        text: 'Working on the Q3 pipeline review',
        hasPhoto: true,
        fileId: 'AgACAgQAAx0...',
      },
    ],
  },
});

const lookUpRep = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Look Up Rep',
    parameters: {
      resource: 'sheet',
      operation: 'read',
      documentId: {
        __rl: true,
        mode: 'list',
        value: '',
        cachedResultName: 'Tito Finance – Daily Activity Tracker',
      },
      sheetName: { __rl: true, mode: 'name', value: 'Team' },
      filtersUI: {
        values: [
          {
            lookupColumn: 'telegram_user_id',
            lookupValue: expr('{{ $json.telegramUserId }}'),
          },
        ],
      },
      combineFilters: 'AND',
      options: {},
    },
    credentials: { googleSheetsOAuth2Api: newCredential('Tito Finance Google Sheets') },
    output: [
      {
        telegram_user_id: '777001',
        telegram_username: 'ada_tf',
        full_name: 'Ada Obi',
        active: 'Y',
      },
    ],
  },
});

const hasPhoto = ifElse({
  version: 2.2,
  config: {
    name: 'Midday Reply With Photo?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' },
        conditions: [
          {
            leftValue: expr("{{ $('Classify Reply').first().json.kind }}"),
            operator: { type: 'string', operation: 'equals' },
            rightValue: 'midday',
          },
          {
            leftValue: expr("{{ $('Classify Reply').first().json.hasPhoto }}"),
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      looseTypeValidation: true,
    },
  },
});

const downloadPhoto = node({
  type: 'n8n-nodes-base.telegram',
  version: 1.2,
  config: {
    name: 'Download Proof Photo',
    retryOnFail: true,
    maxTries: 3,
    parameters: {
      resource: 'file',
      operation: 'get',
      fileId: expr("{{ $('Classify Reply').first().json.fileId }}"),
      download: true,
    },
    credentials: { telegramApi: newCredential('Tito Finance Telegram Bot') },
    output: [{ ok: true, result: { file_id: 'AgACAgQAAx0...', file_path: 'photos/file_1.jpg' } }],
  },
});

const uploadPhoto = node({
  type: 'n8n-nodes-base.googleDrive',
  version: 3,
  config: {
    name: 'Upload Proof Photo',
    retryOnFail: true,
    maxTries: 3,
    parameters: {
      resource: 'file',
      operation: 'upload',
      inputDataFieldName: 'data',
      name: expr(
        "{{ $('Look Up Rep').first().json.full_name }} — {{ $('Classify Reply').first().json.today }} midday proof.jpg",
      ),
      driveId: { __rl: true, mode: 'list', value: 'My Drive' },
      folderId: { __rl: true, mode: 'list', value: 'root', cachedResultName: '/ (Root folder)' },
      options: {},
    },
    credentials: { googleDriveOAuth2Api: newCredential('Tito Finance Google Drive') },
    output: [
      {
        id: '1AbCdEfGhIjK',
        name: 'Ada Obi — 2026-09-10 midday proof.jpg',
        webViewLink: 'https://drive.google.com/file/d/1AbCdEfGhIjK/view?usp=drivesdk',
      },
    ],
  },
});

const sharePhoto = node({
  type: 'n8n-nodes-base.googleDrive',
  version: 3,
  config: {
    name: 'Share Proof Photo',
    retryOnFail: true,
    maxTries: 3,
    onError: 'continueRegularOutput',
    parameters: {
      resource: 'file',
      operation: 'share',
      fileId: { __rl: true, mode: 'id', value: expr('{{ $json.id }}') },
      permissionsUi: {
        permissionsValues: { role: 'reader', type: 'anyone', allowFileDiscovery: false },
      },
      options: {},
    },
    credentials: { googleDriveOAuth2Api: newCredential('Tito Finance Google Drive') },
    output: [{ id: 'anyoneWithLink', role: 'reader', type: 'anyone' }],
  },
});

const proofLinkFromDrive = node({
  type: 'n8n-nodes-base.set',
  version: 3.5,
  config: {
    name: 'Proof Link From Drive',
    parameters: {
      mode: 'manual',
      includeOtherFields: false,
      assignments: {
        assignments: [
          {
            id: 'proof-link',
            name: 'proofLink',
            value: expr(
              "{{ $('Upload Proof Photo').item.json.webViewLink || 'https://drive.google.com/file/d/' + $('Upload Proof Photo').item.json.id + '/view' }}",
            ),
            type: 'string',
          },
        ],
      },
    },
    output: [{ proofLink: 'https://drive.google.com/file/d/1AbCdEfGhIjK/view?usp=drivesdk' }],
  },
});

const noProofLink = node({
  type: 'n8n-nodes-base.set',
  version: 3.5,
  config: {
    name: 'No Proof Link',
    parameters: {
      mode: 'manual',
      includeOtherFields: false,
      assignments: {
        assignments: [
          {
            id: 'proof-link',
            name: 'proofLink',
            value: expr(
              "{{ $('Classify Reply').first().json.kind === 'midday' ? 'no photo attached' : '' }}",
            ),
            type: 'string',
          },
        ],
      },
    },
    output: [{ proofLink: 'no photo attached' }],
  },
});

const proofMerge = merge({
  version: 3.2,
  config: {
    name: 'Proof Link',
    parameters: { mode: 'append', numberInputs: 2 },
    output: [{ proofLink: 'no photo attached' }],
  },
});

const readExistingRow = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Read Existing Tracker Row',
    alwaysOutputData: true,
    parameters: {
      resource: 'sheet',
      operation: 'read',
      documentId: {
        __rl: true,
        mode: 'list',
        value: '',
        cachedResultName: 'Tito Finance – Daily Activity Tracker',
      },
      sheetName: { __rl: true, mode: 'name', value: 'Tracker' },
      filtersUI: {
        values: [
          {
            lookupColumn: 'date',
            lookupValue: expr("{{ $('Classify Reply').first().json.today }}"),
          },
          {
            lookupColumn: 'rep_name',
            lookupValue: expr("{{ $('Look Up Rep').first().json.full_name }}"),
          },
        ],
      },
      combineFilters: 'AND',
      options: {},
    },
    credentials: { googleSheetsOAuth2Api: newCredential('Tito Finance Google Sheets') },
    output: [{ date: '2026-09-10', rep_name: 'Ada Obi', signin_time: '09:03', signin_status: 'on_time' }],
  },
});

const mergeTrackerRow = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Merge Tracker Row',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode:
        "// Reads whatever is already on today's row for this rep and overlays only the\n" +
        "// checkpoint that just came in, so a midday reply never blanks the sign-in cells.\n" +
        "const c = $('Classify Reply').first().json;\n" +
        "const rep = $('Look Up Rep').first().json;\n" +
        "const proof = $('Proof Link').first().json.proofLink;\n" +
        "\n" +
        "// 'Read Existing Tracker Row' has alwaysOutputData on, so an absent row arrives\n" +
        "// as an empty object rather than stopping the chain. Guard on a real field.\n" +
        "const found = $input.first() ? $input.first().json : {};\n" +
        "const existing = found && found.date ? found : {};\n" +
        "\n" +
        "const row = {\n" +
        "  date: c.today,\n" +
        "  rep_name: rep.full_name,\n" +
        "  signin_time: existing.signin_time || '',\n" +
        "  signin_status: existing.signin_status || '',\n" +
        "  midday_time: existing.midday_time || '',\n" +
        "  midday_proof_link: existing.midday_proof_link || '',\n" +
        "  midday_status: existing.midday_status || '',\n" +
        "  eod_time: existing.eod_time || '',\n" +
        "  eod_report_text: existing.eod_report_text || '',\n" +
        "  eod_status: existing.eod_status || '',\n" +
        "};\n" +
        "\n" +
        "if (c.kind === 'signin') {\n" +
        "  row.signin_time = c.time;\n" +
        "  row.signin_status = c.signinStatus;\n" +
        "} else if (c.kind === 'midday') {\n" +
        "  row.midday_time = c.time;\n" +
        "  row.midday_status = 'submitted';\n" +
        "  row.midday_proof_link = proof;\n" +
        "} else if (c.kind === 'eod') {\n" +
        "  row.eod_time = c.time;\n" +
        "  row.eod_status = 'submitted';\n" +
        "  row.eod_report_text = c.text;\n" +
        "}\n" +
        "\n" +
        "return [{ json: row }];\n",
    },
    output: [
      {
        date: '2026-09-10',
        rep_name: 'Ada Obi',
        signin_time: '09:03',
        signin_status: 'on_time',
        midday_time: '13:07',
        midday_proof_link: 'https://drive.google.com/file/d/1AbCdEfGhIjK/view',
        midday_status: 'submitted',
        eod_time: '',
        eod_report_text: '',
        eod_status: '',
      },
    ],
  },
});

const upsertTrackerRow = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Upsert Tracker Row',
    retryOnFail: true,
    maxTries: 3,
    parameters: {
      resource: 'sheet',
      operation: 'appendOrUpdate',
      documentId: {
        __rl: true,
        mode: 'list',
        value: '',
        cachedResultName: 'Tito Finance – Daily Activity Tracker',
      },
      sheetName: { __rl: true, mode: 'name', value: 'Tracker' },
      columns: {
        mappingMode: 'defineBelow',
        matchingColumns: ['date', 'rep_name'],
        value: {
          date: expr('{{ $json.date }}'),
          rep_name: expr('{{ $json.rep_name }}'),
          signin_time: expr('{{ $json.signin_time }}'),
          signin_status: expr('{{ $json.signin_status }}'),
          midday_time: expr('{{ $json.midday_time }}'),
          midday_proof_link: expr('{{ $json.midday_proof_link }}'),
          midday_status: expr('{{ $json.midday_status }}'),
          eod_time: expr('{{ $json.eod_time }}'),
          eod_report_text: expr('{{ $json.eod_report_text }}'),
          eod_status: expr('{{ $json.eod_status }}'),
        },
        schema: [
          { id: 'date', displayName: 'date', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'rep_name', displayName: 'rep_name', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'signin_time', displayName: 'signin_time', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'signin_status', displayName: 'signin_status', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'midday_time', displayName: 'midday_time', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'midday_proof_link', displayName: 'midday_proof_link', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'midday_status', displayName: 'midday_status', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'eod_time', displayName: 'eod_time', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'eod_report_text', displayName: 'eod_report_text', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'eod_status', displayName: 'eod_status', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
        ],
      },
      options: { cellFormat: 'USER_ENTERED' },
    },
    credentials: { googleSheetsOAuth2Api: newCredential('Tito Finance Google Sheets') },
    output: [{ date: '2026-09-10', rep_name: 'Ada Obi' }],
  },
});

const routingNote = sticky(
  '## Reply routing\n' +
    'Every team reply lands here. The reply is classified by matching\n' +
    '`message.reply_to_message.message_id` against the three prompt IDs stored for today,\n' +
    'and the sender is identified by `message.from.id` against the **Team** tab.\n\n' +
    'Replies that are not a reply to one of todays prompts, or that come from someone not\n' +
    'listed in the **Team** tab, are dropped without writing anything.\n\n' +
    '**Tunable:** the sign-in grace cutoff lives at the top of **Classify Reply**.\n' +
    'The team group filter lives in the trigger (`chatIds`).',
  [isReply, getPromptIds, classifyReply, lookUpRep],
  { color: 4 },
);

const proofNote = sticky(
  '## Proof of work\n' +
    'A midday reply carrying a photo is re-downloaded from Telegram, pushed to Drive and\n' +
    'shared as anyone-with-the-link, and the share URL is written to `midday_proof_link`.\n\n' +
    'A midday reply with no photo is still logged; the cell reads `no photo attached`.\n\n' +
    '**Tunable:** the destination folder is the `folderId` field of **Upload Proof Photo**.',
  [hasPhoto, downloadPhoto, uploadPhoto, sharePhoto, proofLinkFromDrive, noProofLink],
  { color: 3 },
);

const writeNote = sticky(
  '## Read-modify-write\n' +
    'Google Sheets `appendOrUpdate` overwrites every column it is given, so the existing row\n' +
    'is read first and **Merge Tracker Row** overlays only the checkpoint that just arrived.\n' +
    'Without this, a midday reply would blank that mornings sign-in cells.',
  [readExistingRow, mergeTrackerRow, upsertTrackerRow],
  { color: 5 },
);

export default workflow('tito-daily-reply-router', 'Tito Daily — Telegram Reply Router')
  .add(telegramTrigger)
  .to(
    isReply.onTrue(
      getPromptIds
        .to(classifyReply)
        .to(lookUpRep)
        .to(
          hasPhoto
            .onTrue(
              downloadPhoto
                .to(uploadPhoto)
                .to(sharePhoto)
                .to(proofLinkFromDrive)
                .to(proofMerge.input(0)),
            )
            .onFalse(noProofLink.to(proofMerge.input(1))),
        ),
    ),
  )
  .add(proofMerge)
  .to(readExistingRow)
  .to(mergeTrackerRow)
  .to(upsertTrackerRow)
  .add(routingNote)
  .add(proofNote)
  .add(writeNote);
