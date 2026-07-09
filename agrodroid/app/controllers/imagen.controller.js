const imagenService = require("../services/imagen.service");

const listarImagenes = async (req, res) => {
    try {
        const rol = req.usuario.rol;
        const empresaId = (rol === "monitor" || rol === "cliente") ? req.usuario.empresaId : undefined;
        const imagenes = await imagenService.obtenerImagenes({ ...req.query, empresaId });
        res.json(imagenes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error obteniendo imágenes" });
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