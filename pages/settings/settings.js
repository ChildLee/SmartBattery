// pages/settings/settings.js
Page({
    onLoad() {
        this.setData({
            electricity: wx.getStorageSync('electricity'),
            temperature: wx.getStorageSync('temperature')
        })
    },

    //电量
    electricity(e) {
        wx.setStorageSync('electricity', e.detail.value)
    },

    //温度
    temperature(e) {
        wx.setStorageSync('temperature', e.detail.value)
    }
})