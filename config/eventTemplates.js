const { crearRol } = require("../utils/eventoSchema");

const ROLES_RAID = [
  { nombre: "Caller", value: "rol_caller", cupos: 1, loot: "Loot de caller" },
  { nombre: "Off-tank", value: "rol_off_tank", cupos: 1, loot: "Loot de off-tank" },
  { nombre: "Shadow caller", value: "rol_shadow_caller", cupos: 1, loot: "Loot de shadow caller" },
  { nombre: "Healer", value: "rol_healer", cupos: 1, loot: "Loot de healer" },
  { nombre: "Falce", value: "rol_falce", cupos: 3, loot: "Loot de falce (3 puestos)" },
  { nombre: "Falce-daga", value: "rol_falce_daga", cupos: 3, loot: "Loot de falce-daga (3 puestos)" },
  { nombre: "Scout", value: "rol_scout", cupos: 1, loot: "Loot de scout" },
  { nombre: "Banca", value: "rol_banca", cupos: 20, loot: "Lista de espera" },
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
