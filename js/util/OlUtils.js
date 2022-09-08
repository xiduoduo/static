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