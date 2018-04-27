$(function() {
    $("input[name='botonLogin']").click(comprobarLogin);

    if(localStorage.getItem('api_token') != null) {
        $.ajax({
            data: {
                "api_token": localStorage.getItem('api_token'),
            },
            url: 'https://glacial-brushlands-85257.herokuapp.com/api/logout',
            type: 'post',
            success: function (response) {
                localStorage.removeItem('api_token');
            }
        });
    }
  });

function comprobarLogin() {
    $.ajax({
        data: $("#formularioLogin").serialize(),
        url: 'https://glacial-brushlands-85257.herokuapp.com/api/login',
        type: 'post',
        success: function (response) {
            if(response['api_token'] != null) {
                localStorage.setItem("api_token", response['api_token']);
                window.location = "en_espera.html";
            } else {
                $("#formularioLogin")[0].reset();
                $("input[type='text'], input[type='password']").css('border-color', 'red');
            }
        }
    });
}