const express = require("express");
const router = express.Router();

const deteccionController =
    require("../controllers/deteccion.controller");

router.get("/", deteccionController.listarDetecciones);

module.exports = router;