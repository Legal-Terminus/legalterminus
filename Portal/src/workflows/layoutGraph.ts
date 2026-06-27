import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';
import { MarkerType } from '@xyflow/react';
import type { WorkflowGraph, GraphNode, NodeKind } from './machineToGraph';

/**
 * Runs a derived WorkflowGraph through dagre (top-to-bottom) to assign positions,
 * then maps to React Flow Node[]/Edge[]. Branches and loops are handled by dagre's
 * rank layout. Node data carries `kind` so the custom node can style by type.
 */

const NODE_WIDTH = 200;
const NODE_HEIGHT = 56;

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string;
  kind: NodeKind;
  stepNumber?: number;
  highlight?: boolean; // editor: the step currently being edited
}

export function layoutGraph(graph: WorkflowGraph): { nodes: Node<WorkflowNodeData>[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'TB', ranksep: 60, nodesep: 40 });
  g.setDefaultEdgeLabel(() => ({}));

  graph.nodes.forEach((n: GraphNode) => {
    g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });
  graph.edges.forEach((e) => {
    g.setEdge(e.source, e.target);
  });

  dagre.layout(g);

  const nodes: Node<WorkflowNodeData>[] = graph.nodes.map((n) => {
    const pos = g.node(n.id);
    return {
      id: n.id,
      type: 'workflowNode',
      // dagre centers nodes; React Flow positions by top-left corner.
      position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 },
      data: { label: n.label, kind: n.kind, stepNumber: n.stepNumber },
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    };
  });

  const edges: Edge[] = graph.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    // Outcome identity (for per-outcome colouring of the focused step's arrows).
    data: { event: e.event, branch: e.branch, toStep: e.toStep },
    labelStyle: { fontSize: 10, fill: '#6b7280' },
    labelBgPadding: [4, 2],
    labelBgStyle: { fill: '#ffffff', fillOpacity: 0.85 },
    style: { stroke: '#cbd5e1', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#cbd5e1' },
  }));

  return { nodes, edges };
}
