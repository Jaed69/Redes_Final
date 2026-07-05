const express = require("express");
const router = express.Router();

const controller = require("../controllers/notificacion.controller");
const { verificarToken, requireRole } = require("../middlewares/auth.middleware");

router.get("/", verificarToken ,controller.listarNotificaciones);
router.get("/:id", verificarToken , controller.obtenerNotificacion);
router.post("/", verificarToken , requireRole("admin"), controller.crearNotificacion);

module.exports = router;