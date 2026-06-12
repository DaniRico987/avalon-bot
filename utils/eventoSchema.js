// Forma de un "rol" dentro del evento
function crearRol(cupos) {
  return {
    cupos: cupos,
    miembros: [], // cada elemento: { id: "123456789", nombre: "rolan35" }
  };
}

// Forma completa de un "evento"
function crearEvento({ id, titulo, fechaHora, creadorId, roles }) {
  return {
    id,
    titulo,
    fechaHora, // objeto Date de JavaScript
    cerrado: false,
    creadorId,
    roles, // objeto: { "Caller": crearRol(1), "Falce": crearRol(3), ... }
  };
}

module.exports = { crearRol, crearEvento };
