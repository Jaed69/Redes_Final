const pool = require("../config/db");

const obtenerUsuarios = async () => {

    const result = await pool.query(`
        SELECT
            u.idusuario,
            u.nombreusuario,
            u.correo,
            u.rol,
            e.nombreempresa
        FROM usuario u
        JOIN empresa e
            ON u.empresa_idempresa = e.idempresa
    `);

    return result.rows;
};

const obtenerUsuarioPorId = async (id) => {
    const result = await pool.query(`
        SELECT 
            idusuario,
            nombreusuario,
            correo,
            rol,
            empresa_idempresa
        FROM usuario
        WHERE idusuario = $1
    `, [id]);

    return result.rows[0];
};

const actualizarUsuario = async (id, nombreUsuario, correo, rol) => {
    const result = await pool.query(`
        UPDATE usuario
        SET nombreusuario = $1,
            correo = $2,
            rol = $3
        WHERE idusuario = $4
        RETURNING *
    `, [nombreUsuario, correo, rol, id]);

    return result.rows[0];
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario
};