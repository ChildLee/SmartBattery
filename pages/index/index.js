const app = getApp()

Page({
    onLoad() {
        //1.dda50100ffff77
        //2.dda50200fffe77
        //3.dda50300fffd77
        //4.dda50400fffc77
        //5.dda50500fffb77
    },

    isConn() {
        return app.data.deviceId
    },

    //home
    home() {
        if (this.isConn()) {
            wx.showLoading({title: 'Loading'})
            app.data.command = 6
            this.write(arrbuffer('dda50300fffd77'))
        } else {
            wx.navigateTo({url: '/pages/connect/connect'})
        }
    },

    //Status
    status() {
        if (this.isConn()) {
            wx.showLoading({title: 'Loading'})
            app.data.command = 3
            this.write(arrbuffer('dda50300fffd77'))
        } else {
            wx.navigateTo({url: '/pages/connect/connect'})
        }
    },

    //parameter
    parameter() {
        if (this.isConn()) {
            wx.showLoading({title: 'Loading'})
            app.data.command = 1
            this.write(arrbuffer('dda50100ffff77'))
        } else {
            wx.navigateTo({url: '/pages/connect/connect'})
        }
    },

    //about
    about() {
        if (this.isConn()) {
            wx.showLoading({title: 'Loading'})
            app.data.command = 5
            this.write(arrbuffer('dda50500fffb77'))
        } else {
            wx.navigateTo({url: '/pages/connect/connect'})
        }
    },

    // 写入二进制数据
    write(buffer) {
        return new Promise((resolve, reject) => {
            wx.writeBLECharacteristicValue({
                deviceId: app.data.deviceId,
                serviceId: app.data.serviceId,
                characteristicId: app.data.characteristicId,
                value: buffer,
                success: (res) => {
                    resolve(res)
                },
                fail: (err) => {
                    reject(err)
                }
            })
        })
    },

    // 读取数据
    read() {
        return new Promise((resolve, reject) => {
            wx.readBLECharacteristicValue({
                deviceId: app.data.deviceId,
                serviceId: app.data.serviceId,
                characteristicId: app.data.characteristicId,
                success: (res) => {
                    resolve(res)
                },
                fail: (err) => {
                    reject(err)
                }
            })
        })
    }
})

// 将16进制转化为ArrayBuffer
function arrbuffer(hex) {
    return new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    })).buffer
}