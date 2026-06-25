const deteccionService = require("../services/deteccion.service");

const listarDetecciones = async (req, res) => {

    try {

        const detecciones =
            await deteccionService.obtenerDetecciones();

        res.status(200).json(detecciones);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error obteniendo detecciones"
        });

    }
};

module.exports = {
    listarDetecciones
};