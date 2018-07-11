const app = getApp()

Page({

    data: {},

    onLoad: function () {
        app.data.parameter.forEach((value, index, array) => {
            console.log(value)
        })
    }

})