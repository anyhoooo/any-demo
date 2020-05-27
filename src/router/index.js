import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router-table' //是一个数组

Vue.use(VueRouter)

export function createRouter() {
    const RouterConfig = {
        mode: 'history',
        routes: routes,
        base: process.env.VUE_APP_ROUTER_BASE,
    }
    const router = new VueRouter(RouterConfig)

    //全局路由监听，判断有没有权限
    router.beforeEach((to, from, next) => {
        console.log(to)
        next()
    })

    router.onError(err => {
        //TODO:
        // eslint-disable-next-line no-console
        console.error('vueRouter.onError', err)
    })
    return router
}