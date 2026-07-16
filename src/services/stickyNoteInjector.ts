import { Workflow } from '../types/workflow';

export function injectStickyNote(originalJson: any, w: Workflow): any {
  if (!originalJson) return originalJson;

  try {
    const json = JSON.parse(JSON.stringify(originalJson));
    if (!json.nodes) json.nodes = [];

    // Filter out existing flowmatch sticky notes to avoid duplicates
    json.nodes = json.nodes.filter((n: any) => n.id !== 'flowmatch-sticky-note');

    const steps = w.instructions?.configurationSteps?.map((s: string, idx: number) => `${idx + 1}. ${s}`).join('\n') || '1. Configure API credentials on each connection node.';

    const content = `### ${w.display_title || w.name}

**About this workflow:**
${w.display_description || w.description}

**Configuration Steps:**
${steps}

---
*Template curated by FlowMatch (developed & maintained by ProgVision)*`;

    // Find the left-most coordinates
    let minX = 0;
    let minY = 0;
    
    if (json.nodes.length > 0) {
      const xCoords = json.nodes.map((n: any) => {
        if (Array.isArray(n.position)) return n.position[0];
        if (n.position && typeof n.position.x === 'number') return n.position.x;
        return 0;
      });
      const yCoords = json.nodes.map((n: any) => {
        if (Array.isArray(n.position)) return n.position[1];
        if (n.position && typeof n.position.y === 'number') return n.position.y;
        return 0;
      });

      minX = Math.min(...xCoords);
      minY = Math.min(...yCoords);
    }

    const stickyNoteNode = {
      parameters: {
        content: content,
        height: 420,
        width: 480
      },
      id: 'flowmatch-sticky-note',
      name: 'Workflow Instructions',
      type: 'n8n-nodes-base.stickyNote',
      typeVersion: 1,
      position: [minX - 520, minY]
    };

    json.nodes.unshift(stickyNoteNode);
    return json;
  } catch (err) {
    console.error('Failed to inject sticky note into workflow JSON', err);
    return originalJson;
  }
}
