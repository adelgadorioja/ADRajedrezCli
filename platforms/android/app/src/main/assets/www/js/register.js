$(function() {
    $("input[name='botonRegister']").click(comprobarRegistro);
  });

function comprobarRegistro() {
    $.ajax({
        data: $("#formularioRegister").serialize(),
        url: 'https://glacial-brushlands-85257.herokuapp.com/api/register',
        type: 'post',
        success: function (response) {
            if(response['data']['api_token'] != null) {
                localStorage.setItem("api_token", response['data']['api_token']);
                window.location = "en_espera.html";
            } else {
                $("#formularioRegister")[0].reset();
                $("input[type='text'], input[type='password']").css('border-color', 'red');
            }
        }
    });
}