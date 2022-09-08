var jwtCode = sessionStorage.getItem('jwt_code');

$(document).ready(function () {
    layui.use(['laydate'], function () {
        var laydate = layui.laydate;
        laydate.render({elem: '#start_date', type: 'datetime',});
        laydate.render({elem: '#end_date', type: 'datetime'});
    });

    layui.use(['form'], function () {
        form = layui.form;
        form.on('submit(addRawData)', function (data) {
            let upload_url = `${webRootUrl}/rawdata/add`
            //new FormData的参数是一个DOM对象，而非jQuery对象
            var formData = new FormData();

            // 数据分类
            var dataType = $('#category_select').val();
            formData.append("category", dataType);

            // 数据起始时间
            var strStartDate = $('#start_date').val();
            formData.append("start_date", strStartDate);

            // 数据结束时间
            var strEndDate = $('#end_date').val();
            formData.append("end_date", strEndDate);

            // 备注
            var strComment = $('#ta_comment').val()
            formData.append("comment",strComment);

            var f = document.getElementById('file_upload_input');
            // alert(f.files.length)
            for (var i = 0; i < f.files.length; i++) {
                var strname = "file" + i;
                //判断文件是否符合要求
                if (false) {
                    if (!/\.zip$/.test(f.files[i].name)) {
                        layer.alert(`文件${f.files[i].name}不是zip文件类型！`, {icon: 5, anim: 6});
                        return;
                    }
                }
                formData.append(strname, f.files[i]);
            }
            //将参数以键值对的形式添加到formDate构造函数
            // formData.append("userID", userID);
            $.ajax({
                url: upload_url,
                type: 'POST',
                data: formData,  // 上传formdata封装的数据
                async: true,
                // 下面三个参数要指定，如果不指定，会报一个JQuery的错误
                cache: false,         // 不缓存
                // 不设置内容类型  jQuery不要去设置Content-Type请求头
                contentType: false,
                processData: false,  // jQuery不要去处理发送的数据
                headers: {
                    'Authorization': 'bearer ' + jwtCode
                },
                success: function (resp) {            //成功回调
                    layer.alert("添加成功", {icon: 1});
                    window.parent.location.reload();
                },
                error: function (resp) {
                    layer.alert("添加失败", {icon: 2});
                    window.parent.location.reload();
                }
            });
            return false;
        })
    });
});