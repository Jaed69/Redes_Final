const vinedoService = require("../services/vinedo.service");

const listarVinedos = async (req, res) => {
    try {
        const data = await vinedoService.obtenerVinedos();
        res.json(data);
    } catch (error) {
        res.status(500).json({ mensaje: "Error obteniendo viñedos" });
    }
};

const obtenerVinedo = async (req, res) => {
    try {
        const data = await vinedoService.obtenerVinedoPorId(req.params.id);

        if (!data) {
            return res.status(404).json({ mensaje: "No encontrado" });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ mensaje: "Error obteniendo viñedo" });
    }
};

const crearVinedo = async (req, res) => {
    try {
        const data = await vinedoService.crearVinedo(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ mensaje: "Error creando viñedo" });
    }
};

const actualizarVinedo = async (req, res) => {
    try {
        const data = await vinedoService.actualizarVinedo(
            req.params.id,
            req.body
        );

        if (!data) {
            return res.status(404).json({ mensaje: "No encontrado" });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ mensaje: "Error actualizando viñedo" });
    }
};

const eliminarVinedo = async (req, res) => {
    try {
        const data = await vinedoService.eliminarVinedo(req.params.id);

        if (!data) {
            return res.status(404).json({ mensaje: "No encontrado" });
        }

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error eliminando viñedo" });
    }
};

module.exports = {
    listarVinedos,
    obtenerVinedo,
    crearVinedo,
    actualizarVinedo,
    eliminarVinedo
};