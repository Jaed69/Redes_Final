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

        res.status(500).json({
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