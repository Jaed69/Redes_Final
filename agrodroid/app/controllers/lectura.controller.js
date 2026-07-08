const service = require("../services/lectura.service");

const listar = async (req, res) => {
    try {
        const rol = req.usuario.rol;
        const empresaId = (rol === "monitor" || rol === "cliente") ? req.usuario.empresaId : undefined;
        res.json(await service.obtenerLecturas(empresaId));
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error obteniendo lecturas" });
    }
};

const obtener = async (req, res) => {
    const data = await service.obtenerLecturaPorId(req.params.id);

    if (!data) return res.status(404).json({ mensaje: "No encontrado" });

    res.json(data);
};

const crear = async (req, res) => {
    const data = await service.crearLectura(req.body);
    res.status(201).json(data);
};

module.exports = { listar, obtener, crear };