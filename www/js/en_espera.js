$(function() {
    if(localStorage.getItem('api_token') == null) {
        window.location = "index.html";
    }

    $.ajax({
        url: 'https://glacial-brushlands-85257.herokuapp.com/api/en-espera',
        data: {
            "api_token": localStorage.getItem('api_token'),
        },
        type: 'get',
        success: function (response) {
            if(response['error'] == null && response['estado'] == 'OK') {
                response['usuarios'].forEach(usuario => {
                    $('#en_espera').append($('<button type="button" class="list-group-item list-group-item-action">'+usuario['name']+'</button>'));
                    $('#en_espera:last-child').click(crearPartida(usuario['id']));
                });
            } else {
                $('#en_espera').append($('<p>Ha ocurrido un error al recuperar los usuarios.</p>'));
            }
        }
    });

    function crearPartida(usuarioRival) {
        // SE EJECUTA POR CADA USUARIO QUE HAY EN LA LISTA
        $.ajax({
            url: 'https://glacial-brushlands-85257.herokuapp.com/api/jugar',
            data: {
                "api_token": localStorage.getItem('api_token'),
                "usuario-rival": usuarioRival,
            },
            type: 'post',
            success: function (response) {
                alert('partida '+response['partida']['id_partida']+' creada');
            }
        });
    }
  });