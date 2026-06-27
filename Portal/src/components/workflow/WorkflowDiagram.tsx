import { useMemo } from 'react';
import type { AnyStateMachine } from 'xstate';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type NodeProps,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { machineToGraph, type NodeKind } from '../../workflows/machineToGraph';
import { layoutGraph, type WorkflowNodeData } from '../../workflows/layoutGraph';

/**
 * Read-only visual of a workflow machine. Derives nodes/edges from the machine
 * definition and lays them out top-to-bottom. Stays in sync with the machine
 * automatically — no hand-maintained diagram.
 */

const KIND_STYLE: Record<NodeKind, { box: string; badge?: string; badgeText?: string }> = {
  step: { box: 'bg-white border-hairline' },
  payment_gate: { box: 'bg-amber-50 border-amber-300', badge: 'bg-amber-100 text-amber-700', badgeText: 'Payment gate' },
  waiting: { box: 'bg-surface-soft border-hairline border-dashed', badge: 'bg-surface-card text-ink-muted', badgeText: 'Waiting' },
  branch: { box: 'bg-brand-50 border-brand-300', badge: 'bg-brand-100 text-brand-700', badgeText: 'Branch' },
  final: { box: 'bg-emerald-50 border-emerald-300', badge: 'bg-emerald-100 text-emerald-700', badgeText: 'Done' },
};

function WorkflowNode({ data }: NodeProps) {
  const { label, kind } = data as WorkflowNodeData;
  const s = KIND_STYLE[kind];
  return (
    <div className={`rounded-lg border px-3 py-2 shadow-sm w-[200px] ${s.box}`}>
      <Handle type="target" position={Position.Top} className="!bg-ink-faint" />
      <p className="text-xs font-semibold text-ink leading-snug">{label}</p>
      {s.badgeText && (
        <span className={`mt-1 inline-block text-[9px] font-medium px-1.5 py-0.5 rounded ${s.badge}`}>
          {s.badgeText}
        </span>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-ink-faint" />
    </div>
  );
}

const nodeTypes: NodeTypes = { workflowNode: WorkflowNode };

export default function WorkflowDiagram({ machine }: { machine: AnyStateMachine }) {
  const { nodes, edges } = useMemo(() => layoutGraph(machineToGraph(machine)), [machine]);

  // ReactFlow treats `nodes`/`edges` as INITIAL state when used uncontrolled, so it
  // won't refresh when the machine changes (e.g. the live editor preview). Remount
  // on a structural signature of the graph so edits reflect immediately + re-fitView.
  const graphKey = useMemo(
    () => `${nodes.map((n) => `${n.id}:${(n.data as WorkflowNodeData).label}:${(n.data as WorkflowNodeData).kind}`).join('|')}__${edges.map((e) => `${e.source}->${e.target}`).join('|')}`,
    [nodes, edges],
  );

  return (
    <div className="h-[70vh] w-full rounded-xl border border-hairline bg-surface-soft">
      <ReactFlow
        key={graphKey}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={16} color="#e5e7eb" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
