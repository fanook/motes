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
  INK_GREEN,
  FluidRoughBox,
  RoughUnderline,
} from '../components/handwriting';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: 'Embedding 是什么',
  date: '2026-05-23',
  tags: ['AI 入门', 'LLM', 'RAG'],
  summary:
    '把"意义"放进空间里。 Word2Vec 到现代 embedding 模型， 维度、 距离度量、 选型与应用。',
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

/* ---------- 2D 散点图：相似词靠在一起 ---------- */
function EmbeddingScatter() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const W = 320;
    const H = 220;
    const SVG_NS = 'http://www.w3.org/2000/svg';

    // 坐标轴（淡）
    svg.appendChild(
      rc.line(20, H - 20, W - 12, H - 20, {
        stroke: '#a8a29e',
        strokeWidth: 1,
        roughness: 0.8,
        seed: 301,
      })
    );
    svg.appendChild(
      rc.line(20, 12, 20, H - 20, {
        stroke: '#a8a29e',
        strokeWidth: 1,
        roughness: 0.8,
        seed: 302,
      })
    );

    // 三组词，每组聚集在一处
    type Pt = { x: number; y: number; label: string };
    const groups: { color: string; pts: Pt[]; seedBase: number }[] = [
      {
        color: '#1e3a8a', // 蓝：动物
        seedBase: 310,
        pts: [
          { x: 70, y: 55, label: '猫' },
          { x: 95, y: 75, label: '狗' },
          { x: 55, y: 85, label: '马' },
          { x: 85, y: 100, label: '猪' },
        ],
      },
      {
        color: '#b91c1c', // 红：颜色
        seedBase: 330,
        pts: [
          { x: 225, y: 50, label: '红' },
          { x: 255, y: 65, label: '蓝' },
          { x: 235, y: 90, label: '绿' },
          { x: 270, y: 95, label: '黄' },
        ],
      },
      {
        color: '#166534', // 绿：数字
        seedBase: 350,
        pts: [
          { x: 140, y: 160, label: '一' },
          { x: 175, y: 170, label: '二' },
          { x: 155, y: 185, label: '三' },
          { x: 190, y: 150, label: '四' },
        ],
      },
    ];

    groups.forEach((g) => {
      g.pts.forEach((p, i) => {
        // 点
        svg.appendChild(
          rc.circle(p.x, p.y, 8, {
            stroke: g.color,
            strokeWidth: 1.5,
            roughness: 1.4,
            fill: g.color,
            fillStyle: 'solid',
            seed: g.seedBase + i,
          })
        );
        // 标签
        const t = document.createElementNS(SVG_NS, 'text');
        t.setAttribute('x', String(p.x + 8));
        t.setAttribute('y', String(p.y + 4));
        t.setAttribute(
          'font-family',
          '"Long Cang", "Ma Shan Zheng", cursive'
        );
        t.setAttribute('font-size', '14');
        t.setAttribute('fill', INK);
        t.textContent = p.label;
        svg.appendChild(t);
      });
    });

    // 分组标注
    const groupLabel = (
      x: number,
      y: number,
      text: string,
      color: string
    ) => {
      const t = document.createElementNS(SVG_NS, 'text');
      t.setAttribute('x', String(x));
      t.setAttribute('y', String(y));
      t.setAttribute('font-family', 'Kalam, "Ma Shan Zheng", cursive');
      t.setAttribute('font-size', '13');
      t.setAttribute('font-style', 'italic');
      t.setAttribute('fill', color);
      t.textContent = text;
      svg.appendChild(t);
    };
    groupLabel(50, 35, '动物', '#1e3a8a');
    groupLabel(225, 35, '颜色', '#b91c1c');
    groupLabel(135, 145, '数字', '#166534');
  }, []);
  return (
    <svg
      ref={ref}
      viewBox="0 0 320 220"
      className="w-full max-w-md mx-auto block"
    />
  );
}

/* ---------- King - Man + Woman ≈ Queen 平行四边形 ---------- */
function AnalogyDiagram() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const SVG_NS = 'http://www.w3.org/2000/svg';

    const pts = [
      { x: 60, y: 130, label: 'man', color: INK_SEPIA },
      { x: 60, y: 50, label: 'king', color: INK_RED },
      { x: 220, y: 130, label: 'woman', color: INK_SEPIA },
      { x: 220, y: 50, label: 'queen', color: INK_RED },
    ];
    pts.forEach((p, i) => {
      svg.appendChild(
        rc.circle(p.x, p.y, 8, {
          stroke: p.color,
          strokeWidth: 1.5,
          roughness: 1.2,
          fill: p.color,
          fillStyle: 'solid',
          seed: 401 + i,
        })
      );
      const t = document.createElementNS(SVG_NS, 'text');
      t.setAttribute('x', String(p.x + 10));
      t.setAttribute('y', String(p.y + 5));
      t.setAttribute('font-family', 'Kalam, "Ma Shan Zheng", cursive');
      t.setAttribute('font-size', '14');
      t.setAttribute('fill', INK);
      t.textContent = p.label;
      svg.appendChild(t);
    });

    // 两条平行向量（man→king 和 woman→queen）
    const arrow = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      seed: number,
      color: string
    ) => {
      svg.appendChild(
        rc.line(x1, y1, x2, y2, {
          stroke: color,
          strokeWidth: 1.6,
          roughness: 1.2,
          seed,
        })
      );
      // 简单箭头头
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const hl = 7;
      svg.appendChild(
        rc.line(
          x2,
          y2,
          x2 - hl * Math.cos(angle - 0.5),
          y2 - hl * Math.sin(angle - 0.5),
          { stroke: color, strokeWidth: 1.4, roughness: 1, seed: seed + 1 }
        )
      );
      svg.appendChild(
        rc.line(
          x2,
          y2,
          x2 - hl * Math.cos(angle + 0.5),
          y2 - hl * Math.sin(angle + 0.5),
          { stroke: color, strokeWidth: 1.4, roughness: 1, seed: seed + 2 }
        )
      );
    };
    arrow(64, 126, 64, 60, 410, '#92400e');
    arrow(224, 126, 224, 60, 420, '#92400e');

    // 标注：相同方向
    const lbl = (x: number, y: number, text: string) => {
      const t = document.createElementNS(SVG_NS, 'text');
      t.setAttribute('x', String(x));
      t.setAttribute('y', String(y));
      t.setAttribute('font-family', 'Kalam, "Ma Shan Zheng", cursive');
      t.setAttribute('font-size', '12');
      t.setAttribute('fill', '#78716c');
      t.textContent = text;
      svg.appendChild(t);
    };
    lbl(72, 95, '+royal');
    lbl(232, 95, '+royal');
  }, []);
  return (
    <svg
      ref={ref}
      viewBox="0 0 290 170"
      className="w-full max-w-sm mx-auto block"
    />
  );
}

/* ---------- 模型行 ---------- */
function ModelRow({
  name,
  dim,
  ctx,
  price,
  note,
}: {
  name: string;
  dim: string;
  ctx: string;
  price: string;
  note?: string;
}) {
  return (
    <tr>
      <td className="p-2 border-b border-dashed border-stone-300">
        <strong>{name}</strong>
        {note && (
          <div className="text-xs text-stone-500 mt-0.5">{note}</div>
        )}
      </td>
      <td className="p-2 text-right tabular-nums border-b border-dashed border-stone-300">
        {dim}
      </td>
      <td className="p-2 text-right tabular-nums border-b border-dashed border-stone-300">
        {ctx}
      </td>
      <td className="p-2 text-right tabular-nums border-b border-dashed border-stone-300">
        {price}
      </td>
    </tr>
  );
}

/* ---------- 主组件 ---------- */
export default function Mote() {
  return (
    <Paper>
      <header className="mb-6 sm:mb-8">
        <h1
          className="text-3xl sm:text-5xl leading-tight"
          style={{ fontFamily: HAND, color: INK_SEPIA }}
        >
          Embedding
        </h1>
        <div className="mt-1">
          <RoughUnderline width={170} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— 把"意思"放进空间里
        </p>
      </header>

      {/* 引言 */}
      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          上一篇说过， AI 把文字切成 token、 给每个 token 一个数字 ID。
        </p>
        <p>
          但是 ID 只是<strong>编号</strong>， 不带任何"意思" ——
          模型怎么知道"猫"和"狗"是相近的、 和"红色"差远了？
        </p>
        <p className="pt-2">
          答案：<strong style={{ color: INK_RED }}>把每个 token 映射成一个高维向量</strong>。
          这个向量， 就叫 <Term en="Embedding" ipa="/ɪmˈbɛdɪŋ/" ch="嵌入" />。
        </p>
      </div>

      {/* ─── 1 直觉 ─── */}
      <Section title="一、直觉：把意义放进空间里" underlineWidth={250}>
        <p>想象一张二维地图（实际是几千维， 这里简化）：</p>
        <p>
          所有"动物"挤在一角， 所有"颜色"挤在另一角， 所有"数字"在第三角 ——
          <strong style={{ color: INK_RED }}>意思相近的词， 坐标相近</strong>。
        </p>

        <div className="mt-4">
          <EmbeddingScatter />
        </div>

        <p className="pt-3">
          有了这种"位置感"， 模型就可以：
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li><strong>判断相似</strong>：两个向量距离近 → 语义相近</li>
          <li><strong>做搜索</strong>：把"问题"和"文档"都映射成向量， 找最近的</li>
          <li><strong>做分类</strong>：相似的归一类</li>
          <li><strong>做推理</strong>：向量加减能反映语义关系（下一节）</li>
        </ul>
      </Section>

      {/* ─── 2 著名等式 ─── */}
      <Section title="二、著名等式：King − Man + Woman ≈ Queen" underlineWidth={350}>
        <p>
          Mikolov et al. 在 2013 年（NAACL）发现的现象 <sup>[1]</sup>：
        </p>
        <p
          className="mt-2 p-3 rounded-sm text-center text-base sm:text-lg"
          style={{
            backgroundColor: '#fef9c3',
            fontFamily: 'var(--font-hand-pen)',
            color: INK,
          }}
        >
          vec(<strong>king</strong>) − vec(<strong>man</strong>) + vec(<strong>woman</strong>) ≈ vec(<strong>queen</strong>)
        </p>
        <p className="pt-3">
          这说明 embedding 不是随便排， 而是<strong>把语义关系编码成了几何关系</strong>：
          "皇室身份"在 embedding 空间里有一个固定的方向（向量偏移）。
        </p>

        <div className="mt-4">
          <AnalogyDiagram />
        </div>

        <p className="pt-3 text-sm sm:text-base text-stone-500">
          这是 embedding 最神奇的地方 —— 没有人教模型"皇室概念"，
          它从语料里自己学出了这个结构。
        </p>
      </Section>

      {/* ─── 3 历史脉络 ─── */}
      <Section title="三、历史：从查表到神经网络" underlineWidth={260}>
        <p>
          <strong>Word2Vec（2013， Mikolov et al.）</strong>
          <sup>[2]</sup> —— 第一个广泛流行的 embedding。 思路：
          <em>"经常一起出现的词，含义相似"</em>， 用 skip-gram + negative sampling 学。 缺陷：
          <strong style={{ color: INK_RED }}>一个词只有一个向量</strong>， 没有上下文。 "苹果手机"和"苹果好吃"里的"苹果"是同一个 embedding。
        </p>

        <p className="pt-3">
          <strong>GloVe（2014， Stanford）</strong> —— 另一种基于全局词共现统计的方法， 思路差不多。
        </p>

        <p className="pt-3">
          <strong>BERT（2018， Google） / ELMo</strong> —— 引入<strong>上下文相关 embedding</strong>。
          同一个词在不同句子里给不同向量， 一举打破"一词一向量"的天花板。
        </p>

        <p className="pt-3">
          <strong>现代 API embedding（2024+）</strong> ——
          OpenAI text-embedding-3、 Voyage、 Cohere 等。 通常基于
          decoder-only 大语言模型， 用<Term en="contrastive learning" ch="对比学习" />在大量 query-document 对上微调，
          为<strong>检索 / RAG</strong>而优化。
        </p>
      </Section>

      {/* ─── 4 维度与 Matryoshka ─── */}
      <Section title="四、维度的取舍" underlineWidth={170}>
        <p>
          Embedding 向量的<strong>维度（dimension）</strong>是个权衡：
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li><strong>高维（3072）</strong>：表达力强、 区分细微差异， 但存储贵、 检索慢</li>
          <li><strong>低维（256~768）</strong>：紧凑、 快， 但精度损失</li>
        </ul>

        <p className="pt-3">
          <strong>Matryoshka Representation Learning</strong>（俄罗斯套娃式表征） ——
          OpenAI text-embedding-3 系列、 Voyage 4 都支持：
        </p>
        <p>
          <strong style={{ color: INK_SEPIA }}>训练时让前 N 维就单独能用</strong>，
          所以一份 embedding 同时支持 256 / 512 / 1024 / 3072 等多种维度
          <sup>[3]</sup>。 业务可以："存大维度， 查小维度先粗筛， 再用大维度精排"。
        </p>
      </Section>

      {/* ─── 5 距离 ─── */}
      <Section title="五、距离怎么算？" underlineWidth={170}>
        <p>
          两个向量"有多近"， 主流用三种度量：
        </p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <Term en="Cosine similarity" ipa="/ˈkoʊsaɪn/" ch="余弦相似度" />
            —— 看两个向量的<strong>夹角</strong>， 范围 [-1, 1]， 1 是完全同方向。
            <strong style={{ color: INK_GREEN }}>主流模型默认推荐</strong>
            （包括 OpenAI， 因为向量已被 L2 归一化 <sup>[3]</sup>）
          </li>
          <li>
            <Term en="Euclidean distance" ch="欧氏距离" /> —— 几何上"两点直线距离"。 向量没归一化时用
          </li>
          <li>
            <Term en="Dot product" ch="点积" /> —— 归一化向量的点积就 = cosine， 计算最快
          </li>
        </ul>
        <p
          className="mt-3 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          💡 实战建议：先看你用的模型推荐什么。 大多数情况是<strong>余弦相似度</strong>。
        </p>
      </Section>

      {/* ─── 6 主流模型对比 ─── */}
      <Section title="六、主流 embedding 模型（2026-05）" underlineWidth={310}>
        <div className="mt-2 overflow-x-auto">
          <table
            className="text-sm sm:text-base w-full"
            style={{ fontFamily: PEN, borderCollapse: 'collapse' }}
          >
            <thead>
              <tr style={{ color: INK_SEPIA }}>
                <th className="text-left p-2 border-b-2 border-dashed border-stone-400">模型</th>
                <th className="text-right p-2 border-b-2 border-dashed border-stone-400">维度</th>
                <th className="text-right p-2 border-b-2 border-dashed border-stone-400">输入上限</th>
                <th className="text-right p-2 border-b-2 border-dashed border-stone-400">$/1M token</th>
              </tr>
            </thead>
            <tbody>
              <ModelRow
                name="text-embedding-3-large"
                note="OpenAI 旗舰， 支持 Matryoshka"
                dim="3072 ↓ 可缩"
                ctx="8K"
                price="$0.13"
              />
              <ModelRow
                name="text-embedding-3-small"
                note="OpenAI 性价比款"
                dim="1536 ↓ 可缩"
                ctx="8K"
                price="$0.02"
              />
              <ModelRow
                name="voyage-4-large"
                note="Anthropic 推荐合作伙伴"
                dim="1024 / 256 / 512 / 2048"
                ctx="32K"
                price="见官网"
              />
              <ModelRow
                name="voyage-code-3"
                note="代码专用"
                dim="1024 ↓ 可缩"
                ctx="32K"
                price="见官网"
              />
            </tbody>
          </table>
        </div>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">
          数据来源：OpenAI / Voyage 官方文档 <sup>[3][4]</sup>。 价格易变， 实际以官网为准。
        </p>

        <p className="pt-3 text-sm sm:text-base text-stone-500">
          挑选参考 <Term en="MTEB" /> 排行榜 <sup>[5]</sup>（Massive Text Embedding Benchmark），
          这是 embedding 业界事实标准的评测。
        </p>
      </Section>

      {/* ─── 7 应用 ─── */}
      <Section title="七、Embedding 能做什么？" underlineWidth={220}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>语义搜索 / RAG</strong> —— 问题和文档都变向量， 找最近的几条丢给 LLM。
            <strong style={{ color: INK_SEPIA }}>这是商用 AI 最大的应用场景</strong>。
          </li>
          <li>
            <strong>聚类</strong> —— 大量未标注文本， 按相似度自动分组（K-means 等）
          </li>
          <li>
            <strong>分类</strong> —— 算 query embedding， 看它离哪个类别向量更近
          </li>
          <li>
            <strong>推荐</strong> —— 用户行为变 embedding， 找相似用户 / 物品
          </li>
          <li>
            <strong>异常检测</strong> —— 离任何已知簇都远的点， 可能是异常
          </li>
          <li>
            <strong>去重 / 内容审核</strong> —— 找近似重复内容
          </li>
        </ul>
      </Section>

      {/* ─── 8 用起来大致是这样（伪代码） ─── */}
      <Section title="八、用起来大致是这样" underlineWidth={210}>
        <p className="text-sm sm:text-base text-stone-500">（伪代码， 表达流程， 不限语言）</p>
        <div
          className="mt-2 p-3 sm:p-4 rounded-sm text-xs sm:text-sm overflow-x-auto"
          style={{
            backgroundColor: 'rgba(255,255,255,0.6)',
            fontFamily: 'var(--font-hand-pen)',
            color: INK,
          }}
        >
          <pre className="whitespace-pre">{`v1 ← embed("一只可爱的猫")    // 调 embedding API
v2 ← embed("a cute dog")
v3 ← embed("今天股票大涨")

similarity(a, b) := a · b / (|a| × |b|)   // 余弦相似度

similarity(v1, v2)   → 较高（都是动物）
similarity(v1, v3)   → 接近 0`}</pre>
        </div>
      </Section>

      {/* ─── 9 坑 ─── */}
      <Section title="九、几个常见的坑" underlineWidth={220}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>跨模型 embedding 不通用</strong> —— OpenAI 的向量和 Voyage 的向量在不同空间。
            换模型 = 重新算所有 embedding
          </li>
          <li>
            <strong>多语言并非保证</strong> —— 不同模型对中文 / 小语种支持差异大，
            混语料检索容易翻车， 看 MTEB 多语言子榜
          </li>
          <li>
            <strong>截断风险</strong> —— 输入超过 ctx 长度会被截掉， 长文档要先切块（chunking）
          </li>
          <li>
            <strong>语义相似 ≠ 答案相关</strong> —— "什么是机器学习"和"机器学习有哪些缺点"语义相近， 但回答方向不同。 重排（rerank）模型常用来补救
          </li>
          <li>
            <strong>Cosine 不是绝对的"语义"</strong> —— 向量训练目标决定它对齐什么。
            检索 embedding 优化的是"query-document 相关性"， 不是哲学意义上的"意思相同"
          </li>
        </ul>
      </Section>

      {/* ─── 10 术语 ─── */}
      <Section title="十、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="Embedding" ipa="/ɪmˈbɛdɪŋ/" ch="向量化嵌入" /></li>
          <li><Term en="Dimension" ipa="/dɪˈmɛnʃən/" ch="向量维度" /></li>
          <li><Term en="Cosine similarity" ipa="/ˈkoʊsaɪn/" ch="余弦相似度" /></li>
          <li>
            <Term en="Matryoshka representation" ch="俄罗斯套娃式表征" />
          </li>
          <li>
            <Term en="MTEB" ch="Massive Text Embedding Benchmark， embedding 业界排行榜" />
          </li>
          <li>
            <Term en="Contrastive learning" ch="对比学习， 现代 embedding 的训练方法" />
          </li>
          <li>
            <Term en="Chunking" ch="切块， 长文档过 embedding 前的预处理" />
          </li>
          <li>
            <Term en="Rerank" ch="重排， 用更精的模型给召回结果打分" />
          </li>
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
            <p>Embedding 把"意思"变成<strong>空间里的位置</strong>，</p>
            <p>让"相似"变成"距离近"， 让搜索和检索成为可能。</p>
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
            Mikolov, T., Yih, W., Zweig, G. (2013).{' '}
            <em>Linguistic Regularities in Continuous Space Word Representations</em>. NAACL.
            （"King − Man + Woman ≈ Queen" 实验的出处）
          </li>
          <li>
            Mikolov, T. et al. (2013).{' '}
            <em>Distributed Representations of Words and Phrases and their Compositionality</em>. NeurIPS.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/1310.4546"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/1310.4546
            </a>
            （Word2Vec 经典论文， Skip-gram + negative sampling）
          </li>
          <li>
            OpenAI. <em>text-embedding-3-small / large</em> 模型卡 + Pricing.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://developers.openai.com/api/docs/models/text-embedding-3-small"
              target="_blank"
              rel="noreferrer"
            >
              developers.openai.com/api/docs/models/text-embedding-3-small
            </a>
            （accessed 2026-05-25；维度、 价格、 Matryoshka）
          </li>
          <li>
            Voyage AI. <em>Embeddings docs</em>.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://docs.voyageai.com/docs/embeddings"
              target="_blank"
              rel="noreferrer"
            >
              docs.voyageai.com/docs/embeddings
            </a>
            （accessed 2026-05-25；voyage-4 系列规格）
          </li>
          <li>
            MTEB Leaderboard. Hugging Face.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://huggingface.co/spaces/mteb/leaderboard"
              target="_blank"
              rel="noreferrer"
            >
              huggingface.co/spaces/mteb/leaderboard
            </a>
            （embedding 评测的事实标准）
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
