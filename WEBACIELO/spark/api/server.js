
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = 3005;
const HOST = "0.0.0.0";

const resultados = path.join(__dirname, "..", "resultados");

const rutas = {
  "/api/analisis": "resumen_citas.json",
  "/api/analisis/avanzado": "analisis_avanzado.json",
  "/api/analisis/graficas/asistencia": "01_asistencia.png",
  "/api/analisis/graficas/edad": "02_edad.png",
  "/api/analisis/graficas/sms": "03_sms.png",
  "/api/analisis/graficas/dias": "04_dias.png"
};

const servidor = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Metodo no permitido" }));
  }

  const ruta = new URL(req.url, "http://localhost").pathname;
  const archivo = rutas[ruta];

  if (!archivo) {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Ruta no encontrada" }));
  }

  const ubicacion = path.join(resultados, archivo);
  const tipo = archivo.endsWith(".json")
    ? "application/json; charset=utf-8"
    : "image/png";

  fs.readFile(ubicacion, (error, contenido) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        error: "No se pudo leer el archivo de resultados"
      }));
    }

    res.writeHead(200, { "Content-Type": tipo });
    res.end(contenido);
  });
});

servidor.listen(PORT, HOST, () => {
  console.log(`API Spark disponible en http://localhost:${PORT}`);
});
