import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import store from '@/store/index.js'

import Index from '@v/index.vue'
import CodeMirror from '@c/CodeMirror.vue'
import MapCanvas from '@c/MapCanvas.vue'
import Test from '@c/Test.vue'

export const fx67llRoutes = [{
		path: '/',
		name: 'index',
		component: Index
	},
	{
		path: '/code',
		name: 'code',
		component: CodeMirror
	},
	{
		path: '/mapcanvas',
		name: 'mapcanvas',
		component: MapCanvas
	},
	{
		path: '/test',
		name: 'test',
		component: Test
	}
]

const router = new Router({
	mode: 'history', // history模式，去掉url中的#
	scrollBehavior: () => ({
		y: 0
	}),
	routes: fx67llRoutes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
	if (to.path !== '/') {
		store.commit("setisShowbckbtn", true);
	} else {
		store.commit("setisShowbckbtn", false);
	}
	next() // 必须使用 next ,执行效果依赖 next 方法的调用参数
})

export default router
