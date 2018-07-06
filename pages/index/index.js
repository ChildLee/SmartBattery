Page({
    data: {},

    onLoad() {
        this.init()
    },

    //0.初始化/刷新
    init() {
        this.closeBLE()
        Promise.resolve().then(() => {
            return this.openBLE()
        }).then(() => {
            this.onBLEFound()
            this.onBLEConnState()
            this.startBLE()
        }).catch(err => {
            wx.showToast({title: err['errMsg'], icon: 'none'})
        })
    },

    //0000FFE0-0000-1000-8000-00805F9B34FB
    //7C:EC:79:FC:3B:EB
    //0000FFE1-0000-1000-8000-00805F9B34FB
    conn() {
        this.connectionBLE('7C:EC:79:FC:3B:EB').then(res => {
            console.log(res)
        })
    },

    //获取特征值
    getC() {
        this.getCharacteristic('7C:EC:79:FC:3B:EB', '0000FFE0-0000-1000-8000-00805F9B34FB')
    },

    //获取服务
    getService() {
        this.getServices('7C:EC:79:FC:3B:EB').then(res => {
            console.log(res)
        })
    },

    //发送指令
    go() {
        let buffer = new ArrayBuffer(1)
        let dataView = new DataView(buffer)
        dataView.setUint8(0, 0)

        this.writeBLE('7C:EC:79:FC:3B:EB', '0000FFE0-0000-1000-8000-00805F9B34FB', '0000FFE1-0000-1000-8000-00805F9B34FB', '').then(res => {
            console.log(res)
        })
    },

    //1.打开蓝牙
    openBLE() {
        return new Promise((resolve, reject) => {
            wx.openBluetoothAdapter({
                success: function (res) {
                    resolve(res)
                },
                fail: function (res) {
                    reject(res)
                }
            })
        })
    },

    //1.1获取本机蓝牙适配器状态
    getBLEState() {
        return new Promise((resolve, reject) => {
            wx.getBluetoothAdapterState({
                success: function (res) {
                    resolve(res)
                },
                fail: function (res) {
                    reject(res)
                }
            })
        })
    },

    //2.搜索附近蓝牙设备
    startBLE() {
        wx.startBluetoothDevicesDiscovery({
            success: function (res) {
                console.log(res)
            }
        })
    },

    //2.1停止搜寻蓝牙设备
    stopBLEFound() {
        return new Promise((resolve, reject) => {
            wx.stopBluetoothDevicesDiscovery({
                success: function (res) {
                    resolve(res)
                },
                fail(res) {
                    reject(res)
                }
            })
        })
    },

    //3.获取发现的所有蓝牙设备
    getBLEDevices() {
        wx.getBluetoothDevices({
            success: function (res) {
                console.log(res)
            }
        })
    },

    //4.连接上蓝牙设备
    connectionBLE(deviceId) {
        return new Promise((resolve, reject) => {
            wx.createBLEConnection({
                deviceId: deviceId,
                success: function (res) {
                    resolve(res)
                },
                fail(res) {
                    reject(res)
                }
            })
        })
    },

    //5.获取设备所有服务
    getServices(deviceId) {
        return new Promise((resolve, reject) => {
            wx.getBLEDeviceServices({
                deviceId: deviceId,
                success: function (res) {
                    resolve(res.services)
                },
                fail(res) {
                    reject(res)
                }
            })
        })
    },

    //6.获取设备某个服务中的所有特征值
    getCharacteristic(deviceId, serviceId) {
        wx.getBLEDeviceCharacteristics({
            deviceId: deviceId,
            serviceId: serviceId,
            success: function (res) {
                console.log(res['characteristics'])
            }
        })
    },

    //7.向蓝牙设备发送升/降指令
    writeBLE(deviceId, serviceId, characteristicId, arrayBuffer) {
        return new Promise((resolve, reject) => {
            wx.writeBLECharacteristicValue({
                deviceId: deviceId,
                serviceId: serviceId,
                characteristicId: characteristicId,
                value: arrayBuffer,
                success: function (res) {
                    resolve(res)
                },
                fail(res) {
                    reject(res)
                }
            })
        })
    },

    //8.关闭蓝牙连接
    closeBLEConnection() {
        return new Promise((resolve, reject) => {
            wx.closeBLEConnection({
                deviceId: deviceId,
                success: function (res) {
                    resolve(res)
                },
                fail(res) {
                    reject(res)
                }
            })
        })
    },

    //关闭蓝牙模块
    closeBLE() {
        wx.closeBluetoothAdapter({
            success: function (res) {
                console.log(res)
            }
        })

    },

    /**监听**/

    //监听蓝牙适配器状态变化事件
    onBLEAdapterState() {
        wx.onBluetoothAdapterStateChange(function (res) {
            console.log(res)
        })
    },

    //监听寻找到新设备
    onBLEFound() {
        wx.onBluetoothDeviceFound(function (devices) {
            console.log(devices)
        })
    },

    //监听蓝牙连接状态
    onBLEConnState() {
        wx.onBLEConnectionStateChange(function (res) {
            console.log(res)
        })
    }
})