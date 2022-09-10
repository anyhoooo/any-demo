export const AppStatus = {
    /** 未加载，应用初始状态 */
    NOT_LOADED: 0,
    /** 未启动 */
    NOT_BOOTSTRAPPED: 1,
    /** 未挂载 */
    NOT_MOUNTED: 2,
    /** 挂载成功 */
    MOUNTED: 3,
}

export function shouldBeActive(app) {
    return typeof app.activeWhen === 'function' ? app.activeWhen(window.location) : location.pathname.startsWith(app.activeWhen)
}