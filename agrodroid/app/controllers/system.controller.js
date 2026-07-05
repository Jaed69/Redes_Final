const systemService = require("../services/system.service");

const estadoSistema = async (req, res) => {
    try {
        const data = await systemService.estadoSistema();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error obteniendo estado del sistema" });
    }
};

module.exports = { estadoSistema };