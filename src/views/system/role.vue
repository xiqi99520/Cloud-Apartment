<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="roleName" label="名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="remark" label="描述" width="300" sortable>
			</el-table-column>
			<el-table-column prop="createDate" label="创建时间" width="200" :formatter="format" sortable>
			</el-table-column>
			<el-table-column prop="status" label="状态" min-width="100" :formatter="formatter" sortable>
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button v-if="!scope.row.status" type="warning" size="small" @click="toggle(scope.$index, scope.row)">禁用</el-button>
					<el-button v-if="scope.row.status" type="primary" size="small" @click="toggle(scope.$index, scope.row)">启用</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="roleName">
					<el-input v-model="editForm.roleName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="remark">
					<el-input v-model="editForm.remark" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="菜单" prop="authority">
					<div class="menuAll">
				    	<div v-for="(item,index) in menuList">
				    		<div>{{ item.resourceName }}</div>
							<el-checkbox-group v-model="checkedManages" @change="handleCheckedManagesChange">
								<el-checkbox v-for="subMenu in item.resources" :label="subMenu.id" :key="subMenu.id">{{ subMenu.resourceName }}</el-checkbox>
							</el-checkbox-group>
				    	</div>
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>


		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="roleName">
					<el-input v-model="addForm.roleName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="remark">
					<el-input v-model="addForm.remark" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="菜单" prop="authority">
				    <div class="menuAll">
				    	<div v-for="(item,index) in menuList">
				    		<div>{{ item.resourceName }}</div>
							<el-checkbox-group v-model="addCheckedManages" @change="handleCheckedManagesChange">
								<el-checkbox v-for="subMenu in item.resources" :label="subMenu.id" :key="subMenu.id">{{ subMenu.resourceName }}</el-checkbox>
							</el-checkbox-group>
				    	</div>
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import { getUserListPage, removeRole, batchRemoveRole, editRole, addRole, getRoleList, toggleFunc, getAuthorityList, getCurInfo } from '../../api/api';
	const cityOptions = ['上海', '北京', '广州', '深圳'];
	export default {
		data() {
			return {
				checkAll: false,
				addCheckedManages: [],
		        checkedManages: [],
		        cities: cityOptions,
		        isIndeterminate: true,
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				addFormVisible: false,//新增界面是否显示
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					roleName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					remark: [
						{ required: true, message: '请输入描述内容', trigger: 'blur' }
					],
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: '',
					remark: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					roleName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					remark: [
						{ required: true, message: '请输入描述内容', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: '',
					remark: ''
				},
				menuList: [],
				choicedMenu: ''
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			handleCheckAllChange(val) {
		        this.checkedManages = val ? cityOptions : [];
		        this.isIndeterminate = false;
		      },
	     	handleCheckedManagesChange(value) {
		        this.choicedMenu = value.join();
		    },
			//获取用户列表
			getUsers() {
				let para = {
					type: 1
				};
				this.listLoading = true;
				getRoleList(para).then((res) => {
					util.across(this, res);
					this.users.length = 0;
					this.total = res.data.total;
					res.data.rows.map(item => {
						this.users.push(item);
					})
					this.listLoading = false;
				});
			},
			//获取所有菜单信息
			getAllAuthority() {
				this.listLoading = true;
				getAuthorityList().then((res) => {
					util.across(this, res);
					this.menuList = res.data;
					this.listLoading = false;
				});
			},
			formatter(val){
				return val.status ? '禁用' : '正常';
			},
			format(data){
				if(!data.createDate) return data.createDate;
				return new Date(data.createDate).format("yyyy-MM-dd hh:mm:ss");
			},
			disabled(row){
				let _this = this;
				_this.listLoading = true;
				let para = { 
					id: row.id,
					status: row.status == 0 ? 1 : 0
				};
				toggleFunc(para).then((res) => {
					util.across(this, res);
					_this.listLoading = false;
					_this.$message({
						message: res.slide_msg_message_key,
						type: 'success'
					});
					this.getUsers();
				});
			},
			toggle(index, row){
				if(row.status != 1){
					this.$confirm('确认禁用该管理员吗?', '提示', {
						type: 'warning'
					}).then(() => {
						this.disabled(row);
					}).catch(() => {

					});
				} else {
					this.disabled(row);
				}
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					removeRole(para).then((res) => {
						util.across(this, res);
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				let para = {
					id: row.id,
				}
				getCurInfo(para).then((res) => {
					util.across(this, res);
					this.editForm.roleName = res.entity.roleName;
					this.editForm.remark = res.entity.remark;
					this.editForm.id = res.entity.id;
					this.checkedManages.length = 0;
					res.entity.roleResourceEntities.map(item => {
						this.checkedManages.push(item.resourceId);
					})
					this.editLoading = false;
					this.editFormVisible = true;
				});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let params = Object.assign({}, this.editForm);
							console.log(params);
							let para = {
								id: params.id,
								roleName: params.roleName,
								remark: params.remark,
								resources: this.choicedMenu
							}
							editRole(para).then((res) => {
								util.across(this, res);
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let params = Object.assign({}, this.addForm);
							let para = {
								id: params.id,
								roleName: params.roleName,
								remark: params.remark,
								resources: this.choicedMenu
							}
							addRole(para).then((res) => {
								util.across(this, res);
								this.addLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveRole(para).then((res) => {
						util.across(this, res);
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
			this.getAllAuthority();
		}
	}

</script>

<style>
	.el-table th>.cell, .el-table .cell {
		text-align: center!important;
	}
	.menuAll {
		max-height: 300px;
		overflow: auto;
	}
</style>