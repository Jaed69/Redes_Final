const pool = require("../config/db");

const obtenerVinedos = async () => {

    const result = await pool.query(`
        SELECT
            v.idvinedo,
            v.nombrevinedo,
            v.ubicacion,
            v.area_hectareas,
            e.nombreempresa
        FROM vinedo v
        JOIN empresa e
            ON v.empresa_idempresa = e.idempresa
    `);

    return result.rows;
};

module.exports = {
    obtenerVinedos
};