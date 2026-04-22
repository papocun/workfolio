import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  \x1b[32m✓\x1b[0m ${message}`);
  } else {
    failedTests++;
    console.error(`  \x1b[31m✗\x1b[0m ${message}`);
  }
}

// RFC 7231 / 9110 accept parser implementation for validation
function parseAcceptHeader(acceptHeader) {
  if (!acceptHeader || typeof acceptHeader !== 'string') {
    return [{ mediaType: '*/*', type: '*', subtype: '*', q: 1, params: {} }];
  }

  const entries = [];
  const parts = acceptHeader.split(',');

  for (const rawPart of parts) {
    const part = rawPart.trim();
    if (!part) continue;

    const segments = part.split(';').map((s) => s.trim());
    const mediaType = segments[0]?.toLowerCase() || '*/*';
    const [type = '*', subtype = '*'] = mediaType.split('/');

    let q = 1.0;
    const params = {};

    for (let i = 1; i < segments.length; i++) {
      const seg = segments[i];
      const equalIndex = seg.indexOf('=');
      if (equalIndex > 0) {
        const key = seg.slice(0, equalIndex).trim().toLowerCase();
        const value = seg.slice(equalIndex + 1).trim().replace(/^"(.*)"$/, '$1');
        if (key === 'q') {
          const parsedQ = parseFloat(value);
          if (!isNaN(parsedQ)) {
            q = Math.max(0, Math.min(1, parsedQ));
          }
        } else {
          params[key] = value;
        }
      }
    }

    if (q > 0) {
      entries.push({ mediaType, type, subtype, q, params });
    }
  }

  entries.sort((a, b) => {
    if (b.q !== a.q) return b.q - a.q;
    const scoreA = (a.type !== '*' ? 2 : 0) + (a.subtype !== '*' ? 1 : 0);
    const scoreB = (b.type !== '*' ? 2 : 0) + (b.subtype !== '*' ? 1 : 0);
    return scoreB - scoreA;
  });

  return entries;
}

function prefersMarkdown(acceptHeader) {
  if (!acceptHeader) return false;

  const entries = parseAcceptHeader(acceptHeader);
  if (entries.length === 0) return false;

  let markdownScore = -1;
  let htmlScore = -1;

  for (const entry of entries) {
    if (
      (entry.type === 'text' && entry.subtype === 'markdown') ||
      (entry.type === 'text' && entry.subtype === 'x-markdown')
    ) {
      if (markdownScore === -1) markdownScore = entry.q * 10 + 3;
    }
    if (entry.type === 'text' && entry.subtype === 'html') {
      if (htmlScore === -1) htmlScore = entry.q * 10 + 3;
    }
    if (entry.type === 'text' && entry.subtype === '*') {
      if (markdownScore === -1) markdownScore = entry.q * 10 + 2;
      if (htmlScore === -1) htmlScore = entry.q * 10 + 2;
    }
    if (entry.type === '*' && entry.subtype === '*') {
      if (markdownScore === -1) markdownScore = entry.q * 10 + 1;
      if (htmlScore === -1) htmlScore = entry.q * 10 + 1;
    }
  }

  if (markdownScore > 0) {
    return markdownScore > htmlScore;
  }

  return false;
}

async function runStaticOutputTests() {
  console.log('\n\x1b[1m=== 1. Testing Server-Rendered HTML & Technical SEO Artifacts ===\x1b[0m');

  const outDir = path.join(projectRoot, 'out');
  assert(fs.existsSync(outDir), 'out/ directory exists');

  // 1. Check out/index.html raw HTML
  const indexPath = path.join(outDir, 'index.html');
  assert(fs.existsSync(indexPath), 'out/index.html exists');
  const indexHtml = fs.readFileSync(indexPath, 'utf-8');

  assert(indexHtml.includes("Divyanshu Tiwari"), "Homepage raw HTML contains <h1>Hi, I'm Divyanshu Tiwari</h1> without JavaScript");
  assert((indexHtml.includes('Building in') || indexHtml.includes('Working in') || indexHtml.includes('working in')) && (indexHtml.includes('Data &amp; AI') || indexHtml.includes('Data & AI') || indexHtml.includes('Data Engineering')), 'Homepage raw HTML contains first bio paragraph');
  assert(indexHtml.includes('LLMs') && indexHtml.includes('RAG'), 'Homepage raw HTML contains LLM/RAG paragraph');
  
  // Character count check of meaningful text
  const rawTextWithoutTags = indexHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  assert(rawTextWithoutTags.length > 500, `Homepage raw text has ${rawTextWithoutTags.length} chars (exceeds 500 char requirement)`);

  // JSON-LD Person schema in HTML
  const jsonLdMatch = indexHtml.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert(jsonLdMatch !== null, 'Homepage raw HTML contains <script type="application/ld+json">');
  if (jsonLdMatch) {
    try {
      const parsedJsonLd = JSON.parse(jsonLdMatch[1]);
      assert(parsedJsonLd['@context'] === 'https://schema.org', 'JSON-LD @context is https://schema.org');
      assert(parsedJsonLd['@type'] === 'Person', 'JSON-LD @type is Person');
      assert(parsedJsonLd.name === 'Divyanshu Tiwari', 'JSON-LD name is Divyanshu Tiwari');
      assert(parsedJsonLd.url === 'https://datafolio.me/', 'JSON-LD url is https://datafolio.me/');
      assert(Array.isArray(parsedJsonLd.sameAs) && parsedJsonLd.sameAs.length >= 4, 'JSON-LD sameAs contains verified profile URLs');
    } catch (e) {
      assert(false, `Failed to parse JSON-LD: ${e.message}`);
    }
  }

  // Canonical and alternate markdown discovery link in HTML
  assert(indexHtml.includes('rel="canonical"') && indexHtml.includes('href="https://datafolio.me/"'), 'Homepage raw HTML contains canonical https://datafolio.me/');
  assert(indexHtml.includes('rel="alternate"') && indexHtml.includes('type="text/markdown"'), 'Homepage raw HTML contains <link rel="alternate" type="text/markdown">');

  // Open Graph & Twitter meta tags
  assert(indexHtml.includes('property="og:title"'), 'Homepage contains og:title');
  assert(indexHtml.includes('property="og:description"'), 'Homepage contains og:description');
  assert(indexHtml.includes('name="twitter:card"'), 'Homepage contains twitter:card');

  // 2. Check 404 Recovery page in out/404.html
  const notFoundPath = path.join(outDir, '404.html');
  assert(fs.existsSync(notFoundPath), 'out/404.html exists');
  const notFoundHtml = fs.readFileSync(notFoundPath, 'utf-8');
  assert(notFoundHtml.includes('This page could not be found') || notFoundHtml.includes('404'), '404 page contains 404 heading');
  assert(notFoundHtml.includes('href="/"') || notFoundHtml.includes('href="/projects"'), '404 page contains recovery links to sections');
  assert(notFoundHtml.includes('/sitemap.xml'), '404 page contains recovery link to /sitemap.xml');
  assert(notFoundHtml.includes('/llms.txt'), '404 page contains recovery link to /llms.txt');

  // 3. Check out/projects/index.html
  const projectsHtmlPath = path.join(outDir, 'projects', 'index.html');
  if (fs.existsSync(projectsHtmlPath)) {
    const projectsHtml = fs.readFileSync(projectsHtmlPath, 'utf-8');
    assert(projectsHtml.includes('BreadcrumbList'), 'Projects page contains BreadcrumbList structured data');
    assert(projectsHtml.includes('<h1') && projectsHtml.includes('Projects</h1>'), 'Projects page contains semantic <h1>Projects</h1>');
  }

  // 4. Check out/experience/index.html
  const expHtmlPath = path.join(outDir, 'experience', 'index.html');
  if (fs.existsSync(expHtmlPath)) {
    const expHtml = fs.readFileSync(expHtmlPath, 'utf-8');
    assert(expHtml.includes('BreadcrumbList'), 'Experience page contains BreadcrumbList structured data');
    assert(expHtml.includes('<h1') && expHtml.includes('Experience</h1>'), 'Experience page contains semantic <h1>Experience</h1>');
  }

  // 5. Check out/code/index.html
  const codeHtmlPath = path.join(outDir, 'code', 'index.html');
  if (fs.existsSync(codeHtmlPath)) {
    const codeHtml = fs.readFileSync(codeHtmlPath, 'utf-8');
    assert(codeHtml.includes('BreadcrumbList'), 'Code page contains BreadcrumbList structured data');
    assert(codeHtml.includes('<h1') && codeHtml.includes('Code</h1>'), 'Code page contains semantic <h1>Code</h1>');
  }

  // 6. Check out/blog/index.html
  const blogHtmlPath = path.join(outDir, 'blog', 'index.html');
  if (fs.existsSync(blogHtmlPath)) {
    const blogHtml = fs.readFileSync(blogHtmlPath, 'utf-8');
    assert(blogHtml.includes('BreadcrumbList'), 'Blog page contains BreadcrumbList structured data');
    assert(blogHtml.includes('<h1') && blogHtml.includes('Blog</h1>'), 'Blog page contains semantic <h1>Blog</h1>');
  }

  // 7. Check out/llms.txt
  const llmsTxtPath = path.join(outDir, 'llms.txt');
  const publicLlmsTxtPath = path.join(projectRoot, 'public', 'llms.txt');
  const hasLlms = fs.existsSync(llmsTxtPath) || fs.existsSync(publicLlmsTxtPath);
  assert(hasLlms, 'llms.txt exists in build / public directory');
  const llmsContent = fs.readFileSync(fs.existsSync(llmsTxtPath) ? llmsTxtPath : publicLlmsTxtPath, 'utf-8');
  assert(llmsContent.includes('# Divyanshu Tiwari'), 'llms.txt contains # Divyanshu Tiwari heading');
  assert(llmsContent.includes('## Projects'), 'llms.txt contains Projects section');
  assert(llmsContent.includes('## Experience'), 'llms.txt contains Experience section');
  assert(llmsContent.includes('## Code'), 'llms.txt contains Code section');

  // 8. Check out/sitemap.xml
  const sitemapPath = path.join(outDir, 'sitemap.xml');
  const publicSitemapPath = path.join(projectRoot, 'public', 'sitemap.xml');
  const hasSitemap = fs.existsSync(sitemapPath) || fs.existsSync(publicSitemapPath);
  assert(hasSitemap, 'sitemap.xml exists in build / public directory');
  const sitemapContent = fs.readFileSync(fs.existsSync(sitemapPath) ? sitemapPath : publicSitemapPath, 'utf-8');
  assert(sitemapContent.includes('https://datafolio.me/'), 'sitemap.xml contains https://datafolio.me/');
  assert(sitemapContent.includes('https://datafolio.me/projects'), 'sitemap.xml contains projects page');
  assert(sitemapContent.includes('https://datafolio.me/experience'), 'sitemap.xml contains experience page');
  assert(sitemapContent.includes('https://datafolio.me/code'), 'sitemap.xml contains code page');
  assert(sitemapContent.includes('https://datafolio.me/blog'), 'sitemap.xml contains blog page');

  // 9. Check out/robots.txt
  const robotsPath = path.join(outDir, 'robots.txt');
  const publicRobotsPath = path.join(projectRoot, 'public', 'robots.txt');
  const hasRobots = fs.existsSync(robotsPath) || fs.existsSync(publicRobotsPath);
  assert(hasRobots, 'robots.txt exists in build / public directory');
  const robotsContent = fs.readFileSync(fs.existsSync(robotsPath) ? robotsPath : publicRobotsPath, 'utf-8');
  assert(/User-agent:\s*\*/i.test(robotsContent), 'robots.txt contains User-agent: *');
  assert(/Allow:\s*\//i.test(robotsContent), 'robots.txt allows public indexing');
  assert(robotsContent.includes('Sitemap: https://datafolio.me/sitemap.xml'), 'robots.txt references sitemap.xml');
}

function runAcceptParserUnitTests() {
  console.log('\n\x1b[1m=== 2. Testing RFC Accept Header Parser & Content Negotiation Logic ===\x1b[0m');

  // Case 1: Simple text/markdown
  assert(prefersMarkdown('text/markdown') === true, 'Accept: text/markdown -> returns true');

  // Case 2: Simple text/html
  assert(prefersMarkdown('text/html') === false, 'Accept: text/html -> returns false');

  // Case 3: Standard browser accept header
  const browserAccept = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';
  assert(prefersMarkdown(browserAccept) === false, 'Browser Accept header -> returns false (HTML)');

  // Case 4: Weighted markdown higher than html
  const markdownPreferred = 'text/markdown;q=0.9, text/html;q=0.8, */*;q=0.5';
  assert(prefersMarkdown(markdownPreferred) === true, 'Accept: text/markdown;q=0.9, text/html;q=0.8 -> returns true (Markdown)');

  // Case 5: Weighted html higher than markdown
  const htmlPreferred = 'text/html;q=0.9, text/markdown;q=0.8, */*;q=0.5';
  assert(prefersMarkdown(htmlPreferred) === false, 'Accept: text/html;q=0.9, text/markdown;q=0.8 -> returns false (HTML)');

  // Case 6: Markdown explicitly rejected with q=0
  const markdownRejected = 'text/markdown;q=0, text/html;q=0.9';
  assert(prefersMarkdown(markdownRejected) === false, 'Accept: text/markdown;q=0, text/html -> returns false (HTML)');

  // Case 7: Null / Empty
  assert(prefersMarkdown(null) === false, 'Accept: null -> returns false');
  assert(prefersMarkdown('') === false, 'Accept: "" -> returns false');

  // Case 8: Quality parsing
  const parsed = parseAcceptHeader('text/markdown;q=0.7, text/html;q=0.9');
  assert(parsed.length === 2 && parsed[0].type === 'text' && parsed[0].subtype === 'html', 'parseAcceptHeader correctly sorts by q descending');
}

async function main() {
  console.log('Running Technical SEO & Agent-Readiness Test Suite...\n');
  runAcceptParserUnitTests();
  await runStaticOutputTests();

  console.log('\n========================================');
  console.log(`Results: ${passedTests} passed, ${failedTests} failed, ${totalTests} total`);
  console.log('========================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test suite failure:', err);
  process.exit(1);
});
