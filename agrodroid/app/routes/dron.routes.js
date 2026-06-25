const express = require("express");
const router = express.Router();

const dronController =
    require("../controllers/dron.controller");

router.get("/", dronController.listarDrones);

router.get("/:id",dronController.obtenerDron);

router.post("/",dronController.crearDron
);

router.put("/:id",dronController.actualizarDron);

router.delete("/:id",dronController.eliminarDron);

module.exports = router;