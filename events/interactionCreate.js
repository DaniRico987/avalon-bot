const { Events } = require("discord.js");
const { obtenerEvento, actualizarEvento } = require("../utils/eventoStore");
const { obtenerRolPorValue } = require("../config/eventTemplates");
const { parsearCustomId, crearMensajeRaid } = require("../builders/selectMenuBuilder");
const { MODAL_ID, manejarModalCreate } = require("../commands/crearEvento");

function quitarUsuarioDeRoles(evento, userId) {
  for (const rol of Object.values(evento.roles)) {
    rol.miembros = rol.miembros.filter((m) => m.id !== userId);
  }
}

async function manejarSelectMenu(interaction) {
  const eventoId = parsearCustomId(interaction.customId);
  if (!eventoId) {
    return;
  }

  const evento = obtenerEvento(eventoId);
  if (!evento) {
    await interaction.reply({ content: "Este evento ya no existe.", ephemeral: true });
    return;
  }

  if (evento.cerrado) {
    await interaction.reply({ content: "Este evento está cerrado.", ephemeral: true });
    return;
  }

  const value = interaction.values[0];
  const meta = obtenerRolPorValue(value);
  if (!meta) {
    await interaction.reply({ content: "Rol no válido.", ephemeral: true });
    return;
  }

  const rol = evento.roles[meta.nombre];
  if (!rol) {
    await interaction.reply({ content: "Rol no encontrado en el evento.", ephemeral: true });
    return;
  }

  const yaEnEsteRol = rol.miembros.some((m) => m.id === interaction.user.id);
  if (yaEnEsteRol) {
    await interaction.reply({ content: `Ya estás apuntado como **${meta.nombre}**.`, ephemeral: true });
    return;
  }

  if (rol.miembros.length >= rol.cupos) {
    await interaction.reply({ content: `**${meta.nombre}** está lleno.`, ephemeral: true });
    return;
  }

  quitarUsuarioDeRoles(evento, interaction.user.id);
  rol.miembros.push({
    id: interaction.user.id,
    nombre: interaction.member?.displayName ?? interaction.user.username,
  });

  actualizarEvento(evento.id, evento);

  const canal = await interaction.client.channels.fetch(evento.canalId);
  const mensaje = await canal.messages.fetch(evento.mensajeId);
  await mensaje.edit(crearMensajeRaid(evento));

  await interaction.reply({
    content: `Te apuntaste como **${meta.nombre}**.`,
    ephemeral: true,
  });
}

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const comando = interaction.client.commands.get(interaction.commandName);
      if (!comando) {
        return;
      }

      try {
        await comando.execute(interaction);
      } catch (error) {
        console.error(error);
        const respuesta = { content: "Hubo un error al ejecutar el comando.", ephemeral: true };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(respuesta);
        } else {
          await interaction.reply(respuesta);
        }
      }
      return;
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId !== MODAL_ID) {
        return;
      }

      try {
        await manejarModalCreate(interaction);
      } catch (error) {
        console.error(error);
        const respuesta = { content: "Hubo un error al crear el evento.", ephemeral: true };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(respuesta);
        } else {
          await interaction.reply(respuesta);
        }
      }
      return;
    }

    if (interaction.isStringSelectMenu()) {
      try {
        await manejarSelectMenu(interaction);
      } catch (error) {
        console.error(error);
        const respuesta = { content: "Hubo un error al procesar tu selección.", ephemeral: true };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(respuesta);
        } else {
          await interaction.reply(respuesta);
        }
      }
    }
  },
};
