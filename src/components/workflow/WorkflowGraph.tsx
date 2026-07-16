import { useEffect, useState, useMemo } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, Node, Edge, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { computeWorkflowLayout } from '../../services/workflowGraphLayout';

interface WorkflowGraphProps {
  workflowJson: {
    nodes?: any[];
    connections?: any;
  };
}

// Custom node component to support clean left-to-right connections
const WorkflowNodeComponent = ({ data }: any) => {
  return (
    <div className="px-3 py-2 shadow-md rounded-lg bg-zinc-950 border border-zinc-800 text-white min-w-[140px] relative">
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: '#7c3aed', width: '6px', height: '6px', border: 'none' }} 
      />
      <div className="text-center font-mono">
        <div className="font-extrabold text-[10px] text-white line-clamp-1">{data.name}</div>
        <div className="text-zinc-500 font-semibold mt-0.5 uppercase tracking-wider text-[8px]">{data.type}</div>
      </div>
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ background: '#7c3aed', width: '6px', height: '6px', border: 'none' }} 
      />
    </div>
  );
};

export default function WorkflowGraph({ workflowJson }: WorkflowGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [hasPerformanceWarning, setHasPerformanceWarning] = useState(false);

  const nodeTypes = useMemo(() => ({
    workflowNode: WorkflowNodeComponent
  }), []);

  useEffect(() => {
    const rawNodes = workflowJson.nodes || [];
    const rawConnections = workflowJson.connections || {};

    if (rawNodes.length > 100) {
      setHasPerformanceWarning(true);
    }

    const positionedNodes = computeWorkflowLayout(rawNodes, rawConnections);

    // 1. Process Nodes
    const flowNodes: Node[] = positionedNodes.map((node: any) => {
      const position = Array.isArray(node.position) 
        ? { x: node.position[0], y: node.position[1] } 
        : { x: 100, y: 250 };

      const shortType = (node.type || '').replace('n8n-nodes-base.', '').replace('@n8n/', '');

      return {
        id: node.name,
        type: 'workflowNode',
        position,
        data: {
          name: node.name,
          type: shortType,
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

    // Fallback: If no connections could be parsed, build a horizontal sequential flow
    if (flowEdges.length === 0 && flowNodes.length > 1) {
      for (let i = 0; i < flowNodes.length - 1; i++) {
        flowEdges.push({
          id: `edge-seq-${i}-${flowNodes[i].id}-${flowNodes[i + 1].id}`,
          source: flowNodes[i].id,
          target: flowNodes[i + 1].id,
          animated: true,
          style: { stroke: '#7c3aed', strokeWidth: 1.5 },
        });
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
        nodeTypes={nodeTypes}
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
