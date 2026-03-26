<div align="center">

# 🦞 ResearchClaw

**你的 AI 全能论文助手 | Your Complete AI Research Companion**

*由 [OpenClaw](https://openclaw.ai) 驱动 · Powered by OpenClaw*

[![OpenClaw Skill](https://img.shields.io/badge/OpenClaw-Skill-blue?style=flat-square)](https://openclaw.ai)
[![Version](https://img.shields.io/badge/version-2.0.0-brightgreen?style=flat-square)](https://github.com/syr-cn/ResearchClaw)
[![arXiv](https://img.shields.io/badge/arXiv-Free%20API-red?style=flat-square)](https://arxiv.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Demo](https://img.shields.io/badge/Demo-GitHub%20Pages-green?style=flat-square)](https://syr-cn.github.io/ResearchClaw/)

<br>

**6 大核心能力，零 API Key，开箱即用的 AI 科研全流程助手。**

*6 core capabilities. No API keys. End-to-end AI research companion, out of the box.*

<br>

[🌐 在线演示](https://syr-cn.github.io/ResearchClaw/) · [📖 安装](#一句话安装) · [⚙️ 配置](docs/config.md) · [🐛 Issues](https://github.com/syr-cn/ResearchClaw/issues)

</div>

---

## ✨ 6 大核心能力 | 6 Core Capabilities

<table>
<tr>
<td width="33%" valign="top">

### 📡 论文雷达
**Paper Scout**

每天从 arXiv 自动发现最新论文，按你的研究画像智能排序，推送 Top 5–10。

- 🔍 覆盖 LLM/RL/多模态等方向
- 🎯 个性化相关度评分
- 📈 从你的反馈中自动学习
- ⏰ 支持每日定时推送

**触发：** `推荐今日论文`
[▶ 查看演示](https://syr-cn.github.io/ResearchClaw/showcase/case1-daily-signal-brief.html)

</td>
<td width="33%" valign="top">

### 📝 深度速读
**Paper Reader**

发一个 arXiv 链接，AI 读完 PDF，基于 **CRGP 分析法** 生成结构化笔记，还会保存精美 HTML 页面。

- 📖 **CRGP 分析**：Context → Related Work → Gap → Proposal
- 📊 含图表、具体实验数字、关键发现
- 🎨 自动生成带图 HTML 阅读笔记
- 🇨🇳 中英双语友好

**触发：** arXiv 链接 / `帮我读一下`
[▶ 查看演示](https://syr-cn.github.io/ResearchClaw/showcase/demo-paper-note.html)

</td>
<td width="33%" valign="top">

### 📋 论文列表
**Reading List**

维护你的论文待读/正在读/已读列表，一键生成 HTML 看板。

- 📊 三栏看板：To Read / Reading / Done
- ➕ 一句话加入待读
- ✅ 一句话标记已读
- 🔗 每篇都链接到 HTML 笔记

**触发：** `我的论文列表` / `加入待读`
[▶ 查看演示](https://syr-cn.github.io/ResearchClaw/showcase/demo-reading-list.html)

</td>
</tr>
<tr>
<td width="33%" valign="top">

### 🧠 研究画像
**Research Taste Profile**

学习你的研究偏好，生成可视化研究画像页面，个性化一切推荐。

- 📝 研究方向描述
- 🌱 种子论文 & 关键词
- 👤 关注作者白名单
- 🔄 从对话反馈自动更新

**触发：** `我的研究画像` / `更新我的研究画像`
[▶ 查看演示](https://syr-cn.github.io/ResearchClaw/showcase/demo-research-profile.html)

</td>
<td width="33%" valign="top">

### 💡 灵感生成器
**Idea Generator**

分析你已读的论文，找出研究空白，生成 3–5 个有可行性的研究灵感。

- 🔗 跨论文连接分析
- 🕳️ 自动识别研究缺口
- 📋 每个灵感含问题陈述 + 方法 + 相关论文 + 可行性评估
- ⭐ 时机分析

**触发：** `给我一些研究灵感`
[▶ 查看演示](https://syr-cn.github.io/ResearchClaw/showcase/case3-research-proposal.html)

</td>
<td width="33%" valign="top">

### 📄 论文写作
**Paper Writer**

从灵感到草稿到回复审稿，覆盖论文写作全流程。

- 🗂️ 结构化大纲生成
- ✍️ 逐章节起草
- 🔍 自我审稿 & 找弱点
- 💬 Reviewer 回复起草

**触发：** `论文大纲` / `写引言` / `rebuttal`
[▶ 查看演示](https://syr-cn.github.io/ResearchClaw/showcase/case4-multi-agent-codebase.html)

</td>
</tr>
</table>

---

## 🚀 一句话安装

把这句话发给你的 OpenClaw 代理：

```
帮我安装 ResearchClaw：https://raw.githubusercontent.com/syr-cn/ResearchClaw/main/docs/install.md
```

> **就这一句话。** 代理会自动下载、注册技能，无需任何手动操作。

**还没有 OpenClaw？** 先访问 [openclaw.ai](https://openclaw.ai) 安装，再运行上面这句话。

---

## 💬 快速上手示例 | Quick Start

### 📡 每日论文推荐

```
推荐今日论文
```

> 📡 今日论文推荐 | Daily Paper Scout
> ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
> 🗓️ 2026-03-26 | 匹配兴趣: LLM · RL · Agentic AI
>
> 1️⃣ **RLVR: Reinforcement Learning with Verifiable Rewards**
>    👤 Zhang et al. (2026) 🏷️ cs.LG · cs.AI
>    💡 通过可验证奖励信号显著提升 LLM 数学推理能力
>    🎯 相关原因: 直接结合 RL + LLM reasoning，命中核心方向
>    🔗 https://arxiv.org/abs/2503.XXXXX
> ...

---

### 📝 深度速读 + HTML 笔记

```
帮我读一下这篇：https://arxiv.org/abs/2503.19823
```

> 📝 论文速读 | Paper Quick Notes
> ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
> 📌 **AutoRefine: Search and Refine During Think**
> 👤 Shi et al. | 📅 2025 | 📍 NeurIPS 2025
>
> 📖 **CRGP 分析**
> 🔹 **Context** — RAG 让 LLM 查询外部知识，但检索到的信息常含噪声
> 🔹 **Gap** — 现有方法只在推理前/后检索，缺少推理过程中的迭代精炼
> 🔹 **Proposal** — 在推理链的连续搜索间插入「知识精炼」步骤
>
> ⚙️ **方法** — Search-and-Refine-During-Think + 检索特定奖励 GRPO
> 📊 **实验** — 2WikiMHQA EM 67.7 · HotpotQA EM 55.3 · 多跳推理显著提升
> ✨ **洞察** — 精炼检索到的知识比检索本身更重要
>
> 💾 HTML 笔记已保存（含图表 + CRGP 完整分析）

---

### 📋 管理论文列表

```
加入待读 https://arxiv.org/abs/2503.19823
```
> ✅ 已加入待读：**AutoRefine** | 共 7 篇待读

```
我的论文列表
```
> 📋 阅读列表已更新 → 打开 reading-list.html 查看看板
> To Read: 5 篇 · Reading: 2 篇 · Done: 12 篇

---

### 💡 灵感生成

```
给我一些研究灵感
```

> 💡 Research Idea 1: **Adaptive Memory Retrieval for RL Agents**
> 📋 Problem: 当前 RL agent 的记忆检索策略是静态的，无法根据任务难度动态调整...
> 🔧 Approach: 在 rollout 过程中，用 uncertainty estimation 决定何时检索记忆...
> 📚 Related: AutoRefine (推理时检索) · MemOCR (记忆布局感知)
> 🎯 Feasibility: 数据集现成，4×A100 × 3天，风险：检索延迟影响 rollout 速度

---

### 📄 论文写作

```
论文大纲：我想做一个 RL + Memory 的工作，针对 long-horizon agentic 任务
```

> 📄 论文大纲 | Paper Outline
> 📌 Working Title: MemRL: Memory-Augmented Reinforcement Learning for Long-Horizon Agents
> 🎯 Core Claim: 动态记忆检索机制显著提升 RL agent 在长程任务上的成功率
> 📍 Target Venue: NeurIPS 2026
>
> ## 1. Introduction ...
> ## 2. Related Work ...
> (完整大纲展开)

```
rebuttal
[Reviewer 2: The comparison with baseline X is unfair because...]
```

> 📝 Rebuttal Draft
> **Reviewer 2**
> > R2.1: "The comparison with baseline X is unfair..."
> **Response:** We thank the reviewer for this concern. The comparison is fair because...

---

## 🎬 在线演示 | Live Showcase

访问 [syr-cn.github.io/ResearchClaw](https://syr-cn.github.io/ResearchClaw/) 查看完整演示：

| 案例 | 描述 |
|------|------|
| [每日信号简报](https://syr-cn.github.io/ResearchClaw/showcase/case1-daily-signal-brief.html) | Paper Scout 多源聚合推送示例 |
| [论文阅读笔记](https://syr-cn.github.io/ResearchClaw/showcase/case2-paper-reading-notes.html) | Paper Reader HTML 笔记示例 |
| [研究方向分析](https://syr-cn.github.io/ResearchClaw/showcase/case3-research-proposal.html) | Idea Generator 灵感生成示例 |
| [多智能体协作](https://syr-cn.github.io/ResearchClaw/showcase/case4-multi-agent-codebase.html) | Paper Writer 写作辅助示例 |

---

## ⚙️ 配置研究画像

安装后，直接告诉代理：

```
更新我的研究画像：我主要研究强化学习和多模态 agent，关注 RLVR 方向
```

或手动编辑 `~/.openclaw/workspace/research-claw-config.md`：

```yaml
research_direction: "PhD in LLM reasoning and agentic memory systems"
seed_papers:
  - 2503.19823   # AutoRefine
keywords:
  - reinforcement learning
  - agentic memory
  - long-context reasoning
whitelist_authors:
  - Yaorui Shi
  - An Zhang
```

详见 [配置指南](docs/config.md)

---

## 📦 每日自动推送

```
帮我设置每天早上 9 点自动推荐论文
```

代理会自动创建 OpenClaw cron 任务。✅

---

## 🔧 工作原理 | How It Works

```
用户: 推荐今日论文
  ↓
读取 research-claw-config.md（研究画像）
  ↓
调用 arXiv 公开 API（免费，无需 Key）
  ↓
按个性化偏好评分排序
  ↓
返回 Top 5–10 论文速览
  ↓
用户反馈 → 自动更新研究画像
```

```
用户: 帮我读一下 arxiv.org/abs/XXXXX
  ↓
提取 arXiv ID → 获取元数据
  ↓
内置 pdf 工具分析原文
  ↓
提取：动机 · 方法 · 结果 · 局限 · 要点
  ↓
输出聊天摘要 + 生成 HTML 笔记页面
```

**零第三方依赖**：只需 OpenClaw + 网络，不需要任何额外 API Key。

---

## 🤝 Credits

- 🦞 Built with [OpenClaw](https://openclaw.ai) — AI assistant platform
- 📄 Paper data from [arXiv](https://arxiv.org) (free open-access API)
- 🧠 Created by [@syr-cn](https://github.com/syr-cn) (Yaorui Shi, USTC)

---

## 🌍 English Quick Reference

**Install** (one line — send to your OpenClaw agent):
```
帮我安装 ResearchClaw：https://raw.githubusercontent.com/syr-cn/ResearchClaw/main/docs/install.md
```

**6 capabilities at a glance:**

| Say this | What happens |
|---|---|
| `推荐今日论文` | Daily arXiv paper recommendations, ranked by your profile |
| `帮我读一下 [arXiv link]` | Deep read PDF → chat summary + saved HTML note |
| `加入待读 [link]` | Add paper to your reading list |
| `我的论文列表` | View & regenerate your HTML reading dashboard |
| `更新我的研究画像` | Update research taste profile + visual HTML page |
| `给我一些研究灵感` | Cross-paper analysis → 3–5 research idea proposals |
| `论文大纲 [idea]` | Generate structured paper outline |
| `写引言` / `写方法` | Draft specific paper sections |
| `rebuttal [comments]` | Draft point-by-point reviewer responses |

**No API key needed.** Uses arXiv's free public API + OpenClaw's built-in tools.
Zero third-party dependencies.

---

<div align="center">

Made with ❤️ for researchers · MIT License · [syr-cn.github.io/ResearchClaw](https://syr-cn.github.io/ResearchClaw/)

</div>
