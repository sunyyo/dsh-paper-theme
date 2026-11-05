// 宿主侧（Node）半：no-op。
// 主题覆盖全部在浏览器侧 ./client（lib/client.js）通过 ThemeRuntime 完成。
// 这一半只为让 Loader 行可加载、并被 dsh-client-modules 扫进浏览器 roster。

/** 稳定插件名。 */
export const name = "paper-theme";

/** 宿主半不需要任何服务。 */
export const inject = [];

/**
 * 宿主插件主体：空实现。
 * @param {import('@deepseek-ai/cordis').Context} _ctx
 */
export function apply(_ctx) {
	// no-op
}
