import * as fs from 'fs';
import * as path from 'path';

const DIST_DIR = path.join(process.cwd(), 'dist');

function runChecks() {
  console.log('Running Cloudflare Pages deployment readiness checks...');

  const checks = {
    distExists: fs.existsSync(DIST_DIR),
    indexHtmlExists: fs.existsSync(path.join(DIST_DIR, 'index.html')),
    redirectsExists: fs.existsSync(path.join(DIST_DIR, '_redirects')),
    headersExists: fs.existsSync(path.join(DIST_DIR, '_headers')),
    robotsTxtExists: fs.existsSync(path.join(DIST_DIR, 'robots.txt')),
    sitemapXmlExists: fs.existsSync(path.join(DIST_DIR, 'sitemap.xml')),
    noLocalhost: true,
    noServiceRoleKeys: true,
    fileCount: 0,
    largestFileSize: 0,
    largestFilePath: '',
  };

  if (!checks.distExists) {
    console.error('FAIL: dist directory does not exist. Please run npm run build first.');
    process.exit(1);
  }

  // Scan dist recursively for issues and counts
  function scan(dir: string) {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scan(fullPath);
      } else {
        checks.fileCount++;
        
        // Track largest file
        if (stat.size > checks.largestFileSize) {
          checks.largestFileSize = stat.size;
          checks.largestFilePath = fullPath;
        }

        // Text scans
        if (entry.endsWith('.js') || entry.endsWith('.html') || entry.endsWith('.css') || entry.endsWith('.json')) {
          const content = fs.readFileSync(fullPath, 'utf-8');

          if (content.includes('localhost:') || content.includes('127.0.0.1')) {
            checks.noLocalhost = false;
            console.warn(`WARNING: Localhost reference found in ${entry}`);
          }

          if (content.includes('service_role') || /ey[a-zA-Z0-9]{100,}\.ey[a-zA-Z0-9]{100,}/.test(content)) {
            // Simple check for supabase service role jwt token pattern
            if (content.includes('service_role_key') || content.includes('supabase_service_role')) {
              checks.noServiceRoleKeys = false;
              console.error(`FAIL: Potential Supabase service role key pattern detected in ${entry}`);
            }
          }
        }
      }
    }
  }

  scan(DIST_DIR);

  console.log('\n--- VERIFICATION RESULTS ---');
  console.log(`- Dist Directory Exists: ${checks.distExists ? 'PASS' : 'FAIL'}`);
  console.log(`- index.html Exists: ${checks.indexHtmlExists ? 'PASS' : 'FAIL'}`);
  console.log(`- _redirects Exists: ${checks.redirectsExists ? 'PASS' : 'FAIL'}`);
  console.log(`- _headers Exists: ${checks.headersExists ? 'PASS' : 'FAIL'}`);
  console.log(`- robots.txt Exists: ${checks.robotsTxtExists ? 'PASS' : 'FAIL'}`);
  console.log(`- sitemap.xml Exists: ${checks.sitemapXmlExists ? 'PASS' : 'FAIL'}`);
  console.log(`- No Localhost URLs: ${checks.noLocalhost ? 'PASS' : 'WARNING'}`);
  console.log(`- No Service Role Secrets: ${checks.noServiceRoleKeys ? 'PASS' : 'FAIL'}`);
  console.log(`- Total Files in Build: ${checks.fileCount}`);
  console.log(`- Largest File: ${path.basename(checks.largestFilePath)} (${(checks.largestFileSize / 1024 / 1024).toFixed(2)} MB)`);

  const passed = checks.distExists && 
                 checks.indexHtmlExists && 
                 checks.redirectsExists && 
                 checks.headersExists && 
                 checks.robotsTxtExists && 
                 checks.sitemapXmlExists && 
                 checks.noServiceRoleKeys;

  if (passed) {
    console.log('\nSUCCESS: Project is READY for Cloudflare Pages deployment.');
    process.exit(0);
  } else {
    console.error('\nFAIL: Deployment checklist has failing items.');
    process.exit(1);
  }
}

runChecks();
