var jwtCode = sessionStorage.getItem('jwt_code');
var dataStore;

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
                    //图层
                    var coordinates = dataStore;
                    var totArr = [];
                    let chArr5 = document.body.getElementsByClassName("ol-viewport");
                    for(i=0;i<chArr5.length;i++){
                        if (chArr5[i] != null) 
                            chArr5[i].parentNode.removeChild(chArr5[i]); 
                    }
    //循环遍历将经纬度转到"EPSG:4326"投影坐标系下
                    for(var m = 0;m<coordinates.length;m++){
                        var coordinatesPolygon = new Array();
                        for (var i = 0; i < coordinates[m].length; i++) {
                            var pointTransform = ol.proj.fromLonLat([coordinates[m][i][0], coordinates[m][i][1]], "EPSG:4326");
                            coordinatesPolygon.push(pointTransform);
                        }
                        var source = new ol.source.Vector();
                
                        //矢量图层
                        var vector = new ol.layer.Vector({
                            source: source,
                            style: new ol.style.Style({
                                fill: new ol.style.Fill({
                                    color: 'rgba(255, 255, 255, 0.1)'
                                }),
                                stroke: new ol.style.Stroke({
                                    color: 'red',
                                    width: 2
                                }),
                                image: new ol.style.Circle({
                                    radius: 10,
                                    fill: new ol.style.Fill({
                                        color: '#ffcc33'
                                    })
                                })
                            })
                        });
                        totArr.push(vector)
                        //多边形此处注意一定要是[坐标数组]
                        var plygon = new ol.geom.Polygon([coordinatesPolygon])
                        //多边形要素类
                        var feature = new ol.Feature({
                            geometry: plygon,
                        });
                        source.addFeature(feature);
                    }
                    // var view=new ol.View({
                    //         center:[116.46,39.92],
                    //         zoom: 4,
                    //         projection: "EPSG:4326"
                    //     });
                    //     let layers = [tdtRoadLayer(),tdtSatImageLayer(),tdtMarkLayer()];
                    //     totArr.forEach((item,index)=>{
                    //         layers.push(item)
                    //     })
                    //     var map = new ol.Map({
                    //         layers: layers,
                            
                    //         view:view,
                    //         target: "map"
                    //     });
                        // 点
                                        // let chArr5 = document.body.getElementsByClassName("ol-viewport");
                    // for(i=0;i<chArr5.length;i++){
                    //     if (chArr5[i] != null) 
                    //         chArr5[i].parentNode.removeChild(chArr5[i]); 
                    // }
    //                     var map = initMap("map");
    // map.addLayer(tdtRoadLayer());
    // map.addLayer(tdtSatImageLayer());
    // map.addLayer(tdtMarkLayer());

                        resp.data.orbit.forEach((item, index) =>{
                            var points = []
                            var pointLayer = new ol.layer.Vector({
                                source: new ol.source.Vector({
                                    features: []
                                })
                            })
                            var feature = new ol.Feature({
                                geometry: new ol.geom.Point(ol.proj.fromLonLat([item.lon, item.lat]))
                            })
                            let style = new ol.style.Style({
                                image: new ol.style.Icon({
                                    scale: 0.8,
                                    src: './images/green.png',
                                    anchor: [0.48, 0.52]
                                }),
                            })
                            feature.setStyle(style);
                            points.push(feature)
                            pointLayer.getSource().addFeature(feature);
                            console.log(pointLayer) 
                            // map.addLayer(pointLayer)

                            var view=new ol.View({
                                center:[116.46,39.92],
                                zoom: 4,
                                projection: "EPSG:4326"
                            });
                            let layers = [tdtRoadLayer(),tdtSatImageLayer(),tdtMarkLayer(),pointLayer];
                            totArr.forEach((item,index)=>{
                                layers.push(item)
                            })
                            var map = new ol.Map({
                                layers: layers,
                                
                                view:view,
                                target: "map"
                            });
                        })


                    // 弹框
                    $('#adduse').show();
                    let chArr = document.querySelector("tbody").getElementsByClassName("trNo");
                    for(i=0;i<chArr.length;i++){
                        if (chArr[i] != null) 
                            chArr[i].parentNode.removeChild(chArr[i]); 
                    }
                    let chArr2 = document.querySelector("tbody").getElementsByClassName("trNo");
                    for(i=0;i<chArr2.length;i++){
                        if (chArr[i] != null) 
                            chArr[i].parentNode.removeChild(chArr[i]); 
                    }
                    let chArr3 = document.querySelector("tbody").getElementsByClassName("trNo");
                    for(i=0;i<chArr3.length;i++){
                        if (chArr[i] != null) 
                            chArr[i].parentNode.removeChild(chArr[i]); 
                    }
            
                    //获取根节点
                    var tbody = document.querySelector("tbody");
                    var datas = resp.data.time_table;
                    datas.forEach((item,index)=>{
                        item.num = index + 1;
                    })
                    // step2. 所有数据都是放在 tbody 中的 tr 里面
                    for(var i = 0; i < datas.length; i++){
                        var newNode_tr = document.createElement("tr");
                        newNode_tr.className="trNo"
                        //填充表格数据
                        for (var key in datas[i]){
                            if(key=='num'){
                                var newNode_td = document.createElement("td");
                                newNode_td.innerText = datas[i][key];
                                newNode_tr.appendChild(newNode_td);
                            }
                        }
                        for (var key in datas[i]){
                            if(key=='start_time'){
                                var newNode_td = document.createElement("td");
                                newNode_td.innerText = datas[i][key];
                                newNode_tr.appendChild(newNode_td);
                            }
                        }
                        for (var key in datas[i]){
                            if(key=='end_time'){
                                var newNode_td = document.createElement("td");
                                newNode_td.innerText = datas[i][key];
                                newNode_tr.appendChild(newNode_td);
                            }
                        }
                        tbody.appendChild(newNode_tr);
                        }


                    //画点
                    // resp.orbit.forEach((item, index) =>{
                    //     var points = []
                    //     var pointLayer = new ol.layer.Vector({
                    //         source: new ol.source.Vector({
                    //             features: []
                    //         })
                    //     })
                    //     var feature = new ol.Feature({
                    //         geometry: new ol.geom.Point(ol.proj.fromLonLat([item.lon, item.lat]))
                    //     })
                    //     let style = new ol.style.Style({
                    //         image: new ol.style.Icon({
                    //             scale: 0.8,
                    //             src: './images/green.png',
                    //             anchor: [0.48, 0.52]
                    //         }),
                    //     })
                    //     feature.setStyle(style);
                    //     points.push(feature)
                    //     pointLayer.getSource().addFeature(feature);
                    //     map.addLayer(pointLayer)
                    // })

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
function drawPolygon(coordinates){
    var totArr = [];
    //循环遍历将经纬度转到"EPSG:4326"投影坐标系下
    for(var m = 0;m<coordinates.length;m++){
        var coordinatesPolygon = new Array();
        for (var i = 0; i < coordinates[m].length; i++) {
            var pointTransform = ol.proj.fromLonLat([coordinates[m][i][0], coordinates[m][i][1]], "EPSG:4326");
            coordinatesPolygon.push(pointTransform);
        }
        var source = new ol.source.Vector();
   
        //矢量图层
        var vector = new ol.layer.Vector({
            source: source,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.1)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'red',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 10,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });
        totArr.push(vector)
        //多边形此处注意一定要是[坐标数组]
        var plygon = new ol.geom.Polygon([coordinatesPolygon])
        //多边形要素类
        var feature = new ol.Feature({
            geometry: plygon,
        });
        source.addFeature(feature);
    }
    var view=new ol.View({
            center:[116.46,39.92],
            zoom: 4,
            projection: "EPSG:4326"
        });
        let layers = [tdtRoadLayer(),tdtSatImageLayer(),tdtMarkLayer()];
        totArr.forEach((item,index)=>{
            layers.push(item)
        })
        var map = new ol.Map({
            layers: layers,
            
            view:view,
            target: "map"
        });
}
$(function () {
    initFormAndDate();
    var map = initMap("map");
    map.addLayer(tdtRoadLayer());
    map.addLayer(tdtSatImageLayer());
    map.addLayer(tdtMarkLayer());
    $("#qingchu").click(function() {
        $('#adduse').hide();
    })
    $.ajax({
        url: `${webRootUrl}/tle/loadExpArea`,
        type: 'GET',
        async: false,
        headers: {
            'Authorization': `bearer ${jwtCode}`
        },
        success: function (resp) {
            if(!JSON.parse(resp.data).coordinates[0]){
                return;
            }
            let chArr = document.body.getElementsByClassName("ol-viewport");
                for(i=0;i<chArr.length;i++){
                    if (chArr[i] != null) 
                        chArr[i].parentNode.removeChild(chArr[i]); 
                }
            dataStore = JSON.parse(resp.data).coordinates[0]
            drawPolygon(JSON.parse(resp.data).coordinates[0])
        },
        error: function (resp) {
            
        }
    });
    $('.clear-btn').on('click', function () {
        let chArr = document.body.getElementsByClassName("ol-viewport");
        for(i=0;i<chArr.length;i++){
            if (chArr[i] != null) 
                chArr[i].parentNode.removeChild(chArr[i]); 
        }
        var map = initMap("map");
        map.addLayer(tdtRoadLayer());
        map.addLayer(tdtSatImageLayer());
        map.addLayer(tdtMarkLayer());
        $.ajax({
            url: `${webRootUrl}/tle/clearExpArea`,
            type: 'GET',
            async: false,
            headers: {
                'Authorization': `bearer ${jwtCode}`
            },
            success: function (resp) {
                console.log(resp)
            },
            error: function (resp) {
                
            }
        });
    });
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
        let targetUrl = `${webRootUrl}/tle/uploadExpArea`
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
            success: function (resp) {
                if(!JSON.parse(resp.data).coordinates[0]){
                    return;
                }
                let chArr = document.body.getElementsByClassName("ol-viewport");
                for(i=0;i<chArr.length;i++){
                    if (chArr[i] != null) 
                        chArr[i].parentNode.removeChild(chArr[i]); 
                }
                dataStore = JSON.parse(resp.data).coordinates[0];
                    drawPolygon(JSON.parse(resp.data).coordinates[0])
            },
            error: function (resp) {
                layer.alert("加载失败", {icon: 2});
                window.parent.location.reload();
            }
        });
    });
});
