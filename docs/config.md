# ResearchClaw 配置指南

## 配置文件位置

```
~/.openclaw/workspace/research-claw-config.md
```

安装时自动创建。你可以随时编辑它，代理每次运行时都会读取最新配置。

---

## 完整配置说明

```markdown
# ResearchClaw 用户配置

## 研究兴趣
INTERESTS:
  - large language models          # 大语言模型
  - reinforcement learning         # 强化学习
  - agentic AI                     # 智能体
  - retrieval-augmented generation # 检索增强生成
  - multimodal models              # 多模态
  - reasoning                      # 推理
  - knowledge graphs               # 知识图谱
  # 可以继续添加更多...

## 推荐设置
DAILY_COUNT: 5      # 每次推荐篇数（建议 3-10）
DAYS_BACK: 3        # 查找最近几天（建议 1-7）
LANGUAGE: zh        # zh = 中文摘要, en = English summary
```

---

## 示例：不同研究方向的配置

### NLP / LLM 方向
```
INTERESTS:
  - large language models
  - instruction tuning
  - chain of thought reasoning
  - RLHF
  - alignment
```

### CV / 多模态方向
```
INTERESTS:
  - vision language models
  - visual question answering
  - image generation
  - diffusion models
  - CLIP
```

### 系统 / 效率方向
```
INTERESTS:
  - efficient inference
  - model compression
  - quantization
  - speculative decoding
  - long context
```

---

## 设置每日自动推荐（Cron）

对代理说：

```
帮我设置每天早上 9 点自动推荐论文
```

代理会创建一个 OpenClaw cron 任务，每天早上 9 点触发"推荐今日论文"，结果发到你的 Discord/Telegram 频道。

---

## 告诉代理你的兴趣

不想手动编辑文件？直接告诉代理：

```
我主要研究强化学习和多模态，帮我更新一下 ResearchClaw 的配置
```

代理会自动更新 `research-claw-config.md`。

---

项目主页：https://github.com/syr-cn/ResearchClaw
