<!-- @name: MapCanvas -->
<!-- @author: fx67ll -->
<!-- @version: 1.0.1-->
<!-- @description：基于高德地图的自定义绘制封装组件，请在项目中安装underscore，需要在引入高德地图api，格式：https://webapi.amap.com/maps?key=你的秘钥&v=1.4.15 -->
<!-- @bug: 目前已知bug是缩小到世界地图返回用自定义工具绘制，然后放大会导致之前的绘制全部消失 -->
<!-- @update: 2020年9月25日-v1.0.0，完成1.0.0开发 -->
<!-- @update: 2021年1月7日-v1.0.1，添加文档查看功能-->

<template>
	<div class="map">
		<div class="tool-box">
			<div v-show="this.tooltype === 'custom'" @click="checkArea">
				<span v-show="this.isCheckArea === false">确定绘制区域</span>
				<span v-show="this.isCheckArea === true">重新确定绘制区域</span>
			</div>
			<div v-show="this.isCheckArea === true && this.pathArr.length > 2 && this.tooltype === 'custom'" @click="drawArea">将线段绘制成闭合区域</div>
			<div v-show="this.tooltype === 'gaode'" @click="draw('line')">绘制线段</div>
			<div @click="cancel">撤销</div>
			<div v-show="this.isDrawTestArea === false" @click="drawTest">绘制演示图形</div>
			<div @click="showCode">查看代码</div>
			<div @click="showDoc">查看文档</div>
		</div>
		<div id="map-container" ref="map"></div>
	</div>
</template>

<script>
import _ from 'underscore';

export default {
	name: 'MapCanvas',
	data() {
		return {
			isCheckArea: false, // 用于自定义画板锁定当前地图的判断变量
			isDrawTestArea: false, // 只允许绘制一次演示图形
			AMap: null, // 地图对象
			Canvas: null, // 画板对象
			CanvasContext: null, // 画板实例对象
			pathArr: [], // 经纬度坐标对象集合,
			CanvasSize: [], // 画板对象坐标数组
			// 测试用数据，非必要参数
			testData: [
				{
					x: 118.739314,
					y: 32.041765
				},
				{
					x: 118.806605,
					y: 32.036963
				},
				{
					x: 118.827977,
					y: 32.018335
				},
				{
					x: 118.838878,
					y: 32.002251
				},
				{
					x: 118.804546,
					y: 31.989876
				},
				{
					x: 118.776736,
					y: 31.988784
				},
				{
					x: 118.75236,
					y: 31.994389
				},
				{
					x: 118.739829,
					y: 32.005817
				},
				{
					x: 118.743863,
					y: 32.032307
				},
				{
					x: 118.717599,
					y: 32.032962
				}
			]
		};
	},
	props: {
		// 选择使用自定义工具或高德官方工具，高德官方工具的方法后期有空再写，这个属性先放这里没什么卵用
		tooltype: {
			type: String,
			required: false,
			default: 'custom',
			validator(value) {
				return value === 'custom' || value === 'gaode';
			}
		},
		// 地图的发布样式，需要遵守高德官方格式
		mapstyle: {
			type: String,
			required: false,
			validator(value) {
				return value.substring(0, 6) === 'amap://';
			}
		},
		// 地图中心点，保留6位小数的经纬度数组
		mapcenter: {
			type: Array,
			required: false,
			default: function() {
				var arr = [118.779611, 32.016625];
				return arr;
			},
			validator(arr) {
				var lngreg = new RegExp('^-?((0|1?[0-7]?[0-9]?)(([.][0-9]{1,6})?)|180(([.][0]{1,6})?))$');
				var latreg = new RegExp('^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,6})?)|90(([.][0]{1,6})?))$');
				if (lngreg.test(arr[0]) && latreg.test(arr[1])) {
					return true;
				} else {
					return false;
				}
			}
		},
		// 地图的初始化缩放比例，值为正整数
		mapzoom: {
			type: Number,
			required: false,
			default: 13,
			validator(num) {
				return new RegExp('^[0-9]*[1-9][0-9]*$').test(num) && num > 2 && num < 19;
			}
		},
		// 线条的宽度，值为正整数
		strokeWidth: {
			type: Number,
			required: false,
			default: 10,
			validator(num) {
				return typeof num === 'number';
			}
		},
		// 线条的颜色
		strokeColor: {
			type: Array,
			required: false,
			default: function() {
				// 如果只想用一种颜色，那可以去用高德自带的画图工具，没有必要使用自定义的canvas画图工具
				var arr = [
					{
						opacityPos: 0, // 当前颜色在当前线条中的位置，值为0~1之间最多保留两位小数的浮点数，包括0和1
						strokeCo: '#ffff00' // 当前位置的线条颜色，值为十六进制颜色码
					},
					{
						opacityPos: 0.2,
						strokeCo: '#55ff00'
					},
					{
						opacityPos: 0.4,
						strokeCo: '#ff5500'
					},
					{
						opacityPos: 0.6,
						strokeCo: '#ff0000'
					},
					{
						opacityPos: 0.8,
						strokeCo: '#5500ff'
					},
					{
						opacityPos: 1,
						strokeCo: '#00FFFF'
					}
				];
				return arr;
			},
			validator(arr) {
				var vaildNum = 0;
				if (arr.length > 0) {
					_.each(arr, function(item, key) {
						if (item.hasOwnProperty('opacityPos') && item.hasOwnProperty('strokeCo')) {
							if (new RegExp('^(0(\.\d{1,2})?|1(\.0{1,2})?)$').test(item.opacityPos)) {
								if (new RegExp('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$').test(item.strokeCo)) {
									vaildNum = vaildNum + 1;
								}
							}
						}
					});
				}
				if (vaildNum === arr.length) {
					return true;
				} else {
					return false;
				}
			}
		},
		// 阴影样式，请严格按照对象中的参数传递
		shadowStyle: {
			type: Object,
			required: false,
			default: function() {
				var obj = {
					shadowColor: '#D3D3D3', // 阴影的颜色，值为十六进制颜色码
					shadowBlur: 5, // 阴影的模糊级数，值为正整数
					shadowOffsetX: 20, // 返回形状与阴影的水平距离，值为正整数
					shadowOffsetY: 20 // 返回形状与阴影的垂直距离，值为正整数
				};
				return obj;
			},
			validator(obj) {
				if (obj.hasOwnProperty('shadowColor') && obj.hasOwnProperty('shadowBlur') && obj.hasOwnProperty('shadowOffsetX') && obj.hasOwnProperty('shadowOffsetY')) {
					if (new RegExp('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$').test(obj.shadowColor)) {
						if (
							new RegExp('^[0-9]*[1-9][0-9]*$').test(obj.shadowBlur) &&
							new RegExp('^[0-9]*[1-9][0-9]*$').test(obj.shadowOffsetX) &&
							new RegExp('^[0-9]*[1-9][0-9]*$').test(obj.shadowOffsetY)
						) {
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				} else {
					return false;
				}
			}
		},
		// 多边形的填充颜色
		fillStyle: {
			type: Object,
			required: false,
			default: function() {
				var obj = {
					isFill: true, // 表示连接所有线段绘制封闭图形后是否需要填充，不填充的话可以直接传false，下面的属性也不会再验证
					fillColor: [
						// 表示填充的颜色，属性参考strokeColor
						{
							opacityPos: 0,
							fillCo: '#aaff7f'
						},
						{
							opacityPos: 0.2,
							fillCo: '#aaffff'
						},
						{
							opacityPos: 0.4,
							fillCo: '#ffff7f'
						},
						{
							opacityPos: 0.6,
							fillCo: '#ffaa7f'
						},
						{
							opacityPos: 0.8,
							fillCo: '#aaaa7f'
						},
						{
							opacityPos: 1,
							fillCo: '#ffaaff'
						}
					],
					gradientDirection: 'right-bottom' // 表示填充颜色的渐变方向，可选值: left-top left-bottom right-top right-bottom middle-border border-middle top-bottom bottom-top left-right right-left
				};
				return obj;
			},
			validator(obj) {
				if (obj.hasOwnProperty('isFill') || typeof obj.isFill !== 'boolean') {
					if (obj.isFill === true) {
						if (obj.hasOwnProperty('fillColor')) {
							var vaildNum = 0;
							if (obj.fillColor.length > 0) {
								_.each(obj.fillColor, function(item, key) {
									if (item.hasOwnProperty('opacityPos') && item.hasOwnProperty('fillCo')) {
										if (new RegExp('^(0(\.\d{1,2})?|1(\.0{1,2})?)$').test(item.opacityPos)) {
											if (new RegExp('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$').test(item.fillCo)) {
												vaildNum = vaildNum + 1;
											}
										}
									}
								});
							}
							if (vaildNum === obj.fillColor.length) {
								if (obj.hasOwnProperty('gradientDirection')) {
									if (
										obj.gradientDirection === 'left-top' ||
										obj.gradientDirection === 'left-bottom' ||
										obj.gradientDirection === 'right-top' ||
										obj.gradientDirection === 'right-bottom' ||
										obj.gradientDirection === 'middle-border' ||
										obj.gradientDirection === 'border-middle' ||
										obj.gradientDirection === 'top-bottom' ||
										obj.gradientDirection === 'bottom-top' ||
										obj.gradientDirection === 'left-right' ||
										obj.gradientDirection === 'right-left'
									) {
										return true;
									} else {
										return false;
									}
								} else {
									return false;
								}
							} else {
								return false;
							}
						} else {
							return false;
						}
					} else {
						return true;
					}
				} else {
					return false;
				}
			}
		}
	},
	mounted() {
		this.mapInit();
	},
	methods: {
		// 初始化地图
		mapInit() {
			var self = this;
			self.AMap = new AMap.Map('map-container', {
				center: self.mapcenter,
				zoom: self.mapzoom,
				showIndoorMap: false // 禁止显示室内地图，否则在画完自定义canvas之后继续放大会有无法加载室内的地图的错误导致图层消失
			});

			if (self.mapstyle !== '' && self.mapstyle !== null && self.mapstyle !== undefined) {
				self.AMap.setMapStyle(self.mapstyle);
			}

			self.AMap.on('click', function(e) {
				// 确定绘制区域之后开始收集作画点集合
				if (self.isCheckArea === true) {
					self.initCanvasContext(self.AMap, self.strokeWidth, self.shadowStyle);
					if (self.pathArr.length !== 0) {
						var startIndex = self.pathArr.length - 1;
					}
					var posObj = {};
					posObj.x = e.lnglat.getLng();
					posObj.y = e.lnglat.getLat();
					// posObj = e.pixel;
					self.pathArr.push(posObj);
					if (self.pathArr.length > 1) {
						var endIndex = self.pathArr.length - 1;
						self.drawLineByPostion(
							self.AMap,
							self.CanvasContext,
							self.strokeColor,
							self.pathArr[startIndex].x,
							self.pathArr[startIndex].y,
							self.pathArr[endIndex].x,
							self.pathArr[endIndex].y
						);
						// self.drawLineByPixel(self.pathArr[startIndex],self.pathArr[endIndex]);
					}
				}
			});
		},
		// 初始化canvas画板
		initCanvasContext(map, linewidth, shadowstyle) {
			var canvas = document.createElement('canvas');
			canvas.classList.add('canvas-new');
			canvas.width = map.getSize().width;
			canvas.height = map.getSize().height;
			this.CanvasSize = [canvas.width, canvas.height];
			var context = canvas.getContext('2d');
			this.CanvasContext = context;

			context.lineWidth = linewidth;
			context.lineCap = 'round';
			context.lineJoin = 'round';
			context.shadowColor = shadowstyle.shadowColor;
			context.shadowBlur = shadowstyle.shadowBlur;
			context.shadowOffsetX = shadowstyle.shadowOffsetX;
			context.shadowOffsetY = shadowstyle.shadowOffsetY;

			var CanvasLayer = new AMap.CanvasLayer({
				canvas: canvas,
				bounds: map.getBounds(),
				zooms: [3, 18]
			});
			// CanvasLayer.setMap(null); // 传null相当于清除当前页面中画板
			CanvasLayer.setMap(map);
		},
		// 根据坐标点集合绘制区域
		// 坐标集合的数据结构是[{x:0,y:0}]
		drawByPath(map, context, path) {
			var self = this;
			context.beginPath();
			var startpixel = map.lnglatTocontainer(new AMap.LngLat(path[0].x, path[0].y));
			context.moveTo(startpixel.x, startpixel.y);
			_.each(path, function(item, key) {
				if (key !== 0) {
					var pixel = map.lnglatTocontainer(new AMap.LngLat(item.x, item.y));
					context.lineTo(pixel.x, pixel.y);
					self.handleStrokeGadient(context, self.strokeColor, startpixel, pixel);
					context.stroke();
				}
			});
			context.closePath();
			self.handleFillGadient(context, self.fillStyle);
			context.stroke();
		},
		drawTest() {
			var testData = this.testData;
			this.drawTestArea(testData);
		},
		// 创建演示用的区域图形
		drawTestArea(testData) {
			var self = this;
			this.isDrawTestArea = true;
			self.AMap.setZoomAndCenter(13, [118.779611, 32.016625]);
			// 这里可以继续优化，暂且使用延时绘制的方式
			setTimeout(function() {
				self.initCanvasContext(self.AMap, self.strokeWidth, self.shadowStyle);
				_.each(testData, function(item, key) {
					if (key !== testData.length - 1) {
						self.drawLineByPostion(self.AMap, self.CanvasContext, self.strokeColor, testData[key].x, testData[key].y, testData[key + 1].x, testData[key + 1].y);
					}
				});
				self.drawByPath(self.AMap, self.CanvasContext, testData);
			}, 500);
		},
		// 处理线渐变
		handleStrokeGadient(context, strokecolor, startpixel, endpixel) {
			var gradient = context.createLinearGradient(startpixel.x, startpixel.y, endpixel.x, endpixel.y); //线性渐变的起止坐标
			_.each(strokecolor, function(item, key) {
				// 创建渐变的开始颜色，0表示偏移量，个人理解为直线上的相对位置，最大为1，一个渐变中可以写任意个渐变颜色
				gradient.addColorStop(item.opacityPos, item.strokeCo);
			});
			context.strokeStyle = gradient;
		},
		// 处理填充渐变
		// fillstyle填充样式对象
		handleFillGadient(context, fillstyle) {
			var self = this;
			if (fillstyle.isFill === true) {
				var tl = { x: 0, y: 0 };
				var tr = { x: self.CanvasSize[0], y: 0 };
				var bl = { x: 0, y: self.CanvasSize[1] };
				var br = { x: self.CanvasSize[0], y: self.CanvasSize[1] };
				var gradient = null;
				if (fillstyle.gradientDirection === 'left-top') {
					gradient = context.createLinearGradient(br.x, br.y, tl.x, tl.y);
				}
				if (fillstyle.gradientDirection === 'left-bottom') {
					gradient = context.createLinearGradient(tr.x, tr.y, bl.x, bl.y);
				}
				if (fillstyle.gradientDirection === 'right-top') {
					gradient = context.createLinearGradient(bl.x, bl.y, tr.x, tr.y);
				}
				if (fillstyle.gradientDirection === 'right-bottom') {
					gradient = context.createLinearGradient(tl.x, tl.y, br.x, br.y);
				}
				// 径向渐变待开发
				// if (fillstyle.gradientDirection === 'middle-border') {
				// 	gradient = context.createLinearGradient(br.x, br.y, tl.x, tl.y);
				// }
				// if (fillstyle.gradientDirection === 'border-middle') {
				// 	gradient = context.createLinearGradient(br.x, br.y, tl.x, tl.y);
				// }
				if (fillstyle.gradientDirection === 'top-bottom') {
					gradient = context.createLinearGradient(tl.x, tl.y, bl.x, bl.y);
				}
				if (fillstyle.gradientDirection === 'bottom-top') {
					gradient = context.createLinearGradient(bl.x, bl.y, tl.x, tl.y);
				}
				if (fillstyle.gradientDirection === 'left-right') {
					gradient = context.createLinearGradient(tl.x, tl.y, tr.x, tr.y);
				}
				if (fillstyle.gradientDirection === 'right-left') {
					gradient = context.createLinearGradient(tr.x, tr.y, tl.x, tl.y);
				}
				_.each(fillstyle.fillColor, function(item, key) {
					// 创建渐变的开始颜色，0表示偏移量，个人理解为直线上的相对位置，最大为1，一个渐变中可以写任意个渐变颜色
					gradient.addColorStop(item.opacityPos, item.fillCo);
				});
				context.fillStyle = gradient;
				context.fill(); // 先填充再画边框，否则会导致填充的时候遮盖边框
			} else {
				context.fillStyle = '';
				context.fill(); // 先填充再画边框，否则会导致填充的时候遮盖边框
			}
		},
		// 根据容器内的像素坐标绘制线
		// startpixel起点对象{x:0,y:0} endpixel终点对象{x:0,y:0}
		// 暂时放弃维护的废弃方法
		drawLineByPixel(startpixel, endpixel) {
			this.CanvasContext.moveTo(startpixel.x, startpixel.y);
			this.CanvasContext.lineTo(endpixel.x, endpixel.y);
			var gradient = this.CanvasContext.createLinearGradient(startpixel.x, startpixel.y, endpixel.x, endpixel.y);
			gradient.addColorStop(0, 'DeepSkyBlue'); // 创建渐变的开始颜色，0表示偏移量，个人理解为直线上的相对位置，最大为1，一个渐变中可以写任意个渐变颜色
			gradient.addColorStop(1, 'Cyan');
			this.CanvasContext.strokeStyle = gradient;
			this.CanvasContext.stroke();
		},
		// 根据容器内的经纬度坐标绘制线
		// 地图对象 画板实例对象 线的颜色数组 起点经度 起点纬度 终点经度 终点纬度
		drawLineByPostion(map, context, strokecolor, startlng, startlat, endlng, endlat) {
			context.fillStyle = '';
			var pixel1 = map.lnglatTocontainer(new AMap.LngLat(startlng, startlat));
			var pixel2 = map.lnglatTocontainer(new AMap.LngLat(endlng, endlat));
			context.moveTo(pixel1.x, pixel1.y);
			context.lineTo(pixel2.x, pixel2.y);
			this.handleStrokeGadient(context, strokecolor, pixel1, pixel2);
			context.stroke();
		},
		// 自定义工具有天然缺陷，canvas图层未解决如何随地图自动放大缩小
		checkArea() {
			var self = this;
			self.pathArr = [];
			// self.strokeWidth = 10 * (self.AMap.getZoom() / 18);
			self.isCheckArea = !self.isCheckArea;
			if (self.isCheckArea === true) {
				self.AMap.setStatus({
					resizeEnable: false,
					dragEnable: false,
					keyboardEnable: false,
					doubleClickZoom: false,
					zoomEnable: false,
					rotateEnable: false
				});
			}
			if (self.isCheckArea === false) {
				self.AMap.setStatus({
					dragEnable: true,
					zoomEnable: true
				});
			}
		},
		// 绘制区域
		drawArea() {
			var self = this;
			self.drawByPath(self.AMap, self.CanvasContext, self.pathArr);
		},
		// 绘制
		draw(val) {
			var self = this;
			var mouseTool = new AMap.MouseTool(self.AMap);
			mouseTool.polyline({
				strokeColor: '#ff0000',
				strokeOpacity: 1,
				strokeWeight: 10,
				strokeStyle: 'solid'
			});
			mouseTool.on('draw', event => {
				var path = event.obj.getPath();
				// console.log(path);
			});
		},
		// 退出当前绘制区域
		cancel() {
			this.isDrawTestArea = false;
			this.mapInit();
			this.pathArr = [];
		},
		// 显示当前组件源码，提取源码请自行删除该部分相关代码
		showCode() {
			this.$router.push({
				path: '/code',
				query: {
					code: 'MapCanvasCode'
				}
			});
		},
		// 显示当前组件文档，提取源码请自行删除该部分相关代码
		showDoc() {
			this.$router.push({
				path: '/doc',
				query: {
					code: 'MapCanvasDoc'
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
/deep/ .canvas-new {
	// border: 1px solid red !important;
}

.ban-user-select {
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Chrome/Safari/Opera */
	-khtml-user-select: none; /* Konqueror */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none; /* Non-prefixed version, currently not supported by any browser */
}

.map {
	width: 100%;
	height: 100%;
	position: relative;
	color: #42b983;
	#map-container {
		width: 100%;
		height: 100%;
		position: relative;
	}
}
</style>
