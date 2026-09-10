import { workflow, node, trigger, sticky, newCredential, expr } from '@n8n/workflow-sdk';

const middayTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.4,
  config: {
    name: 'Weekdays 13:00 Lagos',
    parameters: {
      rule: { interval: [{ field: 'cronExpression', expression: '0 13 * * 1-5' }] },
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

const sendMiddayPrompt = node({
  type: 'n8n-nodes-base.telegram',
  version: 1.2,
  config: {
    name: 'Send Midday Check-In Prompt',
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    parameters: {
      resource: 'message',
      operation: 'sendMessage',
      chatId: expr('{{ $json.teamChatId }}'),
      text:
        '<b>Midday check-in.</b>\n\n' +
        'Please <b>reply to this message</b> with:\n' +
        '1. What you are working on right now\n' +
        '2. A <b>screenshot</b> as proof of work (attach the photo to your reply)\n\n' +
        'Replies without a screenshot are still logged, but they are flagged as <i>no photo attached</i>.',
      additionalFields: { appendAttribution: false, parse_mode: 'HTML' },
    },
    credentials: { telegramApi: newCredential('Tito Finance Telegram Bot') },
    output: [{ ok: true, result: { message_id: 102 } }],
  },
});

const storeMiddayPromptId = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Store Midday Prompt ID',
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
          midday_msg_id: expr('{{ $json.result.message_id }}'),
        },
        schema: [
          { id: 'day', displayName: 'day', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'chat_id', displayName: 'chat_id', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'midday_msg_id', displayName: 'midday_msg_id', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
        ],
      },
    },
    output: [{ id: 1, createdAt: '2026-09-10T12:00:00.000Z', updatedAt: '2026-09-10T12:00:00.000Z' }],
  },
});

const note = sticky(
  '## 13:00 Midday check-in prompt\n' +
    'Asks for current work plus a screenshot, then records this messages `message_id`\n' +
    'as `midday_msg_id` on todays row of the **Tito Daily Prompt IDs** data table.\n\n' +
    '**Tunable:** cron in the trigger, chat ID in **Config**, prompt wording here.',
  [configNode, sendMiddayPrompt, storeMiddayPromptId],
  { color: 4 },
);

export default workflow('tito-daily-midday-prompt', 'Tito Daily — 13:00 Midday Check-In Prompt')
  .add(middayTrigger)
  .to(configNode)
  .to(sendMiddayPrompt)
  .to(storeMiddayPromptId)
  .add(note);
