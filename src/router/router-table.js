import Layout from '@/views/layout'
import Home from '@/views/home'
// 路由总表
const RouterTable = [{
    path: '/layout',
    component: Layout,
    children: [{
            name: 'homeIndex',
            path: '/home',
            component: Home,
        }, {
            name: 'student',
            path: '/student',
            component: () => import( /* webpackChunkName: "student" */ '../views/student/index.vue')
        },

    ],
}, ]

export default RouterTable