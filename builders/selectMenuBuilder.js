const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { ROLES_RAID } = require("../config/eventTemplates");
const { crearEmbed } = require("./embedBuilder");

const CUSTOM_ID_PREFIX = "raid_signup";

function truncar(texto, max) {
  return texto.length <= max ? texto : `${texto.slice(0, max - 1)}…`;
}

function crearSelectMenu(evento) {
  const opciones = ROLES_RAID.map((meta) => {
    const rol = evento.roles[meta.nombre];
    const lleno = rol.miembros.length >= rol.cupos;
    const cuposTexto = `${rol.miembros.length}/${rol.cupos} cupos`;

    return {
      label: meta.nombre,
      description: truncar(lleno ? `${cuposTexto} — Lleno` : `${meta.loot} · ${cuposTexto}`, 100),
      value: meta.value,
      default: false,
      disabled: lleno || evento.cerrado,
    };
  });

  return new StringSelectMenuBuilder()
    .setCustomId(`${CUSTOM_ID_PREFIX}:${evento.id}`)
    .setPlaceholder(evento.cerrado ? "Evento cerrado" : "Elige tu rol")
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions(opciones)
    .setDisabled(evento.cerrado);
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
  const row = new ActionRowBuilder().addComponents(selectMenu);

  return {
    embeds: [embed],
    components: [row],
  };
}

module.exports = { crearSelectMenu, crearMensajeRaid, parsearCustomId, CUSTOM_ID_PREFIX };
