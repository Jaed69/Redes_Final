const express = require("express");
const router = express.Router();

const empresaController =
    require("../controllers/empresa.controller");

router.get("/", empresaController.listarEmpresas);

module.exports = router;