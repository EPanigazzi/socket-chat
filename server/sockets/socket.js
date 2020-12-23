const { io } = require("../server");
const { Usuarios } = require("../classes/usuarios");
const { response } = require("express");
const { crearMensaje } = require("../utilidades/utilidades");

const usuarios = new Usuarios();

io.on("connection", (client) => {
    client.on("entrarChat", (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                err: true,
                mensaje: "El nombre/sala es necesario",
            });
        }
        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);
        //Evento para que todos los conectados lo vean
        client.broadcast
            .to(data.sala)
            .emit("listaPersona", usuarios.getPersonasPorSala(data.sala));

        client.broadcast
            .to(data.sala)
            .emit(
                "crearMensaje",
                crearMensaje("Admin", `${data.nombre} se unió`)
            );

        callback(usuarios.getPersonasPorSala(data.sala));
    });

    client.on("crearMensaje", (data, callback) => {
        const persona = usuarios.getPersona(client.id);

        const mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit("crearMensaje", mensaje);
        callback(mensaje);
    });

    client.on("disconnect", () => {
        const personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast
            .to(personaBorrada.sala)
            .emit(
                "crearMensaje",
                crearMensaje("Admin", `${personaBorrada.nombre} salio`)
            );
        //Evento para que todos los conectados lo vean
        client.broadcast
            .to(personaBorrada.sala)
            .emit(
                "listaPersona",
                usuarios.getPersonasPorSala(personaBorrada.sala)
            );
    });

    //Mensajes privados
    //Es lo que va a hacer el servidor cuando alguien quiera mandar un mensaje priv a alguien
    client.on("mensajePrivado", (data) => {
        const persona = usuarios.getPersona(client.id);
        client.broadcast
            .to(data.para)
            .emit("mensajePrivado", crearMensaje(persona.nombre, data.mensaje));
    });
});
