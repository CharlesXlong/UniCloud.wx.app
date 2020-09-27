<template>
	<div>
		<button class="join" open-type="getUserInfo" @getuserinfo="getUserInfo">开启自己的风景</button>
	</div>
</template>

<script>
export default {
	data() {
		return {}
	},
	methods: {
		getUserInfo(e) {
			let that = this
			if (e && e.detail.errMsg !== "getUserInfo:ok") {
				this.$showToast("小程序没有获取到您的微信信息,请点击微信登录再次获取")
				//不可return   onLoad调用了下面的代码
			}
			uni.getUserInfo({
				provider: "weixin",
				success(infoRes) {
					getApp().globalData.userinfo = infoRes.userInfo
					that.getOpenId(infoRes)
				},
			})
		},

		getOpenId(e) {
			let that = this
			// uniapp封装的不返回openid
			// uniCloud
			// 	.callFunction({
			// 		name: "login",
			// 		data: { a: 1 },
			// 	})
			// 	.then((res) => {
			// 		console.log(res)
			// 	})

			// 微信的要单独访问微信的云开发  在app.vue里初始化wx.cloud.init

			// wx.cloud.callFunction({
			// 	name: "login",
			// 	data: {},
			// 	success: (res) => {
			// 		console.log("[云函数] [login] user : ", res)

			// 	},
			// 	fail: (err) => {
			// 		console.error("[云函数] [login] 调用失败", err)
			// 	},
			// })

			uni.login({
				provider: "weixin",
				success(loginRes) {
					uniCloud
						.callFunction({
							name: "http",
							data: {
								url: `https://api.weixin.qq.com/sns/jscode2session?appid=wxcfa4d0599b9637c8&secret=6aba4b7bcd77583e1c46ec7756ca0032&js_code=${loginRes.code}&grant_type=authorization_code`,
								methods: "get",
							},
						})
						.then((res) => {
							uni.hideLoading()
							getApp().globalData._openid = JSON.parse(res.result).openid
							uni.setStorageSync("_openid", JSON.parse(res.result).openid)
							//查询用户
							that.$request("getinfo", "userInfo").then((getInfoRes) => {
								if (!getInfoRes.data.length) {
									// 没找到就新建
									that.$request("add", "userInfo", { ...e.userInfo }).then((addInfoRes) => {
										if (addInfoRes.id) {
											that.$showToast("登录成功,正在前往")
											setTimeout(() => {
												uni.reLaunch({
													url: "/pages/master/index/index",
												})
											}, 1800)
										} else {
											that.$showToast("创建失败")
										}
									})
								} else {
									that.$showToast("登录成功,正在前往")
									setTimeout(() => {
										uni.reLaunch({
											url: "/pages/master/index/index",
										})
									}, 1800)
								}
							})
						})
						.catch((err) => {
							uni.hideLoading()
							that.$showToast(err)
						})
				},
			})
		},
	},
	onLoad() {
		// // 获取用户信息
		// var that = this
		// uni.getSetting({
		// 	success(res) {
		// 		if (res.authSetting["scope.userInfo"]) {
		// 			// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
		// 			that.getUserInfo()
		// 		}
		// 	},
		// })
	},
}
</script>

<style lang="scss">
page {
	background: url("http://5b0988e595225.cdn.sohucs.com/images/20171023/dd4a4d5fdf584e5791b5f98c72d8e20d.jpeg") no-repeat;
	background-size: 750upx 100%;
	background-position: center center;
}
.join {
	background: transparent;
	position: fixed;
	left: 50%;
	top: 85%;
	transform: translate(-50%, 0);
	color: #fff;
	border-radius: 28upx;
	z-index: 999;
}
</style>
