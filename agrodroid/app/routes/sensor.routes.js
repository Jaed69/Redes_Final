const express = require("express");
const router = express.Router();

const sensorController = require("../controllers/sensor.controller");
const { verificarToken, requireRole } = require("../middlewares/auth.middleware");

router.get("/", verificarToken, sensorController.listarSensores);

router.get("/:id", verificarToken, sensorController.obtenerSensor);

router.post("/", verificarToken, requireRole("admin"), sensorController.crearSensor);

router.put("/:id", verificarToken, requireRole("admin"), sensorController.actualizarSensor);

router.delete("/:id", verificarToken, requireRole("admin"), sensorController.eliminarSensor);

module.exports = router;