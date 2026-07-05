const pool = require("../config/db");

// GET
const obtenerUmbrales = async () => {
    const result = await pool.query(`SELECT * FROM umbral`);
    return result.rows;
};

// GET ID
const obtenerUmbralPorId = async (id) => {
    const result = await pool.query(`
        SELECT * FROM umbral WHERE idumbral = $1
    `, [id]);

    return result.rows[0];
};

// POST
const crearUmbral = async (data) => {
    const {
        valorMinimo,
        valorMaximo,
        descripcion,
        Sensor_idSensor
    } = data;

    const result = await pool.query(`
        INSERT INTO umbral (
            valorminimo,
            valormaximo,
            descripcion,
            sensor_idsensor
        )
        VALUES ($1,$2,$3,$4)
        RETURNING *
    `, [
        valorMinimo,
        valorMaximo,
        descripcion,
        Sensor_idSensor
    ]);

    return result.rows[0];
};

// PUT (ACTUALIZAR)
const actualizarUmbral = async (id, data) => {
    const {
        valorMinimo,
        valorMaximo,
        descripcion
    } = data;

    const result = await pool.query(`
        UPDATE umbral
        SET
            valorminimo = $1,
            valormaximo = $2,
            descripcion = $3
        WHERE idumbral = $4
        RETURNING *
    `, [
        valorMinimo,
        valorMaximo,
        descripcion,
        id
    ]);

    return result.rows[0];
};

const eliminarUmbral = async (id) => {
    const result = await pool.query(`
        DELETE FROM umbral
        WHERE idumbral = $1
        RETURNING *
    `, [id]);

    return result.rows[0];
};

module.exports = {
    obtenerUmbrales,
    obtenerUmbralPorId,
    crearUmbral,
    actualizarUmbral,
    eliminarUmbral
};