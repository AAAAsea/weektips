<template>
	<page-meta>
		<navigation-bar
			:background-color="$store.getters.backgroundColor"
			:front-color="$store.getters.frontColor"
		/>
	</page-meta>
		<view class="nav-bar-container" :data-theme="$store.state.appTheme">
			<span class="iconfont icon-back back" @click="backToLast" v-if="backShow"></span>
			<text class="text" v-if="textShow">
				{{title}}
			</text>
		</view>
</template>

<script>
	export default {
		name:"nav-bar",
		data() {
			return {
				
			};
		},
		props:{
			title:{
				type:String,
				default:"请给title属性赋值",
			},
			backShow:{
				type:Boolean,
				default:false
			},
			textShow:{
				type:Boolean,
				default:true
			}
			
		},
		methods:{
			backToLast(){
				uni.navigateBack({
					
				})
			}
		}
	}
</script>

<style>
	.nav-bar-container{ 
		text-align: center;
		height: 90rpx;
		padding-top: 50rpx;
		z-index: 9999;
	}
	.text{
		line-height: 90rpx;
		font-weight: bold;
	}
	.back{
		transition: 0.1s;
		position: absolute;
		top: 80rpx;
		left: 30rpx;
		font-size: 50rpx;
	}
	.back:active{
		color: #0084FF;
	}
</style>
