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
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;   // event + guard, e.g. 'RECORD_PAYMENT [paymentGateGuard]'
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
}

const guardName = (guard: unknown): string | undefined => {
  if (!guard) return undefined;
  if (typeof guard === 'string') return guard;
  if (typeof guard === 'function') return (guard as { name?: string }).name || undefined;
  // Object guard config { type: 'name' }
  if (typeof guard === 'object' && 'type' in (guard as object)) {
    return String((guard as { type?: unknown }).type);
  }
  return undefined;
};

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
    nodes.push({
      id: stateId,
      label: labelForState(stateId),
      kind: kindForState(stateId, stateDef as { type?: string }, transitions),
    });

    for (const t of transitions) {
      const targets = normalizeTargets(t.target);
      // A self-targeting transition with no explicit target is a no-op edge; skip.
      for (const target of targets) {
        const g = guardName(t.guard);
        const labelParts = [t.event, g ? `[${g}]` : ''].filter(Boolean);
        edges.push({
          id: `e${edgeSeq++}_${stateId}__${target}`,
          source: stateId,
          target,
          label: labelParts.join(' ') || undefined,
        });
      }
    }
  }

  return { nodes, edges };
}
