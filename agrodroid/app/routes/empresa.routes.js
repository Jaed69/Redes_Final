const express = require("express");
const router = express.Router();

const controller = require("../controllers/empresa.controller");
const { verificarToken, requireRole } = require("../middlewares/auth.middleware");

router.get("/", verificarToken, controller.listarEmpresas);
router.get("/:id", verificarToken, controller.obtenerEmpresa);
router.post("/", verificarToken, requireRole("admin"), controller.crearEmpresa);
router.put("/:id", verificarToken, requireRole("admin"), controller.actualizarEmpresa);
router.delete("/:id", verificarToken, requireRole("admin"), controller.eliminarEmpresa);

module.exports = router;