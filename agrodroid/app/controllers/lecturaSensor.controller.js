const lecturaService = require("../services/lecturaSensor.service");

const listarLecturas = async (req, res) => {

    try {

        const lecturas = await lecturaService.obtenerLecturas();

        res.status(200).json(lecturas);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error obteniendo lecturas de sensores"
        });

    }
};

module.exports = {
    listarLecturas
};