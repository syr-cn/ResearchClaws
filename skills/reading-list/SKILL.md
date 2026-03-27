---
name: reading-list
description: >
  Manage a personal reading list with kanban-style statuses and HTML dashboard. Use when user says: 我的论文列表, reading list, 加入待读, 标记已读, 移除.
---

# Reading List — Paper Management

## ⚙️ Step 0 — Read the Research Profile (Always First)

Before running **any** capability, load the user's research profile.

**Location:** `~/.openclaw/workspace/research-claw-config.md`

If this file does not exist, use these **defaults** silently and mention at the end:
> 💡 想定制推荐兴趣？试试说「更新我的研究画像」

```yaml
# Default profile (used when no config found)
research_direction: "Large language models, reinforcement learning, agentic AI"
seed_papers: []
keywords:
  - large language models
  - reinforcement learning
  - agentic AI / AI agents
  - retrieval-augmented generation
  - multimodal models
whitelist_authors: []
learned_preferences:
  accept: []
  reject: []
```

**Config fields reference:**
- `research_direction` — free-text description of the user's research focus
- `seed_papers` — list of arXiv IDs the user considers gold-standard references
- `keywords` — interest topics used for Paper Scout search queries
- `whitelist_authors` — researcher names to prioritize in recommendations
- `learned_preferences.accept` — keywords/topics user has explicitly liked
- `learned_preferences.reject` — keywords/topics user has skipped or disliked

---

---

**Goal:** Maintain a personal reading list with three statuses. Regenerate the HTML dashboard on every change.

**Triggers:** `我的论文列表` · `reading list` · `加入待读 [link]` · `标记已读 [paper]` · `移除 [paper]`

### Data file

Maintain a JSON or YAML data file at:
```
~/.openclaw/workspace/research-claw-reading-list.json
```

Schema (JSON):
```json
{
  "last_updated": "2026-03-26",
  "papers": [
    {
      "arxiv_id": "2503.19823",
      "title": "AutoRefine: Search and Refine During Think",
      "authors": "Shi et al.",
      "date_added": "2026-03-26",
      "status": "to_read",
      "score": 4.5,
      "tags": ["LLM Reasoning", "RAG"],
      "note_link": "research-claw-output/2503.19823.html"
    }
  ]
}
```

Status values: `"to_read"` · `"reading"` · `"done"`

### Operations

**View list** (`我的论文列表` / `reading list`):
- Load the JSON, count per-status, regenerate the HTML dashboard (Step 3 below), report a text summary in chat.

**Add paper** (`加入待读 [arXiv link or ID]`):
1. Extract arXiv ID from the link
2. Fetch title + authors from `https://arxiv.org/abs/{ID}`
3. Append new entry with `status: "to_read"`, today's date
4. Save JSON, regenerate HTML dashboard
5. Reply: `✅ 已加入待读：**{TITLE}** | 共 {N} 篇待读`

**Update status** (`标记已读 [paper title keyword or arXiv ID]`):
1. Find the matching entry (fuzzy title match or exact arXiv ID)
2. Set `status: "done"`, update `last_updated`
3. Save JSON, regenerate HTML
4. Reply: `✅ 已标记为已读：**{TITLE}**`

**Remove paper** (`移除 [paper title keyword or arXiv ID]`):
1. Find matching entry
2. Remove from array
3. Save JSON, regenerate HTML
4. Reply: `🗑️ 已移除：**{TITLE}**`

**Mark as reading** (`开始阅读 [paper]`):
1. Find entry, set `status: "reading"`
2. Save JSON, regenerate HTML

### Regenerate HTML dashboard

**Template location:** `{SKILL_DIR}/templates/reading-list.html`

1. Load the template with `read`
2. Compute counts: `TOTAL_PAPERS`, `TOREAD_COUNT`, `READING_COUNT`, `DONE_COUNT`
3. Also compute `WEEK_COUNT` — papers added in the last 7 days
4. Set `LAST_UPDATED` to today's date
5. For each paper in each status group, replace numbered placeholders:
   - To-Read papers: `{{PAPER_TITLE_1}}`, `{{AUTHORS_1}}`, `{{DATE_ADDED_1}}`, `{{SCORE_1}}`, `{{TAG_1A}}`, `{{TAG_1B}}`, `{{NOTE_LINK_1}}`, etc.
   - Reading papers: `{{PAPER_TITLE_R1}}`, `{{AUTHORS_R1}}`, `{{DATE_R1}}`, `{{SCORE_R1}}`, `{{TAG_R1A}}`, `{{TAG_R1B}}`, `{{NOTE_LINK_R1}}`, etc.
   - Done papers: `{{PAPER_TITLE_D1}}`, `{{AUTHORS_D1}}`, `{{DATE_D1}}`, `{{SCORE_D1}}`, `{{TAG_D1A}}`, `{{TAG_D1B}}`, `{{NOTE_LINK_D1}}`, etc.

   **Note:** The template has slots for a fixed number of papers per section. If the list has more papers than template slots, include all papers by duplicating the entry HTML pattern — copy the last entry block and append it before the section's closing tag.

6. Save filled HTML to `~/.openclaw/workspace/research-claw-output/reading-list.html`
7. Report: `📋 阅读列表已更新 → ~/.openclaw/workspace/research-claw-output/reading-list.html`

---

---

## ⚠️ Error Handling

| Error | Handling |
|---|---|
| arXiv API returns empty results | Retry once with broader query; if still empty, note "arXiv API temporarily unavailable" |
| PDF tool times out | Fall back to abstract-only mode; note `[Abstract only — PDF timeout]` in the note |
| PDF tool returns error for a paper | Try fetching `https://ar5iv.labs.arxiv.org/html/{ARXIV_ID}` as HTML fallback |
| Config file missing | Use defaults silently; add a note at end: "💡 想定制？说「更新我的研究画像」" |
| Reading list JSON missing or malformed | Start fresh with an empty list; inform user: "未找到现有列表，已新建空列表" |
| Template file not found | Report the expected path and ask user to check installation |
| No papers in last 3 days | Extend to 7 days, note it: "（近3天论文较少，已扩展至7天）" |
| Fewer than 3 read papers for Idea Generator | Proceed anyway, but note the limitation |
| User provides PDF/DOI instead of arXiv | Try to extract arXiv ID from DOI or search arXiv by title |

---


---

## 🛠️ HTML Template Usage — General Guide

This section applies to Capabilities 2, 3, and 4.

### Finding the skill directory

The skill directory (where templates live) is the folder containing this SKILL.md file.
Typical path: `~/.openclaw/skills/research-claw/`
Templates are at: `~/.openclaw/skills/research-claw/templates/`

If you cannot determine the skill directory, use `exec` to find it:
```bash
find ~/.openclaw/skills -name "paper-note.html" 2>/dev/null | head -1
```

### Output directory

Default: `~/.openclaw/workspace/research-claw-output/`

Create if needed:
```bash
mkdir -p ~/.openclaw/workspace/research-claw-output
```

The user can override the output directory by setting `output_dir` in their config.

### Filling placeholders

1. Load template with `read` tool
2. In your reasoning, create a complete mapping of `{{PLACEHOLDER}}` → value
3. Perform a full string replacement for every placeholder
4. If a placeholder has no content (e.g., no code URL), use a sensible default:
   - URLs: `#`
   - Text: `N/A` or an empty string
   - Counts: `0`
5. Write the result with `write` tool

**Never leave unfilled `{{PLACEHOLDER}}` tags in the output HTML.**

---

