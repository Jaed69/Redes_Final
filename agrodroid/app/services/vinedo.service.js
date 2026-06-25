const pool = require("../config/db");

// GET ALL
const obtenerVinedos = async () => {
    const result = await pool.query(`
        SELECT 
            v.idvinedo,
            v.nombrevinedo,
            v.ubicacion,
            v.area_hectareas,
            e.nombreempresa
        FROM vinedo v
        JOIN empresa e ON v.empresa_idempresa = e.idempresa
        ORDER BY v.idvinedo
    `);

    return result.rows;
};

// GET BY ID
const obtenerVinedoPorId = async (id) => {
    const result = await pool.query(`
        SELECT * 
        FROM vinedo 
        WHERE idvinedo = $1
    `, [id]);

    return result.rows[0];
};

// POST
const crearVinedo = async (data) => {
    const {
        nombreVinedo,
        ubicacion,
        area_hectareas,
        Empresa_idEmpresa
    } = data;

    const result = await pool.query(`
        INSERT INTO vinedo (
            nombrevinedo,
            ubicacion,
            area_hectareas,
            empresa_idempresa
        )
        VALUES ($1,$2,$3,$4)
        RETURNING *
    `, [
        nombreVinedo,
        ubicacion,
        area_hectareas,
        Empresa_idEmpresa
    ]);

    return result.rows[0];
};

const actualizarVinedo = async (id, data) => {
    const {
        nombreVinedo,
        ubicacion,
        area_hectareas,
        Empresa_idEmpresa
    } = data;

    const result = await pool.query(`
        UPDATE vinedo
        SET
            nombrevinedo = $1,
            ubicacion = $2,
            area_hectareas = $3,
            empresa_idempresa = $4
        WHERE idvinedo = $5
        RETURNING *
    `, [
        nombreVinedo,
        ubicacion,
        area_hectareas,
        Empresa_idEmpresa,
        id
    ]);

    return result.rows[0];
};

module.exports = {
    obtenerVinedos,
    obtenerVinedoPorId,
    crearVinedo,
    actualizarVinedo
};