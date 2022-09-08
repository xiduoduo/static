var jwtCode = sessionStorage.getItem('jwt_code');

(function ($) {
    $.fn.extend({
        "upload": function (url, callback) {
            // alert("upload");
            var that = this;
            if (that.val()) {
                var formData = new FormData(that.parents("form")[0]);
                $.ajax({
                    async: true,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: "POST",
                    dataType: "text",
                    url: url,
                    data: formData,
                    headers: {
                        'Authorization': 'bearer ' + jwtCode
                    },
                    error: function (e) {
                        that.val("");
                    },
                    success: function (data) {
                        that.val("");
                        if (jQuery.isFunction(callback)) {
                            callback.call(null, data);
                        }
                    }
                });
            }
        }
    });
})(window.jQuery);
