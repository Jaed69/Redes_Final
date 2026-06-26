const express = require("express");
const router = express.Router();

const controller = require("../controllers/vinedo.controller");
const verificarToken = require("../middlewares/auth.middleware");

router.get("/", verificarToken, controller.listarVinedos);
router.get("/:id", verificarToken, controller.obtenerVinedo);
router.post("/", verificarToken, controller.crearVinedo);
router.put("/:id", verificarToken, controller.actualizarVinedo);

module.exports = router;