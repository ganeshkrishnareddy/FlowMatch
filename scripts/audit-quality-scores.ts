import * as fs from 'fs';
import * as path from 'path';

interface WorkflowMeta {
  id: string;
  name: string;
  slug: string;
  nodeCount: number;
  integrationCount: number;
  difficulty: string;
  estimatedSetupTime: string;
  securityStatus: string;
  verified: boolean;
  qualityScore: number;
  validationStatus: string;
  workflowOrigin: string;
  instructionStatus: string;
}

function runAudit() {
  console.log('🏁 Auditing quality scores of indexed workflows...');
  const indexDir = path.join(process.cwd(), 'public', 'data', 'indexed-workflows');
  const indexPath = path.join(indexDir, 'index.json');
  
  if (!fs.existsSync(indexPath)) {
    console.error('❌ Index file not found.');
    process.exit(1);
  }

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const chunks: string[] = index.chunks || [];
  const allMetas: WorkflowMeta[] = [];

  for (const chunk of chunks) {
    const chunkPath = path.join(indexDir, chunk);
    if (fs.existsSync(chunkPath)) {
      const list = JSON.parse(fs.readFileSync(chunkPath, 'utf-8'));
      allMetas.push(...list);
    }
  }

  const total = allMetas.length;
  if (total === 0) {
    console.log('No workflows to audit.');
    return;
  }

  const scores = allMetas.map(m => m.qualityScore).sort((a, b) => a - b);
  const min = scores[0];
  const max = scores[scores.length - 1];
  const sum = scores.reduce((s, x) => s + x, 0);
  const mean = sum / total;
  
  const median = total % 2 === 0 
    ? (scores[total / 2 - 1] + scores[total / 2]) / 2 
    : scores[Math.floor(total / 2)];

  const p25 = scores[Math.floor(total * 0.25)];
  const p75 = scores[Math.floor(total * 0.75)];
  const p90 = scores[Math.floor(total * 0.90)];

  const exact100 = allMetas.filter(m => m.qualityScore === 100).length;
  const ge95 = allMetas.filter(m => m.qualityScore >= 95).length;
  const verified = allMetas.filter(m => m.verified).length;

  const distribution = {
    '0-49': allMetas.filter(m => m.qualityScore < 50).length,
    '50-59': allMetas.filter(m => m.qualityScore >= 50 && m.qualityScore < 60).length,
    '60-69': allMetas.filter(m => m.qualityScore >= 60 && m.qualityScore < 70).length,
    '70-79': allMetas.filter(m => m.qualityScore >= 70 && m.qualityScore < 80).length,
    '80-84': allMetas.filter(m => m.qualityScore >= 80 && m.qualityScore < 85).length,
    '85-89': allMetas.filter(m => m.qualityScore >= 85 && m.qualityScore < 90).length,
    '90-94': allMetas.filter(m => m.qualityScore >= 90 && m.qualityScore < 95).length,
    '95-100': allMetas.filter(m => m.qualityScore >= 95).length,
  };

  const auditReport = {
    total,
    min,
    max,
    mean: Math.round(mean * 100) / 100,
    median,
    p25,
    p75,
    p90,
    exact100,
    ge95,
    verified,
    distribution
  };

  const reportsDir = path.join(process.cwd(), 'reports');
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(path.join(reportsDir, 'quality-score-audit.json'), JSON.stringify(auditReport, null, 2));
  fs.writeFileSync(path.join(indexDir, 'quality-score-audit.json'), JSON.stringify(auditReport, null, 2));

  console.log('✅ Audit report created:');
  console.log(JSON.stringify(auditReport, null, 2));
}

runAudit();
