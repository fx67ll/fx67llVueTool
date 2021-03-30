<template>
	<div id="app">
		<router-view></router-view>
		<vueCanvasNest :config="nestConfig" :el="'#app'" v-if="isLoadingCompleted"></vueCanvasNest>
		<div
			v-show="this.$store.state.isShowbckbtn"
			class="fx67ll-bckbtn"
			:class="[this.$store.state.btnType === 'default' ? '' : this.$store.state.btnType === 'doc' ? 'fx67ll-bckbtn-grey' : 'fx67ll-bckbtn-red']"
		>
			<span @click="back">返回</span>
		</div>
	</div>
</template>

<script>
import vueCanvasNest from 'vue-canvas-nest';

export default {
	name: 'app',
	components: {
		vueCanvasNest
	},
	data() {
		return {
			nestConfig: {
				color: 'rgb(186, 186, 186)', // the canvas line color, default: '255,0,0'; the color is (R,G,B)
				opacity: 0.7, // the opacity of line (0~1), default: 0.7
				count: 99, // the number of lines, default: 99
				zIndex: -1 // the index of z space, default: -1
			},
			time: 0, // 用于判断是否第一次加载AMMO
			isLoadingCompleted: false
		};
	},
	mounted() {
		var self = this;
		// 这里需要存储一下Ammo的依赖
		this.$store.commit('SETAMMO', Ammo());
		var loadingTimer = setTimeout(function() {
			self.isLoadingCompleted = true;
			clearTimeout(loadingTimer);
		}, 100);
		// 在控制台输出一下canvas-nest展开的时间
		// 不过好像异步处理一下的canvas-nest会自己全部展开了
		this.showSeconds(1);
	},
	methods: {
		showSeconds(time) {
			var self = this;
			var consoleTimer = setTimeout(function() {
				// console.log(`Waiting canvas-nest spread out......${time}s`);
				// console.log(`canvas-nest is spread out!`);
				console.log('code is magic!');
				console.log('https://fx67ll.xyz');
				if (!self.isLoadingCompleted) {
					self.showSeconds(time + 1);
				} else {
					clearTimeout(consoleTimer);
				}
			}, 100);
		},
		back() {
			if (window.history.length <= 1) {
				this.$router.push({ path: '/' });
				return false;
			} else {
				this.$router.go(-1);
			}
			// 上面都没执行就说明卡在当前页不是最后一条， histroy记录数量大于1，又没有回退记录，只能返回首页，
			// 如果上面都执行了 页面都跳走了，这个也就不用管了
			// setTimeout(() => {
			// 	this.$router.push({ path: '/' });
			// }, 1000);
		}
	}
};
</script>

<style lang="less">
html,
body {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	font-family: 'PFR';
	color: @grey;
}
#app {
	width: 100%;
	height: 100%;
}
.fx67ll-bckbtn {
	position: absolute;
	top: 20px;
	right: 30px;
	border: 1px solid @green;
	box-shadow: 1px 1px 5px #f8f8f8;
	z-index: 999;
}
.fx67ll-bckbtn span {
	display: inline-block;
	padding: 6px 6px 2px 6px;
	.ban-user-select();
	color: @green;
	font-size: 18px;
	line-height: 22px;
	border: 1px solid @green;
}
.fx67ll-bckbtn span:hover {
	background-color: @green;
	color: #ffffff;
}
// 文档中使用的灰色按钮
.fx67ll-bckbtn-grey {
	border: 1px solid @grey;
}
.fx67ll-bckbtn-grey span {
	color: @grey;
	border: 1px solid @grey;
}
.fx67ll-bckbtn-grey span:hover {
	background-color: @grey;
}
// 开发中的组件使用的红色按钮
.fx67ll-bckbtn-red {
	border: 1px solid @red;
}
.fx67ll-bckbtn-red span {
	color: @red;
	border: 1px solid @red;
}
.fx67ll-bckbtn-red span:hover {
	background-color: @red;
}
</style>
