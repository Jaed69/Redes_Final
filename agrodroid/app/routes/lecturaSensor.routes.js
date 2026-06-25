const express = require("express");
const router = express.Router();

const lecturaController =
    require("../controllers/lecturaSensor.controller");

router.get("/", lecturaController.listarLecturas);

module.exports = router;