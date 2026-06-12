const { SlashCommandBuilder } = require("discord.js");
const { crearEvento } = require("../utils/eventoSchema");
const { agregarEvento, actualizarEvento } = require("../utils/eventoStore");
const { crearRolesDesdeCatalogo } = require("../utils/rolesCatalogo");
const { buildRaidMessage } = require("../utils/raidMessage");

function generarIdEvento() {
  return `evt_${Date.now().toString(36)}`;
}

function parsearFecha(texto) {
  const fecha = new Date(texto);
  if (Number.isNaN(fecha.getTime())) {
    return null;
  }
  return fecha;
}

const data = new SlashCommandBuilder()
  .setName("crear-evento")
  .setDescription("Crea un evento de raid con select menu de roles")
  .addStringOption((option) =>
    option.setName("titulo").setDescription("Nombre del evento").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("codigo")
      .setDescription("Código del raid (ej. T7-avalon)")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("fecha")
      .setDescription("Fecha y hora (ej. 2026-06-15 20:00)")
      .setRequired(true)
  );

async function execute(interaction) {
  const titulo = interaction.options.getString("titulo", true);
  const codigo = interaction.options.getString("codigo", true);
  const fechaTexto = interaction.options.getString("fecha", true);
  const fechaHora = parsearFecha(fechaTexto);

  if (!fechaHora) {
    await interaction.reply({
      content:
        "Fecha inválida. Usa un formato como `2026-06-15 20:00` o ISO (`2026-06-15T20:00:00`).",
      ephemeral: true,
    });
    return;
  }

  const id = generarIdEvento();
  const roles = crearRolesDesdeCatalogo();

  const evento = crearEvento({
    id,
    titulo,
    codigo,
    fechaHora,
    creadorId: interaction.user.id,
    roles,
  });

  agregarEvento(evento);

  const mensaje = await interaction.channel.send(buildRaidMessage(evento));

  evento.mensajeId = mensaje.id;
  evento.canalId = mensaje.channel.id;
  actualizarEvento(id, evento);

  await interaction.reply({
    content: `Evento **${titulo}** creado. Usa el menú del mensaje para apuntarte.`,
    ephemeral: true,
  });
}

module.exports = { data, execute };
