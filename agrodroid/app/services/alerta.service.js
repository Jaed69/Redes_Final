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
            ta.nombretipo AS tipo,
            a.vinedo_idvinedo,
            e.nombreempresa
        FROM alerta a
        JOIN estadoalerta ea
            ON a.estadoalerta_idestado = ea.idestado
        JOIN tipoalerta ta
            ON a.tipoalerta_idtipo = ta.idtipo
        JOIN vinedo v
            ON a.vinedo_idvinedo = v.idvinedo
        JOIN empresa e
            ON v.empresa_idempresa = e.idempresa
        ORDER BY a.idalerta
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

const actualizarEstadoAlerta = async (id, estadoInput) => {
    let estadoId;

    if (typeof estadoInput === "string") {
        const lookup = await pool.query(
            "SELECT idestado FROM estadoalerta WHERE nombreestado = $1",
            [estadoInput]
        );
        if (lookup.rows.length === 0) {
            throw new Error(`Estado de alerta desconocido: ${estadoInput}`);
        }
        estadoId = lookup.rows[0].idestado;
    } else {
        estadoId = estadoInput;
    }

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