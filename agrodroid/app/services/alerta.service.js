const pool = require("../config/db");

const crearAlerta = async (data) => {
    const {
        fecha,
        hora,
        descripcion,
        Vinedo_idVinedo,
        DeteccionEnfermedad_idDeteccion,
        LecturaSensor_idLectura,
        EstadoAlerta_idEstado,
        TipoAlerta_idTipo
    } = data;

    const result = await pool.query(`
        INSERT INTO alerta (
            fecha,
            hora,
            descripcion,
            vinedo_idvinedo,
            deteccionenfermedad_iddeteccion,
            lecturasensor_idlectura,
            estadoalerta_idestado,
            tipoalerta_idtipo
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *
    `, [
        fecha,
        hora,
        descripcion,
        Vinedo_idVinedo,
        DeteccionEnfermedad_idDeteccion,
        LecturaSensor_idLectura,
        EstadoAlerta_idEstado,
        TipoAlerta_idTipo
    ]);

    return result.rows[0];
};

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

const obtenerAlertaPorId = async (id) => {
    const result = await pool.query(`
        SELECT 
            a.idalerta,
            a.fecha,
            a.hora,
            a.descripcion,
            ea.nombreestado,
            ta.nombretipo
        FROM alerta a
        JOIN estadoalerta ea 
            ON a.estadoalerta_idestado = ea.idestado
        JOIN tipoalerta ta 
            ON a.tipoalerta_idtipo = ta.idtipo
        WHERE a.idalerta = $1
    `, [id]);

    return result.rows[0];
};

const actualizarEstadoAlerta = async (id, estadoId) => {
    const result = await pool.query(`
        UPDATE alerta
        SET estadoalerta_idestado = $1
        WHERE idalerta = $2
        RETURNING *
    `, [estadoId, id]);

    return result.rows[0];
};

module.exports = {
    crearAlerta,
    obtenerAlertas,
    obtenerAlertaPorId,
    actualizarEstadoAlerta
};