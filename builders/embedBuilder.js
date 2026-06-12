const { EmbedBuilder } = require("discord.js");

function formatearFecha(fecha) {
  return fecha.toLocaleString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function crearEmbed(evento) {
  const campos = Object.entries(evento.roles).map(([nombre, rol]) => {
    const lista =
      rol.miembros.length > 0
        ? rol.miembros.map((m) => m.nombre).join("\n")
        : "—";

    return {
      name: `${nombre} (${rol.miembros.length}/${rol.cupos})`,
      value: lista,
      inline: true,
    };
  });

  const embed = new EmbedBuilder()
    .setTitle(evento.titulo)
    .setDescription(`**Fecha:** ${formatearFecha(evento.fechaHora)}`)
    .addFields(campos)
    .setColor(evento.cerrado ? 0xed4245 : 0x5865f2)
    .setFooter({ text: evento.cerrado ? "Evento cerrado" : "Elige tu rol con el menú de abajo" })
    .setTimestamp(evento.fechaHora);

  return embed;
}

module.exports = { crearEmbed };
