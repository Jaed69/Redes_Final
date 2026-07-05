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

const crearUsuario = async (req, res) => {
    try {
        const usuario = await usuarioService.crearUsuario(req.body);
        res.status(201).json(usuario);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuarioActualizado = await usuarioService.actualizarUsuario(
            id,
            req.body
        );

        if (!usuarioActualizado) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.status(200).json(usuarioActualizado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error actualizando usuario" });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await usuarioService.eliminarUsuario(id);

        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error eliminando usuario" });
    }
};

module.exports = {
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};