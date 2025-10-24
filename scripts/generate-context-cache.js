// Simple generator to create TL;DR cache files for meta-specs and placeholders
// Reads meta_specs_path from ai.properties.md and writes TL;DR files under temp/context-cache

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const AI_PROPERTIES = path.join(ROOT, 'ai.properties.md');
const CACHE_DIR = path.join(ROOT, 'temp', 'context-cache');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function readAiProperties() {
  if (!fs.existsSync(AI_PROPERTIES)) return {};
  const lines = fs.readFileSync(AI_PROPERTIES, 'utf8').split(/\r?\n/);
  const props = {};
  for (const line of lines) {
    const idx = line.indexOf('=');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      props[key] = value;
    }
  }
  return props;
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function computeHash(content) {
  return crypto.createHash('md5').update(content, 'utf8').digest('hex');
}

function extractTldr(markdown, opts = {}) {
  const maxItems = opts.maxItems ?? 10;
  const lines = markdown.split(/\r?\n/);
  const bullets = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) {
      const title = trimmed.replace(/^#+\s*/, '').trim();
      if (title) bullets.push(`- ${title}`);
    }
    if (bullets.length >= maxItems) break;
  }
  if (bullets.length === 0) {
    const firstLines = lines
      .filter((l) => l.trim())
      .slice(0, maxItems)
      .map((l) => `- ${l.trim()}`);
    bullets.push(...firstLines);
  }
  return bullets.join('\n');
}

function writeCacheFile(name, content, meta = {}) {
  ensureDir(CACHE_DIR);
  const outPath = path.join(CACHE_DIR, name);
  const header =
    `<!-- generated: ${new Date().toISOString()} -->\n` +
    `<!-- sourceHash: ${meta.sourceHash ?? ''} -->\n` +
    `<!-- source: ${meta.source ?? ''} -->\n`;
  fs.writeFileSync(outPath, header + '\n' + content + '\n', 'utf8');
  return outPath;
}

function updateCacheIndex(indexEntry) {
  ensureDir(CACHE_DIR);
  const indexPath = path.join(CACHE_DIR, 'cache-index.json');
  let index = {};
  if (fs.existsSync(indexPath)) {
    try {
      index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    } catch {
      index = {};
    }
  }
  index[indexEntry.key] = {
    updatedAt: new Date().toISOString(),
    source: indexEntry.source,
    sourceHash: indexEntry.sourceHash,
    output: indexEntry.output,
  };
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');
}

function main() {
  const props = readAiProperties();
  const metaSpecsPath = props.meta_specs_path;

  ensureDir(CACHE_DIR);

  // TL;DR for code-standards index
  if (metaSpecsPath) {
    const codeStandardsIndex = path.join(metaSpecsPath, 'technical', 'code-standards', 'index.md');
    const frontendArchIndex = path.join(
      metaSpecsPath,
      'technical',
      'frontend-architecture',
      'index.md'
    );

    const csContent = readFileSafe(codeStandardsIndex);
    if (csContent) {
      const csHash = computeHash(csContent);
      const csTldr = extractTldr(csContent);
      const csOut = writeCacheFile('code-standards.tldr.md', csTldr, {
        source: codeStandardsIndex,
        sourceHash: csHash,
      });
      updateCacheIndex({
        key: 'code-standards',
        source: codeStandardsIndex,
        sourceHash: csHash,
        output: csOut,
      });
    }

    const faContent = readFileSafe(frontendArchIndex);
    if (faContent) {
      const faHash = computeHash(faContent);
      const faTldr = extractTldr(faContent);
      const faOut = writeCacheFile('frontend-architecture.tldr.md', faTldr, {
        source: frontendArchIndex,
        sourceHash: faHash,
      });
      updateCacheIndex({
        key: 'frontend-architecture',
        source: frontendArchIndex,
        sourceHash: faHash,
        output: faOut,
      });
    }
  }

  // Placeholder for Angular best practices TL;DR (to be refreshed by assistant via MCP)
  const abpName = 'angular-best-practices.tldr.md';
  const abpPath = path.join(CACHE_DIR, abpName);
  if (!fs.existsSync(abpPath)) {
    writeCacheFile(abpName, '- Placeholder: atualize via MCP angular-cli (best practices).', {
      source: 'mcp_angular_cli_get_best_practices',
      sourceHash: 'n/a',
    });
    updateCacheIndex({
      key: 'angular-best-practices',
      source: 'mcp_angular_cli_get_best_practices',
      sourceHash: 'n/a',
      output: abpPath,
    });
  }
}

main();
