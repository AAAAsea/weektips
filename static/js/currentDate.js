//获取当前时间，格式YYYY-MM-DD HH:MM:SS
const GetNowTime = time => {
	var date = time,
		year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate(),
		hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
		minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
		second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
	month >= 1 && month <= 9 ? (month = "0" + month) : "";
	day >= 0 && day <= 9 ? (day = "0" + day) : "";
	// var timer = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
	var timer = year + '-' + month + '-' + day;
	return timer;
}

//返回日期和周几数组
function weekDate(selectmonth) {
	var myDate = new Date(); // myDate为当前日期对象
	if(selectmonth!=null)
		{myDate.setMonth(selectmonth)}  // 设置当前月份为selectmonth
	myDate.toLocaleDateString();  
	var month = myDate.getMonth() + 1;
	var time = myDate.getFullYear() + '年' + month + '月' + myDate.getDate() + '日';
	var total = 1;
	var dayList = [];
	var monthMax = 31;
	
	
	switch(month)
	{
		case 2: 
			monthMax = (myDate.getFullYear()%400==0 || (myDate.getFullYear()%4==0 & myDate.getFullYear()%100==1))?29:28;
			// console.log(monthMax)
			break;
		case 4:
		case 6:
		case 9:
		case 11:
			monthMax=30;
			break;
		default:
			monthMax=31;
	}
	
	for (var i = 1; i <= monthMax; i++) {
		myDate.setDate(i);
		// 需求 月份-日 星期几  
		// dayList.push({
		// 	'day': myDate.getDate(),
		// 	'month': myDate.getMonth() + total,
		// 	'week': toWeekDay(myDate.getDay()),
		// 	'year': myDate.getFullYear()
		// })
		dayList.push({
			'day': myDate.getDate(),
			'month': myDate.getMonth() + total,
			'week': toWeekDay(myDate.getDay()),
			'year': myDate.getFullYear()
		})
	}
	// return dayList;
	let length = dayList.length
	let arrOne = dayList[0]
	let arrLast = dayList[length - 1]
	let StartDate = arrOne.year.toString() + '-' + arrOne.month + '-' + arrOne.day
	let EndDate = arrLast.year.toString() + '-' + arrLast.month + '-' + arrLast.day
	// console.log(StartDate);
	// console.log(EndDate);
	return {
		dayList,
		StartDate,
		EndDate
	}
}

// 星期几
function toWeekDay(weekDay) { 
	switch (weekDay) {
		case 1:
			return '一';
			break;
		case 2:
			return '二';
			break;
		case 3:
			return '三';
			break;
		case 4:
			return '四';
			break;
		case 5:
			return '五';
			break;
		case 6:
			return '六';
			break;
		case 0:
			return '日';
			break;
		default:
			break;
	}
	return 'error';
}
module.exports = {
	GetNowTime,
	weekDate
}
