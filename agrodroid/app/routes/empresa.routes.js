const express = require("express");
const router = express.Router();

const controller = require("../controllers/empresa.controller");
const verificarToken = require("../middlewares/auth.middleware");

router.get("/", verificarToken, controller.listarEmpresas);
router.get("/:id", verificarToken, controller.obtenerEmpresa);
router.post("/", verificarToken, controller.crearEmpresa);
router.put("/:id", verificarToken, controller.actualizarEmpresa);

module.exports = router;