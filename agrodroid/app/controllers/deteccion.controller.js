const service = require("../services/deteccion.service");

const listar = async (req, res) => {
    try {
        const rol = req.usuario.rol;
        const empresaId = (rol === "monitor" || rol === "cliente") ? req.usuario.empresaId : undefined;
        const data = await service.obtenerDetecciones(empresaId);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error obteniendo detecciones" });
    }
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