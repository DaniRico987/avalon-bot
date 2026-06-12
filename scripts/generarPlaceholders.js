const fs = require("fs");
const path = require("path");
const https = require("https");

const CARPETA = path.join(__dirname, "..", "assets", "roles");

const PLACEHOLDERS = [
  { archivo: "caller.png", texto: "CL", color: "5865F2" },
  { archivo: "off-tank.png", texto: "OT", color: "57F287" },
  { archivo: "shadow-caller.png", texto: "SC", color: "4E5058" },
  { archivo: "healer.png", texto: "HL", color: "FEE75C" },
  { archivo: "falce.png", texto: "FL", color: "ED4245" },
  { archivo: "falce-daga.png", texto: "FD", color: "EB459E" },
  { archivo: "scout.png", texto: "ST", color: "F47B67" },
  { archivo: "banca.png", texto: "BN", color: "99AAB5" },
];

function descargar(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          descargar(res.headers.location).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function generar() {
  if (!fs.existsSync(CARPETA)) {
    fs.mkdirSync(CARPETA, { recursive: true });
  }

  for (const item of PLACEHOLDERS) {
    const url = `https://placehold.co/128x128/${item.color}/FFFFFF/png?text=${encodeURIComponent(item.texto)}`;
    const buffer = await descargar(url);
    fs.writeFileSync(path.join(CARPETA, item.archivo), buffer);
    console.log(`Creado: ${item.archivo}`);
  }
}

generar().catch((error) => {
  console.error(error);
  process.exit(1);
});
