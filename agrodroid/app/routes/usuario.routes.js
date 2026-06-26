const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuario.controller");
const verificarToken = require("../middlewares/auth.middleware");

router.get("/", verificarToken, usuarioController.listarUsuarios);
router.get("/:id", verificarToken, usuarioController.obtenerUsuario);
router.put("/:id", verificarToken, usuarioController.actualizarUsuario);

module.exports = router;