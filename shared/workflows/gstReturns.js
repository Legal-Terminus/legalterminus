/**
 * GST return filing reminders (#219) — the pure rules. No I/O.
 *
 * A client is set to file GST returns MONTHLY or QUARTERLY. On the 1st of each
 * month (monthly), or on 1 Jul / 1 Oct / 1 Jan / 1 Apr (quarterly), a matter is
 * opened for the period that has JUST ENDED and the client is emailed for its
 * data. "Today" is the date in India: a sweep running at 00:30 IST on the 1st
 * is already in the new month, though UTC is still on the last day.
 *
 * Quarters follow the Indian financial year (April–March):
 *   Q1 Apr–Jun · Q2 Jul–Sep · Q3 Oct–Dec · Q4 Jan–Mar
 * so the quarter Oct–Dec 2026 is "Q3 2026-27", and Jan–Mar 2027 is "Q4 2026-27".
 */

export const GST_FREQUENCIES = ['monthly', 'quarterly'];

/** The services a generated matter is opened with. The quarterly one is used
 *  when the firm has created it; otherwise quarterly clients use the monthly one. */
export const GST_SERVICE_KEYS = { monthly: 'gst-returns', quarterly: 'gst-returns-quarterly' };

/** Statutory calendar keys for each frequency's due dates. */
export const GST_CALENDAR_KEYS = {
  monthly: { gstr1: 'gstr1', gstr3b: 'gstr3b' },
  quarterly: { gstr1: 'gstr1_qtr', gstr3b: 'gstr3b_qtr' },
};

/** The email template for each frequency. */
export const GST_TEMPLATE_KEYS = { monthly: 'gst_return_monthly', quarterly: 'gst_return_quarterly' };

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

/** Today's date in India, as 'YYYY-MM-DD'. */
export function indiaDate(now = new Date()) {
  // IST is UTC+5:30 all year (no daylight saving).
  return new Date(now.getTime() + 330 * 60_000).toISOString().slice(0, 10);
}

const pad = (n) => String(n).padStart(2, '0');
/** Financial year label for a year in which the FY STARTS: 2026 → "2026-27". */
const fyLong = (startYear) => `${startYear}-${pad((startYear + 1) % 100)}`;
const fyShort = (startYear) => `${pad(startYear % 100)}-${pad((startYear + 1) % 100)}`;

/**
 * The period whose matter falls due on or before `today` ('YYYY-MM-DD', India),
 * i.e. the latest period that has ended. Returns:
 *
 *   key        stable id, used to create each period's matter once
 *              ('2026-09' or '2026-27-Q2')
 *   month      last month of the period, 'YYYY-MM' — what statutory due dates
 *              are computed from ("September's GSTR-1 is due in October")
 *   createdOn  the day the matter falls due: the 1st after the period ends
 *   title      for the subject: 'September 2026' / 'Q2 2026-27'
 *   label      for the body: 'SEPTEMBER 2026' / 'Q2 26-27 (July–September)'
 */
export function duePeriod(frequency, today) {
  const m = String(today ?? '').match(/^(\d{4})-(\d{2})-\d{2}$/);
  if (!m || !GST_FREQUENCIES.includes(frequency)) return null;
  const year = Number(m[1]);
  const month = Number(m[2]); // 1–12, the month we are IN
  const createdOn = `${year}-${pad(month)}-01`;

  if (frequency === 'monthly') {
    const py = month === 1 ? year - 1 : year;
    const pm = month === 1 ? 12 : month - 1;
    const name = `${MONTHS[pm - 1]} ${py}`;
    return {
      frequency, key: `${py}-${pad(pm)}`, month: `${py}-${pad(pm)}`, createdOn,
      title: name, label: name.toUpperCase(),
    };
  }

  // Quarterly: the quarter that ended before the current one started.
  // Current FY quarter of `month`: Apr–Jun → 1, Jul–Sep → 2, Oct–Dec → 3, Jan–Mar → 4.
  const currentQ = month >= 4 ? Math.floor((month - 4) / 3) + 1 : 4;
  const currentFyStart = month >= 4 ? year : year - 1;
  const q = currentQ === 1 ? 4 : currentQ - 1;
  const fyStart = currentQ === 1 ? currentFyStart - 1 : currentFyStart;
  // First month of quarter q (1-based calendar month) and its calendar year.
  const firstMonth = q === 4 ? 1 : 4 + (q - 1) * 3;
  const calYear = q === 4 ? fyStart + 1 : fyStart;
  const lastMonth = firstMonth + 2;
  // The quarter's own first-of-month after it ends.
  const after = lastMonth === 12 ? `${calYear + 1}-01-01` : `${calYear}-${pad(lastMonth + 1)}-01`;
  return {
    frequency,
    key: `${fyLong(fyStart)}-Q${q}`,
    month: `${calYear}-${pad(lastMonth)}`,
    createdOn: after,
    title: `Q${q} ${fyLong(fyStart)}`,
    label: `Q${q} ${fyShort(fyStart)} (${MONTHS[firstMonth - 1]}–${MONTHS[lastMonth - 1]})`,
  };
}

/**
 * Whether this client's matter for `period` should be opened now. Only periods
 * whose 1st falls on or after the day the frequency was chosen: choosing
 * "Monthly" on 10 November starts with the matter of 1 December (for November),
 * not a back-dated one for October.
 */
export function shouldOpen(period, frequencySetOn) {
  if (!period) return false;
  const since = String(frequencySetOn ?? '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(since)) return false;
  return period.createdOn >= since;
}

/** "11th October 2026" — how the email states a due date ('YYYY-MM-DD' in). */
export function longDate(iso) {
  const m = String(iso ?? '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return '';
  const d = Number(m[3]);
  const suffix = d % 10 === 1 && d !== 11 ? 'st' : d % 10 === 2 && d !== 12 ? 'nd' : d % 10 === 3 && d !== 13 ? 'rd' : 'th';
  return `${d}${suffix} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

/** The company name a GST email is addressed for. */
export function companyNameOf(client) {
  return String(client?.organisation || client?.businessName || client?.name || client?.fullName || '').trim();
}
