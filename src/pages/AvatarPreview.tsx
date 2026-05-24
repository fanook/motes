import { AVATAR_SPECS, AvatarArt } from '../components/avatar-art';
import { Paper, HAND, PEN, INK_SEPIA, INK } from '../components/handwriting';

const DISPLAY_SIZES = [128, 80, 48];

export default function AvatarPreview() {
  return (
    <div className="min-h-screen bg-[#f4ecd8] py-6 sm:py-10 px-3 sm:px-6">
      <Paper>
        <header className="mb-6 sm:mb-10">
          <h1
            className="text-3xl sm:text-5xl"
            style={{ fontFamily: HAND, color: INK_SEPIA }}
          >
            小程序头像候选
          </h1>
          <p
            className="mt-2 text-sm sm:text-base"
            style={{ fontFamily: PEN, color: INK }}
          >
            手绘 rough 风， 跟封面图同一调色板。 每个头像下方分别展示原图 / 圆形裁切 /
            缩到 80px 和 48px 的小尺寸效果 —— 模拟微信里实际展示的样子。
          </p>
        </header>

        <div className="space-y-10 sm:space-y-14">
          {AVATAR_SPECS.map((spec) => (
            <section key={spec.id}>
              <h2
                className="mb-3 text-xl sm:text-3xl"
                style={{ fontFamily: HAND, color: INK_SEPIA }}
              >
                {spec.label}
                <span
                  className="ml-3 text-sm sm:text-base"
                  style={{ fontFamily: PEN, color: '#888' }}
                >
                  {spec.id}
                </span>
              </h2>

              <div className="flex flex-wrap items-end gap-5 sm:gap-7">
                {/* 原始方图（大） */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="rounded shadow-sm overflow-hidden"
                    style={{ width: 200, height: 200 }}
                  >
                    <AvatarArt spec={spec} size={200} />
                  </div>
                  <span
                    className="text-xs"
                    style={{ fontFamily: PEN, color: '#888' }}
                  >
                    方图 200
                  </span>
                </div>

                {/* 圆形裁切大尺寸 */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="rounded-full shadow-sm overflow-hidden"
                    style={{ width: 200, height: 200 }}
                  >
                    <AvatarArt spec={spec} size={200} />
                  </div>
                  <span
                    className="text-xs"
                    style={{ fontFamily: PEN, color: '#888' }}
                  >
                    圆形 200
                  </span>
                </div>

                {/* 多个小尺寸圆形， 模拟微信列表 */}
                {DISPLAY_SIZES.map((sz) => (
                  <div key={sz} className="flex flex-col items-center gap-2">
                    <div
                      className="rounded-full shadow-sm overflow-hidden"
                      style={{ width: sz, height: sz }}
                    >
                      <AvatarArt spec={spec} size={sz} />
                    </div>
                    <span
                      className="text-xs"
                      style={{ fontFamily: PEN, color: '#888' }}
                    >
                      {sz}px
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-12 text-right text-sm" style={{ fontFamily: PEN, color: '#888' }}>
          — 选定后可单独导出 SVG / 用 Playwright 截图为 PNG —
        </footer>
      </Paper>
    </div>
  );
}
