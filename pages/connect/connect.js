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
        } else if (app.data.devices) {
            this.setData({
                devices: app.data.devices
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
                app.data = {}
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
                app.data.devices = devices
                this.setData({
                    devices
                })
            }
        })
    },

    // 监听连接状态
    onState() {
        wx.onBLEConnectionStateChange((res) => {
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

            }
        })
    }
})