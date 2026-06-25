const alertaService = require("../services/alerta.service");

const listarAlertas = async (req, res) => {
    try {
        const alertas = await alertaService.obtenerAlertas();
        res.status(200).json(alertas);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error obteniendo alertas"
        });
    }
};

module.exports = {
    listarAlertas
};