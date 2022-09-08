/*
    验证码相关工具
 */

//二值化图像
function toHex(fromImgData) {
    var fromPixelData = fromImgData.data;
    var greyAve = 0;
    for (var j = 0; j < WIDTH * HEIGHT; j++) {
        var r = fromPixelData[4 * j];
        var g = fromPixelData[4 * j + 1];
        var b = fromPixelData[4 * j + 2];
        greyAve += r * 0.3 + g * 0.59 + b * 0.11;
    }
    greyAve /= WIDTH * HEIGHT;//计算平均灰度值。
    for (j = 0; j < WIDTH * HEIGHT; j++) {
        r = fromPixelData[4 * j];
        g = fromPixelData[4 * j + 1];
        b = fromPixelData[4 * j + 2];
        var grey = r * 0.333 + g * 0.333 + b * 0.333;//取平均值。
        grey = grey > greyAve ? 255 : 0;
        fromPixelData[4 * j] = grey;
        fromPixelData[4 * j + 1] = grey;
        fromPixelData[4 * j + 2] = grey;
    }
    return fromImgData;
}

//图像转数组
function toXY(fromImgData) {
    var result = new Array(HEIGHT);
    var fromPixelData = fromImgData.data;
    for (var j = 0; j < HEIGHT; j++) {
        result[j] = new Array(WIDTH);
        for (var k = 0; k < WIDTH; k++) {
            var r = fromPixelData[4 * (j * WIDTH + k)];
            var g = fromPixelData[4 * (j * WIDTH + k) + 1];
            var b = fromPixelData[4 * (j * WIDTH + k) + 2];

            result[j][k] = (r + g + b) > 500 ? 0 : 1;//赋值0、1给内部数组
        }
    }
    return result;
}


//腐蚀（简单）
function corrode(fromArray) {
    for (var j = 1; j < fromArray.length - 1; j++) {
        for (var k = 1; k < fromArray[j].length - 1; k++) {
            if (fromArray[j][k] == 1 && fromArray[j - 1][k] + fromArray[j + 1][k] + fromArray[j][k - 1] + fromArray[j][k + 1] == 0) {
                fromArray[j][k] = 0;
            }
        }
    }
    return fromArray;
}


//膨胀（简单）
function expand(fromArray) {
    for (var j = 1; j < fromArray.length - 1; j++) {
        for (var k = 1; k < fromArray[j].length - 1; k++) {
            if (fromArray[j][k] == 0 && fromArray[j - 1][k] + fromArray[j + 1][k] + fromArray[j][k - 1] + fromArray[j][k + 1] == 4) {
                fromArray[j][k] = 1;
            }
        }
    }
    return fromArray;
}

//切割，获取特定数字
function split(fromArray, count) {
    var numNow = 0;
    var status = false;
    var w = fromArray[0].length;
    for (var k = 0; k < w; k++) {//遍历图像
        var sumUp = 0;
        for (var j = 0; j < fromArray.length; j++) //检测整列是否有图像
            sumUp += fromArray[j][k];
        if (sumUp == 0) {//切割
            for (j = 0; j < fromArray.length - 1; j++)
                fromArray[j].remove(k);
            w--;
            k--;
            status = false;
            continue;
        } else {//切换状态
            if (!status)
                numNow++;
            status = true;
        }
        if (numNow != count) {//不是想要的数字
            for (j = 0; j < fromArray.length - 1; j++)
                fromArray[j].remove(k);
            w--;
            k--;
        }
    }
    return fromArray;
}

//尺寸归一化(旋转/缩放)
function zoomToFit(fromArray) {
    var imgD = fromXY(fromArray);
    var w = lastWidth;
    var h = lastHeight;
    var tempc1 = document.createElement("canvas");
    var tempc2 = document.createElement("canvas");
    tempc1.width = fromArray[0].length;
    tempc1.height = fromArray.length;
    tempc2.width = w;
    tempc2.height = h;
    var tempt1 = tempc1.getContext("2d");
    var tempt2 = tempc2.getContext("2d");
    tempt1.putImageData(imgD, 0, 0, 0, 0, tempc1.width, tempc1.height);
    tempt2.drawImage(tempc1, 0, 0, w, h);
    var returnImageD = tempt2.getImageData(0, 0, WIDTH, HEIGHT);
    fromArray = toXY(returnImageD);
    fromArray.length = h;
    for (var i = 0; i < h; i++)
        fromArray[i].length = w;
    return fromArray;
}

//生成并渲染出验证码图形
function draw(show_num) {
    var canvas_width = $('#canvas').width();
    var canvas_height = $('#canvas').height();
    var canvas = document.getElementById("canvas");//获取到canvas的对象，演员
    var context = canvas.getContext("2d");//获取到canvas画图的环境，演员表演的舞台
    canvas.width = canvas_width;
    canvas.height = canvas_height;
    var sCode = "a,b,c,d,e,f,g,h,i,j,k,m,n,p,q,r,s,t,u,v,w,x,y,z,A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0";
    var aCode = sCode.split(",");
    var aLength = aCode.length;//获取到数组的长度
    for (var i = 0; i < 4; i++) { //这里的for循环可以控制验证码位数（如果想显示6位数，4改成6即可）
        var j = Math.floor(Math.random() * aLength);//获取到随机的索引值
        // var deg = Math.random() * 30 * Math.PI / 180;//产生0~30之间的随机弧度
        var deg = Math.random() - 0.5; //产生一个随机弧度
        var txt = aCode[j];//得到随机的一个内容
        show_num[i] = txt.toLowerCase();
        var x = 10 + i * 20;//文字在canvas上的x坐标
        var y = 20 + Math.random() * 8;//文字在canvas上的y坐标
        context.font = "bold 28px 微软雅黑";
        context.translate(x, y);
        context.rotate(deg);
        var ranColor = randomColor();
        ranColor = LightenDarkenColor(ranColor, 80);
        context.fillStyle = ranColor;
        context.fillText(txt, 0, 0);
        context.rotate(-deg);
        context.translate(-x, -y);
    }
    for (var i = 0; i <= 5; i++) { //验证码上显示线条
        context.strokeStyle = randomColor();
        context.beginPath();
        context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
        context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
        context.stroke();
    }
    for (var i = 0; i <= 30; i++) { //验证码上显示小点
        context.strokeStyle = randomColor();
        context.beginPath();
        var x = Math.random() * canvas_width;
        var y = Math.random() * canvas_height;
        context.moveTo(x, y);
        context.lineTo(x + 1, y + 1);
        context.stroke();
    }
}


//得到随机的颜色值
function randomColor() {
//  var r = Math.floor(Math.random() * 256);
//  var g = Math.floor(Math.random() * 256);
//  var b = Math.floor(Math.random() * 256);
//  return "rgb(" + r + "," + g + "," + b + ")";
    return '#' + (Math.random() * 0xffffff << 0).toString(16);
}

/*
 * 得到更亮或更暗的颜色
 * LightenDarkenColor("#F06D06", 20);
 * LightenDarkenColor("#F06D06", -20);
 * 
 */

function LightenDarkenColor(col, amt) {
    var usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}