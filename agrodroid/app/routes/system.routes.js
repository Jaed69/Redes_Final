const express = require("express");
const router = express.Router();

const controller = require("../controllers/system.controller");
const { verificarToken, requireRole } = require("../middlewares/auth.middleware");

router.get("/status", verificarToken, requireRole("admin", "ti"), controller.estadoSistema);

module.exports = router;