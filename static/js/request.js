const request = (name = '', tableName = '', param = {}) => {
    return new Promise((resolve, reject) => {
        let _openid = getApp().globalData._openid
        let data = {}
        if (_openid) {
            data._openid = _openid
        } else {
            uni.showToast({
                title: '尚未登录',
                duration: 2000,
                icon: 'none',
                mask: true
            })
            reject('未登录')
        }
        if (tableName) {
            data.tableName = tableName
        } else {
            reject('表名')
        }
        data.data = param
        data.data._openid = _openid
        data.data.userInfo = getApp().globalData.userinfo
        uni.hideLoading();
        uni.showLoading({
            title: '加载中',
            mask: true
        });
        uniCloud.callFunction({
            name: name,
            data: data
        }).then(res => {
            uni.hideLoading();
            uni.stopPullDownRefresh()
            resolve(res.result)
        }).catch(err => {
            uni.hideLoading();
            uni.stopPullDownRefresh()
            reject(err)
            uni.showToast({
                title: err,
                duration: 2000,
                icon: 'none',
                mask: true
            })
        })
    })
}

export default request;

