// ─── Split document into sections ──────────────────────────────────
function splitSections(md) {
  // Split on ## headers (level 2)
  const sections = [];
  const lines = md.split('\n');
  let current = null;

  for (const line of lines) {
    const hMatch = line.match(/^##\s+(\d+\))\s*(.*)/);
    if (hMatch) {
      if (current) sections.push(current);
      current = { num: hMatch[1], title: hMatch[2].trim(), body: '' };
      continue;
    }
    // Also match ## without number prefix (like "## 0) Metadata")
    const hMatch2 = line.match(/^##\s+(.*)/);
    if (hMatch2 && !current) {
      // top-level title before any numbered section
      current = { num: '0)', title: hMatch2[1].trim(), body: '' };
      continue;
    }
    if (hMatch2 && current) {
      sections.push(current);
      current = { num: '', title: hMatch2[1].trim(), body: '' };
      continue;
    }
    if (current) {
      current.body += line + '\n';
    }
  }
  if (current) sections.push(current);
  return sections;
}

// ─── Parse CRGP from section body ──────────────────────────────────
function parseCRGP(body) {
  const parts = { C: '', R: '', G: '', P: '' };
  const regex = /###\s+([CRGP])\s*[—–-]+\s*(.*?)(?=###\s+[CRGP]\s*[—–-]|$)/gs;
  let m;
  while ((m = regex.exec(body)) !== null) {
    const key = m[1];
    const content = m[2].trim();
    if (parts.hasOwnProperty(key)) {
      parts[key] = content;
    }
  }
  // If regex didn't work well, try line-based parsing
  if (!parts.C && !parts.R && !parts.G && !parts.P) {
    const lines = body.split('\n');
    let currentKey = null;
    for (const line of lines) {
      const hm = line.match(/###\s+([CRGP])\s*[—–-]/);
      if (hm) {
        currentKey = hm[1];
        continue;
      }
      if (currentKey && parts.hasOwnProperty(currentKey)) {
        parts[currentKey] += line + '\n';
      }
    }
    for (const k of Object.keys(parts)) {
      parts[k] = parts[k].trim();
    }
  }
  return parts;
}
