# dsh-paper-theme

把 DSH Web 界面换成**暖纸色主题**的客户端插件。只改浅色模式；暗色模式与不装插件时完全一致。

当前版本 **0.2.2**（41 项 token 覆盖，配色修订 **R7 = 色度分层 + 补徽标文字色**、**R8 = 补齐 0.2.2 新 UI 的两处冷色**；2026-11 按 **dsh 0.2.2-rc.1** 复核，删 1 项失效 token、同步 1 个暗色默认值、R8 补 5 项），校对基准 **dsh 0.2.2-rc.1**。

## 它做什么

通过 `ctx.theme.overrideTokens()` 注册一层 41 项 token 覆盖：

- `light` = 纸色暖调；
- `dark` = 宿主当前版本的默认引用（`var(--dsw-static-*)` 或原字面量），所以切到暗色时外观不变。

| 分组 | 项数 | 覆盖的 token |
|---|---|---|
| 底 / 层 | 5 | `bg-base`、`bg-layer-1/2/3`、`bg-module-platform` |
| 侧栏与导航 | 3 | `specific-sidebar-fill`、`specific-sidebar-nav-item-active`、`-active-accent` |
| 输入与按钮 | 7 | `specific-input-major`、`button-elevated-fill`、`button-floating-fill`、`-hover`、`button-info-fill`、`-hover`、`button-ghost-active-fill` |
| Markdown / 代码 | 5 | `markdown-inline-code`、`markdown-code-block`、`-banner`、`markdown-citation`、`markdown-tag` |
| 浮层与菜单 | 4 | `bg-overlay`、`menu-surface-fill`、`specific-menu`、`bg-mask-drop` |
| 气泡 / 选择 / 状态 / 文档 | 5 | `specific-bubble`、`specific-selector`、`state-business-primary`、`-tertiary`、`bg-document-preview` |
| 滚动条 | 4 | `scrollbar-bg-l1`、`-l2`、`scrollbar-hover-l1`、`-l2` |
| 交互与链接 | 3 | `alias-link`、`alias-label-primary-bluish`、`interactive-bg-hover-solid` |
| Schedule 插画（R8） | 4 | `illustration-background`、`-backing`、`-detail`、`-surface` |
| 选择器描边（R8） | 1 | `button-ghost-active-border` |

（表内省略公共前缀 `--dsw-alias-` / `--dsw-specific-`。）

纸色梯度（配色修订 R7）：抬起面 `rgb(252,250,241)` → 底 `rgb(250,246,227)` →
代码块 `rgb(247,242,218)` → 模块面 `rgb(246,240,212)` → 浅槽 `rgb(240,231,208)` →
选中 `rgb(238,222,178)` → 滚动条 `rgb(228,219,193)`；
悬停是**低彩度**的一档：实底 `rgb(239,232,216)`（侧栏悬停自 0.2.2 起由宿主的半透明 alpha token 承担，按口径不覆盖、不再单列）。
强调色是暖棕 `rgb(168,128,62)`，链接 `rgb(138,96,36)`（纸上对比度 5.12:1），
徽标文字 `rgb(74,52,20)`（在徽标底 `rgb(238,228,200)` 上 9.24:1，宿主原组合 9.78:1）。
R8 补的两处也落在这条梯度上：Schedule 空状态插画 底 `rgb(240,233,211)` → 背板 `rgb(246,240,212)` →
文档面 `rgb(252,250,241)`、细节 `rgb(198,184,152)`；选择器选中格 1px 描边 `rgb(150,135,105)`。

### 配色修订

一轮口味试错的完整台账。黄味与亮度是两个**独立旋钮**：

| 修订 | 旋钮 | 主底取值 | 动机 / 结果 |
|---|---|---|---|
| **R1（初版 = 当前）** | — | R−B = 23，亮度 0.918 | 暖纸色 |
| R2 | 黄味↓ + 亮度↑ | R−B = 10，亮度 0.946 | 「还是有点太黄了，整体再淡一些」→ 被嫌亮 |
| R3 | 只收亮度 | R−B = 10，亮度 0.912 | 「感觉亮了点」→ 被嫌白 |
| R4 | 只加黄味 | R−B = 16（初版 70%），亮度 0.911 | 「还是白了些，稍微黄一点点，但没原版那么黄」→ 仍嫌不够 |
| R5 | 只加黄味 | R−B = 20（初版 87%），亮度 0.911 | 「再黄一些吧」→ 还是回到初版 |
| **R6** | 全部回到 R1 | R−B = 23，亮度 0.918 | 「恢复原版吧」 |
| **R7** | 色度分层 + 补 1 项 | 主底不变；选中/悬停改彩度 | 真机评审后：① 首屏「预览版」徽标底已随 `state-business-tertiary` 变暖、文字仍是宿主冷蓝，是浅色界面唯一成片冷色 → 新增 `label-primary-bluish` 覆盖；② 选中/悬停/浅槽/状态底四个语义原来全在 43–46° 色相、明度最大差 17 级，悬停与选中的 RGB 差只有 (1,0,3) → 选中提彩度（R−B 46 → 60）、悬停降彩度（42 → 23），浅槽不动 |
| **R8（当前）** | 新 UI 冷色补齐 +5 项 | 主底不变 | dsh 0.2.2-rc.1 真机评审：新 UI 出现两处「不透明 + 主界面可见」的冷色 —— ① 自动化任务空状态插画（`illustration-*`，宿主蓝灰 `#f5f7fa`/`#cad2db`/`#edf0f4`）在纸色页面上成片发冷；② 日期/时间选择器选中格的 1px inset 描边用冷灰 `#979da6`，套在暖色选中块上违和 → 插画 4 个画色换纸色梯度、描边换同明度暖棕 `rgb(150,135,105)`，其余（inset/shadow、语义色、纯 alpha、品牌色）不动 |

- **黄味** = `R − B` 之差（中性色该差为 0）。这条轴全程只有 `0`（纯灰白）–`23`（初版）这么宽，
  中间档 10 / 16 / 20 都试过、都没留住 —— 纸的暖度是口味题，折中值不一定讨好。
- **亮度** = sRGB 相对亮度。底色一淡本身就显亮，所以亮度得单独锚，别跟着黄味一起动。
  要更亮/更沉就整条 RGB 等比缩放（不碰 `R − B`）。
- 想复原某个中间档的配方：R4 = 沿 R3→R1 插值 0.45、亮度锚 0.912；R5 = 再插值 0.57、亮度锚 0.911；
  R2 = 黄味 ×0.43 且亮度 ×1.03；R3 = R2 等比缩放到亮度 0.912。
- 强调色（`button-info-*`、`state-business-primary`、`link`、导航选中条 accent）是「墨」不是「纸」，
  历次修订都没动过（R6 还原也因此跳过了这 6 项）。
- **色度**（R7 新增的第三条旋钮）：同一色相下，「选中 / 悬停」这类状态靠**彩度**分开，不要继续压明度。
  压明度会把浅槽 / 状态底 / 选中 / 悬停四个语义挤成一锅粥 —— R6 时它们最大只差 17 级明度，
  悬停与选中的 RGB 差只有 `(1,0,3)`，等于没有区分信号。R7 的做法：选中提彩度（`R − B` 46 → 60），
  悬停降彩度（42 → 23），两者的彩度差 37 级、明度各差一档，并排一眼可分。

**参照系**（宿主 0.2.2-rc.1，未装主题插件时的浅色默认；与 0.2.0-rc.2 相同）：主底是**纯白 `#ffffff`**（相对亮度 1.000，
R−B = 0），侧栏 `#f9fafb`（0.955）、模块面 `#f5f6f7`（0.920）、浮层 `#e9ecf2`（0.837）。
纸色（R6 = 初版）主底 `#faf6e3` = **0.918**，比宿主白底低 0.082（约 8%），正好落在宿主自己的
模块灰 `#f5f6f7`（0.920）那一档 —— 所以「纸」是同样明度、换成暖色的一张底，不是白皙底。
纯黑文字对比度：白底 21.0:1 → 纸底 19.4:1（远高于 AAA 的 7:1）。

## 为什么覆盖层能生效

ui-layout 的 presenter 每次 apply 时：

1. `body.style.setProperty("--dsh-content-font-size", ...)`
2. `for (const [name, value] of Object.entries(snapshot.active.tokens)) body.style.setProperty(name, value)`

而 ThemeRuntime 的 `composeActive()` 会按注册顺序把覆盖层折进 `active.tokens`（后注册的层按 token 覆盖先注册的）。
同一个属性后写覆盖先写，所以纸色值最终落在 `body` 的行内样式上，盖过 `:root` / `body` 里宿主 CSS 的默认值。

碰不到的情况只有一种：在 `:root` 上声明、且 `var()` 在 `:root` 就完成替换的 token
（例如 `--dsw-font-family-brand`），`body` 层的覆盖到不了它。

## 刻意不覆盖

这些**不是遗漏**，是复核后有意留白（改动前请先看这里的理由）：

- **纯 alpha 叠加**：`interactive-bg-hover/active/hover-danger`、`bg-skeleton`、`bg-mask-1`、
  `border-l1..l4`、`button-tool-bar-*` —— 半透明，自动随底色走。
- **语义色**：`file-diff-*`、`code-diff-*`、`state-success-*`、`state-warn-*`、`state-error-*` ——
  绿=增 / 红=删 / 琥珀=警告，压成暖色会丢信息。
- **深色浮层**：`toast-bg`、`toast-label`、`tooltip-bg`、`tooltip-key-bg`、`switch-thumb` ——
  深底白字在纸色上是有意的对比。
- **品牌与主按钮**：`brand-primary`、`button-primary-fill/hover`、`button-contrast-fill`、
  `onboarding-*` —— 近黑主色与品牌标属宿主设计语言。注意「品牌蓝保留」的口径只到这里：
  交互强调色（`link`、`label-primary-bluish`、`button-info-*`、`state-business-primary`、导航选中条）
  一律换成「墨」，见上表 —— 一句话版本是「只留 logo 与徽标的品牌深色」。
- **中性文字与描边**：`label-*`（正文与次要文字）、`menu-icon`、`settings-card-stroke`。
  例外是 `label-primary-bluish`：它不是正文色，而是与已变暖的徽标底
  （`state-business-tertiary`）配对的冷蓝，R7 起纳入覆盖 —— 底部变暖、文字不变就是「沙底蓝字」；
  `button-ghost-active-border` 在 0.2.2 被选择器选中格引用，R8 起补暖纳入覆盖。
- **R7 体检出的三项不透明中性 token，0.2.2-rc.1 复核后各有变化**：`menu-group-header-fill` 的
  alpha 从 58%（`#f8f9fa94`）提到 94%（`#f8f9faf0`），表头从「透出菜单面」变成近白实底，R7 测的
  「与菜单同温 `R − B` = +19」不再适用 —— 待真机确认是否补暖 `rgba(252,250,241,0.94)`；
  `turn-trigger-bg` 改为 `var(--dsw-alias-markdown-code-block)`，自动随纸色，不必补；
  `button-ghost-active-border`（`#979da6`）被 0.2.2 的 Schedule 日期/时间选择器选中格以 1px inset
  引用 —— R8 真机评审后已补暖 `rgb(150,135,105)`，移入上表。
- **`illustration-*` 只覆盖 4 个画色**（R8）：`inset`、`shadow` 在宿主里引用 `surface`/`backing`，
  自动跟随，不单独覆盖。
- **近白卡片族**（0.2.2 新 UI 的 schedule / plan / deliverables / forge 卡片）：卡片底直接用
  `--dsw-static-neutral-50`（`#fafafa`）/ `-100`（`#f5f5f5`），与纸色抬起面 `rgb(252,250,241)`
  只差 `(+2, 0, −9)`，是轻微色温而非成片冷色；覆盖静态 token 会扩大影响面（且暗色需写死字面量），
  维持不覆盖、只在此记录。
- **当前组合里没有消费方的 token**（只定义、全 asar 无人 `var()` 引用）：`bg-multi-select`、
  `specific-tip`、`specific-login-input`、`bg-document-selection`、`markdown-placeholder`、
  `ghost-active-hover` —— 覆盖没有视觉收益，等宿主接上消费方再补。0.2.2 起 `button-primary-dimmed`
  （桌面更新弹窗）与 `specific-bubble-highlight`（实验性 session-inspector）重新有了消费方，但都
  不在主界面，仍不覆盖。
- **0.2.0-rc.2 复核后从下表移入的三项**（rc.1 有消费方，rc.2 起没有了）：
  `markdown-code-segment-selected`、`markdown-code-segment-unselected`、
  `specific-bubble-highlight` —— 宿主重新接上消费方时再补回下表。
- `settings-card-fill` 引用 `bg-layer-2`，已随该 token 自动变暖。

## 安装 / 卸载

本目录：`E:\dsh\dsh-paper-theme`（2026-09-28 从 `E:\123\dsh-paper-theme` 迁入，工作区内便于改）。

```
# web profile
dsh plugin --profile web add E:\dsh\dsh-paper-theme

# 桌面版 profile 由 Electron 应用独占管理，用侧栏「插件」页安装同一个路径
```

两个 profile 现在都是 `link:` 依赖，`node_modules` 里是 junction 指向本目录，
所以改 `lib/client.js` 后由 HMR 自动重载，不用重装。卸载：从 `dsh.profile.bundles`
移除 `dsh-paper-theme` 并删掉依赖即可。

## 升级 dsh 之后的回归

```powershell
# 从已安装的 app.asar 自动读宿主 ui-theme（也可加第二个参数指定解包后的 client.js）
node E:\dsh\dsh-asar-tools\check-paper-tokens.mjs E:\dsh\dsh-paper-theme\lib\client.js
```

脚本查四项，退出码 0/1，可直接串进脚本：

1. 覆盖表里的 token 名在宿主里是否还存在（不存在 = 覆盖静默失效）；
2. 每项的 `dark` 值是否仍等于宿主**暗色作用域**的默认值（值漂移检测）；
3. `dark` 里 `var(--dsw-static-*)` 引用的静态 token 是否还存在；
4. 插件里以字符串字面量出现、但宿主完全没提过的 token 名。

另外两个配套脚本（同在 `E:\dsh\dsh-asar-tools`）：

```powershell
# 真机烟测：把插件的 factory/apply 放进模拟浏览器环境跑一遍，样式表用宿主真实 CSS 填充，
# 顺带核对 overrideTokens 载荷形状、token 名、静态引用，并捕获插件自检的告警
node E:\dsh\dsh-asar-tools\client-smoke.mjs "<app.asar>" E:\dsh\dsh-paper-theme\lib\client.js E:\dsh\dsh-harmony-font\lib\client.js

# 覆盖率体检：宿主定义了哪些 alias/specific token、哪些有真实 var() 消费方、
# 哪些是「只定义无人引用」、哪些覆盖已成空覆盖
node E:\dsh\dsh-asar-tools\paper-coverage.mjs "<app.asar>" E:\dsh\dsh-paper-theme\lib\client.js
```

再打开页面看 DevTools console 有没有 `[dsh-paper-theme]` 警告（那是插件自己的启动自检），
最后肉眼确认升级后新出现的面板（设置卡片、文档预览、菜单、diff、滚动条）没有露出冷色。

## 校对基准

| 基准版本 | 结论 |
|---|---|
| 0.1.5-rc.1 | 首次校对 24 项 + 新增 `--dsw-alias-link`；`markdown-inline-code` 的暗色默认由 bluish-850 改为 neutral-800 |
| 0.1.7-rc.1 | 26 项 token 名全部复核存在（design-platform.css 定义 178 项，含全部 26 项）；9 个暗色引用的静态 token 存在；**暗色默认值漂移未复核** |
| 0.2.0-rc.1 | 39 项（新增 13 项）。design-platform.css 现在定义 **187** 项；原 26 项名全部仍在、浅色默认值与 0.1.5-rc.2 逐字相同；**暗色默认值零漂移**（补上了 0.1.7 的遗留项）。选项目径：扫全 asar 的 `var(--dsw-*)` 消费方，只覆盖「主界面确有消费方 + 不透明底色」的 token |
| **0.2.0-rc.2** | 36 项（从 39 项减 3）。design-platform.css 现在定义 **190** 项（净增 3 个，未逐一指认 —— 要 diff 得有 rc.1 的 bundle）；原 39 项名全部仍在、**暗色默认值零漂移**、14 个静态引用全在；但其中 `markdown-code-segment-selected` / `-unselected`、`specific-bubble-highlight` 三项在当前组合里已无 `var()` 消费方（全 asar 1227 个客户端 bundle + 全 profile 插件只剩本插件自己引用），按既定口径移入「刻意不覆盖」 |
| 0.2.0-rc.2（R7 增补） | **37 项**（+1）。新增 `--dsw-alias-label-primary-bluish`：浅色默认 `var(--dsw-static-blue-900)`（`#0e3074`）、暗色默认 `var(--dsw-static-neutral-bluish-50)`（已逐字抄进 dark）、1 个真实消费方（`dsh-client-ui-conversation`，即首屏「预览版」徽标文字）。`check-paper-tokens.mjs` 复核：37/37 名称存在、37/37 暗色零漂移、15/15 静态引用存在 |
| **0.2.2-rc.1** | **36 项**（删 1 项）。design-platform.css 现在定义 **201** 项（rc.2 为 190，净 +12/−1）：新增 `--dsw-alias-illustration-*` 6 项（Schedule 空状态插画）、`state-done-primary` 与 4 个静态色；删除 `--dsw-specific-sidebar-nav-item-hover`（全 asar 无 `var()` 消费方，侧栏悬停改走半透明 `interactive-bg-hover`）。`--dsw-menu-surface-fill` 暗色默认 `#43454a73` → `#303136a3`（下表已跟随；浅色默认由 `#f8f9fa94` 变 `#fcfdfeb3`，本表用纸色 58% alpha 不跟随）。`check-paper-tokens.mjs` 复核：36/36 名称存在、36/36 暗色零漂移、15/15 静态引用存在；`client-smoke.mjs` 0 告警 |
| 0.2.2-rc.1（R8 增补） | **41 项**（+5）。新增 Schedule 空状态插画 4 个画色（`inset`/`shadow` 引用 `surface`/`backing`，自动跟随）与选择器选中格的 `--dsw-alias-button-ghost-active-border`；取值均为纸色梯度（插画 `240,233,211` / `246,240,212` / `252,250,241`、细节 `198,184,152`；描边 `rgb(150,135,105)`）。`check-paper-tokens.mjs` 复核：41/41 名称存在、41/41 暗色零漂移、16/16 静态引用存在；`client-smoke.mjs` 41 项、0 告警 |

### R7 的真机验收数据（0.2.0-rc.2，2026-10-14）

1440×900 逐屏与「运行时把当时表内 37 项从 `body` 行内样式抹掉」的对照版比对：

| 项 | 结果 |
|---|---|
| 徽标文字 | 深墨 `rgb(74,52,20)` 压在徽标底 `rgb(238,228,200)` 上 **9.24:1**（宿主冷蓝 9.78:1）；浅色界面再无成片冷色 |
| 选中 vs 悬停 | 色度差 37 级（60 vs 23）；压在侧栏底上的亮度步进 1.177 vs 1.074 —— 并排一眼可分（R6 时两者 RGB 差只有 `(1,0,3)`） |
| 暗色模式 | 与不装插件逐像素比对，1,296,000 像素中差 **25 px（0.0019%）**，落在一个加载转圈的一帧上 —— 仍然零漂移 |
| 零位移 | 行内码槽每段、表格分隔线、页签下划线、徽标底、发送钮圆盘、设置选中胶囊的像素数，与未装插件版逐一致 |

### R8 的真机验收（0.2.2-rc.1，2026-11-05）

1600×1000（deviceScaleFactor 2）无头 Chrome，走 NVIDIA GPU（ANGLE / D3D11，
`UNMASKED_RENDERER_WEBGL` = `NVIDIA GeForce RTX 5060 Ti`），注入签名 cookie 打开真实 GUI 截图：

| 项 | 结果 |
|---|---|
| 自动化任务空状态 | 插画从宿主蓝灰换成纸色梯度，与页面底同温、无成片冷色；细节条 `rgb(198,184,152)` 仍清晰可读 |
| 日期 / 时间选择器选中格 | 选中底 `rgb(238,222,178)` + 描边 `rgb(150,135,105)`，选中态一眼可分、不再有冷灰圈 |
| 回归 | `node --check` 通过；`check-paper-tokens.mjs` 41/41、41/41、16/16；`client-smoke.mjs` 41 项、0 告警；`paper-coverage.mjs` 无「空覆盖」提示 |

## 已知失效模式

- `overrideTokens` 的 `validateOverrides` 只校验值是不是 `{ light, dark }` 字符串对，
  **不校验 token 名**：宿主把某个 token 改名后，覆盖层既不报错也不生效 —— 静默失效。
  插件启动时会扫样式表自检，缺了就打印一条 console 警告（见 `verifyTokens`）。
- **值漂移自检抓不到**：宿主改了某个 token 的暗色默认值，覆盖层照旧生效但取值过时。
  只能靠上面那条命令回归。
- **消费方消失自检也抓不到**：宿主删掉某个 token 的唯一 `var()` 引用后，覆盖照旧注册、
  不报错，只是不再有任何视觉效果。`paper-coverage.mjs` 专治这一项。
- 自检判据读的是页面已挂载的样式表；若 ui-theme 的样式表尚未挂载，自检会跳过而不是误报。
