const vinedoService = require("../services/vinedo.service");

const listarVinedos = async (req, res) => {

    try {

        const vinedos = await vinedoService.obtenerVinedos();

        res.status(200).json(vinedos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error obteniendo viñedos"
        });

    }
};

module.exports = {
    listarVinedos
};