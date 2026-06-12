function parsearFechaHora(fechaTexto, horaTexto, zonaHoraria) {
  const { ZONA_HORARIA } = require("../config/bot");
  const tz = zonaHoraria || ZONA_HORARIA;

  const fechaMatch = fechaTexto.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const horaMatch = horaTexto.trim().match(/^(\d{1,2}):(\d{2})$/);

  if (!fechaMatch || !horaMatch) {
    return null;
  }

  const year = Number(fechaMatch[1]);
  const month = Number(fechaMatch[2]);
  const day = Number(fechaMatch[3]);
  const hour = Number(horaMatch[1]);
  const minute = Number(horaMatch[2]);

  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) {
    return null;
  }

  let guess = Date.UTC(year, month - 1, day, hour, minute);

  for (let i = 0; i < 5; i++) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    const partes = Object.fromEntries(
      formatter
        .formatToParts(new Date(guess))
        .filter((p) => p.type !== "literal")
        .map((p) => [p.type, Number(p.value)])
    );

    const delta =
      Date.UTC(year, month - 1, day, hour, minute) -
      Date.UTC(partes.year, partes.month - 1, partes.day, partes.hour, partes.minute);

    guess += delta;
    if (delta === 0) {
      break;
    }
  }

  return new Date(guess);
}

function aUnix(fecha) {
  return Math.floor(fecha.getTime() / 1000);
}

function formatearTimestampsDiscord(fecha) {
  const unix = aUnix(fecha);
  return {
    absoluto: `<t:${unix}:F>`,
    relativo: `<t:${unix}:R>`,
    corto: `<t:${unix}:t>`,
    texto: `<t:${unix}:F> (<t:${unix}:R>)`,
  };
}

function eventoYaPasó(fechaHora) {
  return fechaHora.getTime() <= Date.now();
}

function msHasta(fechaHora) {
  return Math.max(0, fechaHora.getTime() - Date.now());
}

module.exports = {
  parsearFechaHora,
  formatearTimestampsDiscord,
  eventoYaPasó,
  msHasta,
  aUnix,
};
