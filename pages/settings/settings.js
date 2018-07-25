// pages/settings/settings.js
Page({
    data: {
        electricity: 0,
        temperature: 0
    },
    onLoad() {
        this.setData({
            electricity: wx.getStorageSync('electricity') || 0,
            temperature: wx.getStorageSync('temperature') || 0
        })
    },

    //电量
    electricity(e) {
        wx.setStorageSync('electricity', e.detail.value)
        this.setData({
            electricity: wx.getStorageSync('electricity')
        })
    },

    //温度
    temperature(e) {
        wx.setStorageSync('temperature', e.detail.value)
        this.setData({
            temperature: wx.getStorageSync('temperature')
        })
    },

    //打开电池监听
    electricityChange(e) {
        //打开
        if (e.detail.value.length) {
            wx.setStorageSync('electricitySwitch', true)
        } else {
            wx.setStorageSync('electricitySwitch', false)
        }
    },

    //打开温度监听
    temperatureChange(e) {
        //打开
        if (e.detail.value.length) {
            wx.setStorageSync('temperatureSwitch', true)
        } else {
            wx.setStorageSync('temperatureSwitch', false)
        }
    }
})