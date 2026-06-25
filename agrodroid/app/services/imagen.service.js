const pool = require("../config/db");

const obtenerImagenes = async () => {

    const result = await pool.query(`
        SELECT
            i.idimagen,
            i.fechacaptura,
            i.horacaptura,
            i.tamanoarchivo,
            i.rutaarchivo,
            i.ancho,
            i.alto,
            i.latitud,
            i.longitud,
            d.nombredron,
            v.nombrevinedo
        FROM imagen i
        JOIN dron d
            ON i.dron_iddron = d.iddron
        JOIN vinedo v
            ON d.vinedo_idvinedo = v.idvinedo
    `);

    return result.rows;
};

module.exports = {
    obtenerImagenes
};