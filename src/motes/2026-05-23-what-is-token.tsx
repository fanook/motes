import { useEffect, useMemo, useRef, useState } from 'react';
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
  INK_GREEN,
  RoughBox,
  FluidRoughBox,
  RoughArrow,
  RoughUnderline,
  RoughBarChart,
} from '../components/handwriting';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: 'Token 是什么',
  date: '2026-05-23',
  tags: ['AI 入门', 'LLM'],
  summary:
    'BPE 算法、 自回归生成、 词表权衡、 真实定价、 上下文经济学。',
};

/* ---------- 简化 tokenizer（仅供交互演示用） ---------- */
function tokenize(text: string): string[] {
  if (!text) return [];
  const tokens: string[] = [];
  const regex = /([一-龥])|([a-zA-Z]+)|([0-9]+)|([^\s\w])/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m[1]) tokens.push(m[1]);
    else if (m[2]) {
      const w = m[2];
      if (w.length <= 6) tokens.push(w);
      else for (let i = 0; i < w.length; i += 4) tokens.push(w.slice(i, i + 4));
    } else if (m[3]) tokens.push(m[3]);
    else if (m[4]) tokens.push(m[4]);
  }
  return tokens;
}

const tokenColors = [
  '#fef3c7',
  '#dbeafe',
  '#fce7f3',
  '#d1fae5',
  '#ede9fe',
  '#ffedd5',
];

/* ---------- 内部小组件 ---------- */

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
      {ch && (
        <span className="text-xs sm:text-sm text-stone-500">≈ {ch}</span>
      )}
    </span>
  );
}

function BPERow({ tokens, note }: { tokens: string[]; note?: string }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex flex-wrap gap-0.5">
        {tokens.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs sm:text-sm"
            style={{
              backgroundColor: tokenColors[i % tokenColors.length],
              fontFamily: 'ui-monospace, Consolas, monospace',
              color: INK,
              minWidth: 20,
            }}
          >
            {t}
          </span>
        ))}
      </div>
      {note && (
        <span
          className="text-xs sm:text-sm text-stone-500"
          style={{ fontFamily: PEN }}
        >
          {note}
        </span>
      )}
    </div>
  );
}

function VArrow({ note }: { note?: string }) {
  return (
    <div className="flex items-center gap-2 my-1">
      <span style={{ color: '#a8a29e' }}>↓</span>
      {note && (
        <span
          className="text-xs sm:text-sm text-stone-500"
          style={{ fontFamily: PEN }}
        >
          {note}
        </span>
      )}
    </div>
  );
}

function LostInMiddleCurve() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const w = 320;
    const h = 150;
    const SVG_NS = 'http://www.w3.org/2000/svg';

    svg.appendChild(
      rc.line(28, h - 28, w - 12, h - 28, {
        stroke: INK,
        strokeWidth: 1.4,
        roughness: 1,
        seed: 201,
      })
    );
    svg.appendChild(
      rc.line(28, 12, 28, h - 28, {
        stroke: INK,
        strokeWidth: 1.4,
        roughness: 1,
        seed: 202,
      })
    );

    svg.appendChild(
      rc.curve(
        [
          [34, 30],
          [90, 65],
          [w / 2, 105],
          [w - 90, 70],
          [w - 18, 32],
        ],
        {
          stroke: INK_RED,
          strokeWidth: 2,
          roughness: 1.8,
          seed: 203,
        }
      )
    );

    const txt = (x: number, y: number, text: string, size = 13) => {
      const t = document.createElementNS(SVG_NS, 'text');
      t.setAttribute('x', String(x));
      t.setAttribute('y', String(y));
      t.setAttribute('font-family', 'Kalam, "Ma Shan Zheng", cursive');
      t.setAttribute('font-size', String(size));
      t.setAttribute('fill', '#78716c');
      t.textContent = text;
      svg.appendChild(t);
    };
    txt(30, h - 10, '开头');
    txt(w / 2 - 14, h - 10, '中段');
    txt(w - 50, h - 10, '结尾');
    txt(4, 18, '召回↑');
  }, []);
  return (
    <svg
      ref={ref}
      viewBox="0 0 320 150"
      className="w-full max-w-md mx-auto block"
    />
  );
}

/* ---------- 主组件 ---------- */

export default function Mote() {
  const [input, setInput] = useState('Hello world! 你好世界。');
  const tokens = useMemo(() => tokenize(input), [input]);

  return (
    <Paper>
      {/* 标题 */}
      <header className="mb-6 sm:mb-8">
        <h1
          className="text-3xl sm:text-5xl leading-tight"
          style={{ fontFamily: HAND, color: INK_SEPIA }}
        >
          Token
        </h1>
        <div className="mt-1">
          <RoughUnderline width={150} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— AI 眼里的"小积木"
        </p>
      </header>

      {/* 引言 */}
      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>你跟 AI 聊天时， 它眼里看到的并不是"字"，</p>
        <p>而是一串编号好的小积木。</p>
        <p>
          <span style={{ color: INK_RED, fontWeight: 700 }}>
            这些积木就叫 token。
          </span>
        </p>
        <p className="pt-1 text-sm sm:text-base text-stone-500">
          按 Anthropic 文档：1 token ≈ 英文 4 个字符 ≈ 0.75 个单词
          <sup>[1]</sup>。
        </p>
      </div>

      {/* 流程示意图 */}
      <section className="my-8 sm:my-10 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3 sm:gap-4">
        <FlowItem label="原文">
          <RoughBox width={130} height={50} seed={31} fillColor="#fef9c3">
            <span
              className="text-base sm:text-lg"
              style={{ fontFamily: PEN }}
            >
              hello world
            </span>
          </RoughBox>
        </FlowItem>

        <FlowArrow seed={32} />

        <FlowItem label="切成 token">
          <div className="flex gap-1">
            <RoughBox width={64} height={40} seed={33} fillColor="#dbeafe">
              <span className="text-sm sm:text-base" style={{ fontFamily: PEN }}>
                hello
              </span>
            </RoughBox>
            <RoughBox width={64} height={40} seed={34} fillColor="#fce7f3">
              <span className="text-sm sm:text-base" style={{ fontFamily: PEN }}>
                world
              </span>
            </RoughBox>
          </div>
        </FlowItem>

        <FlowArrow seed={35} />

        <FlowItem label="编成数字 ID">
          <div
            className="text-base sm:text-lg"
            style={{ fontFamily: PEN, color: INK_SEPIA }}
          >
            [N, M, ...]
          </div>
        </FlowItem>

        <FlowArrow seed={36} />

        <FlowItem label="送给模型">
          <div className="text-3xl sm:text-4xl">🧠</div>
        </FlowItem>
      </section>

      {/* ─── 1 为什么要切 ─── */}
      <Section title={'一、为什么要"切"？'} underlineWidth={210}>
        <p>计算机只懂数字， 不懂文字。</p>
        <p>
          所以模型先把句子切成一块块 token， 给每块一个 ID（数字编号）—— 从头到尾它处理的都是数字。
        </p>
        <p className="pt-2">那为什么不直接"一个字一个 token"或"一个词一个 token"？</p>

        <div className="mt-3 space-y-2 sm:space-y-3">
          <ApproachCard
            name="字符级"
            en="char-level"
            verdict="bad"
            desc="每个字母 / 汉字一个 token —— 序列变得很长， 模型学不到词级别的规律。"
          />
          <ApproachCard
            name="词级"
            en="word-level"
            verdict="bad"
            desc="每个单词一个 token —— 词表爆炸（英文 100w+ 词形），遇到新词、 拼错就 OOV (out of vocabulary)。"
          />
          <ApproachCard
            name="子词级"
            en="subword"
            verdict="good"
            desc={
              <>
                介于字母和单词之间。 词表保持 10w~20w，任何词都能拼出来， 常用词仍 1 token。
                <strong style={{ color: INK_RED }}> 现代标准。</strong>
              </>
            }
          />
        </div>
      </Section>

      {/* ─── 2 BPE 算法 ─── */}
      <Section title={'二、BPE：怎么"学会"切的？'} underlineWidth={250}>
        <p>
          <Term en="BPE" ipa="/biː piː iː/" ch="字节对编码 Byte Pair Encoding" />
        </p>
        <p className="pt-1 text-sm sm:text-base text-stone-500">
          算法源头：Philip Gage 1994 年提出的一种数据压缩方法
          <sup>[2]</sup>。Sennrich、 Haddow、 Birch 在 2015 年的论文里把它搬到了 NLP，
          用来解决神经机器翻译的"生僻词"问题 <sup>[3]</sup>。
        </p>
        <p className="pt-2">
          思路：从单字符出发， 反复合并语料里
          <strong style={{ color: INK_RED }}>最高频的两个连续片段</strong>，
          直到词表达到目标大小。
        </p>
        <p className="pt-1">以 <code className="px-1 py-0.5 bg-stone-100 rounded text-sm">unhappiness</code> 为例：</p>

        <div
          className="mt-3 p-3 sm:p-4 rounded-sm space-y-2 overflow-x-auto"
          style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
        >
          <BPERow
            tokens={['u', 'n', 'h', 'a', 'p', 'p', 'i', 'n', 'e', 's', 's']}
            note="初始：每个字符一个 token"
          />
          <VArrow note="合并最高频对 p+p" />
          <BPERow
            tokens={['u', 'n', 'h', 'a', 'pp', 'i', 'n', 'e', 's', 's']}
          />
          <VArrow note="合并 n+e、s+s..." />
          <BPERow tokens={['u', 'n', 'h', 'a', 'pp', 'i', 'ne', 'ss']} />
          <VArrow note="高频组合继续被吸收" />
          <BPERow tokens={['un', 'happi', 'ness']} note="最终" />
        </div>

        <p className="pt-3">这样一来 ——</p>
        <p>✓ 常用词如 <code className="px-1 py-0.5 bg-stone-100 rounded text-sm">the</code>、 <code className="px-1 py-0.5 bg-stone-100 rounded text-sm">happiness</code> 都是 1 token；</p>
        <p>✓ 新造词 <code className="px-1 py-0.5 bg-stone-100 rounded text-sm">unhappily</code> 拆成 <code className="px-1 py-0.5 bg-stone-100 rounded text-sm">un + happi + ly</code>；</p>
        <p>✓ 拼错的 <code className="px-1 py-0.5 bg-stone-100 rounded text-sm">teh</code> 拆成 <code className="px-1 py-0.5 bg-stone-100 rounded text-sm">t + eh</code>， 也不会"看不懂"。</p>

        <p className="pt-3 text-sm sm:text-base text-stone-500">
          常见变种：<Term en="WordPiece" />（BERT、 Google）、 <Term en="SentencePiece" />（T5、 Llama —— 把空格也当字符处理）、 <Term en="Unigram" />。 思路相近， 细节不同。
        </p>
      </Section>

      {/* ─── 3 词表大小的取舍 ─── */}
      <Section title="三、词表大小的取舍" underlineWidth={210}>
        <p>
          <Term en="Vocabulary size" ipa="/vəˈkæbjəleri/" ch="词表大小" />
          —— tokenizer 一共认识多少个不同的 token。
        </p>
        <p className="pt-2">几个真实模型的词表大小：</p>
        <div className="mt-3">
          <RoughBarChart
            items={[
              { label: 'Llama 2', value: 32, fill: '#fee2e2', suffix: 'k' },
              { label: 'GPT-3.5 / 4', value: 100, fill: '#ffedd5', suffix: 'k' },
              { label: 'GPT-4o (o200k)', value: 200, fill: '#dbeafe', suffix: 'k' },
              { label: 'Claude 4.x', value: 200, fill: '#d1fae5', suffix: 'k' },
            ]}
          />
        </div>
        <p className="pt-3 text-sm sm:text-base text-stone-500">
          数据来源：OpenAI tiktoken 文档（cl100k_base ≈ 100k 词， o200k_base ≈ 200k 词）<sup>[4]</sup>；
          Llama 2 model card。 Claude 详细数字未公开， 这里按其多语言能力近似估到与 GPT-4o 一档。
        </p>

        <p className="pt-3"><strong>大词表</strong>：单 token 表达力强、 中文 / 多语言更友好、 序列更短； 但
          <span style={{ color: INK_RED }}> 嵌入层参数随之膨胀</span>。
        </p>
        <p>
          <strong>小词表</strong>：嵌入参数少、 灵活； 但同样文本要更多 token 来表示。
        </p>

        <div
          className="mt-3 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          ⚠️ <strong>反例</strong>：Claude Opus 4.7 反其道而行 ——
          换了新 tokenizer， 同一段文本会比 4.6 / 4.5 多用 <strong>最多 35%</strong> 的 token。
          Anthropic 的解释是新 tokenizer 带来了"广泛任务上的性能提升"<sup>[1]</sup>。
        </div>
      </Section>

      {/* ─── 4 中文为什么贵 ─── */}
      <Section title="四、中文为什么 token 数偏多？" underlineWidth={270}>
        <p>
          底层原因：汉字在 <strong>UTF-8</strong> 编码下是
          <strong style={{ color: INK_RED }}> 3 个字节</strong>， 而英文字母只占 1 字节。
        </p>
        <p>
          早期 tokenizer 主要在英文语料上训练， 没"学到"多少汉字组合。
        </p>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          经验值：老 tokenizer（cl100k_base）下中文 1 字 ≈ 2~3 token；
          o200k_base / Claude 4.x 等新 tokenizer 上， 多数常用汉字 ≈ 1 token。
          具体数值随文本变化， 严谨场合请用 <code className="px-1 py-0.5 bg-stone-100 rounded text-sm">tiktoken</code> 实测。
        </p>
      </Section>

      {/* ─── 5 交互演示 ─── */}
      <Section title="五、自己试试 →" underlineWidth={180}>
        <p className="text-sm sm:text-base text-stone-500">
          （下方为极简演示， 不是真实 tokenizer。 想精确数 token 请用 <code className="px-1 py-0.5 bg-stone-100 rounded text-sm">tiktoken</code> 或 Anthropic 的 <code className="px-1 py-0.5 bg-stone-100 rounded text-sm">count_tokens</code> API。）
        </p>

        <div className="mt-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={2}
            className="w-full p-2 sm:p-3 bg-transparent border-b-2 border-dashed border-stone-400 text-base sm:text-xl focus:outline-none focus:border-amber-700 resize-none"
            style={{ fontFamily: PEN }}
          />
        </div>

        <div className="mt-4 min-h-[3rem] flex flex-wrap items-center gap-1">
          {tokens.length === 0 ? (
            <span
              className="text-stone-400 text-base"
              style={{ fontFamily: PEN }}
            >
              （随便输入点字……）
            </span>
          ) : (
            tokens.map((t, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-sm sm:text-base"
                style={{
                  backgroundColor: tokenColors[i % tokenColors.length],
                  fontFamily: PEN,
                  color: INK,
                }}
              >
                {t}
              </span>
            ))
          )}
        </div>

        <div
          className="mt-3 sm:mt-4 text-lg sm:text-2xl flex items-baseline gap-2"
          style={{ fontFamily: HAND }}
        >
          <span>共</span>
          <span
            className="text-2xl sm:text-4xl"
            style={{ color: INK_RED, fontWeight: 700 }}
          >
            {tokens.length}
          </span>
          <span>个 token（估）</span>
        </div>
      </Section>

      {/* ─── 6 Special tokens ─── */}
      <Section title={'六、特殊 token：让模型知道"现在轮到谁说话"'} underlineWidth={290}>
        <p>
          模型看到的不是纯文本， 而是带"标签"的 token 流。 这些"标签"叫
          <Term en="special tokens" ch="特殊 token" />。
        </p>
        <p className="pt-1">一段对话发给 AI， 真实大致长这样（不同模型的标签格式不一样， 下面是 ChatML 风格示意）：</p>

        <div
          className="mt-3 p-3 sm:p-4 rounded-sm text-xs sm:text-sm leading-relaxed whitespace-pre overflow-x-auto"
          style={{
            backgroundColor: 'rgba(255,255,255,0.6)',
            fontFamily: 'ui-monospace, Consolas, monospace',
            color: INK,
          }}
        >
          {`<|im_start|>`}<span style={{ color: INK_RED }}>system</span>{`
你是一个有用的助手
`}<span style={{ color: INK_RED }}>{`<|im_end|>`}</span>{`
`}<span style={{ color: INK_RED }}>{`<|im_start|>`}</span>{`user
今天天气怎么样？
`}<span style={{ color: INK_RED }}>{`<|im_end|>`}</span>{`
`}<span style={{ color: INK_RED }}>{`<|im_start|>`}</span>{`assistant
`}<span style={{ color: '#78716c' }}>（← 模型从这里开始生成）</span>
        </div>

        <p className="pt-3">常见的特殊 token：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li><strong>BOS / EOS</strong> —— Begin / End Of Sequence， 序列起止</li>
          <li><strong>角色标记</strong> —— system / user / assistant， 切分谁在说话</li>
          <li><strong>工具调用</strong> —— tool call / tool result 等</li>
          <li><strong>多模态占位</strong> —— 图片、 音频被切成 token 后用占位符标识</li>
        </ul>
      </Section>

      {/* ─── 7 自回归生成 ─── */}
      <Section title={'七、模型是怎么"用" token 生成回答的？'} underlineWidth={290}>
        <p>
          模型每次<strong style={{ color: INK_RED }}>只预测 1 个 token</strong>。
          一个一个往后吐 —— 这叫
          <Term en="autoregressive" ipa="/ˌɔːtoʊrɪˈɡrɛsɪv/" ch="自回归" />。
        </p>

        <div
          className="mt-3 p-3 sm:p-4 rounded-sm space-y-2 text-sm sm:text-base"
          style={{
            backgroundColor: 'rgba(255,255,255,0.5)',
            fontFamily: PEN,
          }}
        >
          <p>输入 prompt → token 序列</p>
          <p>↓</p>
          <p>模型为"下一个 token 的所有可能"打分</p>
          <p>↓</p>
          <p>按概率<strong style={{ color: INK_SEPIA }}>采样</strong>选 1 个出来</p>
          <p>↓</p>
          <p>追加到序列末尾， 回到第二步</p>
          <p>↓ ……</p>
          <p>直到遇到 <code className="px-1 bg-stone-100 rounded">EOS</code> 或达到 <code className="px-1 bg-stone-100 rounded">max_tokens</code></p>
        </div>

        <p className="pt-3">三个常见采样参数：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>
            <Term en="temperature" ipa="/ˈtɛmpərətʃər/" /> ——
            高（&gt;1）更随机、 低（→0）更确定
          </li>
          <li>
            <Term en="top-p" />（核采样）—— 只从累计概率前 P% 的 token 里选
          </li>
          <li>
            <Term en="top-k" /> —— 只看分数最高的 k 个 token
          </li>
        </ul>

        <p className="pt-3">
          <Term en="streaming" ipa="/ˈstriːmɪŋ/" ch="流式输出" /> ——
          每生成一个 token 立即推到前端， 体感就是"打字机"效果。
        </p>
      </Section>

      {/* ─── 8 Context window ─── */}
      <Section title={'八、上下文窗口与"丢失中间"'} underlineWidth={250}>
        <p>
          <Term
            en="Context window"
            ipa="/ˈkɑːntɛkst ˈwɪndoʊ/"
            ch="上下文窗口"
          />
          —— 模型一次能"看见"的最大 token 数。
        </p>

        <p className="pt-2">2026 上半年的量级：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>8k —— 早期模型</li>
          <li>128k~200k —— 仍然是普遍主流</li>
          <li>1M —— Claude Opus 4.7 / Sonnet 4.6 已经标配 <sup>[1]</sup></li>
        </ul>

        <p className="pt-3">
          <strong style={{ color: INK_RED }}>但容量 ≠ 实际可用。</strong>
        </p>
        <p>
          <Term en="Lost in the middle" /> 现象（Liu et al. 2023, TACL <sup>[5]</sup>）—— 模型对窗口
          <strong>中段</strong>内容的召回明显低于开头和结尾：
        </p>

        <div className="mt-3 sm:mt-4">
          <LostInMiddleCurve />
        </div>

        <p className="pt-3 text-sm sm:text-base text-stone-500">
          → RAG 系统的实战经验：把最相关的片段放头或尾， 别埋在中间。
        </p>
      </Section>

      {/* ─── 9 三个价格维度 ─── */}
      <Section title="九、价格的三个维度" underlineWidth={210}>
        <p>
          <strong>1. 输入 vs 输出</strong> ——
          输出几乎都比输入贵 <strong style={{ color: INK_RED }}>~5 倍</strong>。
          原因：输入是一次性 prefill（并行计算）， 输出是逐 token 自回归（串行）。
        </p>

        <p className="pt-3"><strong>2. 模型档位</strong> —— 截至 2026-05 主流定价（$ / 1M token）<sup>[1][6]</sup>：</p>

        <div className="mt-2 overflow-x-auto">
          <table
            className="text-sm sm:text-base w-full"
            style={{ fontFamily: PEN, borderCollapse: 'collapse' }}
          >
            <thead>
              <tr style={{ color: INK_SEPIA }}>
                <th className="text-left p-2 border-b-2 border-dashed border-stone-400">模型</th>
                <th className="text-right p-2 border-b-2 border-dashed border-stone-400">输入</th>
                <th className="text-right p-2 border-b-2 border-dashed border-stone-400">输出</th>
              </tr>
            </thead>
            <tbody>
              <PriceRow model="Claude Opus 4.7" input="$5" output="$25" />
              <PriceRow model="Claude Sonnet 4.6" input="$3" output="$15" />
              <PriceRow model="Claude Haiku 4.5" input="$1" output="$5" />
              <PriceRow model="GPT-5.5" input="$5" output="$30" />
              <PriceRow model="GPT-5.4" input="$2.50" output="$15" />
              <PriceRow model="GPT-5.4 mini" input="$0.75" output="$4.50" />
            </tbody>
          </table>
        </div>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">
          * 价格随时变动， 实际以厂商最新公告为准
        </p>

        <p className="pt-4">
          <strong>3. Prompt Caching（提示词缓存）</strong>
        </p>
        <p>
          长 system prompt、 文档 RAG、 few-shot 示例 —— 这部分如果反复使用，
          可以让 API <strong style={{ color: INK_GREEN }}>缓存住</strong>。
        </p>
        <p>
          Anthropic：cache hit = <strong style={{ color: INK_RED }}>0.1×</strong> 输入价（省 90%）；
          OpenAI 类似 <sup>[1][6]</sup>。 长 prompt 应用必开。
        </p>
      </Section>

      {/* ─── 10 多模态 token ─── */}
      <Section title="十、图片、音频也是 token" underlineWidth={250}>
        <p>
          多模态模型并不"看"图片， 而是先把图片切成 patch（小块），
          每块过视觉编码器变成 token， 再喂给同一个 LLM。
        </p>
        <p className="pt-2">
          <strong>Claude 的真实计算方式</strong>（官方文档 <sup>[7]</sup>）：
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>公式：图片 token ≈ <strong>宽 × 高 / 750</strong>（像素）</li>
          <li>除 Opus 4.7 外的模型， 最多 ~1568 token / 张， 长边 ≤ 1568px， 更大的会被先缩放</li>
          <li>Opus 4.7 提到 ~4784 token / 张（更高分辨率支持）</li>
          <li>举例：1000×1000px 图 ≈ <strong>1334 token</strong>； 200×200px ≈ 54 token</li>
        </ul>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          不同厂商公式不一样 —— GPT-4V 早期是"分 tile 计算（每 512px tile ≈ 85 token）"，
          各家细节各看自家文档。
        </p>
      </Section>

      {/* ─── 11 实战速查 ─── */}
      <Section title="十一、实战速查 & 几个坑" underlineWidth={250}>
        <p><strong>估算 thumb rules</strong>：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>英文：1 token ≈ <strong>4 字符</strong> ≈ 0.75 word（Anthropic 官方 <sup>[1]</sup>）</li>
          <li>中文（新 tokenizer）：1 字 ≈ <strong>1 token</strong>， 老 tokenizer 可能 2~3 token</li>
          <li>代码 / JSON：比纯文本多 30~50%（括号、 引号都算）</li>
          <li>Claude 图片：宽 × 高 / 750</li>
        </ul>

        <p className="pt-3"><strong>常见的坑</strong>：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>
            <strong>空格也算 token</strong> ——
            <code className="px-1 bg-stone-100 rounded text-sm">{` hello`}</code>{' '}
            和{' '}
            <code className="px-1 bg-stone-100 rounded text-sm">hello</code> 是
            <strong>不同的</strong> token
          </li>
          <li>
            <strong>数字拆得很怪</strong> —— <code className="px-1 bg-stone-100 rounded text-sm">12345</code> 可能被拆， 因为 tokenizer 从来没"学过"这个完整数字
          </li>
          <li>
            <strong>Emoji 能爆 token</strong> —— 复合 emoji 如 👨‍👩‍👧 由多个码点拼成， 可能要好几 token
          </li>
          <li>
            <strong>JSON 比 YAML 贵</strong> —— 括号、 引号每个都算 token
          </li>
        </ul>

        <p className="pt-3"><strong>怎么数 token？</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>OpenAI：<code className="px-1 bg-stone-100 rounded text-sm">tiktoken</code> Python 库 <sup>[4]</sup></li>
          <li>Anthropic：<code className="px-1 bg-stone-100 rounded text-sm">count_tokens</code> API</li>
          <li>HuggingFace：<code className="px-1 bg-stone-100 rounded text-sm">AutoTokenizer</code></li>
          <li>不精确但够快：<strong>字符数 ÷ 4</strong></li>
        </ul>
      </Section>

      {/* ─── 12 术语小辞典 ─── */}
      <Section title="十二、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="Token" ipa="/ˈtoʊkən/" ch="词元、 切片" /></li>
          <li><Term en="Tokenizer" ipa="/ˈtoʊkənaɪzər/" ch="切分器" /></li>
          <li><Term en="Tokenization" ipa="/ˌtoʊkənɪˈzeɪʃən/" ch="分词过程" /></li>
          <li><Term en="BPE" ch="字节对编码 Byte Pair Encoding" /></li>
          <li><Term en="Embedding" ipa="/ɪmˈbɛdɪŋ/" ch="把 token ID 变成向量" /></li>
          <li><Term en="Vocabulary" ipa="/vəˈkæbjəleri/" ch="词表" /></li>
          <li><Term en="Context window" ipa="/ˈkɑːntɛkst ˈwɪndoʊ/" ch="上下文窗口" /></li>
          <li><Term en="Autoregressive" ipa="/ˌɔːtoʊrɪˈɡrɛsɪv/" ch="自回归生成" /></li>
          <li><Term en="TTFT" ch="Time To First Token， 首 token 延迟" /></li>
          <li><Term en="Throughput" ipa="/ˈθruːpʊt/" ch="吞吐， token/秒" /></li>
          <li><Term en="Prompt caching" ch="提示词缓存" /></li>
        </ul>
      </Section>

      {/* ─── 一句话总结 ─── */}
      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>Token 既是 AI 的"理解单位"，</p>
            <p>也是产品的"成本单位"和"性能单位"。</p>
          </div>
        </FluidRoughBox>
      </section>

      {/* ─── 参考来源 ─── */}
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
            （accessed 2026-05-23；2026 上半年定价、 prompt caching 折扣、 Opus 4.7 新 tokenizer 说明）
          </li>
          <li>
            Gage, P. (1994). <em>A New Algorithm for Data Compression</em>. The C Users Journal. (BPE 算法源头)
          </li>
          <li>
            Sennrich, R., Haddow, B., &amp; Birch, A. (2016).{' '}
            <em>Neural Machine Translation of Rare Words with Subword Units</em>. ACL 2016.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/1508.07909"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/1508.07909
            </a>
            （把 BPE 用到 NLP 的奠基论文）
          </li>
          <li>
            OpenAI. <em>tiktoken</em> （包含 cl100k_base / o200k_base 编码器）。{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://github.com/openai/tiktoken"
              target="_blank"
              rel="noreferrer"
            >
              github.com/openai/tiktoken
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
            （accessed 2026-05-23）
          </li>
          <li>
            Anthropic. <em>Vision</em> docs — 图片 token 计算方法.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://platform.claude.com/docs/en/build-with-claude/vision"
              target="_blank"
              rel="noreferrer"
            >
              platform.claude.com/docs/en/build-with-claude/vision
            </a>
            （accessed 2026-05-23）
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}

/* ---------- 流程图小元件 ---------- */
function FlowItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center">
      {children}
      <span
        className="mt-1 text-sm sm:text-base text-stone-500"
        style={{ fontFamily: HAND }}
      >
        {label}
      </span>
    </div>
  );
}

function FlowArrow({ seed }: { seed: number }) {
  return (
    <>
      <span className="sm:hidden">
        <RoughArrow width={36} height={28} seed={seed} direction="down" />
      </span>
      <span className="hidden sm:inline">
        <RoughArrow width={48} seed={seed} />
      </span>
    </>
  );
}

/* ---------- 三种切法对比卡片 ---------- */
function ApproachCard({
  name,
  en,
  verdict,
  desc,
}: {
  name: string;
  en: string;
  verdict: 'good' | 'bad';
  desc: React.ReactNode;
}) {
  const bg = verdict === 'good' ? '#d1fae5' : '#fee2e2';
  const mark = verdict === 'good' ? '✓' : '✗';
  const markColor = verdict === 'good' ? INK_GREEN : INK_RED;
  return (
    <div
      className="p-2.5 sm:p-3 rounded-sm"
      style={{ backgroundColor: bg }}
    >
      <p
        className="text-base sm:text-lg flex items-baseline gap-2"
        style={{ fontFamily: HAND }}
      >
        <span style={{ color: markColor, fontWeight: 700 }}>{mark}</span>
        <strong style={{ color: INK }}>{name}</strong>
        <span className="text-xs sm:text-sm text-stone-500">{en}</span>
      </p>
      <p
        className="mt-1 text-sm sm:text-base text-stone-700"
        style={{ fontFamily: PEN }}
      >
        {desc}
      </p>
    </div>
  );
}

/* ---------- 价格表行 ---------- */
function PriceRow({
  model,
  input,
  output,
}: {
  model: string;
  input: string;
  output: string;
}) {
  return (
    <tr>
      <td className="p-2 border-b border-dashed border-stone-300">{model}</td>
      <td className="p-2 text-right tabular-nums border-b border-dashed border-stone-300">
        {input}
      </td>
      <td
        className="p-2 text-right tabular-nums border-b border-dashed border-stone-300"
        style={{ color: INK_RED }}
      >
        {output}
      </td>
    </tr>
  );
}
