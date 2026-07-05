// Middleware para verificar el token de autenticación en las solicitudes entrantes
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

const verificarToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            mensaje: "Token no proporcionado"
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const usuario = jwt.verify(token, SECRET_KEY);

        req.usuario = usuario;

        next();

    } catch (error) {

        return res.status(401).json({
            mensaje: "Token inválido"
        });
    }

};

const requireRole = (...rolesPermitidos) => (req, res, next) => {

    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
        return res.status(403).json({
            mensaje: "No autorizado para esta acción"
        });
    }

    next();

};

module.exports = { verificarToken, requireRole };