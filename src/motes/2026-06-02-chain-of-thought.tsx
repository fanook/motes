import {
  Paper,
  Section,
  Changelog,
  HAND,
  PEN,
  INK,
  INK_SEPIA,
  INK_RED,
  FluidRoughBox,
  RoughUnderline,
} from '../components/handwriting';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: 'Chain of Thought',
  date: '2026-06-02',
  tags: ['AI 入门', 'LLM', 'Prompting'],
  summary: '"想想再答"为什么管用。 从一句魔法 prompt 到 reasoning 模型的演化。',
};

function Term({ en, ipa, ch }: { en: string; ipa?: string; ch?: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 flex-wrap">
      <strong style={{ color: INK_SEPIA }}>{en}</strong>
      {ipa && (
        <span
          className="text-xs sm:text-sm text-stone-400"
          style={{ fontFamily: 'ui-monospace, Consolas, monospace' }}
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
          Chain of Thought
        </h1>
        <div className="mt-1">
          <RoughUnderline width={290} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— 让模型"想想再答"
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          问题："罗杰有 5 个网球。 他又买了 2 罐网球， 每罐 3 个。 他现在有几个？"
        </p>
        <p>
          直接让模型答 → 经常错（特别是早期模型）。
        </p>
        <p>
          但只要 prompt 末尾加一句
          <strong style={{ color: INK_RED }}>"Let's think step by step"</strong>，
          准确率显著提升。
        </p>
        <p className="pt-2">
          这个简单做法叫 <Term en="Chain of Thought" ch="思维链" /> （Wei et al. 2022 <sup>[1]</sup>，
          Kojima et al. 2022 <sup>[2]</sup>）。
        </p>
      </div>

      <Section title="一、为什么管用？" underlineWidth={170}>
        <p>
          模型每次只预测一个 token （详见 [Token]、 [Sampling]）。 它没有"先在脑子里想清楚再开口"的机制。
        </p>
        <p>
          直接答 → "21"（一个 token 内做完所有推理）—— 容易错。
        </p>
        <p>
          让它先写中间步骤 ——
        </p>
        <div
          className="mt-2 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN, color: INK }}
        >
          <p>原来有 5 个。</p>
          <p>买了 2 罐 × 3 个 = 6 个。</p>
          <p>总共 5 + 6 = 11 个。</p>
          <p>答案：<strong>11</strong>。</p>
        </div>
        <p className="pt-2">
          —— 每一步都是模型可以"局部正确"地推理的小步骤。
          相当于把<strong>一次性的复杂计算</strong>分解成<strong>多个简单步骤</strong>，
          让模型有机会用更多 token 思考。
        </p>
      </Section>

      <Section title="二、两种触发方式" underlineWidth={170}>
        <p>
          <strong>1. Few-shot CoT</strong>（Wei et al. 2022 原版）—— 在 prompt 里给几个
          "问题 + 推理过程 + 答案"的示例， 让模型模仿
        </p>
        <p>
          <strong>2. Zero-shot CoT</strong>（Kojima et al. 2022）—— 不用示例， 只在末尾加
          <code className="px-1 py-0.5 bg-stone-100 rounded text-sm">"Let's think step by step."</code>
          —— 一个魔咒就提升性能
        </p>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          中文场景用 "请一步一步思考"、 "让我一步步分析" 之类的也有效果。
        </p>
      </Section>

      <Section title="三、进阶变种" underlineWidth={140}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>Self-consistency</strong>（Wang et al. 2022）——
            用 temperature&gt;0 采样多条思考链， 投票选最常出现的答案
          </li>
          <li>
            <strong>Tree of Thoughts</strong>（Yao et al. 2023）—— 推理走树状结构，
            每步多个候选， 可以回溯
          </li>
          <li>
            <strong>Plan-and-Solve</strong> —— 先让模型生成"计划"， 再执行
          </li>
          <li>
            <strong>ReAct</strong> —— 思考 + 调工具 + 看结果 + 再思考。 是 Agent 的基础范式
          </li>
        </ul>
      </Section>

      <Section title='四、推理模型：CoT 内化' underlineWidth={210}>
        <p>
          2024 年开始， <strong>Reasoning 模型</strong>（OpenAI o1/o3、 Anthropic Claude 4.7 thinking、
          DeepSeek R1） 把思考链<strong>内化</strong>到训练里。
        </p>
        <p>它们的特点：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>不需要用户写 prompt 触发"think step by step"</li>
          <li>会自动产生<strong>很长</strong>的内部思考（可能几千 token）</li>
          <li>用户只看到最终答案， 但 API 按 reasoning token 也计费</li>
          <li>数学、 代码、 逻辑题准确率大幅提升</li>
          <li>对 temperature / top-p 不敏感， 内部思考已决定路径</li>
        </ul>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          所以"CoT 是 prompt 技巧"这话， 在 2024 后半场逐渐过时 ——
          它已经从"用户技巧"演化成了"模型能力"。
        </p>
      </Section>

      <Section title="五、什么时候用 / 不用" underlineWidth={200}>
        <p><strong>该用：</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>多步数学 / 推理</li>
          <li>需要分类 / 决策的问题（先列依据再下结论）</li>
          <li>需要解释 / 引用的回答</li>
          <li>用普通（非推理）模型时， CoT 性价比很高</li>
        </ul>

        <p className="pt-3"><strong>别用 / 没必要：</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>简单查询、 翻译、 改写</li>
          <li>用推理模型时， 自带 thinking， 不需要叠加</li>
          <li>对延迟敏感的场景（推理过程也要时间）</li>
          <li>需要纯结构化输出的场景（CoT 会"啰嗦"一段才给结果）</li>
        </ul>
      </Section>

      <Section title="六、几个坑" underlineWidth={140}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>CoT 看起来对 ≠ 答案对</strong> —— 模型有时推理过程合理， 但答案抄错；
            或者推理是事后合理化（已经选好了答案再补推理）
          </li>
          <li>
            <strong>占 output token</strong> —— 输出贵于输入（详见 [Sampling] / [Prompt Caching]），
            一长串思考是真要钱的
          </li>
          <li>
            <strong>结构化输出冲突</strong> —— JSON 输出 + CoT 要么用"先想再给 JSON"的两段式， 要么放弃 CoT
          </li>
          <li>
            <strong>对小模型不一定有用</strong> —— Wei 2022 论文里就指出： CoT 主要在
            大模型 (~100B+) 上才显著有效， 小模型加 CoT 提升有限甚至有害
          </li>
        </ul>
      </Section>

      <Section title="七、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="Chain of Thought (CoT)" ch="思维链" /></li>
          <li><Term en="Few-shot CoT" ch="少样本思维链， 给示例" /></li>
          <li><Term en="Zero-shot CoT" ch="零样本思维链， 直接加魔咒" /></li>
          <li><Term en="Self-consistency" ch="多路采样 + 投票" /></li>
          <li><Term en="Tree of Thoughts" ch="思考树" /></li>
          <li><Term en="ReAct" ch="思考 + 行动循环， Agent 范式" /></li>
          <li><Term en="Reasoning model" ch="把思考链内化到训练的模型" /></li>
        </ul>
      </Section>

      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>Chain of Thought 把一次性的"瞬间答"，</p>
            <p>变成可观察、 可校验的"逐步想"。</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            Wei, J. et al. (2022).{' '}
            <em>Chain-of-Thought Prompting Elicits Reasoning in Large Language Models</em>. NeurIPS 2022.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2201.11903"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2201.11903
            </a>
            （CoT 原始论文， few-shot 路线）
          </li>
          <li>
            Kojima, T. et al. (2022).{' '}
            <em>Large Language Models are Zero-Shot Reasoners</em>. NeurIPS 2022.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2205.11916"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2205.11916
            </a>
            （"Let's think step by step" 的来源）
          </li>
          <li>
            Wang, X. et al. (2022).{' '}
            <em>Self-Consistency Improves Chain of Thought Reasoning</em>. ICLR 2023.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2203.11171"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2203.11171
            </a>
          </li>
          <li>
            Yao, S. et al. (2023).{' '}
            <em>Tree of Thoughts: Deliberate Problem Solving with Large Language Models</em>. NeurIPS 2023.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2305.10601"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2305.10601
            </a>
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
