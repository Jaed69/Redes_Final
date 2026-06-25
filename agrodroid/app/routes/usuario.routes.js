const express = require("express");
const router = express.Router();

const usuarioController =
    require("../controllers/usuario.controller");

router.get("/", usuarioController.listarUsuarios);

module.exports = router;