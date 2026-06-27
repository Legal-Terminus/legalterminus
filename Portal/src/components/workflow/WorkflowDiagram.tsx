import { useEffect, useMemo } from 'react';
import type { AnyStateMachine } from 'xstate';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
  type NodeProps,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { machineToGraph, outcomeColor, type NodeKind } from '../../workflows/machineToGraph';
import { layoutGraph, type WorkflowNodeData } from '../../workflows/layoutGraph';

/**
 * Read-only visual of a workflow machine. CONTROLLED React Flow: nodes/edges are
 * driven from the machine and re-synced whenever it changes (live editor preview).
 * An optional `highlightStepNumber` styles + centres the step currently being
 * edited so it's easy to locate in the chart.
 */

const KIND_STYLE: Record<NodeKind, { box: string; badge?: string; badgeText?: string }> = {
  step: { box: 'bg-white border-hairline' },
  payment_gate: { box: 'bg-amber-50 border-amber-300', badge: 'bg-amber-100 text-amber-700', badgeText: 'Payment gate' },
  waiting: { box: 'bg-surface-soft border-hairline border-dashed', badge: 'bg-surface-card text-ink-muted', badgeText: 'Waiting' },
  branch: { box: 'bg-brand-50 border-brand-300', badge: 'bg-brand-100 text-brand-700', badgeText: 'Branch' },
  final: { box: 'bg-emerald-50 border-emerald-300', badge: 'bg-emerald-100 text-emerald-700', badgeText: 'Done' },
};

function WorkflowNode({ data }: NodeProps) {
  const { label, kind, highlight } = data as WorkflowNodeData;
  const s = KIND_STYLE[kind];
  return (
    <div className={`rounded-lg border px-3 py-2 shadow-sm w-[200px] transition-all ${s.box} ${
      highlight ? 'ring-2 ring-brand-500 border-brand-500 shadow-md scale-[1.03]' : ''
    }`}>
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

function DiagramInner({ machine, highlightStepNumber, centerToken, onStepClick, displayNumbers }: {
  machine: AnyStateMachine;
  highlightStepNumber?: number | null;
  centerToken?: { step: number; nonce: number } | null;
  onStepClick?: (stepNumber: number) => void;
  displayNumbers?: Record<number, number>;
}) {
  const graph = useMemo(() => {
    const g = layoutGraph(machineToGraph(machine));
    // Prefix node labels with the EDITOR's display number (1,2,3…) so the chart and
    // the step cards use the same numbering. Falls back to no prefix when unknown.
    if (displayNumbers) {
      g.nodes = g.nodes.map((n) => {
        const sn = (n.data as WorkflowNodeData).stepNumber;
        const dn = sn != null ? displayNumbers[sn] : undefined;
        return dn != null
          ? { ...n, data: { ...n.data, label: `${dn}. ${(n.data as WorkflowNodeData).label}` } }
          : n;
      });
    }
    return g;
  }, [machine, displayNumbers]);
  const [nodes, setNodes, onNodesChange] = useNodesState(graph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graph.edges);
  const { setCenter } = useReactFlow();

  // A signature of the graph — re-sync nodes/edges when the machine changes (a live
  // edit), preserving pan/zoom between edits. Includes edge LABELS so renaming an
  // outcome/branch option (same source/target) still refreshes the chart.
  const sig = useMemo(
    () => `${graph.nodes.map((n) => `${n.id}:${(n.data as WorkflowNodeData).label}:${(n.data as WorkflowNodeData).kind}`).join('|')}__${graph.edges.map((e) => `${e.source}->${e.target}:${e.label ?? ''}`).join('|')}`,
    [graph],
  );

  // Live refresh: re-sync nodes/edges IN PLACE when the graph changes. We do NOT
  // auto-fit/center here — that yanked the view on every keystroke. The user's
  // pan/zoom is preserved; new steps simply appear.
  useEffect(() => {
    setNodes((prev) => {
      const byId = new Map(prev.map((p) => [p.id, p]));
      return graph.nodes.map((n) => ({
        ...n,
        // keep prior position if the node already existed (avoid layout jump)
        position: byId.get(n.id)?.position ?? n.position,
        data: { ...n.data, highlight: (byId.get(n.id)?.data as WorkflowNodeData | undefined)?.highlight ?? false },
      }));
    });
    setEdges(graph.edges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);

  // Highlight the active step's node (colour) AND its OUTGOING arrows, so it's
  // obvious where the focused step routes. Colour only — no scrolling.
  useEffect(() => {
    const activeId = highlightStepNumber != null
      ? graph.nodes.find((n) => (n.data as WorkflowNodeData).stepNumber === highlightStepNumber)?.id
      : null;
    setNodes((ns) => ns.map((n) => ({
      ...n,
      data: { ...n.data, highlight: activeId != null && n.id === activeId },
    })));
    setEdges((es) => es.map((e) => {
      const on = activeId != null && e.source === activeId;
      // Each outgoing arrow of the focused step gets a DISTINCT colour (keyed on
      // outcome identity) so multiple outcomes are easy to tell apart; it matches
      // the colour dot on that outcome's row in the editor. Off-focus = neutral.
      const d = (e.data ?? {}) as { event?: string; branch?: string; toStep?: number };
      const colour = on ? outcomeColor(d.event ?? '', d.branch, d.toStep ?? 0) : undefined;
      return {
        ...e,
        animated: on,
        style: { ...e.style, stroke: colour ?? '#cbd5e1', strokeWidth: on ? 2.5 : 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: colour ?? '#cbd5e1' },
        labelStyle: on ? { fill: colour, fontWeight: 600, fontSize: 10 } : { fontSize: 10, fill: '#6b7280' },
        zIndex: on ? 10 : 0,
      };
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightStepNumber, sig]);

  // Center on a step ONLY when explicitly requested (locate-in-chart button). The
  // nonce makes repeated clicks on the same step re-trigger.
  useEffect(() => {
    if (!centerToken) return;
    const target = graph.nodes.find((n) => (n.data as WorkflowNodeData).stepNumber === centerToken.step);
    if (target) {
      setCenter((target.position.x ?? 0) + 100, (target.position.y ?? 0) + 28, { zoom: 1.1, duration: 400 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerToken?.nonce]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={(_e, node) => {
        const sn = (node.data as WorkflowNodeData).stepNumber;
        if (sn != null) onStepClick?.(sn);
      }}
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
  );
}

export default function WorkflowDiagram({ machine, highlightStepNumber, centerToken, onStepClick, displayNumbers }: {
  machine: AnyStateMachine;
  highlightStepNumber?: number | null;
  centerToken?: { step: number; nonce: number } | null;
  onStepClick?: (stepNumber: number) => void;
  displayNumbers?: Record<number, number>;
}) {
  return (
    <div className="h-[70vh] w-full rounded-xl border border-hairline bg-surface-soft">
      <ReactFlowProvider>
        <DiagramInner machine={machine} highlightStepNumber={highlightStepNumber} centerToken={centerToken} onStepClick={onStepClick} displayNumbers={displayNumbers} />
      </ReactFlowProvider>
    </div>
  );
}
