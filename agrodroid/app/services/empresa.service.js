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

    // Campos obligatorios
    if (!ruc || !nombreEmpresa || !direccion) {
        throw new Error("Todos los campos son obligatorios.");
    }

    // Validar longitud del RUC
    if (ruc.length !== 11) {
        throw new Error("El RUC debe tener exactamente 11 dígitos.");
    }

    // Validar que solo tenga números
    if (!/^\d+$/.test(ruc)) {
        throw new Error("El RUC solo puede contener números.");
    }

    // Verificar RUC existente
    const existeRuc = await pool.query(
        "SELECT * FROM empresa WHERE ruc = $1",
        [ruc]
    );

    if (existeRuc.rows.length > 0) {
        throw new Error("Ya existe una empresa registrada con ese RUC.");
    }

    // Verificar nombre existente
    const existeNombre = await pool.query(
        "SELECT * FROM empresa WHERE nombreempresa = $1",
        [nombreEmpresa]
    );

    if (existeNombre.rows.length > 0) {
        throw new Error("Ya existe una empresa con ese nombre.");
    }

    // Crear empresa
    const result = await pool.query(
        `
        INSERT INTO empresa (ruc, nombreempresa, direccion)
        VALUES ($1,$2,$3)
        RETURNING *
        `,
        [ruc, nombreEmpresa, direccion]
    );

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