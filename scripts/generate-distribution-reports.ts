import * as fs from 'fs';
import * as path from 'path';

interface Workflow {
  id: string;
  name: string;
  slug: string;
  category?: { slug: string; name: string };
  categoryId?: string;
  integrations: string[];
  qualityScore: number;
  securityStatus: string;
  workflowOrigin: string;
  architecturePattern?: string;
}

function runReports() {
  console.log('🏁 Generating distributions reports...');
  const indexDir = path.join(process.cwd(), 'public', 'data', 'indexed-workflows');
  const indexPath = path.join(indexDir, 'index.json');
  
  if (!fs.existsSync(indexPath)) {
    console.error('❌ Index file not found.');
    process.exit(1);
  }

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const chunks: string[] = index.chunks || [];
  const originals: Workflow[] = [];

  for (const chunk of chunks) {
    const chunkPath = path.join(indexDir, chunk);
    if (fs.existsSync(chunkPath)) {
      const list = JSON.parse(fs.readFileSync(chunkPath, 'utf-8')) as Workflow[];
      originals.push(...list.filter(w => w.workflowOrigin === 'flowmatch_original'));
    }
  }

  console.log(`📊 Loaded ${originals.length} FlowMatch originals to compile reports.`);

  const reportsDir = path.join(process.cwd(), 'reports');
  fs.mkdirSync(reportsDir, { recursive: true });

  // 1. Category Distribution
  const categoryMap: Record<string, number> = {};
  for (const w of originals) {
    const cat = w.categoryId || w.category?.slug || 'unknown';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  }
  fs.writeFileSync(path.join(reportsDir, 'original-category-distribution.json'), JSON.stringify(categoryMap, null, 2));

  // 2. Architecture Distribution
  const archMap: Record<string, number> = {};
  for (const w of originals) {
    const pattern = w.architecturePattern || 'event_to_action';
    archMap[pattern] = (archMap[pattern] || 0) + 1;
  }
  fs.writeFileSync(path.join(reportsDir, 'original-architecture-distribution.json'), JSON.stringify(archMap, null, 2));

  // 3. Security Distribution
  const secMap: Record<string, number> = { Passed: 0, 'Review Recommended': 0, 'Potential Risk': 0 };
  for (const w of originals) {
    const sec = w.securityStatus || 'Passed';
    secMap[sec] = (secMap[sec] || 0) + 1;
  }
  fs.writeFileSync(path.join(reportsDir, 'original-security-distribution.json'), JSON.stringify(secMap, null, 2));

  // 4. Quality Distribution
  const qualMap = {
    '0-49': 0, '50-59': 0, '60-69': 0, '70-79': 0,
    '80-84': 0, '85-89': 0, '90-94': 0, '95-100': 0
  };
  for (const w of originals) {
    const score = w.qualityScore;
    if (score < 50) qualMap['0-49']++;
    else if (score < 60) qualMap['50-59']++;
    else if (score < 70) qualMap['60-69']++;
    else if (score < 80) qualMap['70-79']++;
    else if (score < 85) qualMap['80-84']++;
    else if (score < 90) qualMap['85-89']++;
    else if (score < 95) qualMap['90-94']++;
    else qualMap['95-100']++;
  }
  fs.writeFileSync(path.join(reportsDir, 'original-quality-distribution.json'), JSON.stringify(qualMap, null, 2));

  // 5. Integrations Distribution (frequency, pairs, combinations)
  const freq: Record<string, number> = {};
  const pairFreq: Record<string, number> = {};
  const comboFreq: Record<string, number> = {};

  for (const w of originals) {
    const ints = [...w.integrations].sort();
    ints.forEach(i => freq[i] = (freq[i] || 0) + 1);

    // Pairs
    for (let a = 0; a < ints.length; a++) {
      for (let b = a + 1; b < ints.length; b++) {
        const pairKey = `${ints[a]} + ${ints[b]}`;
        pairFreq[pairKey] = (pairFreq[pairKey] || 0) + 1;
      }
    }

    // Combination
    const comboKey = ints.join(' + ');
    comboFreq[comboKey] = (comboFreq[comboKey] || 0) + 1;
  }

  const integrationReport = {
    frequency: freq,
    pairFrequency: pairFreq,
    combinationFrequency: comboFreq,
    top20Combinations: Object.entries(comboFreq).sort((a,b) => b[1] - a[1]).slice(0, 20)
  };
  fs.writeFileSync(path.join(reportsDir, 'original-integration-distribution.json'), JSON.stringify(integrationReport, null, 2));

  console.log('✅ Distributions reports compiled successfully inside reports/ directory.');
}

runReports();
