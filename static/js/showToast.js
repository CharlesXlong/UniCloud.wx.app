export default (msg, time = 2000, icon = 'none') => {
    uni.showToast({
        title: msg,
        duration: time,
        icon: icon,
        mask: true
    });
}