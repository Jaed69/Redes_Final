const express = require("express");
const router = express.Router();

const vinedoController =
    require("../controllers/vinedo.controller");

router.get("/", vinedoController.listarVinedos);

module.exports = router;