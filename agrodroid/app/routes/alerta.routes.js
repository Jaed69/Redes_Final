const express = require("express");
const router = express.Router();

const controller = require("../controllers/alerta.controller");
const { verificarToken, requireRole } = require("../middlewares/auth.middleware");

router.get("/", verificarToken, controller.listarAlertas);
router.get("/:id", verificarToken, controller.obtenerAlerta);

router.post("/", verificarToken, requireRole("admin"), controller.crearAlerta);

router.put("/:id/estado", verificarToken, requireRole("admin"), controller.actualizarEstado);

module.exports = router;