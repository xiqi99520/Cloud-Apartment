import axios from 'axios';
import Qs from 'qs'

let base = '';
let YZY = 'http://118.190.121.138';

export const requestLogin = params => { return axios.post(`${base}/zzjj-cloudap-web/pages/login.do`, Qs.stringify(params)).then(res => res.data); };
//编辑管理员
export const editUser = params => { return axios.post(`${base}/zzjj-cloudap-web/adminuser/updateSave.do`, Qs.stringify(params)).then(res => res.data); };
//编辑角色
export const editRole = params => { return axios.post(`${base}/zzjj-cloudap-web/role/updateSave.do`, Qs.stringify(params)).then(res => res.data); };
//编辑房屋
export const editHouse = params => { return axios.post(`${base}/zzjj-cloudap-web/house/updateSave.do`, Qs.stringify(params)).then(res => res.data); };
//添加管理员
export const addUser = params => { return axios.post(`${base}/zzjj-cloudap-web/adminuser/addSave.do`, Qs.stringify(params)).then(res => res.data); };
//添加角色
export const addRole = params => { return axios.post(`${base}/zzjj-cloudap-web/role/addSave.do`, Qs.stringify(params)).then(res => res.data); };
//添加房屋
export const addHouse = params => { return axios.post(`${base}/zzjj-cloudap-web/house/addSave.do`, Qs.stringify(params)).then(res => res.data); };

export const routerMenu = params => { return axios.get(`${base}/zzjj-cloudap-web/pages/index.do`);};

export const synchronousCache = params => { return axios.get(`${base}/zzjj-cloudap-web/pages/synSystemCache.do`);};

export const loginout = params => { return axios.get(`${base}/zzjj-cloudap-web/pages/loginOut.do`);};

export const getRoleList = params => { return axios.post(`${base}/zzjj-cloudap-web/role/grid.do`, Qs.stringify(params)).then(res => res.data); };

export const getHouseList = params => { return axios.post(`${base}/zzjj-cloudap-web/house/grid.do`, Qs.stringify(params)).then(res => res.data); };

export const getAdminList = params => { return axios.post(`${base}/zzjj-cloudap-web/adminuser/grid.do`, Qs.stringify(params)).then(res => res.data); };

export const toggleFunc = params => { return axios.post(`${base}/zzjj-cloudap-web/adminuser/updateStatus.do`, Qs.stringify(params)).then(res => res.data); };

export const removeRole = params => { return axios.post(`${base}/zzjj-cloudap-web/role/deleteById.do`, Qs.stringify(params)).then(res => res.data); };

export const batchRemoveRole = params => { return axios.post(`${base}/zzjj-cloudap-web/role/deleteByIds.do`, Qs.stringify(params)).then(res => res.data); };

export const removeUser = params => { return axios.post(`${base}/zzjj-cloudap-web/adminuser/deleteById.do`, Qs.stringify(params)).then(res => res.data); };

export const batchRemoveUser = params => { return axios.post(`${base}/zzjj-cloudap-web/adminuser/deleteByIds.do`, Qs.stringify(params)).then(res => res.data); };

export const removeHouse = params => { return axios.post(`${base}/zzjj-cloudap-web/house/deleteById.do`, Qs.stringify(params)).then(res => res.data); };

export const batchRemoveHouse = params => { return axios.post(`${base}/zzjj-cloudap-web/house/deleteByIds.do`, Qs.stringify(params)).then(res => res.data); };

export const modifyPsw = params => { return axios.post(`${base}/zzjj-cloudap-web/adminuser/updatePassword.do`, Qs.stringify(params)).then(res => res.data); };

export const getBasicInfo = params => { return axios.get(`${base}/zzjj-cloudap-web/house/findById.do`, { params: params }).then(res => res.data); };

export const getCurInfo = params => { return axios.get(`${base}/zzjj-cloudap-web/role/findById.do`, { params: params }).then(res => res.data); };

export const getSign = params => { return axios.post(`${YZY}/v2/user_auth`, params).then(res => res.data); };

export const uploadAction = (params, config) => { return axios.post(`${base}/zzjj-cloudap-web/qrcode/analysisQrcode.do`, params, config).then(res => res.data); };

export const hostBinding = (params, config) => { return axios.post(`${YZY}/v2/user/`+sessionStorage.getItem('user_id')+`/qrcode_subscribe`, params, config).then(res => res.data); };

export const bindingDevice = params => { return axios.post(`${base}/zzjj-cloudap-web/device/addSave.do`, Qs.stringify(params)).then(res => res.data); };

export const getAuthorityList = params => { return axios.get(`${base}/zzjj-cloudap-web/resource/getResourceList.do`).then(res => res.data); };