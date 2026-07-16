export interface GraphNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
}

export interface GraphConnection {
  from: string;
  to: string;
}

export function computeWorkflowLayout(
  nodes: GraphNode[],
  connections: Record<string, any>
): GraphNode[] {
  // If at least one node has a non-zero position, keep the original layout
  const hasCoordinates = nodes.some(n => 
    n.position && 
    (Math.abs(n.position[0]) > 0.01 || Math.abs(n.position[1]) > 0.01)
  );

  if (hasCoordinates) {
    return nodes;
  }

  // Fallback: Automatic left-to-right layout using a simple BFS layering approach
  const adjList: Record<string, string[]> = {};
  const inDegree: Record<string, number> = {};

  nodes.forEach(n => {
    adjList[n.name] = [];
    inDegree[n.name] = 0;
  });

  // Build connection graph
  Object.keys(connections || {}).forEach(srcNode => {
    const outputs = connections[srcNode];
    Object.keys(outputs || {}).forEach(outType => {
      const targets = outputs[outType] || [];
      targets.forEach((targetGroup: any) => {
        const targetList = Array.isArray(targetGroup) ? targetGroup : [targetGroup];
        targetList.forEach(t => {
          if (t && t.node && adjList[srcNode] && inDegree[t.node] !== undefined) {
            adjList[srcNode].push(t.node);
            inDegree[t.node]++;
          }
        });
      });
    });
  });

  // Layering
  const queue: string[] = [];
  const layers: Record<string, number> = {};

  nodes.forEach(n => {
    if (inDegree[n.name] === 0) {
      queue.push(n.name);
      layers[n.name] = 0;
    }
  });

  // Default layer for disconnected nodes
  while (queue.length > 0) {
    const curr = queue.shift()!;
    const currLayer = layers[curr] || 0;

    (adjList[curr] || []).forEach(next => {
      if (layers[next] === undefined || layers[next] < currLayer + 1) {
        layers[next] = currLayer + 1;
        queue.push(next);
      }
    });
  }

  // Count items per layer to offset vertically
  const layerCounts: Record<number, number> = {};
  const layerTrackers: Record<number, number> = {};

  nodes.forEach(n => {
    const layer = layers[n.name] || 0;
    layerCounts[layer] = (layerCounts[layer] || 0) + 1;
    layerTrackers[layer] = 0;
  });

  return nodes.map(n => {
    const layer = layers[n.name] || 0;
    const count = layerCounts[layer] || 1;
    const tracker = layerTrackers[layer] || 0;
    layerTrackers[layer] = tracker + 1;

    // Center layout vertically per layer
    const x = 100 + layer * 260;
    const y = 250 + (tracker - (count - 1) / 2) * 120;

    return {
      ...n,
      position: [x, y]
    };
  });
}
