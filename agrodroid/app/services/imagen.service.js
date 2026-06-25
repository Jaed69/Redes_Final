const pool = require("../config/db");

// GET ALL + filtros
const obtenerImagenes = async ({ dron, vinedo, fecha }) => {
    let query = `
        SELECT * FROM imagen
        WHERE 1=1
    `;

    const params = [];

    if (dron) {
        params.push(dron);
        query += ` AND dron_iddron = $${params.length}`;
    }

    if (vinedo) {
        params.push(vinedo);
        query += ` AND vinedo_idvinedo = $${params.length}`;
    }

    if (fecha) {
        params.push(fecha);
        query += ` AND fechacaptura = $${params.length}`;
    }

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