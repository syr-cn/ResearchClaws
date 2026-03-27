---
name: idea-generator
description: >
  Analyze connections across read papers and generate actionable research ideas. Use when user says: 给我一些研究灵感, idea generator, 跨论文分析, research ideas.
---

# Idea Generator — Cross-Paper Insights

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

**Goal:** Analyze connections across the user's read papers and generate 3–5 actionable research ideas.

**Triggers:** `给我一些研究灵感` · `idea generator` · `跨论文分析` · `research ideas`

### Step 1 — Gather paper corpus

1. Load `~/.openclaw/workspace/research-claw-reading-list.json`
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

