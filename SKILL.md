---
name: research-claw
description: >
  Complete AI research assistant with 6 core capabilities: paper discovery, deep reading notes,
  reading list management, research taste learning, idea generation, and paper writing.
  Trigger words: 论文推荐, paper recommendation, arXiv, 读论文, paper notes, DNL,
  推荐今日论文, 每日论文, 帮我读一下, paper scout, 论文速读, 帮我安装 ResearchClaw,
  research claws, researchclaw, 加入待读, 我的论文列表, reading list, 标记已读,
  更新我的研究画像, 我的研究画像, research profile, 给我一些研究灵感, idea generator,
  跨论文分析, 帮我写论文, paper writing, 论文大纲, 写引言, rebuttal.
metadata:
  openclaw:
    homepage: https://github.com/AlphaLab-USTC/ResearchClaw
    version: "3.1.0"
    author: AlphaLab-USTC
---

# ResearchClaw v3.1 — Modular Research Assistant

ResearchClaw is a complete AI research companion with **6 atomic skills**.
Each skill is self-contained and can be used independently.

## Skills

| # | Skill | Directory | What it does |
|---|---|---|---|
| 1 | **Paper Scout** 📡 | `skills/paper-scout/` | Daily arXiv paper discovery with personalized ranking |
| 2 | **Paper Reader** 📝 | `skills/paper-reader/` | Deep reading → markdown deep notes (default) or HTML page |
| 3 | **Reading List** 📋 | `skills/reading-list/` | Kanban paper management + HTML dashboard |
| 4 | **Research Profile** 🧠 | `skills/research-profile/` | Research taste profile + visualization |
| 5 | **Idea Generator** 💡 | `skills/idea-generator/` | Cross-paper insights → research idea proposals |
| 6 | **Paper Writer** 📄 | `skills/paper-writer/` | Outline → draft → auto-review → rebuttal |

## Quick Reference

| Say this | Skill triggered |
|---|---|
| `推荐今日论文` | Paper Scout |
| `帮我读一下 [arXiv link]` | Paper Reader |
| `加入待读 [link]` | Reading List |
| `我的论文列表` | Reading List |
| `我的研究画像` | Research Profile |
| `给我一些研究灵感` | Idea Generator |
| `论文大纲 [idea]` | Paper Writer |
| `rebuttal [comments]` | Paper Writer |

## Shared Config

- **Research profile:** `~/.openclaw/workspace/research-claw-config.md`
- **Reading list data:** `~/.openclaw/workspace/research-claw-reading-list.json`
- **HTML output:** `~/.openclaw/workspace/research-claw-output/`
- **Templates:** `templates/` (paper-note, reading-list, research-profile)

## Install

```
帮我安装 ResearchClaw：https://raw.githubusercontent.com/AlphaLab-USTC/ResearchClaw/main/docs/install.md
```
