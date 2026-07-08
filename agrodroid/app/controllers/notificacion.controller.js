const notificacionService = require("../services/notificacion.service");

// GET /
const listarNotificaciones = async (req, res) => {
    try {
        const rol = req.usuario.rol;
        const empresaId = (rol === "monitor" || rol === "cliente") ? req.usuario.empresaId : undefined;
        const data = await notificacionService.obtenerNotificaciones(empresaId);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error obteniendo notificaciones" });
    }
};

// GET /:id
const obtenerNotificacion = async (req, res) => {
    try {
        const data = await notificacionService.obtenerNotificacionPorId(req.params.id);

        if (!data) {
            return res.status(404).json({ mensaje: "No encontrada" });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ mensaje: "Error obteniendo notificación" });
    }
};

// POST
const crearNotificacion = async (req, res) => {
    try {
        const data = await notificacionService.crearNotificacion(req.body);
        res.status(201).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error creando notificación" });
    }
};

module.exports = {
    listarNotificaciones,
    obtenerNotificacion,
    crearNotificacion
};