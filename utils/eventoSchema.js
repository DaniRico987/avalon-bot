function crearRol(cupos) {
  return {
    cupos,
    miembros: [],
  };
}

function crearEvento({
  id,
  titulo,
  descripcion,
  fechaHora,
  creadorId,
  roles,
  mensajeId = null,
  canalId = null,
}) {
  return {
    id,
    titulo,
    descripcion,
    fechaHora,
    cerrado: false,
    creadorId,
    mensajeId,
    canalId,
    roles,
  };
}

module.exports = { crearRol, crearEvento };
