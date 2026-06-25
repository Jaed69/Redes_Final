const express = require("express");
const router = express.Router();

const notificacionController =
    require("../controllers/notificacion.controller");

router.get("/", notificacionController.listarNotificaciones);

module.exports = router;