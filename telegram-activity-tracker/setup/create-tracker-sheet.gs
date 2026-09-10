/**
 * Creates "Tito Finance – Daily Activity Tracker" with its two tabs and headers.
 *
 * One-time setup. Run it once from script.google.com under the Google account that
 * should own the spreadsheet — the same account whose credential n8n will use.
 *
 *   1. Go to https://script.google.com and start a new project.
 *   2. Replace the contents of Code.gs with this file.
 *   3. Run createTitoTrackerSheet, and grant the permissions it asks for.
 *   4. Copy the URL it logs (View > Logs) — that is the spreadsheet the n8n
 *      workflows need to point at.
 *
 * Re-running creates a second, separate spreadsheet. Run it once.
 */

var TEAM_HEADERS = ['telegram_user_id', 'telegram_username', 'full_name', 'active'];

var TRACKER_HEADERS = [
  'date',
  'rep_name',
  'signin_time',
  'signin_status',
  'midday_time',
  'midday_proof_link',
  'midday_status',
  'eod_time',
  'eod_report_text',
  'eod_status',
];

function createTitoTrackerSheet() {
  var ss = SpreadsheetApp.create('Tito Finance – Daily Activity Tracker');

  var team = ss.getSheets()[0];
  team.setName('Team');
  writeHeaders_(team, TEAM_HEADERS);

  // Two sample rows so the roster's shape is obvious. Overwrite them with real
  // reps — the workflows only ever read rows whose active column reads Y.
  team.getRange(2, 1, 2, TEAM_HEADERS.length).setValues([
    ['000000000', 'replace_me', 'Replace With Real Name', 'N'],
    ['000000001', 'replace_me_too', 'Another Real Name', 'N'],
  ]);
  team.setColumnWidth(1, 150);
  team.setColumnWidth(3, 200);

  var tracker = ss.insertSheet('Tracker');
  writeHeaders_(tracker, TRACKER_HEADERS);
  tracker.setColumnWidth(1, 100);
  tracker.setColumnWidth(2, 160);
  tracker.setColumnWidth(6, 260);
  tracker.setColumnWidth(9, 320);

  // The Tracker is written by n8n via appendOrUpdate keyed on date + rep_name.
  // Leave it empty; the first reply of the first day creates row 2.

  var url = ss.getUrl();
  Logger.log('Spreadsheet created: ' + url);
  Logger.log('Spreadsheet ID: ' + ss.getId());
  return url;
}

function writeHeaders_(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet
    .getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#1f2937')
    .setFontColor('#ffffff');
  sheet.setFrozenRows(1);

  // Trim the default 26 columns down to the schema so stray columns cannot be
  // created by a mis-mapped write.
  var extra = sheet.getMaxColumns() - headers.length;
  if (extra > 0) {
    sheet.deleteColumns(headers.length + 1, extra);
  }
}
