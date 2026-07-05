const express = require("express");
const router = express.Router();
const { verificarToken, requireRole } = require("../middlewares/auth.middleware");

const dronController = require("../controllers/dron.controller");

router.get("/",verificarToken,dronController.listarDrones);

router.get("/:id",verificarToken,dronController.obtenerDron);

router.post( "/",verificarToken,requireRole("admin"),dronController.crearDron);

router.put("/:id",verificarToken,requireRole("admin"),dronController.actualizarDron);

router.delete("/:id",verificarToken,requireRole("admin"),dronController.eliminarDron);

module.exports = router;