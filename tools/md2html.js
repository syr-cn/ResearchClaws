#!/usr/bin/env node
// md2html.js - Convert markdown paper reading notes to HTML
// Usage: node md2html.js <input.md> [output.html]
const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2];
if (!inputPath) { console.error('Usage: node md2html.js <input.md> [output.html]'); process.exit(1); }
const outputPath = process.argv[3] || inputPath.replace(/\.md$/i, '.html');
const md = fs.readFileSync(inputPath, 'utf-8');
const cssPath = path.join(__dirname, 'note-style.css');
const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf-8') : '';

// ── Inline markdown helpers ──
function inlineMd(s) {
  if (!s) return '';
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" style="max-width:100%;border-radius:12px;">');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:var(--accent4);text-decoration:underline dotted;">$1</a>');
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  return s;
}

// ── Parse metadata from section 0 ──
function parseMeta(block) {
  const m = {};
  const get = (key) => { const r = new RegExp(`\\*\\*${key}:\\*\\*\\s*(.+)`, 'i'); const x = block.match(r); return x ? x[1].trim() : ''; };
  m.title = get('Title');
  m.alias = get('Alias');
  m.authors = get('Authors / Org') || get('Authors');
  m.venue = get('Venue / Status') || get('Venue');
  m.date = get('Date');
  m.tags = get('Tags');
  m.rating = get('My rating');
  m.scoring = get('Scoring \\(1\\+2\\+2\\)') || get('Scoring');
  m.readDepth = get('Read depth');
  // parse links
  m.links = {};
  const linkRe = /- (Abs|HTML|PDF|Code|HF|Checkpoint):\s*(https?:\/\/\S+)/gi;
  let lm; while ((lm = linkRe.exec(block)) !== null) { m.links[lm[1].toLowerCase()] = lm[2]; }
  return m;
}
