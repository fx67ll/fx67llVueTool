<template>
	<div id="app">
		<router-view></router-view>
		<vueCanvasNest :config="nestConfig" :el="'#app'"></vueCanvasNest>
		<div v-show="this.$store.state.isShowbckbtn" class="fx67ll-bckbtn"><span @click="back">返 回</span></div>
		<!-- <div class="loader">
			<div class="loader-inner pacman">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div> -->
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
			time: 0
		};
	},
	methods: {
		back() {
			this.$router.go(-1);
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
	color: rgb(186, 186, 186, 1);
}
#app {
	width: 100%;
	height: 100%;
}
.fx67ll-bckbtn {
	position: absolute;
	top: 20px;
	right: 30px;
	border: 1px solid #42b983;
	box-shadow: 1px 1px 5px #f8f8f8;
	z-index: 999;
}
.fx67ll-bckbtn span {
	display: inline-block;
	padding: 4px;
	.ban-user-select();
	color: #42b983;
	border: 1px solid #42b983;
}
.fx67ll-bckbtn span:hover {
	background-color: #42b983;
	color: #ffffff;
}
// .loader {
// 	width: 100px;
// 	padding: 10px;
// 	background-color: #42b983;
// 	border-radius: 12px;
// 	position: absolute;
// 	top: 20px;
// 	right: 20px;
// }
</style>
