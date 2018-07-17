const app = getApp()

Page({

    data: {
        load: false,
        parameter: []
    },

    onUnload() {
        clearInterval(app.inter1)
        clearInterval(app.inter2)
    },

    onLoad: function () {
        wx.showLoading({title: 'Loading'})
        this.onUnload()
        if (this.isConn()) {
            app.data.parameter = ''
            app.data.arr = []
            this.onBLE()
            this.write(arrbuffer('dda50100ffff77'))
            app['inter1'] = setInterval(() => {
                this.write(arrbuffer('dda50100ffff77'))
            }, 3333)
        } else {
            wx.navigateTo({url: '/pages/connect/connect'})
        }
    },

    onBLE() {
        wx.onBLECharacteristicValueChange((res) => {
            const hex = ab2hex(res.value)
            app.data.parameter += hex
            if (/77$/.test(hex)) {
                console.log(app.data.parameter)
                if (app.data.parameterSwitch) {
                    app.data.arr.push(app.data.parameter)
                    app.data.parameter = ''
                    this.init()
                    app.data.arr = []
                    app.data.parameterSwitch = false
                    if (!this.data.load) {
                        this.setData({
                            load: true
                        })
                    }
                    wx.hideLoading()
                } else {
                    app.data.arr.push(app.data.parameter)
                    app.data.parameter = ''
                    app.data.parameterSwitch = true
                    this.write(arrbuffer('dda50200fffe77'))
                }
            }
        })
    },

    init() {
        app.data.arr.forEach((values, i, arrays) => {
            const arr = values.slice(8, -6).match(/[\da-f]{4}/gi)
            arr.forEach((value, index, array) => {
                array[index] = parseInt(value, 16)
            })
            arrays[i] = arr
        })
        this.setData({
            parameter: app.data.arr
        })
    },

    isConn() {
        return app.data.deviceId
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
    }

})

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
    const hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2)
        }
    )
    return hexArr.join('')
}

// 将16进制转化为ArrayBuffer
function arrbuffer(hex) {
    return new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    })).buffer
}