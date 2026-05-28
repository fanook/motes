# motes 话题计划

> 当前 `src/motes/` 下已发布 20 篇 ， 这里整理**未来候选话题**。 按"实用度 ×
> 趋势热度 × 产品价值"分组 ， 每个话题附**为什么写**的一句话理由。
>
> 推荐节奏：从「⭐⭐⭐ 立刻写」开始 ， 不必严格按组顺序。

---

## A. PM / 业务决策类 ── 最实用 ， 询问率最高

| 话题 | 为什么写 | 优先 |
|---|---|---|
| **选模型决策框架** | Haiku / Sonnet / Opus / GPT-4o / GPT-4o-mini / Gemini / DeepSeek 怎么选 ， PM 询问率第一 ， 太多人凭感觉 | ⭐⭐⭐ |
| **AI 产品成本结构全景** | 1 万用户每月多少钱？ input / output / cache / embedding / 向量库 / rerank 全拆开算 ， 接 Token / Prompt Caching 完美延续 | ⭐⭐⭐ |
| **AI Evals 怎么做** | 改 prompt 怎么知道变好了？ 多数团队靠"感觉" ， 这是产品瓶颈。 写 RAGAS / LLM-as-judge / golden set 三板斧 | ⭐⭐⭐ |
| **Latency / TTFT / Throughput** | 同样的模型为什么不同 API 速度差很多？ 首字延迟 / 流式输出 / 吞吐量 ， 影响用户体验感 | ⭐⭐⭐ |
| **AI 产品 ROI 怎么算** | 加了 AI 之后 ， 怎么证明值得花这笔钱。 给老板看的方法论 | ⭐⭐ |
| **AI Guardrails / 内容安全** | 防 jailbreak、 输入过滤、 输出审核 ， 上线必备 | ⭐⭐ |
| **Model Routing 智能路由** | 简单 query 走便宜模型 ， 难的走顶配 ， 实测能省 90% | ⭐⭐ |
| **Batch API 异步处理** | 不需要实时？ OpenAI / Anthropic 都给 50% 折扣。 大量被 PM 忽略 | ⭐⭐ |

---

## B. Agent 时代 ── 2026 主线 ， 半年内会爆

| 话题 | 为什么写 | 优先 |
|---|---|---|
| ~~**AI Agent 是什么**~~ ✅ | 大家都说"我在做 Agent" ， 但定义乱。 拆给你看：LLM + 工具 + 记忆 + 规划 = Agent | ⭐⭐⭐ |
| ~~**ReAct / Reflection / Planning**~~ ✅ | Agent 三大基础范式 ， 决定 Agent 能不能跑得通 | ⭐⭐⭐ |
| **Computer Use / 屏幕操控** | Claude desktop control / OpenAI Operator —— AI 看屏幕、 点鼠标。 已落地 | ⭐⭐⭐ |
| **AI Memory 长期记忆** | 怎么让助手"记得"上次说过什么。 mem0 / Letta / 短期 vs 长期记忆架构 | ⭐⭐⭐ |
| **Multi-agent 系统** | 多 Agent 协作（CrewAI / AutoGen / Mastra）。 谁负责什么 ， 怎么通信 | ⭐⭐ |
| **Context Engineering** | 2026 新词 ， 比 prompt engineering 更宽 ：怎么把"对的信息"放对位置 | ⭐⭐ |
| **Agent 可靠性 / 错误恢复** | Agent 跑长任务怎么不崩。 重试 / 检查点 / 人工接管 | ⭐⭐ |
| **Agentic RAG** | 让 Agent 自己决定要不要检索、 查几次、 用哪个工具 | ⭐⭐ |

---

## C. 前沿模型与架构 ── 技术深度爱好者

| 话题 | 为什么写 | 优先 |
|---|---|---|
| **Reasoning Models 深度** | o1 / o3 / Claude thinking / DeepSeek R1 内部到底在干嘛 ， 跟普通 CoT 差在哪 | ⭐⭐⭐ |
| **Test-time Compute** | "推理时扩展" —— 用算力换准确率的新范式 ， 2025 起的主流 | ⭐⭐⭐ |
| **Speculative Decoding** | 小模型猜大模型答案 ， 推理快 2~3 倍。 你用的所有 API 后端都靠它 | ⭐⭐ |
| **Constitutional AI / RLAIF** | Anthropic 的对齐方法 ， 跟 RLHF 的关键差异。 RLHF 续篇 | ⭐⭐ |
| **FlashAttention 工程** | O(n²) 怎么靠工程压到可接受 ， 显存与速度双赢 | ⭐⭐ |
| **KV Cache 深度版** | Prompt Caching 那篇讲的浅层 ， 这里讲块级哈希 / PagedAttention / radix tree | ⭐ |
| **Distillation 模型蒸馏** | 大模型怎么"教"小模型。 Llama / Gemma 系列的核心训练手段 | ⭐⭐ |
| **Quantization 量化** | INT8 / INT4 / GGUF / GPTQ ， 小内存跑大模型 ， 本地部署必懂 | ⭐⭐ |
| **State Space Models** | Mamba / RWKV ， 替代 Transformer 的另一条路。 还没赢 ， 但值得跟 | ⭐ |

---

## D. 多模态 ── 看图、 听声、 出视频

| 话题 | 为什么写 | 优先 |
|---|---|---|
| **VLM 视觉语言模型** | GPT-4V / Claude Vision / Gemini ， 图片怎么变 token 进 LLM | ⭐⭐⭐ |
| **Diffusion 扩散模型** | Stable Diffusion / Flux / Sora 背后核心。 跟 LLM 是两套思路 | ⭐⭐⭐ |
| **图像生成模型对比** | Imagen / SDXL / Flux / Midjourney 怎么选 ， 各家定位 | ⭐⭐ |
| **视频生成** | Sora / Veo / Runway / 可灵 ， 实际能做什么不能做什么 | ⭐⭐ |
| **语音模型** | Whisper（识别）/ ElevenLabs / TTS 模型对比 | ⭐⭐ |
| **OCR 与文档解析** | PDF / 图片转结构化数据 ， RAG 上游必备 | ⭐ |

---

## E. 微调 / 训练技巧 ── 工程师向

| 话题 | 为什么写 | 优先 |
|---|---|---|
| **LoRA / QLoRA 详解** | 几张消费级 GPU 就能微调 ， 开源主流方案。 LoRA 怎么work 的 | ⭐⭐ |
| **DPO 直接偏好优化** | RLHF 的简化版 ， 现在开源微调都用它。 跟 PPO 的差异 | ⭐⭐ |
| **Synthetic Data 合成数据** | "数据耗尽"怎么办？ 用强模型造数据训弱模型 ， Phi / Qwen 都靠它 | ⭐⭐ |
| **GRPO / 推理模型训练** | DeepSeek R1 怎么训出来的 ， 跟 PPO 不一样的简化算法 | ⭐ |

---

## F. AI 经济 / 商业 / 行业图 ── 看趋势

| 话题 | 为什么写 | 优先 |
|---|---|---|
| **大模型成本趋势** | 同等能力的模型每年降价 10× ， 这事到 2026 还在继续 | ⭐⭐ |
| **Open vs Closed 模型收敛** | Llama / Qwen / DeepSeek 在很多任务已经追平 GPT-4 ， 选型逻辑变了 | ⭐⭐ |
| **中国 AI 模型版图** | DeepSeek / Qwen / Kimi / 智谱 / MiniMax / 豆包 ， 都在做什么 | ⭐⭐ |
| **AI Infra 价值链** | GPU → 云 → 推理服务 → 应用 ， 钱怎么流的。 PM 视角 | ⭐⭐ |
| **AI 应用市场图谱** | 哪些赛道有商业模式 ， 哪些是"套壳" ， 客观看 | ⭐ |
| **Scaling Laws 还成立吗** | 2024 后"撞墙说" vs "继续 scale 说"。 行业争议焦点 | ⭐ |

---

## G. 趣味 / 视角类 ── 不那么硬核 ， 但有讨论度

| 话题 | 为什么写 | 优先 |
|---|---|---|
| **AI 时代的写作** | 90% 文章是 AI 写的 ， 那"我写的"还有什么价值 | ⭐⭐ |
| **AI 替代 vs 增强** | 看真实数据 ：哪些岗位真被替代 ， 哪些只是"提效" | ⭐⭐ |
| **Vibe Coding 是什么** | 不写代码 ， 只跟 AI 描述需求 ， 真能跑通生产吗 | ⭐⭐ |
| **AI 信任与背锅** | 客服 AI 答错了 ， 法律责任在谁。 产品上线绕不开的问题 | ⭐ |
| **AI 教育的尴尬** | 学生用 AI 写作业 ， 老师用 AI 改 ， 教育还剩什么 | ⭐ |
| **AI 黑话辞典** | "Agentic"、 "context window"、 "RAG"、 "MoE" ， 圈外人怎么听懂 | ⭐ |

---

## H. 仪表盘类（一图看完）

| 话题 | 为什么写 |
|---|---|
| **Prompt Engineering 总集篇** | 把零碎技巧（CoT / few-shot / 角色扮演 / structured output）汇总一图 |
| **2026 AI 关键词年鉴** | 这一年涌现的新词：Agentic / Context Engineering / Test-time Compute / Computer Use 等 |
| **RAG 全流程总集篇** | Chunking + Embedding + Vector DB + Retriever + Rerank ， 已有的几篇串成系统图 |

---

## 我推荐的"下一批"组合（4 篇打包发）

| 顺序 | 主题 | 理由 |
|---|---|---|
| 1 | **AI Agent 是什么** | 趋势主线 ， 流量最大 |
| 2 | **选模型决策框架** | PM 询问率 No.1 |
| 3 | **AI 产品成本全景** | 接 Token / Prompt Caching 的完美延续 |
| 4 | **VLM 视觉语言模型** | 把"懂图"也补进知识体系 |

---

## 来源（联网搜得到的趋势支撑）

- [Product School: AI Product Managers Are the PMs That Matter in 2026](https://productschool.com/blog/artificial-intelligence/guide-ai-product-manager)
- [IBM: AI tech trends predictions 2026](https://www.ibm.com/think/news/ai-tech-trends-predictions-2026)
- [Switas: 7 Agentic & LLM Breakthroughs March 2026](https://www.switas.com/articles/the-ai-avalanche-7-agentic-llm-breakthroughs-reshaping-march-2026)
- [Salesforce: 8 Ways AI Agents Are Evolving in 2026](https://www.salesforce.com/blog/ai-agent-trends-2026/)
- [Clarifai: Top LLMs and AI Trends for 2026](https://www.clarifai.com/blog/llms-and-ai-trends)
- [bytebytego: What's Next in AI: Five Trends to Watch in 2026](https://blog.bytebytego.com/p/whats-next-in-ai-five-trends-to-watch)
- [Multimodal AI and Vision-Language Models 2026 (Zylos)](https://zylos.ai/research/2026-01-13-multimodal-ai-vision-language-models)
- [Spheron: AI Inference Cost Economics in 2026](https://www.spheron.network/blog/ai-inference-cost-economics-2026/)
- [DEV: Open vs Closed LLMs in 2026 Convergence](https://dev.to/aibughunter/open-vs-closed-llms-in-2026-the-game-changing-convergence-033215-2nea)
