const pool = require("../config/db");

const obtenerDetecciones = async () => {

    const result = await pool.query(`
        SELECT
            de.iddeteccion,
            de.nivelconfianza,
            de.descripcion,
            de.fechadeteccion,
            i.rutaarchivo,
            te.nombreenfermedad
        FROM deteccionenfermedad de
        JOIN imagen i
            ON de.imagen_idimagen = i.idimagen
        JOIN tipoenfermedad te
            ON de.tipoenfermedad_idenfermedad = te.idenfermedad
    `);

    return result.rows;
};

module.exports = {
    obtenerDetecciones
};