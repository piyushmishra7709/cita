/**
 * CITA Bharat EV - Website enquiry collector (Google Sheet + automatic emails)
 *
 * What it does for every form submission:
 *   1. Adds a new row in this Google Sheet (tab "Enquiries")
 *   2. Emails the enquiry to sales@citabharatev.com   (Reply goes straight to the customer)
 *   3. Emails a "Thank you for contacting CITA Bharat EV" confirmation to the customer
 */

const CONFIG = {
  SALES_EMAIL: 'sales@citabharatev.com',   // where enquiries are delivered
  BRAND: 'CITA Bharat EV',
  SHEET_NAME: 'Enquiries',
  CONTACT_PHONE: '+91 81369 55867',        // shown in the customer's confirmation email
  WEBSITE: 'https://citabharatev.com',
  SEND_FROM: ''                            // optional: a "Send mail as" alias, e.g. 'sales@citabharatev.com' (leave '' if you run this script from the sales@ account itself)
};

const HEADERS = ['Reference', 'Date/Time (IST)', 'Name', 'Email', 'Phone', 'City', 'Charger Type',
                 'Install Location', 'Timeline', 'Requirement', 'Page', 'Mail Status'];

function doGet() {
  return ContentService.createTextOutput('CITA enquiry endpoint is running.');
}

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};

    // spam trap: real visitors never fill this hidden field
    if (p.website) return reply_('ok');

    const d = {
      name: clean_(p.name, 80),
      email: clean_(p.email, 120).toLowerCase(),
      phone: clean_(p.phone, 20),
      city: clean_(p.city, 80),
      type: clean_(p.charger_type, 80),
      where: clean_(p.install_location, 80),
      when: clean_(p.timeline, 40),
      desc: clean_(p.description, 2000),
      page: clean_(p.page, 300)
    };

    let digits = d.phone.replace(/\D/g, '');
    if (digits.length === 12 && digits.indexOf('91') === 0) digits = digits.slice(2);
    if (d.name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) || digits.length !== 10 ||
        !d.city || !d.type || !d.where || !d.when || !d.desc) {
      return reply_('invalid');
    }
    d.phone = '+91 ' + digits;

    // ignore accidental double-clicks (same email + phone within 60 seconds)
    const cache = CacheService.getScriptCache();
    const key = 'dup_' + d.email + digits;
    if (cache.get(key)) return reply_('duplicate');
    cache.put(key, '1', 60);

    const ref = 'CITA-' + Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyMMdd') + '-' +
                Math.random().toString(36).substring(2, 6).toUpperCase();
    const when = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd-MMM-yyyy HH:mm:ss');

    // 1) save to sheet
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    let row;
    try {
      const sheet = getSheet_();
      sheet.appendRow([ref, when, safe_(d.name), d.email, d.phone, safe_(d.city), d.type,
                       d.where, d.when, safe_(d.desc), d.page, 'pending']);
      row = sheet.getLastRow();
    } finally {
      lock.releaseLock();
    }

    // 2) email sales   3) email customer
    const status = [];
    try { sendSales_(d, ref, when); status.push('Sales: sent'); }
    catch (err) { status.push('Sales: FAILED - ' + err.message); }
    try { sendCustomer_(d, ref); status.push('Customer: sent'); }
    catch (err) { status.push('Customer: FAILED - ' + err.message); }
    getSheet_().getRange(row, HEADERS.length).setValue(status.join(' | '));

    return reply_('ok');
  } catch (err) {
    console.error(err);
    return reply_('error');
  }
}

/* ---------------- emails ---------------- */

function mailOptions_(extra) {
  const o = { name: CONFIG.BRAND };
  if (CONFIG.SEND_FROM) o.from = CONFIG.SEND_FROM;
  for (const k in extra) o[k] = extra[k];
  return o;
}

function sendSales_(d, ref, when) {
  const rows = [['Reference', ref], ['Date/Time', when], ['Name', d.name], ['Email', d.email], ['Phone / WhatsApp', d.phone],
                ['City/Town', d.city], ['Charger Type', d.type], ['Install Location', d.where],
                ['Timeline', d.when], ['Requirement', d.desc], ['Page', d.page]];
  let html = '<h2 style="font-family:Arial">New enquiry from the website</h2>' +
             '<table cellpadding="8" style="border-collapse:collapse;font-family:Arial;font-size:14px">';
  rows.forEach(function (r) {
    html += '<tr><td style="border:1px solid #ddd;background:#f5f7fa;font-weight:bold;vertical-align:top">' + esc_(r[0]) +
            '</td><td style="border:1px solid #ddd">' + esc_(r[1]).replace(/\n/g, '<br>') + '</td></tr>';
  });
  html += '</table><p style="font-family:Arial;font-size:12px;color:#777">Reply to this email to answer the customer directly.</p>';
  const text = rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n');
  GmailApp.sendEmail(CONFIG.SALES_EMAIL, 'New Quote Enquiry [' + ref + '] - ' + d.type + ' - ' + d.city, text,
                     mailOptions_({ htmlBody: html, replyTo: d.email }));
}

function sendCustomer_(d, ref) {
  const html =
    '<div style="font-family:Arial,sans-serif;font-size:15px;color:#1e293b;max-width:600px">' +
    '<h2 style="color:#046bd2">Thank you for contacting ' + esc_(CONFIG.BRAND) + '!</h2>' +
    '<p>Dear ' + esc_(d.name) + ',</p>' +
    '<p>We have received your enquiry for a <strong>' + esc_(d.type) + '</strong> in <strong>' + esc_(d.city) + '</strong>. ' +
    'Our EV charging expert will review your requirement and get back to you within <strong>1 business day</strong> with a customised quote.</p>' +
    '<p><strong>Your reference number:</strong> ' + esc_(ref) + '</p>' +
    '<table cellpadding="6" style="font-size:14px;background:#f5f7fa">' +
    '<tr><td><b>Installation location</b></td><td>' + esc_(d.where) + '</td></tr>' +
    '<tr><td><b>Timeline</b></td><td>' + esc_(d.when) + '</td></tr>' +
    '<tr><td><b>Your requirement</b></td><td>' + esc_(d.desc).replace(/\n/g, '<br>') + '</td></tr></table>' +
    '<p>Need a faster response? Call or WhatsApp us on <a href="tel:' + CONFIG.CONTACT_PHONE.replace(/\s/g, '') + '">' + esc_(CONFIG.CONTACT_PHONE) + '</a> ' +
    'or write to <a href="mailto:' + CONFIG.SALES_EMAIL + '">' + CONFIG.SALES_EMAIL + '</a>.</p>' +
    '<p>Warm regards,<br><strong>Team ' + esc_(CONFIG.BRAND) + '</strong><br>Powering a Greener Future<br>' +
    '<a href="' + CONFIG.WEBSITE + '">' + CONFIG.WEBSITE.replace('https://', '') + '</a></p></div>';
  const text = 'Dear ' + d.name + ',\n\nThank you for contacting ' + CONFIG.BRAND + '. We have received your enquiry (Ref: ' + ref +
               ') and our team will contact you within 1 business day.\n\nCall/WhatsApp: ' + CONFIG.CONTACT_PHONE +
               '\nEmail: ' + CONFIG.SALES_EMAIL + '\n\nTeam ' + CONFIG.BRAND;
  GmailApp.sendEmail(d.email, 'Thank you for contacting ' + CONFIG.BRAND + ' (Ref: ' + ref + ')', text,
                     mailOptions_({ htmlBody: html, replyTo: CONFIG.SALES_EMAIL }));
}

/* ---------------- helpers ---------------- */

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(CONFIG.SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#046bd2').setFontColor('#ffffff');
  }
  return sh;
}
function clean_(v, max) { return String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().substring(0, max); }
function safe_(v) { return /^[=+\-@]/.test(v) ? "'" + v : v; }   // stops spreadsheet formula injection
function esc_(v) { return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function reply_(s) { return ContentService.createTextOutput(s); }

/** Run this ONCE from the editor (Run > testEnquiry) to grant permissions and check everything works. */
function testEnquiry() {
  doPost({ parameter: { name: 'Test Customer', email: CONFIG.SALES_EMAIL, phone: '9876543210', city: 'Nagpur',
    charger_type: 'Home EV Charger', install_location: 'Home / Villa', timeline: 'Immediately',
    description: 'This is a test enquiry from the Apps Script editor.', page: 'test' } });
}
