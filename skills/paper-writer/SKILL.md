---
name: paper-writer
description: >
  Help write research papers: outline, draft sections, auto-review, and rebuttal. Use when user says: 帮我写论文, paper writing, 论文大纲, 写引言, 写方法, 审稿, rebuttal.
---

# Paper Writer — Research Writing Assistant

**Goal:** Help the user write research papers, from outline to full draft to rebuttal.

**Triggers:** `帮我写论文` · `paper writing` · `论文大纲` · `写引言` · `写方法` · `写实验` · `rebuttal`

This capability has **four sub-modes**. Detect which one the user needs:

---

### Sub-mode A: Outline Generation

**Trigger:** `论文大纲` · `paper outline` · `帮我写论文大纲` · user provides a research idea

**Input:** Research idea description + optionally a list of related papers.

**Steps:**

1. Ask the user for (or parse from their message):
   - Core research question / hypothesis
   - Key method or contribution (at high level)
   - Target venue (NeurIPS / ICLR / ACL / EMNLP / ICML / arXiv preprint etc.)
   - Related papers (arXiv IDs or titles)

2. If related papers given, fetch their abstracts to understand the prior work landscape.

3. Generate a **structured outline** following IEEE/NeurIPS standard paper structure:

```
📄 论文大纲 | Paper Outline
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 **Working Title:** {TITLE}
🎯 **Core Claim:** {ONE_SENTENCE_THESIS}
📍 **Target Venue:** {VENUE}

## 1. Introduction (~1.5 pages)
   1.1 Problem motivation — why this matters
   1.2 Limitations of existing work (gap analysis)
   1.3 Our proposal — high-level approach
   1.4 Contributions (bullet list, 3–4 items)
   1.5 Paper organization

## 2. Related Work (~1 page)
   2.1 {Related area 1} — {papers to cite}
   2.2 {Related area 2} — {papers to cite}
   2.3 How our work differs

## 3. Problem Formulation (~0.5 page)
   3.1 Task definition
   3.2 Notation and setup
   3.3 Formal problem statement

## 4. Method (~2 pages)
   4.1 Overview / architecture diagram description
   4.2 Component 1: {name} — {description}
   4.3 Component 2: {name} — {description}
   4.4 Component 3: {name} — {description}
   4.5 Training objective / algorithm

## 5. Experiments (~2 pages)
   5.1 Datasets and evaluation metrics
   5.2 Baselines
   5.3 Main results
   5.4 Ablation study
   5.5 Analysis / case study

## 6. Conclusion (~0.5 page)
   6.1 Summary of contributions
   6.2 Limitations
   6.3 Future work

## References
   {Key papers to cite}

## Appendix (if needed)
   - Additional experiments
   - Proofs
   - Implementation details
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 想展开某个章节？说 "写引言" / "写方法" / "写实验"
```

---

### Sub-mode B: Section Drafting

**Trigger:** `写引言` · `写方法` · `写实验` · `写结论` · `write introduction` · `write method section`

**Input:** Section name + outline (if available) + related papers.

**Steps:**

1. Identify which section the user wants drafted.
2. If an outline exists (from Sub-mode A or provided by user), load it.
3. If related papers mentioned, fetch their content for context.
4. Draft the section following academic writing conventions:
   - **Introduction**: Problem → Gap → Solution → Contributions → Roadmap
   - **Related Work**: Group by theme, end each group with "unlike {us/our work}"
   - **Method**: Precise, reproducible descriptions; reference figures/algorithms; use consistent notation
   - **Experiments**: Table-first approach; report mean±std; ablation must isolate each component
   - **Conclusion**: Never introduce new claims; summarize, then discuss limitations honestly

5. Output the drafted section in clean academic English (or Chinese if user prefers).
6. End with: `✏️ 需要修改或继续下一章节？告诉我！`

---

### Sub-mode C: Auto-Review

**Trigger:** `审稿` · `review my paper` · `自我审稿` · `找论文的弱点` · user pastes draft text

**Input:** A draft paper section or full draft (pasted or referenced by file path).

**Steps:**

1. Parse the provided draft text.
2. Apply a structured review rubric:

```
📋 Auto-Review Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Overall Score:** {1-10} / 10
**Recommended Action:** {Accept / Major Revision / Minor Revision / Reject}

### 🔴 Critical Issues (must fix)
1. {Issue}: {explanation + suggestion}
2. {Issue}: {explanation + suggestion}

### 🟡 Major Concerns (should fix)
1. {Issue}: {explanation + suggestion}
2. {Issue}: {explanation + suggestion}

### 🟢 Minor Suggestions (nice to fix)
1. {Suggestion}
2. {Suggestion}

### ✅ Strengths
• {What the paper does well}
• {Another strength}

### 📊 Dimension Scores
| Dimension | Score | Comments |
|---|---|---|
| Novelty | {1-5} | {brief comment} |
| Technical Soundness | {1-5} | {brief comment} |
| Experimental Quality | {1-5} | {brief comment} |
| Clarity / Writing | {1-5} | {brief comment} |
| Related Work Coverage | {1-5} | {brief comment} |
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 需要帮你修改某个部分？说 "修改引言" 或 "加强实验分析"
```

---

### Sub-mode D: Rebuttal Helper

**Trigger:** `rebuttal` · `写回复` · `reviewer comments` · `审稿意见` · user pastes reviewer comments

**Input:** Reviewer comments (pasted directly into the conversation).

**Steps:**

1. Parse the reviewer comments, identifying:
   - Each reviewer number (Reviewer 1, 2, 3…)
   - Each distinct concern or question within each review
   - Tone: whether the reviewer is positive, neutral, or hostile

2. Categorize each comment:
   - 🔴 **Major** — directly challenges the paper's core claims
   - 🟡 **Moderate** — requests additional experiments or clarification
   - 🟢 **Minor** — asks for minor clarifications or typo fixes

3. Draft a point-by-point rebuttal:

```
📝 Rebuttal Draft
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We thank all reviewers for their careful reading and constructive feedback.
We address each concern below.

---

**Reviewer {N} — Overall: {sentiment}**

> **R{N}.1:** "{reviewer's exact concern (paraphrased)}"
**Response:**
{Draft response — factual, polite, concrete. If experiment needed: "We will add X experiment showing Y."}

> **R{N}.2:** "{next concern}"
**Response:**
{Draft response}

---
(repeat for each reviewer)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ 需要调整语气或补充实验设计？告诉我！
```

4. **Rebuttal writing principles** to follow:
   - **Never be defensive** — acknowledge valid concerns directly
   - **Be concrete** — cite specific table/figure numbers or added experiments
   - **Be concise** — 3–5 sentences per response maximum
   - **Distinguish** — "We will add X in revision" vs. "This is already addressed in Section Y"
   - **Use polite academic framing**: "We appreciate the reviewer's concern…", "We agree that…", "To clarify…"

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

## 📦 Install

This skill was installed from:
```
https://raw.githubusercontent.com/syr-cn/ResearchClaw/main/docs/install.md
```

To install, tell your OpenClaw agent:
```
帮我安装 ResearchClaw：https://raw.githubusercontent.com/syr-cn/ResearchClaw/main/docs/install.md
```

---

## 🔗 Quick Reference Card

| Say this | Capability | What happens |
|---|---|---|
| `推荐今日论文` | 📡 Paper Scout | Fetches and ranks today's arXiv papers |
| `帮我读一下 [arXiv link]` | 📝 Paper Reader | Deep reads PDF → chat summary + HTML note |
| `加入待读 [link]` | 📋 Reading List | Adds paper to your reading list |
| `我的论文列表` | 📋 Reading List | Shows and regenerates HTML dashboard |
| `标记已读 [paper]` | 📋 Reading List | Moves paper to Done status |
| `更新我的研究画像` | 🧠 Research Profile | Updates config + regenerates visual profile |
| `给我一些研究灵感` | 💡 Idea Generator | Cross-paper analysis → 3-5 research ideas |
| `论文大纲 [idea]` | 📄 Paper Writer | Generates structured paper outline |
| `写引言` / `写方法` | 📄 Paper Writer | Drafts specific paper section |
| `审稿` / `找弱点` | 📄 Paper Writer | Auto-reviews your draft |
| `rebuttal [comments]` | 📄 Paper Writer | Drafts point-by-point reviewer responses |

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

