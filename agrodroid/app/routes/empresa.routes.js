const express = require("express");
const router = express.Router();

const controller = require("../controllers/empresa.controller");

router.get("/", controller.listarEmpresas);
router.get("/:id", controller.obtenerEmpresa);
router.post("/", controller.crearEmpresa);
router.put("/:id", controller.actualizarEmpresa);

module.exports = router;