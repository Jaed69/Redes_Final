const express = require("express");
const router = express.Router();

const umbralController =
    require("../controllers/umbral.controller");

router.get("/", umbralController.listarUmbrales);

module.exports = router;