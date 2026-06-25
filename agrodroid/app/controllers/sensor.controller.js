const sensorService = require("../services/sensor.service");

const listarSensores = async (req, res) => {

    try {

        const sensores = await sensorService.obtenerSensores();

        res.status(200).json(sensores);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error obteniendo sensores"
        });

    }
};

module.exports = {
    listarSensores
};