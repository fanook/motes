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
  title: 'Contrastive Learning',
  date: '2026-06-09',
  tags: ['AI 入门', 'Embedding'],
  summary: '现代 embedding 模型为什么这么强？ 核心训练方法： 对比学习。 原理、 损失函数、 hard negatives。',
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
          Contrastive Learning
        </h1>
        <div className="mt-1">
          <RoughUnderline width={320} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— 对比学习
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          上一篇里说现代 embedding 模型（详见 [Embedding]）"用 contrastive learning 在大量 query-document 对上训练"。
          这一篇拆开看 ——
        </p>
        <p>
          <Term en="Contrastive learning" ch="对比学习" /> ——
          训练目标不是"准确预测某个值"， 而是
          <strong style={{ color: INK_RED }}>让"相似的"在向量空间里靠近， "不相似的"远离</strong>。
        </p>
      </div>

      <Section title="一、直觉" underlineWidth={120}>
        <p>
          想训练 embedding 模型， 关键是定义"什么算相似"。
        </p>
        <p>
          对比学习的做法：
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>给一个<strong style={{ color: INK_SEPIA }}>锚点（anchor）</strong></li>
          <li>给它配一个<strong style={{ color: INK_GREEN }}>正样本（positive）</strong>， 表示"和锚点相似"</li>
          <li>再配若干<strong style={{ color: INK_RED }}>负样本（negative）</strong>， 表示"和锚点不相似"</li>
        </ul>
        <p className="pt-2">
          训练目标：
          <strong>把 anchor 和 positive 拉近， 把 anchor 和 negative 推远</strong>。
          一遍遍这么搞， 模型就学会了"哪些东西意思接近"。
        </p>
      </Section>

      <Section title="二、正负样本从哪来" underlineWidth={210}>
        <p>这是对比学习最关键的工程问题。 几种常见做法：</p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>(query, 标注的相关 doc)</strong> —— 最直接。 用搜索点击日志、 人工标注数据
          </li>
          <li>
            <strong>(query, query 的同义改写)</strong> —— 让 LLM 把 query 改写成几种说法， 互为正样本
          </li>
          <li>
            <strong>(doc 片段， 同文档的另一片段)</strong> —— 同文档内不同段落算"弱正"
          </li>
          <li>
            <strong>数据增强</strong> —— 给图片 / 文本加扰动， 扰动前后算正样本（CLIP、 SimCSE 等）
          </li>
        </ul>

        <p className="pt-3"><strong>负样本：</strong></p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>In-batch negatives</strong> —— 同一个 batch 里其他样本的 positive 就当成本样本的 negative。 几乎免费， 但容易"过于简单"
          </li>
          <li>
            <strong>Hard negatives</strong> —— 故意挑那些"看似相似但实际无关"的 doc 当负样本。
            训练效果显著更好， 但需要事先挖掘
          </li>
        </ul>
      </Section>

      <Section title="三、损失函数：InfoNCE" underlineWidth={250}>
        <p>
          现代对比学习几乎都用 <Term en="InfoNCE loss" />， 形式（伪代码）：
        </p>
        <div
          className="mt-2 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN, color: INK }}
        >
          <pre className="whitespace-pre">{`L = - log(  exp(sim(anchor, positive) / τ)
            / Σ exp(sim(anchor, x) / τ) )
其中 x ∈ {positive} ∪ {negatives}`}</pre>
        </div>
        <p className="pt-3">
          直觉拆解：
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>分子：anchor 跟 positive 的相似度</li>
          <li>分母：anchor 跟所有候选（包括 positive 和 negatives）的相似度之和</li>
          <li>整体形式是<strong>softmax 概率取负对数</strong>， 等价于"把 positive 当正确答案的分类损失"</li>
          <li>τ（temperature）控制 softmax 的"尖锐"程度， 影响训练动力</li>
        </ul>
      </Section>

      <Section title="四、温度系数 τ 的影响" underlineWidth={240}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>τ 小（如 0.05）</strong> ——
            softmax 尖锐， 模型对"hard negative"敏感， 区分能力强
          </li>
          <li>
            <strong>τ 大（如 1）</strong> ——
            softmax 平坦， 训练梯度温和， 但区分细微差异能力变弱
          </li>
        </ul>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          实战常用 τ = 0.05 ~ 0.1。
        </p>
      </Section>

      <Section title="五、为什么它对 embedding 是革命性的" underlineWidth={330}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>不需要"标准答案"</strong> ——
            训练数据只需要"什么和什么相似"， 而不是"输入对应什么数字"
          </li>
          <li>
            <strong>可以从大量未标注数据学</strong> ——
            "同文档不同段"、 "同图不同 crop"都是天然正样本对
          </li>
          <li>
            <strong>学出来的空间适合检索</strong> ——
            余弦相似度直接可用， 不需要再加一层 head
          </li>
          <li>
            <strong>规模化好</strong> —— batch 越大， in-batch negatives 越多， 训练信号越丰富
          </li>
        </ul>
      </Section>

      <Section title="六、典型应用" underlineWidth={170}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>文本 embedding</strong>：OpenAI text-embedding-3、 Voyage、 BGE、 GTE 全都是对比学习训
          </li>
          <li>
            <strong>多模态对齐</strong>：CLIP（图文配对）、 ALIGN —— 让图片 embedding 和它的描述文字 embedding 靠近
          </li>
          <li>
            <strong>自监督视觉</strong>：SimCLR、 MoCo —— 同一张图的两种数据增强算正样本
          </li>
          <li>
            <strong>Rerank 训练</strong>：cross-encoder 也常用对比方式训
          </li>
        </ul>
      </Section>

      <Section title="七、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="Contrastive learning" ch="对比学习" /></li>
          <li><Term en="Anchor / Positive / Negative" ch="锚点 / 正样本 / 负样本" /></li>
          <li><Term en="InfoNCE" ch="对比学习的主流损失函数" /></li>
          <li><Term en="In-batch negatives" ch="同 batch 内其他样本当负样本" /></li>
          <li><Term en="Hard negatives" ch="难负样本， 看似相似但不相关的" /></li>
          <li><Term en="Temperature τ" ch="损失函数里的尖锐度参数" /></li>
          <li><Term en="CLIP" ch="OpenAI 多模态对比学习模型" /></li>
          <li><Term en="SimCSE" ch="句子 embedding 对比学习" /></li>
        </ul>
      </Section>

      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>对比学习不教模型"标准答案"，</p>
            <p>而是教它"什么和什么是一伙的"。</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            van den Oord, A. et al. (2018).{' '}
            <em>Representation Learning with Contrastive Predictive Coding</em>. arXiv 1807.03748.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/1807.03748"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/1807.03748
            </a>
            （InfoNCE loss 提出）
          </li>
          <li>
            Chen, T. et al. (2020).{' '}
            <em>A Simple Framework for Contrastive Learning of Visual Representations (SimCLR)</em>. ICML 2020.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2002.05709"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2002.05709
            </a>
          </li>
          <li>
            Radford, A. et al. (2021).{' '}
            <em>Learning Transferable Visual Models From Natural Language Supervision (CLIP)</em>. ICML 2021.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2103.00020"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2103.00020
            </a>
          </li>
          <li>
            Gao, T., Yao, X., Chen, D. (2021).{' '}
            <em>SimCSE: Simple Contrastive Learning of Sentence Embeddings</em>. EMNLP 2021.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2104.08821"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2104.08821
            </a>
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
