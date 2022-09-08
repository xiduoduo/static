var jwtCode = sessionStorage.getItem('jwt_code');

function initUserName() {
    // 设置当前用户名
    $.ajax({
        url: `${webRootUrl}/username`,
        type: 'GET',
        // data: null,
        async: true,
        cache: false,         // 不缓存
        contentType: false,
        processData: false,  // jQuery不要去处理发送的数据
        headers: {
            'Authorization': 'bearer ' + jwtCode
        },
        success: function (resp) {            //成功回调
            $('#span_username').text(resp.data)
        },
        error: function (resp) {

        }
    });
}

$(function () {
    initUserName();
    // 个人信息
    $('#a_userinfo').on("click", function () {
        let url = `${baseUrl}/currentUserInfo.html`;
        layer.open({
            type: 2,
            area: ['30%', '40%'],
            id: 'currentUserInfo.html',
            title: '用户信息',
            fixed: false, // 不固定
            maxmin: false,
            content: `${url}`,
            success: function (layero) {
                layero.find('.layui-layer-min').remove();
            },
        });
        return false;
    })
    // 切换账号
    $('#a_switch_count').on("click", function () {
        logout();
    })
})

// 退出
function logout() {
    sessionStorage.setItem('jwt_code', "");
    let login_url = `${baseUrl}/login.html`;
    window.location.href = login_url;
}

