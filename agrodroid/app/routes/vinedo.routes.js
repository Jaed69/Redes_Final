const express = require("express");
const router = express.Router();

const controller = require("../controllers/vinedo.controller");

router.get("/", controller.listarVinedos);
router.get("/:id", controller.obtenerVinedo);
router.post("/", controller.crearVinedo);
router.put("/:id", controller.actualizarVinedo);

module.exports = router;