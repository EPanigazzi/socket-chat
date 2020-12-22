var socket = io();
const params = new URLSearchParams(window.location.search);

if (!params.has("nombre") || !params.has("sala")) {
    window.location = "index.html";
    throw new Error("El nombre y sala son necesarios");
}

const usuario = {
    nombre: params.get("nombre"),
    sala: params.get("sala"),
};

socket.on("connect", function () {
    console.log("Conectado al servidor");
    socket.emit("entrarChat", usuario, function (resp) {
        console.log("Usuarios conectados", resp);
    });
});

// escuchar
socket.on("disconnect", function () {
    console.log("Perdimos conexión con el servidor");
});

// Enviar información del cliente a todos los usuario
// socket.emit(
//     "crearMensaje",
//     {
//         usuario: "Fernando",
//         mensaje: "Hola Mundo",
//     },
//     function (resp) {
//         console.log("respuesta server: ", resp);
//     }
// );

// Escuchar información
socket.on("crearMensaje", function (mensaje) {
    console.log("Servidor:", mensaje);
});
// Escuchar cuando un usuario entra o sale del chat
socket.on("listaPersona", function (personas) {
    console.log(personas);
});

// Mensajes privados
//Escuchar del cliente un mensaje privado
socket.on("mensajePrivado", function (mensaje) {
    console.log("Mensaje Privado", mensaje);
});
