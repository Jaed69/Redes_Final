const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const register = async (data) => {

    const {
        nombreUsuario,
        correo,
        contrasenia,
        rol,
        Empresa_idEmpresa,
        empresa
    } = data;

    if (!nombreUsuario || !correo || !contrasenia) {
        throw new Error("nombreUsuario, correo y contrasenia son obligatorios.");
    }

    let idEmpresaFinal = Empresa_idEmpresa;

    // Flujo de auto-registro: si viene `empresa` anidado, se crea la empresa
    // atómicamente y su admin asociado en una sola llamada pública a
    // /auth/register (evita exponer POST /empresas sin auth).
    if (empresa && (!idEmpresaFinal || idEmpresaFinal === "")) {
        const { ruc, nombreEmpresa, direccion } = empresa;
        if (!ruc || !nombreEmpresa || !direccion) {
            throw new Error("empresa exige ruc, nombreEmpresa y direccion.");
        }
        if (ruc.length !== 11 || !/^\d+$/.test(ruc)) {
            throw new Error("El RUC debe tener 11 dígitos numéricos.");
        }
        const existeRuc = await pool.query("SELECT 1 FROM empresa WHERE ruc = $1", [ruc]);
        if (existeRuc.rows.length > 0) {
            throw new Error("Ya existe una empresa registrada con ese RUC.");
        }
        const existeNombre = await pool.query(
            "SELECT 1 FROM empresa WHERE nombreempresa = $1",
            [nombreEmpresa]
        );
        if (existeNombre.rows.length > 0) {
            throw new Error("Ya existe una empresa con ese nombre.");
        }
        const insertada = await pool.query(
            `INSERT INTO empresa (ruc, nombreempresa, direccion)
             VALUES ($1, $2, $3) RETURNING idempresa`,
            [ruc, nombreEmpresa, direccion]
        );
        idEmpresaFinal = insertada.rows[0].idempresa;
    }

    if (!idEmpresaFinal) {
        throw new Error("Falta Empresa_idEmpresa o datos de empresa para crearla.");
    }

    const rolFinal = rol || "admin";

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
        rolFinal,
        idEmpresaFinal
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

    // Generar token — incluye empresaId para scope por empresa en servicios
    const token = jwt.sign(
        {
            id: usuario.idusuario,
            correo: usuario.correo,
            rol: usuario.rol,
            empresaId: usuario.empresa_idempresa
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