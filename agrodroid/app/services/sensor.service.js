const pool = require("../config/db");

const obtenerSensores = async (empresaId) => {
    const params = [];
    let where = "";
    if (empresaId) {
        params.push(empresaId);
        where = ` WHERE v.empresa_idempresa = $${params.length} `;
    }
    const result = await pool.query(`
        SELECT
            s.idsensor,
            s.nombresensor,
            s.latitud,
            s.longitud,
            s.vinedo_idvinedo,
            v.nombrevinedo
        FROM sensor s
        JOIN vinedo v
            ON s.vinedo_idvinedo = v.idvinedo
        ${where}
        ORDER BY s.idsensor
    `, params);

    return result.rows;
};

const obtenerSensorPorId = async (id) => {
    const result = await pool.query(`
        SELECT
            s.idsensor,
            s.nombresensor,
            s.latitud,
            s.longitud,
            v.nombrevinedo
        FROM sensor s
        JOIN vinedo v
            ON s.vinedo_idvinedo = v.idvinedo
        WHERE s.idsensor = $1
    `, [id]);

    return result.rows[0];
};

const crearSensor = async (
    nombreSensor,
    longitud,
    latitud,
    vinedoId
) => {
    const result = await pool.query(`
        INSERT INTO sensor
        (
            nombresensor,
            longitud,
            latitud,
            vinedo_idvinedo
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [
        nombreSensor,
        longitud,
        latitud,
        vinedoId
    ]);

    return result.rows[0];
};

const actualizarSensor = async (
    id,
    nombreSensor,
    longitud,
    latitud,
    vinedoId
) => {
    const result = await pool.query(`
        UPDATE sensor
        SET nombresensor = $1,
            longitud = $2,
            latitud = $3,
            vinedo_idvinedo = $4
        WHERE idsensor = $5
        RETURNING *
    `, [
        nombreSensor,
        longitud,
        latitud,
        vinedoId,
        id
    ]);

    return result.rows[0];
};

const eliminarSensor = async (id) => {
    const result = await pool.query(`
        DELETE FROM sensor
        WHERE idsensor = $1
        RETURNING *
    `, [id]);

    return result.rows[0];
};

module.exports = {
    obtenerSensores,
    obtenerSensorPorId,
    crearSensor,
    actualizarSensor,
    eliminarSensor
};