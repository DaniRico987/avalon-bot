const { crearRol } = require("../utils/eventoSchema");

// icono.archivo: PNG en assets/roles/ (reemplaza el placeholder cuando tengas el icono real)
// Al arrancar el bot se sincronizan como emojis del servidor si GUILD_ID está en .env
const ROLES_RAID = [  {
    nombre: "Caller",
    value: "rol_caller",
    cupos: 1,
    loot: "Loot de caller",
    icono: { archivo: "caller.png", emojiId: null, emojiName: "caller", unicode: "📢" },
  },
  {
    nombre: "Off-tank",
    value: "rol_off_tank",
    cupos: 1,
    loot: "Loot de off-tank",
    icono: { archivo: "off-tank.png", emojiId: null, emojiName: "off_tank", unicode: "🛡️" },
  },
  {
    nombre: "Shadow caller",
    value: "rol_shadow_caller",
    cupos: 1,
    loot: "Loot de shadow caller",
    icono: { archivo: "shadow-caller.png", emojiId: null, emojiName: "shadow_caller", unicode: "🌑" },
  },
  {
    nombre: "Healer",
    value: "rol_healer",
    cupos: 1,
    loot: "Loot de healer",
    icono: { archivo: "healer.png", emojiId: null, emojiName: "healer", unicode: "💚" },
  },
  {
    nombre: "Falce",
    value: "rol_falce",
    cupos: 3,
    loot: "Loot de falce (3 puestos)",
    icono: { archivo: "falce.png", emojiId: null, emojiName: "falce", unicode: "⚔️" },
  },
  {
    nombre: "Falce-daga",
    value: "rol_falce_daga",
    cupos: 3,
    loot: "Loot de falce-daga (3 puestos)",
    icono: { archivo: "falce-daga.png", emojiId: null, emojiName: "falce_daga", unicode: "🗡️" },
  },
  {
    nombre: "Scout",
    value: "rol_scout",
    cupos: 1,
    loot: "Loot de scout",
    icono: { archivo: "scout.png", emojiId: null, emojiName: "scout", unicode: "👁️" },
  },
  {
    nombre: "Banca",
    value: "rol_banca",
    cupos: 20,
    loot: "Lista de espera",
    icono: { archivo: "banca.png", emojiId: null, emojiName: "banca", unicode: "💺" },
  },
];

function crearRolesDesdePlantilla() {
  const roles = {};
  for (const rol of ROLES_RAID) {
    roles[rol.nombre] = crearRol(rol.cupos);
  }
  return roles;
}

function obtenerRolPorValue(value) {
  return ROLES_RAID.find((rol) => rol.value === value);
}

function obtenerRolPorNombre(nombre) {
  return ROLES_RAID.find((rol) => rol.nombre === nombre);
}

module.exports = {
  ROLES_RAID,
  crearRolesDesdePlantilla,
  obtenerRolPorValue,
  obtenerRolPorNombre,
};
