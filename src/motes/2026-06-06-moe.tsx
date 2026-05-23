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
  title: 'MoE 混合专家',
  date: '2026-06-06',
  tags: ['AI 入门', 'LLM', '架构'],
  summary: '为什么 DeepSeek、 GPT-5 这些大模型推理那么便宜？ MoE 架构是关键。',
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
          MoE
        </h1>
        <div className="mt-1">
          <RoughUnderline width={130} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— 混合专家
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          一个常见现象：DeepSeek V3 / R1、 Mixtral、 GPT-5 这些"大"模型，
          总参数动辄几千亿， 但<strong>推理时只激活十几个 B</strong>。
        </p>
        <p>
          靠的是 <Term en="MoE" ch="Mixture of Experts， 混合专家" /> 架构。
        </p>
        <p className="pt-2">
          核心思想：不是每个 token 都用整个模型， 而是
          <strong style={{ color: INK_RED }}>给每个 token 路由到几个"专家"子网络</strong>，
          其他专家这次完全不参与计算。
        </p>
      </div>

      <Section title="一、和 dense 模型的对比" underlineWidth={290}>
        <p><strong>Dense（稠密， 传统）</strong>： 每层就是一个大 FFN（前馈网络）。 算每个 token 都要把所有参数过一遍。</p>

        <p className="pt-3"><strong>MoE（稀疏）</strong>：每个 MoE 层有 N 个"专家"小 FFN（比如 N=64）+ 1 个 router。 router 给每个 token 分配 top-k 个专家（比如 k=2）， 这 k 个专家算完合并起来。</p>

        <div
          className="mt-3 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: 'rgba(255,255,255,0.6)', fontFamily: PEN, color: INK }}
        >
          <pre className="whitespace-pre">{`token x
  ↓
router 给每个专家打分 → softmax
  ↓
挑出 top-k=2 个专家 (E1, E37)
  ↓
y = w1 · E1(x) + w37 · E37(x)`}</pre>
        </div>
      </Section>

      <Section title="二、关键指标：总参数 vs 激活参数" underlineWidth={320}>
        <p>MoE 模型有两个参数量：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li><strong>总参数</strong>（total params）—— 所有专家加起来的总规模。 决定<strong>知识容量</strong></li>
          <li><strong>激活参数</strong>（active params per token）—— 单 token 真正经过的参数。 决定<strong>推理成本和速度</strong></li>
        </ul>

        <p className="pt-3">真实例子：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>DeepSeek V3：<strong>671B 总参数 / 37B 激活</strong>（每个 token 用 37B）</li>
          <li>Mixtral 8x22B：总 141B / 激活 39B</li>
          <li>Qwen3-235B-A22B：总 235B / 激活 22B</li>
        </ul>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          所以一个 MoE 模型可以同时"很大"（参数容量上）和"便宜"（推理成本上）。
        </p>
      </Section>

      <Section title="三、为什么 MoE 行得通" underlineWidth={250}>
        <p>
          直觉：不同领域的知识其实<strong>不需要全部一起调用</strong>。
        </p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>处理"今天天气"时， 数学专家可以休息</li>
          <li>处理"积分公式"时， 闲聊专家可以休息</li>
          <li>处理代码时， 中文小说专家可以休息</li>
        </ul>
        <p className="pt-2">
          router 学会"什么 token 该去找谁"。 这相当于让模型形成
          <strong style={{ color: INK_SEPIA }}>领域专门化</strong>，
          总容量增大， 但每次只用一小部分。
        </p>
      </Section>

      <Section title="四、router 怎么训" underlineWidth={170}>
        <p>
          router 本身是个小的线性层 + softmax。 训练时面临两个矛盾：
        </p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>专家专门化</strong> —— router 要把相似 token 路由给同一专家
          </li>
          <li>
            <strong>负载均衡</strong> —— 所有专家都要被用到， 不能某几个专家忙死、 其他闲死
          </li>
        </ul>
        <p className="pt-2">
          通常加一个<strong>负载均衡 loss</strong>， 鼓励每个专家被均匀使用。
        </p>
      </Section>

      <Section title="五、代价" underlineWidth={120}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>显存翻倍</strong> ——
            总参数都要加载到显存才能 router 选择。 训练 / 部署都需要更多显存
          </li>
          <li>
            <strong>训练不稳定</strong> ——
            router 的离散选择难训， 容易某些专家完全闲置（"dead experts"）
          </li>
          <li>
            <strong>分布式实现复杂</strong> ——
            专家可能分布在不同 GPU 上， token 需要跨设备路由（"all-to-all" 通信）
          </li>
          <li>
            <strong>批次效率受影响</strong> ——
            一个 batch 内的 token 可能去不同专家， 通信和计算 pattern 比 dense 复杂
          </li>
        </ul>
      </Section>

      <Section title="六、谁在用" underlineWidth={140}>
        <p>2026 年主流 MoE 模型：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li><strong>DeepSeek V3 / R1</strong> —— 671B / 37B， 把 MoE + 推理模型一起推出圈</li>
          <li><strong>Mixtral 8x7B / 8x22B</strong> —— Mistral 的开源系列， 把 MoE 带进开源社区</li>
          <li><strong>Qwen3-MoE</strong> —— 阿里千问的 MoE 版</li>
          <li><strong>GPT-4 / GPT-5</strong> —— OpenAI 没明说， 但行业普遍认为是 MoE</li>
          <li><strong>Gemini 1.5+</strong> —— Google 明确说用了 MoE</li>
        </ul>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          2024 是 dense 转 MoE 的拐点， 2026 几乎所有新 frontier 模型都是 MoE。
        </p>
      </Section>

      <Section title="七、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="MoE" ch="Mixture of Experts" /></li>
          <li><Term en="Dense model" ch="稠密模型， 每个 token 用所有参数" /></li>
          <li><Term en="Expert" ch="专家， MoE 里的子网络" /></li>
          <li><Term en="Router" ch="路由器， 决定 token 走哪些专家" /></li>
          <li><Term en="Active parameters" ch="激活参数， 单 token 实际经过的参数量" /></li>
          <li><Term en="Load balancing loss" ch="负载均衡损失， 防止专家闲忙不均" /></li>
          <li><Term en="Top-k routing" ch="每个 token 选 k 个专家" /></li>
        </ul>
      </Section>

      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>MoE = 大容量 + 小激活。</p>
            <p>这是 2024+ 大模型推理能"又强又便宜"的根本架构。</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            Shazeer, N. et al. (2017).{' '}
            <em>Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer</em>. ICLR 2017.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/1701.06538"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/1701.06538
            </a>
            （现代 MoE 用于神经网络的开创性论文）
          </li>
          <li>
            DeepSeek-AI (2024).{' '}
            <em>DeepSeek-V3 Technical Report</em>. arXiv 2412.19437.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2412.19437"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2412.19437
            </a>
            （671B 总 / 37B 激活， MoE 推理革命的代表）
          </li>
          <li>
            Jiang, A. Q. et al. (2024).{' '}
            <em>Mixtral of Experts</em>. arXiv 2401.04088.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2401.04088"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2401.04088
            </a>
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
