import * as fs from 'fs';
import * as path from 'path';
import { isLowQualityWorkflowTitle, cleanWorkflowTitle } from '../src/services/workflowTitleCleaner';
import { cleanDescription } from '../src/services/workflowDescriptionCleaner';

const INDEX_DIR = path.join(process.cwd(), 'public/data/indexed-workflows');
const DETAILS_DIR = path.join(INDEX_DIR, 'details');
const REPORTS_DIR = path.join(process.cwd(), 'reports');

if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR);
}

async function runAudit() {
  console.log('Starting FlowMatch title and description audit...');
  
  const files = fs.readdirSync(INDEX_DIR)
    .filter(f => f.startsWith('workflows-') && f.endsWith('.json'));

  let totalScanned = 0;
  let goodTitles = 0;
  let lowQualityTitles = 0;
  let rawNodeTitles = 0;
  let camelCaseTitles = 0;
  let genericTitles = 0;
  let titlesRegenerated = 0;
  let manualReviewCount = 0;

  let rawNodeIdentifiersDetected = 0;
  let descriptionsRepaired = 0;

  for (const file of files) {
    const filePath = path.join(INDEX_DIR, file);
    const workflows = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const w of workflows) {
      totalScanned++;

      // Audit Title
      const rawTitle = w.name || '';
      const isLow = isLowQualityWorkflowTitle(rawTitle);

      if (isLow) {
        lowQualityTitles++;
        if (rawTitle.toLowerCase().endsWith('trigger workflow')) rawNodeTitles++;
        else if (/^[a-z]+[A-Z]/g.test(rawTitle)) camelCaseTitles++;
        else genericTitles++;

        w.display_title = cleanWorkflowTitle(w);
        titlesRegenerated++;
      } else {
        goodTitles++;
        w.display_title = rawTitle;
      }

      // Exclude Sticky Note from integrations
      if (Array.isArray(w.integrations)) {
        w.integrations = w.integrations.filter((i: string) => i.toLowerCase() !== 'sticky note' && i.toLowerCase() !== 'stickynote');
      }

      // Audit Description
      const rawDesc = w.description || '';
      if (/stickyNote|gmailTrigger|telegramTrigger|lmChatOpenAi|httpRequest|splitOut/i.test(rawDesc)) {
        rawNodeIdentifiersDetected++;
      }

      const displayDesc = cleanDescription(rawDesc, w);
      if (displayDesc !== rawDesc) {
        descriptionsRepaired++;
      }
      w.display_description = displayDesc;

      // Write details file if it exists
      const detailsPath = path.join(DETAILS_DIR, `${w.id}.json`);
      if (fs.existsSync(detailsPath)) {
        const detailsData = JSON.parse(fs.readFileSync(detailsPath, 'utf-8'));
        detailsData.display_title = w.display_title;
        detailsData.display_description = w.display_description;
        if (Array.isArray(detailsData.integrations)) {
          detailsData.integrations = detailsData.integrations.filter((i: string) => i.toLowerCase() !== 'sticky note' && i.toLowerCase() !== 'stickynote');
        }
        fs.writeFileSync(detailsPath, JSON.stringify(detailsData, null, 2));
      }
    }

    // Save modified chunk
    fs.writeFileSync(filePath, JSON.stringify(workflows, null, 2));
  }

  // Update index.json as well
  const indexPath = path.join(INDEX_DIR, 'index.json');
  if (fs.existsSync(indexPath)) {
    const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    
    // Clean up integrations inside index categories
    if (Array.isArray(indexData.integrations)) {
      indexData.integrations = indexData.integrations.filter((i: any) => i.name.toLowerCase() !== 'sticky note' && i.name.toLowerCase() !== 'stickynote');
    }

    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
  }

  // Generate Report
  const auditReport = {
    totalWorkflowsScanned: totalScanned,
    goodTitles,
    lowQualityTitles,
    rawNodeTitles,
    camelCaseTitles,
    genericTitles,
    titlesRegenerated,
    titlesRequiringManualReview: manualReviewCount,
    rawNodeIdentifiersDetected,
    descriptionsRepaired
  };

  const reportPath = path.join(REPORTS_DIR, 'workflow-title-quality-audit.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));

  console.log('Title audit complete!');
  console.log(`Scanned ${totalScanned} workflows. Regenerated ${titlesRegenerated} titles. Repaired ${descriptionsRepaired} descriptions.`);
}

runAudit().catch(console.error);
