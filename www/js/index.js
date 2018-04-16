function comprobarLogin() {
    $.ajax({
        data: $("#formularioLogin").serialize(), //datos que se envian a traves de ajax
        url: 'URL_LOGIN', //archivo que recibe la peticion
        type: 'post', //método de envio
        success: function (response) { //una vez que el archivo recibe el request lo procesa y lo devuelve
            $("#resultado").html(response);
        }
    });
}