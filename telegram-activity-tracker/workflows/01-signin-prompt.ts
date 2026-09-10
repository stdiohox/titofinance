import { workflow, node, trigger, sticky, newCredential, expr } from '@n8n/workflow-sdk';

const morningTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.4,
  config: {
    name: 'Weekdays 09:00 Lagos',
    parameters: {
      rule: { interval: [{ field: 'cronExpression', expression: '0 9 * * 1-5' }] },
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

const sendSignInPrompt = node({
  type: 'n8n-nodes-base.telegram',
  version: 1.2,
  config: {
    name: 'Send Sign-In Prompt',
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    parameters: {
      resource: 'message',
      operation: 'sendMessage',
      chatId: expr('{{ $json.teamChatId }}'),
      text:
        '<b>Good morning, Tito Finance team.</b>\n\n' +
        'Please <b>reply to this message</b> to sign in for the day.\n\n' +
        'On time: reply before <b>09:15</b>.\n' +
        'Use the Telegram <i>Reply</i> feature on this exact message so your sign-in is recorded.',
      additionalFields: { appendAttribution: false, parse_mode: 'HTML' },
    },
    credentials: { telegramApi: newCredential('Tito Finance Telegram Bot') },
    output: [{ ok: true, result: { message_id: 101 } }],
  },
});

const storeSignInPromptId = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Store Sign-In Prompt ID',
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
          signin_msg_id: expr('{{ $json.result.message_id }}'),
        },
        schema: [
          { id: 'day', displayName: 'day', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'chat_id', displayName: 'chat_id', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'signin_msg_id', displayName: 'signin_msg_id', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
        ],
      },
    },
    output: [{ id: 1, createdAt: '2026-09-10T08:00:00.000Z', updatedAt: '2026-09-10T08:00:00.000Z' }],
  },
});

const note = sticky(
  '## 09:00 Sign-in prompt\n' +
    'Posts the daily sign-in message to the team group, then records its `message_id` in the\n' +
    '**Tito Daily Prompt IDs** data table under todays date.\n\n' +
    'The reply-router workflow matches incoming `reply_to_message.message_id` against that stored ID.\n\n' +
    '**Tunable:** cron in the trigger, chat ID in **Config**, prompt wording here.',
  [configNode, sendSignInPrompt, storeSignInPromptId],
  { color: 4 },
);

export default workflow('tito-daily-signin-prompt', 'Tito Daily — 09:00 Sign-In Prompt')
  .add(morningTrigger)
  .to(configNode)
  .to(sendSignInPrompt)
  .to(storeSignInPromptId)
  .add(note);
