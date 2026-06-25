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

const obtenerDron = async (req, res) => {
    try {

        const { id } = req.params;

        const dron = await dronService.obtenerDronPorId(id);

        if (!dron) {
            return res.status(404).json({
                mensaje: "Dron no encontrado"
            });
        }

        res.status(200).json(dron);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error obteniendo dron"
        });
    }
};

const crearDron = async (req, res) => {
    try {

        const { nombreDron, Vinedo_idVinedo } = req.body;

        const nuevoDron = await dronService.crearDron(
            nombreDron,
            Vinedo_idVinedo
        );

        res.status(201).json(nuevoDron);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error creando dron"
        });
    }
};

const actualizarDron = async (req, res) => {
    try {

        const { id } = req.params;

        const { nombreDron, Vinedo_idVinedo } = req.body;

        const dronActualizado =
            await dronService.actualizarDron(
                id,
                nombreDron,
                Vinedo_idVinedo
            );

        res.status(200).json(dronActualizado);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error actualizando dron"
        });
    }
};

const eliminarDron = async (req, res) => {
    try {

        const { id } = req.params;

        const dronEliminado =
            await dronService.eliminarDron(id);

        res.status(200).json({
            mensaje: "Dron eliminado",
            dron: dronEliminado
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error eliminando dron"
        });
    }
};

module.exports = {
    listarDrones,
    obtenerDron,
    crearDron,
    actualizarDron,
    eliminarDron
};