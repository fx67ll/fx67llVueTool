// 下面是一个js文件，用最简单最全的例子展示了全局数据 isShowbckbtn的声明以及改变的方法；
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		isShowbckbtn: false,
	},
	// 类似computed计算属性，用于从store的state中派生出一些状态，例如过滤并计算
	getters: {
		// 返回bckbtn状态
		getBtnState(state, value) {
			return state.isShowbckbtn
		},
	},
	// 专注于同步修改State，官方推荐大写mutations操作
	mutations: {
		// 同步设置bckbtn状态
		SETBTNSTATE(state, value) {
			state.isShowbckbtn = value;
		}
	},
	// 专注于业务代码，可以进行异步操作
	actions: {
		// 异步设置bckbtn状态
		setBtnStateAsync(context, params) {
			context.commit('SETBTNSTATE', params);
		}
	}
});
export default store;
