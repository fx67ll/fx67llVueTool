<template>
	<div id="app">
		<router-view></router-view>
		<vueCanvasNest :config="nestConfig" :el="'#app'"></vueCanvasNest>
		<!-- <fx67llIndex></fx67llIndex> -->
		<!-- <Map></Map> -->
	</div>
</template>

<script>
import vueCanvasNest from 'vue-canvas-nest';
import fx67llIndex from './views/index.vue';
// import Map from './components/MapCanvas.vue';

export default {
	name: 'app',
	components: {
		vueCanvasNest,
		fx67llIndex
		// Map
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
	created() {
		this.checkDomInit();
	},
	methods: {
		checkDomInit() {
			var self = this;
			console.log(1, new Date().getTime());
			this.time = new Date().getTime();
			document.onreadystatechange = completeLoading;
			function completeLoading() {
				if (document.readyState == 'complete') {
					console.log(2, new Date().getTime());
					self.time = new Date().getTime() - self.time;
					console.log('总共耗时：' + self.time);
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
</style>
