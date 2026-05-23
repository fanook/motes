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
} from '../components/handwriting';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: 'Attention 注意力机制',
  date: '2026-05-27',
  tags: ['AI 入门', 'LLM', 'Transformer'],
  summary: 'Transformer 的核心。 Q/K/V 是什么、 公式怎么读、 多头注意力为什么有用。',
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

/* ---------- attention 权重示意图：一句话里每个词关注哪几个词 ---------- */
function AttentionMatrix() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const SVG_NS = 'http://www.w3.org/2000/svg';

    const tokens = ['The', 'cat', 'sat', 'on', 'the', 'mat'];
    // 模拟"sat"对其他词的注意力权重
    const weights = [0.05, 0.45, 1.0, 0.2, 0.05, 0.25];
    const cell = 36;
    const startX = 24;
    const y = 40;

    tokens.forEach((tok, i) => {
      // 用颜色深度表示权重
      const w = weights[i];
      svg.appendChild(
        rc.rectangle(startX + i * cell, y, cell - 4, 30, {
          stroke: INK_SEPIA,
          strokeWidth: 1.2,
          roughness: 1.3,
          fill: `rgba(91, 58, 31, ${w * 0.6})`,
          fillStyle: 'solid',
          seed: 601 + i,
        })
      );
      const t = document.createElementNS(SVG_NS, 'text');
      t.setAttribute('x', String(startX + i * cell + (cell - 4) / 2));
      t.setAttribute('y', String(y + 19));
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('font-family', 'Kalam, cursive');
      t.setAttribute('font-size', '13');
      t.setAttribute(
        'fill',
        w > 0.5 ? '#fdfaf0' : INK
      );
      t.textContent = tok;
      svg.appendChild(t);
      // 权重数字
      const tw = document.createElementNS(SVG_NS, 'text');
      tw.setAttribute('x', String(startX + i * cell + (cell - 4) / 2));
      tw.setAttribute('y', String(y + 48));
      tw.setAttribute('text-anchor', 'middle');
      tw.setAttribute('font-family', 'Kalam, cursive');
      tw.setAttribute('font-size', '11');
      tw.setAttribute('fill', '#78716c');
      tw.textContent = w.toFixed(2);
      svg.appendChild(tw);
    });

    // 标注 query
    const lbl = document.createElementNS(SVG_NS, 'text');
    lbl.setAttribute('x', '24');
    lbl.setAttribute('y', '20');
    lbl.setAttribute('font-family', 'Kalam, cursive');
    lbl.setAttribute('font-size', '14');
    lbl.setAttribute('fill', INK_RED);
    lbl.textContent = '当 query = "sat" 时，对每个 token 的注意力权重：';
    svg.appendChild(lbl);
  }, []);
  return (
    <svg
      ref={ref}
      viewBox="0 0 280 100"
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
          Attention
        </h1>
        <div className="mt-1">
          <RoughUnderline width={180} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— Transformer 的核心
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          "Attention is All You Need" —— Vaswani et al. 2017, NeurIPS
          <sup>[1]</sup>。
        </p>
        <p>
          这篇论文证明了 ——
          <strong style={{ color: INK_RED }}>不要 RNN、 不要 CNN，
          只用注意力机制就能搭建当时最强的序列模型</strong>。 之后所有主流 LLM
          （GPT、 Claude、 Gemini、 Llama） 都建立在它上面。
        </p>
      </div>

      <Section title="一、它解决什么问题？" underlineWidth={210}>
        <p>
          在 Attention 之前， 处理"一句话"的主流是 <Term en="RNN" ch="循环神经网络" />：
          像人读字一样，<strong>一个一个</strong>把 token 喂进网络， 用隐状态传递信息。
        </p>
        <p>两个致命缺陷：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li><strong>串行</strong>， 没法并行训练 → 很慢</li>
          <li><strong>长距离衰减</strong> —— 句首信息传到句尾， 多半已经丢了</li>
        </ul>
        <p className="pt-2">
          Attention 一刀切： 让每个 token 直接看见所有其他 token，
          <strong style={{ color: INK_SEPIA }}>距离 = 同等对待</strong>。
        </p>
      </Section>

      <Section title="二、直觉：Query、Key、Value" underlineWidth={260}>
        <p>类比一下检索系统：</p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong style={{ color: INK_SEPIA }}>Query (Q)</strong> —— "我现在要找什么"。 比如在生成下一个词， 这就是当前位置的"提问"
          </li>
          <li>
            <strong style={{ color: INK_SEPIA }}>Key (K)</strong> —— "我的标签是什么"。 每个 token 都给自己挂一个 key， 像图书馆书脊上的标签
          </li>
          <li>
            <strong style={{ color: INK_SEPIA }}>Value (V)</strong> —— "我真正的内容"。 是这个 token 实际要贡献给输出的信息
          </li>
        </ul>
        <p className="pt-3">
          流程：用 <strong>Q</strong> 跟所有 <strong>K</strong> 算相似度， 得到一组"权重"（softmax 归一化），
          再用这组权重对 <strong>V</strong> 加权求和。
        </p>

        <div className="mt-3">
          <AttentionMatrix />
        </div>

        <p className="pt-3 text-sm sm:text-base text-stone-500">
          上面演示：句子 "The cat sat on the mat" 里， 当 query 是 "sat" 时，
          它最关注自己（1.0）， 也关注 "cat"（0.45， 主语）和 "mat"（0.25， 受事），
          其他词权重低。 整段话的"含义"就是这些权重加权混合出来的。
        </p>
      </Section>

      <Section title="三、公式（看一眼就行）" underlineWidth={210}>
        <p>论文里的原版公式 <sup>[1]</sup>：</p>
        <div
          className="mt-2 p-4 rounded-sm text-center text-base sm:text-lg tabular-nums"
          style={{
            backgroundColor: '#fef9c3',
            fontFamily: PEN,
            color: INK,
          }}
        >
          Attention(Q, K, V) = softmax( <strong>Q · K<sup>T</sup></strong> / √d<sub>k</sub> ) · V
        </div>
        <p className="pt-3">逐步读：</p>
        <ol className="pl-5 list-decimal space-y-1 text-base sm:text-lg">
          <li><strong>Q · K<sup>T</sup></strong> —— query 和每个 key 算点积， 得到相似度矩阵</li>
          <li><strong>/ √d<sub>k</sub></strong> —— 除以维度的平方根， 防止内积太大、 softmax 后只剩 0 和 1（梯度消失）</li>
          <li><strong>softmax(...)</strong> —— 把相似度转成"加起来 = 1"的概率分布</li>
          <li><strong>... · V</strong> —— 用这组权重对 value 加权求和， 得到最终输出</li>
        </ol>
      </Section>

      <Section title="四、Self-Attention：自己看自己" underlineWidth={290}>
        <p>
          <Term en="Self-attention" ch="自注意力" /> ——
          Q、 K、 V 全部从<strong>同一段输入</strong>线性映射出来。
        </p>
        <p>
          换句话说：句子里每个 token 既是"提问者"， 又是"被查的图书"。
          这让模型能为每个 token 计算"它在整句中应该是什么含义"。
        </p>
        <p className="pt-2">
          这是 LLM 理解上下文的根本机制 —— "苹果手机"和"苹果好吃"里的"苹果"，
          就是被 self-attention 算出来不一样的。
        </p>
      </Section>

      <Section title={'五、Multi-Head：多个"视角"同时看'} underlineWidth={290}>
        <p>
          一组 Q/K/V 只能学到一种"关注模式"。 论文里原版用了 <strong>8 个头</strong>
          （每个头的维度是 d<sub>model</sub> / 8 = 64）<sup>[1]</sup>。
        </p>
        <p>
          每个 head 学不同的"关注偏好"：有的学语法关系（主谓宾）， 有的学指代（it 指什么），
          有的学远距离依赖、 有的关注短语共现……
        </p>
        <p className="pt-2">
          各 head 的输出 <strong>拼起来</strong>， 再过一层线性变换， 就是
          <Term en="Multi-Head Attention" ch="多头注意力" /> 的完整输出。
        </p>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          实战中 head 数从 8 到 128 都有； 大模型为了显存还用 GQA（Grouped Query Attention）等变种 ——
          让多个 query head 共享 key/value head。
        </p>
      </Section>

      <Section title="六、几个配套设计" underlineWidth={170}>
        <p>
          <strong>Positional Encoding（位置编码）</strong> ——
          attention 是 <strong>permutation-invariant</strong>（打乱 token 顺序结果不变）。
          所以需要额外注入"位置感"。 原版用正弦余弦编码，
          现代 LLM 用 RoPE（旋转位置编码）等变种。
        </p>
        <p className="pt-2">
          <strong>Causal mask（因果掩码）</strong> ——
          decoder-only LLM 在训练 / 推理时， 每个 token 只能 attend 到它之前的 token，
          不能"偷看"未来。 实现上把 attention 矩阵的上三角设成 -∞， softmax 后变 0。
        </p>
        <p className="pt-2">
          <strong>O(n²) 复杂度</strong> —— Self-attention 要算 n × n 的相似度矩阵。
          这正是 Context Window 那篇里讲的"为什么长上下文贵"的根本原因。
        </p>
      </Section>

      <Section title="七、为什么它统治了一切" underlineWidth={250}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li><strong>并行</strong>： attention 是矩阵乘法， GPU 极爽， 比 RNN 快很多</li>
          <li><strong>距离无关</strong>： 句首到句尾一步连接， 没有 RNN 的衰减</li>
          <li><strong>表达力强</strong>： 多头能学多种"关注模式"</li>
          <li><strong>可堆叠</strong>： 多层 attention 叠起来就是 Transformer， 加深就能拟合更复杂的语义</li>
        </ul>
        <p className="pt-3 text-sm sm:text-base text-stone-500">
          代价是 O(n²) 复杂度。 但通过 FlashAttention、 sparse attention、
          sliding window 等工程优化， 这个代价被压到了可接受。
        </p>
      </Section>

      <Section title="八、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="Attention" ipa="/əˈtɛnʃən/" ch="注意力" /></li>
          <li><Term en="Self-attention" ch="自注意力" /></li>
          <li><Term en="Multi-head attention" ch="多头注意力" /></li>
          <li><Term en="Query / Key / Value" ch="查询 / 键 / 值" /></li>
          <li><Term en="Softmax" ipa="/ˈsɒftmæks/" ch="把分数变成概率分布" /></li>
          <li><Term en="Positional encoding" ch="位置编码" /></li>
          <li><Term en="Causal mask" ch={'因果掩码， 防止"偷看未来"'} /></li>
          <li><Term en="GQA" ch="Grouped Query Attention， 头间共享的节省版" /></li>
          <li><Term en="FlashAttention" ch="工程实现优化， 显存与速度都更好" /></li>
        </ul>
      </Section>

      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>Attention = "每个 token 跟所有 token 直接对话"，</p>
            <p>这是 Transformer 取代 RNN 的关键。</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            Vaswani, A., Shazeer, N., Parmar, N. et al. (2017).{' '}
            <em>Attention Is All You Need</em>. NeurIPS 2017.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/1706.03762"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/1706.03762
            </a>
            （Transformer 原始论文， Q/K/V 公式 + multi-head 设计）
          </li>
          <li>
            Dao, T. et al. (2022).{' '}
            <em>FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness</em>. NeurIPS 2022.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2205.14135"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2205.14135
            </a>
          </li>
          <li>
            Ainslie, J. et al. (2023).{' '}
            <em>GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints</em>. EMNLP 2023.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2305.13245"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2305.13245
            </a>
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
