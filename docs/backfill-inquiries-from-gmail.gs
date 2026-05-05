/**
 * Backfill Kiosk Inquiries from Gmail (Resend emails) into Google Sheet
 *
 * SETUP:
 * 1. Create a Google Sheet with a sheet tab named "Inquiries".
 * 2. Row 1 headers: Timestamp | Full Name | Province | Email | Contact Number | Herd Size | Message | Source
 * 3. (Optional) Add a second sheet tab "ProcessedIds" with header in A1: MessageId
 *    - This stores Gmail message IDs so we don't add the same email twice.
 * 4. In Apps Script: File → New → Script file, paste this code, save.
 * 5. Run backfillInquiriesFromGmail() once (or from a menu). Authorize Gmail + Sheets when prompted.
 *
 * SEARCH:
 * - By default searches: subject:"New Update Request" in:inbox
 * - To include older or all mail, change the search query in the code (e.g. remove in:inbox).
 */

function backfillInquiriesFromGmail() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Inquiries');
  var processedSheet = ss.getSheetByName('ProcessedIds');

  if (!sheet) {
    SpreadsheetApp.getUi().alert('Create a sheet tab named "Inquiries" with headers: Timestamp, Full Name, Province, Email, Contact Number, Herd Size, Message, Source');
    return;
  }

  // Ensure header row
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Full Name', 'Province', 'Email', 'Contact Number', 'Herd Size', 'Message', 'Source']);
  }

  // Get or create ProcessedIds for dedupe
  var processedIds = {};
  if (processedSheet && processedSheet.getLastRow() > 0) {
    var ids = processedSheet.getRange(2, 1, processedSheet.getLastRow(), 1).getValues();
    ids.forEach(function(row) { processedIds[row[0]] = true; });
  } else if (!processedSheet) {
    processedSheet = ss.insertSheet('ProcessedIds');
    processedSheet.getRange(1, 1).setValue('MessageId');
  }

  var searchQuery = 'subject:"New Update Request" in:inbox';
  var threads = GmailApp.search(searchQuery, 0, 200); // up to 200 threads

  var added = 0;
  var skipped = 0;
  var newIds = [];

  threads.forEach(function(thread) {
    var messages = thread.getMessages();
    messages.forEach(function(message) {
      var id = message.getId();
      if (processedIds[id]) {
        skipped++;
        return;
      }

      var plain = message.getPlainBody();
      var row = parseInquiryEmail(plain, message.getDate());
      if (!row) return;

      sheet.appendRow(row);
      newIds.push([id]);
      processedIds[id] = true;
      added++;
    });
  });

  if (newIds.length > 0 && processedSheet) {
    processedSheet.getRange(processedSheet.getLastRow() + 1, 1, processedSheet.getLastRow() + newIds.length, 1).setValues(newIds);
  }

  SpreadsheetApp.getUi().alert('Backfill done. Added: ' + added + ', Skipped (already in sheet): ' + skipped);
}

/**
 * Parse Resend plain-text body into row: [Timestamp, Full Name, Province, Email, Contact Number, Herd Size, Message, Source]
 */
function parseInquiryEmail(plainBody, fallbackDate) {
  if (!plainBody || plainBody.indexOf('New Update Request') === -1) return null;

  var getValue = function(label) {
    var re = new RegExp(label + ':\\s*([^\n]+)', 'i');
    var m = plainBody.match(re);
    return m ? m[1].trim() : '';
  };

  var fullName = getValue('Full Name');
  var location = getValue('Location');
  var email = getValue('E-mail');
  var contactNumber = getValue('Contact Number');
  var herdSize = getValue('Herd Size');
  var messageText = '';

  var msgMatch = plainBody.match(/Message:\s*([\s\S]*?)(?=---|\nSubmitted at:|$)/i);
  if (msgMatch) messageText = msgMatch[1].trim();

  var submittedMatch = plainBody.match(/Submitted at:\s*([^\n]+)/i);
  var timestamp = submittedMatch ? submittedMatch[1].trim() : (fallbackDate ? Utilities.formatDate(fallbackDate, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss') : '');

  if (!fullName && !email) return null;

  return [
    timestamp || '',
    fullName,
    location || '',
    email,
    contactNumber || '',
    herdSize || '',
    messageText,
    'backfill'
  ];
}

/**
 * Optional: Add a menu to run backfill from the Sheet
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Inquiries')
    .addItem('Backfill from Gmail', 'backfillInquiriesFromGmail')
    .addToUi();
}
