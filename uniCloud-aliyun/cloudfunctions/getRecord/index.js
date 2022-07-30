'use strict';
exports.main = async (event, context) => {//event是用户传来的参，context是设备等信息
	// console.log(event)
	if(event.loginType == 'default')
	{
		const collection = uniCloud.database().collection('users');
		const data = await collection.where({"account":event.account, "passwd": event.passwd}).field({'record':true}).get()
		if(data.data.length == 0)
		{
			return{status: false, msg: "账号或密码错误"}
		}else{
			return {status: true, msg:"恢复成功",data: data.data[0].record}
		}
	}else if(event.loginType == 'qq'){
		const collection = uniCloud.database().collection('qqusers');
		const data = await collection.where({"userId":event.userId}).field({'record':true}).get()
		if(data.data.length == 0)
		{
			return{status: false, msg: "账号错误"}
		}else{
			return {status: true, msg:"恢复成功",data: data.data[0].record}
		}
	}
	
};
