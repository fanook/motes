import { useEffect, useRef } from 'react';
import rough from 'roughjs';
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
  RoughBarChart,
} from '../components/handwriting';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: 'Context Window',
  date: '2026-05-23',
  tags: ['AI 入门', 'LLM'],
  summary:
    '为什么 1M 上下文 ≠ 真能用 1M：注意力的二次复杂度、 RULER 基准、 lost-in-the-middle、 实战策略。',
};

function Term({
  en,
  ipa,
  ch,
}: {
  en: string;
  ipa?: string;
  ch?: string;
}) {
  return (
    <span className="whitespace-nowrap">
      <strong style={{ color: INK_SEPIA }}>{en}</strong>
      {ipa && (
        <span
          className="text-xs sm:text-sm text-stone-400"
          style={{ fontFamily: 'var(--font-hand-pen)' }}
        >
          {" "}{ipa}
        </span>
      )}
      {ch && (
        <span className="text-xs sm:text-sm text-stone-500"> ≈ {ch}</span>
      )}
    </span>
  );
}

/* ---------- 二次复杂度示意：n × n 注意力矩阵 ---------- */
function QuadraticGrid() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const SVG_NS = 'http://www.w3.org/2000/svg';
    // 三个小矩阵代表 n=2, n=4, n=8 的"格子数"
    const draw = (cx: number, cy: number, n: number, seed: number, label: string) => {
      const cell = 8;
      const size = n * cell;
      // 整体方框
      svg.appendChild(
        rc.rectangle(cx, cy, size, size, {
          stroke: INK_SEPIA,
          strokeWidth: 1.2,
          roughness: 1.3,
          seed,
        })
      );
      // 内部网格线
      for (let i = 1; i < n; i++) {
        svg.appendChild(
          rc.line(cx + i * cell, cy, cx + i * cell, cy + size, {
            stroke: INK_SEPIA,
            strokeWidth: 0.6,
            roughness: 0.8,
            seed: seed + i,
          })
        );
        svg.appendChild(
          rc.line(cx, cy + i * cell, cx + size, cy + i * cell, {
            stroke: INK_SEPIA,
            strokeWidth: 0.6,
            roughness: 0.8,
            seed: seed + 100 + i,
          })
        );
      }
      // 标签
      const t = document.createElementNS(SVG_NS, 'text');
      t.setAttribute('x', String(cx + size / 2));
      t.setAttribute('y', String(cy + size + 18));
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('font-family', 'Kalam, "Ma Shan Zheng", cursive');
      t.setAttribute('font-size', '13');
      t.setAttribute('fill', INK);
      t.textContent = label;
      svg.appendChild(t);
    };
    draw(30, 30, 2, 501, 'n=2  → 4 格');
    draw(130, 25, 4, 510, 'n=4  → 16 格');
    draw(230, 15, 8, 520, 'n=8  → 64 格');
  }, []);
  return (
    <svg
      ref={ref}
      viewBox="0 0 320 120"
      className="w-full max-w-md mx-auto block"
    />
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
          Context Window
        </h1>
        <div className="mt-1">
          <RoughUnderline width={250} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— 为什么 1M ≠ 真能用 1M
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          各家厂商都在卷"上下文长度"：1M、 2M、 10M……
        </p>
        <p>
          但<strong style={{ color: INK_RED }}>"标称能塞"</strong>和
          <strong style={{ color: INK_RED }}>"塞了还能正常工作"</strong>
          —— 是两回事。
        </p>
        <p className="pt-1">
          这一篇讲清楚 ——
          为什么变大是难题、 标称容量背后有什么打折、 实战上怎么用。
        </p>
      </div>

      <Section title="一、当前都到哪一档了（2026-05）" underlineWidth={300}>
        <p>截至 2026 上半年， 主流模型标称的 input context window：</p>
        <div className="mt-3">
          <RoughBarChart
            items={[
              { label: 'Claude Opus 4.7', value: 1000, fill: '#d1fae5', suffix: 'k' },
              { label: 'Claude Sonnet 4.6', value: 1000, fill: '#d1fae5', suffix: 'k' },
              { label: 'GPT-5.5 / 5.4', value: 400, fill: '#dbeafe', suffix: 'k' },
              { label: 'Gemini 2.5 Pro', value: 1000, fill: '#ede9fe', suffix: 'k' },
              { label: 'Gemini 3 Pro', value: 2000, fill: '#ede9fe', suffix: 'k' },
            ]}
          />
        </div>
        <p className="pt-3 text-sm sm:text-base text-stone-500">
          数据来源：各家官方 docs / pricing 页 <sup>[1][2][3]</sup>。
        </p>
        <p className="pt-2">
          直觉换算：1M token ≈ 75 万英文词 ≈ 50 万汉字 ≈ 一本长篇小说。
        </p>
      </Section>

      <Section title="二、为什么变大是难题：二次复杂度" underlineWidth={320}>
        <p>
          Transformer 的核心是<Term en="self-attention" ch="自注意力" />：
          每个 token 都要跟所有其他 token 算一次相关性。
        </p>
        <p>
          所以 n 个 token 的注意力计算量是
          <strong style={{ color: INK_RED }}> O(n²)</strong>。
        </p>

        <div className="mt-3 sm:mt-4">
          <QuadraticGrid />
        </div>

        <p className="pt-3">
          n=2k 跟 n=2M 的差距：<strong>百万倍</strong>。 这意味着 ——
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li><strong>计算成本</strong>飞涨</li>
          <li><strong>显存占用</strong>飞涨（KV cache 也是 O(n)）</li>
          <li><strong>延迟（TTFT）</strong>显著拖长， prefill 阶段最受影响</li>
        </ul>

        <p className="pt-3 text-sm sm:text-base text-stone-500">
          所以业界做了大量"逼近"工作：sliding window attention（Mistral 等）、
          sparse attention、 ring attention、 FlashAttention 优化内存访问 等。
          但本质上， 长上下文仍然是<strong>贵的、 慢的</strong>。
        </p>
      </Section>

      <Section title='三、"标称"和"真能用"差多少？' underlineWidth={300}>
        <p>
          <Term en="RULER" ch="一个长上下文评测基准" /> 论文（Hsieh et al. 2024， COLM <sup>[4]</sup>）
          直接打脸：
        </p>
        <p
          className="mt-2 p-3 rounded-sm text-base sm:text-lg"
          style={{ backgroundColor: '#fee2e2', fontFamily: PEN, color: INK }}
        >
          "声称 32K context 的模型， <strong>只有一半</strong>能在 32K 长度上
          维持令人满意的表现。"
        </p>
        <p className="pt-3">
          原因：经典的 <Term en="Needle in a Haystack" ch="海捞针" /> 测试
          （Kamradt 2023）—— 把一句"针"埋在大段无关文本里， 问模型能不能找到 ——
          太简单了。 大多数模型都能完美通过， 但这<strong>不代表它真在"用"上下文</strong>。
        </p>
        <p className="pt-2">
          RULER 引入了多步追踪、 聚合、 多 needle 等更难的任务，
          才暴露了"effective context"远低于"advertised context"。
        </p>
      </Section>

      <Section title='四、"丢失中间"现象' underlineWidth={210}>
        <p>
          Liu et al. 2023（TACL <sup>[5]</sup>）经典研究 —— 即使有 effective context，
          模型对窗口
          <strong style={{ color: INK_RED }}>中段</strong>内容的召回明显
          <strong>低于</strong>开头和结尾。
        </p>
        <p className="pt-2">
          U 形曲线（在 Token 那篇里画过， 这里复述结论）：
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>开头："首因效应"， 模型记得最清</li>
          <li>结尾："近因效应"， 离当前生成位置最近， 注意力权重高</li>
          <li>中段：召回率谷底</li>
        </ul>
        <p
          className="mt-3 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          💡 实战推论：写 RAG / system prompt 时， 最关键信息放<strong>头</strong>或<strong>尾</strong>，
          别埋中间。
        </p>
      </Section>

      <Section title={'五、近期发现：远不止"丢中间"'} underlineWidth={260}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>多 needle 推理崩</strong>（MNIAH-R 等基准 <sup>[6]</sup>）
            —— 模型能找到 1 根针， 但要在多根针之间做<strong>多跳推理</strong>，
            正确率断崖式下降
          </li>
          <li>
            <strong>非字面匹配崩</strong>（NoLiMa <sup>[7]</sup>） ——
            "针"和"问题"用同义但不同字眼时， 检索能力大幅退化
          </li>
          <li>
            <strong>distraction</strong> —— 上下文里有相关但
            <strong style={{ color: INK_RED }}>无关或相反</strong>
            的信息时， 模型容易被带偏
          </li>
          <li>
            <strong>位置编码（RoPE）外推失效</strong> ——
            训练时只见过 8k token， 强行推到 128k， 远端 token 的"位置感"
            会失真。 新模型靠 YaRN / NTK-aware 等技巧扩展， 但越远越脆弱
          </li>
        </ul>
      </Section>

      <Section title="六、价格的代价" underlineWidth={170}>
        <p>
          上下文长度<strong>不是"开了 1M 就免费用"</strong>。 每次请求都按
          input token 数计费， 也按 token 数算延迟。
        </p>
        <p className="pt-2">举例（Claude Sonnet 4.6 input $3 / MTok）：</p>
        <div
          className="p-3 rounded-sm space-y-1 text-sm sm:text-base tabular-nums"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN, color: INK }}
        >
          <p>1 次请求塞 10k token：$0.03</p>
          <p>1 次请求塞 200k token：$0.60</p>
          <p>1 次请求塞 1M token：<strong>$3</strong></p>
          <p>1 万次塞满 1M：<strong>$30,000</strong></p>
        </div>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          所以"我把整本书塞进去"听着爽， 真做产品时要算明白这笔账。
          配合 prompt caching 能省 90% （见 Prompt Caching 那篇）。
        </p>
      </Section>

      <Section title='七、长上下文 vs RAG：怎么选' underlineWidth={260}>
        <p><strong>长上下文好用的场景：</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>文档分析 / 跨段总结（信息密度高、 全局推理）</li>
          <li>代码理解（跨文件依赖）</li>
          <li>多轮对话保留历史</li>
          <li>少量调用、 一次性请求</li>
        </ul>

        <p className="pt-3"><strong>该用 RAG 的场景：</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>知识库大到不可能整体塞下（产品文档、 wiki、 公司全部文件）</li>
          <li>高频调用， 成本敏感</li>
          <li>知识需要频繁更新（不想每次更新都重训）</li>
          <li>需要可解释、 可追溯的来源</li>
        </ul>

        <p
          className="mt-3 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          💡 大多数生产系统是<strong>混合</strong>：RAG 先做粗筛， 把最相关的几 k token
          塞进 prompt 用模型推理。 单纯靠"塞 1M"很少是最优解。
        </p>
      </Section>

      <Section title="八、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li>
            <Term en="Context window" ipa="/ˈkɑːntɛkst ˈwɪndoʊ/" ch="上下文窗口" />
          </li>
          <li>
            <Term en="Effective context" ch="有效上下文， 实际可靠用的长度" />
          </li>
          <li>
            <Term en="Needle in a haystack (NIAH)" ch="海捞针测试" />
          </li>
          <li>
            <Term en="RULER" ch="更难的长上下文基准， 比 NIAH 严格" />
          </li>
          <li>
            <Term en="Lost in the middle" ch="窗口中段召回低的现象" />
          </li>
          <li>
            <Term en="Quadratic attention" ch="二次复杂度， O(n²)" />
          </li>
          <li>
            <Term en="RoPE" ch="Rotary Position Embedding， 主流位置编码" />
          </li>
        </ul>
      </Section>

      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>标称 1M 的窗口， 真能<strong>有效用</strong>到的部分常常少得多。</p>
            <p>容量是上限， 不是"任意塞都管用"的承诺。</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            Anthropic. <em>Pricing</em>.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://platform.claude.com/docs/en/about-claude/pricing"
              target="_blank"
              rel="noreferrer"
            >
              platform.claude.com/docs/en/about-claude/pricing
            </a>
            （accessed 2026-05-26；Opus 4.7 / Sonnet 4.6 标配 1M context）
          </li>
          <li>
            OpenAI. <em>API Pricing</em>.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://developers.openai.com/api/docs/pricing"
              target="_blank"
              rel="noreferrer"
            >
              developers.openai.com/api/docs/pricing
            </a>
            （accessed 2026-05-26；GPT-5.x 400k context）
          </li>
          <li>
            Google. <em>Gemini models</em>.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://ai.google.dev/gemini-api/docs/models"
              target="_blank"
              rel="noreferrer"
            >
              ai.google.dev/gemini-api/docs/models
            </a>
            （Gemini 2.5/3 Pro: 1M~2M context）
          </li>
          <li>
            Hsieh, C-P. et al. (2024).{' '}
            <em>RULER: What's the Real Context Size of Your Long-Context Language Models?</em>{' '}
            COLM 2024.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2404.06654"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2404.06654
            </a>
          </li>
          <li>
            Liu, N. F. et al. (2023).{' '}
            <em>Lost in the Middle: How Language Models Use Long Contexts</em>. TACL.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2307.03172"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2307.03172
            </a>
          </li>
          <li>
            <em>Reasoning on Multiple Needles In A Haystack</em>. arXiv 2504.04150.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2504.04150"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2504.04150
            </a>
          </li>
          <li>
            <em>NoLiMa: Long-Context Evaluation Beyond Literal Matching</em>. arXiv 2502.05167.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2502.05167"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2502.05167
            </a>
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
