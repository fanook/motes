import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import rough from 'roughjs';
import { HAND, INK, INK_SEPIA, PEN } from './handwriting';

/* ─────────────────────────────────────────────
   RedbookCard —— 小红书卡片容器
   - 固定 1080×1440 (3:4) ， 截图 2x 出 2160×2880 PNG
   - 奶油纸底 + 横线纸纹 ， 跟 motes 网站统一视觉语系但是更大胆
   - 字号 / 间距按 1080 宽度排版 ， 在 mobile feed 上 1:1 显示
   ───────────────────────────────────────────── */

export const CARD_W = 1080;
export const CARD_H = 1440;

export function RedbookCard({
  children,
  style,
  noLines = false,
}: {
  children: ReactNode;
  style?: CSSProperties;
  /** 关掉横线纸纹（封面卡可能不要） */
  noLines?: boolean;
}) {
  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        background: '#fdfaf0',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        fontFamily: PEN,
        color: INK,
        backgroundImage: noLines
          ? undefined
          : 'repeating-linear-gradient(transparent 0 95px, rgba(31, 41, 55, 0.08) 95px 96px)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** 卡片大标题：在卡片底部居中显示 */
export function CardTitle({
  children,
  subtitle,
  align = 'center',
  color = INK_SEPIA,
}: {
  children: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  color?: string;
}) {
  return (
    <div
      style={{
        fontFamily: HAND,
        color,
        fontSize: 96,
        lineHeight: 1.15,
        textAlign: align,
        fontWeight: 700,
      }}
    >
      {children}
      {subtitle && (
        <div
          style={{
            fontFamily: PEN,
            color: INK,
            fontSize: 40,
            marginTop: 24,
            opacity: 0.7,
            fontWeight: 400,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}

/** 章节下方手绘粗下划线 (跟网站 RoughUnderline 同款 ， 适配卡片尺寸) */
function CardUnderline({ width = 720, color = INK_SEPIA }: { width?: number; color?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    // 画两条线叠加 ， 模拟手绘"复笔"的颤动 ， 跟网站 RoughUnderline 同感觉但适配卡片大字号
    svg.appendChild(
      rc.line(6, 12, width - 8, 14, {
        stroke: color,
        strokeWidth: 3,
        roughness: 2.5,
        seed: 7,
      })
    );
    svg.appendChild(
      rc.line(10, 18, width - 12, 20, {
        stroke: color,
        strokeWidth: 2,
        roughness: 2.8,
        seed: 13,
      })
    );
  }, [width, color]);
  return <svg ref={ref} width={width} height={28} style={{ display: 'block' }} />;
}

/** 卡片中部章节标题（含下划线） */
export function CardSectionHeading({
  children,
  color = INK_SEPIA,
  underlineWidth,
}: {
  children: ReactNode;
  color?: string;
  /** 下划线宽度 ， 默认按字符数估算 */
  underlineWidth?: number;
}) {
  // 估算下划线宽度：按 children 文本长度 × 字号一半 + 边距
  const text = typeof children === 'string' ? children : '';
  const uw = underlineWidth ?? Math.min(820, Math.max(280, text.length * 60 + 80));
  return (
    <div>
      <h2
        style={{
          fontFamily: HAND,
          color,
          fontSize: 72,
          lineHeight: 1.2,
          margin: 0,
          marginBottom: 12,
          fontWeight: 700,
        }}
      >
        {children}
      </h2>
      <CardUnderline width={uw} color={color} />
    </div>
  );
}

/** 卡片正文 */
export function CardText({ children, size = 44 }: { children: ReactNode; size?: number }) {
  return (
    <p
      style={{
        fontFamily: PEN,
        color: INK,
        fontSize: size,
        lineHeight: 1.65,
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

/** 页码 / 角标（左下） */
export function CardPager({ index, total }: { index: number; total: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        bottom: 48,
        fontFamily: PEN,
        color: INK,
        opacity: 0.55,
        fontSize: 32,
        letterSpacing: 2,
      }}
    >
      {index} / {total}
    </div>
  );
}

/** 站名签名（右下） */
export function CardSignature({ children = 'motes · 每天一点 AI 知识碎片' }: { children?: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        right: 64,
        bottom: 48,
        fontFamily: HAND,
        color: INK_SEPIA,
        opacity: 0.75,
        fontSize: 30,
      }}
    >
      {children}
    </div>
  );
}
