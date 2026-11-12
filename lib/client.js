// 客户端插件（浏览器侧）：纸色暖调主题。
//
// 通过 rc.7+ 的 ThemeRuntime API（ctx.theme.overrideTokens）注册一个
// 别名 token 覆盖层：浅色模式用纸色暖调，暗色模式用「纸灯」暖黑（R9 起）。页面加载即自动生效，dsh 升级
// 不需要重新应用（旧版"补丁构建 CSS"的做法在 rc.7 已失效，弃用）。
//
// 另附启动自检（见 verifyTokens）：overrideTokens 只校验值的形状、
// 不校验 token 名，宿主改名时覆盖层会静默失效。自检把这种情况变成
// 控制台警告，升级后第一时间可见。

window.__ModuleLoader__.load({
	id: "dsh-paper-theme",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		// 需要 ctx.theme（dsh-client-ui-theme 提供的 ThemeRuntime）。
		const inject = ["theme"];

		// 44 项 token 覆盖：light = 纸色暖调；dark = 暗色「纸灯」暖黑（R9 起）。
		// 注意：overrideTokens 只校验值形状、不校验 token 名，所以将来某个 token
		// 改名或默认值漂移都不会报错，只会静默失效 —— dsh 升级后请拿这些名字
		// 回归一次。
		//
		// 校对基准版本（改动下表时请一并更新）：
		//   0.1.5-rc.1  首次校对（24 项 + 新增 --dsw-alias-link）：
		//               --dsw-alias-markdown-inline-code 的暗色默认由 bluish-850 改为
		//               neutral-800，下表已跟随；--dsw-alias-link 的浅色默认
		//               deepseek-500 是冷蓝，在纸色上对比度仅 3.90:1，故补暖色
		//               rgb(138, 96, 36)（纸上 5.12:1）。
		//   0.1.7-rc.1  26 项 token 名全部复核存在：design-platform.css 定义 178 个，
		//               其中包含全部 26 项；9 个暗色引用的静态 token 亦全部存在。
		//               遗留未复核项：各 token 的暗色**默认值**是否漂移。
		//   0.2.0-rc.1  39 项（新增 13 项，见下表「0.2.0-rc.1 新增」分组）。复核结论：
		//               · design-platform.css 现在定义 187 个（0.1.7-rc.1 为 178）；
		//               · 原 26 项 token 名全部仍在，浅色默认值与 0.1.5-rc.2 逐字相同；
		//               · 原 26 项的暗色默认值零漂移 —— 0.1.7 记录里唯一没复核的那项，
		//                 本次用作用域感知的提取脚本逐项比对通过；
		//               · 选项目径：扫全 asar 的 var(--dsw-*) 消费方，只覆盖「主界面
		//                 确有消费方 + 不透明底色」的 token，不做无消费方的空覆盖。
		//   0.2.0-rc.2  36 项（从 39 项减 3）。复核结论：
		//               · design-platform.css 现在定义 190 个（0.2.0-rc.1 为 187，
		//                 净增 3 个，未逐一指认 —— 要 diff 得有 rc.1 的 bundle）；
		//               · 下表原有 39 项 token 名全部仍在，暗色默认值零漂移，
		//                 14 个 var(--dsw-static-*) 引用全部存在；
		//               · 但其中 3 项在当前组合里已经没有 var() 消费方了（扫全 asar
		//                 的 1227 个客户端 bundle + 全 profile 插件，只剩本插件自己
		//                 引用它们）：markdown-code-segment-selected、
		//                 markdown-code-segment-unselected、specific-bubble-highlight。
		//                 按「不做无消费方的空覆盖」的既定口径移除，名单移入下面的
		//                 「刻意不覆盖」。
		//   R7（2026-10-14）37 项（+1）：新增 --dsw-alias-label-primary-bluish。复核：
		//               · 该 token 在 0.2.0-rc.2 的 design-platform.css 里有定义，浅色默认
		//                 var(--dsw-static-blue-900)（= #0e3074），暗色默认
		//                 var(--dsw-static-neutral-bluish-50)（已逐字抄进下表 dark）；
		//               · 它有 1 个真实消费方（dsh-client-ui-conversation），就是首屏那个
		//                 「预览版」徽标的文字，符合「不做无消费方的空覆盖」的口径。
		//   0.2.2-rc.1  36 项（删 1 项）。复核结论：
		//               · design-platform.css 现在定义 201 个（0.2.0-rc.2 为 190，净 +12/−1）；
		//               · 移除 --dsw-specific-sidebar-nav-item-hover：宿主已删定义、全 asar
		//                 2067 个客户端 bundle 无 var() 消费方 —— 侧栏悬停改走
		//                 --dsw-alias-interactive-bg-hover 的半透明 alpha（按既定口径不覆盖）；
		//               · --dsw-menu-surface-fill 的暗色默认 #43454a73 → #303136a3，下表已跟随；
		//                 浅色默认 #f8f9fa94 → #fcfdfeb3（本表是纸色 58% alpha，不跟随）；
		//               · 其余 35 项 token 名全部仍在、暗色默认值零漂移，15 个静态引用全在；
		//               · --dsw-alias-turn-trigger-bg 改为 var(--dsw-alias-markdown-code-block)，
		//                 自动随纸色 —— R7 记的「哪天补」到此结案；
		//               · 新增 12 项：illustration-* 6 项（Schedule 空状态插画）、
		//                 state-done-primary、4 个静态色。
		//   R8（2026-11-05）41 项（+5，真机评审 0.2.2-rc.1 新 UI）：新增
		//               Schedule 空状态插画 4 项（--dsw-alias-illustration-background /
		//               -backing / -detail / -surface；inset、shadow 引用 surface，
		//               自动跟随）与 --dsw-alias-button-ghost-active-border（日期/
		//               时间选择器选中格的 1px inset 描边）。这两处在 0.2.2-rc.1 的
		//               新界面里都是成片冷色：插画是蓝灰 #f5f7fa / #cad2db / #edf0f4，
		//               描边是冷灰 #979da6 套在暖色选中块上。取值沿用纸色梯度
		//               （插画 底 240,233,211 → 面 246,240,212 → 文档面 252,250,241
		//               → 细节 198,184,152；描边 rgb(150, 135, 105)）。暗色仍抄宿主默认。
		//   0.2.2-rc.2  41 项（不变）。跨 rc.1 → rc.2 复核结论（2026-11-12）：
		//               · design-platform.css 现在定义 237 个（rc.1 为 201，净 +36/−0）；
		//               · 0 项被删、0 项浅色默认值漂移、0 项暗色默认值漂移；
		//               · 新增 36 项按既定口径全部不覆盖：纯 alpha / color-mix
		//                 （sidebar-glass-*、sidebar-tint、sidebar-wash-*、
		//                 file-upload-track、card-tile-fill、json-tree-hover）、
		//                 中性色不冷（card-fill/-hover、guide-hero）、语义 / 图表 /
		//                 语法高亮（chart-*、trajectory-accent、right-flash、
		//                 json-tree-* 的 #1c00cf/#881391/#c41a16 等字面量）、
		//                 白字标签（label-on-color、tooltip-label、hovercard-label-*）、
		//                 恒深色浮层（hovercard-bg，与同样不覆盖的 tooltip-bg 同类）；
		//                 唯一边界项 --dsw-alias-border-selected 是冷色不透明描边，
		//                 但只被 dsh-client-ui-agent-preset 引用、不在主界面，仍不覆盖；
		//               · 三件套复核 41/41 名称存在、41/41 暗色零漂移、16/16 静态引用、
		//                 41/41 有 var() 消费方（无死覆盖）、client-smoke 0 告警；
		//                 真机 GUI body 上 41/41 computed 值命中本表 light 值。
		//
		//   R9（2026-11-12）44 项（+3）：暗色不再抄宿主默认，自成一色「纸灯」。
		//               动机：宿主暗色是冷蓝调，与浅色纸色的气质断裂；用户提出暗色也要纸色。
		//               做法：dark 列全部改成写死的暖黑字面量 —— 宿主没有暖色 static ramp 可引用，
		//               这是唯一可行路径（代价：宿主将来改暗色默认值，本表不会自动跟随）。
		//               另加三支文字色 label-primary / -secondary / -tertiary：只换底色不换文字，
		//               暖黑底上会浮一层冷白字，暗色纸色就不成立；light 列写回宿主默认引用，
		//               浅色模式外观零改动。
		//               取值：底 #1c1a16、侧栏 #211e19、面 #2f2a20、抬起面 #453d2f、
		//               文字 #ddd4bf / #b8ae9a / #afa492、链接 #c9a67b、强调 #d2a970。
		//               实测对比度：正文 11.78:1、次要 7.91:1、三级 7.07:1、链接 7.63:1 ——
		//               四支都过 WCAG AAA 的 7:1（三级文字从 6.91 提到 7.07 就是为了这条）。
		//               R9.1（同日，用户反馈「主文字有点亮」）：主文字从 #f6efdc（15.14:1）
		//               压到 #ddd4bf（11.78:1）。7:1 是下限不是目标 —— 15:1 在暖黑底上长时间
		//               读会发白、发刺；主流暗色主题的主文字多在 11–13:1，靠色温而不是靠亮度
		//               立纸感。同步把次文字 10.46 → 7.91、链接 9.86 → 7.63，保持层级落差。
		//               纯 alpha 浮层（sidebar-glass-*、border-l*、interactive-bg-*）仍不覆盖，
		//               它们叠在暖底上会自动变暖。
		//               体检口径随之改：check-paper-tokens 的「暗色零漂移」断言换成
		//               「暗色值必须是暖色（R ≥ B）+ 文字对比度达标 + 值在表内字面量」。
		//
		// 刻意不覆盖（0.2.0-rc.2 复核后仍然保留）：
		//   · 纯 alpha 叠加：interactive-bg-hover/active/hover-danger、bg-skeleton、
		//     bg-mask-1、border-l1..l4、button-tool-bar-*、file-diff/code-diff ——
		//     半透明者自动随底色；绿/红/琥珀是语义色（增/删/警告），压成暖色反而丢信息。
		//   · 深色浮层：toast-bg、tooltip-bg/key-bg、switch-thumb、toast-label ——
		//     深底白字在纸色上是有意的对比，不跟随底色。
		//   · 品牌与主按钮：brand-primary、button-primary-fill/hover、
		//     button-contrast-fill、onboarding-* —— 近黑主色与品牌标属宿主设计语言
		//     （同 --dsw-font-family-brand 的处理）。
		//     「品牌蓝保留」只说到这里：交互强调色（link、label-primary-bluish、
		//     button-info-*、state-business-primary、导航选中条）一律换成「墨」，
		//     见下表。R7 起口径统一写成一句：只留 logo 与徽标的品牌深色。
		//   · 中性文字与描边：label-*（正文与次要文字）、menu-icon、
		//     settings-card-stroke（= border-l4，半透明黑，纸色上自然）。
		//     例外是 label-primary-bluish —— 它不是正文色，而是与已变暖的
		//     徽标底配对的冷蓝，R7 起纳入覆盖；button-ghost-active-border 在
		//     0.2.2-rc.1 被选择器选中格引用，R8 起补暖纳入覆盖。
		//   · R7 体检出的三项不透明中性 token，0.2.2-rc.1 复核后各有变化
		//     （其中第三项 R8 已补暖，移到下表）：
		//     · menu-group-header-fill：alpha 由 58%（#f8f9fa94）提到 94%（#f8f9faf0），
		//       表头从「透出菜单面」变成近白实底，R7 测的「与菜单同温 R−B=+19」不再适用，
		//       待真机确认；要补按同明度换暖 rgba(252,250,241,0.94)；
		//     · turn-trigger-bg：改为 var(--dsw-alias-markdown-code-block)，自动随纸色，不必补；
		//     · button-ghost-active-border（#979da6）：0.2.2 的 Schedule 日期/时间选择器
		//       选中格以 1px inset 引用它，冷灰描边在纸色胶囊上肉眼可见 —— R8 补暖
		//       rgb(150, 135, 105)，见下表。
		//   · 当前组合里没有消费方的 token（只定义、无人 var() 引用）：bg-multi-select、
		//     specific-tip、specific-login-input、bg-document-selection、
		//     markdown-placeholder、ghost-active-hover ——
		//     覆盖它们没有视觉收益，等宿主接上消费方再补。
		//   · 0.2.2-rc.1 复核发现两项重新有了消费方，但都不在主界面，仍不覆盖：
		//     button-primary-dimmed（renderer/update-dialog.css，桌面更新弹窗）、
		//     specific-bubble-highlight（dsh-experimental-session-inspector 的对话揭幕层）。
		//   · 0.2.0-rc.2 复核后从下表移入的三项（rc.1 有消费方，rc.2 起没有了）：
		//     markdown-code-segment-selected、markdown-code-segment-unselected、
		//     specific-bubble-highlight —— 宿主重新接上消费方时再补回下表。
		//   · settings-card-fill 引用 bg-layer-2，已随 bg-layer-2 自动变暖。
		// 配色修订（2026-10）：下表当前 = R1 初版配色（就是最初那 36 个值，逐字还原）。
		// 其间试过 4 档（R2–R5），最后判定初版最好，R6 整体回到初版。
		// 记下两个旋钮，下次要再调不必从零试：
		//   · 黄味 = R − B 之差（中性色该差为 0）。主底锚点：初版 23（被嫌黄）→ R2 10（被嫌太白）
		//     → R4 16 → R5 20（= 初版 87%，仍嫌不够）→ R6 回到 23。这条轴全程只有 0–23，
		//     中间档 10 / 16 / 20 都没留住：纸的暖度是口味题，折中值不一定讨好；
		//   · 亮度 = sRGB 相对亮度。主底：初版 0.918 → R2 0.946（提亮后被嫌亮）→ R3–R5 锚在 0.912。
		//     底色一淡本身就显亮，所以亮度得单独锚，别跟着黄味一起动。
		//   · 强调色（暖棕 button-info-* / state-business-primary、链接 link、导航选中条 accent）
		//     是「墨」不是「纸」，历次修订都没碰过（本次还原也因此跳过了这 6 项不改）。
		// 手法备忘：更黄/更淡 = 整表同步改 R − B；更亮/更沉 = 整条 RGB 等比缩放（不碰 R − B）。
		// 两者都按数值解系数（沿轴向插值 / 解缩放比），比肉眼估稳 ——
		// 单独手改某一项容易把梯度顺序拧乱。
		//
		// R7（2026-10-14）= 补第三条轴：色度分层，并补到 37 项。起因是一次真机评审
		// （1440×900 逐屏与「运行时抹掉本表」的对照版比对），结论有两条落地：
		//   · 首屏「预览版」徽标的底已随 state-business-tertiary 变暖，文字仍是宿主冷蓝
		//     blue-900 —— 全浅色界面唯一成片的冷色，且落在品牌行。新增 label-primary-bluish
		//     覆盖（深墨 rgb(74,52,20)，同底 9.24:1 vs 宿主 9.78:1）；
		//   · 选中/悬停/浅槽/状态底四个语义原来全在 43–46° 色相、明度最大只差 17 级，
		//     悬停与选中的 RGB 差只有 (1,0,3) —— 等于没有区分信号（宿主靠「蓝调 vs 中性」
		//     区分，本表把色相统一后丢了这条轴）。R7 把「选中」提彩度、「悬停」降彩度：
		//       选中/幽灵 237,226,191 → 238,222,178（R−B 46 → 60）
		//       悬停实底   236,226,194 → 239,232,216（R−B 42 → 23）
		//       侧栏悬停   243,235,207 → 238,232,214（R−B 36 → 24；该 token 0.2.2 已被
		//                 宿主删除，覆盖随之下表移除，此行仅存档）
		//     效果：两者从「差 1 级 RGB」变成「色度差 37 级 + 压在侧栏底上亮度步进
		//     1.177 vs 1.074」。浅槽（行内码 240,231,208）刻意不动 —— 那是本表最有效的
		//     一处，正文里的代码芯片就是它的成绩。
		// 记下第三条旋钮：**色度 = R − B 之外还要看饱和度**。同一色相下，用彩度区分
		// 「选中/悬停」，比继续压明度稳；压明度会把四个语义挤成一锅粥。
		//
		// R8（2026-11-05）= 真机评审 0.2.2-rc.1 新增的两处冷色（Schedule 空状态插画、
		// 日期/时间选择器选中格的冷灰描边），补到 41 项（+5）。评审口径：新 UI 里
		// 「不透明 + 主界面可见」的冷色一律纳入覆盖；纯 alpha、语义色、品牌色不动。
		const PAPER_TOKENS = {
			"--dsw-alias-bg-base":                          { light: "rgb(250, 246, 227)", dark: "#1c1a16" },
			"--dsw-alias-bg-layer-1":                       { light: "rgb(250, 246, 227)", dark: "#272319" },
			"--dsw-alias-bg-layer-2":                       { light: "rgb(250, 246, 227)", dark: "#2f2a20" },
			"--dsw-alias-bg-layer-3":                       { light: "rgb(250, 246, 227)", dark: "#383227" },
			"--dsw-alias-bg-module-platform":               { light: "rgb(246, 240, 212)", dark: "#352f24" },
			"--dsw-specific-sidebar-fill":                  { light: "rgb(246, 240, 212)", dark: "#211e19" },
			"--dsw-specific-input-major":                   { light: "rgb(252, 250, 241)", dark: "#2f2a20" },
			"--dsw-alias-button-elevated-fill":             { light: "rgb(250, 245, 222)", dark: "#453d2f" },
			"--dsw-alias-button-floating-fill":             { light: "rgb(250, 245, 222)", dark: "#2f2a20" },
			"--dsw-alias-button-floating-hover":            { light: "rgb(246, 240, 212)", dark: "#383227" },
			"--dsw-alias-button-info-fill":                 { light: "rgb(168, 128, 62)", dark: "#d2a970" },
			"--dsw-alias-button-info-hover":                { light: "rgb(150, 108, 45)", dark: "#b8915b" },
			"--dsw-alias-markdown-inline-code":             { light: "rgb(240, 231, 208)", dark: "#352b20" },
			"--dsw-alias-markdown-code-block":              { light: "rgb(247, 242, 218)", dark: "#241d16" },
			"--dsw-alias-markdown-code-block-banner":       { light: "rgb(242, 235, 208)", dark: "#3a2f23" },
			"--dsw-specific-bubble":                        { light: "rgb(243, 234, 205)", dark: "#2f2a1f" },
			"--dsw-alias-state-business-primary":           { light: "rgb(168, 128, 62)", dark: "#d2a970" },
			"--dsw-alias-link":                             { light: "rgb(138, 96, 36)", dark: "#c9a67b" },
			// R7 新增：首屏「预览版」徽标的文字色。宿主浅色默认是冷蓝 blue-900（= #0e3074），
			// 而徽标底（state-business-tertiary）已随本表变暖，不换这行就是"沙底蓝字"。
			// 取值按"同底等对比"解：深墨 rgb(74,52,20) 在徽标底 rgb(238,228,200) 上 9.24:1，
			// 宿主原组合是 9.78:1 —— 变暖而可读性基本不降。注意别用链接那个墨 rgb(138,96,36)，
			// 它在这个底上只有 4.38:1。
			"--dsw-alias-label-primary-bluish":             { light: "rgb(74, 52, 20)", dark: "#f4edda" },
			// R9 新增 3 项：暗色主文字色。宿主暗色下这三支是冷白（#f9fafb / #cfd3d6 / #adb2b8），
			// 暖黑底上会浮一层冷光；只换底色不换文字，暗色纸色就不成立。light 列写回
			// 宿主浅色默认引用（外观零改动），dark 列换成纸灯的暖白三档。
			"--dsw-alias-label-primary":                    { light: "var(--dsw-static-neutral-bluish-1000)", dark: "#ddd4bf" },
			"--dsw-alias-label-secondary":                  { light: "var(--dsw-static-neutral-bluish-700)", dark: "#b8ae9a" },
			"--dsw-alias-label-tertiary":                   { light: "var(--dsw-static-neutral-bluish-600)", dark: "#afa492" },
			"--dsw-specific-selector":                      { light: "rgb(240, 231, 208)", dark: "#45392b" },
			"--dsw-specific-sidebar-nav-item-active-accent":{ light: "rgb(150, 108, 45)", dark: "#383227" },
			"--dsw-specific-sidebar-nav-item-active":       { light: "rgb(238, 222, 178)", dark: "#453d2f" },
			"--dsw-alias-interactive-bg-hover-solid":       { light: "rgb(239, 232, 216)", dark: "#45392b" },
			// —— 0.2.0-rc.1 新增 13 项：浮层 / 菜单 / 文档预览 / 引用与标签 / 滚动条 ——
			// 取值仍是同一套纸色梯度（= R1 初版）：抬起面 252,250,241 → 底 250,246,227 →
			// 代码块 247,242,218 → 模块面 246,240,212 → 浅槽 240,231,208 →
			// 选中 238,222,178（R7 起）→ 滚动条 228,219,193。
			"--dsw-alias-bg-overlay":                       { light: "rgb(252, 250, 241)", dark: "#80694f" },
			"--dsw-menu-surface-fill":                      { light: "rgba(252, 250, 241, 0.58)", dark: "#302a20a8" },
			// 宿主在非 darwin 上把 specific-menu 定义成 var(menu-surface-fill)（上面那行已覆盖），
			// 但 darwin 有平台专用规则 html[data-platform=darwin] body 把它设成不透明近白
			// #f8f9faf0 / #303136f0 —— 这行是 macOS 上纸色菜单的来源，故保留（Windows 上等价）。
			"--dsw-specific-menu":                          { light: "var(--dsw-menu-surface-fill)", dark: "var(--dsw-menu-surface-fill)" },
			"--dsw-alias-bg-mask-drop":                     { light: "rgba(252, 250, 241, 0.7)", dark: "#2a241cbf" },
			"--dsw-alias-bg-document-preview":              { light: "rgb(244, 238, 213)", dark: "#1d1812" },
			"--dsw-alias-markdown-citation":                { light: "rgb(240, 231, 208)", dark: "#45392b" },
			"--dsw-alias-markdown-tag":                     { light: "rgb(240, 231, 208)", dark: "#3a2f23" },
			"--dsw-alias-button-ghost-active-fill":         { light: "rgb(238, 222, 178)", dark: "#453d2f" },
			"--dsw-alias-state-business-tertiary":          { light: "rgb(238, 228, 200)", dark: "#3b3124" },
			"--dsw-alias-scrollbar-bg-l1":                  { light: "rgb(228, 219, 193)", dark: "#4d3f2f" },
			"--dsw-alias-scrollbar-bg-l2":                  { light: "rgb(228, 219, 193)", dark: "#6c5842" },
			"--dsw-alias-scrollbar-hover-l1":               { light: "rgb(212, 201, 170)", dark: "#6c5842" },
			"--dsw-alias-scrollbar-hover-l2":               { light: "rgb(212, 201, 170)", dark: "#836b50" },
			// —— R8（2026-11-05）新增 5 项：Schedule 空状态插画 + 选择器选中格描边 ——
			// 插画：底/背板/文档面/细节。inset、shadow 在宿主里引用 surface，自动跟随；
			// 只覆盖 4 个实际画色。取值 = 纸色梯度（240,233,211 → 246,240,212 →
			// 252,250,241 → 细节 198,184,152），与空状态所在的页面底同温。
			"--dsw-alias-illustration-background":          { light: "rgb(240, 233, 211)", dark: "#3a2f23" },
			"--dsw-alias-illustration-backing":             { light: "rgb(246, 240, 212)", dark: "#594937" },
			"--dsw-alias-illustration-detail":              { light: "rgb(198, 184, 152)", dark: "#a58a6b" },
			"--dsw-alias-illustration-surface":             { light: "rgb(252, 250, 241)", dark: "#80694f" },
			// 选择器选中格由 box-shadow inset 0 0 0 1px 引用；同明度换暖，保证
			// 「暖底 + 暖描边」仍能一眼看出选中（原始冷灰 #979da6 的明度不变）。
			"--dsw-alias-button-ghost-active-border":       { light: "rgb(150, 135, 105)", dark: "#a58a6b" }
		};

		/**
		 * 从页面已挂载的样式表里收集所有 --dsw-* token 名。
		 *
		 * 判据为什么不能是 ctx.theme.exportInspectTokens()：那个方法返回的是
		 * **主题系统运行时注册**的 token，种子只有 BUILTIN_INSPECT_TOKENS 的 14 项
		 * （0.1.7-rc.1 实测）。而纸色用到的 token 绝大多数只定义在 ui-theme 的
		 * design-platform.css 里（0.2.2-rc.2 实测定义 237 个），根本不在那个注册表里 ——
		 * 用它当判据会把 44 项里的绝大多数误报为失效（0.1.7-rc.1 上实际发生过）。
		 *
		 * 这里改为直接读样式表：ui-theme 把它的 8 张表以 <style data-plugin-css=
		 * "@deepseek-ai/dsh-client-ui-theme/..."> 注入 document.head，覆盖层则由
		 * presenter 写成 CSS 变量。两者都在 styleSheets 里，因此本集合同时包含
		 * 「宿主定义」与「宿主使用」，比注册表完整得多。
		 *
		 * @returns {Set<string>} 收集到的 token 名（含 "--" 前缀）
		 */
		function collectStylesheetTokens() {
			const found = new Set();
			const scan = (text) => {
				if (!text) return;
				const matches = text.match(/--dsw-[a-z0-9-]+/g);
				if (matches) for (const name of matches) found.add(name);
			};
			for (const sheet of Array.from(document.styleSheets)) {
				let rules;
				try {
					rules = sheet.cssRules;
				} catch (error) {
					continue; // 跨源样式表读不到规则，跳过
				}
				if (!rules) continue;
				for (const rule of Array.from(rules)) {
					if (typeof rule.cssText === "string") scan(rule.cssText);
				}
			}
			// <style> 元素的内容文本（样式表被禁用时 cssRules 可能为空）
			for (const tag of Array.from(document.querySelectorAll("style"))) scan(tag.textContent);
			return found;
		}

		/**
		 * 自检：核对每个纸色 token 名在宿主样式表里仍然存在。
		 *
		 * 为什么需要：overrideTokens 的 validateOverrides 只检查值是不是
		 * { light, dark } 字符串对，**不检查 token 名**；而组件 CSS 只读它自己
		 * 知道的名字。所以宿主改名后，覆盖层既不报错也不生效 —— 静默失效。
		 * 这里在启动时点出具体是哪些名字没了，省去人肉比对 44 个变量。
		 *
		 * 只报告、不阻断：主题照常注册，缺的那几项只是回落宿主默认值。
		 * 判据不可用时（样式表尚未挂载、或读取全失败）**跳过检查**，绝不误报。
		 *
		 * @param {object} theme - ctx.theme（ThemeRuntime）
		 */
		function verifyTokens(theme) {
			let known;
			try {
				known = collectStylesheetTokens();
			} catch (error) {
				console.warn("[dsh-paper-theme] token 自检未能读取样式表（不影响主题生效）:", error);
				return;
			}
			if (known.size === 0) {
				// ui-theme 的样式表由 ctx.effect 注入，可能比本插件晚一步。
				// 此时判据为空 —— 宁可漏报也不能把 44 项全误报成失效。
				console.warn("[dsh-paper-theme] token 自检已跳过：当前读不到任何 --dsw-* token（宿主样式表可能尚未挂载）");
				return;
			}
			const names = Object.keys(PAPER_TOKENS);
			const stale = names.filter((name) => !known.has(name));
			if (stale.length > 0) {
				console.warn(
					`[dsh-paper-theme] ${stale.length}/${names.length} 个 token 在当前宿主样式表里不存在，` +
					`这些覆盖已静默失效（外观回落宿主默认值）。若刚升级过 dsh，说明 token 被改名或删除，` +
					`请对照新版 ui-theme 的 design-platform.css 更新 PAPER_TOKENS：`,
					stale
				);
			}
		}

		/**
		 * 客户端插件主体：注册纸色覆盖层，卸载时自动移除。
		 * @param {import('@deepseek-ai/cordis').Context} ctx
		 */
		function apply(ctx) {
			try {
				verifyTokens(ctx.theme);
			} catch (error) {
				// 自检本身绝不能影响主题注册。
				console.warn("[dsh-paper-theme] token 自检异常（不影响主题生效）:", error);
			}
			ctx.effect(() => ctx.theme.overrideTokens("dsh-paper-theme", PAPER_TOKENS));
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
