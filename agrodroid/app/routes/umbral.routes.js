const express = require("express");
const router = express.Router();

const controller = require("../controllers/umbral.controller");
const verificarToken = require("../middlewares/auth.middleware");

router.get("/", verificarToken, controller.listar);
router.get("/:id", verificarToken, controller.obtener);
router.post("/", verificarToken, controller.crear);
router.put("/:id", verificarToken, controller.actualizar);

module.exports = router;