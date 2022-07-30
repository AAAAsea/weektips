<template>
	<page-meta>
		<navigation-bar
			:background-color="$store.getters.backgroundColor"
			:front-color="$store.getters.frontColor"
		/>
	</page-meta>
	<view :data-theme="this.$store.state.appTheme" class="main_note">
		<uni-navbar 
		title="笔记"
		:backShow="true"
		></uni-navbar>
		<view class="date_box" v-if="reset">
			<view class="monthTitle" style="display: flex;">
				<view class="arrow" @click="toleft"> < </view>
				<view class="month" @click="toThisMonth">{{SelectMonth}} 月</view>
				<view class="arrow" @click="toright"> > </view>
			</view>
			<scroll-view scroll-x="true" :scroll-left="scrollViewToday">
				<block v-for="(item, index) in dayList" :key="index" >
					<view class="dayTitle" :class="(current == index)  ? 'select' : ''" @click="timeSelectd(index)">
						<view
							style="display: flex;flex-direction: column;justify-content: center;width: 100%;height: 100%;">
							<view>{{ item.day }}</view>
							<view v-if="index == today && SelectMonth == (new Date()).getMonth()+1" style="font-size: 25upx;">今</view>
							<view v-else style="font-size: 25upx;">{{ item.week }}</view>
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
		<view class="weeklist">
			<scroll-view class="weeklistscroll"scroll-y="true">
				<view v-for="(item,index) in $store.state.NoteData" :key="index">
					<view class="note_item" v-if="item.time == SelectTime" @click="toDetail(item)">
						<view class="title">{{item.title}}</view>
						<view class="detail">{{item.content}}</view>
						<view class="tags" >
							<view v-for="(tag,index) in item.tag" :key="index">
								<view class="tag">#{{tag}}</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="add" @click="addList(SelectTime)">+</view>
		
	</view>
</template>

<script>
	import Vue from 'vue';
	import common from '../../../static/js/currentDate.js';
	export default {
		data() {
			return {
				isShow: false,
				current: 0,
				dayList: [],
				SelectTime: common.GetNowTime(new Date()),
				scrollViewToday: 0,
				today: 0,
				SelectMonth: 3,
				NoteData:[
					// {
					// 	title:"testtttttttttttttttttttttttttttttttttttttttttttttttttttt",
					// 	content:"testtesttestetstetststttststttttttttttttttttttttttttsssssssssssssstttttttttttttttttt",
					// 	tag:["test1","test2"],
					// 	time:"2022-03-09"
					// },
				],
				passage:"",
				reset: false,
			};
		},
		onLoad() {
			this.dayList = common.weekDate().dayList;
			// console.log(this.dayList)
			this.today = new Date().getDate() - 1;
			// console.log(this.current);
			this.scrollViewToday = this.today * 30;
			this.current = this.today;
			this.SelectMonth = (new Date()).getMonth()+1
			// console.log(this.SelectMonth)
			// this.scrollViewToday =  * 50;
			// console.log(this.NoteData);
			uni.$on("delete_note",res=>{
				// console.log(res)
				
				this.$store.state.NoteData.splice(res,1);
				// this.NoteData.splice(res,1);
				// uni.setStorage({
				// 	key:"note_data",
				// 	data:this.NoteData
				// })
			})
			// this.NoteData = uni.getStorageSync("note_data");
			// delete this.NoteData[this.deleteid];
		},
		onShow() {

			// console.log(this.NoteData)
			var data = uni.getStorageSync('detail_passage');
			// console.log(data)
			if(data.title!="" && data.content!="")
			{
			// console.log(data)
				this.$store.state.NoteData.push(data);
				// this.NoteData.push(data);
				// console.log(this.NoteData.indexOf(data));
			}
			this.reset = true;
			// this.$nextTick(function(){
			// 	this.reset = true;
			// })
			
			// console.log(this.$store.state.NoteData);

		},
		onUnload() {
			// console.log("onUnload")
			uni.removeStorageSync("detail_passage")
			// console.log(this.NoteData)
			// uni.setStorageSync("note_data",this.NoteData);
		},
		onHide(){
			
			console.log("onhide")
			// console.log(this.NoteData)
		},
		methods: {
			// 日期选择
			timeSelectd(index) {
				this.current = index;
				let date = this.dayList[index].year + '-' + this.SelectMonth + '-' + this.dayList[index].day;
				// let date = this.dayList[index].year + '-' + this.dayList[index].month + '-' + this.dayList[index].day;
				// console.log(date)
				date = common.GetNowTime(new Date(date));
				// console.log(date)
				this.SelectTime = date;
				// console.log(this.dataList)
				console.log(this.SelectTime);
				console.log(this.current)
			},
			showDrawer() {
				this.$refs.showRight.open();
			},
			closeDrawer() {
				this.$refs.showRight.close();
			},
			toleft(){
				if(this.SelectMonth>1){
					this.SelectMonth--;
				}
				else{
					this.SelectMonth=12;
				}
				this.dayList = common.weekDate(this.SelectMonth-1).dayList;
				this.refresh()
			},
			toright(){
				if(this.SelectMonth<12){
					this.SelectMonth++;
				}
				else{
					this.SelectMonth=1;
				}
				this.dayList = common.weekDate(this.SelectMonth-1).dayList;
				// console.log(this.dayList)
				// console.log(this.SelectMonth)
				this.refresh()
			},
			toThisMonth(){
				var dayList = common.weekDate().dayList;
				this.SelectMonth = (new Date()).getMonth()+1;
				// let date = this.dayList[index].year + '-' + this.dayList[index].month + '-' + this.dayList[index].day;
				let date = common.GetNowTime(new Date());
				this.SelectTime = date
				console.log(this.SelectTime)
				this.dayList = common.weekDate(this.SelectMonth-1).dayList;
				this.current = (new Date()).getDate()-1;
				this.scrollViewToday+=0.01;
				
				// console.log(this.current)
				// console.log(date)
				// this.refresh()
				// console.log(dayList);
			},
			addList(option){
				console.log(option);
				uni.navigateTo({
					url: './detail/detail?time='+option,
					animationType:"zoom-out",
					animationDuration:300,
					// success: res => {},
					// fail: () => {},
					// complete: () => {}
				});
				
			},
			changeDate(){
				this.key++;
			},
			refresh(){
				this.reset = false;
				setTimeout(()=>{
					this.reset = true;
				},0)
			},
			toDetail(item){
				// console.log(item)
				uni.navigateTo({
					url: './detail/detail?id='+this.$store.state.NoteData.indexOf(item),
					success: res => {},
					fail: () => {},
					complete: () => {},
					animationType:"zoom-out",
					animationDuration:300,
				});
				setTimeout(()=> {uni.$emit("toDetail",item);}, 10);
			}
		}
	};
</script>

<style scoped>
	scroll-view{
		border-radius: 10rpx;
	}
	.main_note{
		height: 100vh;
	}
	.date_box {
		padding: 30upx;
	}

	scroll-view {
		padding: 20upx 0;
		width: 100%;
		white-space: nowrap;
	}
	.weeklistscroll{
		height: 1100rpx;
	}
	.dayTitle {
		width: 100upx;
		height: 100upx;
		border-radius: 60upx;
		margin-left: 5upx;
		text-align: center;
		display: inline-block;
	}
	.monthTitle{
		height: 50upx;
		line-height: 50upx;
		text-align: center;
		align-items: center;
		justify-content: center;
		border-bottom: 1rpx solid #eaeaea;
	}
	.arrow{
		padding-left:  120rpx;
		padding-right: 120rpx;
		padding-bottom: 20rpx;
		/* border: 1rpx solid; */
	}
	.select {
		color: #ffffff;
		background-color: #83cbac;
	}
	.month{
		padding: 0 40rpx;
		padding-bottom: 20rpx;
	}
	.note_item{
		margin: 20rpx;
		height: 150rpx;
		/* border: 1rpx solid red; */
		border-radius: 18rpx;
		line-height: 90rpx;
		grid-gap: 10rpx;
		padding: 20rpx;
		padding-top: 30rpx;
		/* padding-left: 10rpx; */
		/* display: flex; */
		justify-content: space-around;
		/* background-color: #F8F8F8; */
	}
	.title{
		width:85%;
		/* margin-left: 10rpx; */
		/* border: 1rpx solid; */
		height: 65rpx;
		/* text-align: center; */
		line-height: 50rpx;
		padding: 0 10rpx;
		font-size: 50rpx;
		text-overflow: ellipsis;
		white-space: nowrap;/*文本不换行，这样超出一行的部分被截取，显示...*/
		overflow: hidden;
	}
	.detail{
		/* margin-left: 10rpx; */
		height: 50rpx;
		width: 90%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		/* border: 1rpx solid; */
		/* text-align: center; */
		line-height: 50rpx;
		margin-top: 5rpx;
		padding: 0 10rpx;
		color: #C0C0C0;
		
	}
	.tags{
		/* margin-left: 10rpx; */
		display: flex;
		/* border: 1rpx solid; */
		/* width: 90%; */
		height: 40rpx;
		line-height: 40rpx;
		font-size: 13rpx;
		padding: 0 10rpx;
		color: #909399;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		
	}
	.tag{
		margin-right: 7rpx;
		/* background-color: #DCDCDC; */
		border-radius: 10rpx;
	}

	.weeklist{
		
		/* border: 1rpx solid; */
	}
	.add{
		width: 100rpx;
		height:100rpx;
		animation-timing-function: ease-in-out;
		transition: 0.05s;
		position: fixed;
		bottom: 50rpx;
		right: 30rpx;
		background-color: #83cbac;
		border-radius: 50%;
		box-shadow: 3rpx 0 15rpx #353535;
		line-height: 90rpx;
		text-align: center;
		display: flex;
		flex-direction: column;
		/* justify-content: center; */
		font-size: 100rpx;
		color: #FFFFFF;
	}
	.over{
		/* box-shadow: 3rpx 0 15rpx #353535; */
	}
</style>
