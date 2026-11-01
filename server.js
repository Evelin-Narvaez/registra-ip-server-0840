
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4000;

// ==========================================
// RUTAS DE ALMACENAMIENTO
// ==========================================

const carpetaObras = path.join(__dirname, "data", "obras");
const carpetaUploads = path.join(__dirname, "uploads");

// Crear carpetas si no existen
fs.mkdirSync(carpetaObras, { recursive: true });
fs.mkdirSync(carpetaUploads, { recursive: true });

// ==========================================
// CONFIGURACIÓN GENERAL
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// CONFIGURACIÓN DE MULTER
// ==========================================

const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpetaUploads);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const nombreArchivo = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    cb(null, nombreArchivo);
  }
});

const upload = multer({
  storage: almacenamiento,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});

// ==========================================
// RUTA PRINCIPAL
// ==========================================

app.get("/", (req, res) => {
  res.json({
    mensaje: "Servidor REGISTRA-IP funcionando correctamente",
    puerto: PORT
  });
});

// ==========================================
// OBTENER TODAS LAS OBRAS
// ==========================================

app.get("/obras", (req, res) => {
  try {
    const archivos = fs.readdirSync(carpetaObras);

    const obras = archivos
      .filter((archivo) => archivo.endsWith(".json"))
      .map((archivo) => {
        const contenido = fs.readFileSync(
          path.join(carpetaObras, archivo),
          "utf8"
        );

        return JSON.parse(contenido);
      });

    res.json(obras);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al consultar las obras",
      error: error.message
    });
  }
});

// ==========================================
// REGISTRAR UNA OBRA
// ==========================================

app.post("/obras", upload.single("archivo"), (req, res) => {
  try {
    const {
      folio,
      titulo,
      categoria,
      descripcion,
      autor
    } = req.body;

    // Validar que se haya recibido un archivo
    if (!req.file) {
      return res.status(400).json({
        mensaje: "Debes adjuntar un archivo de la obra"
      });
    }

    // Validar los datos obligatorios
    if (!folio || !titulo || !categoria || !autor) {
      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        mensaje: "Faltan datos obligatorios de la obra"
      });
    }

    // Validar el formato del folio
    if (!/^OBRA-0840-\d{3}$/.test(folio)) {
      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        mensaje: "El formato del folio no es válido"
      });
    }

    // Obtener la ruta del archivo JSON
    const rutaJSON = path.join(
      carpetaObras,
      `${folio}.json`
    );

    // Evitar folios duplicados
    if (fs.existsSync(rutaJSON)) {
      fs.unlinkSync(req.file.path);

      return res.status(409).json({
        mensaje: "El folio ya está registrado"
      });
    }

    // Nombre original del archivo
    const nombreOriginal = Buffer
      .from(req.file.originalname, "latin1")
      .toString("utf8");

    // Construir el objeto de la obra
    const obra = {
      folio,
      titulo,
      categoria,
      descripcion: descripcion || "",
      autor,
      archivo: req.file.filename,
      archivoOriginal: nombreOriginal,
      fechaRegistro: new Date().toISOString()
    };

    // Guardar los metadatos en formato JSON UTF-8
    fs.writeFileSync(
      rutaJSON,
      JSON.stringify(obra, null, 2),
      "utf8"
    );

    // Responder al frontend
    res.status(201).json({
      mensaje: "Obra registrada correctamente",
      obra
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar la obra",
      error: error.message
    });
  }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {
  console.log(
    `Servidor REGISTRA-IP activo en http://localhost:${PORT}`
  );
});
