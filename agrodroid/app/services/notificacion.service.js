const pool = require("../config/db");

const obtenerNotificaciones = async () => {

    const result = await pool.query(`
        SELECT
            n.idnotificacion,
            n.mensaje,
            n.fechaenvio,
            n.horaenvio,
            u.nombreusuario,
            a.descripcion AS alerta
        FROM notificacion n
        JOIN usuario u
            ON n.usuario_idusuario = u.idusuario
        JOIN alerta a
            ON n.alerta_idalerta = a.idalerta
    `);

    return result.rows;
};

module.exports = {
    obtenerNotificaciones
};