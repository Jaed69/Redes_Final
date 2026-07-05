const pool = require("../config/db");
const bcrypt = require("bcrypt");

const obtenerUsuarios = async () => {

    const result = await pool.query(`
        SELECT
            u.idusuario,
            u.nombreusuario,
            u.correo,
            u.rol,
            u.empresa_idempresa,
            e.nombreempresa
        FROM usuario u
        JOIN empresa e
            ON u.empresa_idempresa = e.idempresa
        ORDER BY u.idusuario
    `);

    return result.rows;
};

const obtenerUsuarioPorId = async (id) => {
    const result = await pool.query(`
        SELECT
            u.idusuario,
            u.nombreusuario,
            u.correo,
            u.rol,
            u.empresa_idempresa,
            e.nombreempresa
        FROM usuario u
        JOIN empresa e
            ON u.empresa_idempresa = e.idempresa
        WHERE u.idusuario = $1
    `, [id]);

    return result.rows[0];
};

const crearUsuario = async (data) => {
    const {
        nombreUsuario,
        correo,
        contrasenia,
        rol,
        Empresa_idEmpresa
    } = data;

    if (!nombreUsuario || !correo || !contrasenia || !rol || !Empresa_idEmpresa) {
        throw new Error("Todos los campos son obligatorios.");
    }

    const existe = await pool.query(
        "SELECT 1 FROM usuario WHERE correo = $1",
        [correo]
    );
    if (existe.rows.length > 0) {
        throw new Error("El correo ya está registrado");
    }

    const passwordHash = await bcrypt.hash(contrasenia, 10);

    const result = await pool.query(`
        INSERT INTO usuario (
            nombreusuario,
            correo,
            contrasenia,
            rol,
            empresa_idempresa
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING
            idusuario,
            nombreusuario,
            correo,
            rol,
            empresa_idempresa
    `, [
        nombreUsuario,
        correo,
        passwordHash,
        rol,
        Empresa_idEmpresa
    ]);

    return result.rows[0];
};

const actualizarUsuario = async (id, data) => {
    const {
        nombreUsuario,
        correo,
        rol,
        Empresa_idEmpresa,
        contrasenia
    } = data;

    if (contrasenia) {
        const passwordHash = await bcrypt.hash(contrasenia, 10);
        const result = await pool.query(`
            UPDATE usuario
            SET nombreusuario = $1,
                correo = $2,
                rol = $3,
                empresa_idempresa = $4,
                contrasenia = $5
            WHERE idusuario = $6
            RETURNING idusuario, nombreusuario, correo, rol, empresa_idempresa
        `, [nombreUsuario, correo, rol, Empresa_idEmpresa, passwordHash, id]);
        return result.rows[0];
    }

    const result = await pool.query(`
        UPDATE usuario
        SET nombreusuario = $1,
            correo = $2,
            rol = $3,
            empresa_idempresa = $4
        WHERE idusuario = $5
        RETURNING idusuario, nombreusuario, correo, rol, empresa_idempresa
    `, [nombreUsuario, correo, rol, Empresa_idEmpresa, id]);

    return result.rows[0];
};

const eliminarUsuario = async (id) => {
    const result = await pool.query(`
        DELETE FROM usuario
        WHERE idusuario = $1
        RETURNING idusuario, nombreusuario, correo, rol
    `, [id]);

    return result.rows[0];
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};