class Usuarios {
    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        const persona = {
            id,
            nombre,
            sala,
        };
        this.personas.push(persona);

        return this.personas;
    }

    getPersona(id) {
        const persona = this.personas.filter((persona) => {
            return persona.id === id;
        })[0];

        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        const personasEnSala = this.personas.filter((persona) => {
            return persona.sala === sala;
        });
        return personasEnSala;
    }

    borrarPersona(id) {
        const personaBorrada = this.getPersona(id);

        this.personas = this.personas.filter((persona) => {
            return persona.id !== id; // regresar todas las personas cuyo id sean dif
        });

        return personaBorrada;
    }
}

module.exports = {
    Usuarios,
};
