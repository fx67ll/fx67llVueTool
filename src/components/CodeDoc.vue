<template>
	<div class="doc-box">
		<el-table :data="docData" border class="doc-table">
			<el-table-column prop="param" label="参数"></el-table-column>
			<el-table-column prop="descrbition" label="说明"></el-table-column>
			<el-table-column prop="type" label="类型"></el-table-column>
			<el-table-column prop="chooseValue" label="可选值"></el-table-column>
			<el-table-column prop="defaultValue" label="默认值"></el-table-column>
		</el-table>
	</div>
</template>

<script>
import MapCanvasDoc from '@a/file/doc/MapCanvas.js';
export default {
	name: 'codedoc',
	data() {
		return {
			docData: null
		};
	},
	mounted() {
		this.initData();
	},
	methods: {
		initData() {
			var self = this;
			switch (self.$route.query.code) {
				case 'MapCanvasDoc':
					self.docData = MapCanvasDoc;
					break;
				default:
					self.docData = [];
					break;
			}
		}
	}
};
</script>

<style lang="less" scoped="scoped">
	.doc-box{
		width: 100%;
		height: 100%;
		.doc-table{
			width: 1280px;
			margin: 0 auto;
			position: relative;
			top: 25px;
		}
	}
</style>
