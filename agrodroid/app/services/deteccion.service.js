const pool = require("../config/db");

// GET todos
const obtenerDetecciones = async () => {
    const result = await pool.query(`
        SELECT
            d.iddeteccion,
            d.nivelconfianza,
            d.descripcion,
            d.fechadeteccion,
            d.imagen_idimagen,
            d.tipoenfermedad_idenfermedad,
            te.nombreenfermedad,
            im.rutaarchivo
        FROM deteccionenfermedad d
        LEFT JOIN tipoenfermedad te
            ON d.tipoenfermedad_idenfermedad = te.idenfermedad
        LEFT JOIN imagen im
            ON d.imagen_idimagen = im.idimagen
    `);
    return result.rows;
};

// GET por ID
const obtenerDeteccionPorId = async (id) => {
    const result = await pool.query(`
        SELECT * FROM deteccionenfermedad
        WHERE iddeteccion = $1
    `, [id]);

    return result.rows[0];
};

// POST
const crearDeteccion = async (data) => {
    const {
        nivelConfianza,
        descripcion,
        fechaDeteccion,
        Imagen_idImagen,
        TipoEnfermedad_idEnfermedad
    } = data;

    const result = await pool.query(`
        INSERT INTO deteccionenfermedad (
            nivelconfianza,
            descripcion,
            fechadeteccion,
            imagen_idimagen,
            tipoenfermedad_idenfermedad
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *
    `, [
        nivelConfianza,
        descripcion,
        fechaDeteccion,
        Imagen_idImagen,
        TipoEnfermedad_idEnfermedad
    ]);

    return result.rows[0];
};

module.exports = {
    obtenerDetecciones,
    obtenerDeteccionPorId,
    crearDeteccion
};