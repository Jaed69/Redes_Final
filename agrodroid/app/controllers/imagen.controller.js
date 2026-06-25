const imagenService = require("../services/imagen.service");

const listarImagenes = async (req, res) => {
    try {
        const imagenes = await imagenService.obtenerImagenes(req.query);
        res.json(imagenes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error" });
    }
};

const obtenerImagen = async (req, res) => {
    try {
        const imagen = await imagenService.obtenerImagenPorId(req.params.id);

        if (!imagen) {
            return res.status(404).json({ mensaje: "No encontrada" });
        }

        res.json(imagen);
    } catch (error) {
        res.status(500).json({ mensaje: "Error" });
    }
};

const crearImagen = async (req, res) => {
    try {
        const imagen = await imagenService.crearImagen(req.body);
        res.status(201).json(imagen);
    } catch (error) {
        res.status(500).json({ mensaje: "Error" });
    }
};

module.exports = {
    listarImagenes,
    obtenerImagen,
    crearImagen
};