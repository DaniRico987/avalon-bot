const path = require("path");
const { obtenerEmojiId } = require("./emojiRegistry");

const CARPETA_ICONOS = path.join(__dirname, "..", "assets", "roles");

function resolverEmojiId(meta) {
  if (meta.icono?.emojiId) {
    return meta.icono.emojiId;
  }
  if (meta.icono?.emojiName) {
    return obtenerEmojiId(meta.icono.emojiName);
  }
  return null;
}

function formatearNombreRol(meta) {
  const emojiId = resolverEmojiId(meta);
  if (emojiId) {
    return `<:${meta.icono.emojiName}:${emojiId}> ${meta.nombre}`;
  }
  if (meta.icono?.unicode) {
    return `${meta.icono.unicode} ${meta.nombre}`;
  }
  return meta.nombre;
}

function obtenerEmojiOpcion(meta) {
  const emojiId = resolverEmojiId(meta);
  if (emojiId) {
    return { id: emojiId, name: meta.icono.emojiName };
  }
  if (meta.icono?.unicode) {
    return { name: meta.icono.unicode };
  }
  return undefined;
}

function rutaIconoArchivo(meta) {
  if (!meta.icono?.archivo) {
    return null;
  }
  return path.join(CARPETA_ICONOS, meta.icono.archivo);
}

module.exports = {
  formatearNombreRol,
  obtenerEmojiOpcion,
  rutaIconoArchivo,
  CARPETA_ICONOS,
};
