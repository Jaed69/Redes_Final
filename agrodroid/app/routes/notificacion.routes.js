const express = require("express");
const router = express.Router();

const controller = require("../controllers/notificacion.controller");
const verificarToken = require("../middlewares/auth.middleware");

router.get("/", verificarToken ,controller.listarNotificaciones);
router.get("/:id", verificarToken , controller.obtenerNotificacion);
router.post("/", verificarToken , controller.crearNotificacion);

module.exports = router;