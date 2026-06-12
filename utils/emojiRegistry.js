const emojiIds = new Map();

function registrarEmojiId(nombre, id) {
  emojiIds.set(nombre, id);
}

function obtenerEmojiId(nombre) {
  return emojiIds.get(nombre) ?? null;
}

function limpiarRegistro() {
  emojiIds.clear();
}

module.exports = {
  registrarEmojiId,
  obtenerEmojiId,
  limpiarRegistro,
};
