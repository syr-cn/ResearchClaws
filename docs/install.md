# Install ResearchClaws

## One-line Install

Send this message to your OpenClaw agent:

```
帮我安装 ResearchClaws：https://raw.githubusercontent.com/syr-cn/ResearchClaws/main/docs/install.md
```

That's it. The agent will:
1. Download this file
2. Register the skill (`SKILL.md`) with your OpenClaw instance
3. Confirm installation and all 6 capabilities are ready

---

## Manual Install (Advanced)

If you want full control:

```bash
# 1. Clone the skill
git clone https://github.com/syr-cn/ResearchClaws ~/.openclaw/skills/research-claws

# 2. Register with OpenClaw
# Tell your agent: "register skill at ~/.openclaw/skills/research-claws"
```

---

## Set Up Your Research Profile

After installing, set up your research taste profile:

```bash
# Copy the example profile
cp ~/.openclaw/skills/research-claws/research-profile-example.md \
   ~/.openclaw/workspace/research-claws-config.md
```

Edit `~/.openclaw/workspace/research-claws-config.md` with:
- Your research direction description
- Seed papers (arXiv IDs you consider gold standards)
- Keywords for daily discovery
- Whitelist authors to follow

Or just tell your agent:
```
更新我的研究画像
```

---

## File Structure

```
ResearchClaws/
├── SKILL.md                        # Agent instructions (all 6 capabilities)
├── README.md                       # Project overview
├── research-profile-example.md     # Profile config template
├── templates/
│   ├── paper-note.html             # HTML template for deep reading notes
│   ├── reading-list.html           # HTML dashboard for reading list
│   └── research-profile.html       # Visual research taste profile page
├── docs/
│   ├── install.md                  # This file
│   └── config.md                   # Config reference
├── showcase/                        # Live demo HTML pages
│   ├── case1-daily-signal-brief.html
│   ├── case2-paper-reading-notes.html
│   ├── case3-research-proposal.html
│   └── case4-multi-agent-codebase.html
└── index.html                       # GitHub Pages homepage
```

---

## Requirements

- **OpenClaw** — https://openclaw.ai
- **Internet access** — for arXiv API calls and PDF downloads
- **No paid APIs needed** — uses arXiv free API + OpenClaw's built-in `pdf` and `web_fetch` tools

---

## Quick Start After Install

ResearchClaws v2.0 has **6 core capabilities**:

| # | Say this | Capability | What happens |
|---|----------|------------|--------------|
| 📡 | `推荐今日论文` | Paper Scout | Fetches today's arXiv papers ranked by your profile |
| 📝 | `帮我读一下 [arXiv link]` | Paper Reader | Deep reads PDF → chat summary + saved HTML note |
| 📋 | `加入待读 [link]` | Reading List | Adds paper to your reading list |
| 📋 | `我的论文列表` | Reading List | Shows and regenerates HTML reading dashboard |
| 📋 | `标记已读 [paper]` | Reading List | Moves paper to Done status |
| 🧠 | `更新我的研究画像` | Research Profile | Updates config + regenerates visual HTML profile |
| 🧠 | `我的研究画像` | Research Profile | Shows current research taste profile |
| 💡 | `给我一些研究灵感` | Idea Generator | Cross-paper analysis → 3–5 research ideas |
| 📄 | `论文大纲 [idea]` | Paper Writer | Generates structured paper outline |
| 📄 | `写引言` / `写方法` | Paper Writer | Drafts specific paper sections |
| 📄 | `审稿` / `找论文的弱点` | Paper Writer | Auto-reviews your draft |
| 📄 | `rebuttal [comments]` | Paper Writer | Drafts point-by-point reviewer responses |

---

## Output Files

All generated HTML files are saved to:
```
~/.openclaw/workspace/research-claws-output/
```

| File | Description |
|------|-------------|
| `{ARXIV_ID}.html` | Deep reading note for a specific paper |
| `reading-list.html` | Your reading list HTML dashboard |
| `research-profile.html` | Your visual research taste profile |

---

## Uninstall

```
Tell your agent: "卸载 ResearchClaws skill"
```

Or manually delete `~/.openclaw/skills/research-claws/`.
