const authService = require("../services/auth.service");

const register = async (req, res) => {

    try {

        const usuario = await authService.register(req.body);

        res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario
        });

    } catch (error) {

        console.error(error);

        const status = error.message && (
            error.message.includes("obligatorios") ||
            error.message.includes("RUC") ||
            error.message.includes("Ya existe") ||
            error.message.includes("Falta")
        ) ? 400 : 500;

        res.status(status).json({
            mensaje: error.message
        });
    }
};

const login = async (req, res) => {

    try {

        const resultado = await authService.login(req.body);

        res.json(resultado);

    } catch (error) {

        console.error(error);

        res.status(401).json({
            mensaje: error.message
        });
    }

};

module.exports = {
    register,
    login
};