function dateFormat(date, mask) {
    if (arguments.length === 1 && Object.prototype.toString.call(date) === '[object String]' && !/\d/.test(date)) {
        mask = date
        date = undefined
    }

    date = date || new Date()

    if (!(date instanceof Date)) {
        date = new Date(date)
    }

    if (isNaN(date)) {
        throw TypeError('Format Date Error')
    }

    mask = String(dateFormat.masks[mask] || mask || dateFormat.masks['default'])

    var arr = [{
        reg: /(Y+)/,
        replace: date.getFullYear()
    }, {
        reg: /(M+)/,
        replace: date.getMonth() + 1
    }, {
        reg: /(D+)/,
        replace: date.getDate()
    }, {
        reg: /(H+)/,
        replace: date.getHours()
    }, {
        reg: /(m+)/,
        replace: date.getMinutes()
    }, {
        reg: /(s+)/,
        replace: date.getSeconds()
    }, {
        reg: /(S+)/,
        replace: date.getMilliseconds()
    }]

    var len = arr.length - 1

    //处理年份
    arr[0].reg.test(mask) ?
        mask = mask.replace(RegExp.$1, String(arr[0].replace).substring(4 - RegExp.$1.length)) : null
    //处理月日时分秒
    for (var i = 1; i < len; i++) {
        arr[i].reg.test(mask) ?
            RegExp.$1.length >= 2 ?
                mask = mask.replace(RegExp.$1, ('00' + arr[i].replace).substring(String(arr[i].replace).length))
                : mask = mask.replace(RegExp.$1, String(arr[i].replace))
            : null
    }
    //处理毫秒
    arr[len].reg.test(mask) ?
        mask = mask.replace(RegExp.$1, ('000' + arr[len].replace).substring(String(arr[len].replace).length).substring(3 - RegExp.$1.length))
        : null

    return mask
}

dateFormat.masks = {
    'default': 'YYYY-MM-DD HH:mm:ss',
    'date': 'YYYY-MM-DD',
    'time': 'HH:mm:ss'
}

export default dateFormat