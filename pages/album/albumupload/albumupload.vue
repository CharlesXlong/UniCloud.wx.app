<template>
	<view class="app">
		<div class="up">
			<div class="left">请键入内容</div>
			<div class="upload" @click="upload">上传</div>
		</div>
		<textarea v-model="textarea" placeholder="在这一刻的想法..." class="textarea" maxlength="-1" />
		<div class="images">
			<image class="image" :src="item.path" @click="deletImage(index)" v-for="(item, index) in images" :key="item.path" mode="aspectFill" />
			<div class="image imageadd" v-if="images.length < 9" @click="chooseImg">+</div>
			<image class="image noimage" />
			<image class="image noimage" />
		</div>
		<div class="option">
			<div class="item location" @click="getLocation">
				<span>所在位置 :</span>
				<span>{{ location.address + location.name || "未知" }}</span>
			</div>
		</div>
	</view>
</template>

<script>
export default {
	data() {
		return {
			textarea: "",
			images: [],
			location: {},
			imagesUrl: [],
		}
	},
	methods: {
		deletImage(i) {
			let that = this
			uni.showModal({
				title: "提示",
				content: "您要删除该照片吗?",
				success: function (res) {
					if (res.confirm) {
						that.images.splice(i, 1)
					} else if (res.cancel) {
						console.log("用户点击取消")
					}
				},
			})
		},
		chooseImg() {
			// 从相册选择6张图
			let that = this
			uni.chooseImage({
				count: 9 - that.images.length,
				sizeType: ["compressed"],
				// sourceType: ["album"],    //camera
				success(res) {
					console.log(res)
					that.images.push(...res.tempFiles)
				},
			})
		},
		getLocation() {
			let that = this
			uni.getLocation({
				type: "wgs84",
				success: function (res) {
					console.log("当前位置的经度：" + res.longitude)
					console.log("当前位置的纬度：" + res.latitude)
					uni.chooseLocation({
						latitude: res.latitude,
						longitude: res.longitude,
						success: function (res1) {
							let data = {}
							data.name = res1.name
							data.address = res1.address
							data.latitude = res1.latitude
							data.longitude = res1.longitude
							that.location = data
						},
					})
				},
			})
		},
		upload() {
			var that = this
			if (this.images.length) {
				let i = 0
				;(function upload(params) {
					// promise
					let time = new Date().getTime()
					uniCloud
						.uploadFile({
							filePath: params.path,
							cloudPath: `album/${time}.jpg`,
							onUploadProgress: function (progressEvent) {
								var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
								uni.showLoading({
									title: `${i + 1}/${that.images.length}    ${percentCompleted}%`,
									mask: true,
								})
							},
						})
						.then((res) => {
							i++
							that.imagesUrl.push({
								cloud: res.fileID,
								https: `https://7472-trajectory-0e70c5-1302738148.tcb.qcloud.la/album/${time}.jpg`,
							})
							if (i < that.images.length) {
								upload(that.images[i])
							} else {
								uni.hideLoading()
								that.addAlbum()
							}
						})
						.catch((err) => {
							that.$showToast(err)
						})
				})(that.images[i])
			} else if (this.textarea) {
				this.addAlbum()
			} else {
				this.$showToast("您要上传的内容为空~")
			}
		},
		addAlbum() {
			this.$request("add", "album", {
				textarea: this.textarea,
				location: this.location,
				imagesUrls: this.imagesUrl,
			})
				.then((res) => {
					if (res.id) {
						this.$showToast("上传成功...")
						uni.setStorageSync("albumsUpdataTime", new Date().getTime())
						setTimeout(() => {
							uni.navigateBack({
								delta: 1,
							})
						}, 500)
					}
				})
				.catch((err) => {
					this.$showToast(err)
				})
		},
	},
}
</script>

<style lang="scss">
.app {
	font-size: 28upx;
}
.up {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20upx;
	.left {
		line-height: 2em;
	}
	.upload {
		padding: 6upx 18upx;
		border: 1upx solid #ccc;
		background-color: #eee;
		display: inline-block;
		border-radius: 4upx;
		text-align: center;
	}
}
.textarea {
	min-height: 100upx;
	// border: 1px solid #eee;
	width: 100%;
	height: 200upx;
}
.images {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	padding: 10upx 6upx;
	.image {
		width: 220upx;
		height: 220upx;
		margin-bottom: 20upx;
	}
	.noimage {
		height: 0;
		margin-bottom: 0;
	}
	.imageadd {
		text-align: center;
		line-height: 220upx;
		font-size: 50upx;
		background-color: #ececec;
		color: #ccc;
	}
}
.option {
	.item {
		border-top: 1upx solid #ececec;
		border-bottom: 1upx solid #ececec;
		height: 100upx;
		padding: 0 20upx;
	}
	.location {
		display: flex;
		justify-content: space-between;
		align-items: center;
		span:first-child {
			flex: 2;
			margin-right: 10upx;
		}
		span:last-child {
			flex: 8;
			text-align: right;
		}
	}
}
</style>
