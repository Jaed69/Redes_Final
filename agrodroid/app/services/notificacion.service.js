const pool = require("../config/db");

// GET ALL — empresaId opcional para scope por empresa (monitor/cliente)
const obtenerNotificaciones = async (empresaId) => {
    const params = [];
    let where = "";
    if (empresaId) {
        params.push(empresaId);
        where = ` WHERE u.empresa_idempresa = $${params.length} `;
    }
    const result = await pool.query(`
        SELECT
            n.idnotificacion,
            n.mensaje,
            n.fechaenvio,
            n.horaenvio,
            u.nombreusuario,
            a.descripcion AS alerta
        FROM notificacion n
        JOIN usuario u ON n.usuario_idusuario = u.idusuario
        JOIN alerta a ON n.alerta_idalerta = a.idalerta
        ${where}
        ORDER BY n.idnotificacion DESC
    `, params);

    return result.rows;
};

// GET BY ID
const obtenerNotificacionPorId = async (id) => {
    const result = await pool.query(`
        SELECT * 
        FROM notificacion 
        WHERE idnotificacion = $1
    `, [id]);

    return result.rows[0];
};

// POST
const crearNotificacion = async (data) => {
    const {
        mensaje,
        fechaEnvio,
        horaEnvio,
        Usuario_idUsuario,
        Alerta_idAlerta
    } = data;

    const result = await pool.query(`
        INSERT INTO notificacion (
            mensaje,
            fechaenvio,
            horaenvio,
            usuario_idusuario,
            alerta_idalerta
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *
    `, [
        mensaje,
        fechaEnvio,
        horaEnvio,
        Usuario_idUsuario,
        Alerta_idAlerta
    ]);

    return result.rows[0];
};

module.exports = {
    obtenerNotificaciones,
    obtenerNotificacionPorId,
    crearNotificacion
};