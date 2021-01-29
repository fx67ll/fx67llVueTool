<!-- @name: MapCanvas -->
<!-- @author: fx67ll -->
<!-- @version: 1.0.0-->
<!-- @description：基于高德地图的行政区划工具，需要在引入高德地图api的同时引入AMap.DistrictSearch插件，格式：https://webapi.amap.com/maps?key=你的秘钥&v=1.4.15&plugin=AMap.DistrictSearch-->
<!-- @bug: 目前暂无发现bug，欢迎提供 -->

<template>
	<div class="map">
		<!-- <div class="tool-box">
			<div @click="showCode">查看代码</div>
			<div @click="showDoc">查看文档</div>
		</div> -->
		<div class="tool-box tool-box-inDev"><div class="tool-inDev">该组件开发中，尚不提供源码查看</div></div>
		<div id="map-container" ref="map"></div>
	</div>
</template>

<script>
import _ from 'underscore';

export default {
	name: 'Map',
	data() {
		return {
			AMap: null // 地图对象
		};
	},
	props: {
		// 地图的发布样式
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
		// 地图的初始化缩放比例，2D模式下只能是int，在3D模式下的高德地图传入float才会生效
		mapzoom: {
			type: Number,
			required: false,
			default: 13,
			validator(num) {
				return new RegExp('^[0-9]*[1-9][0-9]*$').test(num) && num > 2 && num < 19;
			}
		},
		// 显示的行政区级别，1国家，2省份，3市，4区县，默认显示整个中国的轮廓线
		searchLevel: {
			type: Number,
			required: false,
			default: 1,
			validator(num) {
				return new RegExp('^[0-9]*[1-9][0-9]*$').test(num) && num > 0 && num < 5;
			}
		},
		// 显示的下级行政区级数，可选值是0/1/2/3，默认是1显示下一级行政区的轮廓线，0代表不显示下级区域，1/2/3若下级不够会在控制台返回错误信息提示
		subsNum: {
			type: Number,
			required: false,
			default: 1,
			validator(num) {
				return new RegExp('^[0-9]*[0-9][0-9]*$').test(num) && num < 4;
			}
		},
		// 行政区域轮廓线的样式，请严格按照对象中的参数传递
		strokeStyle: {
			type: Object,
			required: false,
			default: function() {
				var obj = {
					isShow: true, // 表示是否需要绘制行政区的轮廓线，不绘制的话可以直接传false，下面的属性也不会再验证
					isShowSubs: true, // 表示是否需要绘制下级行政区的轮廓线，不绘制的话直接传false，但是如果属性subsNum的值为0则强制默认是false，
					style: {
						strokeColor: '#0091ea', // 线条的颜色，值为十六进制颜色码
						strokeWeight: 1, // 线条的宽度，值为正整数
						strokeLine: 'solid', // 线条的虚实，可选值为solid/dashed，对应高德地图的原始属性strokeStyle
						strokeOpacity: 1.00, // 线条的透明度，值为0~1之间最多保留两位小数的浮点数，包括0和1
						strokeDasharray: [0] // 虚线条的间隙样式，使用实线时传入[0]即可，使用虚线时该参数详情请参考SVG中的stroke-dasharray，必要时请自行查阅相关资料(参考博客https://www.cnblogs.com/daisygogogo/p/11044353.html)
					}
				};
				return obj;
			},
			validator(obj) {
				if (obj.hasOwnProperty('isShow') || typeof obj.isShow !== 'boolean') {
					if (obj.isShow === true) {
						if (obj.hasOwnProperty('isShowSubs') || typeof obj.isShowSubs !== 'boolean') {
							if (obj.hasOwnProperty('style')) {
								var style = obj.style;
								if (
									style.hasOwnProperty('strokeColor') &&
									style.hasOwnProperty('strokeWeight') &&
									style.hasOwnProperty('strokeLine') &&
									style.hasOwnProperty('strokeOpacity') &&
									style.hasOwnProperty('strokeDasharray')
								) {
									if (
										new RegExp('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$').test(style.strokeColor) &&
										new RegExp('^[0-9]*[1-9][0-9]*$').test(style.strokeWeight) &&
										new RegExp('^(0(\.\d{1,2})?|1(\.0{1,2})?)$').test(style.strokeOpacity) &&
										(style.strokeLine === 'solid' || style.strokeLine === 'dashed')
									) {
										if (Array.isArray(style.strokeDasharray)) {
											var isValid = true;
											_.each(style.strokeDasharray, function(item, key) {
												if (!new RegExp('^[0-9]*[0-9][0-9]*$').test(item)) {
													isValid = false;
												}
											});
											return isValid;
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
							return false;
						}
					} else {
						return true;
					}
				} else {
					return false;
				}
			}
		},
		// 行政区域填充的样式，请严格按照对象中的参数传递
		fillStyle: {
			type: Object,
			required: false,
			default: function() {
				var obj = {
					isShow: true, // 表示是否需要绘制行政区的填充色，不绘制的话可以直接传false，下面的属性也不会再验证
					style: {
						fillColor: '#80d8ff', // 填充的颜色，值为十六进制颜色码
						fillOpacity: 0.4, // 填充色的透明度，值为0~1之间最多保留两位小数的浮点数，包括0和1
						hoverOpcity: 0.8 // 鼠标悬浮上去之后的填充色透明度，值为0~1之间最多保留两位小数的浮点数，包括0和1
					}
				};
				return obj;
			},
			validator(obj) {
				if (obj.hasOwnProperty('isShow') || typeof obj.isShow !== 'boolean') {
					if (obj.isShow === true) {
						if (obj.hasOwnProperty('style')) {
							var style = obj.style;
							if (
								style.hasOwnProperty('fillColor') &&
								style.hasOwnProperty('fillOpacity') &&
								style.hasOwnProperty('hoverOpcity')
							) {
								if (
									new RegExp('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$').test(style.fillColor) &&
									new RegExp('^(0(\.\d{1,2})?|1(\.0{1,2})?)$').test(style.fillOpacity) &&
									new RegExp('^(0(\.\d{1,2})?|1(\.0{1,2})?)$').test(style.hoverOpcity)
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
						return true;
					}
				} else {
					return false;
				}
			}
		},
		// 接下来就是考虑是否要传入的悬浮窗口html了，动态数据该怎么实现
		windowHtml: {}
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
				zoom: self.mapzoom
			});

			if (self.mapstyle !== '' && self.mapstyle !== null && self.mapstyle !== undefined) {
				self.AMap.setMapStyle(self.mapstyle);
			}

			self.drawArea();
		},
		// 绘制不同行政区域
		drawArea() {
			var self = this;

			var district = null;
			var polygons = [];
			// 需要加载行政区划插件
			// https://webapi.amap.com/maps?key=a3905d3985de06d3cf69aa47435a96f8&v=1.4.15&plugin=Map3D,AMap.DistrictSearch
			// 在
			// 实例化DistrictSearch
			var opts = {
				showbiz: false,
				// 是否显示商圈，没有什么大影响，默认是true，本组件保留功能，但是默认不显示
				level: 'country',
				// 查询行政级别为 country province city district 区县为最后一级，返回street街道但是arcode不再更新，最后画的级别只能到district
				// 若有特殊需求要查询商圈之类，可详细查询高德官方文档，本组件保留功能，但是默认不查询
				extensions: 'all',
				// 是否返回行政区边界坐标点，默认base不返回行政区边界坐标点，all返回行政区边界坐标组等具体信息
				subdistrict: 0
				// 显示下级行政区级数，0：不返回下级行政区；默认1：返回下一级行政区；2：返回下两级行政区；3：返回下三级行政区；
			};
			district = new AMap.DistrictSearch(opts);
			//行政区查询
			district.setLevel('district');
			district.setSubdistrict(1);
			district.search('340503', function(status, result) {
				// console.log(result.districtList);
				self.AMap.remove(polygons); //清除上次结果
				polygons = [];
				var bounds = result.districtList[0].boundaries;
				if (bounds) {
					for (var i = 0, l = bounds.length; i < l; i++) {
						//生成行政区划polygon
						var polygon = new AMap.Polygon({
							strokeWeight: 1,
							path: bounds[i],
							fillOpacity: 0.4,
							fillColor: '#80d8ff',
							strokeColor: '#0091ea'
						});
						polygon.on('mouseover', function() {
							polygon.setOptions({
								fillOpacity: 0.8
							});
						});
						polygon.on('mouseout', function() {
							polygon.setOptions({
								fillOpacity: 0.4
							});
						});
						polygons.push(polygon);
					}
				}
				self.AMap.add(polygons);
				self.AMap.setFitView(polygons); //视口自适应
			});
		},
		// 显示当前组件源码，提取源码请自行删除该部分相关代码
		showCode() {
			this.$router.push({
				path: '/code',
				query: {
					code: 'SplitAreaCode'
				}
			});
		},
		// 显示当前组件文档，提取源码请自行删除该部分相关代码
		showDoc() {
			this.$router.push({
				path: '/doc',
				query: {
					code: 'SplitAreaDoc'
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
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
	color: @green;
	#map-container {
		width: 100%;
		height: 100%;
		position: relative;
	}
}
</style>
