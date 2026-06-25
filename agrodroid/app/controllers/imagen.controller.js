const imagenService = require("../services/imagen.service");

const listarImagenes = async (req, res) => {

    try {

        const imagenes = await imagenService.obtenerImagenes();

        res.status(200).json(imagenes);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error obteniendo imágenes"
        });

    }
};

module.exports = {
    listarImagenes
};