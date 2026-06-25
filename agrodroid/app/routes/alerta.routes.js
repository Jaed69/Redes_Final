const express = require("express");
const router = express.Router();

const controller = require("../controllers/alerta.controller");

router.get("/", controller.listarAlertas);
router.get("/:id", controller.obtenerAlerta);

router.post("/", controller.crearAlerta);

router.put("/:id/estado", controller.actualizarEstado);

module.exports = router;