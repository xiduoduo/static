var jwtCode = sessionStorage.getItem('jwt_code');

//Map中的图层数组
var layer = new Array();
//图层名称数组
var layerName = new Array();
//图层可见属性数组
var layerVisibility = new Array();

function onlyNumber(obj) {
    obj.value = obj.value.replace(/[^\d]/g, '');
    let nval = parseInt(obj.value)
    if (!isNaN(nval)) {
        if (nval > 100) {
            obj.value = 100;
        }
        if (nval < 1) {
            obj.value = 1;
        }
    }
}

function initDateAndForm() {
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        laydate.render({elem: '#start_time', type: "datetime"});
        laydate.render({elem: '#end_time', type: "datetime"});
    });

    layui.use(['form'], function () {
        var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
        form.on('submit(calc)', function (data) {
            $.ajax({
                type: 'POST',
                contentType: "application/json", //必须这样写
                dataType: "json",
                async: false,
                url: `${webRootUrl}/tle/orbit`,
                data: JSON.stringify({
                    sat_id: $('#select_satid').val(),
                    start_time: $('#start_time').val(),
                    end_time: $('#end_time').val(),
                    interval: parseInt($('#input_interval').val())
                }),
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
    });
}

/*
 动态设置元素文本内容（兼容）
 * */
function setInnerText(element, text) {
    if (typeof element.textContent == "string") {
        element.textContent = text;
    } else {
        element.innerText = text;
    }
}

function addChangeEvent(element, layer) {
    element.onclick = function () {
        if (element.checked) {
            //显示图层
            layer.setVisible(true);
        } else {
            //不显示图层
            layer.setVisible(false);
        }
    };
}

function loadLayersControl(map, id) {
    //图层列表容器
    let treeContent = document.getElementById(id);
    //获取地图中所有数组
    let layers = map.getLayers();
    // alert(layers.getLength());
    for (let i = 0; i < layers.getLength(); i++) {
        //获取每个图层的名称、是否可见属性
        layer[i] = layers.item(i);
        layerName[i] = layer[i].get('name');
        layerVisibility[i] = layer[i].getVisible();
        //新增li元素，用来保存图层
        let elementLi = document.createElement('li');
        //添加子节点
        treeContent.appendChild(elementLi);
        //创建复选框元素
        let elementInput = document.createElement('input');
        elementInput.type = "checkbox";
        elementInput.name = "layers";
        elementLi.appendChild(elementInput);
        //创建label元素
        let elementLable = document.createElement('label');
        elementLi.appendChild(elementLable);
        //创建图层名称
        setInnerText(elementLable, layerName[i]);
        elementLi.appendChild(elementLable);
        //设置图层默认显示状态
        if (layerVisibility[i]) {
            elementInput.checked = true;
        }
        //为checkbox添加变更事件
        addChangeEvent(elementInput, layer[i]);
    }
}

$(function () {
    initDateAndForm();

    // 创建map
    var map = initMap("map");
    map.addLayer(tdtRoadLayer());
    map.addLayer(tdtSatImageLayer());
    map.addLayer(tdtMarkLayer());

    // 添加一个绘制的线使用的layer
    let drawLayer = new ol.layer.Vector({
        name: "星下点轨迹",
        //layer所对应的source
        source: new ol.source.Vector(),
    })
    //把layer加入到地图中
    map.addLayer(drawLayer);

    //
    // var draw;
    // // 绘制多边形
    // $('#btn_draw_polygon').on('click', function () {
    //     //先移除上一个Interaction
    //     map.removeInteraction(draw);
    //     draw = new ol.interaction.Draw({
    //         source: drawLayer.getSource(),
    //         type: "Polygon",
    //     });
    //     map.addInteraction(draw);
    // });
    //加载图层列表的数据
    loadLayersControl(map, "layerTree");
})
