import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'function-calling',
  index: 4,
  total: 8,
  title: '工具怎么声明',
};

const CODE = `tool {
  name: "get_weather"
  description: "查询某城市当前天气"
  parameters: {
    city: { type: string, required }
    unit: { type: enum[c, f], default: c }
  }
}`;

export default function Card4() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>工具怎么"声明"</CardSectionHeading>
        <CardText size={38}>
          给模型一份工具清单 ， 每个工具长这样（伪代码）：
        </CardText>

        <div
          style={{
            background: '#fdf6e3',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '28px 34px',
            fontFamily: PEN,
            fontSize: 32,
            color: INK,
            whiteSpace: 'pre',
            lineHeight: 1.55,
          }}
        >
          {CODE}
        </div>

        <div
          style={{
            background: '#fee2e2',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '22px 30px',
          }}
        >
          <CardText size={36}>
            模型靠 <b style={{ color: INK_RED }}>description + 参数 schema</b> 决定该不该调、
            传什么参数。 description 写得越清楚 ， 调用越准。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
