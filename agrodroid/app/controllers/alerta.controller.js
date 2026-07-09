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
        const rol = req.usuario.rol;
        const empresaId = (rol === "monitor" || rol === "cliente") ? req.usuario.empresaId : undefined;
        const alertas = await alertaService.obtenerAlertas(empresaId);
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
        const body = req.body || {};
        const estadoInput = body.estado ?? body.estadoalerta_idestado;

        const alerta = await alertaService.actualizarEstadoAlerta(id, estadoInput);

        if (!alerta) {
            return res.status(404).json({ mensaje: "Alerta no encontrada" });
        }

        res.json(alerta);

    } catch (error) {
        console.error(error);
        const status = error.message && error.message.includes("Estado de alerta desconocido")
            ? 400
            : 500;
        res.status(status).json({ mensaje: error.message || "Error actualizando estado de alerta" });
    }
};


module.exports = {
    listarAlertas,
    obtenerAlerta,
    crearAlerta,
    actualizarEstado
};