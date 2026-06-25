const pool = require("../config/db");

// GET
const obtenerLecturas = async () => {
    const result = await pool.query(`
        SELECT * FROM lecturasensor
    `);
    return result.rows;
};

// GET por ID
const obtenerLecturaPorId = async (id) => {
    const result = await pool.query(`
        SELECT * FROM lecturasensor
        WHERE idlectura = $1
    `, [id]);

    return result.rows[0];
};

// POST
const crearLectura = async (data) => {
    const {
        valor,
        fechaLectura,
        horaLectura,
        Sensor_idSensor
    } = data;

    const result = await pool.query(`
        INSERT INTO lecturasensor (
            valor,
            fechalectura,
            horalectura,
            sensor_idsensor
        )
        VALUES ($1,$2,$3,$4)
        RETURNING *
    `, [
        valor,
        fechaLectura,
        horaLectura,
        Sensor_idSensor
    ]);

    return result.rows[0];
};

module.exports = {
    obtenerLecturas,
    obtenerLecturaPorId,
    crearLectura
};