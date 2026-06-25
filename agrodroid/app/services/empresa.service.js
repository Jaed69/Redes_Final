const pool = require("../config/db");

// GET ALL
const obtenerEmpresas = async () => {
    const result = await pool.query(`
        SELECT 
            idempresa,
            ruc,
            nombreempresa,
            direccion
        FROM empresa
        ORDER BY idempresa
    `);

    return result.rows;
};

// GET BY ID
const obtenerEmpresaPorId = async (id) => {
    const result = await pool.query(`
        SELECT * 
        FROM empresa 
        WHERE idempresa = $1
    `, [id]);

    return result.rows[0];
};

// POST
const crearEmpresa = async (data) => {
    const { ruc, nombreEmpresa, direccion } = data;

    const result = await pool.query(`
        INSERT INTO empresa (ruc, nombreempresa, direccion)
        VALUES ($1,$2,$3)
        RETURNING *
    `, [ruc, nombreEmpresa, direccion]);

    return result.rows[0];
};

// PUT
const actualizarEmpresa = async (id, data) => {
    const { ruc, nombreEmpresa, direccion } = data;

    const result = await pool.query(`
        UPDATE empresa
        SET 
            ruc = $1,
            nombreempresa = $2,
            direccion = $3
        WHERE idempresa = $4
        RETURNING *
    `, [
        ruc,
        nombreEmpresa,
        direccion,
        id
    ]);

    return result.rows[0];
};

module.exports = {
    obtenerEmpresas,
    obtenerEmpresaPorId,
    crearEmpresa,
    actualizarEmpresa
};