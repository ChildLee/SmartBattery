const app = getApp()

Page({

    data: {
        about: ''
    },

    onLoad: function () {
        if (app.data.about) {
            this.setData({
                about: hexToString(app.data.about.slice(8, -6))
            })
        } else {
            console.log(app)
        }
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