const pool = require("../config/db");

const obtenerUmbrales = async () => {

    const result = await pool.query(`
        SELECT
            u.idumbral,
            u.valorminimo,
            u.valormaximo,
            u.descripcion,
            s.nombresensor
        FROM umbral u
        JOIN sensor s
            ON u.sensor_idsensor = s.idsensor
    `);

    return result.rows;
};

module.exports = {
    obtenerUmbrales
};