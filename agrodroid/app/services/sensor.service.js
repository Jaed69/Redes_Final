const pool = require("../config/db");

const obtenerSensores = async () => {

    const result = await pool.query(`
        SELECT
            s.idsensor,
            s.nombresensor,
            s.latitud,
            s.longitud,
            v.nombrevinedo
        FROM sensor s
        JOIN vinedo v
            ON s.vinedo_idvinedo = v.idvinedo
    `);

    return result.rows;
};

module.exports = {
    obtenerSensores
};