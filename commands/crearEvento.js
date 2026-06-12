const { SlashCommandBuilder } = require("discord.js");
const { crearEvento } = require("../utils/eventoSchema");
const { agregarEvento, actualizarEvento } = require("../utils/eventoStore");
const { crearRolesDesdePlantilla } = require("../config/eventTemplates");
const { crearMensajeRaid } = require("../builders/selectMenuBuilder");

function generarId() {
  return `evt_${Date.now().toString(36)}`;
}

function parsearFecha(texto) {
  const fecha = new Date(texto);
  if (Number.isNaN(fecha.getTime())) {
    return null;
  }
  return fecha;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("event")
    .setDescription("Gestiona eventos de raid")
    .addSubcommand((sub) =>
      sub
        .setName("create")
        .setDescription("Crea un nuevo evento de raid")
        .addStringOption((opt) =>
          opt.setName("titulo").setDescription("Nombre del evento").setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("fecha")
            .setDescription("Fecha y hora (ej: 2026-06-15 20:00)")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    if (interaction.options.getSubcommand() !== "create") {
      return;
    }

    const titulo = interaction.options.getString("titulo");
    const fechaTexto = interaction.options.getString("fecha");
    const fechaHora = parsearFecha(fechaTexto);

    if (!fechaHora) {
      await interaction.reply({
        content: "Fecha inválida. Usa un formato como `2026-06-15 20:00`.",
        ephemeral: true,
      });
      return;
    }

    const evento = crearEvento({
      id: generarId(),
      titulo,
      fechaHora,
      creadorId: interaction.user.id,
      roles: crearRolesDesdePlantilla(),
    });

    agregarEvento(evento);

    const mensaje = await interaction.channel.send(crearMensajeRaid(evento));

    evento.mensajeId = mensaje.id;
    evento.canalId = mensaje.channel.id;
    actualizarEvento(evento.id, evento);

    await interaction.reply({
      content: `Evento **${titulo}** creado.`,
      ephemeral: true,
    });
  },
};
