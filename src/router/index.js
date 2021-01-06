import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import store from '@/store/index.js'

export const fx67llRoutes = [{
		path: '/',
		name: 'index',
		component: () => import('@v/index.vue') //首页
	},
	{
		path: '/code',
		name: 'code',
		component: () => import('@c/CodeMirror.vue') // 用于展示不同代码文件
	},
	{
		path: '/devtest',
		name: 'devtest',
		component: () => import('@c/ComponentTest.vue') // 本地编写组件时候使用的测试页面
	},
	{
		path: '/mapcanvas',
		name: 'mapcanvas',
		component: () => import('@v/MapCanvas.vue') // 在高德地图上绘制canvas覆盖物
	},
	{
		path: '/splitarea',
		name: 'splitarea',
		component: () => import('@v/SplitArea.vue') // 在高德地图上绘制canvas覆盖物
	},
	{
		path: '/test',
		name: 'test',
		component: () => import('@v/CodeTest.vue') // 代码测试页面
	}
]

const router = new Router({
	mode: 'hash', // history模式，去掉url中的#
	scrollBehavior: () => ({
		y: 0
	}),
	routes: fx67llRoutes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
	// 不是首页的话将自动显示返回按钮
	if (to.name !== 'index') {
		store.dispatch("setBtnStateAsync", true);
	} else {
		store.dispatch("setBtnStateAsync", false);
	}
	next() // 必须使用 next ,执行效果依赖 next 方法的调用参数
})

export default router
