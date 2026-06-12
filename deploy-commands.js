// deploy-commands.js
require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

const comandos = [];
const carpetaComandos = path.join(__dirname, "commands");
const archivos = fs
  .readdirSync(carpetaComandos)
  .filter((f) => f.endsWith(".js"));

for (const archivo of archivos) {
  const comando = require(path.join(carpetaComandos, archivo));
  comandos.push(comando.data.toJSON());
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Registrando ${comandos.length} comando(s)...`);

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
      ),
      { body: comandos },
    );

    console.log("✅ Comandos registrados correctamente.");
  } catch (error) {
    console.error(error);
  }
})();
