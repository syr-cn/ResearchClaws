---
name: paper-reader
description: >
  Deep-read an arXiv paper and generate structured DNL (Deep Note & List) reading notes.
  Default output: markdown DNL file (low token cost, git-friendly).
  Optional: HTML page from template.
  Trigger: 帮我读一下, DNL, 论文速读, paper notes, or an arXiv link.
---

# Paper Reader — Deep Reading Notes (v3.1)

## Overview

Given an arXiv paper, produce a **structured DNL reading note** as a markdown file.
Optionally generate an HTML page from the paper-note template.

**Default output format: Markdown DNL** (saves tokens, git-friendly, composable).
**HTML output:** Add `--html` or say `生成 HTML` to also produce an HTML page.

**Triggers:** arXiv link · `帮我读一下` · `DNL` · `论文速读` · `paper notes`

---

## Step 0 — Load Research Profile (Always First)

Before running, load: `~/.openclaw/workspace/research-claw-config.md`

If missing, use defaults silently and mention at the end:
> Want to customize? Say "更新我的研究画像"

---

## Step 1 — Extract arXiv ID

Recognize patterns:
- `https://arxiv.org/abs/2503.XXXXX` → `2503.XXXXX`
- `https://arxiv.org/pdf/2503.XXXXX` → `2503.XXXXX`
- `https://arxiv.org/pdf/2503.XXXXX.pdf` → `2503.XXXXX`
- Bare ID: `2503.XXXXX`

---

## Step 2 — Fetch Metadata

```
web_fetch: https://arxiv.org/abs/{ARXIV_ID}
```

Extract: title, authors, year, abstract, subject categories, venue if mentioned.
Also fetch HTML version for figures: `https://arxiv.org/html/{ARXIV_ID}v1`

---## Step 3 — Analyze Paper Content

Use `web_fetch` on the HTML version for structured content extraction.
Focus on: Abstract, Introduction, Method, Experiments (tables/numbers), Conclusion.

Extract using the **DNL 7-section framework**:

| Section | What to extract |
|---------|----------------|
| 0) Metadata | Title, alias, authors, venue, date, links, tags, rating, scoring breakdown |
| 1) Why-read | One-sentence: key claim + key observation |
| 2) CRGP | Context, Related work, Gap, Proposal — from Introduction |
| 3) Figures | Key figures with URLs from arxiv HTML + one-line descriptions |
| 4) Experiments | Main results table, ablation highlights, limitations |
| 5) Why it matters | Research insights for the reader's own work (2-4 bullets) |
| 6) Next steps | Actionable follow-up items as checkboxes |
| 7) Scoring | Rating breakdown explanation |

### Scoring System

**Base score:** 1 (any complete paper with benchmarks)

**Quality bonus (0-2):**
- +1: Solid experiments with proper ablation
- +2: Strong ablation + SOTA results + novel methodology

**Observation bonus (0-2):**
- +1: Finding directly relevant to reader's research
- +2: Paradigm-shifting insight for the field

**Final = Base + Quality + Observation** (max 5/5)

---## Step 4 — Write Markdown DNL File

**Output directory:** Same repo as reading notes (e.g., `papers/` directory).
**Filename:** `YYYY-MM-DD_{alias}.md` (e.g., `2026-04-01_gems.md`)

### Markdown DNL Template

```markdown
# DNL Deep Note — {ALIAS}

## 0) Metadata
- **Title:** {FULL_TITLE}
- **Alias:** {ALIAS}
- **Authors / Org:** {AUTHORS} ({INSTITUTIONS})
- **Venue / Status:** {VENUE_OR_ARXIV_ID} ({STATUS})
- **Date:** {PAPER_DATE}
- **Links:**
  - Abs: https://arxiv.org/abs/{ARXIV_ID}
  - HTML: https://arxiv.org/html/{ARXIV_ID}v1
  - PDF: https://arxiv.org/pdf/{ARXIV_ID}
  - Code: {CODE_URL_OR_PROJECT_PAGE}
- **Tags:** {comma-separated tags}
- **My rating:** {STARS} ({N}/5)
- **Read depth:** deep
- **Scoring ({BREAKDOWN}):** {EXPLANATION} = **{N}/5**

---

## 1) 一句话 Why-read
- **Key claim/contribution + key observation：** {ONE_PARAGRAPH}

---

## 2) CRGP 拆解 Introduction
### C — Context
{2-3 sentences on research background}

### R — Related work
{Bullet list grouped by methodology line}

### G — Gap
{2-3 sentences on specific limitations}

### P — Proposal
{2-3 sentences on proposed solution + key insight}

---

## 3) Figure 区
{For each key figure:}
- 图N（{description}）：
![figN]({arxiv_html_figure_url})
  {One-line interpretation}

---

## 4) Experiments — Key Numbers

### Main Results
| Benchmark | Metric | This Work | Best Baseline | Delta |
|-----------|--------|-----------|---------------|-------|
| ... | ... | ... | ... | ... |

### Ablation
{Key ablation findings with numbers}

### Limitations
{2-3 honest limitations}

---

## 5) Why it matters — 对我研究的启发
{2-4 numbered insights connecting to reader's research}

## 6) Actionable next step
- [ ] {Follow-up item 1}
- [ ] {Follow-up item 2}
- [ ] {Follow-up item 3}

## 7) 评分解释
**{N}/5（{BREAKDOWN}）**
{Bullet explanation for each component}
```

### Key rules for markdown DNL:
1. **Use real numbers** — never write "XX" or placeholders
2. **Figures must have URLs** from arxiv HTML version when available
3. **Tables use pipe format** — compatible with GitHub/Obsidian
4. **Chinese + English mixed** — technical terms in English, analysis in Chinese
5. **Scoring breakdown must be explicit** — show the math

---## Step 5 — Output Chat Summary

After writing the markdown file, output a brief summary in chat:

```
📝 DNL 完成 | {ALIAS}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 **{TITLE}**
👤 {AUTHORS} | 📅 {YEAR} | ⭐ {RATING}
🔗 https://arxiv.org/abs/{ARXIV_ID}

💡 **核心发现：** {WHY_READ one sentence}
📊 **关键数据：** {BEST_RESULT metric + number}
✨ **启发：** {TOP_INSIGHT one sentence}

💾 笔记 → {OUTPUT_PATH}
```

---

## Step 6 — (Optional) Generate HTML

Only if user requests HTML (`--html` / `生成 HTML` / `生成网页`):

1. Load template from `{SKILL_DIR}/../../templates/paper-note.html`
2. Fill all `{{PLACEHOLDER}}` tags using extracted content
3. Save to output directory as `{ARXIV_ID}.html`
4. Report the saved path

See the root SKILL.md for the full placeholder mapping table.

---

## Error Handling

| Error | Action |
|-------|--------|
| arXiv HTML unavailable | Use abstract page only; note `[HTML unavailable]` |
| Very long paper (>50 pages) | Focus on Abstract, Intro, Method, Results tables, Conclusion |
| No figures found in HTML | Skip Figure section, note `[No figures extracted]` |
| Config file missing | Use defaults; suggest "更新我的研究画像" |

---

## Token Efficiency Notes

- **Markdown DNL costs ~2-3K output tokens** (vs ~8-10K for HTML template filling)
- Markdown files are git-friendly: diff, merge, grep all work naturally
- Reading list tables can directly link to markdown notes via relative paths
- HTML generation is now opt-in, not default — saves tokens on every paper read