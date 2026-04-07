#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// ─── CLI ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: node md2html.js <input.md> [output.html]');
  process.exit(1);
}
const inputPath = path.resolve(args[0]);
const outputPath = args[1]
  ? path.resolve(args[1])
  : inputPath.replace(/\.md$/i, '.html');

const md = fs.readFileSync(inputPath, 'utf-8');

// ─── Inline Markdown helpers ───────────────────────────────────────
function inlineMd(text) {
  if (!text) return '';
  let s = text;
  // images
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" style="max-width:100%;border-radius:8px;">');
  // links
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:var(--accent4);text-decoration:underline;">$1</a>');
  // bold + italic
  s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  // bold
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // italic
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // inline code
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  return s;
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
