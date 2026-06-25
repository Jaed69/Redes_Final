const pool = require("../config/db");

const obtenerAlertas = async () => {
    const result = await pool.query(`
        SELECT
            a.idalerta,
            a.descripcion,
            ea.nombreestado AS estado,
            ta.nombretipo AS tipo
        FROM alerta a
        JOIN estadoalerta ea
            ON a.estadoalerta_idestado = ea.idestado
        JOIN tipoalerta ta
            ON a.tipoalerta_idtipo = ta.idtipo
    `);

    return result.rows;
};

module.exports = {
    obtenerAlertas
};