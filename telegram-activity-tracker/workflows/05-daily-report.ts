import { workflow, node, trigger, sticky, newCredential, expr } from '@n8n/workflow-sdk';

const reportTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.4,
  config: {
    name: 'Weekdays 18:30 Lagos',
    parameters: {
      rule: { interval: [{ field: 'cronExpression', expression: '30 18 * * 1-5' }] },
    },
  },
});

const configNode = node({
  type: 'n8n-nodes-base.set',
  version: 3.5,
  config: {
    name: 'Config',
    parameters: {
      mode: 'manual',
      includeOtherFields: true,
      assignments: {
        assignments: [
          {
            id: 'titobi-chat-id',
            name: 'titobiChatId',
            value: 'REPLACE_WITH_TITOBI_CHAT_ID',
            type: 'string',
          },
          {
            id: 'today',
            name: 'today',
            value: expr("{{ $now.setZone('Africa/Lagos').toFormat('yyyy-MM-dd') }}"),
            type: 'string',
          },
        ],
      },
    },
    output: [{ titobiChatId: '123456789', today: '2026-09-10' }],
  },
});

const getActiveTeam = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Get Active Team',
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
        values: [{ lookupColumn: 'active', lookupValue: 'Y' }],
      },
      combineFilters: 'AND',
      options: {},
    },
    credentials: { googleSheetsOAuth2Api: newCredential('Tito Finance Google Sheets') },
    output: [
      { telegram_user_id: '777001', telegram_username: 'ada_tf', full_name: 'Ada Obi', active: 'Y' },
      { telegram_user_id: '777002', telegram_username: 'bem_tf', full_name: 'Bem Terhemba', active: 'Y' },
    ],
  },
});

const getTrackerRows = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: "Get Today's Tracker Rows",
    executeOnce: true,
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
            lookupValue: expr("{{ $('Config').first().json.today }}"),
          },
        ],
      },
      combineFilters: 'AND',
      options: {},
    },
    credentials: { googleSheetsOAuth2Api: newCredential('Tito Finance Google Sheets') },
    output: [
      {
        date: '2026-09-10',
        rep_name: 'Ada Obi',
        signin_time: '09:03',
        signin_status: 'on_time',
        midday_time: '13:07',
        midday_proof_link: 'https://drive.google.com/file/d/1AbCdEfGhIjK/view',
        midday_status: 'submitted',
        eod_time: '17:55',
        eod_report_text: 'Closed two retirement plan reviews.',
        eod_status: 'submitted',
      },
    ],
  },
});

const compileReport = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Compile Daily Report',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode:
        "// ---- Tunable configuration ------------------------------------------\n" +
        "const TIMEZONE = 'Africa/Lagos';\n" +
        "const FLAG = '\\u{1F534} MISSING';   // how a missed checkpoint is rendered\n" +
        "// ----------------------------------------------------------------------\n" +
        "\n" +
        "const now = $now.setZone(TIMEZONE);\n" +
        "const today = now.toFormat('yyyy-MM-dd');\n" +
        "\n" +
        "function esc(v) {\n" +
        "  return String(v == null ? '' : v)\n" +
        "    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');\n" +
        "}\n" +
        "\n" +
        "const team = $('Get Active Team').all()\n" +
        "  .map(function (i) { return i.json; })\n" +
        "  .filter(function (r) { return r && r.full_name && String(r.active).toUpperCase() === 'Y'; });\n" +
        "\n" +
        "// 'Get Todays Tracker Rows' has alwaysOutputData on, so a day with no replies at all\n" +
        "// still reaches this node — as a single empty object, which this filter drops.\n" +
        "const tracker = $input.all()\n" +
        "  .map(function (i) { return i.json; })\n" +
        "  .filter(function (r) { return r && r.rep_name; });\n" +
        "\n" +
        "const lines = [];\n" +
        "const proofs = [];\n" +
        "const rows = [];\n" +
        "\n" +
        "team.forEach(function (member) {\n" +
        "  const name = member.full_name;\n" +
        "  const found = tracker.filter(function (r) {\n" +
        "    return String(r.rep_name).trim() === String(name).trim();\n" +
        "  })[0] || {};\n" +
        "\n" +
        "  const signinStatus = found.signin_status || 'missing';\n" +
        "  const middayStatus = found.midday_status || 'missing';\n" +
        "  const eodStatus = found.eod_status || 'missing';\n" +
        "\n" +
        "  const signinPart = signinStatus === 'missing'\n" +
        "    ? FLAG\n" +
        "    : esc(found.signin_time) + ' (' + (signinStatus === 'on_time' ? 'on time' : 'late') + ')';\n" +
        "\n" +
        "  const hasPhoto = found.midday_proof_link && String(found.midday_proof_link).indexOf('http') === 0;\n" +
        "  const middayPart = middayStatus === 'submitted'\n" +
        "    ? 'submitted (' + (hasPhoto ? 'photo attached' : 'no photo') + ')'\n" +
        "    : FLAG;\n" +
        "\n" +
        "  const eodPart = eodStatus === 'submitted' ? 'submitted' : FLAG;\n" +
        "\n" +
        "  lines.push(esc(name) + ' — Sign-in: ' + signinPart + ' | Midday: ' + middayPart + ' | EOD: ' + eodPart);\n" +
        "\n" +
        "  if (hasPhoto) {\n" +
        "    proofs.push(esc(name) + ': ' + esc(found.midday_proof_link));\n" +
        "  }\n" +
        "\n" +
        "  rows.push({\n" +
        "    date: today,\n" +
        "    rep_name: name,\n" +
        "    signin_time: found.signin_time || '',\n" +
        "    signin_status: signinStatus,\n" +
        "    midday_time: found.midday_time || '',\n" +
        "    midday_proof_link: found.midday_proof_link || '',\n" +
        "    midday_status: middayStatus,\n" +
        "    eod_time: found.eod_time || '',\n" +
        "    eod_report_text: found.eod_report_text || '',\n" +
        "    eod_status: eodStatus,\n" +
        "  });\n" +
        "});\n" +
        "\n" +
        "let report = '<b>Tito Finance — Daily Activity Report</b>\\n'\n" +
        "  + now.toFormat('cccc, dd LLLL yyyy') + '\\n\\n';\n" +
        "\n" +
        "if (!team.length) {\n" +
        "  report += '<i>No active team members found in the Team tab. Check that the roster is filled in '\n" +
        "    + 'and that the active column reads Y.</i>';\n" +
        "  return [{ json: { rep_name: '', report_text: report } }];\n" +
        "}\n" +
        "\n" +
        "report += lines.join('\\n');\n" +
        "report += proofs.length\n" +
        "  ? '\\n\\n<b>Proof of work:</b>\\n' + proofs.join('\\n')\n" +
        "  : '\\n\\n<i>No proof-of-work photos submitted today.</i>';\n" +
        "\n" +
        "return rows.map(function (r) {\n" +
        "  return { json: Object.assign({}, r, { report_text: report }) };\n" +
        "});\n",
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
        eod_time: '17:55',
        eod_report_text: 'Closed two retirement plan reviews.',
        eod_status: 'submitted',
        report_text: 'Tito Finance — Daily Activity Report',
      },
    ],
  },
});

const onlyRealRows = node({
  type: 'n8n-nodes-base.filter',
  version: 2.2,
  config: {
    name: 'Only Real Rows',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' },
        conditions: [
          {
            leftValue: expr('{{ $json.rep_name }}'),
            operator: { type: 'string', operation: 'notEmpty', singleValue: true },
          },
        ],
        combinator: 'and',
      },
      looseTypeValidation: true,
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
        eod_time: '17:55',
        eod_report_text: 'Closed two retirement plan reviews.',
        eod_status: 'submitted',
        report_text: 'Tito Finance — Daily Activity Report',
      },
    ],
  },
});

const markMissing = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Write Back Final Statuses',
    retryOnFail: true,
    maxTries: 3,
    onError: 'continueRegularOutput',
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

const sendReport = node({
  type: 'n8n-nodes-base.telegram',
  version: 1.2,
  config: {
    name: 'Send Report to Mr Tito',
    executeOnce: true,
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    parameters: {
      resource: 'message',
      operation: 'sendMessage',
      chatId: expr("{{ $('Config').first().json.titobiChatId }}"),
      text: expr("{{ $('Compile Daily Report').first().json.report_text }}"),
      additionalFields: {
        appendAttribution: false,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      },
    },
    credentials: { telegramApi: newCredential('Tito Finance Telegram Bot') },
    output: [{ ok: true, result: { message_id: 900 } }],
  },
});

const gatherNote = sticky(
  '## Gather the day\n' +
    'Reads the active roster, then todays Tracker rows. The Tracker read is `executeOnce`\n' +
    'so it runs once rather than once per team member, and `alwaysOutputData` so a day with\n' +
    'no replies at all still reaches the compiler.',
  [configNode, getActiveTeam, getTrackerRows],
  { color: 4 },
);

const reportNote = sticky(
  '## Compile and deliver\n' +
    'Walks the active roster — not the Tracker — so a rep who never replied still appears,\n' +
    'flagged MISSING. Final statuses are written back to the sheet on one branch while the\n' +
    'report goes to Mr Tito on the other, so a Sheets hiccup cannot swallow the report.\n\n' +
    '**Tunable:** the MISSING flag and the timezone sit at the top of **Compile Daily Report**.\n' +
    'Mr Titos chat ID is in **Config**.',
  [compileReport, onlyRealRows, markMissing, sendReport],
  { color: 3 },
);

export default workflow('tito-daily-report', 'Tito Daily — 18:30 Report to Mr Tito')
  .add(reportTrigger)
  .to(configNode)
  .to(getActiveTeam)
  .to(getTrackerRows)
  .to(compileReport)
  .to(onlyRealRows)
  .to(markMissing)
  .add(compileReport)
  .to(sendReport)
  .add(gatherNote)
  .add(reportNote);
