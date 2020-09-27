<template>
	<view class="app1">
		<!-- <navigator url="/pages/master/login/login" hover-class="className">登录</navigator> -->
		<div class="list" v-if="albums.length">
			<div class="lis" v-for="(item, index) in albums" :key="item._id">
				<div class="top">
					<image :src="item.userInfo.avatarUrl" /><span>{{ item.userInfo.nickName }}</span>
				</div>
				<div class="text" :class="{ showmore: item.showmore }" @click="showmore(index)" v-if="item.textarea">{{ item.textarea }}</div>
				<div class="imgs" v-if="item.imagesUrls.length">
					<image mode="aspectFill" :src="item1.https" v-for="item1 in item.imagesUrls" :key="item1.cloud" />
					<image class="noimage" />
					<image class="noimage" />
				</div>
				<div class="time">{{ item.created | $timefilter }}</div>
				<div class="address" v-if="item.location.latitude"><span>地点 : </span>{{ item.location.address + item.location.name }}</div>
			</div>
		</div>
		<div v-else class="empty">
			您的相册空空如也,点击右上角加号按钮上传到相册
		</div>
		<navigator class="addImg" url="/pages/album/albumupload/albumupload" hover-class="className">+</navigator>
	</view>
</template>

<script>
export default {
	data() {
		return {
			albums: [],
			page: 1,
		}
	},
	methods: {
		showmore(i) {
			this.albums[i].showmore = !this.albums[i].showmore
		},
		getAlbums(e) {
			this.$request("getlist", "album", { page: this.page })
				.then((res) => {
					if (res.data.length) {
						res.data.forEach((element) => {
							element.showMore = false
						})
						if (e == "重载") {
							this.albums = res.data
						} else {
							this.albums.push(...res.data)
						}
					} else {
						this.$showToast("没有相册咯~")
						this.page--
					}
				})
				.catch((err) => {
					this.$showToast(err)
				})
		},
	},
	onPullDownRefresh() {
		this.page = 1
		this.getAlbums("重载")
		// 下拉
	},
	onReachBottom() {
		this.page++
		this.getAlbums()
		//触底
	},
	onLoad() {
		this.albums = []
		this.getAlbums()
	},
	onShow() {
		var albumsUpdataTime = uni.getStorageSync("albumsUpdataTime")
		if (new Date().getTime() - albumsUpdataTime < 10 * 1000) {
			this.$request("getlist", "album", { page: 1, limit: 1 })
				.then((res) => {
					if (res.data.length) {
						this.albums.unshift(...res.data)
					} else {
						this.$showToast("没有相册咯~")
					}
				})
				.catch((err) => {
					this.$showToast(err)
				})
		}
	},
}
</script>

<style lang="scss">
.list {
	font-size: 28upx;
	padding: 20upx 0;
	.lis {
		border-bottom: 1px solid #ececec;
		padding: 0 20upx;
		padding-bottom: 30upx;
		margin-bottom: 30upx;
		.top {
			display: flex;
			align-items: center;
			image {
				width: 60upx;
				height: 60upx;
				border-radius: 8upx;
				margin-right: 20upx;
			}
		}
		.text {
			// max-height: 200upx;
			padding: 10upx 0 10upx 80upx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 5;
			-webkit-box-orient: vertical;
			line-height: 1.6;
		}
		.showmore {
			overflow: visible;
			-webkit-line-clamp: 999;
		}
		.time {
			padding-left: 80upx;
			font-size: 20upx;
			margin-bottom: 20upx;
			color: #999;
			margin-top: -20upx;
		}
		.imgs {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			padding: 10upx 6upx;
			max-height: 660upx;
			padding-left: 80upx;
			overflow: hidden;
			image {
				width: 200upx;
				height: 200upx;
				margin-bottom: 20upx;
			}
			.noimage {
				height: 0;
				margin: 0;
			}
		}
		.address {
			font-size: 20upx;
			padding-left: 80upx;
			color: #999999;
			span {
				margin-right: 10upx;
			}
		}
	}
	.lis:last-child {
		border-bottom: 0;
	}
}
.addImg {
	padding: 0;
	width: 60upx;
	height: 60upx;
	line-height: 54upx;
	border-radius: 50%;
	border: 1px solid #ccc;
	color: #999;
	box-sizing: border-box;
	position: fixed;
	vertical-align: middle;
	font-size: 32upx;
	text-align: center;
	right: 30upx;
	top: 100upx;
	z-index: 999;
	background-color: #fff;
	font-size: 40upx;
}
.empty {
	font-size: 28upx;
	position: fixed;
	top: 50%;
	left: 50%;
	text-align: center;
	transform: translate(-50%, -50%);
}
</style>
