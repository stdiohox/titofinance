import { workflow, node, trigger, sticky, newCredential, expr } from '@n8n/workflow-sdk';

const errorTrigger = trigger({
  type: 'n8n-nodes-base.errorTrigger',
  version: 1,
  config: {
    name: 'On Workflow Failure',
    parameters: {},
    output: [
      {
        execution: {
          id: '231',
          url: 'https://dancheezy.app.n8n.cloud/workflow/7vCh9BQJVEQ4dzjS/executions/231',
          error: { message: 'Bad request - please check your parameters', stack: 'NodeApiError: ...' },
          lastNodeExecuted: 'Send Sign-In Prompt',
          mode: 'trigger',
        },
        workflow: { id: '7vCh9BQJVEQ4dzjS', name: 'Tito Daily — 09:00 Sign-In Prompt' },
      },
    ],
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
            id: 'alert-recipient',
            name: 'alertRecipient',
            value: 'REPLACE_WITH_ALERT_RECIPIENT_EMAIL',
            type: 'string',
          },
        ],
      },
    },
    output: [{ alertRecipient: 'someone@example.com' }],
  },
});

const extractFailure = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Extract Failure Details',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode:
        "// ---- Tunable configuration ------------------------------------------\n" +
        "const TIMEZONE = 'Africa/Lagos';\n" +
        "// ----------------------------------------------------------------------\n" +
        "\n" +
        "// The Error Trigger hands over one of two shapes: `execution` when a running\n" +
        "// workflow threw, or `trigger` when the trigger itself could not start. Read\n" +
        "// both so a poll/webhook failure is not reported as an empty error.\n" +
        "const d = $input.first().json;\n" +
        "const ex = d.execution || {};\n" +
        "const tr = d.trigger || {};\n" +
        "const wf = d.workflow || {};\n" +
        "\n" +
        "const err = ex.error || tr.error || {};\n" +
        "\n" +
        "let failedNode = ex.lastNodeExecuted;\n" +
        "if (!failedNode) failedNode = tr.error ? '(trigger could not start)' : 'unknown node';\n" +
        "\n" +
        "function esc(v) {\n" +
        "  return String(v == null ? '' : v)\n" +
        "    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');\n" +
        "}\n" +
        "\n" +
        "const workflowName = wf.name || 'Unknown workflow';\n" +
        "const errorMessage = err.message || 'No error message supplied';\n" +
        "const stack = err.stack || '';\n" +
        "const when = $now.setZone(TIMEZONE).toFormat('cccc, dd LLLL yyyy HH:mm:ss') + ' WAT';\n" +
        "const executionUrl = ex.url || '';\n" +
        "\n" +
        "let body = '<p><b>A Tito Finance tracker workflow failed.</b></p>'\n" +
        "  + '<table cellpadding=\"6\" style=\"border-collapse:collapse\">'\n" +
        "  + '<tr><td><b>Workflow</b></td><td>' + esc(workflowName) + '</td></tr>'\n" +
        "  + '<tr><td><b>Failed node</b></td><td>' + esc(failedNode) + '</td></tr>'\n" +
        "  + '<tr><td><b>When</b></td><td>' + esc(when) + '</td></tr>'\n" +
        "  + '<tr><td><b>Error</b></td><td>' + esc(errorMessage) + '</td></tr>'\n" +
        "  + '</table>';\n" +
        "\n" +
        "if (executionUrl) {\n" +
        "  body += '<p><a href=\"' + esc(executionUrl) + '\">Open the failed execution in n8n</a></p>';\n" +
        "}\n" +
        "\n" +
        "if (stack) {\n" +
        "  body += '<p><b>Stack trace</b></p><pre style=\"white-space:pre-wrap;font-size:12px\">'\n" +
        "    + esc(stack) + '</pre>';\n" +
        "}\n" +
        "\n" +
        "body += '<hr><p style=\"color:#666;font-size:12px\">Sent by the Tito Finance Error Handler. '\n" +
        "  + 'Every tracker workflow points at it via Settings &gt; Error Workflow.</p>';\n" +
        "\n" +
        "return [{ json: {\n" +
        "  workflowName: workflowName,\n" +
        "  failedNode: failedNode,\n" +
        "  errorMessage: errorMessage,\n" +
        "  timestamp: when,\n" +
        "  executionUrl: executionUrl,\n" +
        "  emailBody: body,\n" +
        "} }];\n",
    },
    output: [
      {
        workflowName: 'Tito Daily — 09:00 Sign-In Prompt',
        failedNode: 'Send Sign-In Prompt',
        errorMessage: 'Bad request - please check your parameters',
        timestamp: 'Thursday, 10 September 2026 09:00:04 WAT',
        executionUrl: 'https://dancheezy.app.n8n.cloud/workflow/7vCh9BQJVEQ4dzjS/executions/231',
        emailBody: '<p><b>A Tito Finance tracker workflow failed.</b></p>',
      },
    ],
  },
});

const sendAlert = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: {
    name: 'Email the Failure',
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    parameters: {
      resource: 'message',
      operation: 'send',
      sendTo: expr("{{ $('Config').first().json.alertRecipient }}"),
      subject: expr('Tito Tracker failure: {{ $json.workflowName }}'),
      emailType: 'html',
      message: expr('{{ $json.emailBody }}'),
      options: { appendAttribution: false },
    },
    credentials: { gmailOAuth2: newCredential('Gmail account') },
    output: [{ id: '19a2f3c', threadId: '19a2f3c', labelIds: ['SENT'] }],
  },
});

const note = sticky(
  '## Shared error handler\n' +
    'All five tracker workflows point here via **Settings > Error Workflow**, so failure\n' +
    'notification lives in one place instead of being rebuilt per workflow.\n\n' +
    'Fires only for **production** executions — manual test runs never reach it. A workflow\n' +
    'that has its own Error Trigger would use that instead; none of ours do.\n\n' +
    '**Tunable:** recipient in **Config**, timezone at the top of **Extract Failure Details**.\n\n' +
    'To move alerts to Telegram once the bot credential exists, swap **Email the Failure**\n' +
    'for a Telegram sendMessage to Samuels personal chat ID — not the team group.',
  [configNode, extractFailure, sendAlert],
  { color: 3 },
);

export default workflow('tito-error-handler', 'Tito Daily — Error Handler')
  .add(errorTrigger)
  .to(configNode)
  .to(extractFailure)
  .to(sendAlert)
  .add(note);
