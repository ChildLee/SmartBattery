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
            wx.navigateTo({url: '/pages/home/home'})
        } else {
            wx.navigateTo({url: '/pages/connect/connect'})
        }
    },

    //Status
    status() {
        if (this.isConn()) {
            wx.navigateTo({url: '/pages/status/status'})
        } else {
            wx.navigateTo({url: '/pages/connect/connect'})
        }
    },

    //parameter
    parameter() {
        if (this.isConn()) {
            wx.navigateTo({url: '/pages/parameter/parameter'})
        } else {
            wx.navigateTo({url: '/pages/connect/connect'})
        }
    },

    //about
    about() {
        if (this.isConn()) {
            wx.navigateTo({url: '/pages/about/about'})
        } else {
            wx.navigateTo({url: '/pages/connect/connect'})
        }
    }
})
