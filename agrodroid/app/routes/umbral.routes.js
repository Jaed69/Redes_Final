const express = require("express");
const router = express.Router();

const controller = require("../controllers/umbral.controller");
const { verificarToken, requireRole } = require("../middlewares/auth.middleware");

router.get("/", verificarToken, controller.listar);
router.get("/:id", verificarToken, controller.obtener);
router.post("/", verificarToken, requireRole("admin"), controller.crear);
router.put("/:id", verificarToken, requireRole("admin"), controller.actualizar);

module.exports = router;