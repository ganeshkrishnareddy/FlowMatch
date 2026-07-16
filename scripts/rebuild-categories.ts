import * as fs from 'fs';
import * as path from 'path';
import { normalizeCategory } from '../src/services/categoryNormalizer';

// This script:
// 1. Loads all existing workflow chunks
// 2. Assigns normalized categories to EVERY workflow
// 3. Rebuilds chunks and index.json with correct category counts

function rebuildCategories() {
  console.log('🏁 Rebuilding categories for all workflows...');
  const indexDir = path.join(process.cwd(), 'public', 'data', 'indexed-workflows');
  const indexPath = path.join(indexDir, 'index.json');
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

  // Load all workflows from chunks
  const allWorkflows: any[] = [];
  for (const chunk of index.chunks || []) {
    const chunkPath = path.join(indexDir, chunk);
    if (fs.existsSync(chunkPath)) {
      const list = JSON.parse(fs.readFileSync(chunkPath, 'utf-8'));
      allWorkflows.push(...list);
    }
  }

  console.log(`📊 Loaded ${allWorkflows.length} workflows. Assigning categories...`);

  // Assign normalized category to every workflow
  for (const w of allWorkflows) {
    const rawCat = w.category?.name || w.categoryId || w.category || '';
    const cat = normalizeCategory(rawCat, w.name || '', w.description || '', w.integrations || []);
    w.category = { slug: cat.slug, name: cat.name };
    w.categoryId = cat.slug;
  }

  // Calculate category counts
  const categoryMap = new Map<string, { name: string; slug: string; count: number }>();
  for (const w of allWorkflows) {
    const key = w.category.slug;
    if (!categoryMap.has(key)) {
      categoryMap.set(key, { name: w.category.name, slug: w.category.slug, count: 0 });
    }
    categoryMap.get(key)!.count++;
  }

  // Calculate integration counts
  const integrationMap = new Map<string, { name: string; slug: string; count: number }>();
  for (const w of allWorkflows) {
    for (const intName of (w.integrations || [])) {
      const slug = intName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!integrationMap.has(slug)) {
        integrationMap.set(slug, { name: intName, slug, count: 0 });
      }
      integrationMap.get(slug)!.count++;
    }
  }

  // Re-chunk all workflows
  const existingChunks = fs.readdirSync(indexDir).filter(f => f.startsWith('workflows-') && f.endsWith('.json'));
  for (const f of existingChunks) {
    fs.unlinkSync(path.join(indexDir, f));
  }

  const chunkSize = 100;
  const chunks: string[] = [];
  for (let i = 0; i < allWorkflows.length; i += chunkSize) {
    const slice = allWorkflows.slice(i, i + chunkSize);
    const metadataSlice = slice.map(w => {
      const { originalWorkflowJson, normalizedWorkflowJson, ...meta } = w;
      return meta;
    });
    const chunkFileName = `workflows-${(i / chunkSize + 1).toString().padStart(4, '0')}.json`;
    fs.writeFileSync(path.join(indexDir, chunkFileName), JSON.stringify(metadataSlice, null, 2));
    chunks.push(chunkFileName);
  }

  // Write updated index
  const categoriesArr = Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);
  const integrationsArr = Array.from(integrationMap.values()).sort((a, b) => b.count - a.count);

  const updatedIndex = {
    totalWorkflows: allWorkflows.length,
    chunks,
    categories: categoriesArr,
    integrations: integrationsArr,
    generatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(indexPath, JSON.stringify(updatedIndex, null, 2));

  // Also update detail files with category info
  const detailsDir = path.join(indexDir, 'details');
  for (const w of allWorkflows) {
    const detailPath = path.join(detailsDir, `${w.slug}.json`);
    if (fs.existsSync(detailPath)) {
      const detail = JSON.parse(fs.readFileSync(detailPath, 'utf-8'));
      detail.category = w.category;
      detail.categoryId = w.categoryId;
      fs.writeFileSync(detailPath, JSON.stringify(detail, null, 2));
    }
  }

  const otherCount = categoryMap.get('other-automation')?.count || 0;
  const otherPct = ((otherCount / allWorkflows.length) * 100).toFixed(1);

  console.log(`✅ Categories rebuilt successfully!`);
  console.log(`📊 Total workflows: ${allWorkflows.length}`);
  console.log(`📊 Total categories: ${categoriesArr.length}`);
  console.log(`📊 Total integrations: ${integrationsArr.length}`);
  console.log(`📊 Other Automation: ${otherCount} (${otherPct}%)`);
  console.log(`📊 Top 5 categories:`);
  categoriesArr.slice(0, 5).forEach(c => console.log(`   ${c.name}: ${c.count}`));
}

rebuildCategories();
