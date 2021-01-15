<template>
	<div class="three"><canvas id="three_canvas"></canvas></div>
</template>

<script>
import * as THREE from 'three/build/three.module.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader.js';
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper.js';
export default {
	name: 'testthree',
	data() {
		return {};
	},
	mounted() {
		this.initThree();
	},
	methods: {
		initThree() {
			let stats;

			let mesh, camera, scene, renderer, effect;
			let helper, ikHelper, physicsHelper;

			const clock = new THREE.Clock();
			
			// Ammo是Bullet Physics的js版本，主要用于实时碰撞检测和多物理场仿真
			// 现在的问题是引入这个js之后Ammo只加载一次，第二次进入函数会失效
			this.$store.state.Ammo.then(function(AmmoLib) {
				Ammo = AmmoLib;

				init();
				animate();
			});

			function init() {
				const container = document.createElement('div');
				document.body.appendChild(container);

				camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
				camera.position.z = 30;

				// scene

				scene = new THREE.Scene();
				scene.background = new THREE.Color(0xffffff);

				const gridHelper = new THREE.PolarGridHelper(30, 10);
				gridHelper.position.y = -10;
				scene.add(gridHelper);

				const ambient = new THREE.AmbientLight(0x666666);
				scene.add(ambient);

				const directionalLight = new THREE.DirectionalLight(0x887766);
				directionalLight.position.set(-1, 1, 1).normalize();
				scene.add(directionalLight);

				//

				const width = document.getElementById('three_canvas').clientWidth;
				const height = document.getElementById('three_canvas').clientHeight;
				renderer = new THREE.WebGLRenderer({
					canvas: document.getElementById('three_canvas'),
					antialias: true
				});
				renderer.setPixelRatio(window.devicePixelRatio);
				renderer.setSize(width, height);

				effect = new OutlineEffect(renderer);

				// STATS

				// 暂时先不添加，因为会导致我整个项目中存在STATS
				// stats = new Stats();
				// container.appendChild(stats.dom);

				// model

				function onProgress(xhr) {
					if (xhr.lengthComputable) {
						const percentComplete = (xhr.loaded / xhr.total) * 100;
						console.log(Math.round(percentComplete, 2) + '% downloaded');
					}
				}

				const modelFile = 'models/miku_v2.pmd';
				const vmdFiles = ['models/wavefile_v2.vmd'];

				helper = new MMDAnimationHelper({
					afterglow: 2.0
				});

				const loader = new MMDLoader();

				loader.loadWithAnimation(
					modelFile,
					vmdFiles,
					function(mmd) {
						mesh = mmd.mesh;
						mesh.position.y = -10;
						scene.add(mesh);

						helper.add(mesh, {
							animation: mmd.animation,
							physics: true
						});

						ikHelper = helper.objects.get(mesh).ikSolver.createHelper();
						ikHelper.visible = false;
						scene.add(ikHelper);

						physicsHelper = helper.objects.get(mesh).physics.createHelper();
						physicsHelper.visible = false;
						scene.add(physicsHelper);

						// 暂时先不添加，因为会导致我整个项目中存在GUI
						// initGui();
					},
					onProgress,
					null
				);

				const controls = new OrbitControls(camera, renderer.domElement);
				controls.minDistance = 10;
				controls.maxDistance = 100;

				window.addEventListener('resize', onWindowResize, false);

				function initGui() {
					const api = {
						animation: true,
						ik: true,
						outline: true,
						physics: true,
						'show IK bones': false,
						'show rigid bodies': false
					};

					const gui = new GUI();

					gui.add(api, 'animation').onChange(function() {
						helper.enable('animation', api['animation']);
					});

					gui.add(api, 'ik').onChange(function() {
						helper.enable('ik', api['ik']);
					});

					gui.add(api, 'outline').onChange(function() {
						effect.enabled = api['outline'];
					});

					gui.add(api, 'physics').onChange(function() {
						helper.enable('physics', api['physics']);
					});

					gui.add(api, 'show IK bones').onChange(function() {
						ikHelper.visible = api['show IK bones'];
					});

					gui.add(api, 'show rigid bodies').onChange(function() {
						if (physicsHelper !== undefined) physicsHelper.visible = api['show rigid bodies'];
					});
				}
			}

			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				effect.setSize(window.innerWidth, window.innerHeight);
			}

			//

			function animate() {
				requestAnimationFrame(animate);

				// stats.begin();
				render();
				// stats.end();
			}

			function render() {
				helper.update(clock.getDelta());
				effect.render(scene, camera);
			}
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
