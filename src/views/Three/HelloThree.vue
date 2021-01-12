<template>
	<div class="three">
		<div class="tool-box tool-box-inDev"><div class="tool-inDev">该组件开发中，尚不提供源码查看</div></div>
		<canvas id="three_canvas"></canvas>
	</div>
</template>

<script>
export default {
	name: 'threetest',
	data() {
		return {};
	},
	mounted() {
		this.initThree();
	},
	methods: {
		initThree() {
			var renderer, camera, scene, light, object;
			var width, height;
			function initRenderer() {
				width = document.getElementById('three_canvas').clientWidth;
				height = document.getElementById('three_canvas').clientHeight;
				renderer = new THREE.WebGLRenderer({
					canvas: document.getElementById('three_canvas')
				});
				renderer.setSize(width, height);
				renderer.setClearColor(0xffffff, 1.0);
			}

			function initCamera() {
				camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
				camera.position.x = 0;
				camera.position.y = 0;
				camera.position.z = 100;
				camera.up.x = 0;
				camera.up.y = 1;
				camera.up.z = 0;
				camera.lookAt({
					x: 0,
					y: 0,
					z: 0
				});
			}
			function initScene() {
				scene = new THREE.Scene();
			}
			function initObject() {
				var geometry = new THREE.CubeGeometry(100, 100, 100);
				object = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
				scene.add(object);
			}
			function render() {
				requestAnimationFrame(render);
				object.rotation.x += 0.02; // 这里控制渲染的速度
				object.rotation.y += 0.02;
				renderer.render(scene, camera);
			}
			function threeStart() {
				initRenderer();
				initCamera();
				initScene();
				initObject();
				render();
			}
			window.onload = threeStart();
		}
	}
};
</script>

<style lang="less" scoped>
.three {
	width: 100%;
	height: 100%;
	#three_canvas {
		width: 100%;
		height: 100%;
	}
}
</style>
