const service = require("../services/umbral.service");

const listar = async (req, res) => {
    res.json(await service.obtenerUmbrales());
};

const obtener = async (req, res) => {
    const data = await service.obtenerUmbralPorId(req.params.id);

    if (!data) return res.status(404).json({ mensaje: "No encontrado" });

    res.json(data);
};

const crear = async (req, res) => {
    const data = await service.crearUmbral(req.body);
    res.status(201).json(data);
};

const actualizar = async (req, res) => {
    const data = await service.actualizarUmbral(req.params.id, req.body);

    if (!data) return res.status(404).json({ mensaje: "No encontrado" });

    res.json(data);
};

const eliminar = async (req, res) => {
    const data = await service.eliminarUmbral(req.params.id);

    if (!data) return res.status(404).json({ mensaje: "No encontrado" });

    res.json(data);
};

module.exports = { listar, obtener, crear, actualizar, eliminar };