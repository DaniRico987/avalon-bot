const { EmbedBuilder } = require("discord.js");

// Formatea la diferencia entre fechaHora y ahora como "en X horas y Y minutos"
function formatearCountdown(fechaHora) {
  const ahora = new Date();
  const diffMs = fechaHora.getTime() - ahora.getTime();

  if (diffMs <= 0) {
    return "El evento ya comenzó";
  }

  const totalMinutos = Math.floor(diffMs / 1000 / 60);
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  const partes = [];
  if (horas > 0) {
    partes.push(`${horas} hora${horas === 1 ? "" : "s"}`);
  }
  if (minutos > 0 || horas === 0) {
    partes.push(`${minutos} minuto${minutos === 1 ? "" : "s"}`);
  }

  return `en ${partes.join(" y ")}`;
}

// Formatea la fecha como "11 de junio de 2026"
function formatearFecha(fechaHora) {
  return fechaHora.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Formatea la hora como "13:50"
function formatearHora(fechaHora) {
  return fechaHora.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Genera el texto de un rol, ej:
// "Caller (1/1)\nrolan35"
// "Falce (2/3)\nAntivil, FanDeLil"
// "Scout (0/1)\n_vacío_"
function formatearRol(nombreRol, rol) {
  const encabezado = `${nombreRol} (${rol.miembros.length}/${rol.cupos})`;
  const nombres =
    rol.miembros.length > 0
      ? rol.miembros.map((m) => m.nombre).join(", ")
      : "_vacío_";

  return { encabezado, nombres };
}

function crearEmbed(evento) {
  const embed = new EmbedBuilder()
    .setTitle(evento.titulo)
    .setColor(evento.cerrado ? 0x808080 : 0x5865f2)
    .addFields(
      {
        name: "📅 Fecha",
        value: formatearFecha(evento.fechaHora),
        inline: true,
      },
      { name: "🕐 Hora", value: formatearHora(evento.fechaHora), inline: true },
      {
        name: "⏳ Cuenta atrás",
        value: evento.cerrado
          ? "Evento cerrado"
          : formatearCountdown(evento.fechaHora),
        inline: true,
      },
      { name: "🚩 Código", value: `/join ${evento.codigo}`, inline: false },
    );

  // Una field por cada rol, mostrando cupos e inscritos
  for (const [nombreRol, rol] of Object.entries(evento.roles)) {
    const { encabezado, nombres } = formatearRol(nombreRol, rol);
    embed.addFields({ name: encabezado, value: nombres, inline: true });
  }

  if (evento.cerrado) {
    embed.setFooter({ text: "Este evento está cerrado." });
  }

  return embed;
}

module.exports = { crearEmbed };
