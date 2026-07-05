const express = require("express");
const router = express.Router();

const controller = require("../controllers/vinedo.controller");
const { verificarToken, requireRole } = require("../middlewares/auth.middleware");

router.get("/", verificarToken, controller.listarVinedos);
router.get("/:id", verificarToken, controller.obtenerVinedo);
router.post("/", verificarToken, requireRole("admin"), controller.crearVinedo);
router.put("/:id", verificarToken, requireRole("admin"), controller.actualizarVinedo);
router.delete("/:id", verificarToken, requireRole("admin"), controller.eliminarVinedo);

module.exports = router;