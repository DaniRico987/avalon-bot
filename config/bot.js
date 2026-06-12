module.exports = {
  // Zona horaria en la que el creador introduce fecha y hora del evento.
  ZONA_HORARIA: process.env.EVENT_TIMEZONE || "Europe/Madrid",
  // ID del servidor donde se sincronizan los iconos de assets/roles/ como emojis.
  GUILD_ID: process.env.GUILD_ID || null,
};
