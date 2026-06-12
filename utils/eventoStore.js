const fs = require("fs");
const path = require("path");

const RUTA_ARCHIVO = path.join(__dirname, "..", "data", "eventos.json");

function asegurarArchivo() {
  const directorio = path.dirname(RUTA_ARCHIVO);
  if (!fs.existsSync(directorio)) {
    fs.mkdirSync(directorio, { recursive: true });
  }
  if (!fs.existsSync(RUTA_ARCHIVO)) {
    fs.writeFileSync(RUTA_ARCHIVO, "{}", "utf-8");
  }
}

function cargarEventos() {
  asegurarArchivo();
  const contenido = fs.readFileSync(RUTA_ARCHIVO, "utf-8");
  const eventos = JSON.parse(contenido);

  for (const id in eventos) {
    eventos[id].fechaHora = new Date(eventos[id].fechaHora);
  }

  return eventos;
}

function guardarEventos(eventos) {
  const contenido = JSON.stringify(eventos, null, 2);
  fs.writeFileSync(RUTA_ARCHIVO, contenido, "utf-8");
}

function obtenerEvento(id) {
  const eventos = cargarEventos();
  return eventos[id];
}

function agregarEvento(evento) {
  const eventos = cargarEventos();
  eventos[evento.id] = evento;
  guardarEventos(eventos);
}

function actualizarEvento(id, eventoActualizado) {
  const eventos = cargarEventos();
  eventos[id] = eventoActualizado;
  guardarEventos(eventos);
}

module.exports = {
  cargarEventos,
  guardarEventos,
  obtenerEvento,
  agregarEvento,
  actualizarEvento,
};
