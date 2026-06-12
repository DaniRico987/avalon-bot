require("dotenv").config();

const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

const carpetaComandos = path.join(__dirname, "commands");
const archivosComandos = fs.readdirSync(carpetaComandos).filter((f) => f.endsWith(".js"));

for (const archivo of archivosComandos) {
  const ruta = path.join(carpetaComandos, archivo);
  const comando = require(ruta);
  if (comando.data && comando.execute) {
    client.commands.set(comando.data.name, comando);
  }
}

const carpetaEventos = path.join(__dirname, "events");
const archivosEventos = fs.readdirSync(carpetaEventos).filter((f) => f.endsWith(".js"));

for (const archivo of archivosEventos) {
  const evento = require(path.join(carpetaEventos, archivo));
  if (evento.once) {
    client.once(evento.name, (...args) => evento.execute(...args));
  } else {
    client.on(evento.name, (...args) => evento.execute(...args));
  }
}

if (!process.env.DISCORD_TOKEN) {
  console.error("Falta DISCORD_TOKEN en el archivo .env");
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
