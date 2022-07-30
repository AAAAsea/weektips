'use strict';
exports.main = async (event, context) => {
	//校验账户名是否合法
	console.log(event.record)
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
	const collection = uniCloud.database().collection('users');
	const result = await collection.where({"account":event.account}).get()
	if(result.data.length !== 0 )
	{
		if(result.data[0].passwd !== event.passwd)
		{
			return {status:false, msg:"密码错误"}
		}
		else{
			return {status:true, msg:"登录成功"}
		}
	}
	// console.log(result.data.length)
	// await collection.add(event)
	return {status: true, msg:"注册并登录成功"}
};
