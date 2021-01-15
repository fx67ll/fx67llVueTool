import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 修复路由重复报错
// 获取原型对象上的push函数
const originalPush = Router.prototype.push
// 修改原型对象中的push方法
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

import store from '@/store/index.js'

export const fx67llRoutes = [{
		path: '/',
		name: 'index',
		component: () => import('@v/index.vue') //首页
	},
	{
		path: '/doc',
		name: 'doc',
		component: () => import('@c/CodeDoc.vue') // 用于展示文档
	},
	{
		path: '/code',
		name: 'code',
		component: () => import('@c/CodeMirror.vue') // 用于展示源码
	},
	{
		path: '/test',
		name: 'test',
		component: () => import('@v/CodeTest.vue') // 代码测试页面
	},
	{
		path: '/devtest',
		name: 'devtest',
		component: () => import('@c/ComponentTest.vue') // 本地编写组件时候使用的测试页面
	},
	{
		path: '/mapcanvas',
		name: 'mapcanvas',
		component: () => import('@v/Map/MapCanvas/MapCanvas.vue') // 在高德地图上绘制canvas覆盖物
	},
	{
		path: '/splitarea',
		name: 'splitarea',
		component: () => import('@v/Map/SplitArea/SplitArea.vue') // 在高德地图上绘制canvas覆盖物
	},
	{
		path: '/hellothree',
		name: 'hellothree',
		component: () => import('@v/Three/HelloThree.vue') // Threejs Hello World
	},
	{
		path: '/testthree',
		name: 'testthree',
		component: () => import('@v/Three/TestThree.vue') // Threejs为医院项目的测试案例
	},
	{
		path: '/testnode',
		name: 'testnode',
		component: () => import('@v/Node/TestNode.vue') // Nodejs 接口联调测试地址
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
		if(to.name === 'doc') {
			store.dispatch("setBtnTypeAsync", 'doc');
		}else if(to.name === 'splitarea'){
			store.dispatch("setBtnTypeAsync", 'dev');
		}else{
			store.dispatch("setBtnTypeAsync", 'default');
		}
	} else {
		store.dispatch("setBtnStateAsync", false);
	}
	next() // 必须使用 next ,执行效果依赖 next 方法的调用参数
})

export default router
