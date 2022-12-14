String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

// 获取文件扩展名
function getFileExtension1(filename) {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined
}

//判断字符串是否为空
function isNullOrEmpty (obj) {
    if (typeof obj == "undefined"  || obj == undefined || obj == null || obj == "") {
        return true;
    } else {
        return false;
    }
}
