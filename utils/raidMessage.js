const {
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");
const { obtenerRolPorNombre } = require("./rolesCatalogo");

function truncar(texto, max) {
  if (!texto) return "";
  return texto.length <= max ? texto : texto.slice(0, max - 1) + "…";
}

function formatearFecha(fecha) {
  return fecha.toLocaleString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildRaidEmbed(evento) {
  const campos = Object.entries(evento.roles).map(([nombre, rol]) => {
    const lista =
      rol.miembros.length > 0
        ? rol.miembros.map((m) => m.nombre).join(", ")
        : "—";

    return {
      name: `${nombre} (${rol.miembros.length}/${rol.cupos})`,
      value: lista,
      inline: true,
    };
  });

  const embed = new EmbedBuilder()
    .setTitle(evento.titulo)
    .setDescription(
      `**Código:** ${evento.codigo}\n**Fecha:** ${formatearFecha(evento.fechaHora)}`
    )
    .addFields(campos)
    .setColor(evento.cerrado ? 0xed4245 : 0x5865f2)
    .setTimestamp(evento.fechaHora);

  if (evento.cerrado) {
    embed.setFooter({ text: "Evento cerrado" });
  }

  return embed;
}

function buildRoleSelectMenu(evento) {
  const opciones = Object.entries(evento.roles).map(([nombre, rol]) => {
    const meta = obtenerRolPorNombre(nombre);
    const lleno = rol.miembros.length >= rol.cupos;
    const descripcion = lleno
      ? `Lleno (${rol.cupos}/${rol.cupos})`
      : truncar(meta?.loot ?? "", 100);

    return {
      label: truncar(nombre, 100),
      description: truncar(descripcion, 100),
      value: meta.value,
    };
  });

  const menu = new StringSelectMenuBuilder()
    .setCustomId(`raid_signup:${evento.id}`)
    .setPlaceholder("Elige tu rol")
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions(opciones);

  if (evento.cerrado) {
    menu.setDisabled(true);
  }

  return menu;
}

function buildRaidMessage(evento) {
  const embed = buildRaidEmbed(evento);
  const selectMenu = buildRoleSelectMenu(evento);
  const row = new ActionRowBuilder().addComponents(selectMenu);

  return {
    embeds: [embed],
    components: evento.cerrado ? [] : [row],
  };
}

module.exports = {
  buildRaidEmbed,
  buildRoleSelectMenu,
  buildRaidMessage,
};
