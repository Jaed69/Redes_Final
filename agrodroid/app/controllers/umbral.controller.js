const umbralService = require("../services/umbral.service");

const listarUmbrales = async (req, res) => {

    try {

        const umbrales = await umbralService.obtenerUmbrales();

        res.status(200).json(umbrales);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error obteniendo umbrales"
        });

    }
};

module.exports = {
    listarUmbrales
};