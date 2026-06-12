const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { ROLES_RAID } = require("../config/eventTemplates");
const { crearEmbed } = require("./embedBuilder");
const { obtenerEmojiOpcion } = require("../utils/roleIcons");

const CUSTOM_ID_PREFIX = "raid_signup";

function truncar(texto, max) {
  return texto.length <= max ? texto : `${texto.slice(0, max - 1)}…`;
}

function crearSelectMenu(evento) {
  if (evento.cerrado) {
    return null;
  }

  const opciones = ROLES_RAID.map((meta) => {
    const rol = evento.roles[meta.nombre];
    const lleno = rol.miembros.length >= rol.cupos;
    const cuposTexto = `${rol.miembros.length}/${rol.cupos} cupos`;
    const emoji = obtenerEmojiOpcion(meta);

    const opcion = {
      label: meta.nombre,
      description: truncar(lleno ? `${cuposTexto} — Lleno` : `${cuposTexto}`, 100),
      value: meta.value,
      default: false,
      disabled: lleno,
    };

    if (emoji) {
      opcion.emoji = emoji;
    }

    return opcion;
  });

  return new StringSelectMenuBuilder()
    .setCustomId(`${CUSTOM_ID_PREFIX}:${evento.id}`)
    .setPlaceholder("Elige tu rol")
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions(opciones);
}

function parsearCustomId(customId) {
  if (!customId.startsWith(`${CUSTOM_ID_PREFIX}:`)) {
    return null;
  }
  return customId.slice(`${CUSTOM_ID_PREFIX}:`.length);
}

function crearMensajeRaid(evento) {
  const embed = crearEmbed(evento);
  const selectMenu = crearSelectMenu(evento);

  if (!selectMenu) {
    return { embeds: [embed], components: [] };
  }

  const row = new ActionRowBuilder().addComponents(selectMenu);
  return { embeds: [embed], components: [row] };
}

module.exports = { crearSelectMenu, crearMensajeRaid, parsearCustomId, CUSTOM_ID_PREFIX };
