/**
 * #202 — a matter's payment figures come from its payment history.
 *
 * `amountPaid` is the sum of the ledger (`tasks/{id}/payments`), `amountDue` is
 * what remains of the total cost, and `paymentStatus` follows from the two. The
 * rules live here, pure, so every writer — matter creation, recording,
 * correcting and deleting a payment, editing the total — derives them the same
 * way. Before, four writers carried four copies of the arithmetic, one of which
 * disagreed about an unpriced matter.
 */

/** Sum of ledger amounts. Accepts row objects with an `amount` field. */
export function sumLedger(rows) {
  let total = 0;
  for (const r of rows) total += Number(r?.amount ?? 0) || 0;
  return total;
}

/**
 * The rollup for a matter. With no agreed cost, money received is a part
 * payment, never "fully paid": calling it full would open a payment gate on a
 * matter nobody has priced.
 */
export function deriveRollup(totalCost, amountPaid) {
  const cost = Number(totalCost ?? 0) || 0;
  const paid = Number(amountPaid ?? 0) || 0;
  const amountDue = Math.max(0, cost - paid);
  const paymentStatus = paid <= 0
    ? 'not_paid'
    : (amountDue > 0 || cost <= 0) ? 'part_paid' : 'fully_paid';
  return { amountPaid: paid, amountDue, paymentStatus };
}

/**
 * The ledger row for a payment taken when the matter was created. Written in the
 * same batch as the matter, so the history and the figures can never disagree.
 * Returns null when nothing was received.
 */
export function creationPaymentRow({ amount, mode, description, actorUid, actorName, now }) {
  if (!(Number(amount) > 0)) return null;
  return {
    amount: Number(amount),
    mode: (mode && String(mode).trim()) || 'Not specified',
    paidAt: now,
    reference: null,
    notes: description || 'Received when the matter was created',
    recordedBy: actorUid ?? null,
    recordedByName: actorName ?? null,
    recordedAt: now,
    source: 'matter_creation',
  };
}

/**
 * A matter created before the ledger existed carries `amountPaid` with no rows
 * behind it. The first ledger write used to recompute from the empty ledger and
 * silently wipe that figure. Instead the figure becomes an explicit opening
 * balance row, visible and correctable like any other payment.
 */
export function openingBalanceRow(task, now) {
  const amount = Number(task?.amountPaid ?? 0) || 0;
  if (amount <= 0) return null;
  return {
    amount,
    mode: (task.paymentMode && String(task.paymentMode).trim()) || 'Not specified',
    paidAt: task.createdAt ?? now,
    reference: null,
    notes: 'Opening balance — received before payment history was kept',
    recordedBy: null,
    recordedByName: null,
    recordedAt: now,
    source: 'opening_balance',
  };
}
