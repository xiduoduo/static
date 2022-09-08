var baseUrl = 'https://127.0.0.1:8080';
var webRootUrl = 'https://127.0.0.1:8080';
baseUrl = "/static";
webRootUrl = "";

var loginUrl = "/login";

function checkLogin() {
    var jwtCode = sessionStorage.getItem('jwt_code');
    // console.log(`jwtCode=${jwtCode}`);
    if (typeof jwtCode == "undefined" || jwtCode == null || jwtCode == "" || jwtCode == undefined) {
        window.location.href = `${baseUrl}/login.html`;
        return;
    }
    let pingUrl = `${webRootUrl}/ping`;
    $.ajax({
        type: 'HEAD',
        url: pingUrl,
        headers: {
            'Authorization': 'bearer ' + jwtCode
        },
        success: function (resp) {
            if (resp != undefined && resp.code != undefined && resp.code == 401) {
                window.location.href = `${baseUrl}/login.html`;
                return;
            }
        },
        error: function (resp) {
            window.location.href = `${baseUrl}/login.html`;
            return;
        }
    });
}
