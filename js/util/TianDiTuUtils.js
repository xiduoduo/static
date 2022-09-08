
// 卫星影像图层
function tdtSatImageLayer() {
    var sat_image_layer = new ol.layer.Tile({
        id: "tileSatellite",
        name: "天地图卫星图",
        title: "卫星图",
        visible: false,
        source: new ol.source.XYZ({
            url: 'http://t3.tianditu.com/DataServer?T=img_w&tk=1bfe33a719963fefdb29df742c36c5e5&x={x}&y={y}&l={z}'
        })
    });
    return sat_image_layer;
}

// 路网图层
function tdtRoadLayer() {
    var tian_di_tu_road_layer = new ol.layer.Tile({
        id: "tileRoad",
        name: "天地图路网",
        title: "天地图路网",
        source: new ol.source.XYZ({
            url: "http://t4.tianditu.com/DataServer?T=vec_w&tk=1bfe33a719963fefdb29df742c36c5e5&x={x}&y={y}&l={z}"
        })
    });
    return tian_di_tu_road_layer;
}

// 标注图层
function tdtMarkLayer() {
    var marker_layer = new ol.layer.Tile({
        id: "tileMark",
        name: "天地图标注",
        title: "标注图层",
        source: new ol.source.XYZ({
            url: 'http://t3.tianditu.com/DataServer?T=cva_w&tk=1bfe33a719963fefdb29df742c36c5e5&x={x}&y={y}&l={z}'
        })
    });

    return marker_layer;
}
