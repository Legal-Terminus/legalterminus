import type { AnyStateMachine } from 'xstate';

/**
 * Pure machine → graph deriver. Reads an XState v5 machine's static definition
 * (`machine.config.states`) and produces plain node/edge objects describing the
 * workflow. Framework-independent (no React Flow types here) so it stays easy to
 * test and reuse. Layout/positioning is done separately in `layoutGraph.ts`.
 */

export type NodeKind = 'step' | 'payment_gate' | 'waiting' | 'branch' | 'final';

export interface GraphNode {
  id: string;       // state key, e.g. 'step_2_work_assigning'
  label: string;    // friendly label, e.g. '2. Work Assigning'
  kind: NodeKind;
  stepNumber?: number; // the definition step number (for editor highlight/center)
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;       // friendly label, e.g. 'Client approves' or an option name
  event?: string;       // raw event (for identity-based colouring)
  branch?: string;      // branch option value, if any
  toStep?: number;      // target step number (for identity-based colouring)
}

export interface WorkflowGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// A transition value can be a single object or an array of objects; each has an
// optional string `event` (we pass it in), a `target` (string | string[]), and
// an optional `guard` (function reference or string).
interface RawTransition {
  target?: string | string[];
  guard?: unknown;
  branchLabel?: string; // human option name carried through compile (branches)
}

// Friendly, human edge labels — mirror the editor's outcome vocabulary so the
// diagram never shows raw event codes (COMPLETE_STEP, BRANCH_DECISION, …).
const EVENT_LABEL: Record<string, string> = {
  COMPLETE_STEP: 'When done',
  CLIENT_APPROVE: 'Client approves',
  CLIENT_REJECT: 'Client requests changes',
  GOVT_APPROVE: 'Government approves',
  GOVT_REJECT: 'Government rejects',
  REWORK: 'Sent back for correction',
  RECORD_PAYMENT: 'Payment recorded',
  ADMIN_OVERRIDE_PAYMENT: 'Payment overridden',
  BRANCH_DECISION: 'Option',
};
const friendlyEvent = (event: string): string => EVENT_LABEL[event] ?? (event ? titleCase(event.toLowerCase()) : '');

// Distinct, accessible colours for the FOCUSED step's outgoing arrows, so multiple
// outcomes from one step are easy to tell apart. Keyed deterministically on the
// outcome's IDENTITY (event + branch + target) so the editor's outcome row and its
// arrow in the chart always get the SAME colour — no reliance on array order.
export const OUTCOME_COLORS = ['#4f46e5', '#059669', '#dc2626', '#d97706', '#7c3aed', '#0891b2', '#db2777', '#65a30d'];

export function outcomeColor(event: string, branch: string | undefined, to: number): string {
  const keyStr = `${event}|${branch ?? ''}|${to}`;
  let h = 0;
  for (let i = 0; i < keyStr.length; i++) h = (h * 31 + keyStr.charCodeAt(i)) >>> 0;
  return OUTCOME_COLORS[h % OUTCOME_COLORS.length];
}


/** Turn a state key like `step_2_work_assigning` into '2. Work Assigning'. */
export function labelForState(stateId: string): string {
  const stepMatch = stateId.match(/^step_(\d+[a-z]?)_(.+)$/);
  if (stepMatch) {
    const [, num, rest] = stepMatch;
    return `${num}. ${titleCase(rest)}`;
  }
  return titleCase(stateId);
}

function titleCase(snake: string): string {
  return snake
    .split('_')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Resolve node kind from explicit meta first, then fall back to heuristics.
function metaKind(
  meta: { type?: NodeKind } | undefined,
  stateId: string,
  def: { type?: string },
  outgoing: RawTransition[],
): NodeKind {
  if (def?.type === 'final' || stateId === 'completed') return 'final';
  // Compiler emits paired waiting states keyed `await_<n>` with a `waitingFor` meta.
  if (/^await_/.test(stateId)) return 'waiting';
  if (meta?.type && (['step', 'payment_gate', 'branch', 'final'] as NodeKind[]).includes(meta.type)) {
    return meta.type;
  }
  return kindForState(stateId, def, outgoing);
}

function kindForState(stateId: string, def: { type?: string }, outgoing: RawTransition[]): NodeKind {
  if (def?.type === 'final' || stateId === 'completed') return 'final';
  if (/payment_gate/.test(stateId)) return 'payment_gate';
  if (/^awaiting_/.test(stateId)) return 'waiting';
  // A branch is any state that can go to more than one distinct target.
  const targets = new Set<string>();
  outgoing.forEach((t) => normalizeTargets(t.target).forEach((tg) => targets.add(tg)));
  if (targets.size > 1) return 'branch';
  return 'step';
}

function normalizeTargets(target: string | string[] | undefined): string[] {
  if (!target) return [];
  return (Array.isArray(target) ? target : [target]).map(stripTargetPrefix);
}

// XState targets can be written as '.child' or '#id.state'; for this flat machine
// they are plain sibling keys, but strip any leading '.' just in case.
function stripTargetPrefix(t: string): string {
  return t.replace(/^\./, '');
}

function asArray(value: unknown): RawTransition[] {
  if (!value) return [];
  return Array.isArray(value) ? (value as RawTransition[]) : [value as RawTransition];
}

/**
 * Collect every outgoing transition for a state, tagged with the event that
 * triggers it ('' for eventless `always` transitions).
 */
function outgoingTransitions(stateDef: Record<string, unknown>): Array<RawTransition & { event: string }> {
  const out: Array<RawTransition & { event: string }> = [];

  // Eventless (`always`) transitions.
  asArray(stateDef.always).forEach((t) => out.push({ ...t, event: '' }));

  // Event-driven (`on`) transitions.
  const on = stateDef.on as Record<string, unknown> | undefined;
  if (on) {
    for (const [event, value] of Object.entries(on)) {
      asArray(value).forEach((t) => out.push({ ...t, event }));
    }
  }
  return out;
}

export function machineToGraph(machine: AnyStateMachine): WorkflowGraph {
  const states = (machine.config.states ?? {}) as Record<string, Record<string, unknown>>;

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  let edgeSeq = 0;

  for (const [stateId, stateDef] of Object.entries(states)) {
    const transitions = outgoingTransitions(stateDef);
    // Prefer EXPLICIT identity from the compiled definition's `meta` (title/type);
    // fall back to key-parsing only for legacy machines without meta (Finding #4).
    const meta = (stateDef.meta ?? undefined) as
      | { stepNumber?: number; title?: string; type?: NodeKind }
      | undefined;
    // Label = the step TITLE only (no stored stepNumber prefix). The editor cards
    // number by display position, so a stored-number prefix here would mismatch the
    // cards and confuse navigation. Titles match the cards exactly.
    const label = meta?.title ?? labelForState(stateId);
    const kind = metaKind(meta, stateId, stateDef as { type?: string }, transitions);
    // stepNumber for editor highlight: prefer meta, else parse `step_<n>` id.
    const idNum = stateId.match(/^step_(\d+)/);
    const stepNumber = meta?.stepNumber ?? (idNum ? Number(idNum[1]) : undefined);
    nodes.push({ id: stateId, label, kind, stepNumber });

    for (const t of transitions) {
      const targets = normalizeTargets(t.target);
      // A self-targeting transition with no explicit target is a no-op edge; skip.
      for (const target of targets) {
        // Human edge label: a branch shows its OPTION NAME; everything else shows
        // the friendly outcome name (never the raw event code / guard).
        const label = t.branchLabel
          ? t.branchLabel
          : (friendlyEvent(t.event) || undefined);
        const tNum = target.match(/^step_(\d+)/);
        edges.push({
          id: `e${edgeSeq++}_${stateId}__${target}`,
          source: stateId,
          target,
          label,
          event: t.event || undefined,
          branch: t.branchLabel,
          toStep: tNum ? Number(tNum[1]) : undefined,
        });
      }
    }
  }

  return { nodes, edges };
}
