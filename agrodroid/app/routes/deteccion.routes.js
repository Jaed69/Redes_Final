const express = require("express");
const router = express.Router();

const controller = require("../controllers/deteccion.controller");
const verificarToken = require("../middlewares/auth.middleware");

router.get("/", verificarToken, controller.listar);
router.get("/:id", verificarToken, controller.obtener);
router.post("/", verificarToken, controller.crear);

module.exports = router;