const express = require("express");
const router = express.Router();

const imagenController =
    require("../controllers/imagen.controller");

router.get("/", imagenController.listarImagenes);

module.exports = router;