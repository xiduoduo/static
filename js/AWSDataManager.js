var jwtCode = sessionStorage.getItem('jwt_code');

function renderChart(respData) {
    $('#tb_dataList').hide();
    $("#div_chart").show();
    dataSeries = []
    legends = []
    for (key of Object.keys(respData)) {
        if (key == "dt") {
            continue;
        }
        dataSeries.push({
            name: key,
            type: 'line',
            data: respData[key]
        });
        legends.push(key);
    }

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('div_chart'));
    // 指定图表的配置项和数据
    var option = {
        // 标题
        title: {
            text: '自动气象站数据曲线'
        },
        tooltip: {
            trigger: 'axis'
        },
        // 图例
        legend: {
            data: legends
        },
        // 网格线
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        // 工具箱
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        // X轴
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: respData["dt"]
        },
        // Y 轴
        yAxis: {
            type: 'value'
        },
        // 数据
        series: dataSeries
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

$(function () {
    $('#btn_load_aws_file').on('click', function () {
        let input_aws = document.getElementById("input_aws_file")
        input_aws.click();
    });

    $("#input_aws_file").change(function () {
        var formData = new FormData();
        var inputFile = document.getElementById('input_aws_file');
        for (let i = 0; i < inputFile.files.length; i++) {
            formData.append(`file${i}`, inputFile.files[i]);
        }
        let targetUrl = `${webRootUrl}/std_data/load`
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
});