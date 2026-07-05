const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuario.controller");
const { verificarToken, requireRole } = require("../middlewares/auth.middleware");

router.get("/", verificarToken, usuarioController.listarUsuarios);
router.get("/:id", verificarToken, usuarioController.obtenerUsuario);
router.put("/:id", verificarToken, requireRole("admin"), usuarioController.actualizarUsuario);

module.exports = router;