const express = require("express");
const router = express.Router();

const sensorController = require("../controllers/sensor.controller");
const verificarToken = require("../middlewares/auth.middleware");

router.get("/", verificarToken, sensorController.listarSensores);

router.get("/:id", verificarToken, sensorController.obtenerSensor);

router.post("/", verificarToken, sensorController.crearSensor);

router.put("/:id", verificarToken, sensorController.actualizarSensor);

router.delete("/:id", verificarToken, sensorController.eliminarSensor);

module.exports = router;