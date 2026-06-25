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

module.exports = {
    obtenerUsuarios
};