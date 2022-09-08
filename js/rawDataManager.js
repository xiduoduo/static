var jwtCode = sessionStorage.getItem('jwt_code');

function formatTime(strTime) {
    elements = strTime.split("+")
    if (elements.length < 1) {
        return strTime;
    }
    return elements[0].replace("T", " ");
}

function renderTable() {
    // 渲染表格
    layui.use(['table'], function () {
        var table = layui.table;
        // 表格渲染
        table.render({
            id: 'dataList',
            elem: '#dataList',
            url: "/rawdata/query",
            method: "post",
            contentType: 'application/json',
            response: {
                statusName: 'code', //规定返回的状态码字段为code
                statusCode: 200 //规定成功的状态码为200
            },
            headers: {
                'Authorization': 'bearer ' + jwtCode
            },
            where: {
                category: $('#sel_category').val()
            },
            page: true,//开启分页
            loading: true,
            title: '原始数据列表',
            height: 'full-100',
            limit: 15,
            parseData: function (resp) { //res 即为原始返回的数据
                if (resp.code == 401) {
                    window.location.href = `${baseUrl}/login.html`;
                    return;
                }
                $('#span_summary').text(`共有数据：${resp.count} 条`)
                return resp;
            },
            limits: [5, 10, 15, 30, 45, 60, 80, 100],
            cols: [
                [
                    //表头
                    {type: 'checkbox'},
                    {
                        field: 'id',
                        title: '序号',
                        width: '5%'
                    },
                    {
                        field: 'category',
                        title: '数据分类',
                        width: '10%'
                    },
                    {
                        field: 'start_time',
                        title: '起始时间',
                        width: '15%',
                        templet: function (d) {
                            // 2022-06-30T00:08:17+08:00 =>2002
                            return formatTime(d.start_time);
                        }
                    },
                    {
                        field: 'end_time',
                        title: '结束时间',
                        width: '15%',
                        templet: function (d) {
                            // 2022-06-30T00:08:17+08:00 =>2002
                            return formatTime(d.end_time);
                        }
                    },
                    {
                        field: 'comment',
                        title: '备注',
                        width: '20%'
                    },
                    {
                        field: 'created',
                        title: '创建时间',
                        width: '15%',
                        templet: function (d) {
                            // 2022-06-30T00:08:17+08:00 =>2002
                            return formatTime(d.created);
                        }
                    },
                    {
                        field: "user",
                        title: "用户",
                        width: "10%"
                    },
                    {
                        field: 'url',
                        title: '操作',
                        width: '10%',
                        templet: function (d) {
                            var reg = /^.+\.(png)|(jpe?g)|(txt)/i
                            if (reg.test(d.url)) {
                                return `<a href='${d.url}' target='_black'>查看</a>`;
                            } else {
                                return `<a href='${d.url}' target='_black'>下载</a>`;
                            }
                        }
                    }
                    // {title: '操作', width: '30%', align: 'center', toolbar: '#rawDataManager'},
                ]
            ],
            even: true
        });

        //表刷新方法
        reloadTable = function () {
            checkLogin();
            alert($('#sel_category').val());
            table.reload("dataList", { //此处是上文提到的 初始化标识id
                loading: true,
                page: {
                    curr: 1
                    //重新从第 1 页开始
                },
                where: {category: category}
            });
        };
    });
}

$(function () {
    renderTable();
    // 添加原始数据
    $('#btn_add_raw_data').on("click", function () {
        let url = `${baseUrl}/rawDataUpload.html`;
        layer.open({
            type: 2,
            area: ['80%', '80%'],
            id: 'rawDataUpload.html',
            title: '试验过程数据上传',
            fixed: false, // 不固定
            maxmin: false,
            content: `${url}`,
            success: function (layero) {
                layero.find('.layui-layer-min').remove();
            },
        });
        return false;
    });

    $('#sel_category').on("change", function () {
        // 渲染表格
        renderTable();
    });

    $('#btn_query').on("click", function () {
        // 渲染表格
        renderTable();
    });
});