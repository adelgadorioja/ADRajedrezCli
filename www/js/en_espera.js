var partida;
var piezaSeleccionada;

$(function () {
    if (localStorage.getItem('api_token') == null) {
        window.location = "index.html";
    }

    $.ajax({
        url: 'https://glacial-brushlands-85257.herokuapp.com/api/en-espera',
        data: {
            "api_token": localStorage.getItem('api_token'),
        },
        type: 'get',
        success: function (response) {
            if (response['error'] == null && response['estado'] == 'OK') {
                response['usuarios'].forEach(usuario => {
                    $('.list-group').append($('<button id="' + usuario['id'] + '" class="list-group-item list-group-item-action">' + usuario['name'] + '</button>'));
                    $('.list-group-item:last').click(crearPartida);
                });
            } else {
                $('.list-group').append($('<p>Ha ocurrido un error al recuperar los usuarios.</p>'));
            }
        }
    });
});

function crearPartida() {
    var usuarioRival = $(this).attr('id');
    $.ajax({
        url: 'https://glacial-brushlands-85257.herokuapp.com/api/jugar',
        data: {
            "api_token": localStorage.getItem('api_token'),
            "usuario-rival": usuarioRival,
        },
        type: 'post',
        success: function (response) {
            $('#en_espera').remove();
            partida = response['partida']['id_partida'];
            crearTablero();
            colocarPiezas();
        }
    });
}

function crearTablero() {
    $('.container:last').append($('<div id="tablero"></div>'));

    var fila = 0;
    var columna = 0;

    for (let casilla = 0; casilla < 64; casilla++) {
        if (casilla % 8 == 0) {
            fila++;
            columna = 0;
            $('#tablero').append('<div class="row justify-content-center"></div>');
        }
        columna++;

        if ((fila + columna) % 2 == 0) {
            color = 1;
        } else {
            color = 2;
        }

        var casillaTablero = $('<div class="casilla color-' + color + ' col-1"></div>');
        $(".row:last").append(casillaTablero);
        casillaTablero.attr("fila", fila);
        casillaTablero.attr("columna", columna);
        casillaTablero.innerHeight(casillaTablero.innerWidth());
        casillaTablero.click(comprobarMovimiento);
    }
}

function colocarPiezas() {
    var piezas;
    $.ajax({
        url: 'https://glacial-brushlands-85257.herokuapp.com/api/partida/' + partida,
        data: {
            "api_token": localStorage.getItem('api_token')
        },
        type: 'get',
        success: function (response) {
            var piezas = response['partida']['piezas'];
            var jugadorBlancas = response['partida']['jugador1'];
            piezas.forEach(pieza => {
                if(pieza['id_usuario'] == jugadorBlancas) {
                    colorPieza = "blanca";
                } else {
                    colorPieza = "negra";
                }
                var piezaGenerada = $('<div id_pieza="' + pieza['id_pieza'] + '" class="pieza ' + pieza['tipo'] +" "+ colorPieza +'"></div>');
                $('.casilla[fila="' + pieza['fila'] + '"][columna="' + pieza['columna'] + '"]').append(piezaGenerada);
                piezaGenerada.click(seleccionarPieza);
            });
        }
    });
}

function seleccionarPieza() {
    piezaSeleccionada = $(this).attr('id_pieza');
    $('.pieza').css('background-color', '');
    $('div[id_pieza="' + piezaSeleccionada + '"]').css('background-color', '#007bff');
}

function comprobarMovimiento() {
    if (piezaSeleccionada != null) {
        $.ajax({
            url: 'https://glacial-brushlands-85257.herokuapp.com/api/mover',
            data: {
                "api_token": localStorage.getItem('api_token'),
                "id_partida": partida,
                "id_pieza": piezaSeleccionada,
                "fila": $(this).attr('fila'),
                "columna": $(this).attr('columna')
            },
            type: 'post',
            success: function (response) {
                if (response['estado'] != 'KO') {
                    eliminarPiezas();
                    colocarPiezas();
                }
            }
        });
    }
}

function eliminarPiezas() {
    $('.pieza').remove();
}

