const pool = require("../config/db");

const obtenerDrones = async () => {

    const result = await pool.query(`
        SELECT
            d.iddron,
            d.nombredron,
            v.nombrevinedo,
            e.nombreempresa
        FROM dron d
        JOIN vinedo v
            ON d.vinedo_idvinedo = v.idvinedo
        JOIN empresa e
            ON v.empresa_idempresa = e.idempresa
    `);

    return result.rows;
};

module.exports = {
    obtenerDrones
};