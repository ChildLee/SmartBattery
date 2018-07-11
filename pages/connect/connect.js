const app = getApp()

Page({

    data: {
        //设备列表
        devices: [],
        //服务列表
        services: {},
        //连接的设备ID
        deviceId: '',
        serviceId: '',
        characteristicId: '',
        name: ''
    },

    onLoad() {
        if (app.data.deviceId) {
            this.setData({
                devices: app.data.devices,
                services: app.data.services,
                deviceId: app.data.deviceId,
                serviceId: app.data.serviceId,
                characteristicId: app.data.characteristicId,
                name: app.data.name
            })
        } else {
            this.init()
        }
    },

    // 初始化
    init() {
        // 初始化小程序蓝牙模块
        this.open().then(() => {
            this.onDevices()
            this.onState()
            // 搜索蓝牙设备
            this.start()
        }).catch(err => {
            wx.showToast({title: err['errMsg'], icon: 'none'})
        })
    },

    // 刷新
    refresh() {
        wx.closeBluetoothAdapter({
            success: () => {
                this.setData({
                    // 设备列表
                    devices: [],
                    // 连接的设备ID
                    deviceId: '',
                    name: ''
                })
                this.init()
            }
        })
    },

    // 连接低功耗蓝牙设备
    conn(e) {
        wx.showLoading({title: 'connection'})
        const {deviceId, name} = e.currentTarget.dataset.device
        new Promise((resolve, reject) => {
            wx.createBLEConnection({
                deviceId: deviceId,
                success: (res) => {
                    if (res['errCode'] === 0) {
                        this.setData({deviceId, name})
                        resolve()
                    }
                },
                fail: (err) => {
                    reject(err['errMsg'])
                }
            })
        }).then(() => {
            // 获取蓝牙设备所有服务
            return this.getServices(deviceId)
        }).then(res => {
            if (res['errCode'] === 0) {
                this.setData({
                    services: res.services
                })
            }
        }).then(() => {
            const services = this.data.services
            return new Promise((resolve) => {
                // 遍历所有服务获取特征值
                services.forEach((value, index, array) => {
                    this.getCharacteristics(deviceId, value['uuid']).then(characteristics => {
                        array[index]['characteristics'] = characteristics.characteristics
                        if (index === array.length - 1) {
                            this.setData({
                                services
                            })
                            resolve(services)
                        }
                    })
                })
            })
        }).then(services => {
            // 遍历所有特征值找到需要的
            services.forEach((value, index, array) => {
                value.characteristics.forEach((values, indexs, arrays) => {
                    if (/FFE1/.test(values['uuid'])) {
                        this.setData({
                            serviceId: value['uuid'],
                            characteristicId: values['uuid']
                        })
                        return
                    }
                })
            })
        }).then(() => {
            //启动特征值变化
            this.notify(this.data.deviceId, this.data.serviceId, this.data.characteristicId)
        }).then(() => {
            Object.assign(app.data, this.data)
            wx.hideLoading()
            wx.navigateBack({})
        }).catch(err => {
            wx.showToast({title: err, icon: 'none'})
        })
    },

    // 打开蓝牙
    open() {
        return new Promise((resolve, reject) => {
            wx.openBluetoothAdapter({
                success: function (res) {
                    resolve(res)
                },
                fail: function (err) {
                    reject(err)
                }
            })
        })
    },

    // 监听寻找到新设备的事件
    onDevices() {
        wx.onBluetoothDeviceFound((res) => {
            if (res['devices'][0].name) {
                const devices = this.data.devices.concat(res['devices'])
                this.setData({
                    devices
                })
            }
        })
    },

    // 监听连接状态
    onState() {
        wx.onBLEConnectionStateChange((res) => {
            console.log('蓝牙连接状态')
            console.log(res)
            if (!res.connected) {
                app['data'] = {}
                this.setData({
                    devices: [],
                    deviceId: '',
                    name: ''
                })
            }
        })
    },

    // 搜索蓝牙设备
    start() {
        return new Promise((resolve, reject) => {
            wx.startBluetoothDevicesDiscovery({
                success: function (res) {
                    resolve(res)
                },
                fail: (err) => {
                    reject(err)
                }
            })
        })
    },

    // 获取蓝牙设备所有服务
    getServices(deviceId) {
        return new Promise((resolve, reject) => {
            wx.getBLEDeviceServices({
                deviceId: deviceId,
                success: function (res) {
                    resolve(res)
                },
                fail: (err) => {
                    reject(err)
                }
            })
        })
    },

    // 获取所有特征值
    getCharacteristics(deviceId, serviceId) {
        return new Promise((resolve, reject) => {
            wx.getBLEDeviceCharacteristics({
                deviceId: deviceId,
                serviceId: serviceId,
                success: function (res) {
                    resolve(res)
                },
                fail: (err) => {
                    reject(err)
                }
            })
        })
    },

    // 启用低功耗蓝牙设备特征值变化时的 notify 功能
    notify(deviceId, serviceId, characteristicId) {
        wx.notifyBLECharacteristicValueChange({
            state: true,
            deviceId: deviceId,
            serviceId: serviceId,
            characteristicId: characteristicId,
            success: () => {
                //监听特征值变化
                this.onCharacteristic()
            },
            fail: (err) => {
                console.log(err)
            }
        })
    },

    // 监听低功耗蓝牙设备的特征值变化
    onCharacteristic() {
        wx.onBLECharacteristicValueChange((res) => {
            const hex = ab2hex(res.value)
            console.log(hex)
            app.data.hex += hex
            if (/77$/.test(hex)) {
                this.over()
                app.data.hex = ''
            }
        })
    },

    // 获取数据结束
    over() {
        if (app.data.command === 1) {
            let arr = []
            arr.push(app.data.hex)
            app.data.parameter = arr
            app.data.command = 2
            this.write(arrbuffer('dda50200fffe77'))
            return
        }
        if (app.data.command === 2) {
            app.data.parameter.push(app.data.hex)
            wx.navigateTo({url: '/pages/parameter/parameter'})
            wx.hideLoading()
            return
        }
        if (app.data.command === 5) {
            app.data.about = app.data.hex
            wx.navigateTo({url: '/pages/about/about'})
            wx.hideLoading()
            return
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