//index.js
//获取应用实例
const app = getApp()

Page({
    data: {},

    onLoad: function () {
        this.init()
        setInterval(() => {
            if (this.isConn()) {
                this.init()
                app.data.command = 7
                this.write(arrbuffer('dda50300fffd77'))
            } else {
                wx.navigateTo({url: '/pages/connect/connect'})
            }
        }, 5000)
        setInterval(() => {
            if (this.isConn()) {
                const electricity = wx.getStorageSync('electricity')
                const temperature = wx.getStorageSync('temperature')
                if (this.data.electricity < electricity) {
                    wx.showToast({
                        title: `Battery power is less than ${this.data.electricity}%`,
                        icon: 'none',
                        duration: 5000
                    })
                }
                if (this.data.temperature > temperature) {
                    wx.showToast({
                        title: `Battery temperature is higher than ${this.data.temperature}℃ `,
                        icon: 'none',
                        duration: 5000
                    })
                }
            } else {
                wx.navigateTo({url: '/pages/connect/connect'})
            }
        }, 1000 * 60 * 5)
    },

    isConn() {
        return app.data.deviceId
    },

    init() {
        const hex = app.data.home.slice(8, -6)

        const a1 = hex.substring(0, 32).match(/[\da-f]{4}/gi)
        const a2 = hex.substring(32).match(/[\da-f]{2}/gi)

        const all = a1.concat(a2)
        //温度
        let Temperature = parseInt(all[15] + all[16], 16)
        let arr = []
        all.forEach((value, index, array) => {
            arr[index] = parseInt(value, 16)
        })

        this.drawCircle(arr[10] / 100)
        this.setData({
            Temperature,
            arr: arr,
            //电量
            electricity: arr[10]
        })
    },

    drawProgressbg: function () {
        // 使用 wx.createContext 获取绘图上下文 context
        let ctx = wx.createCanvasContext('canvasProgressbg')
        ctx.setLineWidth(10)// 设置圆环的宽度
        ctx.setStrokeStyle('#3271ff') // 设置圆环的颜色
        ctx.setLineCap('round') // 设置圆环端点的形状
        ctx.beginPath()//开始一个新的路径
        ctx.arc(110, 110, 100, 0, 2 * Math.PI, false)
        //设置一个原点(100,100)，半径为90的圆的路径到当前路径
        ctx.stroke()//对当前路径进行描边
        ctx.draw()
    },

    drawCircle: function (step) {
        let context = wx.createCanvasContext('canvasProgress')
        // 设置渐变
        // let gradient = context.createLinearGradient(200, 100, 100, 200)
        // gradient.addColorStop('0', '#2661DD')
        // gradient.addColorStop('0.5', '#40ED94')
        // gradient.addColorStop('1.0', '#5956CC')

        context.setLineWidth(20)
        context.setStrokeStyle('#6dd34c')
        context.setLineCap('round')
        context.beginPath()
        // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
        context.arc(110, 110, 100, -Math.PI / 2, step * Math.PI * 2 - Math.PI / 2, false)
        context.stroke()
        context.draw()
    },

    onReady: function () {
        this.drawProgressbg()
        // this.drawCircle(.5)
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

// 将16进制转化为ArrayBuffer
function arrbuffer(hex) {
    return new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    })).buffer
}