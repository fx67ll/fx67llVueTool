<template>
	<div id="app">
		<!-- <img alt="Vue logo" src="./assets/logo.png"> -->
		<!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
		<!-- <Map :mapcenter="mapcenter"></Map> -->
		<Test></Test>
	</div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import Map from './components/MapCanvas.vue';
import Test from './view/index/index.vue';

export default {
	name: 'app',
	components: {
		// HelloWorld
		// Map
		Test
	},
	data() {
		return {
			mapcenter: [118.789611, 32.016625]
		};
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
}
#app {
	width: 100%;
	height: 100%;
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	/* margin-top: 60px; */
}
</style>
