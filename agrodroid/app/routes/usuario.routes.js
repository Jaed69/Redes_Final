const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuario.controller");
const { verificarToken, requireRole } = require("../middlewares/auth.middleware");

router.get("/", verificarToken, usuarioController.listarUsuarios);
router.get("/:id", verificarToken, usuarioController.obtenerUsuario);
router.post("/", verificarToken, requireRole("admin", "ti"), usuarioController.crearUsuario);
router.put("/:id", verificarToken, requireRole("admin", "ti"), usuarioController.actualizarUsuario);
router.delete("/:id", verificarToken, requireRole("admin", "ti"), usuarioController.eliminarUsuario);

module.exports = router;