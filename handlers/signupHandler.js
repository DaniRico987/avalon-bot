const { obtenerEvento, actualizarEvento } = require("../utils/eventoStore");
const { obtenerRolPorValue } = require("../utils/rolesCatalogo");
const { buildRaidMessage } = require("../utils/raidMessage");

function usuarioYaInscrito(evento, userId) {
  for (const rol of Object.values(evento.roles)) {
    if (rol.miembros.some((m) => m.id === userId)) {
      return true;
    }
  }
  return false;
}

function quitarUsuarioDeRoles(evento, userId) {
  for (const rol of Object.values(evento.roles)) {
    rol.miembros = rol.miembros.filter((m) => m.id !== userId);
  }
}

async function handleSignup(interaction) {
  const [, eventoId] = interaction.customId.split(":");
  const valueSeleccionado = interaction.values[0];

  const evento = obtenerEvento(eventoId);
  if (!evento) {
    await interaction.reply({
      content: "Este evento ya no existe.",
      ephemeral: true,
    });
    return;
  }

  if (evento.cerrado) {
    await interaction.reply({
      content: "Este evento está cerrado.",
      ephemeral: true,
    });
    return;
  }

  const meta = obtenerRolPorValue(valueSeleccionado);
  if (!meta) {
    await interaction.reply({
      content: "Rol no válido.",
      ephemeral: true,
    });
    return;
  }

  const rol = evento.roles[meta.nombre];
  if (!rol) {
    await interaction.reply({
      content: "Rol no encontrado en el evento.",
      ephemeral: true,
    });
    return;
  }

  const userId = interaction.user.id;
  const yaEnEsteRol = rol.miembros.some((m) => m.id === userId);

  if (yaEnEsteRol) {
    await interaction.reply({
      content: `Ya estás apuntado como **${meta.nombre}**.`,
      ephemeral: true,
    });
    return;
  }

  if (rol.miembros.length >= rol.cupos) {
    await interaction.reply({
      content: `**${meta.nombre}** está lleno (${rol.cupos}/${rol.cupos}).`,
      ephemeral: true,
    });
    return;
  }

  if (usuarioYaInscrito(evento, userId)) {
    quitarUsuarioDeRoles(evento, userId);
  }

  rol.miembros.push({
    id: userId,
    nombre: interaction.member?.displayName ?? interaction.user.username,
  });

  actualizarEvento(eventoId, evento);

  const canal = await interaction.client.channels.fetch(evento.canalId);
  const mensaje = await canal.messages.fetch(evento.mensajeId);
  await mensaje.edit(buildRaidMessage(evento));

  await interaction.reply({
    content: `Te apuntaste como **${meta.nombre}**.`,
    ephemeral: true,
  });
}

module.exports = { handleSignup };
