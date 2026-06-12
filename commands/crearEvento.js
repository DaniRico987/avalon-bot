const { SlashCommandBuilder } = require("discord.js");
const { crearEvento, crearRol } = require("../utils/eventoSchema");
const { agregarEvento } = require("../utils/eventoStore");
const { crearEmbed } = require("../builders/embedBuilder");
const { crearSelectMenu } = require("../builders/selectMenuBuilder");
const { ROLES_DEFAULT } = require("../config/eventTemplates");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crear-evento")
    .setDescription("Crea un nuevo evento de raid")
    .addStringOption((opcion) =>
      opcion
        .setName("titulo")
        .setDescription("Título del evento")
        .setRequired(true),
    )
    .addStringOption((opcion) =>
      opcion
        .setName("fecha")
        .setDescription("Fecha del evento (formato: AAAA-MM-DD)")
        .setRequired(true),
    )
    .addStringOption((opcion) =>
      opcion
        .setName("hora")
        .setDescription("Hora del evento (formato: HH:MM)")
        .setRequired(true),
    ),

  async execute(interaction) {
    const titulo = interaction.options.getString("titulo");
    const fecha = interaction.options.getString("fecha");
    const hora = interaction.options.getString("hora");

    // Combinar fecha y hora en un solo Date
    const fechaHoraTexto = `${fecha}T${hora}:00`;
    const fechaHora = new Date(fechaHoraTexto);

    // Validar que sea una fecha válida
    if (isNaN(fechaHora.getTime())) {
      await interaction.reply({
        content:
          "❌ Formato de fecha u hora inválido. Usa el formato AAAA-MM-DD para la fecha y HH:MM para la hora.",
        ephemeral: true,
      });
      return;
    }

    // Validar que no sea en el pasado
    if (fechaHora.getTime() < Date.now()) {
      await interaction.reply({
        content: "❌ La fecha y hora del evento no pueden estar en el pasado.",
        ephemeral: true,
      });
      return;
    }

    // Construir los roles a partir de la plantilla por defecto
    const roles = {};
    for (const [nombreRol, cupos] of Object.entries(ROLES_DEFAULT)) {
      roles[nombreRol] = crearRol(cupos);
    }

    // Construir el objeto evento
    const evento = crearEvento({
      id: interaction.id,
      titulo,
      fechaHora,
      creadorId: interaction.user.id,
      roles,
    });

    // Guardar el evento
    agregarEvento(evento);

    // Generar embed y select menu
    const embed = crearEmbed(evento);
    const selectMenu = crearSelectMenu(evento);

    // Enviar el mensaje del evento
    await interaction.reply({
      embeds: [embed],
      components: [selectMenu],
    });
  },
};
