import { RouteConfig } from 'vue-router'
/** 自定义的路由类型 基于vue-router */
export interface XBRouterConfig extends RouteConfig {
	children?: XBRouterConfig[]
	meta?: FirstLevelMeta | SecondLevelMeta | ThreeLevelMeta
}

interface MetaBase {
	/** 模块名称的key，它的value需要到`@services/base/title`中配置 */
	title: string
	/** 父级路由标记 */
	parentRouter?: () => XBRouterConfig
	/** 公共权限验证方法，有这个函数会忽略其他的验证 */
	authorize?: () => boolean
}

/** 一级路由的Meta */
export interface FirstLevelMeta extends MetaBase {
	/** 如果这个模块还没实现需要跳老模块，加这个字段，value是判断用户是否有这个模块权限的函数（来自老系统的文件） */
	isNgAuth?: () => boolean

	/** 一级模块的图标名字（要跟图片名一模一样） */
	icon: string
}

/** 二级路由的Meta */
// tslint:disable-next-line no-empty-interface
export interface SecondLevelMeta extends MetaBase {}

/** 三级路由的Meta */
export interface ThreeLevelMeta extends MetaBase {
	/** 可选字段，进入该页面需要的权限，如果是&&权限则写成二维数组 */
	roles?: Array<string | string[]>
	/** 可选字段，是默认子节点路由（二级模块至少要有一个默认节点，有默认节点才能进该二级模块） |false */
	isDefault?: boolean
	/** 可选字段，该路由节点不显示在面包屑中（该属性不控制是否显示面包屑还是tab）,参考科目列表  |false */
	noBreadcrumb?: boolean
	/** 隐藏顶部二级菜单（tab与面包屑）,参考首页  |false */
	noNavigation?: boolean
	/** <true: tab, false: 面包屑>  |false */
	navigationWithTab?: boolean
	/** 是否在s-tab-router-view组件中显示tab */
	parentRouter?: any
	/** 如果title是可选的则需要在进入的路由钩子上判断 */
	beforeEnter?: (to: XBRouterConfig, from: XBRouterConfig, next: () => void) => void

	/** 以下是该路由未实现时的配置项 */
	/** 页面未实现，需要跳转老ng */
	notImplemented?: boolean
	/** 未实现应该跳地址 */
	ngPath?: string
	/** 二级模块标识，如果ng那边已经将tab拆分成独立页面，则不需要这个标识
	 * 会存入sessionStorage ->sessionStorage.setItem('fromVue', to.meta.ngSubPath)
	 * ng那边要做相应的修改
	 */
	ngSubPath?: string

	customBreadcrumb?: () => void
}
