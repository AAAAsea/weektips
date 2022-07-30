<template>
	<page-meta>
		<navigation-bar
			:background-color="$store.getters.backgroundColor"
			:front-color="$store.getters.frontColor"
		/>
	</page-meta>
	<view :data-theme="this.$store.state.appTheme" class="main_detail">
		<uni-navbar
			title="详细内容"
			:backShow="true"
		></uni-navbar>
		<span class="iconfont icon-more more" @click="more" ></span>
		<view class="note_inputview">
				<textarea 
				class="note_title" 
				placeholder="Title"
				auto-height
				maxlength="100"
				v-model:value="data.title"
				@input="onInput"
				>
				{{data.title}}
				</textarea>
				<textarea 
				class="note_content" 
				placeholder="在这里编写笔记内容" 
				adjust-position="false"
				focus
				cursor-spacing="10rpx"
				maxlength="-1"
				auto-height
				v-model:value="data.content"
				@input="onInput">
				{{data.content}}
				</textarea>
		</view>

	</view>
</template>

<script>
	var _self;
	export default { 
		created(){
			_self=this
		},
		data() {
			return {
				data:{
					title:"",
					content:"",
					tag:[],
					time:"",	
				},
				passageid:0,

			}
		},
		onInit(){
			console.log("onInit")
		},
		onLoad(option){
			this.onInput()
			this.data.title="";
			this.data.content="";
			// navibar
			console.log("onload")
			// console.log(option)
			this.passageid = option['id'];
			this.data.time = option['time'];
			// console.log(time)
			uni.$once("toDetail",res=>{
				console.log(res)
				this.data = res;
				// this.title = res.title;
				// this.content = res.content;
				// this.tag = res.tag;
				// this.time = res.time;
				// this.passageid = res.passageid;
			})
		},
		onShow(){

		},
		methods: {
			onInput(){
				// var data = {
				// 		title:this.title,
				// 		content:this.content,
				// 		tag:this.tag,
				// 		time:this.time
				// 	}
				// console.log(data);
				uni.setStorageSync('detail_passage',this.data);
			},			
			back(){
				uni.navigateBack({
					delta:1
				})
			},
			more(){
				uni.showActionSheet({
					itemList:['添加tag','删除'],
					success: res=>{
						console.log(res);
						if(res.tapIndex==1){
							// console.log(this.passageid);
							uni.$emit("delete_note",this.passageid);
							uni.navigateBack()
						}
						else if(res.tapIndex==0){
							_self.addTags();
							// this.showPop=true;
							// uni.showToast({
							// 	icon: "none",
							// 	title: "还没写好",
							// 	duration:2000,
							// })
						}
					},
					fail: function(res){
						console.log(res.errMsg);
					}
				})
			},
			// cancelPop(){
			// 	this.tag="";
			// 	this.showPop=false;
			// },
			addTags(){
				console.log(this.tag)
				uni.showModal({
					title:"添加TAG",
					showCancel:true,
					ConfirmText:'确定',
					editable: true,
					placeholderText: "在这里输入TAG",
					success: (res)=>{
						console.log(res)
						if(this.data.tag.length==5){
							uni.showToast({
								icon:"none",
								title:"上限5个tag!",
								duration:2000,
							})
						}
						else if(res.content!=""){
							this.data.tag.push(res.content);
							uni.setStorageSync('detail_passage',this.data);
							uni.showToast({
								title:"添加成功:D",
								duration:2000,
							})
						}
						else{
							uni.showToast({
								icon:"none",
								title:"输入为空:(",
								duration:2000,
							})
						}
						console.log(this.data.tag)
					}
				})
			},
			deleteTags(){
				// 待实现。
			}
		}
	}
</script>

<style>
	.main_detail{
		height: 100vh;
	}
	.navigation{
		/* border: 1px solid :;000; */
		height: 170rpx;
		position: sticky;
		/* top: 0; */
		left: 0;
		width: 100%;
		z-index: 1;
		/* margin-bottom: 15rpx; */
		/* background-color: #007AFF20; */
		
	}
	.back{
		/* border: 1rpx solid #000000; */
		position: absolute;
		bottom: 0;
		font-size: 50rpx;
		border-radius: 20rpx;
		margin: 20rpx;
		margin-left: 35rpx;
	}
	.more{
		position: fixed;
		top: 110rpx;
		right: 60rpx;
		font-size: 50rpx;
	}
	.note_inputview{
		/* border: 1px solid #000000; */
		padding: 0 40rpx;
		/* display: ; */
	}
	.note_title{
		width: %;
		height: 70rpx;
		/* padding: 10rpx; */
		font-size: 60rpx;
		/* border: 1rpx solid #000000; */
		/* border-bottom: 1rpx solid #C8C7CC; */
		margin-top: 15rpx;
		overflow: auto;
		
	}
	.note_content{
		width: 95%;
		/* height: 1200rpx; */
		padding:0 10rpx;
		margin-top: 12rpx;
		margin-right: 10rpx;
		overflow: auto;
		/* border: 1rpx solid #000000; */
	}
	.time{
		font-size: 30rpx;
		color: #C0C0C0;
		float: right;
		/* border: 1rpx solid #000000; */
		/* margin-bottom: 15rpx; */
	}
	.tag{
		float: right;
		/* border: 1rpx solid #000000; */
		width: auto;
		padding: 0 10rpx;
		color: #C0C0C0;
		font-size: 30rpx;
		/* background-color: #D8D8D8; */
		border-radius: 20rpx;
	}
</style>
