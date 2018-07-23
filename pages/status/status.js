// pages/status/status.js

const app = getApp()

Page({

    data: {
        load: false,
        tabIndex: 1,
        arr: []
    },

    onUnload() {
        clearInterval(app.inter1)
        clearInterval(app.inter2)
    },

    onLoad: function () {
        wx.showLoading({title: 'Loading'})
        this.onUnload()
        if (this.isConn()) {
            app.data.hex = ''
            app.data.voltage = ''
            app.data.status = ''
            this.onBLE()
            this.write(arrbuffer('dda50300fffd77'))
            app['inter1'] = setInterval(() => {
                this.write(arrbuffer('dda50300fffd77'))
            }, 2222)
        } else {
            wx.navigateTo({url: '/pages/connect/connect'})
        }
    },

    onBLE() {
        wx.onBLECharacteristicValueChange((res) => {
            const hex = ab2hex(res.value)
            app.data.hex += hex
            if (/77$/.test(hex)) {
                if (app.data.statusSwitch) {
                    app.data.voltage = app.data.hex
                    app.data.hex = ''
                    this.init()
                    app.data.statusSwitch = false
                    if (!this.data.load) {
                        this.setData({
                            load: true
                        })
                    }
                    wx.hideLoading()
                } else {
                    app.data.status = app.data.hex
                    app.data.hex = ''
                    app.data.statusSwitch = true
                    this.write(arrbuffer('dda50400fffc77'))
                }
            }
        })
    },

    init() {
        const hex = app.data.status.slice(8, -6)

        const a1 = hex.substring(0, 36).match(/[\da-f]{4}/gi)
        const a2 = hex.substring(36).match(/[\da-f]{2}/gi)

        const all = a1.concat(a2)
        console.log(all)
        const current = parseInt(all[1].substring(1) , 16)
        let arr = []
        all.forEach((value, index, array) => {
            arr[index] = parseInt(value, 16)
        })

        const y = 2000 + (parseInt(all[5], 16) >> 9)
        const m = (parseInt(all[5], 16) >> 5) & 0x0f
        const d = parseInt(all[5], 16) & 0x1f
        //均衡状态
        let state = parseInt(arr[8], 16).toString(2).split('')
        let len = state.length
        for (let i = 0; i < 16 - len; i++) {
            state.unshift('0')
        }
        //充电状态
        let charging = parseInt(arr[11], 16).toString(2).split('')
        let len1 = charging.length
        for (let i = 0; i < 16 - len1; i++) {
            charging.unshift('0')
        }

        //单体电压
        const voltage = app.data.voltage.slice(8, -6).match(/[\da-f]{4}/gi)

        voltage.forEach((value, index, array) => {
            array[index] = parseInt(value, 16)
        })
        this.setData({
            current:current,
            voltage: voltage,
            all: all,
            charge: Number(charging[15]),
            discharge: Number(charging[14]),
            state: state,
            arr: arr,
            date: app.dateFormat(`${y}-${m}-${d}`, 'YYYY-MM-DD')
        })
    },

    isConn() {
        return app.data.deviceId
    },

    //切换
    tab(e) {
        this.setData({
            tabIndex: Number(e.currentTarget.dataset.index)
        })
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