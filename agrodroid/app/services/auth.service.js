const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const register = async (data) => {

    const {
        nombreUsuario,
        correo,
        contrasenia,
        rol,
        Empresa_idEmpresa
    } = data;
        const existe = await pool.query(
        "SELECT * FROM usuario WHERE correo = $1",
        [correo]
    );

    if (existe.rows.length > 0) {
        throw new Error("El correo ya está registrado");
    }
        const passwordHash = await bcrypt.hash(contrasenia, 10);
         const result = await pool.query(`
        INSERT INTO usuario
        (
            nombreusuario,
            correo,
            contrasenia,
            rol,
            empresa_idempresa
        )
        VALUES($1,$2,$3,$4,$5)
        RETURNING
            idusuario,
            nombreusuario,
            correo,
            rol
    `,
    [
        nombreUsuario,
        correo,
        passwordHash,
        rol,
        Empresa_idEmpresa
    ]);       
    return result.rows[0];
};



//Login
const SECRET_KEY = process.env.JWT_SECRET;
const login = async (data) => {

    const { correo, contrasenia } = data;

    // Buscar usuario
    const result = await pool.query(`
        SELECT
            u.idusuario,
            u.nombreusuario,
            u.correo,
            u.contrasenia,
            u.rol,
            u.empresa_idempresa,
            e.nombreempresa
        FROM usuario u
        JOIN empresa e ON u.empresa_idempresa = e.idempresa
        WHERE u.correo = $1
    `, [correo]);

    if (result.rows.length === 0) {
        throw new Error("Correo o contraseña incorrectos");
    }

    const usuario = result.rows[0];

    // Comparar contraseña
    const coincide = await bcrypt.compare(
        contrasenia,
        usuario.contrasenia
    );

    if (!coincide) {
        throw new Error("Correo o contraseña incorrectos");
    }

    // Generar token
    const token = jwt.sign(
        {
            id: usuario.idusuario,
            correo: usuario.correo,
            rol: usuario.rol
        },
        SECRET_KEY,
        {
            expiresIn: "2h"
        }
    );

    return {
        mensaje: "Login exitoso",
        token,
        usuario: {
            id: usuario.idusuario,
            nombre: usuario.nombreusuario,
            correo: usuario.correo,
            rol: usuario.rol,
            empresaId: usuario.empresa_idempresa,
            empresaNombre: usuario.nombreempresa
        }
    };
};
module.exports = {
    register,
    login
};