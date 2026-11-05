import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Loader2, MessageSquare, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import {
  getMessages, postMessage, editMessage, deleteMessage, getMentionable, type MatterMessage,
} from '../../api/messages';
import { useToast } from '../common/toastContext';
import { useConfirm } from '../common/confirmContext';
import RichTextEditor from '../common/RichTextEditor';
import RichText from '../common/RichText';

/**
 * #123 — the matter's chat (the "Chat" tab; it was called Discussion). One conversation per matter; staff tick
 * "Visible to client" per message (default OFF so internal notes are never leaked
 * by accident, matching #115). Clients only ever receive client-visible messages,
 * and staff authors are masked as "Our team".
 *
 * Delivery is polling (10s) — the app's existing live-data pattern; no realtime
 * listener layer, so the browser never talks to Firestore directly.
 */
export default function DiscussionPanel({ taskId, isStaff }: { taskId: string; isStaff: boolean }) {
  const toast = useToast();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [body, setBody] = useState('');
  const [visible, setVisible] = useState(false); // staff: share with client? default OFF
  const endRef = useRef<HTMLDivElement>(null);

  // #200: staff get suggestions when they type "@". Never fetched for a client.
  const { data: mentionable = [] } = useQuery({
    queryKey: ['mentionable', taskId],
    queryFn: () => getMentionable(taskId),
    enabled: isStaff,
    staleTime: 5 * 60_000,
  });

  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['messages', taskId],
    queryFn: () => getMessages(taskId),
    staleTime: 5_000,
    refetchInterval: 10_000, // near-real-time without a socket layer
  });

  const send = useMutation({
    mutationFn: () => postMessage(taskId, body.trim(), isStaff ? visible : true),
    onSuccess: () => {
      setBody('');
      queryClient.invalidateQueries({ queryKey: ['messages', taskId] });
    },
    onError: (e: Error) => toast.error(e.message || 'Could not send the message.'),
  });

  // Keep the newest message in view as the thread grows.
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages.length]);

  const submit = async () => {
    if (!body.trim() || send.isPending) return;
    // A message shared with the client is emailed to them at once and cannot be
    // recalled. Staff see exactly what will go out before it does — a stray
    // line pasted into a shared message once reached a client this way.
    if (isStaff && visible) {
      const ok = await confirm({
        title: 'Send this to the client?',
        message: (
          <div className="space-y-2">
            <div className="max-h-60 overflow-y-auto rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-ink">
              <RichText html={body} className="text-sm" taskId={taskId} />
            </div>
            <p>The client will see this in the portal and get it by email, as will anyone copied on this matter. An email cannot be recalled once sent.</p>
          </div>
        ),
        confirmLabel: 'Send to client',
        cancelLabel: 'Keep editing',
      });
      if (!ok) return;
    }
    send.mutate();
  };

  return (
    <div className="card flex flex-col" style={{ maxHeight: '70vh' }}>
      <div className="px-5 py-3 border-b border-hairline flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-ink-muted" />
        <p className="text-sm font-semibold text-ink">Chat</p>
        <span className="text-xs text-ink-faint ml-auto">
          {isStaff ? 'Messages are internal unless you share them' : 'Messages with our team'}
        </span>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8 text-ink-faint"><Loader2 className="w-5 h-5 animate-spin" /></div>
        ) : error ? (
          <p className="text-sm text-red-600">{(error as Error).message}</p>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <MessageSquare className="w-8 h-8 text-hairline mx-auto mb-2" />
            <p className="text-sm font-medium text-ink">No messages yet</p>
            <p className="text-sm text-ink-muted mt-1">
              {isStaff
                ? 'Start the conversation — tick “Visible to client” to share a message with them.'
                : 'Ask our team anything about this service.'}
            </p>
          </div>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} m={m} isStaff={isStaff} taskId={taskId} />)
        )}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-hairline p-3 space-y-2">
        {/* #122: rich text — paste tables/formatting from Word, Excel or email,
            and (follow-up) paste or upload images. */}
        <RichTextEditor
          value={body}
          onChange={setBody}
          placeholder="Write a message…"
          ariaLabel="Message"
          rows={2}
          mentions={isStaff ? mentionable : undefined}
          imageTaskId={taskId}
        />
        {/* #200: staff can notify a colleague by typing @ and their email. */}
        {isStaff && (
          <p className="text-[11px] text-ink-muted">
            Type @ and pick a colleague to notify them by email.
          </p>
        )}
        <div className="flex items-center justify-between gap-3">
          {isStaff ? (
            <label className="inline-flex items-center gap-2 text-xs text-ink-muted cursor-pointer">
              <input
                type="checkbox"
                className="h-3.5 w-3.5"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                aria-label="Visible to client"
              />
              {visible
                ? <span className="inline-flex items-center gap-1 text-emerald-700"><Eye className="w-3.5 h-3.5" /> Visible to client</span>
                : <span className="inline-flex items-center gap-1"><EyeOff className="w-3.5 h-3.5" /> Internal only</span>}
            </label>
          ) : <span className="text-xs text-ink-faint">Our team will be notified.</span>}
          <button
            onClick={submit}
            disabled={!body.trim() || send.isPending}
            className="btn-primary inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {send.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ m, isStaff, taskId }: { m: MatterMessage; isStaff: boolean; taskId: string }) {
  const mine = m.isMine;
  const toast = useToast();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(m.body);
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['messages', taskId] });

  const save = useMutation({
    mutationFn: () => editMessage(taskId, m.id, draft.trim()),
    onSuccess: () => { setEditing(false); refresh(); toast.success('Message updated.'); },
    onError: (e: Error) => toast.error(e.message || 'Could not edit the message.'),
  });
  const remove = useMutation({
    mutationFn: () => deleteMessage(taskId, m.id),
    onSuccess: () => { refresh(); toast.success('Message deleted.'); },
    onError: (e: Error) => toast.error(e.message || 'Could not delete the message.'),
  });

  const askDelete = async () => {
    const ok = await confirm({
      title: 'Delete this message?',
      message: m.clientVisible
        ? 'It will be removed for everyone, including the client. Any email already sent about it cannot be recalled.'
        : 'It will be removed for everyone on the team.',
      confirmLabel: 'Delete',
      tone: 'danger',
    });
    if (ok) remove.mutate();
  };

  const startEdit = () => { setDraft(m.body); setEditing(true); };
  // #193: own messages were white-on-brand-blue, which made the text hard to
  // read. They now use a WhatsApp-style LIGHT GREEN bubble with dark ink. Because
  // the bubble went from a dark to a light background, every dependent colour has
  // to change with it — the author line, the shared/internal hint, the timestamp
  // and the rich-text link/table overrides were all tuned for white-on-dark and
  // would be invisible on light green if left behind.
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
        mine ? 'bg-emerald-50 text-ink border border-emerald-100' : 'bg-surface-soft text-ink'
      }`}>
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-[11px] font-semibold ${mine ? 'text-emerald-800' : 'text-ink-muted'}`}>
            {m.authorName}
          </span>
          {/* Staff can see at a glance whether the client can read this. */}
          {isStaff && (
            <span className={`text-[10px] inline-flex items-center gap-0.5 ${
              mine ? 'text-emerald-700/80' : 'text-ink-faint'
            }`}>
              {m.clientVisible
                ? <><Eye className="w-3 h-3" /> shared</>
                : <><EyeOff className="w-3 h-3" /> internal</>}
            </span>
          )}
        </div>
        {m.deleted ? (
          <p className="text-sm italic text-ink-faint">This message was deleted</p>
        ) : editing ? (
          <div className="space-y-2 min-w-[min(28rem,70vw)]">
            <RichTextEditor value={draft} onChange={setDraft} ariaLabel="Edit message" rows={2} imageTaskId={taskId} />
            {m.clientVisible && (
              <p className="text-[11px] text-ink-muted">The client will see the new text in the portal. No new email is sent, and the one already sent stays as it was.</p>
            )}
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-ghost" onClick={() => setEditing(false)} disabled={save.isPending}>Cancel</button>
              <button type="button" className="btn-primary inline-flex items-center gap-1.5 disabled:opacity-50"
                onClick={() => save.mutate()} disabled={!draft.trim() || save.isPending}>
                {save.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Save
              </button>
            </div>
          </div>
        ) : (
          <RichText html={m.body} className="text-sm" taskId={taskId} />
        )}
        {m.createdAt && !editing && (
          <div className={`flex items-center gap-1 mt-1 text-[10px] ${mine ? 'text-emerald-700/70' : 'text-ink-faint'}`}>
            <span>
              {new Date(m.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              {m.editedAt && ' · edited'}
            </span>
            {m.canEdit && (
              <span className="ml-auto inline-flex items-center">
                <button type="button" onClick={startEdit} aria-label="Edit message" title="Edit"
                  className="p-2 -my-1 rounded-md hover:bg-black/5 hover:text-ink">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={askDelete} aria-label="Delete message" title="Delete"
                  disabled={remove.isPending}
                  className="p-2 -my-1 rounded-md hover:bg-black/5 hover:text-red-700 disabled:opacity-50">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
