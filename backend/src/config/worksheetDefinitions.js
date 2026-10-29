/**
 * #210 / #217 — the built-in definitions of every worksheet the portal keeps.
 *
 * A WORKSHEET is an Excel sheet the firm used to keep by hand, moved into the
 * portal. The engine (services/worksheetEngine.service.js) is the same for all
 * of them; this file is only data.
 *
 * Vocabulary:
 *   - BOOK: where the records live, and the catalogue of fields a record has.
 *     The five trademark reports share ONE book (the firm chose "one record per
 *     trademark", 29 Oct 2026), so a trademark's common details are typed once
 *     and appear in every report the trademark belongs to. Each company
 *     worksheet (#217) is its own book.
 *   - SHEET: one view onto a book — the dropdown entry. It lists which of the
 *     book's fields it shows, in which order, and under which heading. A record
 *     appears in a sheet when the sheet's key is in the record's `sheets` list.
 *   - MODULE: the page a set of sheets lives on (Trademark Reports, Worksheets).
 *
 * Field types: text | longtext | date | number | select | computed | image | matter.
 *   - `computed` fields are derived (renewal milestones, next KYC due) and are
 *     never typed or imported. `compute.from` lists source fields in priority
 *     order — the first one that holds a date is used.
 *   - `image` holds a short text (e.g. "WORD") AND an optional uploaded picture.
 *   - `matter` holds the id of a matter; the picker offers matters of the
 *     sheet's linked services only.
 *
 * Column headings carry `aliases`: the labels the firm's own Excel files use for
 * the same field ("DATE OF FILING TMA" on one report is "DATE OF FILING TM" on
 * another). Upload matching uses them; the firm's files are expected to vary.
 *
 * Everything the firm can change (headings, hidden columns, extra columns,
 * linked services) is stored as an override in `worksheetConfig/{book}` and
 * merged over these defaults — the defaults are never edited in place.
 */

/* ── Field helpers ───────────────────────────────────────────────────────── */

const f = (key, label, type = 'text', extra = {}) => ({ key, label, type, ...extra });
const select = (key, label, options, extra = {}) => f(key, label, 'select', { options, ...extra });
const computed = (key, label, from, add, extra = {}) => f(key, label, 'computed', { compute: { from, add }, ...extra });

const YES_NO = ['Yes', 'No'];

/* ── #210 Trademark: ONE book, five reports ─────────────────────────────── */

const TRADEMARK_FIELDS = [
  // Common details — entered once per trademark.
  f('date_of_filing', 'Date of Filing', 'date', { aliases: ['DATE OF FILING TM', 'DATE OF FILING TMA', 'FILING DATE'] }),
  // "Date of user" is often "Proposed to be used", so it is text, not a date.
  f('date_of_user_affidavit', 'Date of User Affidavit', 'text', { aliases: ['DATE OF USER', 'USER AFFIDAVIT', 'USER DATE'] }),
  select('constitution', 'Constitution (Company/Partnership/LLP/Proprietorship)',
    ['Company', 'Partnership', 'LLP', 'Proprietorship', 'Individual', 'Trust', 'Society', 'Other'],
    { aliases: ['CONSTITUTION', 'CONSTITUTION (COMPANY/PARTNERSHIP)'] }),
  f('logo_word_mark', 'Logo/Word Mark', 'image', { aliases: ['LOGO / WORD', 'LOGO / WORD MARK', 'LOGO', 'WORD MARK', 'LOGO/WORD'] }),
  f('trademark_name', 'Trademark Name', 'text', { aliases: ['TRADEMARK', 'TM NAME', 'MARK'] }),
  f('proprietor_name', 'Proprietor Name', 'text', { aliases: ['PROPRIETOR'] }),
  f('application_no', 'Application No.', 'text', { aliases: ['APPLICATION NUMBER', 'APP NO', 'APPLICATION NO', 'TM APPLICATION NO'] }),
  f('class', 'Class', 'text', { aliases: ['CLASS NO', 'CLASSES'] }),
  f('application_filed_by', 'Application Filed By', 'text', { aliases: ['APPLICANT', 'FILED BY'] }),
  f('current_attorney', 'Current Attorney', 'text', { aliases: ['ATTORNEY', 'AGENT'] }),
  f('client', 'Client', 'text', { aliases: ['CLIENT (WORK KISNE KIYA HAI?)', 'CLIENT (WORK KISNE DIYA HAI)', 'CLIENT NAME'] }),
  f('mail_from', 'Mail From', 'text'),
  f('jurisdiction', 'Jurisdiction', 'text'),
  f('status', 'Status', 'text'),
  f('remark', 'Remark', 'longtext', { aliases: ['REMARKS'] }),
  f('mobile_no', 'Mobile No.', 'text', { aliases: ['MOBILE NUMBER', 'MOBILE', 'PHONE', 'CONTACT NO'] }),
  f('email_id', 'Email ID', 'text', { aliases: ['EMAIL', 'E-MAIL', 'EMAIL ADDRESS'] }),
  f('review', 'Review', 'longtext'),
  f('matter', 'Matter', 'matter'),

  // TM Master.
  f('name_of_examiner', 'Name of Examiner', 'text', { aliases: ['EXAMINER'] }),
  f('examination_report', 'Examination Report', 'text', { aliases: ['EXAMINATION REPO', 'EXAM REPORT', 'EXAM REP'] }),
  f('objection_section', 'Objection Section', 'text', { aliases: ['OBJECTION'] }),
  f('hearing_officer', 'Hearing Officer', 'text'),
  f('respective_date', 'Respective Date', 'date'),
  f('expected_date', 'Expected Date of Registration/Hearing/Exam Rep', 'date', { aliases: ['EXPECTED DATE'] }),
  f('percentage_given_by_us', 'Percentage Given by Us', 'text', { aliases: ['PERCENTAGE'] }),

  // Register TM / TM Assignment.
  f('opposition_no', 'Opposition No.', 'text', { aliases: ['OPPOSITION NUM', 'OPPOSITION NUMBER', 'OPPOSITION NO'] }),
  select('hearing', 'Hearing Yes/No', YES_NO, { aliases: ['HEARING/YES/NO', 'HEARING YES/NO', 'HEARING'] }),
  f('registration_date', 'Registration Date', 'date', { aliases: ['DATE OF REGISTRATION'] }),
  f('last_renewal_date', 'Date of Last Renewal / First Application', 'date', {
    aliases: ['DATE OF LAST RENEWAL / FIRST APPLICATION (T)', 'DATE OF LAST RENEWAL', 'LAST RENEWAL DATE'],
  }),
  // Renewal milestones (firm, 29 Oct): calculated, never typed. From the date of
  // last renewal / first application when it is filled, otherwise from the
  // registration date. See architecture.md §Worksheets for why that order.
  computed('renewal_9y', '9 Year Completed', ['last_renewal_date', 'registration_date'], { years: 9 }, { aliases: ['9 YEAR COMPLETED'] }),
  computed('renewal_9_5y', '9.5 Year Completed', ['last_renewal_date', 'registration_date'], { years: 9, months: 6 }, { aliases: ['9.5 YEAR COMPLETED'] }),
  computed('renewal_10y', '10 Years Completed On', ['last_renewal_date', 'registration_date'], { years: 10 }, { aliases: ['10 YEARS COMPLETED ON', '10 YEAR COMPLETED'] }),
  computed('renewal_10_5y', '10.5 Year (₹4,500 Late Fee)', ['last_renewal_date', 'registration_date'], { years: 10, months: 6 }, { aliases: ['10.5 YEAR (4500 LATE FEE)', '10.5 YEAR'] }),
  computed('renewal_11y', '11 Year (₹9,000 Restoration Fee)', ['last_renewal_date', 'registration_date'], { years: 11 }, { aliases: ['11 YEAR (9000 RESTORATION FEE)', '11 YEAR'] }),

  // Oppositions.
  f('before_opposition_hearing', 'Before Opposition Hearing', 'text', { aliases: ['BEFORE OPPOSITION'] }),
  f('notice_of_opposition', 'Notice of Opposition', 'date'),
  f('opponent_name', 'Opponent Name', 'text', { aliases: ['OPPONENT'] }),
  f('cs_received_on', 'CS Received On', 'date', { aliases: ['COUNTER STATEMENT RECEIVED ON'] }),
  f('cs_issued', 'Notice of CS Issued by the', 'text', { aliases: ['NOTICE OF CS ISSUED BY THE', 'NOTICE OF CS ISSUED'] }),
  f('rule_45_submitted', 'Rule 45 Submitted', 'date'),
  f('rule_45_received', 'Rule 45 Received On', 'date'),
  f('rule_46_received', 'Rule 46 Received On', 'date'),
  f('rule_46_submitted', 'Rule 46 Submitted On', 'date'),
  f('rule_47_submitted', 'Rule 47 Submitted', 'date'),
  f('rule_47_received', 'Rule 47 Received', 'date'),
  f('opposition_hearing', 'Opposition Hearing', 'text', { aliases: ['OPPOSITION HEARING YES/NO'] }),
];

/**
 * A sheet column: a field key, optionally with the heading THIS report uses.
 * The order is the firm's (issue #210 body), minus the columns the firm asked to
 * remove on 29 Oct: Register TM — COLUMN 1, COLUMN 2, %; TM Assignment —
 * COLUMN 1, COLUMN 2, NETSTAT SEI and the empty last column.
 */
const c = (key, label) => (label ? { key, label } : { key });

const TM_SHEETS = [
  {
    key: 'tm_master', label: 'TM Master',
    columns: [
      c('date_of_filing'), c('date_of_user_affidavit'), c('constitution'), c('logo_word_mark'), c('trademark_name'),
      c('proprietor_name'), c('application_no'), c('class'), c('application_filed_by'), c('current_attorney'),
      c('client'), c('mail_from'), c('name_of_examiner'), c('examination_report'), c('objection_section'),
      c('hearing_officer'), c('jurisdiction'), c('status'), c('respective_date'), c('expected_date'), c('remark'),
      c('mobile_no'), c('email_id'), c('percentage_given_by_us'), c('review'), c('matter'),
    ],
  },
  {
    key: 'tm_register', label: 'Register TM',
    columns: [
      c('date_of_filing', 'Date of Filing TM'), c('date_of_user_affidavit'), c('constitution'), c('logo_word_mark'),
      c('trademark_name'), c('proprietor_name'), c('application_no'), c('application_filed_by'), c('current_attorney'),
      c('client', 'Client (Work Kisne Kiya Hai?)'), c('mail_from'), c('opposition_no'), c('hearing'), c('jurisdiction'),
      c('status'), c('registration_date'), c('last_renewal_date'), c('renewal_9y'), c('renewal_9_5y'), c('renewal_10y'),
      c('renewal_10_5y'), c('renewal_11y'), c('remark'), c('mobile_no', 'Mobile Number'), c('email_id'), c('review'),
      c('matter'),
    ],
  },
  {
    key: 'tm_opposition_raised', label: 'Opposition Raised',
    columns: [
      c('date_of_filing', 'Date of Filing TMA'), c('date_of_user_affidavit', 'Date of User'), c('constitution', 'Constitution'),
      c('logo_word_mark', 'Logo / Word'), c('trademark_name'), c('proprietor_name'), c('application_no'), c('class'),
      c('application_filed_by', 'Applicant'), c('current_attorney'), c('client'), c('opposition_no', 'Opposition Num'),
      c('examination_report', 'Examination Repo'), c('before_opposition_hearing', 'Before Opposition'), c('jurisdiction'),
      c('notice_of_opposition'), c('cs_received_on'), c('rule_45_submitted'), c('rule_46_received'),
      c('rule_47_submitted'), c('opposition_hearing'), c('remark', 'Remarks'), c('matter'),
    ],
  },
  {
    key: 'tm_opposition_received', label: 'Opposition Received',
    columns: [
      c('date_of_filing', 'Date of Filing TMA'), c('date_of_user_affidavit'), c('constitution', 'Constitution'),
      c('logo_word_mark', 'Logo / Word'), c('trademark_name'), c('proprietor_name'), c('application_no'), c('class'),
      c('application_filed_by'), c('current_attorney'), c('client'), c('opponent_name'), c('opposition_no', 'Opposition Number'),
      c('examination_report'), c('before_opposition_hearing'), c('jurisdiction'), c('notice_of_opposition'),
      c('cs_issued'), c('rule_45_received'), c('rule_46_submitted'), c('rule_47_received'),
      c('opposition_hearing', 'Opposition Hearing Yes/No'), c('remark'), c('matter'),
    ],
  },
  {
    key: 'tm_assignment', label: 'TM Assignment',
    columns: [
      c('date_of_filing', 'Date of Filing TMA'), c('date_of_user_affidavit'), c('constitution', 'Constitution (Company/Partnership)'),
      c('logo_word_mark', 'Logo / Word Mark'), c('trademark_name'), c('proprietor_name'), c('application_no'), c('class'),
      c('application_filed_by'), c('current_attorney'), c('client', 'Client (Work Kisne Diya Hai)'), c('mail_from'),
      c('opposition_no', 'Opposition Number'), c('hearing'), c('jurisdiction'), c('status'), c('registration_date'),
      c('last_renewal_date', 'Date of Last Renewal / First Application (T)'), c('renewal_9y'), c('renewal_9_5y'),
      c('renewal_10y'), c('renewal_10_5y'), c('renewal_11y'), c('remark'), c('mobile_no', 'Mobile Number'), c('email_id'),
      c('review'), c('matter'),
    ],
  },
];

/* ── Assembly ────────────────────────────────────────────────────────────── */

export const BOOKS = {
  trademark: {
    key: 'trademark',
    module: 'trademark',
    fields: TRADEMARK_FIELDS,
    recordKey: ['application_no'],
    // The firm asked each record to link to its trademark matter (29 Oct).
    linkedServices: ['trademark-application'],
  },
};

export const SHEETS = {};
for (const s of TM_SHEETS) SHEETS[s.key] = { ...s, module: 'trademark', book: 'trademark' };

export const MODULES = {
  trademark: { key: 'trademark', label: 'Trademark Reports', sheets: TM_SHEETS.map((s) => s.key) },
};

export const FIELD_TYPES = ['text', 'longtext', 'date', 'number', 'select', 'computed', 'image', 'matter'];
/** Types an admin may give a column they add. Computed columns are built in only. */
export const ADDABLE_TYPES = ['text', 'longtext', 'date', 'number', 'select', 'image'];
