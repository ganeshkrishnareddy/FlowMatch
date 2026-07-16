import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://flowmatch.co';

function run() {
  console.log('🏁 Generating Sitemap.xml...');
  const outputDir = path.join(process.cwd(), 'public', 'data', 'indexed-workflows');
  const indexPath = path.join(outputDir, 'index.json');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ index.json not found!');
    process.exit(1);
  }

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const urls: string[] = [];

  // 1. Static Pages
  urls.push('/');
  urls.push('/workflows');
  urls.push('/categories');
  urls.push('/integrations');
  urls.push('/collections');
  urls.push('/ai-match');

  // 2. Categories
  (index.categories || []).forEach((c: any) => {
    urls.push(`/workflows?category=${c.slug}`);
  });

  // 3. Integrations
  (index.integrations || []).forEach((i: any) => {
    urls.push(`/workflows?integration=${i.slug}`);
  });

  // 4. Workflows (Load all chunk files)
  for (const chunk of index.chunks || []) {
    const chunkPath = path.join(outputDir, chunk);
    if (fs.existsSync(chunkPath)) {
      const slice = JSON.parse(fs.readFileSync(chunkPath, 'utf-8'));
      for (const w of slice) {
        urls.push(`/workflow/${w.slug}`);
      }
    }
  }

  // XML construction
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  const xmlFooter = `</urlset>`;

  const urlBlocks = urls.map(u => {
    return `  <url>
    <loc>${BASE_URL}${u}</loc>
    <changefreq>weekly</changefreq>
    <priority>${u === '/' ? '1.0' : u.startsWith('/workflow/') ? '0.6' : '0.8'}</priority>
  </url>`;
  });

  const fullXml = `${xmlHeader}\n${urlBlocks.join('\n')}\n${xmlFooter}`;
  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), fullXml);
  console.log(`✅ Generated public/sitemap.xml containing ${urls.length} URLs.`);
}

run();
