const app = getApp()

Page({

    data: {
        parameter: []
    },

    onLoad: function () {
        if (app.data.parameter.length) {
            app.data.parameter.forEach((values, i, arrays) => {
                const arr = values.slice(8, -6).match(/[\da-f]{4}/gi)
                arr.forEach((value, index, array) => {
                    array[index] = parseInt(value, 16)
                })
                arrays[i] = arr
            })
            this.setData({
                parameter: app.data.parameter
            })
            console.log(app.data.parameter)
        }
    }

})