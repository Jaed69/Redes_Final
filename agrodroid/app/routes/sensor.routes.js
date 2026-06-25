const express = require("express");
const router = express.Router();

const sensorController =
    require("../controllers/sensor.controller");

router.get("/", sensorController.listarSensores);

router.get("/:id",sensorController.obtenerSensor);

router.post("/",sensorController.crearSensor);

router.put("/:id",sensorController.actualizarSensor);

router.delete("/:id",sensorController.eliminarSensor);

module.exports = router;