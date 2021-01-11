<template>
	<div class="doc-box">
		<div class="doc-title">{{ docData.description }}</div>
		<el-table :data="docData.Attributes" v-if="docData.Attributes.length > 0" border class="doc-table">
			<el-table-column prop="param" label="参数"></el-table-column>
			<el-table-column prop="descrbition" label="说明"></el-table-column>
			<el-table-column prop="type" label="类型"></el-table-column>
			<el-table-column prop="chooseValue" label="可选值"></el-table-column>
			<el-table-column prop="defaultValue" label="默认值"></el-table-column>
		</el-table>
		<el-table :data="docData.Events" v-if="docData.Events.length > 0" border class="doc-table">
			<el-table-column prop="events" label="事件名"></el-table-column>
			<el-table-column prop="events" label="说明"></el-table-column>
			<el-table-column prop="events" label="参数"></el-table-column>
		</el-table>
		<el-table :data="docData.Methods" v-if="docData.Methods.length > 0" border class="doc-table">
			<el-table-column prop="methods" label="方法名"></el-table-column>
			<el-table-column prop="methods" label="说明"></el-table-column>
			<el-table-column prop="methods" label="参数"></el-table-column>
		</el-table>
		<el-table :data="docData.Slot" v-if="docData.Slot.length > 0" border class="doc-table">
			<el-table-column prop="slot" label="插槽名"></el-table-column>
			<el-table-column prop="slot" label="说明"></el-table-column>
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
.doc-box {
	width: 1280px;
	height: 100%;
	margin: 0 auto;
	.doc-title {
		width: 100%;
		height: 80px;
		line-height: 80px;
		text-align: center;
		font-size: 28px;
		.ban-user-select();
	}
	.doc-table {
		width: 100%;
		margin-bottom: 50px;
	}
}
</style>
