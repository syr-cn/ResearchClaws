---
name: research-profile
description: >
  Maintain and visualize the user research preference profile. Use when user says: 更新我的研究画像, 我的研究画像, research profile.
---

# Research Taste Profile

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

**Goal:** Maintain the user's research preference profile and render it as a visual HTML page.

**Triggers:** `更新我的研究画像` · `我的研究画像` · `research profile` · auto-learn (from Paper Scout feedback)

### Config file format

**Location:** `~/.openclaw/workspace/research-claw-config.md`

```yaml
# ResearchClaw Config
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

3. Save to `~/.openclaw/workspace/research-claw-output/research-profile.html`
4. Report: `🧠 研究画像已更新 → ~/.openclaw/workspace/research-claw-output/research-profile.html`

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

