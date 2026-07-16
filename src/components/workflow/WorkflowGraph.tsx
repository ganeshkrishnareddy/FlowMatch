import { useEffect, useState } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { computeWorkflowLayout } from '../../services/workflowGraphLayout';

interface WorkflowGraphProps {
  workflowJson: {
    nodes?: any[];
    connections?: any;
  };
}

export default function WorkflowGraph({ workflowJson }: WorkflowGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [hasPerformanceWarning, setHasPerformanceWarning] = useState(false);

  useEffect(() => {
    const rawNodes = workflowJson.nodes || [];
    const rawConnections = workflowJson.connections || {};

    if (rawNodes.length > 100) {
      setHasPerformanceWarning(true);
    }

    // Apply auto layout if coordinates are missing or zero
    const positionedNodes = computeWorkflowLayout(rawNodes, rawConnections);

    // 1. Process Nodes
    const flowNodes: Node[] = positionedNodes.map((node: any) => {
      const position = Array.isArray(node.position) 
        ? { x: node.position[0], y: node.position[1] } 
        : { x: 100, y: 250 };

      // Make a clean short name from n8n node type
      const shortType = (node.type || '').replace('n8n-nodes-base.', '').replace('@n8n/', '');

      return {
        id: node.name,
        type: 'default',
        position,
        data: {
          label: (
            <div className="text-center p-1 font-mono text-[10px]">
              <div className="font-extrabold text-white line-clamp-1">{node.name}</div>
              <div className="text-zinc-500 font-semibold mt-0.5 uppercase tracking-wider text-[8px]">{shortType}</div>
            </div>
          ),
        },
        style: {
          background: '#09090b',
          color: '#fff',
          border: '1px solid #27272a',
          borderRadius: '8px',
          width: 140,
        },
      };
    });

    // 2. Process Edges
    const flowEdges: Edge[] = [];
    let edgeIdCounter = 0;

    for (const [srcNode, srcNodeConns] of Object.entries(rawConnections)) {
      if (srcNodeConns && typeof srcNodeConns === 'object') {
        for (const [connType, paths] of Object.entries(srcNodeConns)) {
          if (Array.isArray(paths)) {
            paths.forEach((pathGroup, outputIdx) => {
              if (Array.isArray(pathGroup)) {
                pathGroup.forEach((target: any) => {
                  if (target && target.node) {
                    edgeIdCounter++;
                    flowEdges.push({
                      id: `edge-${edgeIdCounter}-${srcNode}-${target.node}`,
                      source: srcNode,
                      target: target.node,
                      animated: true,
                      style: { stroke: '#6366f1', strokeWidth: 1.5 },
                    });
                  }
                });
              }
            });
          }
        }
      }
    }

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [workflowJson, setNodes, setEdges]);

  return (
    <div className="h-full w-full relative">
      {hasPerformanceWarning && (
        <div className="absolute top-2 left-2 z-10 bg-amber-950/80 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded text-xs">
          ⚠️ Large workflow (&gt;100 nodes). Rendering simplified preview.
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        className="bg-zinc-950"
      >
        <Controls showInteractive={false} className="bg-zinc-900 border border-zinc-800 text-white fill-white" />
        <MiniMap zoomable pannable style={{ background: '#09090b' }} maskColor="rgba(0, 0, 0, 0.6)" />
        <Background color="#27272a" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}
