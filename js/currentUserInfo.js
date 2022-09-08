var jwtCode = sessionStorage.getItem('jwt_code');

// 初始化用户信息
function initUserInfo() {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        url: `${webRootUrl}/currentUserInfo`,
        headers: {
            'Authorization': 'bearer ' + jwtCode
        },
        success: function (resp) {
            var respData = resp.data;
            $('#username').val(respData.username);
            $('#email').val(respData.email);
            $('#phone').val(respData.phone);
            $('#description').val(respData.description);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            layer.alert(jqXHR.responseText, {icon: 2});
        }
    });
}


$(function () {
    initUserInfo();
});