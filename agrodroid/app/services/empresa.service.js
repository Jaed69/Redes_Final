const pool = require("../config/db");

const obtenerEmpresas = async () => {

    const result = await pool.query(`
        SELECT
            idempresa,
            ruc,
            nombreempresa,
            direccion
        FROM empresa
    `);

    return result.rows;
};

module.exports = {
    obtenerEmpresas
};