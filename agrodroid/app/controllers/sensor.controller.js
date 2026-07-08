const sensorService = require("../services/sensor.service");

const listarSensores = async (req, res) => {
    try {

        const rol = req.usuario.rol;
        const empresaId = (rol === "monitor" || rol === "cliente") ? req.usuario.empresaId : undefined;

        const sensores =
            await sensorService.obtenerSensores(empresaId);

        res.status(200).json(sensores);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error obteniendo sensores"
        });
    }
};

const obtenerSensor = async (req, res) => {
    try {

        const { id } = req.params;

        const sensor =
            await sensorService.obtenerSensorPorId(id);

        if (!sensor) {
            return res.status(404).json({
                mensaje: "Sensor no encontrado"
            });
        }

        res.status(200).json(sensor);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error obteniendo sensor"
        });
    }
};

const crearSensor = async (req, res) => {
    try {

        const {
            nombreSensor,
            longitud,
            latitud,
            Vinedo_idVinedo
        } = req.body;

        const nuevoSensor =
            await sensorService.crearSensor(
                nombreSensor,
                longitud,
                latitud,
                Vinedo_idVinedo
            );

        res.status(201).json(nuevoSensor);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error creando sensor"
        });
    }
};

const actualizarSensor = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            nombreSensor,
            longitud,
            latitud,
            Vinedo_idVinedo
        } = req.body;

        const sensorActualizado =
            await sensorService.actualizarSensor(
                id,
                nombreSensor,
                longitud,
                latitud,
                Vinedo_idVinedo
            );

        res.status(200).json(sensorActualizado);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error actualizando sensor"
        });
    }
};

const eliminarSensor = async (req, res) => {
    try {

        const { id } = req.params;

        const sensorEliminado =
            await sensorService.eliminarSensor(id);

        res.status(200).json({
            mensaje: "Sensor eliminado",
            sensor: sensorEliminado
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error eliminando sensor"
        });
    }
};

module.exports = {
    listarSensores,
    obtenerSensor,
    crearSensor,
    actualizarSensor,
    eliminarSensor
};