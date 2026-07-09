const pool = require("../config/db");

const obtenerDrones = async (empresaId) => {
    const params = [];
    let where = "";
    if (empresaId) {
        params.push(empresaId);
        where = ` WHERE v.empresa_idempresa = $${params.length} `;
    }
    const result = await pool.query(`
        SELECT
            d.iddron,
            d.nombredron,
            d.vinedo_idvinedo,
            v.nombrevinedo
        FROM dron d
        JOIN vinedo v
            ON d.vinedo_idvinedo = v.idvinedo
        ${where}
        ORDER BY d.iddron
    `, params);

    return result.rows;
};

const obtenerDronPorId = async (id) => {
    const result = await pool.query(`
        SELECT
            d.iddron,
            d.nombredron,
            v.nombrevinedo
        FROM dron d
        JOIN vinedo v
            ON d.vinedo_idvinedo = v.idvinedo
        WHERE d.iddron = $1
    `, [id]);

    return result.rows[0];
};

const crearDron = async (nombreDron, vinedoId) => {
    const result = await pool.query(`
        INSERT INTO dron
        (nombredron, vinedo_idvinedo)
        VALUES ($1, $2)
        RETURNING *
    `, [nombreDron, vinedoId]);

    return result.rows[0];
};

const actualizarDron = async (id, nombreDron, vinedoId) => {
    const result = await pool.query(`
        UPDATE dron
        SET nombredron = $1,
            vinedo_idvinedo = $2
        WHERE iddron = $3
        RETURNING *
    `, [nombreDron, vinedoId, id]);

    return result.rows[0];
};

const eliminarDron = async (id) => {
    const result = await pool.query(`
        DELETE FROM dron
        WHERE iddron = $1
        RETURNING *
    `, [id]);

    return result.rows[0];
};

module.exports = {
    obtenerDrones,
    obtenerDronPorId,
    crearDron,
    actualizarDron,
    eliminarDron
};