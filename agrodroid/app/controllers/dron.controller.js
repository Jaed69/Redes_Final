const dronService = require("../services/dron.service");

const listarDrones = async (req, res) => {

    try {

        const drones = await dronService.obtenerDrones();

        res.status(200).json(drones);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error obteniendo drones"
        });

    }
};

module.exports = {
    listarDrones
};