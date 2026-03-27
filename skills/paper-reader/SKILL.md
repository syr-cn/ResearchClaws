---
name: paper-reader
description: >
  Deep-read an arXiv paper and generate structured CRGP reading notes as HTML. Use when user says: 帮我读一下, DNL, 论文速读, paper notes, or sends an arXiv link.
---

# Paper Reader — Deep Reading Notes

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

**Goal:** Given an arXiv paper, produce a structured reading note as both a chat summary **and** a saved HTML page.

**Triggers:** arXiv link in message · `帮我读一下` · `DNL` · `论文速读`

### Step 1 — Extract arXiv ID

Recognize these patterns:
- `https://arxiv.org/abs/2503.XXXXX` → ID = `2503.XXXXX`
- `https://arxiv.org/pdf/2503.XXXXX` → ID = `2503.XXXXX`
- `https://arxiv.org/pdf/2503.XXXXX.pdf` → ID = `2503.XXXXX`
- Bare ID: `2503.XXXXX`

### Step 2 — Fetch metadata

```
web_fetch: https://arxiv.org/abs/{ARXIV_ID}
```

Extract: full title, all authors (first 3 + "et al." if more), publication year, abstract, subject categories.

Also try to find venue (conference/journal) if mentioned in the page.

### Step 3 — Analyze the PDF

```
pdf: https://arxiv.org/pdf/{ARXIV_ID}
prompt: |
  Carefully read this paper and extract using the CRGP framework:

  ## CRGP Introduction Analysis:
  1. CONTEXT: What is the research background? What broader problem does this paper sit in? (2-3 sentences)
  2. RELATED_WORK: What are the main prior approaches? Group them by methodology line. (bullet list)
  3. GAP: What specific limitation or gap in existing work does this paper identify? (2-3 sentences)
  4. PROPOSAL: What is the proposed solution? What is the key insight? (2-3 sentences)

  ## Core Content:
  5. TLDR: One-sentence summary capturing the paper's core contribution.
  6. METHOD_OVERVIEW: High-level description of the proposed method/approach. (2-3 sentences)
  7. METHOD_STEP_1/2/3: Three concrete technical steps or components of the method. Be specific about mechanism, not vague.
  8. FIGURES: List the key figures/tables in the paper. For each: figure number + what it shows + key takeaway. Try to find figure URLs from arxiv HTML version (https://arxiv.org/html/{ARXIV_ID}v1/x{N}.png).
  9. RESULTS_OVERVIEW: Summary of main experimental findings with SPECIFIC NUMBERS. (2-3 sentences)
  10. METRIC_1/2/3: Three specific quantitative results (metric name + value + benchmark).
  11. KEY_FINDINGS: 2-3 important findings from analysis/ablation experiments. For each: phenomenon + explanation + significance.
  12. LIMITATION_1/2/3: Three honest limitations (from paper or your analysis).
  13. TAKEAWAY: The single most important insight. Not a summary — what should a researcher REMEMBER?
  14. TAG_1/2/3, TOPIC_TAG, CODE_URL, RELEVANCE_SCORE (same as before)
```

**Fallback:** If `pdf` tool times out or returns an error, use `web_fetch` on the abstract page only, and note `[PDF not analyzed — abstract only]` in the note.

For very long papers (>50 pages), instruct the PDF tool to focus on: Abstract, Introduction, Method section, Results tables, Conclusion.

### Step 4 — Output text summary in chat

```
📝 论文速读 | Paper Quick Notes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 **{TITLE}**
👤 {AUTHORS} | 📅 {YEAR} | 📍 {VENUE or "arXiv preprint"}
🔗 https://arxiv.org/abs/{ARXIV_ID}
🏷️ {TAG_1} · {TAG_2} · {TAG_3}

📖 **CRGP 分析**
🔹 **Context**: {CONTEXT}
🔹 **Related Work**: {RELATED_WORK — brief}
🔹 **Gap**: {GAP}
🔹 **Proposal**: {PROPOSAL}

⚙️ **方法**
{METHOD_OVERVIEW}

📊 **实验结果**
{RESULTS_OVERVIEW}
• {METRIC_1_NAME}: {METRIC_1_VAL}
• {METRIC_2_NAME}: {METRIC_2_VAL}
• {METRIC_3_NAME}: {METRIC_3_VAL}

⚠️ **局限性**
• {LIMITATION_1}
• {LIMITATION_2}

✨ **核心洞察**
{TAKEAWAY}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 HTML笔记已保存 → {OUTPUT_PATH}
📋 加入待读？说 "加入待读 https://arxiv.org/abs/{ARXIV_ID}"
```

### Step 5 — Generate HTML note from template

**Output directory (default):** `~/.openclaw/workspace/research-claw-output/`
Create this directory if it doesn't exist.

**Filename:** `{ARXIV_ID}.html` (e.g., `2503.19823.html`)

**Template location:** `{SKILL_DIR}/templates/paper-note.html`
where `{SKILL_DIR}` is the directory where this SKILL.md lives (e.g., `~/.openclaw/skills/research-claw/`).

**Procedure:**
1. Use `read` to load the template: `{SKILL_DIR}/templates/paper-note.html`
2. Replace **every** `{{PLACEHOLDER}}` with the extracted content:

| Placeholder | Content |
|---|---|
| `{{TITLE}}` | Full paper title |
| `{{FIRST_AUTHOR}}` | First author's name |
| `{{AUTHOR_SUFFIX}}` | "et al." if >1 author, else "" |
| `{{YEAR}}` | Publication year (e.g., "2025") |
| `{{ARXIV_ID}}` | arXiv ID (e.g., "2503.19823") |
| `{{VENUE}}` | Conference/journal or "arXiv preprint" |
| `{{DATE}}` | Today's date (YYYY-MM-DD) |
| `{{TOPIC_TAG}}` | Primary category (e.g., "cs.LG") |
| `{{TAG_1}}`, `{{TAG_2}}`, `{{TAG_3}}` | Topic tags |
| `{{TLDR}}` | One-sentence summary |
| `{{MOTIVATION}}` | 研究动机段落（由 CRGP 的 Context + Gap 综合生成） |
| `{{CONTEXT}}` | CRGP — 研究背景 |
| `{{RELATED_WORK}}` | CRGP — 相关工作概述 |
| `{{GAP}}` | CRGP — 现有方法的不足 |
| `{{PROPOSAL}}` | CRGP — 本文方案 |
| `{{METHOD_OVERVIEW}}` | 方法高层描述 |
| `{{METHOD_STEP_1}}`, `{{METHOD_STEP_2}}`, `{{METHOD_STEP_3}}` | Three method steps |
| `{{RESULTS_OVERVIEW}}` | 实验结果总结 |
| `{{METRIC_1_NAME}}`, `{{METRIC_1_VAL}}` | First metric name + value |
| `{{METRIC_2_NAME}}`, `{{METRIC_2_VAL}}` | Second metric name + value |
| `{{METRIC_3_NAME}}`, `{{METRIC_3_VAL}}` | Third metric name + value |
| `{{LIMITATION_1}}`, `{{LIMITATION_2}}`, `{{LIMITATION_3}}` | Three limitations |
| `{{TAKEAWAY}}` | One-line takeaway |
| `{{CODE_URL}}` | GitHub URL or `#` if unavailable |
| `{{RELEVANCE_SCORE}}` | Score 1–5 as a number |

3. Use `write` to save the filled HTML to `{OUTPUT_DIR}/{ARXIV_ID}.html`
4. Report the saved path in the chat output

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

