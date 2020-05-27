import Vue from 'vue'
import App from './App.vue'
import {
    createRouter
} from "./router";

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd)

Vue.config.productionTip = false
// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp() {
    const router = createRouter();
    const app = new Vue({
        router,
        // 根实例简单的渲染应用程序组件。
        render: h => h(App)
    })
    return {
        app,
        router
    }
}