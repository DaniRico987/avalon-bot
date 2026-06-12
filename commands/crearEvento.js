const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");
const { crearEvento } = require("../utils/eventoSchema");
const { agregarEvento, actualizarEvento } = require("../utils/eventoStore");
const { crearRolesDesdePlantilla } = require("../config/eventTemplates");
const { crearMensajeRaid } = require("../builders/selectMenuBuilder");
const { parsearFechaHora, eventoYaPasó } = require("../utils/timeUtils");
const { programarCierre } = require("../utils/eventScheduler");
const { ZONA_HORARIA } = require("../config/bot");

const MODAL_ID = "event_create_modal";

function generarId() {
  return `evt_${Date.now().toString(36)}`;
}

function crearModalEvento() {
  const titulo = new TextInputBuilder()
    .setCustomId("titulo")
    .setLabel("Título del evento")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(100)
    .setPlaceholder("Raid Avalon — Cursed Sanctuary");

  const descripcion = new TextInputBuilder()
    .setCustomId("descripcion")
    .setLabel("Descripción")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(1000)
    .setPlaceholder("Tipo de contenido, requisitos de IP, loot, etc.");

  const fecha = new TextInputBuilder()
    .setCustomId("fecha")
    .setLabel("Fecha (YYYY-MM-DD)")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setPlaceholder("2026-06-15")
    .setMinLength(10)
    .setMaxLength(10);

  const hora = new TextInputBuilder()
    .setCustomId("hora")
    .setLabel(`Hora (HH:MM, zona ${ZONA_HORARIA})`)
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setPlaceholder("20:00")
    .setMinLength(4)
    .setMaxLength(5);

  return new ModalBuilder()
    .setCustomId(MODAL_ID)
    .setTitle("Crear evento de raid")
    .addComponents(
      new ActionRowBuilder().addComponents(titulo),
      new ActionRowBuilder().addComponents(descripcion),
      new ActionRowBuilder().addComponents(fecha),
      new ActionRowBuilder().addComponents(hora)
    );
}

async function manejarModalCreate(interaction) {
  const titulo = interaction.fields.getTextInputValue("titulo").trim();
  const descripcion = interaction.fields.getTextInputValue("descripcion").trim();
  const fechaTexto = interaction.fields.getTextInputValue("fecha").trim();
  const horaTexto = interaction.fields.getTextInputValue("hora").trim();

  const fechaHora = parsearFechaHora(fechaTexto, horaTexto);

  if (!fechaHora) {
    await interaction.reply({
      content: "Fecha u hora inválida. Usa `YYYY-MM-DD` y `HH:MM` (24h).",
      ephemeral: true,
    });
    return;
  }

  if (eventoYaPasó(fechaHora)) {
    await interaction.reply({
      content: "La fecha y hora deben ser futuras.",
      ephemeral: true,
    });
    return;
  }

  const evento = crearEvento({
    id: generarId(),
    titulo,
    descripcion,
    fechaHora,
    creadorId: interaction.user.id,
    roles: crearRolesDesdePlantilla(),
  });

  agregarEvento(evento);

  const mensaje = await interaction.channel.send(crearMensajeRaid(evento));

  evento.mensajeId = mensaje.id;
  evento.canalId = mensaje.channel.id;
  actualizarEvento(evento.id, evento);
  programarCierre(interaction.client, evento);

  await interaction.reply({
    content: `Evento **${titulo}** creado. Se cerrará automáticamente cuando llegue la hora.`,
    ephemeral: true,
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("event")
    .setDescription("Gestiona eventos de raid")
    .addSubcommand((sub) =>
      sub.setName("create").setDescription("Crea un nuevo evento de raid")
    ),

  async execute(interaction) {
    if (interaction.options.getSubcommand() !== "create") {
      return;
    }

    await interaction.showModal(crearModalEvento());
  },

  manejarModalCreate,
  MODAL_ID,
};
