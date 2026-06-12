require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
} = require("discord.js");
const crearEvento = require("./commands/crearEvento");
const { handleSignup } = require("./handlers/signupHandler");

const comandos = [crearEvento];

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", async () => {
  console.log(`Conectado como ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  const cuerpo = comandos.map((cmd) => cmd.data.toJSON());

  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: cuerpo });
    console.log("Comandos slash registrados.");
  } catch (error) {
    console.error("Error al registrar comandos:", error);
  }
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const comando = comandos.find((cmd) => cmd.data.name === interaction.commandName);
      if (comando) {
        await comando.execute(interaction);
      }
      return;
    }

    if (interaction.isStringSelectMenu()) {
      if (interaction.customId.startsWith("raid_signup:")) {
        await handleSignup(interaction);
      }
    }
  } catch (error) {
    console.error("Error en interacción:", error);

    const mensaje = { content: "Ocurrió un error al procesar la acción.", ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(mensaje);
    } else {
      await interaction.reply(mensaje);
    }
  }
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("Falta DISCORD_TOKEN en el archivo .env");
  process.exit(1);
}

client.login(token);
