const { crearRol } = require("./eventoSchema");

const ROLES_RAID = [
  { nombre: "Caller", cupos: 1, loot: "Loot de caller", value: "rol_caller" },
  { nombre: "Off-tank", cupos: 1, loot: "Loot de off-tank", value: "rol_off_tank" },
  {
    nombre: "Shadow caller",
    cupos: 1,
    loot: "Loot de shadow caller",
    value: "rol_shadow_caller",
  },
  { nombre: "Healer", cupos: 1, loot: "Loot de healer", value: "rol_healer" },
  { nombre: "Falce", cupos: 3, loot: "Loot de falce", value: "rol_falce" },
  {
    nombre: "Falce-daga",
    cupos: 3,
    loot: "Loot de falce-daga",
    value: "rol_falce_daga",
  },
  { nombre: "Scout", cupos: 1, loot: "Loot de scout", value: "rol_scout" },
  { nombre: "Banca", cupos: 99, loot: "Reserva / banca", value: "rol_banca" },
];

function crearRolesDesdeCatalogo() {
  const roles = {};
  for (const rol of ROLES_RAID) {
    roles[rol.nombre] = crearRol(rol.cupos);
  }
  return roles;
}

function obtenerRolPorNombre(nombre) {
  return ROLES_RAID.find((r) => r.nombre === nombre);
}

function obtenerRolPorValue(value) {
  return ROLES_RAID.find((r) => r.value === value);
}

module.exports = {
  ROLES_RAID,
  crearRolesDesdeCatalogo,
  obtenerRolPorNombre,
  obtenerRolPorValue,
};
