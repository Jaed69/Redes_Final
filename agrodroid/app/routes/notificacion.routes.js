const express = require("express");
const router = express.Router();

const controller = require("../controllers/notificacion.controller");

router.get("/", controller.listarNotificaciones);
router.get("/:id", controller.obtenerNotificacion);
router.post("/", controller.crearNotificacion);

module.exports = router;