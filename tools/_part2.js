// ─── Parse metadata (Section 0) ────────────────────────────────────
function parseMetadata(text) {
  const meta = {};
  const lines = text.split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*-\s+\*\*(.+?)\*\*(?:\s*[:：]\s*)(.*)/);
    if (m) {
      const key = m[1].trim().toLowerCase();
      const val = m[2].trim();
      if (key === 'title') meta.title = val;
      else if (key === 'alias') meta.alias = val;
      else if (key.startsWith('author')) meta.authors = val;
      else if (key.startsWith('venue')) meta.venue = val;
      else if (key === 'date') meta.date = val;
      else if (key === 'tags') meta.tags = val.split(/[,，]/).map(t => t.trim()).filter(Boolean);
      else if (key.startsWith('my rating') || key === 'rating') meta.rating = val;
      else if (key.startsWith('read depth')) meta.readDepth = val;
      else if (key.startsWith('scoring')) meta.scoring = val;
    }
    // links sub-items
    const linkM = line.match(/^\s*-\s+(Abs|HTML|PDF|Code|Checkpoints?|HF)\s*[:：]\s*(.*)/i);
    if (linkM) {
      if (!meta.links) meta.links = {};
      meta.links[linkM[1].toLowerCase()] = linkM[2].trim();
    }
  }
  return meta;
}
