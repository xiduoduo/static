var jwtCode = sessionStorage.getItem('jwt_code');

function initFormAndDate() {
    layui.use(['form', 'laydate'], function () {
        var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
        form.on('submit(calc)', function (data) {
            let postData = JSON.stringify({
                satId: $('#select_satid').val(),
                sensorId: $('#select_sensorid').val(),
                startTime: $('#start_time').val(),
                endTIme: $('#end_time').val()
            })
            alert(postData);
            $.ajax({
                type: 'POST',
                contentType: "application/json", //必须这样写
                dataType: "json",
                async: false,
                url: `${webRootUrl}/tle/sensor_pass_times`,
                data: postData,
                headers: {
                    'Authorization': `bearer ${jwtCode}`
                },
                success: function (resp) {

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    layer.alert(jqXHR.responseText, {icon: 2});
                }
            });
        });
        var laydate = layui.laydate;
        laydate.render({elem: '#start_time', type: "datetime"});
        laydate.render({elem: '#end_time', type: "datetime"});
    });
}

function inputAreaSelect() {
    let inputArea = document.getElementById("input_area");
    if (inputArea == null || inputArea == undefined) {
        alert("invalid target input element");
        return;
    }
    inputArea.click();
}

$(function () {
    initFormAndDate();
    var map = initMap("map");
    map.addLayer(tdtRoadLayer());
    map.addLayer(tdtSatImageLayer());
    map.addLayer(tdtMarkLayer());

    // 选择试验区域
    $('#btn_load_area').on('click', function () {
        let inputArea = document.getElementById('input_area');
        if (inputArea == null || inputArea == undefined) {
            alert("invalid target input element");
            return;
        }
        alert(inputArea.files.length);
        inputArea.click();
        alert(inputArea.files.length);
    });

    // 加载展示试验区域
    $('#input_area').change(function () {
        // alert("input area changed");
        let formData = new FormData();
        let inputFile = document.getElementById('input_area');
        for (let i = 0; i < inputFile.files.length; i++) {
            if (!/\.zip$/.test(inputFile.files[i].name)) {
                layer.alert(`文件${inputFile.files[i].name}不是zip文件类型！`, {icon: 5, anim: 6});
                return;
            }
            formData.append(`file${i}`, inputFile.files[i]);
        }
        let targetUrl = `${webRootUrl}/tle/load_area`
        $.ajax({
            url: targetUrl,
            type: 'POST',
            data: formData,  // 上传formdata封装的数据
            async: false,
            // 下面三个参数要指定，如果不指定，会报一个JQuery的错误
            cache: false,         // 不缓存
            // 不设置内容类型  jQuery不要去设置Content-Type请求头
            contentType: false,
            processData: false,  // jQuery不要去处理发送的数据
            headers: {
                'Authorization': `bearer ${jwtCode}`
            },
            success: function (resp) {            //成功回调
                alert(resp);
            },
            error: function (resp) {
                layer.alert("加载失败", {icon: 2});
                window.parent.location.reload();
            }
        });
    });
});
