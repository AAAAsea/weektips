<template>
	<view :data-theme="this.$store.state.appTheme" class="main_setting">
		<uni-navbar 
		title="设置"
		:backShow="true"
		></uni-navbar>
		<view class="list">
			<view class="content">
				<view class="box">
					<view class="name">
						深色模式
						<switch :checked="$store.state.appTheme=='dark'?true:false" class="swicthbtn" @change="checkChange" color="#017aff"></switch>
					</view>
				</view>
				<view class="box">
					<view class="name" style="line-height: 100rpx;">
						动画效果
						<picker-view style="line-height: 50rpx;" v-if="visible" :indicator-style="indicatorStyle" :value="currentTransitionType" @change="bindChange" class="picker-view">
							<picker-view-column>
								<view class="cell" v-for="(item,index) in transitionTypes" :key="index">{{item}}</view>
							</picker-view-column>
						</picker-view>
					</view>
				</view>
				<view class="box">
					<view class="name">
						保留主题模式
						<switch :checked="$store.state.settings.saveTheme" class="swicthbtn" @change="$store.state.settings.saveTheme = !$store.state.settings.saveTheme" color="#017aff"></switch>
					</view>
				</view>
				<view class="box">
					<view class="name">
						保留动画模式
						<switch :checked="$store.state.settings.saveTransition" class="swicthbtn" @change="$store.state.settings.saveTransition = !$store.state.settings.saveTransition" color="#017aff"></switch>
					</view>
				</view>
				<view class="box">
					<view class="name">
						保留登录密码
						<switch :checked="$store.state.settings.saveLogin" class="swicthbtn" @change="$store.state.settings.saveLogin = !$store.state.settings.saveLogin" color="#017aff"></switch>
					</view>
				</view>
				<view class="box">
					<view class="name">
						启动自动检查更新
						<switch :checked="$store.state.settings.autoUpdate" class="swicthbtn" @change="$store.state.settings.autoUpdate = !$store.state.settings.autoUpdate" color="#017aff"></switch>
					</view>
				</view>
				<view class="box">
					<view class="name">
						底部导航栏显示更多
						<switch :checked="$store.state.settings.midTabShow" class="swicthbtn" @change="changeTabShow" color="#017aff"></switch>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'picker-view',
				visible: true,
				indicatorStyle: `height: 50rpx;`,
				transitionTypes: [1,2,3],
			}
		},
		onLoad(){
			// console.log(this.currentTransitionType)
			// console.log(this.$store.state)
		},
		onShow() {
			// console.log(this.$store.state.settings)
		},
		onBackPress() {
			uni.setStorageSync('settings',this.$store.state.settings)
		},
		onHide() {
			uni.setStorageSync('settings',this.$store.state.settings)
		},
		computed: {
			currentTransitionType(){
				return [this.$store.state.transitionTypeNumber];
			}
		},
		methods: {
			checkChange(){
				this.ChangeAppTheme('dark');
			},
			bindChange(e){
				// console.log(e)
				uni.vibrateShort();
				this.$store.commit('CHANGE_TRANSITION_TYPE',e.detail.value[0])
			},
			changeTabShow(e){
				this.$store.state.settings.midTabShow = e.detail.value
				this.$store.commit('CHANGE_MIDTAB_SHOW')
			}
		}
	}
</script>

<style>
	.main_setting{
		height: 100vh;
	}
	/* *{
		transition-timing-function: ease-in-out;
		transition: 0.3s;
	} */
	.cell {
		align-items: center;
		justify-content: center;
		text-align: center;
		border-radius: 15rpx;
	}
	.picker-view{
		float: right;
		width: 50rpx;
		height: 100rpx;
		background-color: #ffffff;
		overflow: hidden;
		/* border: 1px solid #0077AA; */
		text-align: center;
		margin-right: 35rpx;
		border-radius: 15rpx;
	}
	.list{
		/* border: 1px solid red; */
		overflow: hidden;
		align-items: center;
	}
	.swicthbtn{
		transform: scale(0.6);
		float: right;
		/* margin-bottom: 30rpx; */
		margin-top: -7rpx;

	}
	.content{
		/* border: 1px solid #000000; */
		/* background-color: #ffffff; */
		border-radius: 20rpx;
		margin: 0 30rpx;
		font-size: 27rpx;
		color: #929293;
		line-height: 50rpx;
		height: auto;
		margin-top: 40rpx;
		padding: 30rpx 30rpx 30rpx 30rpx;
	}
	.box{
		margin: 20rpx 0;
		height: fit-content;
		font-size: 35rpx;
		overflow: auto;
	}
	.name{
		/* color:#D8D8D8; */
		font-size: 32rpx;
		overflow: auto;
	}
	
</style>
