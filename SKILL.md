---
name: research-claws
description: >
  Complete AI research assistant with 6 core capabilities: paper discovery, deep reading notes,
  reading list management, research taste learning, idea generation, and paper writing.
  Trigger words: 论文推荐, paper recommendation, arXiv, 读论文, paper notes, DNL,
  推荐今日论文, 每日论文, 帮我读一下, paper scout, 论文速读, 帮我安装 ResearchClaws,
  research claws, researchclaws, 加入待读, 我的论文列表, reading list, 标记已读,
  更新我的研究画像, 我的研究画像, research profile, 给我一些研究灵感, idea generator,
  跨论文分析, 帮我写论文, paper writing, 论文大纲, 写引言, rebuttal.
metadata:
  openclaw:
    homepage: https://github.com/syr-cn/ResearchClaws
    version: "2.0.0"
    author: syr-cn
---

# ResearchClaws v2.0 — Agent Usage Guide

ResearchClaws gives you **6 core capabilities** as a complete AI research companion.
Read this guide fully before acting; each section has precise step-by-step instructions.

---

## 🗂️ Capability Overview

| # | Capability | Icon | Trigger Words |
|---|---|---|---|
| 1 | **Paper Scout** | 📡 | `推荐今日论文`, `paper scout`, `每日论文`, daily cron |
| 2 | **Paper Reader** | 📝 | arXiv link, `帮我读一下`, `DNL`, `论文速读` |
| 3 | **Reading List** | 📋 | `我的论文列表`, `reading list`, `加入待读`, `标记已读`, `移除` |
| 4 | **Research Taste Profile** | 🧠 | `更新我的研究画像`, `我的研究画像`, `research profile`, auto-learn |
| 5 | **Idea Generator** | 💡 | `给我一些研究灵感`, `idea generator`, `跨论文分析` |
| 6 | **Paper Writer** | 📄 | `帮我写论文`, `paper writing`, `论文大纲`, `写引言`, `rebuttal` |

---

## ⚙️ Step 0 — Read the Research Profile (Always First)

Before running **any** capability, load the user's research profile.

**Location:** `~/.openclaw/workspace/research-claws-config.md`

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

## 📡 Capability 1 — Paper Scout (Daily Discovery)

**Goal:** Find today's top arXiv papers matching user interests. Output Top 5–10 with relevance scoring.

**Triggers:** `推荐今日论文` · `每日论文` · `paper scout` · daily cron job

### Step 1 — Build search queries

From the loaded profile, extract `keywords` and construct arXiv query URLs:

```
http://export.arxiv.org/api/query?search_query=all:{KEYWORD}&sortBy=submittedDate&sortOrder=descending&max_results=25&start=0
```

- Replace spaces in keywords with `+` (e.g., `large+language+models`)
- Run **2–4 queries** covering different interest areas
- If the user has `seed_papers`, also fetch their metadata via:
  ```
  https://export.arxiv.org/abs/{ARXIV_ID}
  ```
  Use these to calibrate what "relevant" means (topics, methods, problem framing).

### Step 2 — Fetch and parse

Use `web_fetch` for each query URL. Parse the XML Atom response:

```xml
<entry>
  <title>...</title>           <!-- paper title -->
  <author><name>...</name></author>   <!-- first/all authors -->
  <summary>...</summary>       <!-- abstract -->
  <id>http://arxiv.org/abs/XXXX.XXXXX</id>   <!-- canonical URL -->
  <published>2026-03-26T...</published>       <!-- submission date -->
  <arxiv:primary_category term="cs.LG"/>     <!-- category -->
</entry>
```

**Filter:** Only keep papers published within the last **3 days** (compare `<published>` to today's date in Asia/Shanghai timezone). If fewer than 5 papers remain, extend to **7 days** and note it.

### Step 3 — Score and rank

Score each paper 1–5 on relevance:

| Signal | Score Boost |
|---|---|
| Title contains exact keyword from user profile | +2 |
| Abstract contains ≥3 keyword matches | +1.5 |
| Author in `whitelist_authors` | +2 |
| Paper cites or builds on seed paper | +1.5 |
| Novel contribution words: "propose", "novel", "outperform", "state-of-the-art", "benchmark" | +0.5 |
| Survey/review signal: "survey", "overview", "analysis of existing" | −1 |
| Topic in `learned_preferences.accept` | +1 |
| Topic in `learned_preferences.reject` | −2 |

Sort descending by score. Keep Top 5 (or Top 10 if user asks for more).

### Step 4 — Format and output

```
📡 今日论文推荐 | Daily Paper Scout
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗓️ {DATE} | 匹配兴趣: {COMMA_SEPARATED_KEYWORDS}

1️⃣ **{Title}**
   👤 {First Author} et al. ({Year})
   🏷️ {category, e.g. cs.LG · cs.AI}
   💡 {One-sentence summary — Chinese or English, whichever matches user preference}
   🎯 相关原因: {1 sentence — why this matches user's profile}
   🔗 {arXiv URL}

2️⃣ **{Title}**
   ... (repeat)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 想深读某篇？发链接说 "帮我读一下" | 加入待读说 "加入待读 [链接]"
```

### Step 5 — Auto-learn from feedback

If the user reacts to a recommended paper with:
- `"不错"` / `"这个好"` / `"有意思"` / `"精读"` → extract keywords from that paper's title/abstract, add to `learned_preferences.accept` in config
- `"skip"` / `"没意思"` / `"不相关"` → extract keywords, add to `learned_preferences.reject`

Update `~/.openclaw/workspace/research-claws-config.md` immediately.

### Cron setup

If user wants daily delivery:
- Time: 9:00 AM (Asia/Shanghai)
- Prompt: `推荐今日论文`
- Channel: user's preferred channel (Discord, Telegram, etc.)

---

## 📝 Capability 2 — Paper Reader (Deep Reading → HTML)

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
  Carefully read this paper and extract:
  1. MOTIVATION: What specific problem does this paper solve? Why is it important? (2-3 sentences)
  2. TLDR: One-sentence summary of the entire paper.
  3. METHOD_OVERVIEW: High-level description of the proposed method/approach. (2-3 sentences)
  4. METHOD_STEP_1/2/3: Three concrete technical steps or components of the method.
  5. RESULTS_OVERVIEW: Summary of the main experimental findings. (1-2 sentences)
  6. METRIC_1/2/3: Three specific quantitative results (metric name + value + benchmark).
  7. LIMITATION_1/2/3: Three limitations, weaknesses, or failure cases (from the paper or your analysis).
  8. TAKEAWAY: Single most important insight for a researcher to remember.
  9. TAG_1/2/3: Three topic tags (e.g., "Reinforcement Learning", "LLM Reasoning", "Memory").
  10. TOPIC_TAG: Primary topic category (e.g., cs.LG, NLP, Vision).
  11. CODE_URL: GitHub link if mentioned in the paper, else empty string.
  12. RELEVANCE_SCORE: 1-5 relevance score based on user's research profile keywords.
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

🔍 **Motivation**
{MOTIVATION}

⚙️ **Method**
{METHOD_OVERVIEW}

📊 **Results**
{RESULTS_OVERVIEW}
• {METRIC_1_NAME}: {METRIC_1_VAL}
• {METRIC_2_NAME}: {METRIC_2_VAL}
• {METRIC_3_NAME}: {METRIC_3_VAL}

⚠️ **Limitations**
• {LIMITATION_1}
• {LIMITATION_2}

✨ **Takeaway**
{TAKEAWAY}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 HTML笔记已保存 → {OUTPUT_PATH}
📋 加入待读？说 "加入待读 https://arxiv.org/abs/{ARXIV_ID}"
```

### Step 5 — Generate HTML note from template

**Output directory (default):** `~/.openclaw/workspace/research-claws-output/`
Create this directory if it doesn't exist.

**Filename:** `{ARXIV_ID}.html` (e.g., `2503.19823.html`)

**Template location:** `{SKILL_DIR}/templates/paper-note.html`
where `{SKILL_DIR}` is the directory where this SKILL.md lives (e.g., `~/.openclaw/skills/research-claws/`).

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
| `{{MOTIVATION}}` | Motivation paragraph |
| `{{METHOD_OVERVIEW}}` | Method high-level description |
| `{{METHOD_STEP_1}}`, `{{METHOD_STEP_2}}`, `{{METHOD_STEP_3}}` | Three method steps |
| `{{RESULTS_OVERVIEW}}` | Results summary |
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

## 📋 Capability 3 — Reading List (HTML Dashboard)

**Goal:** Maintain a personal reading list with three statuses. Regenerate the HTML dashboard on every change.

**Triggers:** `我的论文列表` · `reading list` · `加入待读 [link]` · `标记已读 [paper]` · `移除 [paper]`

### Data file

Maintain a JSON or YAML data file at:
```
~/.openclaw/workspace/research-claws-reading-list.json
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
      "note_link": "research-claws-output/2503.19823.html"
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

6. Save filled HTML to `~/.openclaw/workspace/research-claws-output/reading-list.html`
7. Report: `📋 阅读列表已更新 → ~/.openclaw/workspace/research-claws-output/reading-list.html`

---

## 🧠 Capability 4 — Research Taste Profile (Personalization)

**Goal:** Maintain the user's research preference profile and render it as a visual HTML page.

**Triggers:** `更新我的研究画像` · `我的研究画像` · `research profile` · auto-learn (from Paper Scout feedback)

### Config file format

**Location:** `~/.openclaw/workspace/research-claws-config.md`

```yaml
# ResearchClaws Config
# Auto-maintained by the agent. You can also edit manually.

research_direction: >
  PhD researcher in large reasoning models and agentic memory systems.
  Focus on RL-based training, long-context reasoning, and retrieval-augmented agents.

seed_papers:
  - 2503.19823   # AutoRefine
  - 2412.XXXXX   # MemOCR
  - 2502.XXXXX   # ReMemR1

keywords:
  - large language models
  - reinforcement learning
  - agentic memory
  - long-context reasoning
  - retrieval-augmented generation
  - multimodal agents

whitelist_authors:
  - Yaorui Shi
  - An Zhang
  - Xiang Wang

learned_preferences:
  accept:
    - RL-based reasoning
    - verifiable rewards
    - memory augmentation
  reject:
    - pure NLP classification
    - computer vision only
    - medical imaging

topic_stats:
  - topic: "Reinforcement Learning"    count: 12   pct: 35
  - topic: "LLM Reasoning"             count: 9    pct: 26
  - topic: "Agentic AI"                count: 7    pct: 20
  - topic: "Multimodal"                count: 4    pct: 12
  - topic: "RAG"                       count: 2    pct: 7
```

### Operations

**View profile** (`我的研究画像`):
- Load config, regenerate HTML visual profile (see HTML step below)
- In chat, show a compact text summary:
  ```
  🧠 你的研究画像
  方向: {research_direction (first sentence)}
  关键词: {keywords joined by · }
  种子论文: {N} 篇
  关注作者: {whitelist_authors joined by , }
  偏好: +{accept topics} / −{reject topics}
  ```

**Update profile** (`更新我的研究画像 [any description]`):
1. Ask the user (or parse from their message) for updated:
   - Research direction description
   - New keywords to add/remove
   - New seed paper IDs to add
   - New author names to whitelist
2. Update the config file
3. Regenerate HTML profile
4. Confirm in chat

**Auto-learn** (triggered by feedback on Paper Scout results):
1. Parse the user's feedback signal
2. Update `learned_preferences.accept` or `.reject`
3. Update `topic_stats` by incrementing count for relevant topics
4. Save config silently (no need for separate confirmation, just note briefly)

### Generate HTML profile

**Template location:** `{SKILL_DIR}/templates/research-profile.html`

1. Load with `read`
2. Replace placeholders:

| Placeholder | Content |
|---|---|
| `{{USER_NAME}}` | User's name from config or "Researcher" |
| `{{USER_TITLE}}` | User's title/affiliation if known |
| `{{RESEARCH_DIRECTION}}` | Full research direction text |
| `{{LAST_UPDATED}}` | Today's date |
| `{{KEYWORD_COUNT}}` | Total number of keywords |
| `{{KW_1}}` … `{{KW_10}}` | Keyword names (fill up to 10) |
| `{{SEED_COUNT}}` | Number of seed papers |
| `{{SEED_ID_1}}`, `{{SEED_TITLE_1}}` | First seed paper ID + title |
| `{{SEED_ID_2}}`, `{{SEED_TITLE_2}}` | Second seed paper ID + title |
| `{{SEED_ID_3}}`, `{{SEED_TITLE_3}}` | Third seed paper ID + title |
| `{{AUTHOR_1}}` … `{{AUTHOR_5}}` | Whitelist author names |
| `{{TOPIC_1}}` … `{{TOPIC_5}}` | Top topic names |
| `{{CNT_1}}` … `{{CNT_5}}` | Paper counts per topic |
| `{{PCT_1}}` … `{{PCT_5}}` | Percentage per topic |
| `{{TOTAL_PAPERS}}` | Total papers across all topics |
| `{{PREF_ACCEPT_1}}`, `{{PREF_ACCEPT_2}}`, `{{PREF_ACCEPT_3}}` | Accept preference strings |
| `{{PREF_REJECT_1}}`, `{{PREF_REJECT_2}}` | Reject preference strings |

3. Save to `~/.openclaw/workspace/research-claws-output/research-profile.html`
4. Report: `🧠 研究画像已更新 → ~/.openclaw/workspace/research-claws-output/research-profile.html`

---

## 💡 Capability 5 — Idea Generator (Cross-paper Insights)

**Goal:** Analyze connections across the user's read papers and generate 3–5 actionable research ideas.

**Triggers:** `给我一些研究灵感` · `idea generator` · `跨论文分析` · `research ideas`

### Step 1 — Gather paper corpus

1. Load `~/.openclaw/workspace/research-claws-reading-list.json`
2. Filter papers with `status: "done"` or `status: "reading"` (i.e., papers the user has actually engaged with)
3. For each paper, load its HTML note from the `note_link` field (if available) or re-fetch abstract from arXiv
4. Extract: title, method summary, results, takeaway, tags for each paper

If fewer than 3 papers in the corpus, inform the user:
> 💡 你当前已读论文较少（{N} 篇）。建议先用"帮我读一下"深读几篇，效果会更好！以下基于现有内容生成。

### Step 2 — Identify research gaps

Analyze the collected papers for:
- **Recurring unsolved problems**: limitations mentioned across multiple papers
- **Methodology mismatches**: technique A works in domain X but hasn't been tried in domain Y
- **Evaluation gaps**: common benchmarks that none of the papers tackle
- **Combination opportunities**: two methods from different papers that could be synergistically combined
- **Scaling questions**: results that hold at small scale but haven't been validated at large scale

### Step 3 — Generate idea proposals

Produce 3–5 research ideas. For each idea, output:

```
💡 Research Idea {N}: **{CATCHY_TITLE}**

📋 **Problem Statement**
{1-2 sentences: what specific gap or challenge does this idea address?}

🔧 **Proposed Approach**
{2-3 sentences: how would you tackle it? What's the key insight?}

📚 **Related Papers**
• {Paper 1 title} — {how it connects}
• {Paper 2 title} — {how it connects}

🎯 **Feasibility Assessment**
- Dataset: {what data is needed / what's available}
- Compute: {estimated compute requirements}
- Timeline: {rough estimate for a first experiment}
- Risk: {main technical risk}

⭐ **Why Now?** {1 sentence — why this is timely / what makes it tractable today}
```

### Step 4 — Output

Format all ideas in sequence. End with:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 想把某个灵感发展成论文？说 "帮我写论文" 并描述你选中的想法！
```

---

## 📄 Capability 6 — Paper Writer (Research Writing Assistant)

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
Typical path: `~/.openclaw/skills/research-claws/`
Templates are at: `~/.openclaw/skills/research-claws/templates/`

If you cannot determine the skill directory, use `exec` to find it:
```bash
find ~/.openclaw/skills -name "paper-note.html" 2>/dev/null | head -1
```

### Output directory

Default: `~/.openclaw/workspace/research-claws-output/`

Create if needed:
```bash
mkdir -p ~/.openclaw/workspace/research-claws-output
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
https://raw.githubusercontent.com/syr-cn/ResearchClaws/main/docs/install.md
```

To install, tell your OpenClaw agent:
```
帮我安装 ResearchClaws：https://raw.githubusercontent.com/syr-cn/ResearchClaws/main/docs/install.md
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