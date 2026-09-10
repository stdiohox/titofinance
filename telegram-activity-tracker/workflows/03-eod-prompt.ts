import { workflow, node, trigger, sticky, newCredential, expr } from '@n8n/workflow-sdk';

const eodTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.4,
  config: {
    name: 'Weekdays 18:00 Lagos',
    parameters: {
      rule: { interval: [{ field: 'cronExpression', expression: '0 18 * * 1-5' }] },
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
            id: 'team-chat-id',
            name: 'teamChatId',
            value: 'REPLACE_WITH_TEAM_GROUP_CHAT_ID',
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
    output: [{ teamChatId: '-1001234567890', today: '2026-09-10' }],
  },
});

const sendEodPrompt = node({
  type: 'n8n-nodes-base.telegram',
  version: 1.2,
  config: {
    name: 'Send End-Of-Day Prompt',
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    parameters: {
      resource: 'message',
      operation: 'sendMessage',
      chatId: expr('{{ $json.teamChatId }}'),
      text:
        '<b>End of day report.</b>\n\n' +
        'Please <b>reply to this message</b> with a summary of what you completed today.\n\n' +
        'Reports are compiled and sent to Mr Tito at <b>18:30</b>, so reply before then.',
      additionalFields: { appendAttribution: false, parse_mode: 'HTML' },
    },
    credentials: { telegramApi: newCredential('Tito Finance Telegram Bot') },
    output: [{ ok: true, result: { message_id: 103 } }],
  },
});

const storeEodPromptId = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Store EOD Prompt ID',
    retryOnFail: true,
    maxTries: 3,
    parameters: {
      resource: 'row',
      operation: 'upsert',
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
            keyValue: expr("{{ $('Config').item.json.today }}"),
          },
        ],
      },
      columns: {
        mappingMode: 'defineBelow',
        matchingColumns: ['day'],
        value: {
          day: expr("{{ $('Config').item.json.today }}"),
          chat_id: expr("{{ $('Config').item.json.teamChatId }}"),
          eod_msg_id: expr('{{ $json.result.message_id }}'),
        },
        schema: [
          { id: 'day', displayName: 'day', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'chat_id', displayName: 'chat_id', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'eod_msg_id', displayName: 'eod_msg_id', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
        ],
      },
    },
    output: [{ id: 1, createdAt: '2026-09-10T17:00:00.000Z', updatedAt: '2026-09-10T17:00:00.000Z' }],
  },
});

const note = sticky(
  '## 18:00 End-of-day prompt\n' +
    'Asks for a completion summary, then records this messages `message_id` as `eod_msg_id`\n' +
    'on todays row of the **Tito Daily Prompt IDs** data table.\n\n' +
    'The 18:30 report workflow runs 30 minutes later and marks anything still blank as missing.\n\n' +
    '**Tunable:** cron in the trigger, chat ID in **Config**, prompt wording here.',
  [configNode, sendEodPrompt, storeEodPromptId],
  { color: 4 },
);

export default workflow('tito-daily-eod-prompt', 'Tito Daily — 18:00 End-Of-Day Prompt')
  .add(eodTrigger)
  .to(configNode)
  .to(sendEodPrompt)
  .to(storeEodPromptId)
  .add(note);
