<script>
export default {
	globalData: {
		_openid: "",
		userinfo: {},
	},
	onLaunch: function () {
		var that = this
		// if (!wx.cloud) {
		// 	console.error("请使用 2.2.3 或以上的基础库以使用云能力")
		// } else {
		// 	wx.cloud.init({
		// 		// env 参数说明：
		// 		//   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
		// 		//   此处请填入环境 ID, 环境 ID 可打开云控制台查看
		// 		//   如不填则使用默认环境（第一个创建的环境）
		// 		// env: 'my-env-id',
		// 		traceUser: true,
		// 	})
		// }
		let _openid = uni.getStorageSync("_openid")
		if (_openid) {
			this.globalData._openid = _openid
			uni.getUserInfo({
				provider: "weixin",
				success(infoRes) {
					that.globalData.userinfo = infoRes.userInfo
				},
			})
		} else {
			uni.reLaunch({
				url: "/pages/master/login/login",
			})
		}
		// console.log(this.globalData)
		console.log("globalData:", this.globalData)
		console.log("App Launch")
	},
	onShow: function () {
		console.log("App Show")
	},
	onHide: function () {
		console.log("App Hide")
	},
}
</script>

<style>
/*每个页面公共css */
.app {
	padding: 20upx;
}
</style>
