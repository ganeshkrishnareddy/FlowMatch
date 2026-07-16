import * as fs from 'fs';
import * as path from 'path';

const INDEX_DIR = path.join(process.cwd(), 'public/data/indexed-workflows');
const REPORTS_DIR = path.join(process.cwd(), 'reports');

async function runTextAudit() {
  console.log('Running Customer-Facing Text Audit...');

  const files = fs.readdirSync(INDEX_DIR)
    .filter(f => f.startsWith('workflows-') && f.endsWith('.json'));

  let recordsScanned = 0;
  let rawNodeIdentifiersDetected = 0;
  let titlesRepaired = 0;
  let descriptionsRepaired = 0;
  let integrationLabelsRepaired = 0;
  let remainingTechnicalTerms: string[] = [];

  const rawIdentifiersPattern = /stickyNote|gmailTrigger|telegramTrigger|lmChatOpenAi|httpRequest|splitOut/i;

  for (const file of files) {
    const filePath = path.join(INDEX_DIR, file);
    const workflows = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const w of workflows) {
      recordsScanned++;

      const checkText = `${w.display_title || ''} ${w.display_description || ''} ${w.integrations?.join(' ') || ''}`;
      if (rawIdentifiersPattern.test(checkText)) {
        rawNodeIdentifiersDetected++;
      }
    }
  }

  const auditReport = {
    recordsScanned,
    rawNodeIdentifiersDetected,
    titlesRepaired,
    descriptionsRepaired,
    integrationLabelsRepaired,
    remainingTechnicalTerms
  };

  fs.writeFileSync(path.join(REPORTS_DIR, 'customer-facing-text-audit.json'), JSON.stringify(auditReport, null, 2));
  console.log('Customer text audit complete!');
}

runTextAudit().catch(console.error);
