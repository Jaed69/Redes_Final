const express = require("express");
const router = express.Router();

const imagenController = require("../controllers/imagen.controller");
const { verificarToken, requireRole } = require("../middlewares/auth.middleware");

router.get("/", verificarToken, imagenController.listarImagenes);
router.get("/:id", verificarToken, imagenController.obtenerImagen);
router.post("/", verificarToken, requireRole("admin"), imagenController.crearImagen);

module.exports = router;