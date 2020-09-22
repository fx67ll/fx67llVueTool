<template>
	<div id="app">
		<!-- <img alt="Vue logo" src="./assets/logo.png"> -->
		<!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
		<!-- <Map></Map> -->
		<Index></Index>
	</div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import Map from './components/MapCanvas.vue';
import Index from './view/index.vue';

export default {
	name: 'app',
	components: {
		// HelloWorld
		// Map
		Index
	},
	data() {
		return {
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
}
</style>
