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

const obtenerUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await usuarioService.obtenerUsuarioPorId(id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json(usuario);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error obteniendo usuario" });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreUsuario, correo, rol } = req.body;

        const usuarioActualizado = await usuarioService.actualizarUsuario(
            id,
            nombreUsuario,
            correo,
            rol
        );

        res.status(200).json(usuarioActualizado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error actualizando usuario" });
    }
};

module.exports = {
    listarUsuarios,
    obtenerUsuario,
    actualizarUsuario
};