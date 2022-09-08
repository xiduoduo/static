
$(document).keypress(function (e) {
    // 回车键事件
    if (e.which == 13) {
        $('input[type="button"]').click();
    }
});

var show_num = [];
draw(show_num);

//点击图片重新生成验证码
$("#canvas").on('click', function () {
    draw(show_num);
});

layui.use('layer', function () {
    //非空验证
    $('input[type="button"]').click(function () {
        var login = $('input[name="login"]').val();
        var pwd = $('input[name="pwd"]').val();
        var code = $('input[name="code"]').val().toLowerCase();
        var num = show_num.join("");
        if (login === '') {
            ErroAlert('请输入您的账号!');
        } else if (pwd === '') {
            ErroAlert('请输入密码!');
        } else if (code === '' || code.length != 4) {
            ErroAlert('输入验证码!');
        } else if (code != num) {
            ErroAlert('验证码错误！请重新输入！');
        } else {
            // alert(`loginUrl=${loginUrl}`);
            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                url: loginUrl,
                data: JSON.stringify({username: login, password: pwd}),
                success: function (res) {
                    sessionStorage.setItem('jwt_code', res);
                    var jwtCode = sessionStorage.getItem('jwt_code');
                    while (isNullOrEmpty(jwtCode)) {
                        jwtCode = sessionStorage.getItem('jwt_code');
                    }
                    let homeUrl = `${baseUrl}`;
                    window.location.href = homeUrl;
                },
                error: function (res) {
                    ErroAlert(res.responseJSON);
                }
            });

        }
    })
});

//错误提示框
function ErroAlert(msgText) {
    layer.msg(msgText, {
        time: 20000, //20s后自动关闭
        area: '300px;',
        btn: '确认'
    });
}

