const notificacionService = require("../services/notificacion.service");

const listarNotificaciones = async (req, res) => {
    try {

        const notificaciones =
            await notificacionService.obtenerNotificaciones();

        res.status(200).json(notificaciones);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error obteniendo notificaciones"
        });
    }
};

module.exports = {
    listarNotificaciones
};