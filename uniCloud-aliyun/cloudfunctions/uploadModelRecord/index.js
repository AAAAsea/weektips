'use strict';
exports.main = async (event, context) => {
	// console.log(event,context)
	
	//判断登录类型
	if(event.loginType == "default")
	{
		//校验账户名是否合法
		let patten = /^[0-9a-zA-Z]*$/g;
		if(!patten.test(event.account))
		{
			return{status: false, msg:"账户名只能由字母和数字组成"}
		}
		patten = /^[0-9a-zA-Z]*$/g;
		if(!patten.test(event.passwd))
		{
			return{status: false, msg:"密码只能由字母和数字组成"}
		}
		if(event.account.length < 4 || event.account.length > 11)
		{
			return{status: false, msg:"账户名长度需要在4~10个字符之间"}
		}
		if(event.passwd.length < 4 || event.passwd.length > 11)
		{
			return{status: false, msg:"密码长度需要在4~10个字符之间"}
		}
		
		//上传数据
		const collection = uniCloud.database().collection('users');		
		const result = await collection.where({"account":event.account}).get()
		if(result.data.length !== 0 )
		{
			if(result.data[0].passwd !== event.passwd)
			{
				return {status:false, msg:"密码错误"}
			}
			else{
				await collection.doc(result.data[0]._id).update(
				{
					model_record: event.model_record
				});
				return {status:true, msg:"上传成功"}
			}
		}else{
			//如若没有账户则新建账户并上传
			let new_event = {}
			new_event.account = event.account
			new_event.passwd = event.passwd
			new_event.model_record = event.model_record
			await collection.add(new_event)
		}
	}else if(event.loginType == "qq")
	{
		const collection = uniCloud.database().collection('qqusers');
		const result = await collection.where({"userId":event.userId}).get()
		if(result.data.length !== 0 )
		{
			await collection.doc(result.data[0]._id).update(
			{
				model_record: event.model_record
			});
			return {status:true, msg:"上传成功"}
		}else{
			//如若没有账户则新建账户并上传
			let new_event = {}
			new_event.userId = event.userId
			new_event.model_record = event.model_record
			await collection.add(new_event)
		}
	}
	return {status: true, msg:"注册成功\n数据已上传"}
};
