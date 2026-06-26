const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/auth.middleware");

const dronController = require("../controllers/dron.controller");

router.get("/",verificarToken,dronController.listarDrones); 
   
router.get("/:id",verificarToken,dronController.obtenerDron);

router.post( "/",verificarToken,dronController.crearDron);

router.put("/:id",verificarToken,dronController.actualizarDron);

router.delete("/:id",verificarToken,dronController.eliminarDron);

module.exports = router;