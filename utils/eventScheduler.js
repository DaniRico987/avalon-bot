const { obtenerEvento, actualizarEvento, obtenerEventosAbiertos } = require("./eventoStore");
const { crearMensajeRaid } = require("../builders/selectMenuBuilder");
const { eventoYaPasó, msHasta } = require("./timeUtils");

const timeouts = new Map();
let intervaloRespaldo = null;

async function cerrarEvento(client, eventoId) {
  const evento = obtenerEvento(eventoId);
  if (!evento || evento.cerrado) {
    return;
  }

  evento.cerrado = true;
  actualizarEvento(eventoId, evento);
  cancelarProgramacion(eventoId);

  if (!evento.mensajeId || !evento.canalId) {
    return;
  }

  try {
    const canal = await client.channels.fetch(evento.canalId);
    const mensaje = await canal.messages.fetch(evento.mensajeId);
    await mensaje.edit(crearMensajeRaid(evento));
  } catch (error) {
    console.error(`No se pudo actualizar el mensaje del evento ${eventoId}:`, error.message);
  }
}

function cancelarProgramacion(eventoId) {
  const timeout = timeouts.get(eventoId);
  if (timeout) {
    clearTimeout(timeout);
    timeouts.delete(eventoId);
  }
}

function programarCierre(client, evento) {
  cancelarProgramacion(evento.id);

  if (evento.cerrado) {
    return;
  }

  if (eventoYaPasó(evento.fechaHora)) {
    cerrarEvento(client, evento.id);
    return;
  }

  const ms = msHasta(evento.fechaHora);
  const timeout = setTimeout(() => {
    cerrarEvento(client, evento.id);
  }, ms);

  timeouts.set(evento.id, timeout);
}

function iniciarScheduler(client) {
  const abiertos = obtenerEventosAbiertos();
  for (const evento of abiertos) {
    programarCierre(client, evento);
  }

  if (intervaloRespaldo) {
    clearInterval(intervaloRespaldo);
  }

  intervaloRespaldo = setInterval(() => {
    for (const evento of obtenerEventosAbiertos()) {
      if (eventoYaPasó(evento.fechaHora)) {
        cerrarEvento(client, evento.id);
      }
    }
  }, 60_000);
}

module.exports = {
  iniciarScheduler,
  programarCierre,
  cerrarEvento,
  cancelarProgramacion,
};
