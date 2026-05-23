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
  title: '训练 vs 微调 vs RAG',
  date: '2026-06-04',
  tags: ['AI 入门', 'LLM', '选型'],
  summary:
    '"模型不会我们要的事"怎么办？ 三种解法的代价、 适用场景、 选型决策框架。',
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
          训练 / 微调 / RAG
        </h1>
        <div className="mt-1">
          <RoughUnderline width={290} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— 三种"教模型"的方式怎么选
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          场景：模型不知道公司内部知识 / 不按你想要的风格说话 / 在某个细分领域表现差。 你有三个工具 ——
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>
            <strong>Pre-training</strong>（预训练） —— 从零或继续训练一个模型
          </li>
          <li>
            <strong>Fine-tuning</strong>（微调） —— 在已有模型上小幅调整参数
          </li>
          <li>
            <strong>RAG</strong>（检索增强） —— 不动模型， 把信息塞进 prompt
          </li>
        </ul>
        <p className="pt-1">
          这三者经常被混着说， 但成本、 难度、 适用场景完全不同。
        </p>
      </div>

      <Section title="一、Pre-training（预训练）" underlineWidth={260}>
        <p><strong>是什么</strong>：从随机权重 / 已有 checkpoint 出发， 在大量文本上做下一 token 预测。</p>

        <p className="pt-2"><strong>代价：</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>数据：百 G ~ 十 T 级 token</li>
          <li>算力：万 GPU·月， 千万 ~ 亿美元</li>
          <li>时间：数月</li>
        </ul>

        <p className="pt-2">
          <strong>什么时候做</strong>：
          只有<strong style={{ color: INK_RED }}>语言 / 领域差异极大</strong>
          （金融、 医药专用语料）或要做<strong>独立基础模型</strong>时才考虑。
          普通公司基本不做。
        </p>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          变种：<Term en="Continued pre-training" ch="继续预训练" /> ——
          在 Llama / Qwen 等开源 base 上， 用你的领域语料继续训。 比从零便宜得多。
        </p>
      </Section>

      <Section title="二、Fine-tuning（微调）" underlineWidth={250}>
        <p>
          <strong>是什么</strong>：在 base 模型上， 用你的"问题-期望回答"数据训练，
          让模型在你的任务上效果更好。
        </p>

        <p className="pt-2"><strong>主流变种：</strong></p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <Term en="SFT" ch="Supervised Fine-Tuning， 监督微调" /> ——
            给模型大量"输入-输出"样本， 直接教
          </li>
          <li>
            <Term en="LoRA / QLoRA" /> ——
            只训小矩阵， 不动原参数。 显存友好， 几张消费级 GPU 就能搞
          </li>
          <li>
            <Term en="DPO / RLHF" ch="对齐微调" /> ——
            教模型"偏好"， 详见 [RLHF]
          </li>
        </ul>

        <p className="pt-3"><strong>代价：</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>数据：几百到几万条高质量标注</li>
          <li>算力：LoRA 几小时几十美元； 全参数几天几千美元</li>
          <li>难度：要会数据清洗、 超参调、 评估</li>
        </ul>

        <p className="pt-2">
          <strong>什么时候做</strong>：
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>需要稳定的<strong>输出风格 / 格式</strong>（客服话术、 报告模板）</li>
          <li>需要稳定的<strong>领域行为</strong>（医疗问答、 法律分析）</li>
          <li>需要把工具调用 / 结构化输出嵌入模型</li>
          <li>有大量"我希望它这么答"的真实样本</li>
        </ul>
      </Section>

      <Section title="三、RAG（检索增强）" underlineWidth={210}>
        <p>
          <strong>是什么</strong>：模型不变， 把权威资料检索后塞进 prompt（详见 [RAG]）。
        </p>

        <p className="pt-2"><strong>代价：</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>数据：你已有的文档库即可</li>
          <li>算力：embedding + 向量库， 单机起步</li>
          <li>难度：工程实现， 难点在切块 / 召回 / rerank</li>
        </ul>

        <p className="pt-2">
          <strong>什么时候做</strong>：
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>需要让模型回答<strong>它训练时不知道的事实</strong>（公司内部数据、 实时信息）</li>
          <li>知识需要<strong>频繁更新</strong>， 不可能每次都重训</li>
          <li>需要<strong>可解释、 可追溯</strong>的来源</li>
          <li>知识库远大于 context， 不可能一次塞完</li>
        </ul>
      </Section>

      <Section title="四、对比表" underlineWidth={120}>
        <div className="mt-2 overflow-x-auto">
          <table
            className="text-sm sm:text-base w-full"
            style={{ fontFamily: PEN, borderCollapse: 'collapse' }}
          >
            <thead>
              <tr style={{ color: INK_SEPIA }}>
                <th className="text-left p-2 border-b-2 border-dashed border-stone-400">维度</th>
                <th className="text-left p-2 border-b-2 border-dashed border-stone-400">Pre-train</th>
                <th className="text-left p-2 border-b-2 border-dashed border-stone-400">Fine-tune</th>
                <th className="text-left p-2 border-b-2 border-dashed border-stone-400">RAG</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300">改变模型</td>
                <td className="p-2 border-b border-dashed border-stone-300">是</td>
                <td className="p-2 border-b border-dashed border-stone-300">是</td>
                <td className="p-2 border-b border-dashed border-stone-300">否</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300">改变行为/风格</td>
                <td className="p-2 border-b border-dashed border-stone-300">✓✓✓</td>
                <td className="p-2 border-b border-dashed border-stone-300">✓✓</td>
                <td className="p-2 border-b border-dashed border-stone-300">✗</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300">注入新事实</td>
                <td className="p-2 border-b border-dashed border-stone-300">✓✓✓</td>
                <td className="p-2 border-b border-dashed border-stone-300">✓ 但易遗忘</td>
                <td className="p-2 border-b border-dashed border-stone-300">✓✓✓</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300">知识可更新</td>
                <td className="p-2 border-b border-dashed border-stone-300">慢</td>
                <td className="p-2 border-b border-dashed border-stone-300">慢</td>
                <td className="p-2 border-b border-dashed border-stone-300">实时</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300">可追溯出处</td>
                <td className="p-2 border-b border-dashed border-stone-300">✗</td>
                <td className="p-2 border-b border-dashed border-stone-300">✗</td>
                <td className="p-2 border-b border-dashed border-stone-300">✓</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300">成本数量级</td>
                <td className="p-2 border-b border-dashed border-stone-300">$M~$B</td>
                <td className="p-2 border-b border-dashed border-stone-300">$10~$10k</td>
                <td className="p-2 border-b border-dashed border-stone-300">$1~$1k 起步</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300">上线时间</td>
                <td className="p-2 border-b border-dashed border-stone-300">月</td>
                <td className="p-2 border-b border-dashed border-stone-300">天-周</td>
                <td className="p-2 border-b border-dashed border-stone-300">天</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="五、选型决策树" underlineWidth={170}>
        <p>问自己 3 个问题：</p>

        <p className="pt-3"><strong>Q1. 我要解决的是"知识"还是"行为"？</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>"它不知道公司业务" → 知识 → 看 Q2</li>
          <li>"它说话太啰嗦 / 格式不对" → 行为 → fine-tune</li>
          <li>"它在某领域推理弱" → 行为 → fine-tune， 严重时 continued pre-train</li>
        </ul>

        <p className="pt-3"><strong>Q2. 知识更新频率？</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>每天都变（产品文档、 工单、 库存）→ <strong style={{ color: INK_GREEN }}>RAG</strong></li>
          <li>很少变， 体量不大（行业规范、 法律条文）→ RAG 也行， fine-tune 也行</li>
          <li>核心领域知识， 极大量（医学教材级）→ continued pre-training</li>
        </ul>

        <p className="pt-3"><strong>Q3. 预算和数据？</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>没标注数据 / 没预算 → RAG</li>
          <li>有几百~几千高质量样本 → LoRA / SFT</li>
          <li>千万美金 + 十几亿 token + 半年时间 → 真要 pre-train， 但请先确认是不是真的需要</li>
        </ul>

        <p
          className="mt-3 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          💡 实际工程几乎都是 <strong>RAG 优先 + 必要时 fine-tune</strong> 的组合。
          Pre-training 留给少数有底层模型野心的团队。
        </p>
      </Section>

      <Section title="六、常见误区" underlineWidth={170}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>"用 fine-tune 注入知识"</strong> —— 可以， 但效率低、 易遗忘、 难更新。
            一般情况下用 RAG 更优
          </li>
          <li>
            <strong>"RAG 解决一切"</strong> —— RAG 改不了说话风格、 推理能力、 输出格式。 这些需要 fine-tune
          </li>
          <li>
            <strong>"先 fine-tune 再 RAG"</strong> —— 很多团队最后会走到这一步，
            但不必一开始就上， 先纯 RAG 跑通再说
          </li>
          <li>
            <strong>"自己 pre-train 才安全"</strong> —— 对绝大多数业务方是 over-engineering。
            托管的闭源模型 + 数据隔离 / ZDR 一般就够
          </li>
        </ul>
      </Section>

      <Section title="七、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="Pre-training" ch="预训练， 从大量文本学语言基础" /></li>
          <li><Term en="Continued pre-training" ch="在已有 base 上继续预训练" /></li>
          <li><Term en="Fine-tuning" ch="微调" /></li>
          <li><Term en="SFT" ch="监督微调， 给输入-输出对" /></li>
          <li><Term en="LoRA" ipa="/ˈloʊrə/" ch="低秩适配， 显存友好的微调技巧" /></li>
          <li><Term en="Catastrophic forgetting" ch="灾难性遗忘， 微调注入新知识时易丢旧知识" /></li>
          <li><Term en="RAG" ch="检索增强生成" /></li>
        </ul>
      </Section>

      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>新事实 → RAG。 新行为 → fine-tune。</p>
            <p>真要 pre-train 之前， 先确认前两个不够用。</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            Hu, E. J. et al. (2021).{' '}
            <em>LoRA: Low-Rank Adaptation of Large Language Models</em>. ICLR 2022.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2106.09685"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2106.09685
            </a>
          </li>
          <li>
            Lewis, P. et al. (2020).{' '}
            <em>Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks</em>. NeurIPS 2020.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2005.11401"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2005.11401
            </a>
          </li>
          <li>
            Ovadia, O. et al. (2023).{' '}
            <em>Fine-Tuning or Retrieval? Comparing Knowledge Injection in LLMs</em>. EMNLP 2024.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2312.05934"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2312.05934
            </a>
            （实验对比： RAG 注入知识普遍优于 fine-tune）
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
