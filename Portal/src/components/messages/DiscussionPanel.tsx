import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Loader2, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { getMessages, postMessage, type MatterMessage } from '../../api/messages';
import { useToast } from '../common/toastContext';

/**
 * #123 — the matter's discussion thread. One conversation per matter; staff tick
 * "Visible to client" per message (default OFF so internal notes are never leaked
 * by accident, matching #115). Clients only ever receive client-visible messages,
 * and staff authors are masked as "Our team".
 *
 * Delivery is polling (10s) — the app's existing live-data pattern; no realtime
 * listener layer, so the browser never talks to Firestore directly.
 */
export default function DiscussionPanel({ taskId, isStaff }: { taskId: string; isStaff: boolean }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [body, setBody] = useState('');
  const [visible, setVisible] = useState(false); // staff: share with client? default OFF
  const endRef = useRef<HTMLDivElement>(null);

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

  const submit = () => {
    if (!body.trim() || send.isPending) return;
    send.mutate();
  };

  return (
    <div className="card flex flex-col" style={{ maxHeight: '70vh' }}>
      <div className="px-5 py-3 border-b border-hairline flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-ink-muted" />
        <p className="text-sm font-semibold text-ink">Discussion</p>
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
          messages.map((m) => <MessageBubble key={m.id} m={m} isStaff={isStaff} />)
        )}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-hairline p-3 space-y-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(); }}
          rows={2}
          placeholder="Write a message…"
          aria-label="Message"
          className="input-field w-full resize-y text-sm"
        />
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

function MessageBubble({ m, isStaff }: { m: MatterMessage; isStaff: boolean }) {
  const mine = m.isMine;
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
        mine ? 'bg-brand-600 text-white' : 'bg-surface-soft text-ink'
      }`}>
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-[11px] font-semibold ${mine ? 'text-white/80' : 'text-ink-muted'}`}>
            {m.authorName}
          </span>
          {/* Staff can see at a glance whether the client can read this. */}
          {isStaff && (
            <span className={`text-[10px] inline-flex items-center gap-0.5 ${
              mine ? 'text-white/70' : 'text-ink-faint'
            }`}>
              {m.clientVisible
                ? <><Eye className="w-3 h-3" /> shared</>
                : <><EyeOff className="w-3 h-3" /> internal</>}
            </span>
          )}
        </div>
        <p className="text-sm whitespace-pre-wrap break-words">{m.body}</p>
        {m.createdAt && (
          <p className={`text-[10px] mt-1 ${mine ? 'text-white/60' : 'text-ink-faint'}`}>
            {new Date(m.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}
