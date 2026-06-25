const express = require("express");
const router = express.Router();

const controller = require("../controllers/umbral.controller");

router.get("/", controller.listar);
router.get("/:id", controller.obtener);
router.post("/", controller.crear);
router.put("/:id", controller.actualizar);

module.exports = router;