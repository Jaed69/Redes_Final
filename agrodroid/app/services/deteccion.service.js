const pool = require("../config/db");

// GET todos — empresaId opcional para scope por empresa (monitor/cliente)
const obtenerDetecciones = async (empresaId) => {
    const params = [];
    let where = "";
    if (empresaId) {
        params.push(empresaId);
        where = ` WHERE v.empresa_idempresa = $${params.length} `;
    }
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
        LEFT JOIN dron dr
            ON im.dron_iddron = dr.iddron
        LEFT JOIN vinedo v
            ON dr.vinedo_idvinedo = v.idvinedo
        ${where}
    `, params);
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