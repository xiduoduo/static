function upinput() {
    //new FormData的参数是一个DOM对象，而非jQuery对象
    var formData = new FormData();
    //获取该input的所有元素、属性
    var f = document.getElementById("files");
    var userID = document.getElementById("userID").value;
    for (var i = 0; i < f.files.length; i++) {
        var strname = "file" + i;
        //判断文件是否符合要求
        if (!/\.(swf|flv|mp4|rmvb|avi|mpeg|ra|ram|mov|wmv)$/.test(f.files[i].name)) {
            layer.alert("该上传的文件不是视频文件类型！", {icon: 5, anim: 6});
            break;
        }
        //将参数以键值对的形式添加到formDate构造函数
        formData.append("userID", userID);
        formData.append(strname, f.files[i]);
    }
    console.log(f.files);
    $.ajax({
        url: "${ctx}/web/MyMusicServlet?method=uploadFiles&type=video",
        type: 'POST',
        data: formData,  // 上传formdata封装的数据
        async: true,
        // 下面三个参数要指定，如果不指定，会报一个JQuery的错误
        cache: false,         // 不缓存
        // 不设置内容类型  jQuery不要去设置Content-Type请求头
        contentType: false,
        processData: false,  // jQuery不要去处理发送的数据
        success: function (data) {            //成功回调
            if (msg == "新增成功!") {
                layer.alert(data);
            } else {
                layer.alert(data);
            }
        },
        error: function (data) {
            alert(data);
        }
    });
}
