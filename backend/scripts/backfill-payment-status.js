/**
 * LT #367 — one-time repair: matters whose payment status disagrees with their
 * figures (e.g. ₹1,000 of ₹1,000 paid, ₹0 due, still "Part Paid").
 *
 * Cause: matter creation stored the status picked in the form ("Part Payment")
 * even when the whole amount was received. Creation now derives it from the
 * figures (`deriveRollup`, the ledger's rule); this script corrects the matters
 * created before that.
 *
 * For each matter with a total cost: paid = sum of its payment history
 * (`tasks/{id}/payments`), or its recorded `amountPaid` when it has no history
 * (a pre-ledger matter, exactly as the ledger treats it). The status and the
 * due amount are re-derived from that; only matters that differ are written.
 *
 * Usage (from backend/, with FIRESTORE_DATABASE_ID=qa-data for QA):
 *   node scripts/backfill-payment-status.js --dry-run    # report only, no writes
 *   node scripts/backfill-payment-status.js              # apply changes
 *
 * Safe to re-run (idempotent).
 */
import { getDb } from '../src/config/firebase.js';
import { deriveRollup, sumLedger } from '../src/services/paymentLedger.service.js';

const DRY_RUN = process.argv.includes('--dry-run');

async function run() {
  const db = getDb();
  const snap = await db.collection('tasks').get();
  let scanned = 0, fixed = 0;
  for (const doc of snap.docs) {
    scanned++;
    const t = doc.data();
    const cost = Number(t.totalCost ?? 0) || 0;
    if (cost <= 0) continue; // unpriced: nothing to compare against
    const ledger = await doc.ref.collection('payments').get();
    const paid = ledger.empty ? (Number(t.amountPaid ?? 0) || 0) : sumLedger(ledger.docs.map((d) => d.data()));
    const rolled = deriveRollup(cost, paid);
    if (rolled.paymentStatus === t.paymentStatus && rolled.amountDue === t.amountDue) continue;
    fixed++;
    console.log(`${DRY_RUN ? '[dry]' : '[fix]'} ${doc.id}  ${t.clientName ?? ''} | ${t.serviceName ?? t.serviceKey ?? ''} | cost ${cost} paid ${paid}: `
      + `${t.paymentStatus} / due ${t.amountDue} -> ${rolled.paymentStatus} / due ${rolled.amountDue}`);
    if (!DRY_RUN) {
      await doc.ref.set({ paymentStatus: rolled.paymentStatus, amountDue: rolled.amountDue, amountPaid: rolled.amountPaid }, { merge: true });
    }
  }
  console.log(`\nScanned ${scanned} matters; ${fixed} ${DRY_RUN ? 'would be' : 'were'} corrected.`);
}

run().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
