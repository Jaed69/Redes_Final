const pool = require("../config/db");

// GET ALL + filtros — empresaId opcional para scope por empresa (monitor/cliente)
const obtenerImagenes = async ({ dron, vinedo, fecha, empresaId } = {}) => {
    const params = [];
    let query = `
        SELECT
            im.idimagen, im.fechacaptura, im.horacaptura,
            im.tamanoarchivo, im.rutaarchivo, im.ancho, im.alto,
            im.latitud, im.longitud, im.dron_iddron
        FROM imagen im
        JOIN dron dr ON im.dron_iddron = dr.iddron
        JOIN vinedo v ON dr.vinedo_idvinedo = v.idvinedo
        WHERE 1=1
    `;

    if (empresaId) {
        params.push(empresaId);
        query += ` AND v.empresa_idempresa = $${params.length}`;
    }

    if (dron) {
        params.push(dron);
        query += ` AND im.dron_iddron = $${params.length}`;
    }

    if (vinedo) {
        params.push(vinedo);
        query += ` AND dr.vinedo_idvinedo = $${params.length}`;
    }

    if (fecha) {
        params.push(fecha);
        query += ` AND im.fechacaptura = $${params.length}`;
    }

    query += ` ORDER BY im.idimagen`;

    const result = await pool.query(query, params);
    return result.rows;
};

// GET BY ID
const obtenerImagenPorId = async (id) => {
    const result = await pool.query(
        `SELECT * FROM imagen WHERE idimagen = $1`,
        [id]
    );
    return result.rows[0];
};

// POST
const crearImagen = async (data) => {
    const {
        fechaCaptura,
        horaCaptura,
        tamanoArchivo,
        rutaArchivo,
        ancho,
        alto,
        latitud,
        longitud,
        Dron_idDron
    } = data;

    const result = await pool.query(
        `INSERT INTO imagen (
            fechaCaptura, horaCaptura, tamanoArchivo,
            rutaArchivo, ancho, alto, latitud, longitud, Dron_idDron
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *`,
        [
            fechaCaptura,
            horaCaptura,
            tamanoArchivo,
            rutaArchivo,
            ancho,
            alto,
            latitud,
            longitud,
            Dron_idDron
        ]
    );

    return result.rows[0];
};

module.exports = {
    obtenerImagenes,
    obtenerImagenPorId,
    crearImagen
};