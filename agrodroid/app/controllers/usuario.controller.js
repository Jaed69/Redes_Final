const usuarioService = require("../services/usuario.service");

const listarUsuarios = async (req, res) => {

    try {

        const usuarios = await usuarioService.obtenerUsuarios();

        res.status(200).json(usuarios);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error obteniendo usuarios"
        });

    }
};

module.exports = {
    listarUsuarios
};