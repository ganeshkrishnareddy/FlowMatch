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
  // Always calculate dynamic layering auto-layout to guarantee clean horizontal alignment

  // Build adjacency list
  const adjList: Record<string, string[]> = {};
  const inDegree: Record<string, number> = {};

  nodes.forEach(n => {
    adjList[n.name] = [];
    inDegree[n.name] = 0;
  });

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

  // Traverse using BFS to establish a strict horizontal sequence
  const orderedNodes: string[] = [];
  const visited = new Set<string>();

  // Start with triggers/sources (in-degree = 0)
  const sources = nodes.filter(n => inDegree[n.name] === 0).map(n => n.name);
  
  const queue: string[] = [...sources];
  sources.forEach(s => visited.add(s));

  // If no sources, push the first node
  if (queue.length === 0 && nodes.length > 0) {
    queue.push(nodes[0].name);
    visited.add(nodes[0].name);
  }

  while (queue.length > 0) {
    const curr = queue.shift()!;
    orderedNodes.push(curr);

    (adjList[curr] || []).forEach(next => {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    });
  }

  // Add any remaining unvisited nodes
  nodes.forEach(n => {
    if (!visited.has(n.name)) {
      orderedNodes.push(n.name);
      visited.add(n.name);
    }
  });

  // Now map coordinates based on their sequence index
  const positions: Record<string, { x: number; y: number }> = {};
  
  orderedNodes.forEach((nodeName, idx) => {
    positions[nodeName] = {
      x: 100 + idx * 260,
      y: 250
    };
  });

  return nodes.map(n => {
    const pos = positions[n.name] || { x: 100, y: 250 };
    return {
      ...n,
      position: [pos.x, pos.y]
    };
  });
}
