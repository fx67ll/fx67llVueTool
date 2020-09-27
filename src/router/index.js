import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

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

export default new Router({
	mode: 'history', // history模式，去掉url中的#
	scrollBehavior: () => ({
		y: 0
	}),
	routes: fx67llRoutes
})
