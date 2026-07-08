const pool = require("../config/db");

// GET — empresaId opcional para scope por empresa (monitor/cliente)
const obtenerLecturas = async (empresaId) => {
    const params = [];
    let where = "";
    if (empresaId) {
        params.push(empresaId);
        where = ` WHERE v.empresa_idempresa = $${params.length} `;
    }
    const result = await pool.query(`
        SELECT
            ls.idlectura,
            ls.valor,
            ls.fechalectura,
            ls.horalectura,
            ls.sensor_idsensor
        FROM lecturasensor ls
        JOIN sensor s ON ls.sensor_idsensor = s.idsensor
        JOIN vinedo v ON s.vinedo_idvinedo = v.idvinedo
        ${where}
        ORDER BY ls.idlectura
    `, params);
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