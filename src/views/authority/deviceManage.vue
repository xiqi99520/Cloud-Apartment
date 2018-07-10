<template>
	<section v-loading="bindingLoading">
		<div>
			<el-row class="device-title"><div class="grid-content">智能主机</div></el-row>
			<el-row class="device-single">
			  <el-col :span="5">
			  	<div class="grid-content device-icon">
			  		<img :src="hostpic" alt="">
			  	</div>
			  </el-col>
			  <el-col :span="7" v-if="!deviceManageObj['160fa2b44f472711160fa2b44f479601']">
			  	<span>未绑定，<a href="javascript:void(0)" @click="startBinding">请绑定</a></span>
			  </el-col>
			  <el-col :span="19">
			  	<el-col v-if="deviceManageObj['160fa2b44f472711160fa2b44f479601']" class="grid-content pull-right cancelBinding" :span="3" @click.native="delDeviceHost($event)" id="160fa2b44f472711160fa2b44f479601">
			  		<span class="close-area">
			  			<img :src="closepic" alt="">
			  		</span>
			  		<p class="cancel-binding">解绑</p>
			  	</el-col>
			  </el-col>
			</el-row>
			<!--绑定主机-->
			<el-dialog title="绑定智能主机" v-model="bindingVisible" :close-on-click-modal="false">
				<el-row class="main-area">
					<div class="upload">
						<el-button type="primary">上传设备二维码</el-button>
						<input id="file" ref="myFiles" class="hideEle" type="file" name="file" accept="image/jpeg,image/png,image/gif" @change="changeFile">
					</div>
					<el-input class="info-area" placeholder="暂未上传设备二维码" v-model="deviceinfo" :disabled="true"></el-input>
				</el-row>
				<el-button type="success" class="btn-add" @click="uploadFile">添加设备</el-button>
			</el-dialog>
		</div>
		<div>
			<el-row class="device-title"><div class="grid-content">智能门锁</div></el-row>
			<el-row class="device-single">
			  <el-col :span="5">
			  	<div class="grid-content device-icon">
			  		<img :src="doorpic" alt="">
			  	</div>
			  </el-col>
			  <el-col :span="7" v-if="!doorLockStatus || !deviceManageObj['160fa2b44f472711160fa2b44f479601']">
			  	<span>未绑定，<a href="javascript:void(0)" @click="startBindingDoorLock">请绑定</a></span>
			  </el-col>
			  <el-col :span="19">
			  	<el-col v-if="doorLockStatus && deviceManageObj['160fa2b44f472711160fa2b44f479601']" class="grid-content pull-right cancelBinding" :span="3"  @click.native="cancelLock">
			  		<span class="close-area">
			  			<img :src="closepic" alt="">
			  		</span>
			  		<p class="cancel-binding">解绑</p>
			  	</el-col>
			  	<el-col v-if="doorLockStatus && deviceManageObj['160fa2b44f472711160fa2b44f479601']" class="grid-content pull-right cancelBinding" :span="3"  @click.native="openDoorControl">
			  		<span class="close-area">
			  			<img :src="opendoor" alt="">
			  		</span>
			  		<p class="cancel-binding">开门</p>
			  	</el-col>
			  </el-col>
			</el-row>
		</div>
		<div>
			<el-row class="device-title"><div class="grid-content">智能水表</div></el-row>
			<el-row class="device-single">
			  <el-col :span="5">
			  	<div class="grid-content device-icon">
			  		<img :src="watermeterpic" alt="">
			  	</div>
			  </el-col>
			  <el-col :span="7" v-if="!waterMeterStatus || !deviceManageObj['160fa2b44f472711160fa2b44f479601']">
			  	<span>未绑定，<a href="javascript:void(0)" @click="startBindingDoorLock">请绑定</a></span>
			  </el-col>
			  <el-col :span="19">
			  	<el-col v-if="waterMeterStatus && deviceManageObj['160fa2b44f472711160fa2b44f479601']" class="grid-content pull-right cancelBinding" :span="3" @click.native="OneYearRecord">
			  		<span class="close-area">
			  			<img :src="opendoor" alt="">
			  		</span>
			  		<p class="cancel-binding">1年记录</p>
			  	</el-col>
			  	<el-col v-if="waterMeterStatus && deviceManageObj['160fa2b44f472711160fa2b44f479601']" class="grid-content pull-right cancelBinding" :span="3" @click.native="OneMonthRecord">
			  		<span class="close-area">
			  			<img :src="opendoor" alt="">
			  		</span>
			  		<p class="cancel-binding">7天记录</p>
			  	</el-col>
			  	<el-col v-if="waterMeterStatus && deviceManageObj['160fa2b44f472711160fa2b44f479601']" class="grid-content pull-right cancelBinding" :span="3" @click.native="OneDayRecord">
			  		<span class="close-area">
			  			<img :src="opendoor" alt="">
			  		</span>
			  		<p class="cancel-binding">1天记录</p>
			  	</el-col>
			  </el-col>
			</el-row>
		</div>
		<div>
			<el-row class="device-title"><div class="grid-content">智能空开</div></el-row>
			<el-row class="device-single">
			  <el-col :span="5">
			  	<div class="grid-content device-icon">
			  		<img :src="airswitchpic" alt="">
			  	</div>
			  </el-col>
			  <el-col :span="7" v-if="!isBinding">
			  	<span>未绑定，<a href="javascript:void(0)" @click="startBinding">请绑定</a></span>
			  </el-col>
			  <el-col :span="19">
			  	<el-col v-if="isBinding" class="grid-content pull-right" :span="4">
			  		<span class="close-area">
			  			<img :src="closepic" alt="">
			  		</span>
			  		<p class="cancel-binding">解绑</p>
			  	</el-col>
			  </el-col>
			</el-row>
		</div>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, houseRemoveUser, batchRemoveHouse, addHouse, getHouseList, toggleFunc, getBasicInfo, getSign, uploadAction, hostBinding, bindingDevice, getDevices, delHost, delLocalHost, checkOneDayRecord, checkOneMonthRecord, checkOneYearRecord } from '../../api/api';

	export default {
		data() {
			return {
				deviceinfo: '',
				isclick: false,
				isBinding: false,
				bindingVisible: false,
				filters: {
					name: ''
				},
				hostpic: require('../../assets/device/host_nor.png'),
				doorpic: require('../../assets/device/door_nor.png'),
				airswitchpic: require('../../assets/device/airswitch.png'),
				watermeterpic: require('../../assets/device/watermeter.png'),
				closepic: require('../../assets/device/deletedevice.svg'),
				opendoor: require('../../assets/device/opendoor.svg'),
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				editLoading: false,
				bindingLoading: true,
				productObj: {},
				deviceManageObj: {
					'160fa2b44f472711160fa2b44f479601': 0,
					'12344': 0,
					'2233': 0,
					'4': 0
				},
				devices: [],
				ws: null,
				socketObj: null,//当前设备的类
				devicesList: [],
				eqUl: [],
				publicEqUl: [],
				eqLen: '',
				YzyEqUl: [],
				baseScene: [],
				emergencyValue: null,
				allLocalDevice: JSON.parse(localStorage.getItem('allBindingDevice')),
				doorLockStatus: '',
				waterMeterStatus: ''
			}
		},
		methods: {
			changeFile() {
	            let file = this.$refs.myFiles.files[0]; //获取file对象
	            this.deviceinfo = file.name;
	        },
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					adminId: sessionStorage.getItem('id'),
				}
				this.listLoading = true;
				getHouseList(para).then((res) => {
					util.across(this, res);
					this.users.length = 0;
					res.data.rows.map(item => {
						this.users.push(item);
					})
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
					//NProgress.done();
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
			selsChange: function (sels) {
				this.sels = sels;
			},
			getUserPsw(){
				let para = {
					id: sessionStorage.getItem('houseId')
				}
				getBasicInfo(para).then((res) => {
					util.across(this, res);
					this.login(res.entity.account, res.entity.password);
				});
			},
			login(userName, password){
				let params = {
				    "email" : userName,
				    "corp_id":"100fa4b41cb5c000",
				    "password" : password
				}
				let para = JSON.stringify(params);
				getSign(para).then((res) => {
					util.across(this, res);
					sessionStorage.setItem('access_token', res.access_token);
					sessionStorage.setItem('refresh_token', res.refresh_token);
					sessionStorage.setItem('user_id', res.user_id);
					sessionStorage.setItem('authorize', res.authorize);
					this.getAllDevices();
				});
			},
			getAllDevices(){
				let _this  = this;
				let config = {
					headers: { 'Access-Token': sessionStorage.getItem('access_token') }
				}
				getDevices(config).then((res) => {
					util.across(this, res);
					res.map(item => {
						this.productObj[item.product_id] = item.id;
						this.deviceManageObj[item.product_id] = 1;
					})
					this.devices = res.map(item => {
                        return {
                            device_id: item.id.toString(),
                            device_name: item.name,
                            device_mac: item.mac,
                            device_pid: item.product_id
                        }
                    });
                    if(res.length>0){
                    	localStorage.setItem("hostId", res[0].id);
                    }
                    /*else{
                    	this.$message({
							message: '主机被其他人员绑定了',
							type: 'error'
						});
						localStorage.removeItem('allBindingDevice');
						setTimeout(function(){
							_this.$router.push('/house');
						},800)
                    }*/
					localStorage.setItem('productObj',JSON.stringify(this.productObj));
					this.initSdk();
				});
				
			},
			delLocalHost(id){
				let _this = this;
				let param = {
	                id: id
	            }
	            delLocalHost(param).then(res => {
					_this.$message({
						message: '成功解绑主机',
						type: 'success'
					});
					localStorage.removeItem('productObj');
                    setTimeout(function() {
                        _this.$router.go(0);
                    }, 1500);
	            })
			},
			delDeviceHost(e){
				let _this = this;
				let id = this.productObj[e.currentTarget.id];
				let params = {
					"device_id": id
				}
				let config = {
					headers: { 'Access-Token': sessionStorage.getItem('access_token') }
				}
				this.$confirm('是否需要解除绑定?', '提示', {
					type: 'warning'
				}).then(() => {
					delHost(params, config).then((res) => {
						util.across(_this, res);
						this.delLocalHost(id);
					});
				}).catch(() => {

				});
			},
			startBinding(){
				this.bindingVisible = true;
			},
			uploadFile() {
	            if (this.isclick) return;
	            this.isclick = !this.isclick;
	            let file = this.$refs.myFiles.files[0]; //获取file对象
	            let param = new FormData(); //创建form对象  
	            param.append('file', file, file.name); //通过append向form对象添加数据
	            let config = {
	                headers: { 'Content-Type': 'multipart/form-data' }
	            };
	            uploadAction(param, config).then(res => {
	                this.addYzyEq(res.resultValue);
	            }).catch(error => {
	                console.log(error);
	            })
	        },
	       /* setHostType(res){
	        	let _this = this;
	            let param = {
	                deviceId: res.id || '',
	                houseId: sessionStorage.getItem('houseId'),
	                name: res.name || '',
	                deviceType: res.pid || '',
	                sn: res.sn || '',
	                mac: res.mac || '',
	                type: 1
	            }
	            bindingDevice(param).then(res => {
                    this.$message({
						message: '成功添加设备',
						type: 'success'
					});
                    setTimeout(function() {
                        _this.$router.go(0);
                    }, 1500);
	            })
	        },*/
	        addYzyEq(data) {
	            let _this = this;
	            let params = {
	                "qrcode": data
	            }
	            let newparams = JSON.stringify(params);
	            let config = {
	                headers: { 'Access-Token': sessionStorage.getItem('access_token') }
	            }
	            hostBinding(newparams, config).then(res => {

                	// _this.setHostType(res);
                	this.$message({
						message: '成功添加设备',
						type: 'success'
					});
                    setTimeout(function() {
                        _this.$router.go(0);
                    }, 1500);

	            }).catch(error => {
	            	if(error.response.app_result_key == 1) return;

	                let resText = error.response.data;

	                if (resText.error.error == "Access-Token Refresh") {
	                    // window.refreshToten();
	                    return false;
	                }

	                if (resText.error.error == "Access-Token Expired") {
	                    // window.refreshToten();
	                    return false;
	                }

	                if (resText.error.error == "has subscribe device") {
	                    this.$message({
							message: '已订阅设备,请刷新页面',
							type: 'error'
						});
	                    return false;
	                }

	                if (resText.error.msg == "device qrcode unvalid") {
	                    this.$message({
							message: '无效二维码,请刷新页面',
							type: 'error'
						});
	                    return false;
	                }

	                if (resText.error.msg == "device subscribe faild by scan mode.") {
	                    this.$message({
							message: '主机被其他人员绑定了,请刷新页面',
							type: 'error'
						});
	                    return false;
	                }
            	})
	        },
	        getToken() {
	            let _this = this;
	            this.commit('GetCookie', { cvalue: 'user_id' });
	            this.commit('GetCookie', { cvalue: 'access_token' });
	            if (localStorage.getItem(user_id)) {
	                let params = {
	                    email: '2018030619252147527@sslj.com',
	                    corp_id: '100fa4b41cb5c000',
	                    password: 'Znjj123456'
	                };
	                let curParams = JSON.stringify(params);
	                let config = {
	                    'Access-Token': localStorage.getItem(access_token)
	                };
	                this.$axios.post('/v2/user_auth', curParams, config).then(response => {
	                    if (response.status == 200) {
	                        localStorage.setItem("access_token", response.data.access_token);
	                        localStorage.setItem("refresh_token", response.data.refresh_token);
	                        localStorage.setItem("user_id", response.data.user_id);
	                        localStorage.setItem("authorize", response.data.authorize);
	                        _this.getAllDevices();
	                    } else {

	                    }
	                }).catch(error => {
	                    alert("服务器返回数据错误");
	                })
	            } else {
	                _this.getAllDevices();
	            }
	        },
	        //sdk发送数据
	        changeSdkMsg(msg){
	        	let _this = this;
	        	console.log('msg',msg);
				var dataArr = [{
			        index: 1, // 数据端点索引
			        value: msg, // 数据端点值
			        type: 7 // 这个要看文档上的数据端点的列表枚举，string为6
			    }];
			    _this.socketObj.emit('senddata', {
			        type: 'datapoint',
			        data: dataArr
			    }, function(res) {
			        if (res.status === 0) {
			        	console.log('sdk发送数据成功');
			        } else {
			            alert("发送失败,状态:" + res.status)
			        }
			    });
			},
			//获取场景
			/*getSend() {
	            let _this = this;
	            let SN = localStorage.getItem("SN");
	            let opValue = `0800${SN}FE90`;
	            this.changeSdkMsg(opValue);
	        },*/
	        //获取所有设备
	        getSdkEqMsg() {
	            var opValue;
				if(!localStorage.getItem("SN")){
					opValue="0800FFFFFFFFFE81";
				}else{
					opValue=`0800${localStorage.getItem("SN")}FE81`;
				}
				this.changeSdkMsg(opValue);
	        },
	        //控制门锁密码加密方式
	        encryptionPassword(password){
		    	let passwordKey = [0x42, 0x42, 0x49, 0x46, 0x43, 0x44, 0x46, 0x48, 0x45];//支持9位数密码  加密值我们定义 9个大于0x40值
		        let encryptionPassword = [];
		        for (let i = 0; i < password.length; i++) {
		            encryptionPassword.push(passwordKey[i] ^ password[i]);
		        }
		        return encryptionPassword;
		    },
	        //允许入网，绑定门锁设备
	        startBindingDoorLock(){
	        	this.changeSdkMsg(`0800${localStorage.getItem("SN")}FE9F`);
	        },
	       	//开锁
			openDoorControl(){
				let IEEE, Endpoint, shortAddress;
	        	JSON.parse(localStorage.getItem('allBindingDevice')).map(item => {
	        		if(item.name == '门锁'){
	        			IEEE = item.IEEE;
	        			Endpoint = item.Endpoint;
	        			shortAddress = item.shortAddress;
	        		}
	        	})
				this.$prompt('请输入开门密码', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消'
		        }).then(({ value }) => {
		        	let reg = /^\d{8}$/;
		        	if(reg.test(value)){
		        		let final = '';
		        		this.encryptionPassword(value).map(item => {
		        			final+=item.toString(16).toUpperCase();
		        		})

		        		this.changeSdkMsg(`1F00${localStorage.getItem('SN')}FE821602${shortAddress}000000000000${Endpoint}00000108${final}`);

		        	}else{
		        		this.$message({
				            type: 'error',
				            message: '请输入正确密码'
				        });  
		        	}
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '取消输入'
		          });       
		        });
			},
	        //删除门锁设备
	        cancelLock() {
	        	let IEEE, Endpoint, shortAddress;
	        	JSON.parse(localStorage.getItem('allBindingDevice')).map(item => {
	        		if(item.name == '门锁'){
	        			IEEE = item.IEEE;
	        			Endpoint = item.Endpoint;
	        			shortAddress = item.shortAddress;
	        		}
	        	})
	        	this.$message({
					message: "解绑门锁成功",
					type: 'success'
				});
	        	this.changeSdkMsg(`1500${localStorage.getItem('SN')}FE950C02${shortAddress + IEEE + Endpoint}`);
	        	localStorage.removeItem('allBindingDevice');
	        	setTimeout(function() {
                    location.reload();
                }, 1500);
	        },
	        //查看一天的智能水表记录
	        OneDayRecord(){
	        	let params = {
				    "deviceId": '0053',
				    "shortAddress":"FD1E",
				    "endpoint" : "01",
				    "clusterId": '0702',
				    "attribId": '0000'
				}
				// let para = JSON.stringify(params);
	        	checkOneDayRecord(params).then(res => {
	                console.log(res);
	            }).catch(error => {
	                console.log(error);
	            })
	        },
	        //查看一周的智能水表记录
	        OneMonthRecord(){
	        	let params = {
				    "deviceId": '0053',
				    "shortAddress":"FD1E",
				    "endpoint" : "01",
				    "clusterId": '0702',
				    "attribId": '0000'
				}
	        	checkOneMonthRecord(params).then(res => {
	                console.log(res);
	            }).catch(error => {
	                console.log(error);
	            })
	        },
	        //查看一年的智能水表记录
	        OneYearRecord(){
	        	let params = {
				    "deviceId": '0053',
				    "shortAddress":"FD1E",
				    "endpoint" : "01",
				    "clusterId": '0702',
				    "attribId": '0000'
				}
				// let para = JSON.stringify(params);
	        	checkOneYearRecord(params).then(res => {
	                console.log(res);
	            }).catch(error => {
	                console.log(error);
	            })
	        },
	        initSdk() {
	        	let _this = this;

	            this.bindingLoading = false;
				_this.ws = new XSDK('mqtt', {
					type: 'app',
					host: 'ws://118.190.126.197:1884/mqtt',
					userid: sessionStorage.getItem('user_id'), // 用户在云智易平台的user_id，通过获取OpenID接口获取
					authorize: sessionStorage.getItem('authorize'), // 用户在云智易平台的authorize，通过获取OpenID接口获取
					keepAliveInterval: 40, // 非必填，mqtt通讯时长，默认为40s，每40s发送ping请求
				});

				_this.ws.on('ready', function() {
					_this.ws && _this.ws.emit('adddevices', _this.devices) //_devices 表示用户绑定设备列表
					console.log('成功连上了');
				});

				_this.ws.on('devicesready', function(devicesArray) {
	                _this.socketObj = devicesArray[0];
	                _this.changeSdkMsg('0800FFFFFFFFFE9D');
	                _this.getListen();
	                _this.getSdkEqMsg();
	                _this.socketObj.on('data', function(data) {
			        	if (data.type === 'datapoint') {
			            	var ableData=data.data[0].value;
			            	var type=ableData.substring(0,2);
			            	switch(type){
				            	case "15":
				            		var SN = ableData.substring(14,22);
				                	localStorage.setItem("SN",SN);
				            		break; 
				            	case "70":
				            		_this.emergency(ableData);
				            		break;
				            	case "01":
				          			var shortAddress=ableData.substring(4,8);
						      		var Endpoint=ableData.substring(8,10);
						      		var DeviceId=ableData.substring(14,18);
						      		var statu=ableData.substring(18,20);
						      		var nameLength=parseInt(ableData.substring(20,22),16);
						      		var name=ableData.substring(22,nameLength*2+22);
						      		var online=ableData.substring(nameLength*2+22,nameLength*2+24);
						      		var m = _this.prePro(name);
						      		var czName= !m ? '' : decodeURI(m);
						      		var IEEE=ableData.substring(nameLength*2+24,nameLength*2+40);
						      		var SNLength=parseInt(ableData.substring(nameLength*2+40,nameLength*2+42),16);
						      		var eqSN=ableData.substring(nameLength*2+42,(nameLength+SNLength)*2+42);
						      		var ZoneType=ableData.substring((nameLength+SNLength)*2+42,(nameLength+SNLength)*2+46);
						      		var des="";
						      		if(statu==0){
						      			des="关";
						      		}else{
						      			des="开";
						      		}
						      		var eqLi=[{
						      				"shortAddress":shortAddress,
						      				"DeviceId":DeviceId.substring(2,4)+DeviceId.substring(0,2),
						      				"name":czName,
						      				"statu":statu,
						      				"online":online,
						      				"Endpoint":Endpoint,
						      				"IEEE":IEEE,
						      				"ZoneType":ZoneType.substring(2,4)+ZoneType.substring(0,2),
						      				"toUrl":"",
						      				"all":ableData,
						      				"des":des,
						      				"click":0,
						      				"eqSN":eqSN,
						      				"onSrc":"../../../src/resource/images/index/air_pre.png",
						      				"offSrc":"../../../src/resource/images/index/air_nor.png"
						      		}];
						      		_this.eqUl.map(function(item,index){
						      			if(item.Endpoint==Endpoint && item.IEEE==IEEE){
						      				item.shortAddress=shortAddress;
						      				item.DeviceId=DeviceId.substring(2,4)+DeviceId.substring(0,2);
						      				item.name=czName;
						      				item.statu=statu;
						      				item.online=online;
						      				item.all=ableData;
						      				item.ZoneType=ZoneType.substring(2,4)+ZoneType.substring(0,2);
						      				eqLi=null;
						      			}
						      		});
						      		if(eqLi != null){
						      			_this.eqUl=_this.eqUl.concat(eqLi);
						      		}
						      		_this.eqUl = _this.addToUrl(_this.eqUl);
						      		_this.publicEqUl = _this.eqUl;
						      		console.log(_this.eqUl);
						      		break;
				            	default:
				            		break;
			            	}
			            }
			        });
	            })
			},
			//监听云智易数据上报
	        getListen() {
	            let _this = this;
	            _this.socketObj.on('data', function(data) {
	                if (data.type === 'datapoint') {
	                    let eqLi,
	                        shortAddress,
	                        Endpoint,
	                        DeviceId,
	                        status,
	                        nameLength,
	                        name,
	                        online,
	                        m,
	                        czName,
	                        IEEE,
	                        SNLength,
	                        eqSN,
	                        ZoneType,
	                        des,
	                        id,
	                        equipments = [];
	                    let ableData = data.data[0].value;
	                    let type = ableData.substring(0, 2);
	                    console.log('类型1：',type);
	                    switch (type) {
	                        case "15":
	                            break;
	                        case "07":
	                            shortAddress = ableData.substring(4, 8);
	                            Endpoint = ableData.substring(8, 10);
	                            status = ableData.substring(10, 12);
	                            _this.YzyEqUl.map(function(item, index) {
	                                if (shortAddress == item.shortAddress && Endpoint == item.Endpoint) {
	                                    item.status = status;
	                                    if (item.status == "00") {
	                                        item.des = "关";
	                                    } else {
	                                        item.des = "开";
	                                    }
	                                }
	                            });
	                            break;
	                        case "01":
	                            shortAddress = ableData.substring(4, 8);
	                            Endpoint = ableData.substring(8, 10);
	                            DeviceId = ableData.substring(14, 18);
	                            status = ableData.substring(18, 20);
	                            nameLength = parseInt(ableData.substring(20, 22), 16);
	                            name = ableData.substring(22, nameLength * 2 + 22);
	                            online = ableData.substring(nameLength * 2 + 22, nameLength * 2 + 24);
	                            // m = _this.commit('prePro', { name: name });
	                            czName = !m ? '' : decodeURI(m);
	                            IEEE = ableData.substring(nameLength * 2 + 24, nameLength * 2 + 40);
	                            SNLength = parseInt(ableData.substring(nameLength * 2 + 40, nameLength * 2 + 42), 16);
	                            eqSN = ableData.substring(nameLength * 2 + 42, (nameLength + SNLength) * 2 + 42);
	                            ZoneType = ableData.substring((nameLength + SNLength) * 2 + 42, (nameLength + SNLength) * 2 + 46);
	                            des = "";
	                            if (status == 0) {
	                                des = "关";
	                            } else {
	                                des = "开";
	                            }

	                            eqLi = [{
	                                "shortAddress": shortAddress,
	                                "DeviceId": DeviceId.substring(2, 4) + DeviceId.substring(0, 2),
	                                "name": czName,
	                                "status": status,
	                                "online": online,
	                                "Endpoint": Endpoint,
	                                "IEEE": IEEE,
	                                "ZoneType": ZoneType.substring(2, 4) + ZoneType.substring(0, 2),
	                                "toUrl": "",
	                                "all": ableData,
	                                "des": des,
	                                "click": 0,
	                                "eqSN": eqSN,
	                                "trans": false,
	                                "onSrc": "",
	                                "offSrc": ""
	                            }];
	                            _this.eqUl.map(function(item, index) {
	                                if (item.Endpoint == Endpoint && item.IEEE == IEEE) {
	                                    item.shortAddress = shortAddress;
	                                    item.DeviceId = DeviceId.substring(2, 4) + DeviceId.substring(0, 2);
	                                    item.name = czName;
	                                    item.status = status;
	                                    item.online = online;
	                                    item.all = ableData;
	                                    item.ZoneType = ZoneType.substring(2, 4) + ZoneType.substring(0, 2);
	                                    eqLi = null;
	                                }
	                            });

	                            if (eqLi == null || (DeviceId.substring(2, 4) + DeviceId.substring(0, 2)) == "0000" || DeviceId == "0400") {} else {
	                                _this.addToUrl(eqLi);
	                            }
	                            break;
	                        case "0E":
	                            id = ableData.substring(4, 8);
	                            nameLength = parseInt(ableData.substring(8, 10), 16);
	                            name = ableData.substring(10, nameLength * 2 + 10);
	                            m = _this.prePro(name);
	                            czName = !m ? '' : decodeURI(m);
	                            eqLi = [{
	                                'id': id,
	                                'name': czName,
	                                'orderBy': 999
	                            }];
	                            break;
	                        default:
	                            break;
	                    }
	                }
	            });
	        },
	        emergency(ableData) {
	        	let _this = this;
	            setTimeout(function() {
	                _this.emergencyValue = true;
	            }, 1000);
	            if (_this.emergencyValue == false) {
	                return false;
	            }
	            _this.emergencyValue = false;
	            var shortAddress = ableData.slice(4, 8);
	            var cluster = ableData.slice(10, 14);
	            var type = ableData.slice(16, 20);
	            var value = ableData.slice(22, 26);
	            var trueValue = value.slice(2, 4) + value.slice(0, 2);
	            var doorOpen = ableData.slice(24, 26);
	            var doorStatu = ableData.slice(26, 28);
	            if (cluster == "0101") {
	                var interType = ableData.slice(20, 22);
	                if (interType == "42") {
	                    var interPassType = ableData.slice(24, 28);
	                    var interPassStatu = ableData.slice(28);
	                    if (interPassType.toString() == "0") {
	                        if (interPassStatu.toString() == "0") {
	                            /*SetCookie("doorDate", GetCookie("doorDateF"), 10);
	                            SetCookie("doorTime", GetCookie("doorTimeF"), 10);
	                            SetCookie("doorPassword", GetCookie("doorPasswordF"), 10);*/
	                        } else {
	                            alert("临时密码获取失败，请重新获取！");
	                        }
	                    }
	                    if (interPassStatu == "FFFF") {
	                        if (interPassStatu.toString() == "0") {
	                            localStorage.setItem("doorDate", "");
	                            localStorage.setItem("doorTime", "");
	                        }
	                    }
	                }
	                // clearTimeout(doorTimer);
	                if (doorStatu == "00") {
	                    if (doorOpen == "00") {
	                        _this.$message({
								message: "关锁成功",
								type: 'success'
							});
	                    }
	                    if (doorOpen == "01") {
	                        _this.$message({
								message: "开锁成功",
								type: 'success'
							});
	                    }
	                } else if (doorStatu == "01") {
	                    _this.$message({
							message: "门锁操作失败",
							type: 'success'
						});
	                } else if (doorStatu == "02" || doorStatu == "7f") {
	                    _this.$message({
							message: "远程开门未允许",
							type: 'success'
						});
	                } else {
	                    _this.$message({
							message: '门锁绑定成功',
							type: 'success'
						});
						setTimeout(function() {
		                    location.reload();
		                }, 1500);
	                }
	            }
	            _this.publicEqUl.map(function(item, index) {
	                if (item.shortAddress == shortAddress) {
	                    switch (item.DeviceId) {
	                        case "0402":
	                            switch (item.ZoneType) {
	                                case "0015":
	                                    if (item.value == "0000") {} else {
	                                        _this.$message({
												message: '门被打开',
												type: 'success'
											});
	                                    }
	                                    break;
	                                default:
	                                    if (item.value == "0000") {
	                                        item.desc = "关";
	                                    } else {
	                                        item.desc = "开";
	                                    }
	                                    break;
	                            }
	                            break;
	                        default:
	                            break;
	                    }
	                }
	            });
	        },
	        //设备名字转码
	        prePro(data) {
	            if (data.length % 2) return '';
	            let tmp = '';
	            for (let i = 0; i < data.length; i += 2) {
	                tmp += '%' + data.charAt(i) + data.charAt(i + 1);
	            }
	            return tmp;
	        },
	        addToUrl(data) {
	            let _this = this;
	            data.map(function(item, index) {
	                switch (item.DeviceId) {
	                    case "000A":
	                        if (!item.name) {
	                            item.name = "门锁";
	                        }
	                        if (item.online == "00") {
	                            item.des = "不在线";
	                        }
	                    case "0053":
	                        if (!item.name) {
	                            item.name = "水表";
	                        }
	                    default:
	                        break;
	                }
	                if (!_this.eqUl && item.name) {
	                    _this.eqUl.push(item);
	                }
	                localStorage.setItem('allBindingDevice', JSON.stringify(_this.eqUl));
	            });
	            _this.eqLen = _this.eqUl.length;
	            localStorage.setItem("eqLength", _this.eqUl.length);
	            return _this.eqUl;
	        }
		},
		mounted() {
			this.getUsers();
			this.getUserPsw();
			if(localStorage.getItem('allBindingDevice') != null){
				JSON.parse(localStorage.getItem('allBindingDevice')).map(item => {
					if(item.name == '门锁'){
						this.doorLockStatus = true;
					} else {
						this.doorLockStatus = false;
					}
					if(item.name == '水表'){
						this.waterMeterStatus = true;
					} else {
						this.waterMeterStatus = false;
					}
				});
			}
		}
	}

</script>

<style scoped>
	.el-table th>.cell, .el-table .cell {
		text-align: center!important;
	}
	.el-dialog--small {
		min-width: 400px!important;
	}
	.close-area {
		display: block;
	    background: #f8f8f8;
	    border: 1px solid #d1d1d1;
	    width: 48px;
	    height: 48px;
	    line-height: 44px;
	    text-align: center;
	    border-radius: 100%;
	    margin: auto;
	}
	.close-area img {
		vertical-align: middle;
	}
	.cancel-binding {
		line-height: 0;
		text-align: center;
	}
	.cancelBinding {
		cursor: pointer;
	}
	.cancelBinding:hover .cancel-binding{
		color: blue;
	}
	.device-single .device-icon{
	    text-align: center;
	    border-right: 1px solid #d1d1d1;
	    margin-right: 16px;
	}
	.device-single .device-icon img {
		width: 57px;
		height: 57px;
	}
	.device-title {
		height: 40px;
		line-height: 40px;
		color: #4a4a4a;
		background-color: #f8f8f8;
		margin-top: 22px;
	}
	.device-title .grid-content {
		padding: 4px 20px;
	}
	.device-single {
		height: 170px;
		background-color: #f8f8f8;
		padding: 40px 16px;
	}
	.info-area {
		width: 300px;
		float: left;
	}
	.main-area {
		width: 434px;
		margin: auto;
		text-align: center;
	}
	#file {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 9;
		cursor: pointer;
	}
	.upload {
		position: relative;
		float: left;
	}
	.btn-add {
		display: block;
		margin: 30px auto auto auto;
	}
</style>