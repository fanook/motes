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
  title: 'BERT 与上下文 embedding',
  date: '2026-06-10',
  tags: ['AI 入门', 'NLP', '历史'],
  summary:
    'GPT 时代之前的王者。 双向 attention、 masked language modeling， 为什么"一词一向量"被它打破。',
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
          BERT
        </h1>
        <div className="mt-1">
          <RoughUnderline width={150} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— 上下文相关 embedding 的起点
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          2018-2022 这段， NLP 的王者是 <Term en="BERT" ipa="/bɜːrt/" />
          （Devlin et al. 2018, NAACL 2019 <sup>[1]</sup>）。
        </p>
        <p>
          它和 GPT 是同期的两个分支， 但走的是完全不同的路 —— 一个看双向、 一个看单向。
        </p>
        <p className="pt-1">
          为什么今天讲？ 因为 BERT 的两个核心思想 ——
          <strong style={{ color: INK_RED }}>双向 attention</strong> 和
          <strong style={{ color: INK_RED }}>MLM 训练</strong>
          —— 直接催生了今天所有 embedding 模型、 reranker、 分类器。
        </p>
      </div>

      <Section title="一、Word2Vec 留下的问题" underlineWidth={250}>
        <p>
          上一辈 Word2Vec / GloVe（详见 [Embedding] 里的历史脉络）的死穴：
          <strong style={{ color: INK_RED }}>一词一向量</strong>。
        </p>
        <p>
          "苹果手机"里的<strong>苹果</strong>和"苹果好吃"里的<strong>苹果</strong>， 是同一个 embedding。
          完全没有<strong>上下文</strong>。
        </p>
        <p className="pt-2">
          BERT 用 Transformer 给同一个词在不同句子里输出
          <strong style={{ color: INK_SEPIA }}>不同的 embedding</strong>。 这是它的根本贡献。
        </p>
      </Section>

      <Section title="二、Encoder-only：和 GPT 的根本差异" underlineWidth={350}>
        <p>
          Transformer 原论文（Vaswani et al. 2017， 详见 [Attention]）提的是
          <strong>encoder-decoder</strong> 架构， 用于翻译。 后来分化：
        </p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>GPT 系列</strong> —— 只保留 decoder， 用 <Term en="causal mask" /> 让每个 token 只看自己之前。
            目标：自回归生成。 适合写作 / 对话
          </li>
          <li>
            <strong>BERT 系列</strong> —— 只保留 encoder， <strong>不加 causal mask</strong>，
            每个 token 能看到整句前后所有 token（双向）。 目标：理解 / 表征。
            适合分类、 抽取、 检索
          </li>
        </ul>
      </Section>

      <Section title={'三、MLM：怎么用没监督数据训"双向"'} underlineWidth={350}>
        <p>
          双向 attention 看着好， 但训练目标怎么定？ 不能用"预测下一个"（那是单向的）。
        </p>
        <p>
          BERT 的解法：<Term en="Masked Language Modeling (MLM)" ch="掩码语言建模" />。
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>随机把句子里 15% 的 token 替换成 <code className="px-1 bg-stone-100 rounded text-sm">[MASK]</code></li>
          <li>让模型根据<strong>左右两侧上下文</strong>预测被遮的 token 是什么</li>
          <li>这就强制模型用全句信息， 而不是只看一侧</li>
        </ul>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          配套还有 NSP（Next Sentence Prediction）—— 给两个句子， 预测是不是相邻的。 后续研究发现这个任务用处不大， RoBERTa 等版本去掉了。
        </p>
      </Section>

      <Section title='四、为什么 BERT 是 embedding 的"祖宗"' underlineWidth={310}>
        <p>
          BERT 预训练完后， 每个 token 都有一个<strong>上下文相关的 embedding</strong>。
          再做一些小改造就能干很多事：
        </p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>句子 embedding</strong> —— 取 <code className="px-1 bg-stone-100 rounded text-sm">[CLS]</code> token 的 embedding 或所有 token 的池化， 当成"整句的向量"。 这是 Sentence-BERT、 SimCSE、 BGE 等的雏形
          </li>
          <li>
            <strong>分类</strong> —— [CLS] 输出接一层 MLP， 训成情感分类器、 意图识别等
          </li>
          <li>
            <strong>命名实体识别 / 序列标注</strong> —— 每个 token 输出接 MLP， 打类别标签
          </li>
          <li>
            <strong>抽取式问答</strong> —— 输出"答案在原文哪个位置"的 start/end 概率
          </li>
          <li>
            <strong>Cross-encoder rerank</strong> —— query 和 doc 拼一起塞进 BERT， 输出相关性分数（详见 [Rerank]）
          </li>
        </ul>
      </Section>

      <Section title="五、BERT 之后的演化" underlineWidth={210}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>RoBERTa</strong>（Facebook 2019）—— 改进 BERT 的训练细节： 更大 batch、 更多数据、 去掉 NSP
          </li>
          <li>
            <strong>ALBERT</strong>（Google 2019）—— 参数共享版， 小内存
          </li>
          <li>
            <strong>ELECTRA</strong>（Google 2020）—— 不预测 mask 的内容， 而是判断"哪个 token 是被替换的"
          </li>
          <li>
            <strong>DeBERTa</strong>（Microsoft 2020）—— 改进 attention 与位置编码
          </li>
          <li>
            <strong>Sentence-BERT / SBERT</strong>（2019）—— 用对比学习把 BERT 变成专门的句子 embedding 模型
          </li>
          <li>
            <strong>现代 embedding 模型（BGE、 GTE、 OpenAI text-embedding-3、 Voyage、 Cohere）</strong> ——
            基本都是 BERT 思路 + 对比学习（详见 [Contrastive Learning]）
          </li>
        </ul>
      </Section>

      <Section title={'六、为什么 ChatGPT 之后 BERT "不火了"'} underlineWidth={400}>
        <p>
          2022 ChatGPT 之后， 注意力都转到生成式（decoder-only）模型上。 但 BERT 本身没消失， 只是变成了
          <strong style={{ color: INK_SEPIA }}>后台基础设施</strong>：
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>每次你用 RAG 的 embedding， 背后大概率是 BERT 家族</li>
          <li>每个搜索引擎的 query understanding， 背后大概率是 BERT 家族</li>
          <li>分类、 抽取、 标注， 仍然是 BERT 类模型最高效</li>
        </ul>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          换句话说：generation 让 decoder-only 赢了， understanding 仍然是 BERT 这套的天下。
        </p>
      </Section>

      <Section title="七、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="BERT" ch="Bidirectional Encoder Representations from Transformers" /></li>
          <li><Term en="Encoder-only" ch="只有编码器的 Transformer 变体" /></li>
          <li><Term en="MLM" ch="Masked Language Modeling， 掩码语言建模" /></li>
          <li><Term en="NSP" ch="Next Sentence Prediction， 句子相邻预测" /></li>
          <li><Term en="[CLS] token" ch="句首特殊 token， 用来表示整句" /></li>
          <li><Term en="Sentence-BERT" ch="把 BERT 改造成句子 embedding 模型" /></li>
          <li><Term en="Fine-tuning task" ch="预训练后的下游任务微调" /></li>
        </ul>
      </Section>

      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>BERT 用双向 attention 解决了"一词一向量"的问题。</p>
            <p>它是今天所有 embedding / rerank 模型的祖宗。</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            Devlin, J. et al. (2018).{' '}
            <em>BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding</em>. NAACL 2019.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/1810.04805"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/1810.04805
            </a>
            （BERT 原始论文）
          </li>
          <li>
            Reimers, N., Gurevych, I. (2019).{' '}
            <em>Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks</em>. EMNLP 2019.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/1908.10084"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/1908.10084
            </a>
          </li>
          <li>
            Liu, Y. et al. (2019).{' '}
            <em>RoBERTa: A Robustly Optimized BERT Pretraining Approach</em>. arXiv 1907.11692.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/1907.11692"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/1907.11692
            </a>
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
