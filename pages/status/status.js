// pages/status/status.js

const app = getApp()

Page({

    data: {
        tabIndex: 1,
        arr: []
    },

    onLoad: function () {
        const hex = app.data.status.slice(8, -6)

        const a1 = hex.substring(0, 32).match(/[\da-f]{4}/gi)
        const a2 = hex.substring(32).match(/[\da-f]{2}/gi)
        console.log(a1.concat(a2))
        const all = a1.concat(a2)
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
        let charging = parseInt(arr[8], 16).toString(2).split('')
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
            voltage: voltage,
            all: all,
            charge: Number(charging[15]),
            discharge: Number(charging[14]),
            state: state,
            arr: arr,
            date: app.dateFormat(`${y}-${m}-${d}`, 'YYYY-MM-DD')
        })

        console.log(arr)
    },

    //切换
    tab(e) {
        this.setData({
            tabIndex: Number(e.currentTarget.dataset.index)
        })
    }
})