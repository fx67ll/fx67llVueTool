<template>
	<div id="app">
		<router-view v-show="isDomOK"></router-view>
		<vueCanvasNest :config="nestConfig" :el="'#app'"></vueCanvasNest>
		<!-- <div class="loader" v-show="!isDomOK">
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
			isDomOK: false,
			nestConfig: {
				color: 'rgb(186, 186, 186)', // the canvas line color, default: '255,0,0'; the color is (R,G,B)
				opacity: 0.7, // the opacity of line (0~1), default: 0.7
				count: 99, // the number of lines, default: 99
				zIndex: -1 // the index of z space, default: -1
			},
			time: 0
		};
	},
	created() {
		this.checkDomInit();
	},
	methods: {
		checkDomInit() {
			var self = this;
			this.isDomOK = false;
			this.time = new Date().getTime();
			document.onreadystatechange = completeLoading;
			function completeLoading() {
				if (document.readyState == 'complete') {
					self.time = new Date().getTime() - self.time;
					console.log('网页加载共耗时：' + self.time);
					self.isDomOK = true;
				}
			}
		}
	}
};
</script>

<style>
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
.loader {
	width: 100px;
	padding: 10px;
	background-color: #42b983;
	border-radius: 12px;
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -20px;
	margin-left: -50px;
}
</style>
