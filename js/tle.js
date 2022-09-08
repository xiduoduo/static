var jwtCode = sessionStorage.getItem('jwt_code');

function formatTime(strTime) {
    elements = strTime.split("+")
    if (elements.length < 1) {
        return strTime;
    }
    return elements[0].replace("T", " ");
}

function renderTable() {
    layui.use(['table'], function () {
        var table = layui.table;
        // 表格渲染
        table.render({
            id: 'tleList',
            elem: '#tleList',
            url: "/tle/query",
            method: "post",
            contentType: 'application/json',
            response: {
                statusName: 'code', //规定返回的状态码字段为code
                statusCode: 200 //规定成功的状态码为200
            },
            headers: {
                'Authorization': 'bearer ' + jwtCode
            },
            where: {},
            page: false,//开启分页
            loading: true,
            title: '数据列表',
            height: 'full-80',
            limit: 15,
            parseData: function (resp) { //resp 即为原始返回的数据
                console.log(Object.keys(resp));
                if (resp.code == 401) {
                    window.location.href = `${baseUrl}/login.html`;
                    return;
                }
                return resp;
            },
            limits: [5, 10, 15, 30, 45, 60, 80, 100],
            cols: [
                [
                    //表头
                    //{type: 'checkbox'},
                    {
                        field: 'id',
                        title: '序号',
                        width: '5%'
                    },
                    {
                        field: 'satid',
                        title: '卫星',
                        width: '5%'
                    },
                    {
                        field: 'tle_time',
                        title: '数据时间',
                        width: '13%',
                        templet: function (d) {
                            return formatTime(d.tle_time);
                        }
                    },
                    {
                        field: 'line1',
                        title: '第1行',
                        width: '31%'
                    },
                    {
                        field: 'line2',
                        title: '第2行',
                        width: '33%'
                    },
                    {
                        field: 'updated',
                        title: '更新时间',
                        width: '13%',
                        templet: function (d) {
                            return formatTime(d.updated);
                        }
                    }
                ]
            ],
            even: true
        });

        //表刷新方法
        reloadTable = function (valSatId) {
            checkLogin();
            table.reload("tleList", { //此处是上文提到的 初始化标识id
                loading: true,
                page: {
                    // curr: 1
                    //重新从第 1 页开始
                },
                where: {}
            });
        };
    });
}

$(function () {
    $('#btn_load_tle_file').on('click', function () {
        let input_tle = document.getElementById("input_tle_file")
        input_tle.click();
    });

    $("#input_tle_file").change(function () {
        let formData = new FormData();
        let inputFile = document.getElementById('input_tle_file');
        for (let i = 0; i < inputFile.files.length; i++) {
            formData.append(`file${i}`, inputFile.files[i]);
        }
        let targetUrl = `${webRootUrl}/tle/add`
        $.ajax({
            url: targetUrl,
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
                // alert(resp.code);
                renderChart(resp.data);
            },
            error: function (resp) {
                layer.alert("加载失败", {icon: 2});
                window.parent.location.reload();
            }
        });
    });
    renderTable();
});