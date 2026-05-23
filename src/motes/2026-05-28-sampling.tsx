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
  title: '采样：T / top-p / top-k',
  date: '2026-05-23',
  tags: ['AI 入门', 'LLM'],
  summary: '模型怎么"挑下一个 token"。 三个常用参数的原理、 区别、 实战建议。',
};

function Term({ en, ipa, ch }: { en: string; ipa?: string; ch?: string }) {
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
      {ch && <span className="text-xs sm:text-sm text-stone-500"> ≈ {ch}</span>}
    </span>
  );
}

/* 概率分布柱状示意 */
function ProbBar({
  title,
  bars,
}: {
  title: string;
  bars: { label: string; p: number; kept?: boolean }[];
}) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const w = 280;
    const startY = 40;
    const barH = 18;
    const gap = 8;
    const labelW = 56;
    const chartW = w - labelW - 60;

    // 标题
    const t = document.createElementNS(SVG_NS, 'text');
    t.setAttribute('x', '4');
    t.setAttribute('y', '20');
    t.setAttribute('font-family', 'Kalam, cursive');
    t.setAttribute('font-size', '13');
    t.setAttribute('fill', INK_SEPIA);
    t.textContent = title;
    svg.appendChild(t);

    const max = Math.max(...bars.map((b) => b.p));
    bars.forEach((b, i) => {
      const y = startY + i * (barH + gap);
      // label
      const l = document.createElementNS(SVG_NS, 'text');
      l.setAttribute('x', String(labelW - 6));
      l.setAttribute('y', String(y + barH / 2 + 5));
      l.setAttribute('text-anchor', 'end');
      l.setAttribute('font-family', 'Kalam, cursive');
      l.setAttribute('font-size', '12');
      l.setAttribute('fill', INK);
      l.textContent = b.label;
      svg.appendChild(l);
      // bar
      const len = Math.max(3, (b.p / max) * chartW);
      const fill = b.kept === false ? '#e7e5e4' : b.p > 0.3 ? '#fecaca' : '#dbeafe';
      svg.appendChild(
        rc.rectangle(labelW, y, len, barH, {
          stroke: b.kept === false ? '#a8a29e' : INK_SEPIA,
          strokeWidth: 1.2,
          roughness: 1.3,
          fill,
          fillStyle: 'solid',
          seed: 700 + i,
        })
      );
      // value
      const v = document.createElementNS(SVG_NS, 'text');
      v.setAttribute('x', String(labelW + len + 5));
      v.setAttribute('y', String(y + barH / 2 + 5));
      v.setAttribute('font-family', 'Kalam, cursive');
      v.setAttribute('font-size', '11');
      v.setAttribute('fill', b.kept === false ? '#a8a29e' : INK);
      v.textContent = b.p.toFixed(2);
      svg.appendChild(v);
    });
  }, [title, bars]);
  const h = 40 + bars.length * 26 + 8;
  return (
    <svg
      ref={ref}
      viewBox={`0 0 280 ${h}`}
      className="w-full max-w-md block"
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
          采样三件套
        </h1>
        <div className="mt-1">
          <RoughUnderline width={210} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— temperature / top-p / top-k
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          模型每一步输出的不是"一个词"， 而是
          <strong style={{ color: INK_SEPIA }}>整个词表的概率分布</strong>。
        </p>
        <p>
          比如下一个 token 的可能性可能是：
          "is" 0.42、 "are" 0.18、 "was" 0.12、 "rocks" 0.005、 "purple" 0.001……
        </p>
        <p>
          <strong>采样（sampling）</strong>就是：从这堆概率里
          <strong style={{ color: INK_RED }}>挑一个</strong>作为本步输出。 怎么挑， 就是这三个参数决定的。
        </p>
      </div>

      <Section title="一、最朴素的方法：Greedy" underlineWidth={250}>
        <p>
          <Term en="Greedy decoding" ch="贪心解码" /> —— 每步直接取概率最高的那个 token。
        </p>
        <p>
          看起来最合理， 但有几个问题：
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li><strong>同一个 prompt 永远生成同一段话</strong>， 单调</li>
          <li><strong>容易陷入重复</strong>："I think I think I think..."</li>
          <li><strong>错失更好的整体路径</strong>—— 局部最优 ≠ 全局最优</li>
        </ul>
        <p className="pt-2">
          所以实际生成基本都用<strong>随机采样</strong>， 但加上控制参数避免"乱"。
        </p>
      </Section>

      <Section title={'二、Temperature：调"随机度"'} underlineWidth={250}>
        <p>
          <Term en="Temperature" ipa="/ˈtɛmpərətʃər/" /> ——
          一个标量， 把模型的原始 logits（未归一化分数）<strong>除以 T</strong>， 再做 softmax：
        </p>
        <div
          className="mt-2 p-3 rounded-sm text-center text-base sm:text-lg tabular-nums"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN, color: INK }}
        >
          p<sub>i</sub> = softmax( logit<sub>i</sub> / <strong>T</strong> )
        </div>

        <p className="pt-3">直觉效果：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li><strong>T → 0</strong>：分布越来越"尖"， 趋近 greedy（永远选最高）</li>
          <li><strong>T = 1</strong>：原始分布， 不变</li>
          <li><strong>T &gt; 1</strong>：分布被"压平"， 低概率 token 翻身机会变大 → 输出更随机、 更有创意， 也更容易胡说</li>
        </ul>

        <div className="mt-4 space-y-3">
          <ProbBar
            title="T = 1.0 （原始）"
            bars={[
              { label: 'is', p: 0.42 },
              { label: 'are', p: 0.18 },
              { label: 'was', p: 0.12 },
              { label: 'were', p: 0.05 },
              { label: 'rocks', p: 0.005 },
            ]}
          />
          <ProbBar
            title="T = 0.3 （冷， 趋于确定）"
            bars={[
              { label: 'is', p: 0.85 },
              { label: 'are', p: 0.10 },
              { label: 'was', p: 0.04 },
              { label: 'were', p: 0.005 },
              { label: 'rocks', p: 0.0001 },
            ]}
          />
          <ProbBar
            title="T = 1.5 （热， 更随机）"
            bars={[
              { label: 'is', p: 0.28 },
              { label: 'are', p: 0.20 },
              { label: 'was', p: 0.17 },
              { label: 'were', p: 0.10 },
              { label: 'rocks', p: 0.03 },
            ]}
          />
        </div>

        <p
          className="mt-3 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          💡 实战常用值：要确定性输出（代码、 JSON、 工具调用）用 <strong>T = 0~0.3</strong>；
          要创意（写故事、 头脑风暴）用 <strong>T = 0.8~1.2</strong>。
        </p>
      </Section>

      <Section title="三、Top-k：只看分数最高的 k 个" underlineWidth={290}>
        <p>
          <Term en="Top-k sampling" /> —— 只在概率最高的 k 个 token 里采样， 其他全部砍掉。
          （Fan et al. 2018 <sup>[1]</sup>）
        </p>
        <p className="pt-2">例：k=3 时， 上面的分布只保留 is/are/was， 重新归一化后采样：</p>

        <div className="mt-3">
          <ProbBar
            title="top-k=3"
            bars={[
              { label: 'is', p: 0.58 },
              { label: 'are', p: 0.25 },
              { label: 'was', p: 0.17 },
              { label: 'were', p: 0, kept: false },
              { label: 'rocks', p: 0, kept: false },
            ]}
          />
        </div>

        <p className="pt-3">
          问题：k 是个固定数。 但有些位置分布很尖锐（明确的下个词），
          k 取大没意义； 有些位置分布很扁（多个候选都合理）， k 取小又会错杀好选项。
          所以才有了 top-p。
        </p>
      </Section>

      <Section title="四、Top-p (Nucleus)：按概率质量切" underlineWidth={290}>
        <p>
          <Term en="Top-p sampling" ch="核采样" /> ——
          按概率从高到低排序， <strong style={{ color: INK_RED }}>累加</strong>到刚超过 p 时停手，
          只在这个"核"里采样。 Holtzman et al. 2019 提出 <sup>[2]</sup>。
        </p>
        <p className="pt-2">
          比起 top-k 的好处：<strong>候选数随分布形状自适应</strong>。 分布尖时核小、 分布扁时核大。
        </p>

        <div className="mt-3">
          <ProbBar
            title="top-p=0.9 (is + are + was 已累加到 0.72, 再加 were=0.77, 再加..)"
            bars={[
              { label: 'is', p: 0.42 },
              { label: 'are', p: 0.18 },
              { label: 'was', p: 0.12 },
              { label: 'were', p: 0.05 },
              { label: 'rocks', p: 0.005, kept: false },
            ]}
          />
        </div>

        <p className="pt-3">
          实战常用 <strong>top-p = 0.9 ~ 0.95</strong>。 在大多数生产 API 里它的默认值。
        </p>
      </Section>

      <Section title="五、组合使用" underlineWidth={170}>
        <p>
          三个参数<strong>可以同时用</strong>， 一般流程是 ——
        </p>
        <ol className="pl-5 list-decimal space-y-1 text-base sm:text-lg">
          <li>先用 temperature 缩放分布</li>
          <li>再用 top-k 砍长尾（如 k=50）</li>
          <li>再用 top-p 进一步收紧（如 p=0.95）</li>
          <li>从最后剩下的 token 里按概率随机采样</li>
        </ol>
        <p className="pt-3 text-sm sm:text-base text-stone-500">
          多数 API 同时暴露这三个参数； OpenAI / Anthropic 的官方建议是
          <strong> 只调 temperature 或 top-p 中的一个</strong>， 不要两者一起 fine-tune， 容易理解错。
        </p>
      </Section>

      <Section title="六、实战速查" underlineWidth={170}>
        <p><strong>场景对照表：</strong></p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>代码生成、 数学推理、 工具调用</strong> ——
            T = 0 ~ 0.3， 求确定性
          </li>
          <li>
            <strong>翻译、 摘要、 提取结构化数据</strong> ——
            T = 0.3 ~ 0.7
          </li>
          <li>
            <strong>客服对话、 一般问答</strong> ——
            T = 0.7 ~ 1.0
          </li>
          <li>
            <strong>创意写作、 头脑风暴、 起名字</strong> ——
            T = 1.0 ~ 1.3
          </li>
          <li>
            <strong>需要可复现</strong>（评测、 调试）——
            T = 0， 或固定 seed
          </li>
        </ul>
      </Section>

      <Section title="七、坑" underlineWidth={120}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>T 越高 ≠ 越聪明</strong>。 T 提到 2 以上， 输出经常是胡言乱语
          </li>
          <li>
            <strong>T=0 不是"完全确定"</strong>。 有些后端实现仍保留少量随机性， 想要严格确定要传 seed
          </li>
          <li>
            <strong>Reasoning 模型对 T 不敏感</strong>。 o1 / Claude thinking 等推理模型， 思考链已经决定了输出走向， T 影响小
          </li>
          <li>
            <strong>API 默认值不一样</strong>。 OpenAI 默认 T=1； Anthropic 默认 T=1； 部分本地推理框架默认 T=0.7。 写代码时一定显式指定， 别靠默认
          </li>
        </ul>
      </Section>

      <Section title="八、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="Logits" ipa="/ˈloʊdʒɪts/" ch="模型最后一层输出的未归一化分数" /></li>
          <li><Term en="Softmax" ch="把 logits 变成概率分布" /></li>
          <li><Term en="Temperature" ipa="/ˈtɛmpərətʃər/" ch="把 logits 除以的标量， 控制随机度" /></li>
          <li><Term en="Top-k" ch="只在概率最高的 k 个候选里采样" /></li>
          <li><Term en="Top-p / Nucleus" ipa="/ˈnjuːkliəs/" ch="按累计概率到 p 切" /></li>
          <li><Term en="Greedy decoding" ch="贪心解码， 永远取最高" /></li>
          <li><Term en="Beam search" ch="束搜索， 保留多个候选路径， 翻译时常用" /></li>
        </ul>
      </Section>

      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>T 调"敢不敢离谱"， top-k / top-p 限制"备选池的大小"。</p>
            <p>实际写代码：先想清楚你要确定性还是创意， 再选 T。</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            Fan, A., Lewis, M., Dauphin, Y. (2018).{' '}
            <em>Hierarchical Neural Story Generation</em>. ACL 2018.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/1805.04833"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/1805.04833
            </a>
            （top-k 采样的早期使用）
          </li>
          <li>
            Holtzman, A., Buys, J., Du, L., Forbes, M., Choi, Y. (2019).{' '}
            <em>The Curious Case of Neural Text Degeneration</em>. ICLR 2020.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/1904.09751"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/1904.09751
            </a>
            （Nucleus sampling / top-p 原论文）
          </li>
          <li>
            OpenAI / Anthropic API docs：在 chat completion 参数说明里都明确推荐"只调 T 或 top-p 中的一个"。
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
