const express = require("express");
const router = express.Router();

const dronController =
    require("../controllers/dron.controller");

router.get("/", dronController.listarDrones);

module.exports = router;