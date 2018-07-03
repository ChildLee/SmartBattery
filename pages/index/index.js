Page({
    data: {},

    onLoad() {
        wx.openBluetoothAdapter({
            success: (res) => {
                console.log(res)
            },
            complete: res => {
                console.log(res)
            }
        })
    }
})