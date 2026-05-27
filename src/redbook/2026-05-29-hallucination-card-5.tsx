import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'hallucination',
  index: 5,
  total: 9,
  title: '翻车场景',
};

const SCENES: { title: string; line: string }[] = [
  { title: '具体数字 / 日期 / 价格', line: '"GPT-4 发布于 2022.11.30"（错 ， 那是 ChatGPT）' },
  { title: '论文引用 / URL / DOI', line: '编造率极高 ， 看着像真的' },
  { title: '冷门人物 / 地名', line: '语料里出现少 ， 一问就靠"编"补' },
  { title: '实时 / 时效信息', line: '训练截止之后的事 ， 一律不靠谱' },
  { title: '专业法律 / 医学 / 金融', line: '看起来权威 ， 实际可能完全错位' },
  { title: '代码 API', line: '调用不存在的方法 ， 编造参数名' },
];

export default function Card5() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>最容易翻车的场景</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {SCENES.map((s) => (
            <div
              key={s.title}
              style={{
                background: '#fef3c7',
                border: '3px solid ' + INK,
                borderRadius: 13,
                padding: '16px 26px',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 32, color: INK_RED, fontWeight: 700 }}>{s.title}</div>
              <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.35 }}>{s.line}</div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: PEN, fontSize: 28, color: INK_SEPIA, fontWeight: 700 }}>
          口诀：越具体、 越冷门、 越实时 ， 越要核对。
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
