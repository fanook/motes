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
  title: 'Hallucination 幻觉',
  date: '2026-05-29',
  tags: ['AI 入门', 'LLM', '可靠性'],
  summary: '为什么 AI 会一本正经胡说八道。 分类、 根因、 怎么缓解。',
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
          Hallucination
        </h1>
        <div className="mt-1">
          <RoughUnderline width={250} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— AI 一本正经胡说八道是怎么回事
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          问 AI："谁写了《静夜思》？" —— "李白"。 对。
        </p>
        <p>
          问 AI："谁写了《冬夜思》？" —— "白居易， 收录于《白氏长庆集》卷三十..."
          自信、 流畅、 完全是编的。
        </p>
        <p className="pt-2">
          这种现象就叫 <Term en="Hallucination" ipa="/həˌluːsɪˈneɪʃən/" ch="幻觉" />。
          不是"模型笨"， 而是底层机制决定的。
        </p>
      </div>

      <Section title="一、为什么必然发生（根因）" underlineWidth={250}>
        <p><strong>1. LLM 不是知识库， 是"下一个 token 预测器"</strong></p>
        <p>
          它的训练目标只有一个：给定前文， 预测概率最高的下一个 token。
          它没"事实检查"模块， 也没区分"我知道"和"我不知道"。
        </p>

        <p className="pt-3"><strong>2. 流畅性 ≠ 准确性</strong></p>
        <p>
          模型被训练得能输出流畅的语言。 "李白写过《静夜思》"和"白居易写过《冬夜思》"
          在语法 / 风格 / 流畅度上<strong>没有任何区别</strong>， 模型只是按概率分布在采样。
        </p>

        <p className="pt-3"><strong>3. 训练数据有边界 + 时间冻结</strong></p>
        <p>
          训练截止日期之后的事实它不知道； 训练数据本身也有错误、 噪声、 矛盾，
          模型会"记住"这些。
        </p>

        <p className="pt-3"><strong>4. 压缩损失</strong></p>
        <p>
          GPT-5 大约 1 万亿参数， 但训练数据有几十 TB。
          所有人类知识被<strong>压缩</strong>进有限参数， 必然损失细节 —— 越冷门的事实越模糊。
        </p>
      </Section>

      <Section title="二、分类（综述里的标准切法）" underlineWidth={280}>
        <p>
          Huang et al. 2024 的综述 <sup>[1]</sup> 给出主流分法：
        </p>

        <div
          className="mt-2 p-3 rounded-sm space-y-2 text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          <p><strong>按是否依赖外部源：</strong></p>
          <p className="pl-3">
            <Term en="Intrinsic" ch="内在" /> —— 输出和给定的上下文 / 文档<strong>矛盾</strong>。
            例：让它总结一段文章， 它说出文章里没说的东西
          </p>
          <p className="pl-3">
            <Term en="Extrinsic" ch="外在" /> —— 输出无法用提供的上下文或事实验证。
            例：编造一篇不存在的论文标题
          </p>
        </div>

        <div
          className="mt-3 p-3 rounded-sm space-y-2 text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          <p><strong>按表现：</strong></p>
          <p className="pl-3">
            <strong>事实型</strong> —— 说错具体数字、 人名、 时间、 公式
          </p>
          <p className="pl-3">
            <strong>逻辑型</strong> —— 前后自相矛盾、 数学推理跑偏
          </p>
          <p className="pl-3">
            <strong>语境型</strong> —— 答非所问、 把用户没问的内容生造出来
          </p>
          <p className="pl-3">
            <strong>引用型</strong> —— 编造论文、 URL、 作者
          </p>
        </div>
      </Section>

      <Section title={'三、最容易"翻车"的几个场景'} underlineWidth={290}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>具体数字 / 日期 / 价格</strong> ——
            "GPT-4 发布于 2022 年 11 月 30 日" （错， 那是 ChatGPT）
          </li>
          <li>
            <strong>论文引用 / URL / DOI</strong> —— 编造率极高
          </li>
          <li>
            <strong>冷门人物 / 地名</strong> —— 训练语料里出现少， 一旦问到就靠"编"补
          </li>
          <li>
            <strong>实时 / 时效信息</strong> —— 训练截止之后的事
          </li>
          <li>
            <strong>专业法律 / 医学 / 金融</strong> —— 看起来权威， 实际可能完全错位
          </li>
          <li>
            <strong>代码 API</strong> —— 调用不存在的方法、 参数名编造
          </li>
        </ul>
      </Section>

      <Section title="四、模型自己知道吗？" underlineWidth={220}>
        <p>
          有趣的是：模型内部的 <strong>logit 分布的熵</strong>， 在它"瞎编"时往往更高
          （没有一个明显胜出的 token）。 也就是说——<strong>模型自己"心里没底"， 只是嘴上很硬</strong>。
        </p>
        <p>
          近年研究 <sup>[2]</sup> 尝试用模型自身的不确定度去检测 / 抑制幻觉：
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>多次采样看一致性（self-consistency）</li>
          <li>token-level probability 监控</li>
          <li>让模型同时输出"confidence score"</li>
        </ul>
      </Section>

      <Section title="五、怎么缓解（不是消除）" underlineWidth={260}>
        <p>
          <strong style={{ color: INK_RED }}>
            幻觉不能完全消除， 只能降低 + 检测 + 兜底。
          </strong>
        </p>

        <p className="pt-3"><strong>工程层：</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>
            <strong>RAG</strong> —— 把权威资料检索后塞进 prompt， 让模型"开卷答" （详见 [RAG]）
          </li>
          <li>
            <strong>工具调用 / function calling</strong> —— 该查数据库就查， 别让模型自己想
          </li>
          <li>
            <strong>引用 / 出处</strong> —— 让模型在每个事实后面给出原文片段
          </li>
          <li>
            <strong>结构化输出</strong> —— JSON Schema 限定字段， 至少格式上不会跑偏
          </li>
        </ul>

        <p className="pt-3"><strong>prompt 层：</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>明确说"不确定就说不知道"</li>
          <li>让模型先列出已知证据， 再做结论（Chain of Thought， 详见 [CoT]）</li>
          <li>降低 temperature（详见采样那篇）</li>
        </ul>

        <p className="pt-3"><strong>评估层：</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>专门做 hallucination benchmark：TruthfulQA、 HaluEval 等</li>
          <li>第二个模型当 judge 做事实核对</li>
          <li>关键场景人工审核</li>
        </ul>
      </Section>

      <Section title="六、产品层面的态度" underlineWidth={210}>
        <p>
          作为产品 / 业务方， 不要假定"接入了大模型就有事实"。 该做的：
        </p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>分类用法</strong>：高风险（医疗、 法律、 财务） vs 低风险（写邮件、 头脑风暴）
          </li>
          <li>
            <strong>高风险场景</strong> 必须 RAG + 引用 + 人工 review
          </li>
          <li>
            <strong>低风险场景</strong> 允许偶发翻车， 但需告知用户"AI 生成内容"
          </li>
          <li>
            <strong>UI 层提示不确定性</strong>， 不要把模型输出包装成"权威结论"
          </li>
        </ul>
      </Section>

      <Section title="七、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="Hallucination" ipa="/həˌluːsɪˈneɪʃən/" ch="幻觉" /></li>
          <li><Term en="Intrinsic / Extrinsic hallucination" ch="内在 / 外在幻觉" /></li>
          <li><Term en="Faithfulness" ch="忠实度， 输出是否忠于源材料" /></li>
          <li><Term en="Groundedness" ch="可对应性， 输出能否在源材料里找到依据" /></li>
          <li><Term en="Self-consistency" ch="多次采样看一致性的检测方法" /></li>
          <li><Term en="TruthfulQA" ch="一个评测幻觉的 benchmark" /></li>
        </ul>
      </Section>

      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>LLM 是"预测下一个 token"， 不是"查事实"。</p>
            <p>幻觉是机制的副产物， 只能缓解， 不能根除。</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            Huang, L. et al. (2023).{' '}
            <em>A Survey on Hallucination in Large Language Models: Principles, Taxonomy, Challenges, and Open Questions</em>. arXiv 2311.05232.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2311.05232"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2311.05232
            </a>
            （幻觉分类的主流综述）
          </li>
          <li>
            Kadavath, S. et al. (2022).{' '}
            <em>Language Models (Mostly) Know What They Know</em>. arXiv 2207.05221.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2207.05221"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2207.05221
            </a>
            （模型内部不确定度可用于检测幻觉）
          </li>
          <li>
            Lin, S., Hilton, J., Evans, O. (2021).{' '}
            <em>TruthfulQA: Measuring How Models Mimic Human Falsehoods</em>. ACL 2022.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2109.07958"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2109.07958
            </a>
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
