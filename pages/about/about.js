const app = getApp()

Page({

    data: {
        about: ''
    },

    onUnload() {
        clearInterval(app.inter1)
        clearInterval(app.inter2)
    },

    onLoad: function () {
        this.onUnload()
        if (this.isConn()) {
            let about = ''
            this.write(arrbuffer('dda50500fffb77'))
            wx.onBLECharacteristicValueChange((res) => {
                const hex = ab2hex(res.value)
                about += hex
                if (/77$/.test(hex)) {
                    this.setData({
                        about: hexToString(about.slice(8, -6))
                    })
                }
            })
        } else {
            wx.navigateTo({url: '/pages/connect/connect'})
        }
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

// 16进制转字符串
function hexToString(hex) {
    let str = ''
    let arr = hex.match(/[\da-f]{2}/gi)
    for (let i = 0; i < arr.length; i++) {
        str += String.fromCharCode(parseInt(arr[i], 16))
    }
    return str
}

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