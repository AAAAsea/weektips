<template>
	<view class="main_count"  @click="menuShow = false">
		<view class="nav-bar">
			<view class="back_icon iconfont icon-back" @click="back"></view>
			<view class="more_menu">
				<view class="more_icon iconfont icon-more" @click.stop="changeMenuShow"></view>
				<view class="menu" v-show="menuShow">
					<view @click="sortType = 0" :class="{'menu_active': !sortType}">
						按开始时间排序
					</view>
					<view @click="sortType = 1" :class="{'menu_active': sortType}">
						按剩余时间排序
					</view>
				</view>
			</view>
			<view class="plus_icon iconfont icon-plus" @click="addItem" @longpress="addItem"></view>
		</view>
		<view class="banner"  :style="'background-image:'+'url('+bannerUrl+')'">
			<view class="banner_bg"></view>
			<view class="countdown">
				<view >
					{{bannerTitle}}
				</view>
				<view class="countdown_view" v-if="countdownList.length > 0">
					<view v-for="(item,index) in interval" :key="index">
						<view class="countdown_bar" v-if="typeof item == 'object'" >
							<view v-for="(i,cindex) in item" :key="cindex">
								<view :class="i['anim']?'countdown_time':''">
									{{i["text"]}}
								</view>
							</view>
							<!-- {{item}} -->
						</view>
						<view class="countdown_bar countdown_str" v-else>
							{{item}}
						</view>
					</view>
				</view>
					
			</view>
		</view>
		
		<view class="countdown_list" :class="{'hide': hide || firstHide}">
			<view style="color: #b4b4b4;text-align:center;width: 100%;" v-if="countdownList.length == 0">
				‍( ゜- ゜)つロ 还没有任何东西哦~
			</view>
			<view 
			class="countdown_item" 
			:class="{'item_Slide':select_id==index && isSlide}"
			v-for="(item,index) in countdownList" 
			@click="selected(index)" 
			:key="index">
				<view class="left" @longpress='changePic(item,index)' :style="'background-image:'+'url('+item.url+')'">
				</view>
				<view class="right" @longpress='edit(item,index)'>
					<view class="right_bg" :style="'background-image:'+'url('+item.url+')'"/>
					<view class="right_content">
						<view class="title">
							{{item['title']}}
						</view>
						<view class="day" v-if="parseInt((item.date - new Date())/(1000 * 24 *3600))>=0 || item.annual">
							还有 {{calDays(item)}} 天
						</view>
						<view class="day" v-else>
							过去了 {{Math.abs(parseInt((item.date - new Date())/(1000 * 24 *3600)))}} 天
						</view>
						<view class="date">
							{{item.date.getFullYear()}}-{{item.date.getMonth()+1}}-{{item.date.getDate()}}
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- <uni-drawer ref="showLeft" mode="left" :mask-click="true" :width="windowWidth">
			<view class="countdown_drawer" :scroll-y="true">
				<view class="countdown_edit">
					新建
					<input v-model:value="title"></input>
					<picker-view :indicator-style="indicatorStyle" :value="value" @change="bindChange" class="picker-view">
						<picker-view-column>
							<view class="item" v-for="(item,index) in pircker_list['year']" :key="index">{{item}}年</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item,index) in pircker_list['month']" :key="index">{{item}}月</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item,index) in pircker_list['day']" :key="index">{{item}}日</view>
						</picker-view-column>
					</picker-view>
					
				</view>
				<view class="Drawerbottom" @click="closeDrawer">保存</view>
				<view class="Drawerbottom" @click="closeDrawer_cancel">取消</view>
			</view>
		</uni-drawer> -->

	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				firstHide: true,
				sortType: 0, //0为按照开始时间，1为剩余时间
				menuShow: false,
				hide: true,
				interval:{
					day: [
						{
							text:"0",
							anim:false
						}
					],
					Sday: "天",
					hour: [
						{
							text:"0",
							anim:false
						}
					],
					Shour: "时",
					minute: [
						{
							text:"0",
							anim:false
						}
					],
					Sminute: "分",
					second: [
						{
							text:"0",
							anim:false
						}
					],
					Ssecond: "秒",
				},
				clock: Date.parse(new Date()),
				countdownList:[],
				windowWidth:393, // 这个要在app.vue获取一下，不然打开是固定的
				title:"",
				pircker_list:{
					year:[],
					month:[],
					day:[]
				},
				select_id: 0,
				select_date: new Date(),
				indicatorStyle: `height: 100rpx;line-height:100rpx;`,
				value:[(new Date()).getFullYear()-1990,(new Date()).getMonth(), (new Date()).getDate()-1],
				isShow: false,
				timeOutEvent:0,
				startX:0,
				isSlide:false,
			}
		},
		computed:{
			bannerTitle(){
				if(this.countdownList.length == 0)
				{
					return "快去添加你的日子吧！"
				}
				if(this.countdownList[this.select_id] == undefined)
					this.select_id = 0;
				if(this.countdownList[this.select_id].date > this.clock || this.countdownList[this.select_id].annual == true)
					return "距离 「" + this.countdownList[this.select_id].title + "」 还有"
				else
					return "「" + this.countdownList[this.select_id].title + "」 已经过去了"
			},
			bannerUrl(){
				if(this.countdownList[this.select_id] != undefined)
				{
					if(this.countdownList[this.select_id].url == "")
					{
						this.countdownList[this.select_id].url = "/static/pics/countdown2.jpg"
					}
						return this.countdownList[this.select_id].url
				}else{
					return "/static/pics/countdown2.jpg"
				}
			},
		},
		onShow(){
			this.sortType = uni.getStorageSync('sortType')
			this.initCountDownList()
			this.sortCountdownList(this.sortType)
			this.selected(this.select_id)
			this.menuShow = false;
			this.hide = false;
			// console.log("onShow",this.firstHide)
		},
		onLoad() {
			this.hide = true;
		},
		onReady(){
			setTimeout(()=>{this.firstHide = false;}, 100);
			// console.log("onReady")
		},
		mounted() {
			setInterval(()=> {
				this.clock = Date.parse(new Date());
			}, 1000);
		},
		onBackPress(){
			this.setStorage();
		},
		watch:{
			sortType(val){
				this.sortCountdownList(val)
			},
			//clock每次改变都会重新修改interval
			clock(){
				if(this.countdownList.length > 0)
				{
					let temp_date = new Date(this.countdownList[this.select_id].date);
					while(temp_date < this.clock && this.countdownList[this.select_id].annual)
					{
						temp_date.setFullYear(temp_date.getFullYear() + 1)
					}
					this.countDown(temp_date);
				}
			},
			'interval.day'(val,oldVal){
				for(let i in val){
					if(val.length != oldVal.length) this.interval.day[i].anim = true;
					else if(val[i]["text"]!=oldVal[i]["text"]){
						this.interval.day[i].anim=true;
					}else{
						this.interval.day[i].anim=false;
					}
				}
			},
			'interval.hour'(val,oldVal){
				for(let i in val){
					if(val.length != oldVal.length) this.interval.hour[i].anim = true;
					else if(val[i]["text"]!=oldVal[i]["text"]){
						this.interval.hour[i].anim=true;
					}else{
						this.interval.hour[i].anim=false;
					}
				}
			},
			'interval.minute'(val,oldVal){
				for(let i in val){
					if(val.length != oldVal.length) this.interval.minute[i].anim = true;
					else if(val[i]["text"]!=oldVal[i]["text"]){
						this.interval.minute[i].anim=true;
					}else{
						this.interval.minute[i].anim=false;
					}
				}
			},
			'interval.second'(val,oldVal){
				for(let i in val){
					if(val.length != oldVal.length) this.interval.second[i].anim = true;
					else if(val[i]["text"]!=oldVal[i]["text"]){
						this.interval.second[i].anim=true;
					}else{
						this.interval.second[i].anim=false;
					}
				}
			},
		},
		methods: {
			sortCountdownList(type){
				if(type) //按照剩余时间排序
				{
					this.countdownList.sort((a,b)=>
					{ 
						let temp_date_a = new Date(a.date);
						let temp_date_b = new Date(b.date);
						while(a.annual && parseInt((temp_date_a - this.clock)/(1000 * 24 *3600)) < 0)
						{
							temp_date_a.setFullYear(temp_date_a.getFullYear()+1)
						}
						while(b.annual && parseInt((temp_date_b - this.clock)/(1000 * 24 *3600)) < 0)
						{
							temp_date_b.setFullYear(temp_date_b.getFullYear()+1)
						}
						return temp_date_a-temp_date_b
					});
				}else{  //按照开始时间排序
					this.countdownList.sort((a,b)=>{
						return a.date-b.date
						});
				}
				uni.setStorageSync('sortType',this.sortType)
			},
			changeMenuShow(){
				this.menuShow = !this.menuShow;
			},
			calDays(item){
				let date = new Date(item.date)
				while(item.annual == true && parseInt((date - this.clock)/(1000 * 24 *3600)) < 0) //已经过去了，再加一年
				{
					date.setFullYear(date.getFullYear()+1);
				}
				return parseInt((date - new Date())/(1000 * 24 *3600))
			},
			addItem(e){
				this.hide = true;
				console.log(e);
				let id = this.countdownList.length;
				uni.navigateTo({
					url:'./edit/edit?id='+id
				})
			},
			back(){
				uni.navigateBack()
			},
			setStorage(){
				let temp = JSON.parse(JSON.stringify(this.countdownList))
				for(let i = 0; i < this.countdownList.length; ++i)
				{
					temp[i].date = this.countdownList[i].date.toLocaleDateString();
				}
				uni.setStorageSync('countdownList',temp)
			},
			initCountDownList(){
				let res = uni.getStorageSync('countdownList')
				if(res !== "")
				{
					for(var i = 0;i<res.length;i++)
					{
						res[i].date=new Date(res[i].date)
					}
					this.countdownList = res;
				}
				
			},
			edit(item,id){
				this.hide = true; 
				let _item = JSON.parse(JSON.stringify(item));
				_item.date = item.date.toLocaleDateString()
				// console.log(item,id)
				this.setStorage() //编辑之前将排序好的存储一下
				uni.navigateTo({
					url:'./edit/edit?item='+JSON.stringify(_item)+'&id='+id
				})
				uni.vibrateShort();
			},
			changePic(item,index){
				// console.log(this.countdownList)
				uni.vibrateShort();
				uni.chooseImage({
				    count: 1,
				    success: (res)=>{
						//保存原来的图片路径待会要删了
						let old_path = item.url
						// console.log(res)
						uni.saveFile({
							tempFilePath: res.tempFilePaths[0],
							success:(res)=> {
							  this.countdownList[index].url = res.savedFilePath;
							  // console.log(this.countdownList)
							  this.setStorage();
							  uni.removeSavedFile({
								filePath: old_path,
								success: function (res) {
								  console.log("删除成功");
								}
							  });
							},
						});
											
				    }
				});
							
			},
			showDrawer() {
				this.title="";
				this.select_date = new Date()
				let _this=this
				uni.getSystemInfo({
					success: res=>{
						_this.windowWidth = res.windowWidth;
					}
				})
				// console.log(this.$refs)
				this.$refs.showLeft.open();
			},
			closeDrawer(e) {
				// 保存
				console.log(this.title);
				if(this.title!=""){
					this.countdownList.push({
						title:this.title,
						date:this.select_date,
						cd_date:parseInt(Math.abs((this.clock-this.select_date))/(1000*3600*24)),
						url:'../../../static/pics/logo_216.png'
					})
					this.$refs.showLeft.close();
					this.setStorage();
					// this.$refs[e].close();
				}
				else{
					uni.showToast({
						icon:"none",
						title: '请输入倒数日名称！'
					});
				}
				
				
			},
			closeDrawer_cancel(){
				this.$refs.showLeft.close();
			},
			countDown(countDate) {
				/* 生成倒计时*/ 
				// var countDate = new Date("2025/08/11");
				var nowDate = new Date();
				var millisecond = Math.abs(nowDate - countDate);
				var day = parseInt(millisecond / (1000 * 60 * 60 * 24));
				millisecond -= day * 1000 * 60 * 60 * 24;
				var hour = parseInt(millisecond / 1000 / 60 / 60);
				millisecond -= hour * 1000 * 60 * 60;
				var minute = parseInt(millisecond / 1000 / 60);
				millisecond -= minute * 1000 * 60;
				var second = parseInt(millisecond / 1000);
				// day+=1;
				var interval = {
					day: [],
					Sday: "天",
					hour: [],
					Shour: "时",
					minute: [],
					Sminute: "分",
					second: [],
					Ssecond: "秒",
				}
			
				day.toString().split('').forEach(function(item){interval.day.push({text:item,anim:false})});
				hour.toString().split('').forEach(function(item){interval.hour.push({text:item,anim:false})});
				minute.toString().split('').forEach(function(item){interval.minute.push({text:item,anim:false})});
				second.toString().split('').forEach(function(item){interval.second.push({text:item,anim:false})});
		
				
				this.interval=interval
				// console.log(interval)
		
			},
			pickerlistInit(){
				const now = new Date();
				const year = now.getFullYear();
				const month = now.getMonth()+1;
				const day = now.getDate();
				for(let i = 1990;i<=year+30;i++){
					this.pircker_list['year'].push(i);
				}
				for(let i = 1;i<=12;i++){
					this.pircker_list['month'].push(i);
				}
				for(let i = 1;i<=31;i++){
					this.pircker_list['day'].push(i);
				}
				// console.log(this.pircker_list);
			},
			bindChange(e) {
				const val = e.detail.value
				// console.log(val[0])
				// console.log(this)
				// this.select_date['year'] = this.pircker_list['year'][val[0]]
				// this.select_date['month']  = this.pircker_list['month'][val[1]]
				// this.select_date['day'] = this.pircker_list['day'][val[2]]
				var year = this.pircker_list['year'][val[0]]
				var month = this.pircker_list['month'][val[1]]
				var day = this.pircker_list['day'][val[2]]
				
				this.select_date = new Date(year + "/" + month + "/" + day);
				console.log(this.select_date)
				// console.log(val)
			},
			selected(index){
				// console.log(e)
				// this.select_date = e.date;
				// this.title = e.title;
				// this.url = e.url;
				if(index == this.select_id) return
				this.select_id = index;
				let temp_date = new Date(this.countdownList[this.select_id].date);
				while(temp_date < this.clock && this.countdownList[this.select_id].annual)
				{
					temp_date.setFullYear(temp_date.getFullYear() + 1)
				}
				this.countDown(temp_date);
			},
			// //开始滑动
			// touchStart(item,e,index) {
			// 	console.log('start')
			// 	this.startX = e.touches[0].pageX;
			// 	this.select_id=index;
			// 	console.log(this.startX)
			// 	let _this = this;
			// 	this.timeOutEvent = setTimeout(function(){
			// 		console.log('longtouch')
			// 		_this.changePic(item);
			// 	},800);
				
				
			// },
			// //滑动
			// touchMove(item,e) {
			// 	// console.log('move')
				
			// 	var moveX = parseInt(this.startX) - parseInt(e.touches[0].pageX);
			// 	// console.log(parseInt(e.touches[0].pageX));
			// 	// console.log(parseInt(this.startX))
			// 	// console.log(moveX)
			// 	if(moveX<0){
			// 		console.log('exit')
			// 	}
			// 	else{
			// 		this.isSlide=true;
			// 		console.log('dosome')
			// 	}
			// },
			// //滑动结束
			// touchEnd(item,e) {
			// 	clearTimeout(this.timeOutEvent);
			// 	this.isSlide=false;
				
			// 	// console.log(item)
			// 	console.log('end')
			// },
			
		},
	}
</script>

<style>
	.more_menu{
		/* border: 1px solid red; */
		position: absolute;
		right: 30rpx;
		top: 10rpx;
	}
	.more_icon{
		text-align: right;
		/* border: 1px solid red; */
		color: white;
		font-size: 50rpx;
	}
	.menu{
		color: #333;
		font-size: 30rpx;
		transition: 0.3s;
		transition-timing-function: ease-in-out;
		overflow: hidden;
		background-color: #ffffff;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		box-shadow:0 4rpx 4rpx 0 rgba(0, 0, 0, 0.3), 0 6rpx 10rpx 0 rgba(0, 0, 0, 0.3);
		/* border: 1px solid blue; */
	}
	.menu view{
		transition: 0.1s;
		transition-timing-function: ease-in-out;
		padding: 25rpx;
	}
	.menu_active{
		background-color: #ffc742;
	}
	.menu view:active{
		background-color: #ffc742;
	}
	.hide{
		opacity: 0;
		transform: translateX(-10%) ;
		/* transform: scale(0.9); */
	}
	.plus_icon{
		transition: 0.3s;
		color: white;
		font-size: 60rpx;
		position: fixed;
		right: 50rpx;
		bottom: 80rpx;
		background-color: #ffc742;
		padding: 20rpx;
		border-radius: 50%;
		box-shadow:0 4rpx 4rpx 0 rgba(0, 0, 0, 0.1), 0 6rpx 10rpx 0 rgba(0, 0, 0, 0.1);
	}
	.plus_icon:active{
		box-shadow:0 4rpx 4rpx 0 rgba(0, 0, 0, 0.2), 0 6rpx 10rpx 0 rgba(0, 0, 0, 0.2);
		transform: scale(0.9);
	}
	.back_icon{
		color: white;
		font-size: 50rpx;
		position: absolute;
		left: 30rpx;
		top: 10rpx
	}
	.nav-bar{
		width: 100vw;
		position: fixed;
		top: var(--status-bar-height);
		z-index: 999;
	}
	.countdown_list{
		transition: 0.3s;
		transition-timing-function: ease-in-out;
		padding:50rpx 40rpx;
	}
	.banner{
		transition: 0.3s;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 30vh;
		background-image: url(https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F24%2F20210724104422_db1bd.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1650004219&t=d8fc2556548ca8576a2b04e4b8157a40);
		background-position: 50% 50%;
		background-size: cover;
	}
	.banner_bg{
		transition: 0.3s;
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: rgba(0, 0, 6, 0.7);
		z-index: 1;
		
	}
	.main_count{
		height: 100vh;
	}
	@keyframes turnZ {
		0%{
			transform: rotate(0deg) translateY(0);
		}
		50%{
			transform: rotate(190deg) translateY(0);
			opacity: 1;
		}
		60%{
			transform: rotate(180deg);
		}
		100%{
			transform: rotate(180deg) translateY(-100%);
			opacity: 0;
		}
	}
	.content{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.dragon{
		position: absolute;
		bottom:50%;
		/* left:50%;
		z-index: 10;
	}

	.navigation{
		height: 200rpx;
		position: sticky;
		/* top: 0; */
		left: 0;
		width: 100%;
		z-index: 1;
		border-bottom: 1rpx solid #A5A4A4;
	}
	.pageName{
		position: absolute;
		bottom: 45rpx;
		left:45%;
		font-size: 40rpx;
		font-family: 'Open Sans';
		font-weight: bolder;
	}
	.countdown {
		color: white;
		line-height: 2;
		/* border: 1px solid red; */
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 2;
	}
	
	.countdown:active{
		-webkit-animation: jello-horizontal 0.9s both;
		animation: jello-horizontal 0.9s both;
	}
	/* 小彩蛋 */
	@-webkit-keyframes jello-horizontal {
	  0% {
	    -webkit-transform: scale3d(1, 1, 1);
	            transform: scale3d(1, 1, 1);
	  }
	  30% {
	    -webkit-transform: scale3d(1.25, 0.75, 1);
	            transform: scale3d(1.25, 0.75, 1);
	  }
	  40% {
	    -webkit-transform: scale3d(0.75, 1.25, 1);
	            transform: scale3d(0.75, 1.25, 1);
	  }
	  50% {
	    -webkit-transform: scale3d(1.15, 0.85, 1);
	            transform: scale3d(1.15, 0.85, 1);
	  }
	  65% {
	    -webkit-transform: scale3d(0.95, 1.05, 1);
	            transform: scale3d(0.95, 1.05, 1);
	  }
	  75% {
	    -webkit-transform: scale3d(1.05, 0.95, 1);
	            transform: scale3d(1.05, 0.95, 1);
	  }
	  100% {
	    -webkit-transform: scale3d(1, 1, 1);
	            transform: scale3d(1, 1, 1);
	  }
	}
	@keyframes jello-horizontal {
	  0% {
	    -webkit-transform: scale3d(1, 1, 1);
	            transform: scale3d(1, 1, 1);
	  }
	  30% {
	    -webkit-transform: scale3d(1.25, 0.75, 1);
	            transform: scale3d(1.25, 0.75, 1);
	  }
	  40% {
	    -webkit-transform: scale3d(0.75, 1.25, 1);
	            transform: scale3d(0.75, 1.25, 1);
	  }
	  50% {
	    -webkit-transform: scale3d(1.15, 0.85, 1);
	            transform: scale3d(1.15, 0.85, 1);
	  }
	  65% {
	    -webkit-transform: scale3d(0.95, 1.05, 1);
	            transform: scale3d(0.95, 1.05, 1);
	  }
	  75% {
	    -webkit-transform: scale3d(1.05, 0.95, 1);
	            transform: scale3d(1.05, 0.95, 1);
	  }
	  100% {
	    -webkit-transform: scale3d(1, 1, 1);
	            transform: scale3d(1, 1, 1);
	  }
	}

	
	.countdown_view{
		/* border: 1rpx solid #2C405A; */
		/* border-bottom: 1rpx solid #555555; */
		display: flex;
		justify-content: space-around;
		width: 70%;
	}
	.countdown_bar {
		display: flex;
		font-size: 58rpx;
		transform-origin: left bottom;
		margin: 0 10rpx;
		font-weight: bold;
	}

	.countdown_time{
		transform-origin: 50% 100%;
		animation-name: turnZ;
		/* transform-origin: 0 100% 0 rotate(180deg); */
		animation-duration: 1s;

		animation-iteration-count: infinite;
		transition-timing-function: ease-in-out;

	}
	.countdown_item
	{
		transition: 0.3s;
		margin-bottom: 40rpx;
		height: 200rpx;
		border-radius: 5rpx;
		display: flex;
		box-shadow:0 4rpx 4rpx 0 rgba(0, 0, 0, 0.1), 0 6rpx 10rpx 0 rgba(0, 0, 0, 0.1);
		/* overflow: hidden; */
	}
	.countdown_item:active{

	}
	.countdown_item .left{
		transition: 0.3s;
		flex: 1;
		/* background-image: url(../../../static/pics/logo_216.png);	 */
		background-position: 50% 50%;
		background-size: cover;
	}
	.countdown_item .left:active{
		box-shadow:0 8rpx 8rpx 0 rgba(0, 0, 0, 0.2), 0 10rpx 10rpx 0 rgba(0, 0, 0, 0.2);
		transform: translateY(-0.5%)
	}
	.countdown_item .right .right_bg{
		transition: 0.3s;
		height: 110%;
		width: 110%;
		position: absolute;
		/* background-image: url(../../../static/pics/logo_216.png); */
		background-position: center;
		background-size:cover;
		opacity: 0.25;
		z-index: 1;
		filter: blur(5px);
	}	
	.countdown_item .right{
		overflow: hidden;
		letter-spacing: 2rpx;
		transition: 0.3s;
		color: #000000;
		font-family: "fantasy";
		line-height: 45rpx;
		position: relative;
		display: flex;
		flex: 4;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: rgba(0,0,0,0);
	}
	.countdown_item .right:active{
		box-shadow:0 8rpx 12rpx 0 rgba(0, 0, 0, 0.2), 0 10rpx 20rpx 0 rgba(0, 0, 0, 0.2);
		transform: translateY(-0.5%)
	}
	.countdown_item .right .right_content{
		font-size: 30rpx;
		text-align: center;
		z-index: 99;
	}
	.countdown_item .right .right_content .title{
		
		font-size: 25rpx;
	}
	.countdown_item .right .right_content .date{
		font-family: "Arial";
		font-size: 25rpx;
		color: #838383;
	}

	.countdown_titlebar{
	/* 	font-size; */
	}
	.countdown_detail{
		/* border: 1rpx solid #18BC37; */
		background: #9067C6;
		height: 50rpx;
		width: auto;
		line-height: 50rpx;
		border-radius: 10rpx;
		/* margin-top: 20rpx; */
		/* float: right; */
		color: #ffffff;
		font-weight: bolder;
		/* padding: 2rpx; */
		align-self: center;
		position: absolute;
		right: 10rpx;
		
		/* left:70%; */
	}
	.countdown_day{
		font-size: 45rpx;
	}

	.countdown_drawer{
		height: 100%;
		background-color: #FFF6E3;
		background: #FFF6E3;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		/* justify-content: center; */
	}
	.countdown_edit{
		height: 320rpx;
		margin-top: 100rpx;
		text-align: center;
		border-radius: 20rpx;
		box-shadow: 2rpx 2rpx 5rpx 2rpx #A5A4A4;
		/* border: 1rpx solid #007AFF; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		
		font-size: 45rpx;
		font-family: '黑体';
		/* font-weight: bold; */
	}
	
	input{
		width: 600rpx;
		margin: 15rpx;
		height: 40rpx;
		
		align-self: center;
		border-bottom: 1rpx solid #ccc;
		border-radius: 10rpx;
		padding: 5rpx 14rpx;
		font-size: 30rpx;
		font-weight: 500;
		font-family: "Microsoft soft";
	}
	
	input:focus{
		border: 1rpx solid #007AFF;
		/* outline: 0; */
		/* -webkit-box-shadow: inset 0 1rpx #4CD964,0 0 8rpx #000000; */
		box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
	}
	
	.picker-view {
		width: 90%;
		height: 170rpx;
		margin: 10rpx;
		align-self: center;
		font-size: 40rpx;
		font:'Arial, Helvetica, sans-serif' !important;
	/* 	background: #FFF6E3;
		background-color: #e7dfce; */
	}
	picker-view{
		/* background: #007AFF; */
	}
	::v-deep picker-view-column{
		/* border:2rpx solid #007AFF; */
		/* background:#000000; */
		
	}
	::v-deep picker-view-mask{
		background: #FFF6E3;
	}
	.item {
		height: 100rpx;

	}
	.Drawerbottom{
		background-color: #fecc32aa;
		width: 40%;
		height: 100rpx;
		margin: 20rpx;
		line-height: 100rpx;
		border-radius: 20rpx;
		text-align: center;
	}
	.item_Slide{
		transform: translateX(-140rpx) !important;
	}

</style>
