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
			<el-table-column prop="realname" label="名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="手机号" width="300" sortable>
			</el-table-column>
			<el-table-column prop="registTime" label="创建时间" width="200" :formatter="format" sortable>
			</el-table-column>
			<el-table-column prop="status" label="状态" min-width="100" :formatter="formatter" sortable>
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
					<el-button size="small" @click="getManageInfo(scope.$index, scope.row)">编辑</el-button>
					<el-button v-if="!scope.row.status" type="warning" size="small" @click="toggle(scope.$index, scope.row)">禁用</el-button>
					<el-button v-if="scope.row.status" type="primary" size="small" @click="toggle(scope.$index, scope.row)">启用</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="realname">
					<el-input v-model="editForm.realname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="mobile">
					<el-input v-model="editForm.mobile" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="editForm.status" @change="handleRadioStatusChange">
						<el-radio :label="1">禁用</el-radio>
					    <el-radio :label="0">启用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="角色权限" prop="authority">
				    <el-checkbox-group v-model="editForm.roleUserEntitys" size="mini" @change="handleRoleListChange">
				      <el-checkbox v-for="item in roleList" :label="item.id" border>{{ item.roleName }}</el-checkbox>
				    </el-checkbox-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="editFormRules" ref="addForm">
				<el-form-item label="姓名" prop="realname">
					<el-input v-model="addForm.realname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="mobile">
					<el-input v-model="addForm.mobile" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="psw">
					<el-input v-model="addForm.psw" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="radio" @change="handleRadioStatusChange">
						<el-radio :label="1">禁用</el-radio>
					    <el-radio :label="0">启用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="角色权限" prop="authority">
				    <el-checkbox-group v-model="checkboxGroup" size="mini" @change="handleRoleListChange">
				      <el-checkbox v-for="item in roleList" :label="item.id" border>{{ item.roleName }}</el-checkbox>
				    </el-checkbox-group>
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
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, getAdminList, toggleFunc, getAuthoritys, getManageInfo } from '../../api/api';
	export default {
		data() {
			return {
				checkboxGroup: [],
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				radio: 0,
				listLoading: false,
				sels: [],//列表选中列
				type1: [],
				addFormVisible: false,//新增界面是否显示
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					realname: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					mobile: [
						{ required: true, message: '请输入手机号', trigger: 'blur' }
					],
					psw: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: '',
					authority: '',
					roleUserEntitys: []
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					radio: [0],
					authority: ''
				},
				roleList: [],
				choicedMenu: [],
				radioStatus: 0,
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			handleRoleListChange(value) {
		        this.choicedMenu = value.join();
		    },
		    handleRadioStatusChange(value){
		    	this.radioStatus = value;
		    },
			//获取用户列表
			getUsers() {
				let para = {
					type: 0
				}; 
				this.listLoading = true;
				getAdminList(para).then((res) => {
					util.across(this, res);
					this.total = res.data.total;
					this.users.length = 0;
					res.data.rows.map(item => {
						this.users.push(item);
					})
					this.listLoading = false;
				});
			},
			getAuthority(){
				this.listLoading = true;
				getAuthoritys().then((res) => {
					util.across(this, res);
					this.roleList.length = 0;
					res.data.map(item => {
						this.roleList.push(item);
					})
					this.listLoading = false;
				});
			},
			//显示编辑界面
			getManageInfo(index, row){
				this.listLoading = true;
				this.editLoading = true;
				let params = {
					id: row.id
				}
				getManageInfo(params).then((res) => {
					util.across(this, res);
					this.editForm.id = res.entity.id;
					this.editForm.mobile = res.entity.mobile;
					this.editForm.realname = res.entity.realname;
					this.editForm.status = res.entity.status;
					this.editLoading = false;
					this.editFormVisible = true;
					this.listLoading = false;
				});
			},
			formatter(val){
				return val.status ? '禁用' : '正常';
			},
			format(data){
				return new Date(data.registTime).format("yyyy-MM-dd hh:mm:ss");
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
					removeUser(para).then((res) => {
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
								realname: params.realname,
								mobile: params.mobile,
								password: params.psw,
								status: this.radioStatus,
								roles: this.choicedMenu
							};
							editUser(para).then((res) => {
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
							console.log(params);
							let para = {
								realname: params.realname,
								mobile: params.mobile,
								password: params.psw,
								status: this.radioStatus,
								roles: this.choicedMenu
							}
							addUser(para).then((res) => {
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
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
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
			}
		},
		mounted() {
			this.getUsers();
			this.getAuthority();
		}
	}

</script>

<style>
	.el-table th>.cell, .el-table .cell {
		text-align: center!important;
	}
</style>