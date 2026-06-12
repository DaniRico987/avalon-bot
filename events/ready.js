const { Events, REST, Routes } = require("discord.js");
const path = require("path");
const fs = require("fs");
const { iniciarScheduler } = require("../utils/eventScheduler");
const { sincronizarEmojisRoles } = require("../utils/emojiSync");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    const comandos = [];
    const carpetaComandos = path.join(__dirname, "..", "commands");
    const archivos = fs.readdirSync(carpetaComandos).filter((f) => f.endsWith(".js"));

    for (const archivo of archivos) {
      const comando = require(path.join(carpetaComandos, archivo));
      if (comando.data) {
        comandos.push(comando.data.toJSON());
      }
    }

    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(client.user.id), { body: comandos });

    await sincronizarEmojisRoles(client);
    iniciarScheduler(client);

    console.log(`Bot conectado como ${client.user.tag}`);
    console.log(`${comandos.length} comando(s) registrado(s).`);
  },
};
