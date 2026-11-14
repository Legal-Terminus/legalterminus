/**
 * Who is told about a Chat message, and how — for a NEW message (#123, #200,
 * #207) and, since LT #297, for an EDITED one. One path for both, so an edit is
 * announced exactly the way the message itself was:
 *
 *   - a CLIENT's message → the matter owner + everyone on the current step, or
 *     the admins if nobody (`resolveClientMessageRecipients`, #200), with the
 *     internal template;
 *   - a STAFF message shared with the client → the client (CC: the matter's
 *     additional recipients, #149), with the client template, the sender shown
 *     as the firm (#123);
 *   - an internal staff message → nobody but the colleagues @mentioned (#200).
 *     On an edit, only colleagues mentioned for the FIRST time.
 *
 * One in-app notification and ONE email per person per event: every
 * `createNotification` passes `email: false`, because the templated email here
 * is that person's email (#207 — the mirror used to send a second one).
 * Sending goes through `sendTemplatedEmail`, so the EMAIL_DISABLED kill-switch
 * applies. Never throws: a notification failure must not fail the message.
 */

/** How a staff sender is shown to the CLIENT (#123 — never individual staff). */
export const CLIENT_FACING_SENDER = 'Legal Terminus';

const PREVIEW_CHARS = 140;
const preview = (plain) => (plain.length > PREVIEW_CHARS ? `${plain.slice(0, PREVIEW_CHARS)}…` : plain);

/** The template and bell title for each audience, new vs edited. */
export const CHAT_NOTICE = {
  team: {
    created: { template: 'matter_message_team', title: 'New message from your client' },
    edited: { template: 'matter_message_team_edited', title: 'Your client edited a message' },
  },
  client: {
    created: { template: 'matter_message', title: 'New message about your service' },
    edited: { template: 'matter_message_edited', title: 'A message about your service was edited' },
  },
};

/** A user's email address (best-effort). */
async function emailFor(db, uid) {
  try {
    const d = await db.collection('users').doc(uid).get();
    if (!d.exists) return null;
    const u = d.data();
    return u.email || (Array.isArray(u.emailIds) ? u.emailIds[0] : null) || null;
  } catch { return null; }
}

/**
 * Announce a chat message. `mentioned` is the list of staff `{ uid, email, name }`
 * to tell as @mentions (already filtered by the caller: for an edit, only the
 * newly mentioned). Returns `{ team, client, mentions }` counts for logging/tests.
 */
export async function notifyChatMessage({
  db, task, taskId, author, plain, clientVisible, edited = false, mentioned = [],
}, {
  createNotification, renderTemplate, sendTemplatedEmail, resolveClientMessageRecipients, logger,
}) {
  const kind = edited ? 'edited' : 'created';
  const isClient = author?.role === 'client';
  const short = preview(plain);
  const out = { team: 0, client: 0, mentions: 0 };

  if (isClient) {
    try {
      const { recipients, fallback } = await resolveClientMessageRecipients(db, { id: taskId, ...task }, author.uid);
      const clientName = task.clientName || 'Your client';
      const notice = CHAT_NOTICE.team[kind];
      for (const r of recipients) {
        try {
          await createNotification({ recipientUid: r.uid, type: 'info', title: notice.title, message: short, taskId, email: false });
          const rendered = r.email ? await renderTemplate(notice.template, {
            recipientName: r.name, clientName,
            organisation: task.organisation ?? '', serviceName: task.serviceName ?? '', message: plain,
          }) : null;
          // No cc: the matter's ccEmails are the client's, and this is internal.
          if (rendered) {
            await sendTemplatedEmail({
              to: r.email, subject: rendered.subject, body: rendered.body,
              taskId, serviceName: task.serviceName, organisation: task.organisation ?? undefined,
            });
          }
          out.team += 1;
        } catch (e) {
          logger?.warn({ err: e, recipientUid: r.uid, taskId }, 'chat notice: team notify failed (non-fatal)');
        }
      }
      logger?.info({ taskId, notified: recipients.length, fallback, edited }, 'client chat message: team notified');
    } catch (e) {
      logger?.warn({ err: e, taskId }, 'chat notice: team notification failed (non-fatal)');
    }
  } else if (clientVisible && task.clientUid && task.clientUid !== author?.uid) {
    // A client-visible staff message pings the client. Internal-only staff
    // messages notify nobody but those @mentioned (below).
    try {
      const notice = CHAT_NOTICE.client[kind];
      await createNotification({ recipientUid: task.clientUid, type: 'info', title: notice.title, message: short, taskId, email: false });
      const to = await emailFor(db, task.clientUid);
      if (to) {
        const rendered = await renderTemplate(notice.template, {
          clientName: task.clientName ?? '', organisation: task.organisation ?? '',
          serviceName: task.serviceName ?? '', message: plain, senderName: CLIENT_FACING_SENDER,
        });
        if (rendered) {
          await sendTemplatedEmail({
            to, cc: task.ccEmails, // #149
            subject: rendered.subject, body: rendered.body,
            taskId, serviceName: task.serviceName, organisation: task.organisation ?? undefined,
          });
        }
      }
      out.client = 1;
    } catch (e) {
      logger?.warn({ err: e, taskId }, 'chat notice: client notify failed (non-fatal)');
    }
  }

  // #200: each mentioned colleague gets one notification and one email.
  // Mentions are staff-only, so the client is the only possible overlap.
  const alreadyNotified = clientVisible ? task.clientUid : null;
  const toMention = mentioned.filter((m) => m.uid !== alreadyNotified && m.uid !== author?.uid);
  if (toMention.length) {
    let authorName = 'A colleague';
    try {
      const a = await db.collection('users').doc(author.uid).get();
      if (a.exists) authorName = a.data().name || a.data().fullName || a.data().email || authorName;
    } catch { /* keep the generic name */ }
    for (const u of toMention) {
      try {
        await createNotification({
          recipientUid: u.uid, type: 'info', title: `${authorName} mentioned you`, message: short, taskId, email: false,
        });
        const to = u.email || (Array.isArray(u.emailIds) ? u.emailIds[0] : null);
        const rendered = to ? await renderTemplate('matter_mention', {
          recipientName: u.name || u.fullName || '', senderName: authorName,
          clientName: task.clientName ?? '', organisation: task.organisation ?? '',
          serviceName: task.serviceName ?? '', message: plain,
        }) : null;
        if (rendered) {
          await sendTemplatedEmail({
            to, subject: rendered.subject, body: rendered.body,
            taskId, serviceName: task.serviceName, organisation: task.organisation ?? undefined,
          });
        }
        out.mentions += 1;
      } catch (e) {
        logger?.warn({ err: e, taskId }, 'chat notice: mention notify failed (non-fatal)');
      }
    }
  }
  return out;
}
