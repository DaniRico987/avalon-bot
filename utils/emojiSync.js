const fs = require("fs");
const { ROLES_RAID } = require("../config/eventTemplates");
const { rutaIconoArchivo } = require("./roleIcons");
const { registrarEmojiId, limpiarRegistro } = require("./emojiRegistry");

async function sincronizarEmojisRoles(client) {
  const guildId = process.env.GUILD_ID;
  if (!guildId) {
    console.warn("GUILD_ID no configurado: se usarán emojis unicode hasta subir iconos manualmente.");
    return;
  }

  const guild = await client.guilds.fetch(guildId).catch(() => null);
  if (!guild) {
    console.warn(`No se encontró el servidor ${guildId}.`);
    return;
  }

  limpiarRegistro();

  for (const meta of ROLES_RAID) {
    const ruta = rutaIconoArchivo(meta);
    if (!ruta || !fs.existsSync(ruta)) {
      continue;
    }

    const nombre = meta.icono.emojiName;
    let emoji = guild.emojis.cache.find((e) => e.name === nombre);

    try {
      if (emoji) {
        emoji = await emoji.edit({ attachment: ruta, name: nombre });
      } else {
        emoji = await guild.emojis.create({ attachment: ruta, name: nombre });
      }
      registrarEmojiId(nombre, emoji.id);
    } catch (error) {
      console.warn(`No se pudo sincronizar emoji "${nombre}": ${error.message}`);
    }
  }

  console.log(`${ROLES_RAID.length} icono(s) de rol sincronizado(s).`);
}

module.exports = { sincronizarEmojisRoles };
