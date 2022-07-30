<template>
	<view>
		<uni-navbar
			:title='add ? "编辑" : "新增"'
			backShow
		></uni-navbar>
		<view class="delete_icon iconfont icon-delete" @click="myDelete" v-if="add"></view>
		<view class="preview">
			<view class="label">
				效果预览		
			</view>
			<view class="countdown_item" >
				<view class="left" :style="'background-image:'+'url('+item.url+')'">
				</view>
				<view class="right">
					<view class="right_bg" :style="'background-image:'+'url('+item.url+')'"/>
					<view class="right_content">
						<view class="title">
							{{item['title']}}
						</view>
						<view class="day" v-if="parseInt((item.date - new Date())/(1000 * 24 *3600))>=0 || item.annual">
							还有 {{calDays}} 天
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
		<view class="main-edit">
			<view class="label" style="color: #111;">
				各项设置		
			</view>
			<view class="label">
				标题	
			</view>
			<view class="title">
				<input type="text" v-model="item.title" placeholder="编辑标题..." maxlength="10" @input="onInput" auto-blur/>
			</view>
			<view class="label">
				日期	
			</view>
			<view class="picker">
				<picker-view :indicator-style="indicatorStyle" :value="value" @change="bindChange" class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item,index) in picker_list['year']" :key="index">{{item}}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item,index) in picker_list['month']" :key="index">{{item}}月</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item,index) in picker_list['day']" :key="index">{{item}}日</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view style="display: flex; justify-content: space-between; width: 100%; margin-top: 30rpx;">
				<view class="label" style="margin-top: 0;">
					一年一度
				</view>
				<switch :checked="item.annual" class="swicthbtn" @change="checkChange" color="#ffc742" ></switch>
			</view>
			<view class="label">
				封面		
			</view>
			<view class="cover" :style="'background-image:'+'url('+item.url+')'" @click="changePic"></view>
	
			<view class="save_icon iconfont icon-ok" @click="save"></view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				item: {},
				id: 0,
				select_date: {},
				picker_list:{
					year:[],
					month:[],
					day:[]
				},
				indicatorStyle: `height: 80rpx;line-height:100rpx;`,
				indicatorStyle2: `width: 80rpx`,
				value:  [],
				modified: false,
				add: true,
			}
		},
		computed:{
			calDays(){
				let temp_date = new Date(this.item.date)
				temp_date.annual = this.item.annual
				while(this.item.annual == true && parseInt((temp_date - new Date())/(1000 * 24 *3600)) < 0) //已经过去了，再加一年
				{
					temp_date.setFullYear(temp_date.getFullYear()+1);
				}
				// console.log(parseInt((temp_date - new Date())/(1000 * 24 *3600)))
				return parseInt((temp_date - new Date())/(1000 * 24 *3600))
			},
		},
		onLoad(params)
		{
			
			// console.log(params) //{"id":"6"} 
			if(!params.hasOwnProperty('item'))
			{
				this.add = false;
				this.item = {
					title:"",
					annual: false, //必须要加上这个属性，不然computed会监听不到
					date:(new Date()).toLocaleDateString(),
					cd_date:0,
					url:"/static/pics/countdown2.jpg"
				}
			}
			else{
				this.item = JSON.parse(params.item)
				if(!this.item.hasOwnProperty('annual')) //必须要加上这个属性，不然computed会监听不到
					this.item.annual = false;
			}
			this.item.date = new Date(this.item.date)
			this.item.date
			this.id = params.id;
			this.value=[this.item.date.getFullYear()-1990,this.item.date.getMonth(), this.item.date.getDate()-1]
			// console.log(this.item)
			this.pickerlistInit()
			console.log(this.id)
		},
		onBackPress(e){
			if(e.from == 'navigateBack' || this.modified == false)
			{
				return false;
			}
			uni.showModal({
				title:"是否保存？",
				confirmText:"是",
				cancelText:"否",
				success: (res)=> {
					if (res.confirm) {
						this.save();
					} else if (res.cancel) {
						uni.navigateBack();
					}
				}
			})
			return true;
		},
		methods: {
			changePic(item,index){
				item = this.item
				// console.log(this.countdownList)
				uni.chooseImage({
				    count: 1,
				    success: (res)=>{
						//保存原来的图片路径待会要删了
						let old_path = item.url
						// console.log(res)
						uni.saveFile({
							tempFilePath: res.tempFilePaths[0],
							success:(res)=> {
							  this.item.url = res.savedFilePath;
							  this.modified = true;
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
			onInput(){
				this.modified = true;
			},
			myDelete(){
				uni.showModal({
					title:"确认删除？",
					confirmText:"是",
					cancelText:"否",
					success: (res)=> {
						if (res.confirm) {
							let countdownList = uni.getStorageSync('countdownList');
							//删除纪念日时同时删除存储的图片
							uni.removeSavedFile({
								filePath: countdownList[this.id].url,
								success: function (res) {
								  console.log("删除成功");
								}
							});
							countdownList.splice(this.id,1)
							uni.setStorageSync('countdownList', countdownList)
							console.log(countdownList)
							uni.navigateBack();
						} else if (res.cancel) {
							// uni.navigateBack();
						}
					}
				})
			},
			save(){
				if(this.item.title.trim()==''){
					uni.showToast({
						icon: 'none',
						title: '忘记输入标题啦>o<'
					});
					return;
				}
				else{
					let countdownList = uni.getStorageSync('countdownList');
					console.log(typeof countdownList)
					if(countdownList==''){
						countdownList=[]
					}
					if(this.add)
					{
						countdownList[this.id] = JSON.parse(JSON.stringify(this.item));
					}else{
						countdownList.push(JSON.parse(JSON.stringify(this.item)));
					}
					countdownList[this.id].date = this.item.date.toLocaleDateString()
					uni.setStorageSync('countdownList', countdownList)
					uni.navigateBack()
				}
			},
			pickerlistInit(){
				const now = new Date();
				const year = now.getFullYear();
				const month = now.getMonth()+1;
				const day = now.getDate();
				for(let i = 1990;i<=year+30;i++){
					this.picker_list['year'].push(i);
				}
				for(let i = 1;i<=12;i++){
					this.picker_list['month'].push(i);
				}
				for(let i = 1;i<=31;i++){
					this.picker_list['day'].push(i);
				}
				// console.log(this.picker_list);
			},
			bindChange: function (e) {
				//振动
				uni.vibrateShort();
				const val = e.detail.value
				var year = this.picker_list['year'][val[0]]
				var month = this.picker_list['month'][val[1]]
				
				var d = new Date(year, month, 0);
				let days = d.getDate()
				
				//实时修改月份
				this.picker_list['day'] = []
				for(let i = 1;i<=days;i++){
					this.picker_list['day'].push(i);
				}
				var day = this.picker_list['day'][val[2]]
				
				this.item.date = new Date(year + "/" + month + "/" + day);
				 
				this.modified = true;
			},
			checkChange(e){
				this.item.annual = e.detail.value
				this.modified = true;
			}
			
		}
	}
</script>

<style>
	
	.main-edit .swicthbtn{
		line-height: 30px;
		color: #929293;
		right: 0;
		transform: scale(0.6,0.6);
		
	}
	.main-edit .label{
		margin-top: 30rpx;
		color: #666;
		line-height: ;
	}
	.save_icon{
		transition: 0.3s;
		color: #ffc742;
		/* font-size: 100rpx; */
		position: fixed;
		right: 50rpx;
		bottom: 80rpx;
	}
	.save_icon:active{
		transform: scale(0.9);
	}
	.cover{
		height: 350rpx;
		width: 200rpx;
		background-position: 50% 50%;
		background-size: cover;
		box-shadow:0 4rpx 4rpx 0 rgba(0, 0, 0, 0.1), 0 6rpx 10rpx 0 rgba(0, 0, 0, 0.1);
		border-radius: 5rpx;
	}
	.preview{
		width: 90%;
		margin: auto;
		border-bottom: 1px solid #8a8a8a;
	}
	.label{
		font-size: 30rpx;
		color: #111;
		padding: 10rpx;
		position: relative;
		
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
		overflow: hidden;
	}
	.countdown_item .left{
		transition: 0.3s;
		flex: 1;
		/* background-image: url(../../../static/pics/logo_216.png);	 */
		background-position: 50% 50%;
		background-size: cover;
	}
	.countdown_item .left:active{
		box-shadow:0 16rpx 16rpx 0 rgba(0, 0, 0, 0.3), 0 20rpx 20rpx 0 rgba(0, 0, 0, 0.3);
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
		box-shadow:0 16rpx 16rpx 0 rgba(0, 0, 0, 0.3), 0 20rpx 20rpx 0 rgba(0, 0, 0, 0.3);
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
	.delete_icon{
		color: #ffc742;
		transition: 0.3s;
		text-shadow: 1rpx 1rpx 1rpx #bfbfbf;
		position: absolute;
		top: 80rpx;
		right: 30rpx;
		font-size: 45rpx;
	}
	.delete_icon:active{
		color: red;
	}
	.main-edit{
		/* border: 1px solid blue; */
		display: flex;
		flex-direction: column;
		justify-content:flex-start;
		align-items: flex-start;
		width: 90%;
		margin: auto;
	}
	.main-edit .title{
		display: flex;
		font-size: 35rpx;
		justify-content: center;
	}
	.main-edit .title input{
		color: #999;
		width: 50vw;
		transition: 0.3s;
		border-bottom: 1rpx solid #666 ;
		text-align: center;
	}
	.main-edit .title input:hover{
		color: #111;
		width: 90vw;
		border-bottom: 2rpx solid #ffc742 ;
	}
	.main-edit .picker{
		/* border: 1px solid red; */
		border-radius: 20rpx;
		overflow: hidden;
		text-align: center;
		box-shadow:4rpx 4rpx 4rpx 4rpx rgba(0, 0, 0, 0.1), 0 8rpx 10rpx 0 rgba(0, 0, 0, 0.1);
	}

	.picker-view {
		width: 90vw;
		height: 250rpx;
		font-size: 30rpx;
		font:'Arial, Helvetica, sans-serif' !important;
		line-height: 80rpx;
	}
	
</style>
