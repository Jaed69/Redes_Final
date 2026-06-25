const express = require("express");
const router = express.Router();

const alertaController = require("../controllers/alerta.controller");

router.get("/", alertaController.listarAlertas);

module.exports = router;