import * as fs from 'fs';
import * as path from 'path';
import { validateWorkflow } from '../src/services/workflowValidator';

const sourceRepoPath = path.join(process.cwd(), 'source-repo', 'workflows');
const files: string[] = [];
function recScan(dir: string) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      recScan(fullPath);
    } else if (item.endsWith('.json')) {
      files.push(fullPath);
    }
  }
}
recScan(sourceRepoPath);

let count = 0;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const rawJson = JSON.parse(content);
  const validation = validateWorkflow(path.basename(file), rawJson);
  if (validation.status === 'Invalid') {
    console.log(`File: ${path.basename(file)} | Status: ${validation.status} | Issues:`, validation.issues);
    count++;
    if (count > 5) break;
  }
}
