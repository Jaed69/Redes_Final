// Middleware para verificar el token de autenticación en las solicitudes entrantes
const jwt = require("jsonwebtoken");

const SECRET_KEY = "AgroDroid_2026";

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

module.exports = verificarToken;