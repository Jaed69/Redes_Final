const express = require("express");
const router = express.Router();

const imagenController =
    require("../controllers/imagen.controller");

router.get("/", imagenController.listarImagenes);
router.get("/:id", imagenController.obtenerImagen);
router.post("/", imagenController.crearImagen);

module.exports = router;