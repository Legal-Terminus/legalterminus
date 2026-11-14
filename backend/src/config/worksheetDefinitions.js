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
 *   - MODULE: the page a set of sheets lives on (Trademark Reports, Worksheets,
 *     GST Return Filing — #279).
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

/* ── #217 Company worksheets: one book per sheet ─────────────────────────
 *
 * The firm gave NO columns for these. Everything below is a PROPOSAL for an
 * Indian CA/CS practice, recorded as such in epics.md — the firm adjusts it with
 * Add column / Hide column, which never loses data.
 */

const client = () => f('client', 'Client', 'text', { aliases: ['CLIENT NAME'] });
const company = (label = 'Company Name') => f('company_name', label, 'text', { aliases: ['COMPANY', 'NAME OF COMPANY', 'ENTITY NAME', 'COMPANY NAME', 'BUSINESS NAME'] });
const cin = (label = 'CIN') => f('cin', label, 'text', { aliases: ['CIN', 'LLPIN', 'CIN/LLPIN', 'CIN / LLPIN'] });
const srn = (label = 'SRN') => f('srn', label, 'text', { aliases: ['SRN NO', 'SRN NUMBER'] });
const matter = () => f('matter', 'Matter', 'matter');
const remarks = () => f('remarks', 'Remarks', 'longtext', { aliases: ['REMARK'] });
const mobile = () => f('mobile_no', 'Mobile No.', 'text', { aliases: ['MOBILE', 'MOBILE NUMBER', 'PHONE'] });
const email = () => f('email_id', 'Email ID', 'text', { aliases: ['EMAIL', 'E-MAIL'] });
const status = (options) => select('status', 'Status', options);
const fy = (key = 'financial_year', label = 'Financial Year') => f(key, label, 'text', { aliases: ['FY', 'F.Y.', 'YEAR'] });

const ENTITY_TYPES = ['Private Limited', 'One Person Company', 'Public Limited', 'Section 8', 'LLP', 'Other'];
const FILING_STATUS = ['Pending', 'In progress', 'Filed', 'Resubmission', 'Approved', 'Rejected'];
const REG_STATUS = ['Applied', 'Under review', 'Registered', 'Rejected', 'Cancelled', 'Expired'];

const INCORPORATION_SERVICES = ['incorporation', 'private-limited', 'public-limited-company', 'opc-registration', 'section8-company', 'llp-registration'];
const DIRECTOR_SERVICES = ['add-director', 'director-partner'];

const COMPANY_SHEETS = [
  {
    key: 'incorporation', label: 'Incorporation Sheet', recordKey: ['cin'], linkedServices: INCORPORATION_SERVICES,
    fields: [
      client(), company('Company Name (Proposed / Approved)'), select('entity_type', 'Entity Type', ENTITY_TYPES),
      f('name_approved_on', 'Name Approved On', 'date', { aliases: ['NAME APPROVAL DATE', 'RUN APPROVAL DATE'] }),
      f('date_of_filing', 'Date of Filing (SPICe+/FiLLiP)', 'date', { aliases: ['DATE OF FILING', 'FILING DATE'] }), srn(),
      f('date_of_incorporation', 'Date of Incorporation', 'date', { aliases: ['INCORPORATION DATE', 'DOI'] }), cin('CIN / LLPIN'),
      f('pan', 'PAN'), f('tan', 'TAN'), f('directors', 'Directors / Partners', 'longtext', { aliases: ['DIRECTORS', 'PARTNERS'] }),
      f('authorised_capital', 'Authorised Capital (₹)', 'number', { aliases: ['AUTHORISED CAPITAL', 'AUTHORIZED CAPITAL'] }),
      f('paid_up_capital', 'Paid-up Capital (₹)', 'number', { aliases: ['PAID UP CAPITAL', 'PAID-UP CAPITAL'] }),
      f('registered_office', 'Registered Office Address', 'longtext', { aliases: ['REGISTERED OFFICE', 'ADDRESS'] }),
      status(['Name reservation', 'Documents pending', 'Filed', 'Resubmission', 'Incorporated', 'Rejected']),
      matter(), remarks(),
    ],
  },
  {
    key: 'auditor_master', label: 'Auditor Master Sheet', recordKey: ['cin'], linkedServices: DIRECTOR_SERVICES,
    fields: [
      client(), company(), cin(), f('auditor_name', 'Auditor Name', 'text', { aliases: ['AUDITOR', 'NAME OF AUDITOR'] }),
      f('auditor_frn', 'Firm Registration No. (FRN)', 'text', { aliases: ['FRN'] }),
      f('auditor_membership_no', 'Membership No.', 'text', { aliases: ['MEMBERSHIP NUMBER', 'M NO'] }),
      f('auditor_email', 'Auditor Email'), f('auditor_mobile', 'Auditor Mobile'),
      f('date_of_appointment', 'Date of Appointment', 'date', { aliases: ['APPOINTMENT DATE'] }),
      select('appointed_at', 'Appointed At', ['First Board Meeting', 'AGM', 'EGM', 'Casual vacancy']),
      fy('term_from', 'Term From (FY)'), fy('term_to', 'Term To (FY)'),
      f('adt1_filed_on', 'ADT-1 Filed On', 'date', { aliases: ['ADT-1 FILING DATE', 'ADT 1 FILED ON'] }), srn('ADT-1 SRN'),
      status(['Active', 'Resigned', 'Removed', 'Term completed']), matter(), remarks(),
    ],
  },
  {
    key: 'kyc', label: 'KYC Sheet', recordKey: ['din', 'financial_year'],
    fields: [
      client(), company(), f('director_name', 'Director Name', 'text', { aliases: ['DIRECTOR', 'NAME OF DIRECTOR', 'NAME'] }),
      f('din', 'DIN', 'text', { aliases: ['DIN NO', 'DIN NUMBER'] }), fy(),
      select('kyc_type', 'KYC Form', ['DIR-3 KYC (e-form)', 'DIR-3 KYC-WEB']),
      f('date_of_filing', 'Date of Filing', 'date', { aliases: ['FILING DATE', 'KYC FILED ON', 'DATE OF KYC'] }), srn(),
      // #217: the next KYC falls due three years after the filing date.
      computed('next_kyc_due', 'Next KYC Due', ['date_of_filing'], { years: 3 }, { aliases: ['NEXT DUE', 'NEXT KYC DUE DATE'] }),
      mobile(), email(), status(['Filed', 'Pending', 'Deactivated']), matter(), remarks(),
    ],
    // Admins and managers are told 30 days and 7 days before, and on the day.
    // A newer filing for the same DIN supersedes an older row's reminder.
    reminder: {
      field: 'next_kyc_due', milestones: [30, 7, 0], subject: 'KYC',
      describe: ['director_name', 'din', 'company_name'], supersededBy: { match: 'din', later: 'date_of_filing' },
    },
  },
  {
    key: 'annual_filing', label: 'Annual Filing Sheet', recordKey: ['cin', 'financial_year'],
    fields: [
      client(), company(), cin(), select('entity_type', 'Entity Type', ENTITY_TYPES), fy(),
      f('agm_date', 'AGM Date', 'date', { aliases: ['DATE OF AGM'] }),
      f('aoc4_filed_on', 'AOC-4 / Form 8 Filed On', 'date', { aliases: ['AOC-4 FILED ON', 'AOC 4', 'FORM 8 FILED ON'] }),
      f('aoc4_srn', 'AOC-4 / Form 8 SRN', 'text', { aliases: ['AOC-4 SRN'] }),
      f('mgt7_filed_on', 'MGT-7 / Form 11 Filed On', 'date', { aliases: ['MGT-7 FILED ON', 'MGT 7', 'FORM 11 FILED ON'] }),
      f('mgt7_srn', 'MGT-7 / Form 11 SRN', 'text', { aliases: ['MGT-7 SRN'] }),
      f('adt1_filed_on', 'ADT-1 Filed On', 'date'), f('dpt3_filed_on', 'DPT-3 Filed On', 'date'),
      f('additional_fees', 'Additional Fees (₹)', 'number', { aliases: ['ADDITIONAL FEES', 'LATE FEES'] }),
      status(FILING_STATUS), matter(), remarks(),
    ],
  },
  {
    key: 'roc_register', label: 'ROC Register', recordKey: ['srn'],
    fields: [
      client(), company(), cin(), f('form', 'Form', 'text', { aliases: ['E-FORM', 'FORM NO', 'FORM NAME'] }),
      f('purpose', 'Purpose / Event', 'text', { aliases: ['PURPOSE', 'EVENT', 'PARTICULARS'] }),
      f('event_date', 'Event Date', 'date'), f('due_date', 'Due Date', 'date'),
      f('date_of_filing', 'Date of Filing', 'date', { aliases: ['FILING DATE', 'FILED ON'] }), srn(),
      f('govt_fees', 'Govt. Fees (₹)', 'number', { aliases: ['GOVT FEES', 'FEES'] }),
      f('additional_fees', 'Additional Fees (₹)', 'number', { aliases: ['ADDITIONAL FEES', 'LATE FEES'] }),
      status(FILING_STATUS), matter(), remarks(),
    ],
  },
  {
    key: 'strike_off', label: 'Strike Off Sheet', recordKey: ['cin'],
    linkedServices: ['dissolve-private-limited', 'dissolve-llp', 'windup-plc'],
    fields: [
      client(), company(), cin(), select('form', 'Form', ['STK-2', 'LLP Form 24']),
      select('reason', 'Reason', ['Not commenced business', 'No operations for two years', 'Other']),
      f('board_resolution_date', 'Board Resolution Date', 'date'), f('special_resolution_date', 'Special Resolution / Consent Date', 'date'),
      f('date_of_filing', 'Date of Filing', 'date', { aliases: ['FILING DATE', 'FILED ON'] }), srn(),
      f('notice_date', 'STK-6 / Public Notice Date', 'date', { aliases: ['NOTICE DATE', 'PUBLIC NOTICE DATE'] }),
      f('struck_off_on', 'Struck Off On (STK-7)', 'date', { aliases: ['STRIKE OFF DATE', 'STK-7 DATE'] }),
      status(['Preparing', 'Filed', 'Resubmission', 'Struck off', 'Rejected']), matter(), remarks(),
    ],
  },
  {
    key: 'adt3', label: 'Auditor Registration (ADT-3)', recordKey: ['srn'], linkedServices: DIRECTOR_SERVICES,
    fields: [
      client(), company(), cin(), f('auditor_name', 'Auditor Name', 'text', { aliases: ['AUDITOR'] }),
      f('auditor_frn', 'Firm Registration No. (FRN)', 'text', { aliases: ['FRN'] }),
      f('resignation_date', 'Date of Resignation', 'date', { aliases: ['RESIGNATION DATE'] }),
      f('reason', 'Reason for Resignation', 'longtext', { aliases: ['REASON'] }),
      // ADT-3 is due within 30 days of the resignation.
      computed('adt3_due', 'ADT-3 Due By', ['resignation_date'], { days: 30 }, { aliases: ['ADT-3 DUE DATE', 'DUE DATE'] }),
      f('adt3_filed_on', 'ADT-3 Filed On', 'date', { aliases: ['DATE OF FILING', 'FILED ON'] }), srn(),
      f('new_auditor', 'New Auditor Appointed', 'text', { aliases: ['NEW AUDITOR'] }),
      f('adt1_filed_on', 'ADT-1 (New Auditor) Filed On', 'date', { aliases: ['ADT-1 FILED ON'] }),
      status(FILING_STATUS), matter(), remarks(),
    ],
  },
  {
    key: 'startup_odisha', label: 'Startup Odisha Sheet', recordKey: ['registration_no'],
    fields: [
      client(), company('Entity Name'), cin('CIN / LLPIN'),
      f('registration_no', 'Startup Odisha Registration No.', 'text', { aliases: ['REGISTRATION NO', 'STARTUP ODISHA NO', 'CERTIFICATE NO'] }),
      f('application_date', 'Application Date', 'date', { aliases: ['DATE OF APPLICATION'] }),
      f('recognition_date', 'Recognition Date', 'date', { aliases: ['DATE OF RECOGNITION'] }),
      f('valid_till', 'Certificate Valid Till', 'date', { aliases: ['VALID TILL', 'VALIDITY'] }),
      f('sector', 'Sector'), f('incentives', 'Incentives Applied / Received', 'longtext', { aliases: ['INCENTIVES'] }),
      status(['Applied', 'Under review', 'Recognised', 'Rejected', 'Expired']), matter(), remarks(),
    ],
  },
  {
    key: 'startup_india', label: 'Startup India Sheet', recordKey: ['dpiit_no'],
    fields: [
      client(), company('Entity Name'), cin('CIN / LLPIN'),
      f('date_of_incorporation', 'Date of Incorporation', 'date', { aliases: ['INCORPORATION DATE'] }),
      f('dpiit_no', 'DPIIT Recognition No.', 'text', { aliases: ['DPIIT NO', 'RECOGNITION NO', 'CERTIFICATE NO'] }),
      f('application_date', 'Application Date', 'date'), f('recognition_date', 'Recognition Date', 'date'),
      // DPIIT recognition lasts up to ten years from incorporation.
      computed('recognition_valid_till', 'Recognition Valid Till', ['date_of_incorporation'], { years: 10 }, { aliases: ['VALID TILL'] }),
      select('tax_exemption_80iac', '80-IAC Tax Exemption', ['Not applied', 'Applied', 'Approved', 'Rejected'], { aliases: ['80-IAC', '80 IAC'] }),
      status(['Applied', 'Under review', 'Recognised', 'Rejected']), matter(), remarks(),
    ],
  },
  {
    key: 'gst', label: 'GST Sheet', recordKey: ['gstin'], linkedServices: ['gst-registration', 'gst-returns'],
    fields: [
      client(), f('legal_name', 'Legal Name', 'text', { aliases: ['NAME', 'LEGAL NAME OF BUSINESS'] }),
      f('trade_name', 'Trade Name'), f('gstin', 'GSTIN', 'text', { aliases: ['GST NO', 'GST NUMBER', 'GSTN'] }), f('pan', 'PAN'),
      f('state', 'State'),
      select('registration_type', 'Registration Type', ['Regular', 'Composition', 'Casual', 'Non-resident', 'ISD', 'TDS/TCS']),
      f('arn', 'ARN', 'text', { aliases: ['ARN NO'] }), f('application_date', 'Application Date', 'date'),
      f('registration_date', 'Registration Date', 'date', { aliases: ['DATE OF REGISTRATION', 'EFFECTIVE DATE'] }),
      select('return_frequency', 'Return Filing', ['Monthly', 'Quarterly (QRMP)', 'Annual (Composition)']),
      status(['Applied', 'Active', 'Suspended', 'Cancelled', 'Rejected']),
      f('cancellation_date', 'Cancellation Date', 'date'), mobile(), email(), matter(), remarks(),
    ],
  },
  // #280 — the firm's own TDS register, column for column from the Excel file
  // attached to the issue (names, order and spelling are the firm's — "Form 138"
  // and "form 140" included). Its yellow columns are the choice lists, whose
  // options staff edit (Edit dropdowns). "Sl. No." is the row number, not data.
  {
    key: 'tds', label: 'TDS Sheet', recordKey: ['tan'], serial: true,
    fields: [
      f('company_name', 'Company Name', 'text', { aliases: ['COMPANY', 'NAME OF COMPANY', 'DEDUCTOR', 'DEDUCTOR NAME'] }),
      select('assigned_to', 'Assigned to', [], { aliases: ['ASSIGNED', 'ASSIGN TO', 'ASSIGNED PERSON'] }),
      select('checker', 'Checker', [], { aliases: ['CHECKED BY'] }),
      select('client', 'Client', [], { aliases: ['CLIENT NAME'] }),
      f('tan', 'TAN NO', 'text', { aliases: ['TAN', 'TAN NUMBER', 'TAN NO.'] }),
      f('user_id', 'USER ID', 'text', { aliases: ['USERID', 'LOGIN ID'] }),
      f('traces_password', 'Traces Password', 'text', { aliases: ['TRACES PASSWORD', 'TRACES PWD', 'TRACES PSWD'] }),
      f('it_password', 'IT Password', 'text', { aliases: ['INCOME TAX PASSWORD', 'IT PWD', 'IT PSWD'] }),
      select('tds_data_received', 'TDS Data Received', YES_NO, { aliases: ['DATA RECEIVED'] }),
      select('excel_prepared', 'Excel Prepared', YES_NO, { aliases: ['EXCEL PREPARE'] }),
      select('final_excel_mail', 'Final Excel Mail to Client', YES_NO, { aliases: ['FINAL EXCEL MAIL', 'FINAL EXCEL MAIL TO CLIENT'] }),
      select('challan_paid', 'Challan paid by client', YES_NO, { aliases: ['CHALLAN PAID'] }),
      f('salary_filing_date', 'SALARY (Form 138) FILING DATE', 'date', { aliases: ['SALARY FILING DATE', 'SALARY (FORM 24Q) FILING DATE'] }),
      f('non_salary_filing_date', 'NON-SALARY (form 140) FILING DATE', 'date', { aliases: ['NON SALARY FILING DATE', 'NON-SALARY (FORM 26Q) FILING DATE'] }),
      // A PR (provisional receipt) number is 15 digits; kept as text so it is
      // never rounded or shown as a percentage, as it was in the firm's file.
      f('salary_pr_no', 'SALARY (Form 138) PR NO', 'text', { aliases: ['SALARY PR NO', 'SALARY (FORM 24Q) PR NO'] }),
      f('non_salary_pr_no', 'NON-SALARY (form 140) PR NO', 'text', { aliases: ['NON SALARY PR NO', 'NON-SALARY (FORM 26Q) PR NO'] }),
      f('statement_status_26q', 'STATEMENT STATUS 26Q (Form 140)', 'text', { aliases: ['STATEMENT STATUS 26Q', 'STATUS 26Q'] }),
      f('statement_status_24q', 'STATEMENT STATUS 24Q (Form 138)', 'text', { aliases: ['STATEMENT STATUS 24Q', 'STATUS 24Q'] }),
    ],
  },
  {
    key: 'udyam', label: 'Udyam Sheet', recordKey: ['udyam_no'], linkedServices: ['udyam-registration'],
    fields: [
      client(), company('Enterprise Name'), f('udyam_no', 'Udyam Registration No.', 'text', { aliases: ['UDYAM NO', 'URN', 'UDYAM NUMBER'] }),
      f('pan', 'PAN'), select('organisation_type', 'Type of Organisation', ['Proprietorship', 'Partnership', 'LLP', 'Private Limited', 'Public Limited', 'HUF', 'Society / Trust', 'Other']),
      select('category', 'Enterprise Category', ['Micro', 'Small', 'Medium'], { aliases: ['CATEGORY', 'MSME CATEGORY'] }),
      select('major_activity', 'Major Activity', ['Manufacturing', 'Services', 'Trading']),
      f('commencement_date', 'Date of Commencement', 'date', { aliases: ['DATE OF INCORPORATION', 'COMMENCEMENT DATE'] }),
      f('registration_date', 'Udyam Registration Date', 'date', { aliases: ['REGISTRATION DATE', 'DATE OF REGISTRATION'] }),
      f('last_updated_on', 'Last Updated On', 'date'), mobile(), email(), status(['Applied', 'Registered', 'Rejected', 'Cancelled']),
      matter(), remarks(),
    ],
  },
  {
    key: 'professional_tax', label: 'Professional Tax Sheet', recordKey: ['ptrc_no'], linkedServices: ['professional-tax'],
    fields: [
      client(), company('Entity Name'), f('pan', 'PAN'), f('state', 'State'),
      f('ptrc_no', 'PT Registration (PTRC) No.', 'text', { aliases: ['PTRC NO', 'PTRC', 'REGISTRATION NO'] }),
      f('ptec_no', 'PT Enrolment (PTEC) No.', 'text', { aliases: ['PTEC NO', 'PTEC', 'ENROLMENT NO'] }),
      f('registration_date', 'Registration Date', 'date'),
      select('return_frequency', 'Return Frequency', ['Monthly', 'Quarterly', 'Half-yearly', 'Annual']),
      f('last_return_period', 'Last Return Filed (Period)', 'text', { aliases: ['LAST RETURN FILED', 'LAST RETURN'] }),
      f('next_due_date', 'Next Due Date', 'date', { aliases: ['DUE DATE'] }),
      fy('enrolment_paid_till', 'Enrolment Tax Paid Till (FY)'),
      status(['Applied', 'Active', 'Cancelled']), matter(), remarks(),
    ],
  },
  {
    key: 'fssai', label: 'FSSAI Sheet', recordKey: ['licence_no'], linkedServices: ['food-license-fssai'],
    fields: [
      client(), company('Business Name'), f('fbo_name', 'Food Business Operator', 'text', { aliases: ['FBO NAME', 'FBO'] }),
      select('licence_type', 'Licence Type', ['Basic Registration', 'State Licence', 'Central Licence'], { aliases: ['TYPE', 'LICENSE TYPE'] }),
      f('licence_no', 'Licence / Registration No.', 'text', { aliases: ['LICENSE NO', 'LICENCE NO', 'FSSAI NO', 'REGISTRATION NO'] }),
      f('kind_of_business', 'Kind of Business', 'text', { aliases: ['KIND OF BUSINESS', 'BUSINESS TYPE'] }),
      f('premises_address', 'Premises Address', 'longtext', { aliases: ['ADDRESS'] }),
      f('application_date', 'Application Date', 'date'), f('issue_date', 'Issue Date', 'date', { aliases: ['DATE OF ISSUE'] }),
      f('valid_till', 'Valid Till', 'date', { aliases: ['VALIDITY', 'EXPIRY DATE', 'VALID UPTO'] }),
      // A renewal is to be filed no later than 30 days before expiry.
      computed('renewal_due', 'Renewal Due By', ['valid_till'], { days: -30 }, { aliases: ['RENEWAL DUE'] }),
      f('annual_return_filed_on', 'Annual Return (D-1) Filed On', 'date', { aliases: ['ANNUAL RETURN FILED ON', 'D-1 FILED ON'] }),
      status(['Applied', 'Active', 'Expired', 'Cancelled', 'Rejected']), matter(), remarks(),
    ],
  },
];

/* ── #279 GST Return Filing (Reports): one book, Monthly / Quarterly ───────
 *
 * The firm's column list, in its order and spelling (the image attached to the
 * issue); yellow there = a dropdown here. Two columns are ours, added at the
 * END so the firm's layout is untouched: "Return Period" (a row is one client's
 * return for one period — without it, months would mix) and "Matter" (the GST
 * return matter the row comes from).
 *
 * Rows come from two places: GST return matters (synced — see
 * services/gstReturnSheet.service.js, which also says which columns are
 * derived) and records typed or uploaded by staff. The two sheets are
 * EXCLUSIVE: a record is in Monthly or in Quarterly, never both.
 */
const GST_RETURN_FIELDS = [
  f('client_name', 'GST Return Clients', 'text', { aliases: ['CLIENT', 'CLIENT NAME', 'GST RETURN CLIENT', 'COMPANY NAME', 'NAME'] }),
  select('constitution', 'CONSTITUTION', ['Company', 'Partnership', 'Proprietorship', 'OPC', 'LLP', 'Section 8'], {
    aliases: ['CONSTITUTION OF BUSINESS', 'ENTITY TYPE'],
  }),
  f('gstin', 'GSTN No', 'text', { aliases: ['GSTIN', 'GST NO', 'GSTN', 'GST NUMBER', 'GSTIN NO'] }),
  f('data_email', 'Mail ID for data collection', 'text', { aliases: ['MAIL ID', 'EMAIL', 'EMAIL ID', 'E-MAIL'] }),
  f('gst_user_id', 'GST User ID', 'text', { aliases: ['USER ID', 'GST USERNAME', 'GST LOGIN'] }),
  // #279 (firm, 11 Nov): a SECRET field — kept out of `values` and every list,
  // encrypted at rest, revealed one row at a time to staff and audited
  // (services/worksheetSecrets.service.js).
  f('gst_password', 'GST Pswd', 'text', { secret: true, aliases: ['GST PASSWORD', 'GST PWD', 'PASSWORD'] }),
  f('contact_no', 'Contact No.', 'text', { aliases: ['CONTACT', 'CONTACT NUMBER', 'MOBILE', 'MOBILE NO', 'PHONE'] }),
  select('assign_person', 'Assign Person', [], { aliases: ['ASSIGNED TO', 'ASSIGNED PERSON', 'ASSIGNEE'] }),
  f('current_status', 'Current Status', 'text', { aliases: ['STATUS'] }),
  select('data_received', 'Data Received', YES_NO),
  select('tally_prepared', 'Tally/ Excel Prepared', YES_NO, { aliases: ['TALLY PREPARED', 'EXCEL PREPARED', 'TALLY EXCEL PREPARED'] }),
  f('gstr1_date', 'Date of GSTR-1 Filing', 'date', { aliases: ['GSTR-1 FILING DATE', 'GSTR 1 DATE', 'GSTR1 FILED ON'] }),
  select('gstr1_mail', 'GSTR-1 Filed Mail', YES_NO, { aliases: ['GSTR 1 FILED MAIL', 'GSTR1 MAIL'] }),
  select('gstr2b_mail', 'GSTR_2B Reco Mail to Client', YES_NO, { aliases: ['GSTR-2B RECO MAIL TO CLIENT', 'GSTR 2B RECO MAIL', '2B RECO MAIL'] }),
  select('additional_data', 'Additional Data or Confirmation Received from Client', YES_NO, {
    aliases: ['ADDITIONAL DATA', 'ADDITIONAL DATA RECEIVED', 'CONFIRMATION RECEIVED'],
  }),
  select('challan_mail', 'Challan Mail to the client', YES_NO, { aliases: ['CHALLAN MAIL', 'CHALLAN MAIL TO CLIENT'] }),
  select('challan_paid', 'Challan paid by client', YES_NO, { aliases: ['CHALLAN PAID'] }),
  select('annual_sheet', 'Annual Working Sheet Update', YES_NO, { aliases: ['ANNUAL WORKING SHEET', 'ANNUAL SHEET UPDATE'] }),
  f('gstr3b_date', 'Date of GSTR-3B Filing', 'date', { aliases: ['GSTR-3B FILING DATE', 'GSTR 3B DATE', 'GSTR3B FILED ON'] }),
  // #279 (firm, 11 Nov): "Completion Check should be data validation format" — a
  // dropdown, its choices editable under Edit dropdowns. "Done" is what the
  // workflow writes when the matter is completed, so it stays the first choice.
  select('completion_check', 'Completion Check', ['Done', 'Pending'], { aliases: ['COMPLETION', 'COMPLETED'] }),
  remarks(),
  f('period', 'Return Period', 'text', { aliases: ['PERIOD', 'MONTH', 'QUARTER', 'TAX PERIOD', 'RETURN MONTH', 'RETURN QUARTER'] }),
  matter(),
];

const GST_RETURN_SHEETS = [
  { key: 'gst_return_monthly', label: 'Monthly', frequency: 'monthly' },
  { key: 'gst_return_quarterly', label: 'Quarterly', frequency: 'quarterly' },
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
for (const s of COMPANY_SHEETS) {
  BOOKS[s.key] = {
    key: s.key, module: 'company', fields: s.fields, recordKey: s.recordKey ?? [],
    linkedServices: s.linkedServices ?? [], reminder: s.reminder ?? null,
  };
  SHEETS[s.key] = {
    key: s.key, label: s.label, module: 'company', book: s.key, columns: s.fields.map((x) => ({ key: x.key })),
    serial: !!s.serial,
  };
}

BOOKS.gst_return = {
  key: 'gst_return',
  module: 'gst_return',
  fields: GST_RETURN_FIELDS,
  // One row per client per period. The key is scoped to the sheet (exclusive
  // book), so the same GSTIN and period text in Monthly and Quarterly are two rows.
  recordKey: ['gstin', 'period'],
  linkedServices: ['gst-returns', 'gst-returns-quarterly'],
  reminder: null,
  exclusive: true,
  sync: 'gst_matters',
};
for (const s of GST_RETURN_SHEETS) {
  SHEETS[s.key] = {
    key: s.key, label: s.label, module: 'gst_return', book: 'gst_return', frequency: s.frequency,
    columns: GST_RETURN_FIELDS.map((x) => ({ key: x.key })), serial: true,
  };
}

export const MODULES = {
  trademark: { key: 'trademark', label: 'Trademark Reports', sheets: TM_SHEETS.map((s) => s.key) },
  company: { key: 'company', label: 'Worksheets', sheets: COMPANY_SHEETS.map((s) => s.key) },
  gst_return: { key: 'gst_return', label: 'GST Return Filing', sheets: GST_RETURN_SHEETS.map((s) => s.key) },
};

export const FIELD_TYPES = ['text', 'longtext', 'date', 'number', 'select', 'computed', 'image', 'matter'];
/** Types an admin may give a column they add. Computed columns are built in only. */
export const ADDABLE_TYPES = ['text', 'longtext', 'date', 'number', 'select', 'image'];
