const MapCanvasCode =
	"<!-- @name: MapCanvas -->\n<!-- @author: fx67ll -->\n<!-- @version: 1.0.1-->\n<!-- @description：基于高德地图的自定义绘制封装组件，请在项目中安装underscore，需要在引入高德地图api，格式：https://webapi.amap.com/maps?key=你的秘钥&v=1.4.15 -->\n<!-- @bug: 目前已知bug是缩小到世界地图返回用自定义工具绘制，然后放大会导致之前的绘制全部消失 -->\n<!-- @update: 2020年9月25日-v1.0.0，完成1.0.0开发 -->\n<!-- @update: 2021年1月6日-v1.0.1，修改部分注释，并补充mapcenter只能传int的正则验证，因为该工具使用场景限定在2D模式下使用，高德官方规定2D的缩放只有int是有效的-->\n<!-- @update: 2021年1月7日-v1.0.2，添加文档查看功能-->\n\n<template>\n\t<div class=\"map\">\n\t\t<div class=\"tool-container\">\n\t\t\t<div v-show=\"this.tooltype === 'custom'\" @click=\"checkArea\">\n\t\t\t\t<span v-show=\"this.isCheckArea === false\">确定绘制区域</span>\n\t\t\t\t<span v-show=\"this.isCheckArea === true\">重新确定绘制区域</span>\n\t\t\t</div>\n\t\t\t<div v-show=\"this.isCheckArea === true && this.pathArr.length > 2 && this.tooltype === 'custom'\" @click=\"drawArea\">将线段绘制成闭合区域</div>\n\t\t\t<div v-show=\"this.tooltype === 'gaode'\" @click=\"draw('line')\">绘制线段</div>\n\t\t\t<div @click=\"cancel\">撤销</div>\n\t\t\t<div v-show=\"this.isDrawTestArea === false\" @click=\"drawTest\">绘制演示图形</div>\n\t\t\t<div @click=\"showCode\">查看代码</div>\n\t\t\t<div @click=\"showDoc\">查看文档</div>\n\t\t</div>\n\t\t<div id=\"map-container\" ref=\"map\"></div>\n\t</div>\n</template>\n\n<script>\nimport _ from 'underscore';\n\nexport default {\n\tname: 'MapCanvas',\n\tdata() {\n\t\treturn {\n\t\t\tisCheckArea: false, // 用于自定义画板锁定当前地图的判断变量\n\t\t\tisDrawTestArea: false, // 只允许绘制一次演示图形\n\t\t\tAMap: null, // 地图对象\n\t\t\tCanvas: null, // 画板对象\n\t\t\tCanvasContext: null, // 画板实例对象\n\t\t\tpathArr: [], // 经纬度坐标对象集合,\n\t\t\tCanvasSize: [], // 画板对象坐标数组\n\t\t\t// 测试用数据，非必要参数\n\t\t\ttestData: [\n\t\t\t\t{\n\t\t\t\t\tx: 118.739314,\n\t\t\t\t\ty: 32.041765\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\tx: 118.806605,\n\t\t\t\t\ty: 32.036963\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\tx: 118.827977,\n\t\t\t\t\ty: 32.018335\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\tx: 118.838878,\n\t\t\t\t\ty: 32.002251\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\tx: 118.804546,\n\t\t\t\t\ty: 31.989876\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\tx: 118.776736,\n\t\t\t\t\ty: 31.988784\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\tx: 118.75236,\n\t\t\t\t\ty: 31.994389\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\tx: 118.739829,\n\t\t\t\t\ty: 32.005817\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\tx: 118.743863,\n\t\t\t\t\ty: 32.032307\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\tx: 118.717599,\n\t\t\t\t\ty: 32.032962\n\t\t\t\t}\n\t\t\t]\n\t\t};\n\t},\n\tprops: {\n\t\t// 选择使用自定义工具或高德官方工具\n\t\ttooltype: {\n\t\t\ttype: String,\n\t\t\trequired: false,\n\t\t\tdefault: 'custom',\n\t\t\tvalidator(value) {\n\t\t\t\treturn value === 'custom' || value === 'gaode';\n\t\t\t}\n\t\t},\n\t\t// 地图的发布样式，需要遵守高德官方格式\n\t\tmapstyle: {\n\t\t\ttype: String,\n\t\t\trequired: false,\n\t\t\tvalidator(value) {\n\t\t\t\treturn value.substring(0, 6) === 'amap://';\n\t\t\t}\n\t\t},\n\t\t// 地图中心点，保留6位小数的经纬度数组\n\t\tmapcenter: {\n\t\t\ttype: Array,\n\t\t\trequired: false,\n\t\t\tdefault: function() {\n\t\t\t\tvar arr = [118.779611, 32.016625];\n\t\t\t\treturn arr;\n\t\t\t},\n\t\t\tvalidator(arr) {\n\t\t\t\tvar lngreg = new RegExp('^-?((0|1?[0-7]?[0-9]?)(([.][0-9]{1,6})?)|180(([.][0]{1,6})?))$');\n\t\t\t\tvar latreg = new RegExp('^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,6})?)|90(([.][0]{1,6})?))$');\n\t\t\t\tif (lngreg.test(arr[0]) && latreg.test(arr[1])) {\n\t\t\t\t\treturn true;\n\t\t\t\t} else {\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t// 地图的初始化缩放比例\n\t\tmapzoom: {\n\t\t\ttype: Number,\n\t\t\trequired: false,\n\t\t\tdefault: 13,\n\t\t\tvalidator(num) {\n\t\t\t\tvar intreg = new RegExp('^[0-9]*[1-9][0-9]*$');\n\t\t\t\tif(intreg.test(num)){\n\t\t\t\t\treturn num > 2 && num < 19;\n\t\t\t\t} else {\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t// 线条的宽度\n\t\tstrokeWidth: {\n\t\t\ttype: Number,\n\t\t\trequired: false,\n\t\t\tdefault: 10,\n\t\t\tvalidator(num) {\n\t\t\t\treturn typeof num === 'number';\n\t\t\t}\n\t\t},\n\t\t// 线条的颜色\n\t\tstrokeColor: {\n\t\t\ttype: Array,\n\t\t\trequired: false,\n\t\t\tdefault: function() {\n\t\t\t\tvar arr = [\n\t\t\t\t\t{\n\t\t\t\t\t\topacityPos: 0, // 如果只想用一种颜色，那可以去用高德自带的画图工具，没有必要使用自定义的canvas画图工具\n\t\t\t\t\t\tstrokeCo: '#ffff00'\n\t\t\t\t\t},\n\t\t\t\t\t{\n\t\t\t\t\t\topacityPos: 0.2,\n\t\t\t\t\t\tstrokeCo: '#55ff00'\n\t\t\t\t\t},\n\t\t\t\t\t{\n\t\t\t\t\t\topacityPos: 0.4,\n\t\t\t\t\t\tstrokeCo: '#ff5500'\n\t\t\t\t\t},\n\t\t\t\t\t{\n\t\t\t\t\t\topacityPos: 0.6,\n\t\t\t\t\t\tstrokeCo: '#ff0000'\n\t\t\t\t\t},\n\t\t\t\t\t{\n\t\t\t\t\t\topacityPos: 0.8,\n\t\t\t\t\t\tstrokeCo: '#5500ff'\n\t\t\t\t\t},\n\t\t\t\t\t{\n\t\t\t\t\t\topacityPos: 1,\n\t\t\t\t\t\tstrokeCo: '#00FFFF'\n\t\t\t\t\t}\n\t\t\t\t];\n\t\t\t\treturn arr;\n\t\t\t},\n\t\t\tvalidator(arr) {\n\t\t\t\tvar vaildNum = 0;\n\t\t\t\tif (arr.length > 0) {\n\t\t\t\t\t_.each(arr, function(item, key) {\n\t\t\t\t\t\tif (item.hasOwnProperty('opacityPos') && item.hasOwnProperty('strokeCo')) {\n\t\t\t\t\t\t\tif (new RegExp('^[0-1]{1}(.{1,2})?$').test(item.opacityPos)) {\n\t\t\t\t\t\t\t\tif (new RegExp('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$').test(item.strokeCo)) {\n\t\t\t\t\t\t\t\t\tvaildNum = vaildNum + 1;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t\tif (vaildNum === arr.length) {\n\t\t\t\t\treturn true;\n\t\t\t\t} else {\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t// 阴影样式\n\t\tshadowStyle: {\n\t\t\ttype: Object,\n\t\t\trequired: false,\n\t\t\tdefault: function() {\n\t\t\t\tvar obj = {\n\t\t\t\t\tshadowColor: '#D3D3D3',\n\t\t\t\t\tshadowBlur: 5,\n\t\t\t\t\tshadowOffsetX: 20,\n\t\t\t\t\tshadowOffsetY: 20\n\t\t\t\t};\n\t\t\t\treturn obj;\n\t\t\t},\n\t\t\tvalidator(obj) {\n\t\t\t\tif (obj.hasOwnProperty('shadowColor') && obj.hasOwnProperty('shadowBlur') && obj.hasOwnProperty('shadowOffsetX') && obj.hasOwnProperty('shadowOffsetY')) {\n\t\t\t\t\tif (new RegExp('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$').test(obj.shadowColor)) {\n\t\t\t\t\t\tif (typeof obj.shadowBlur === 'number' && typeof obj.shadowOffsetX === 'number' && typeof obj.shadowOffsetY === 'number') {\n\t\t\t\t\t\t\treturn true;\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t}\n\t\t\t\t\t} else {\n\t\t\t\t\t\treturn false;\n\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t// 多边形的填充颜色，从这里继续写参数\n\t\tfillStyle: {\n\t\t\ttype: Object,\n\t\t\trequired: false,\n\t\t\tdefault: function() {\n\t\t\t\tvar obj = {\n\t\t\t\t\tisFill: true, // 默认填充，不填充的话可以直接传false，下面的属性也不会再验证\n\t\t\t\t\tfillColor: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\topacityPos: 0,\n\t\t\t\t\t\t\tfillCo: '#aaff7f'\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\topacityPos: 0.2,\n\t\t\t\t\t\t\tfillCo: '#aaffff'\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\topacityPos: 0.4,\n\t\t\t\t\t\t\tfillCo: '#ffff7f'\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\topacityPos: 0.6,\n\t\t\t\t\t\t\tfillCo: '#ffaa7f'\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\topacityPos: 0.8,\n\t\t\t\t\t\t\tfillCo: '#aaaa7f'\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\topacityPos: 1,\n\t\t\t\t\t\t\tfillCo: '#ffaaff'\n\t\t\t\t\t\t}\n\t\t\t\t\t],\n\t\t\t\t\tgradientDirection: 'right-bottom' //可选值: left-top left-bottom right-top right-bottom middle-border border-middle top-bottom bottom-top left-right right-left\n\t\t\t\t};\n\t\t\t\treturn obj;\n\t\t\t},\n\t\t\tvalidator(obj) {\n\t\t\t\tif (obj.hasOwnProperty('isFill') || typeof obj.isFill !== boolean) {\n\t\t\t\t\tif (obj.isFill === true) {\n\t\t\t\t\t\tif (obj.hasOwnProperty('fillColor')) {\n\t\t\t\t\t\t\tvar vaildNum = 0;\n\t\t\t\t\t\t\tif (obj.fillColor.length > 0) {\n\t\t\t\t\t\t\t\t_.each(obj.fillColor, function(item, key) {\n\t\t\t\t\t\t\t\t\tif (item.hasOwnProperty('opacityPos') && item.hasOwnProperty('fillCo')) {\n\t\t\t\t\t\t\t\t\t\tif (new RegExp('^[0-1]{1}(.{1,2})?$').test(item.opacityPos)) {\n\t\t\t\t\t\t\t\t\t\t\tif (new RegExp('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$').test(item.fillCo)) {\n\t\t\t\t\t\t\t\t\t\t\t\tvaildNum = vaildNum + 1;\n\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tif (vaildNum === obj.fillColor.length) {\n\t\t\t\t\t\t\t\tif (obj.hasOwnProperty('gradientDirection')) {\n\t\t\t\t\t\t\t\t\tif (\n\t\t\t\t\t\t\t\t\t\tobj.gradientDirection === 'left-top' ||\n\t\t\t\t\t\t\t\t\t\tobj.gradientDirection === 'left-bottom' ||\n\t\t\t\t\t\t\t\t\t\tobj.gradientDirection === 'right-top' ||\n\t\t\t\t\t\t\t\t\t\tobj.gradientDirection === 'right-bottom' ||\n\t\t\t\t\t\t\t\t\t\tobj.gradientDirection === 'middle-border' ||\n\t\t\t\t\t\t\t\t\t\tobj.gradientDirection === 'border-middle' ||\n\t\t\t\t\t\t\t\t\t\tobj.gradientDirection === 'top-bottom' ||\n\t\t\t\t\t\t\t\t\t\tobj.gradientDirection === 'bottom-top' ||\n\t\t\t\t\t\t\t\t\t\tobj.gradientDirection === 'left-right' ||\n\t\t\t\t\t\t\t\t\t\tobj.gradientDirection === 'right-left'\n\t\t\t\t\t\t\t\t\t) {\n\t\t\t\t\t\t\t\t\t\treturn true;\n\t\t\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t}\n\t\t\t\t\t} else {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t},\n\tmounted() {\n\t\tthis.mapInit();\n\t},\n\tmethods: {\n\t\t// 初始化地图\n\t\tmapInit() {\n\t\t\tvar self = this;\n\t\t\tself.AMap = new AMap.Map('map-container', {\n\t\t\t\tcenter: self.mapcenter,\n\t\t\t\tzoom: self.mapzoom,\n\t\t\t\tshowIndoorMap: false // 禁止显示室内地图，否则在画完自定义canvas之后继续放大会有无法加载室内的地图的错误导致图层消失\n\t\t\t});\n\n\t\t\tif (self.mapstyle !== '' && self.mapstyle !== null && self.mapstyle !== undefined) {\n\t\t\t\tself.AMap.setMapStyle(self.mapstyle);\n\t\t\t}\n\n\t\t\tself.AMap.on('click', function(e) {\n\t\t\t\t// 确定绘制区域之后开始收集作画点集合\n\t\t\t\tif (self.isCheckArea === true) {\n\t\t\t\t\tself.initCanvasContext(self.AMap, self.strokeWidth, self.shadowStyle);\n\t\t\t\t\tif (self.pathArr.length !== 0) {\n\t\t\t\t\t\tvar startIndex = self.pathArr.length - 1;\n\t\t\t\t\t}\n\t\t\t\t\tvar posObj = {};\n\t\t\t\t\tposObj.x = e.lnglat.getLng();\n\t\t\t\t\tposObj.y = e.lnglat.getLat();\n\t\t\t\t\t// posObj = e.pixel;\n\t\t\t\t\tself.pathArr.push(posObj);\n\t\t\t\t\tif (self.pathArr.length > 1) {\n\t\t\t\t\t\tvar endIndex = self.pathArr.length - 1;\n\t\t\t\t\t\tself.drawLineByPostion(\n\t\t\t\t\t\t\tself.AMap,\n\t\t\t\t\t\t\tself.CanvasContext,\n\t\t\t\t\t\t\tself.strokeColor,\n\t\t\t\t\t\t\tself.pathArr[startIndex].x,\n\t\t\t\t\t\t\tself.pathArr[startIndex].y,\n\t\t\t\t\t\t\tself.pathArr[endIndex].x,\n\t\t\t\t\t\t\tself.pathArr[endIndex].y\n\t\t\t\t\t\t);\n\t\t\t\t\t\t// self.drawLineByPixel(self.pathArr[startIndex],self.pathArr[endIndex]);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t});\n\t\t},\n\t\t// 初始化canvas画板\n\t\tinitCanvasContext(map, linewidth, shadowstyle) {\n\t\t\tvar canvas = document.createElement('canvas');\n\t\t\tcanvas.classList.add('canvas-new');\n\t\t\tcanvas.width = map.getSize().width;\n\t\t\tcanvas.height = map.getSize().height;\n\t\t\tthis.CanvasSize = [canvas.width, canvas.height];\n\t\t\tvar context = canvas.getContext('2d');\n\t\t\tthis.CanvasContext = context;\n\n\t\t\tcontext.lineWidth = linewidth;\n\t\t\tcontext.lineCap = 'round';\n\t\t\tcontext.lineJoin = 'round';\n\t\t\tcontext.shadowColor = shadowstyle.shadowColor;\n\t\t\tcontext.shadowBlur = shadowstyle.shadowBlur;\n\t\t\tcontext.shadowOffsetX = shadowstyle.shadowOffsetX;\n\t\t\tcontext.shadowOffsetY = shadowstyle.shadowOffsetY;\n\n\t\t\tvar CanvasLayer = new AMap.CanvasLayer({\n\t\t\t\tcanvas: canvas,\n\t\t\t\tbounds: map.getBounds(),\n\t\t\t\tzooms: [3, 18]\n\t\t\t});\n\t\t\t// CanvasLayer.setMap(null); // 传null相当于清除当前页面中画板\n\t\t\tCanvasLayer.setMap(map);\n\t\t},\n\t\t// 根据坐标点集合绘制区域\n\t\t// 坐标集合的数据结构是[{x:0,y:0}]\n\t\tdrawByPath(map, context, path) {\n\t\t\tvar self = this;\n\t\t\tcontext.beginPath();\n\t\t\tvar startpixel = map.lnglatTocontainer(new AMap.LngLat(path[0].x, path[0].y));\n\t\t\tcontext.moveTo(startpixel.x, startpixel.y);\n\t\t\t_.each(path, function(item, key) {\n\t\t\t\tif (key !== 0) {\n\t\t\t\t\tvar pixel = map.lnglatTocontainer(new AMap.LngLat(item.x, item.y));\n\t\t\t\t\tcontext.lineTo(pixel.x, pixel.y);\n\t\t\t\t\tself.handleStrokeGadient(context, self.strokeColor, startpixel, pixel);\n\t\t\t\t\tcontext.stroke();\n\t\t\t\t}\n\t\t\t});\n\t\t\tcontext.closePath();\n\t\t\tself.handleFillGadient(context, self.fillStyle);\n\t\t\tcontext.stroke();\n\t\t},\n\t\tdrawTest() {\n\t\t\tvar testData = this.testData;\n\t\t\tthis.drawTestArea(testData);\n\t\t},\n\t\t// 创建演示用的区域图形\n\t\tdrawTestArea(testData) {\n\t\t\tvar self = this;\n\t\t\tthis.isDrawTestArea = true;\n\t\t\tself.initCanvasContext(self.AMap, self.strokeWidth, self.shadowStyle);\n\t\t\t_.each(testData, function(item, key) {\n\t\t\t\tif (key !== testData.length - 1) {\n\t\t\t\t\tself.drawLineByPostion(self.AMap, self.CanvasContext, self.strokeColor, testData[key].x, testData[key].y, testData[key + 1].x, testData[key + 1].y);\n\t\t\t\t}\n\t\t\t});\n\t\t\tself.drawByPath(self.AMap, self.CanvasContext, testData);\n\t\t},\n\t\t// 处理线渐变\n\t\thandleStrokeGadient(context, strokecolor, startpixel, endpixel) {\n\t\t\tvar gradient = context.createLinearGradient(startpixel.x, startpixel.y, endpixel.x, endpixel.y); //线性渐变的起止坐标\n\t\t\t_.each(strokecolor, function(item, key) {\n\t\t\t\t// 创建渐变的开始颜色，0表示偏移量，个人理解为直线上的相对位置，最大为1，一个渐变中可以写任意个渐变颜色\n\t\t\t\tgradient.addColorStop(item.opacityPos, item.strokeCo);\n\t\t\t});\n\t\t\tcontext.strokeStyle = gradient;\n\t\t},\n\t\t// 处理填充渐变\n\t\t// fillstyle填充样式对象\n\t\thandleFillGadient(context, fillstyle) {\n\t\t\tvar self = this;\n\t\t\tif (fillstyle.isFill === true) {\n\t\t\t\tvar tl = { x: 0, y: 0 };\n\t\t\t\tvar tr = { x: self.CanvasSize[0], y: 0 };\n\t\t\t\tvar bl = { x: 0, y: self.CanvasSize[1] };\n\t\t\t\tvar br = { x: self.CanvasSize[0], y: self.CanvasSize[1] };\n\t\t\t\tvar gradient = null;\n\t\t\t\tif (fillstyle.gradientDirection === 'left-top') {\n\t\t\t\t\tgradient = context.createLinearGradient(br.x, br.y, tl.x, tl.y);\n\t\t\t\t}\n\t\t\t\tif (fillstyle.gradientDirection === 'left-bottom') {\n\t\t\t\t\tgradient = context.createLinearGradient(tr.x, tr.y, bl.x, bl.y);\n\t\t\t\t}\n\t\t\t\tif (fillstyle.gradientDirection === 'right-top') {\n\t\t\t\t\tgradient = context.createLinearGradient(bl.x, bl.y, tr.x, tr.y);\n\t\t\t\t}\n\t\t\t\tif (fillstyle.gradientDirection === 'right-bottom') {\n\t\t\t\t\tgradient = context.createLinearGradient(tl.x, tl.y, br.x, br.y);\n\t\t\t\t}\n\t\t\t\t// 径向渐变待开发\n\t\t\t\t// if (fillstyle.gradientDirection === 'middle-border') {\n\t\t\t\t// \tgradient = context.createLinearGradient(br.x, br.y, tl.x, tl.y);\n\t\t\t\t// }\n\t\t\t\t// if (fillstyle.gradientDirection === 'border-middle') {\n\t\t\t\t// \tgradient = context.createLinearGradient(br.x, br.y, tl.x, tl.y);\n\t\t\t\t// }\n\t\t\t\tif (fillstyle.gradientDirection === 'top-bottom') {\n\t\t\t\t\tgradient = context.createLinearGradient(tl.x, tl.y, bl.x, bl.y);\n\t\t\t\t}\n\t\t\t\tif (fillstyle.gradientDirection === 'bottom-top') {\n\t\t\t\t\tgradient = context.createLinearGradient(bl.x, bl.y, tl.x, tl.y);\n\t\t\t\t}\n\t\t\t\tif (fillstyle.gradientDirection === 'left-right') {\n\t\t\t\t\tgradient = context.createLinearGradient(tl.x, tl.y, tr.x, tr.y);\n\t\t\t\t}\n\t\t\t\tif (fillstyle.gradientDirection === 'right-left') {\n\t\t\t\t\tgradient = context.createLinearGradient(tr.x, tr.y, tl.x, tl.y);\n\t\t\t\t}\n\t\t\t\t_.each(fillstyle.fillColor, function(item, key) {\n\t\t\t\t\t// 创建渐变的开始颜色，0表示偏移量，个人理解为直线上的相对位置，最大为1，一个渐变中可以写任意个渐变颜色\n\t\t\t\t\tgradient.addColorStop(item.opacityPos, item.fillCo);\n\t\t\t\t});\n\t\t\t\tcontext.fillStyle = gradient;\n\t\t\t\tcontext.fill(); // 先填充再画边框，否则会导致填充的时候遮盖边框\n\t\t\t} else {\n\t\t\t\tcontext.fillStyle = '';\n\t\t\t\tcontext.fill(); // 先填充再画边框，否则会导致填充的时候遮盖边框\n\t\t\t}\n\t\t},\n\t\t// 根据容器内的像素坐标绘制线\n\t\t// startpixel起点对象{x:0,y:0} endpixel终点对象{x:0,y:0}\n\t\t// 暂时放弃维护的废弃方法\n\t\tdrawLineByPixel(startpixel, endpixel) {\n\t\t\tthis.CanvasContext.moveTo(startpixel.x, startpixel.y);\n\t\t\tthis.CanvasContext.lineTo(endpixel.x, endpixel.y);\n\t\t\tvar gradient = this.CanvasContext.createLinearGradient(startpixel.x, startpixel.y, endpixel.x, endpixel.y);\n\t\t\tgradient.addColorStop(0, 'DeepSkyBlue'); // 创建渐变的开始颜色，0表示偏移量，个人理解为直线上的相对位置，最大为1，一个渐变中可以写任意个渐变颜色\n\t\t\tgradient.addColorStop(1, 'Cyan');\n\t\t\tthis.CanvasContext.strokeStyle = gradient;\n\t\t\tthis.CanvasContext.stroke();\n\t\t},\n\t\t// 根据容器内的经纬度坐标绘制线\n\t\t// 地图对象 画板实例对象 线的颜色数组 起点经度 起点纬度 终点经度 终点纬度\n\t\tdrawLineByPostion(map, context, strokecolor, startlng, startlat, endlng, endlat) {\n\t\t\tcontext.fillStyle = '';\n\t\t\tvar pixel1 = map.lnglatTocontainer(new AMap.LngLat(startlng, startlat));\n\t\t\tvar pixel2 = map.lnglatTocontainer(new AMap.LngLat(endlng, endlat));\n\t\t\tcontext.moveTo(pixel1.x, pixel1.y);\n\t\t\tcontext.lineTo(pixel2.x, pixel2.y);\n\t\t\tthis.handleStrokeGadient(context, strokecolor, pixel1, pixel2);\n\t\t\tcontext.stroke();\n\t\t},\n\t\t// 自定义工具有天然缺陷，canvas图层未解决如何随地图自动放大缩小\n\t\tcheckArea() {\n\t\t\tvar self = this;\n\t\t\tself.pathArr = [];\n\t\t\t// self.strokeWidth = 10 * (self.AMap.getZoom() / 18);\n\t\t\tself.isCheckArea = !self.isCheckArea;\n\t\t\tif (self.isCheckArea === true) {\n\t\t\t\tself.AMap.setStatus({\n\t\t\t\t\tresizeEnable: false,\n\t\t\t\t\tdragEnable: false,\n\t\t\t\t\tkeyboardEnable: false,\n\t\t\t\t\tdoubleClickZoom: false,\n\t\t\t\t\tzoomEnable: false,\n\t\t\t\t\trotateEnable: false\n\t\t\t\t});\n\t\t\t}\n\t\t\tif (self.isCheckArea === false) {\n\t\t\t\tself.AMap.setStatus({\n\t\t\t\t\tdragEnable: true,\n\t\t\t\t\tzoomEnable: true\n\t\t\t\t});\n\t\t\t}\n\t\t},\n\t\t// 绘制区域\n\t\tdrawArea() {\n\t\t\tvar self = this;\n\t\t\tself.drawByPath(self.AMap, self.CanvasContext, self.pathArr);\n\t\t},\n\t\t// 绘制\n\t\tdraw(val) {\n\t\t\tvar self = this;\n\t\t\tvar mouseTool = new AMap.MouseTool(self.AMap);\n\t\t\tmouseTool.polyline({\n\t\t\t\tstrokeColor: '#ff0000',\n\t\t\t\tstrokeOpacity: 1,\n\t\t\t\tstrokeWeight: 10,\n\t\t\t\tstrokeStyle: 'solid'\n\t\t\t});\n\t\t\tmouseTool.on('draw', event => {\n\t\t\t\tvar path = event.obj.getPath();\n\t\t\t\t// console.log(path);\n\t\t\t});\n\t\t},\n\t\t// 退出当前绘制区域\n\t\tcancel() {\n\t\t\tthis.isDrawTestArea = false;\n\t\t\tthis.mapInit();\n\t\t\tthis.pathArr = [];\n\t\t},\n\t\t// 显示当前组件源码，提取源码请自行删除该部分相关代码\n\t\tshowCode() {\n\t\t\tthis.$router.push({\n\t\t\t\tpath: '/code',\n\t\t\t\tquery: {\n\t\t\t\t\tcode: 'MapCanvasCode'\n\t\t\t\t}\n\t\t\t});\n\t\t},\n\t\t// 显示当前组件文档，提取源码请自行删除该部分相关代码\n\t\tshowDoc() {\n\t\t\tthis.$router.push({\n\t\t\t\tpath: '/doc',\n\t\t\t\tquery: {\n\t\t\t\t\tcode: 'MapCanvasDoc'\n\t\t\t\t}\n\t\t\t});\n\t\t},\n\t}\n};\n</script>\n\n<style lang=\"less\" scoped>\n/deep/ .canvas-new {\n\t// border: 1px solid red !important;\n}\n\n.ban-user-select {\n\t-webkit-touch-callout: none; /* iOS Safari */\n\t-webkit-user-select: none; /* Chrome/Safari/Opera */\n\t-khtml-user-select: none; /* Konqueror */\n\t-moz-user-select: none; /* Firefox */\n\t-ms-user-select: none; /* Internet Explorer/Edge */\n\tuser-select: none; /* Non-prefixed version, currently not supported by any browser */\n}\n\n.map {\n\twidth: 100%;\n\theight: 100%;\n\tposition: relative;\n\tcolor: #42b983;\n\t#map-container {\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\tposition: relative;\n\t}\n\t.tool-container {\n\t\tposition: absolute;\n\t\ttop: 20px;\n\t\tleft: 30px;\n\t\tz-index: 1000;\n\t\tborder: 1px solid #42b983;\n\t\tbox-shadow: 1px 1px 5px #f8f8f8;\n\t\tdiv {\n\t\t\tcursor: pointer;\n\t\t\tpadding: 4px;\n\t\t\tborder: 1px solid #42b983;\n\t\t\t.ban-user-select();\n\t\t}\n\t\tdiv:hover {\n\t\t\tbackground-color: #42b983;\n\t\t\tcolor: #ffffff;\n\t\t}\n\t}\n}\n</style>\n";

export default MapCanvasCode;
