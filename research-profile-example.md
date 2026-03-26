# ResearchClaws — Research Profile
# Copy this file to ~/.openclaw/workspace/research-profile.md and customize it.
# The agent reads this file before running any capability.

## 🧑‍🔬 User Info
name: "Yaorui Shi"
affiliation: "USTC / Meituan LongCat Team"

## 🎯 Research Direction
# Describe your core research direction in 2-4 sentences.
# This is used for: relevance scoring, idea generation, Scout filtering.
research_description: >
  I focus on large reasoning models and agentic AI systems, particularly:
  reinforcement learning for LLM reasoning, agentic memory mechanisms for
  long-context tasks, and multi-modal agents. I am interested in papers that
  propose novel training objectives, benchmarks, or system designs that push
  the boundary of what language model agents can do autonomously.

## 🌱 Seed Papers
# arXiv IDs of papers that best represent your taste.
# These are used as few-shot examples when scoring new papers.
# Role options: foundational | benchmark | method
seed_papers:
  - id: "2503.19823"
    title: "AutoRefine: Search and Refine During Think"
    role: foundational
  - id: "2412.18547"
    title: "MemOCR: Layout-Aware Visual Memory for Long-Horizon Reasoning"
    role: foundational
  - id: "2501.09433"
    title: "ReMemR1: Revisitable Memory for Long-Context LLM Agents"
    role: foundational
  - id: "2411.14483"
    title: "SciLitLLM: Scientific Literature Understanding"
    role: benchmark

## 🏷️ Keywords
# Used for arXiv search queries and relevance scoring.
# Format: list of strings. More specific = better signal.
keywords:
  - "reinforcement learning reasoning"
  - "LLM agent"
  - "agentic memory"
  - "long context reasoning"
  - "retrieval augmented generation"
  - "multimodal agent"
  - "chain of thought"
  - "process reward model"
  - "RLVR"
  - "test-time compute"

## 👥 Whitelist Authors
# Papers by these authors get +1 relevance bonus.
whitelist_authors:
  - "Xiang Wang"
  - "An Zhang"
  - "Denny Zhou"
  - "Jason Wei"
  - "Noam Shazeer"

## 📐 arXiv Categories to Search
arxiv_categories:
  - "cs.CL"   # Computation and Language
  - "cs.AI"   # Artificial Intelligence
  - "cs.LG"   # Machine Learning
  - "cs.CV"   # Computer Vision (for multimodal)
  - "cs.IR"   # Information Retrieval

## 🏆 Top Venues (papers from these get +1 bonus)
top_venues:
  - "NeurIPS"
  - "ICML"
  - "ICLR"
  - "ACL"
  - "EMNLP"
  - "NAACL"
  - "AAAI"

## ⚙️ Scout Settings
scout_days_back: 3           # How many days back to search (default: 3)
scout_top_n: 8               # How many papers to show in daily scout (default: 8)
scout_language: "zh"         # "zh" (Chinese summaries) or "en"

## 📊 Score Thresholds (inherited from PaperClaw conventions)
score_thresholds:
  high: 7        # >= 7 → definitely recommend
  edge_low: 4    # 4-6 → borderline, show with lower priority
  low: 3         # <= 3 → skip

## 🧠 Learned Preferences
# Auto-updated by the agent when you accept/reject Scout recommendations.
# Format: list of patterns with +/- signal
learned_preferences:
  accept:
    - "reinforcement learning from verifiable rewards"
    - "agentic long-context"
    - "multi-step reasoning"
  reject:
    - "pure vision / image classification"
    - "recommendation systems"
    - "survey / review papers"

## 💡 Idea Generator Settings
idea_min_papers: 3           # Minimum papers needed before idea generation
idea_output_count: 3         # How many idea proposals to generate

## 📁 File Paths
notes_dir: "~/papers/notes/"          # Where HTML paper notes are saved
reading_list_path: "~/papers/reading-list.html"   # Reading list HTML dashboard
profile_html_path: "~/papers/research-profile.html"  # Visual profile page
