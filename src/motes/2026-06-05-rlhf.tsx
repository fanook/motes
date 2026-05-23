import {
  Paper,
  Section,
  Changelog,
  HAND,
  PEN,
  INK,
  INK_SEPIA,
  INK_RED,
  INK_GREEN,
  FluidRoughBox,
  RoughUnderline,
} from '../components/handwriting';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: 'RLHF',
  date: '2026-06-05',
  tags: ['AI 入门', 'LLM', '对齐'],
  summary:
    '让 ChatGPT 像"懂事的助手"而不是"网络文本接龙机"。 三阶段流程、 PPO / DPO 演化、 对齐的代价。',
};

function Term({ en, ipa, ch }: { en: string; ipa?: string; ch?: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 flex-wrap">
      <strong style={{ color: INK_SEPIA }}>{en}</strong>
      {ipa && (
        <span
          className="text-xs sm:text-sm text-stone-400"
          style={{ fontFamily: 'var(--font-hand-pen)' }}
        >
          {ipa}
        </span>
      )}
      {ch && <span className="text-xs sm:text-sm text-stone-500">≈ {ch}</span>}
    </span>
  );
}

export default function Mote() {
  return (
    <Paper>
      <header className="mb-6 sm:mb-8">
        <h1
          className="text-3xl sm:text-5xl leading-tight"
          style={{ fontFamily: HAND, color: INK_SEPIA }}
        >
          RLHF
        </h1>
        <div className="mt-1">
          <RoughUnderline width={140} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— 用人类反馈对齐模型
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          预训练完的 LLM 像个"网络文本接龙机"： 给它"今天天气真"， 它会接"不错， 适合出门"。
          但这<strong>不等于</strong>一个有用的助手 ——
          你问"怎么写 Python 排序"， 它可能复述论坛口水。
        </p>
        <p>
          <Term en="RLHF" ch="Reinforcement Learning from Human Feedback， 人类反馈强化学习" />
          就是把"接龙机"训练成"听话的助手" 的关键技术。
        </p>
        <p className="pt-1">
          ChatGPT 2022 年炸圈， 主要功劳就在这。 论文 InstructGPT （Ouyang et al. 2022 <sup>[1]</sup>）。
        </p>
      </div>

      <Section title="一、三阶段流程" underlineWidth={170}>
        <p><strong>阶段 1：SFT（监督微调）</strong></p>
        <p>
          人工写大量"理想的问答对"， 用标准 fine-tune 教模型"该这么答"。
          这一步给模型基本的"听指令"能力。 但量有限， 覆盖不全。
        </p>

        <p className="pt-3"><strong>阶段 2：训练奖励模型（Reward Model， RM）</strong></p>
        <p>
          对同一个 prompt， 让 SFT 模型生成 4~9 个不同回答。 人工标注员
          <strong style={{ color: INK_SEPIA }}>排序</strong>（从最好到最差）。
          再训一个<strong>奖励模型</strong>， 输入 (prompt, 回答)， 输出一个分数 ——
          模拟"人类有多喜欢这个回答"。
        </p>
        <p className="text-sm sm:text-base text-stone-500">
          注意：不是让人打绝对分（0~10）， 而是<strong>相对排序</strong>。
          人对"哪个更好"的判断比"打分"稳定得多。
        </p>

        <p className="pt-3"><strong>阶段 3：用 RL 优化策略</strong></p>
        <p>
          把 SFT 模型当作 RL 中的<strong>策略</strong>， 让它生成回答， 用 RM 给它打分（reward），
          再用 <Term en="PPO" ch="Proximal Policy Optimization" /> 算法朝高分方向更新参数。
        </p>
        <p>
          关键技巧：加一个<strong style={{ color: INK_RED }}>KL 散度惩罚</strong>，
          约束策略不能偏离 SFT 太远， 避免模型"为了高分胡说"。
        </p>
      </Section>

      <Section title="二、为什么需要这三步" underlineWidth={210}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>SFT 教"形式"</strong> —— 告诉模型"这样说话才像助手"
          </li>
          <li>
            <strong>RM 学"偏好"</strong> —— 把模糊的"什么算好回答"编码成可微的分数函数
          </li>
          <li>
            <strong>RL 让模型探索</strong> —— 自己生成、 自己学。 不需要人写完美回答， 只需要人会评判
          </li>
        </ul>
        <p className="pt-2">
          这套思路最大的洞见：
          <strong style={{ color: INK_RED }}>评判 ≠ 写。 人评判好坏比人写完美回答容易得多</strong>。
          所以可以低成本地大规模标注。
        </p>
      </Section>

      <Section title="三、效果有多大" underlineWidth={170}>
        <p>
          InstructGPT 论文里的关键数字 <sup>[1]</sup> ——
        </p>
        <div
          className="mt-2 p-3 rounded-sm text-base sm:text-lg"
          style={{ backgroundColor: '#d1fae5', fontFamily: PEN, color: INK }}
        >
          经过 RLHF 训练的 <strong>InstructGPT 1.3B</strong>
          ， 人类评测时比<strong>未对齐的 GPT-3 175B</strong>（参数大 100 倍）
          <strong style={{ color: INK_RED }}>更受偏好</strong>。
        </div>
        <p className="pt-3">
          意思是：对齐能换来比"参数翻 100 倍"还大的人类感知质量提升。 这是行业立刻all-in RLHF 的核心原因。
        </p>
      </Section>

      <Section title="四、PPO 之后的演化" underlineWidth={200}>
        <p>
          PPO 工程实现复杂， RM + RL 两阶段也容易不稳。 后续有几条简化路径：
        </p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>DPO</strong> （Direct Preference Optimization， Rafailov et al. 2023 <sup>[2]</sup>） ——
            数学等价于"RM + RL"， 但实现上只需 SFT 风格的训练， 不需要单独 RM、 不需要 RL。
            现在的开源 fine-tuning 主流是 DPO
          </li>
          <li>
            <strong>RLAIF</strong> —— Reinforcement Learning from <em>AI</em> Feedback。
            用更强的 LLM 当评判， 替代人工标注， 大幅降低成本（Anthropic 的 <Term en="Constitutional AI" /> 是代表）
          </li>
          <li>
            <strong>GRPO</strong> （Shao et al. 2024， DeepSeek 提出） —— 去掉了 PPO 里的 value model，
            DeepSeek R1 / Qwen 等推理模型大量采用
          </li>
        </ul>
      </Section>

      <Section title="五、对齐换来什么 / 代价" underlineWidth={250}>
        <p><strong style={{ color: INK_GREEN }}>得：</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>更"听话"， 能跟上多轮指令</li>
          <li>更安全， 拒绝危险请求</li>
          <li>风格 / 语气可控</li>
          <li>更少胡说（在常见话题上）</li>
        </ul>

        <p className="pt-3"><strong style={{ color: INK_RED }}>失：</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>
            <strong>Alignment tax</strong> —— 部分原始能力被对齐削弱（创意写作、 罕见知识召回）
          </li>
          <li>
            <strong>奉承（sycophancy）</strong> —— 倾向迎合用户立场， 即使不对
          </li>
          <li>
            <strong>过度拒绝</strong> —— 把无害请求当成有害， 误杀
          </li>
          <li>
            <strong>难以审计</strong> —— RM 是个黑盒， 你不知道它"喜欢什么"
          </li>
        </ul>
      </Section>

      <Section title="六、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="RLHF" ch="人类反馈强化学习" /></li>
          <li><Term en="SFT" ch="Supervised Fine-Tuning， 监督微调" /></li>
          <li><Term en="Reward Model (RM)" ch="奖励模型， 给回答打分" /></li>
          <li><Term en="PPO" ch="Proximal Policy Optimization" /></li>
          <li><Term en="DPO" ch="Direct Preference Optimization， 现代主流" /></li>
          <li><Term en="GRPO" ch="DeepSeek 提出的简化 RL 算法" /></li>
          <li><Term en="RLAIF" ch="用 AI 替代人当评判" /></li>
          <li><Term en="Constitutional AI" ch={'Anthropic 的"宪法式"对齐方法'} /></li>
          <li><Term en="KL divergence" ch="衡量两个分布差异， RLHF 里防策略漂移" /></li>
          <li><Term en="Alignment tax" ch="对齐税， 原始能力的损失" /></li>
        </ul>
      </Section>

      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>RLHF 用"评判更容易"这个 wisdom，</p>
            <p>把"接龙机"调教成"懂事的助手"。</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            Ouyang, L. et al. (2022).{' '}
            <em>Training Language Models to Follow Instructions with Human Feedback</em>. NeurIPS 2022.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2203.02155"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2203.02155
            </a>
            （InstructGPT， RLHF 在 LLM 上落地的代表作）
          </li>
          <li>
            Rafailov, R. et al. (2023).{' '}
            <em>Direct Preference Optimization: Your Language Model is Secretly a Reward Model</em>. NeurIPS 2023.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2305.18290"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2305.18290
            </a>
            （DPO， 简化 RLHF）
          </li>
          <li>
            Bai, Y. et al. (2022).{' '}
            <em>Constitutional AI: Harmlessness from AI Feedback</em>. Anthropic.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2212.08073"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2212.08073
            </a>
            （RLAIF 的代表）
          </li>
          <li>
            Shao, Z. et al. (2024).{' '}
            <em>DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models</em>. arXiv 2402.03300.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2402.03300"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2402.03300
            </a>
            （GRPO 提出）
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
