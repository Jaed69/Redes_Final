const alertaService = require("../services/alerta.service");

const crearAlerta = async (req, res) => {
    try {
        const alerta = await alertaService.crearAlerta(req.body);

        res.status(201).json(alerta);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error creando alerta" });
    }
}; 

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

//get por id
const obtenerAlerta = async (req, res) => {
    try {
        const alerta = await alertaService.obtenerAlertaPorId(req.params.id);

        if (!alerta) {
            return res.status(404).json({ mensaje: "Alerta no encontrada" });
        }

        res.json(alerta);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error obteniendo alerta" });
    }
};

const actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estadoalerta_idestado } = req.body;

        const alerta = await alertaService.actualizarEstadoAlerta(id, estadoalerta_idestado);

        if (!alerta) {
            return res.status(404).json({ mensaje: "Alerta no encontrada" });
        }

        res.json(alerta);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error actualizando estado de alerta" });
    }
};


module.exports = {
    listarAlertas,
    obtenerAlerta,
    crearAlerta,
    actualizarEstado
};