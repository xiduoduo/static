function getRootPath() {
    var curPageUrl = window.document.location.href;
    urlElements = curPageUrl.split("//")
    var rootPath = urlElements[0] + "//" + urlElements[1].split("/")[0] + "/";
    return rootPath;
}

//获取窗口高度
function getWindowHeight() {
    console.log($(window).height());
    return $(window).height();
}

//从字符串中截取参数(地址栏)
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

//将时间戳格式化
function getMyDate(time, format) {
    var oDate;
    if (typeof (time) == "undefined" || time == null) {
        oDate = new Date();
    } else {
        oDate = new Date(time);
    }

    var oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime;
    if (format == 0) {
        //格式“yyyy-MM-dd HH:MM:SS”
        oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);
    } else if (format == 1) {
        //格式“yyyy-MM-dd”
        oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay);
    } else if (format == 2) {
        //格式“yyyy/MM/dd”
        oTime = oYear + '/' + getzf(oMonth) + '/' + getzf(oDay);
    } else {
        //格式“yyyyMMdd”
        oTime = oYear + getzf(oMonth) + getzf(oDay);
    }
    return oTime;
};

//补0操作,当时间数据小于10的时候，给该数据前面加一个0
function getzf(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}

