const { EmbedBuilder } = require("discord.js");
const { ROLES_RAID } = require("../config/eventTemplates");
const { formatearTimestampsDiscord } = require("../utils/timeUtils");
const { formatearNombreRol } = require("../utils/roleIcons");

function crearEmbed(evento) {
  const tiempos = formatearTimestampsDiscord(evento.fechaHora);

  const campos = ROLES_RAID.map((meta) => {
    const rol = evento.roles[meta.nombre];
    const lista =
      rol.miembros.length > 0
        ? rol.miembros.map((m) => m.nombre).join("\n")
        : "—";

    return {
      name: `${formatearNombreRol(meta)} (${rol.miembros.length}/${rol.cupos})`,
      value: lista,
      inline: true,
    };
  });

  const descripcionPartes = [
    evento.descripcion,
    "",
    `**Cuándo:** ${tiempos.absoluto}`,
    `**Falta:** ${tiempos.relativo}`,
  ];

  const embed = new EmbedBuilder()
    .setTitle(evento.titulo)
    .setDescription(descripcionPartes.join("\n"))
    .addFields(campos)
    .setColor(evento.cerrado ? 0xed4245 : 0x5865f2)
    .setFooter({
      text: evento.cerrado
        ? "Evento cerrado — ya no se aceptan inscripciones"
        : "Cada persona ve la hora en su zona horaria · Elige tu rol abajo",
    })
    .setTimestamp(evento.fechaHora);

  return embed;
}

module.exports = { crearEmbed };
