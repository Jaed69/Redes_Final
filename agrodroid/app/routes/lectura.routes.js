const express = require("express");
const router = express.Router();

const controller = require("../controllers/lectura.controller");
const { verificarToken, requireRole } = require("../middlewares/auth.middleware");

router.get("/", verificarToken, controller.listar);
router.get("/:id", verificarToken, controller.obtener);
router.post("/", verificarToken, requireRole("admin"), controller.crear);

module.exports = router;