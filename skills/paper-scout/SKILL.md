---
name: paper-scout
description: >
  Discover and recommend latest arXiv papers matching user research interests. Use when user says: 推荐今日论文, paper scout, 每日论文, daily papers, paper recommendation.
---

# Paper Scout — Daily Paper Discovery

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

Update `~/.openclaw/workspace/research-claw-config.md` immediately.

### Cron setup

If user wants daily delivery:
- Time: 9:00 AM (Asia/Shanghai)
- Prompt: `推荐今日论文`
- Channel: user's preferred channel (Discord, Telegram, etc.)

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

