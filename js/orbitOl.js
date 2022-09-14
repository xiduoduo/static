var jwtCode = sessionStorage.getItem('jwt_code');

//Map中的图层数组
var layer = new Array();
//图层名称数组
var layerName = new Array();
//图层可见属性数组
var layerVisibility = new Array();

// var map = initMap("map");

function initMap(mapId) {
    // 创建map
    let map = new ol.Map({
        target: mapId,
        controls: ol.control.defaults().extend([
            // new ol.control.FullScreen(),
            new ol.control.MousePosition({
                coordinateFormat: ol.coordinate.createStringXY(4),
                projection: 'EPSG:4326',
                className: 'custom-mouse-position',
                target: document.getElementById('mouse-position')
            })
        ]),
    });

    map.setView(new ol.View({
        //地图中心点
        center: [13576194, 4788260],
        //地图初始显示级别
        zoom: 4,
        minZoom: 1
    }));
    // 全屏展示
    if(true){
        //实例化全屏显示控件
        let fullScreenControl = new ol.control.FullScreen();
        //将全屏显示控件加载到map中
        map.addControl(fullScreenControl);
    }
    return map
}

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
        form.on('submit(calc)', function () {
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
        elementLi.className="treeLi"
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

function submit(){
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
            if(!resp.data.length){
                return;
            }

            let chArr = document.body.getElementsByClassName("ol-viewport");
            for(i=0;i<chArr.length;i++){
                //删除元素 元素.parentNode.removeChild(元素);
                if (chArr[i] != null) 
                    chArr[i].parentNode.removeChild(chArr[i]); 
            }
            let treeArr = document.getElementById('layerTree').getElementsByClassName("treeLi");
            for(i=0;i<treeArr.length;i++){
                //删除元素 元素.parentNode.removeChild(元素);
                if (treeArr[i] != null) 
                treeArr[i].parentNode.removeChild(treeArr[i]); 
            }
            for(i=0;i<treeArr.length;i++){
                //删除元素 元素.parentNode.removeChild(元素);
                if (treeArr[i] != null) 
                treeArr[i].parentNode.removeChild(treeArr[i]); 
            }
            var map = initMap("map");
            map.addLayer(tdtRoadLayer());
            map.addLayer(tdtSatImageLayer());
            map.addLayer(tdtMarkLayer());
            loadLayersControl(map, "layerTree");
            
            resp.data.forEach((item, index) =>{
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
                map.addLayer(pointLayer)
            })
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error')
            layer.alert(jqXHR.responseText, {icon: 2});
        }
    });
}

$(function () {
    var map = initMap("map");
    map.addLayer(tdtRoadLayer());
    map.addLayer(tdtSatImageLayer());
    map.addLayer(tdtMarkLayer());
    initDateAndForm();
     //北京市平谷区的坐标
//      var coordinates = [[117.39680614984, 40.233089086201], [117.3600565732, 40.242113456225], [117.34874458404, 40.250260274602],
//      [117.34302344712, 40.283707567814], [117.30241786584, 40.284010303013], [117.30089945595, 40.298823482743],
//      [117.29495791414, 40.307241631948], [117.28090327938, 40.31483263219], [117.27787165052, 40.331469477361],
//      [117.28158063671, 40.338247525913], [117.26875571365, 40.343837920124], [117.24821332321, 40.376802733207],
//      [117.23311626435, 40.375365915021], [117.23011329982, 40.381697774551], [117.22184575331, 40.383995827578],
//      [117.21027968492, 40.379304161599], [117.18913489167, 40.383847635371], [117.16955596667, 40.377573094897],
//      [117.16201098872, 40.379609944384], [117.15156389182, 40.374358469115], [117.1461431628, 40.367421131629],
//      [117.12300485064, 40.359558075585], [117.11864440401, 40.358974561797], [117.11380102691, 40.364149005012],
//      [117.10453631204, 40.365747471036], [117.07808699163, 40.347405333082], [117.06520517495, 40.342543682533],
//      [117.05951109694, 40.349081054111], [117.04244565157, 40.35250818155], [117.0250699279, 40.340493098635],
//      [117.02117101934, 40.333168625588], [117.01588753438, 40.331656255311], [117.01173132175, 40.32337571318],
//      [117.01591420209, 40.312498282132], [117.00799784424, 40.305823430052], [117.00636157925, 40.296778788538],
//      [116.9970503394, 40.296137984976], [116.99575758984, 40.292616557636], [116.97796493669, 40.288167135931],
//      [116.97696786259, 40.282481020224], [116.97075825127, 40.28108093448], [116.95848391237, 40.267707809995],
//      [116.95715258101, 40.263327709699], [116.98168044494, 40.25377572019], [116.96338018644, 40.238052279683],
//      [116.95795687613, 40.242937187356], [116.94329751003, 40.238005833847], [116.93175719996, 40.233136537486],
//      [116.92430219371, 40.224967956262], [116.93485016275, 40.210980369693], [116.94526901764, 40.19855812205],
//      [116.94603449564, 40.19354561168], [116.94951752277, 40.188098708124], [116.95882736017, 40.177581436424],
//      [116.97897749255, 40.176575285822], [116.97881329629, 40.154560252512], [116.97587001134, 40.146838503303],
//      [116.98371154588, 40.133455992809], [116.97593603278, 40.124828346814], [116.98315680573, 40.100140533332],
//      [116.97155622343, 40.086210562194], [116.99084261053, 40.081393909686], [116.98663839805, 40.06927009966],
//      [116.96955722573, 40.068076860016], [116.96884211824, 40.057480462171], [116.97636631342, 40.054371684127],
//      [116.9795686888, 40.047516077888], [116.98518115869, 40.044388313572], [116.99304702223, 40.045029326691],
//      [117.00085160401, 40.042331508548], [117.00745407085, 40.038313328591], [117.03161208113, 40.040467631252],
//      [117.04575150493, 40.055833869462], [117.06992028353, 40.067915618111], [117.08846730729, 40.070826442849],
//      [117.09595404341, 40.076218017715], [117.11977736834, 40.07863161916], [117.1425959885, 40.070345862074],
//      [117.16234951106, 40.075084806785], [117.16799658016, 40.082010788788], [117.18330740326, 40.078432633031],
//      [117.19158959317, 40.091180779552], [117.21946331827, 40.102793872514], [117.23085386426, 40.100744473507],
//      [117.2308084102, 40.104832177913], [117.2565631512, 40.125816298924], [117.26463610295, 40.118734529522],
//      [117.2720390385, 40.117442160668], [117.28248965384, 40.119346336362], [117.29631227787, 40.128663778615],
//      [117.30298578394, 40.127129306082], [117.31838231488, 40.145192295628], [117.35175120566, 40.14858516025],
//      [117.3647252165, 40.166701558473], [117.36002676882, 40.179323942797], [117.37183376251, 40.184576516774],
//      [117.39959624353, 40.184618207342], [117.41343867583, 40.191765541398], [117.41039919172, 40.194936098147],
//      [117.39584874998, 40.193328689781], [117.3867886771, 40.198351231932], [117.38715826407, 40.205987067737],
//      [117.39482310976, 40.20909112999], [117.39525305779, 40.212222926017], [117.38556017544, 40.214479099127],
//      [117.38481402713, 40.223681632946], [117.3994912696, 40.227137227499], [117.39680614984, 40.233089086201]]
//  //声明一个新的数组
//  var coordinatesPolygon = new Array();
//  //循环遍历将经纬度转到"EPSG:4326"投影坐标系下
//  for (var i = 0; i < coordinates.length; i++) {
//      var pointTransform = ol.proj.fromLonLat([coordinates[i][0], coordinates[i][1]], "EPSG:4326");
//      coordinatesPolygon.push(pointTransform);
//  }
//  //瓦片图层
//  var tileLayer = new ol.layer.Tile({
//     source:new ol.source.OSM()
//  });
//  var source = new ol.source.Vector();
//  //矢量图层
//  var vector = new ol.layer.Vector({
//      source: source,
//      style: new ol.style.Style({
//          fill: new ol.style.Fill({
//              color: 'rgba(255, 255, 255, 0.1)'
//          }),
//          stroke: new ol.style.Stroke({
//              color: 'red',
//              width: 2
//          }),
//          image: new ol.style.Circle({
//              radius: 10,
//              fill: new ol.style.Fill({
//                  color: '#ffcc33'
//              })
//          })
//      })
//  });
//  //多边形此处注意一定要是[坐标数组]
//  var plygon = new ol.geom.Polygon([coordinatesPolygon])
//  //多边形要素类
//  var feature = new ol.Feature({
//      geometry: plygon,
//  });
//  source.addFeature(feature);
// //  map.addLayer(vector)
//  console.log(vector.getSource().getFeatures());

//  var view=new ol.View({
//     center:[116.46,39.92],
//     zoom: 10,
//     projection: "EPSG:4326"
// });
// var map = new ol.Map({
//     layers: [tileLayer,vector],
    
//     view:view,
//     target: "map"
// });

    //加载图层列表的数据
    loadLayersControl(map, "layerTree");
})
