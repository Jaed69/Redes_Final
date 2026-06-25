const service = require("../services/deteccion.service");

const listar = async (req, res) => {
    const data = await service.obtenerDetecciones();
    res.json(data);
};

const obtener = async (req, res) => {
    const data = await service.obtenerDeteccionPorId(req.params.id);

    if (!data) {
        return res.status(404).json({ mensaje: "No encontrado" });
    }

    res.json(data);
};

const crear = async (req, res) => {
    const data = await service.crearDeteccion(req.body);
    res.status(201).json(data);
};

module.exports = { listar, obtener, crear };