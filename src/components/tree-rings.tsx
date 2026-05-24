import { useEffect, useRef } from 'react';
import rough from 'roughjs';

/* ─────────────────────────────────────────────
   TreeRings —— 年轮共享组件
   ShuffleIcon、 favicon、 头像等所有"年轮"出现的地方
   都用这一个组件 ， 保证视觉完全一致 ， 不重复画。
   - viewBox 固定 100×100， 通过 size prop 缩放
   - 透明背景（svg 本身不画 rect）， 调用方负责加底色 (若需要)
   ───────────────────────────────────────────── */

export function TreeRings({
  size = 100,
  color = '#1f2937',
  ringCount = 3,
  strokeWidth,
  withCrack = true,
  className,
}: {
  size?: number;
  color?: string;
  /** 圈数（不含中心点）。 默认 3 */
  ringCount?: number;
  /** 线条粗细 (按 100×100 viewBox 算)。 默认按 ringCount 自适应 */
  strokeWidth?: number;
  /** 是否画顶部径向裂缝。 默认 true */
  withCrack?: boolean;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);

    const cx = 50;
    const cy = 50;
    const maxR = 44;
    const sw = strokeWidth ?? Math.max(2, 5 - ringCount * 0.4); // 圈越少线越粗
    // 等距分圈 (外、 中、 内...)
    const step = maxR / ringCount;
    for (let i = 0; i < ringCount; i++) {
      const r = maxR - i * step;
      svg.appendChild(
        rc.circle(cx, cy, r * 2, {
          stroke: color,
          strokeWidth: sw,
          roughness: 0.9,
          seed: 91 + i,
        })
      );
    }
    // 中心实心点
    svg.appendChild(
      rc.circle(cx, cy, sw * 1.4, {
        stroke: color,
        strokeWidth: sw * 0.5,
        roughness: 0.9,
        fill: color,
        fillStyle: 'solid',
        seed: 300,
      })
    );
    // 顶部裂缝 (从最外圈附近到中心圈附近)
    if (withCrack) {
      svg.appendChild(
        rc.line(cx, cy - maxR - 2, cx, cy - step * 0.6, {
          stroke: color,
          strokeWidth: sw,
          roughness: 1.3,
          seed: 200,
        })
      );
    }
  }, [color, ringCount, strokeWidth, withCrack]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={{ display: 'block' }}
    />
  );
}
