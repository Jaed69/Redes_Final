const pool = require("../config/db");

// GET todos
const obtenerDetecciones = async () => {
    const result = await pool.query(`
        SELECT * FROM deteccionenfermedad
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