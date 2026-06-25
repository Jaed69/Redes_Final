const pool = require("../config/db");

const obtenerLecturas = async () => {

    const result = await pool.query(`
        SELECT
            ls.idlectura,
            ls.valor,
            ls.fechalectura,
            ls.horalectura,
            s.nombresensor,
            v.nombrevinedo
        FROM lecturasensor ls
        JOIN sensor s
            ON ls.sensor_idsensor = s.idsensor
        JOIN vinedo v
            ON s.vinedo_idvinedo = v.idvinedo
    `);

    return result.rows;
};

module.exports = {
    obtenerLecturas
};