const empresaService = require("../services/empresa.service");

const listarEmpresas = async (req, res) => {
    try {
        const data = await empresaService.obtenerEmpresas();
        res.json(data);
    } catch (error) {
        res.status(500).json({ mensaje: "Error obteniendo empresas" });
    }
};

const obtenerEmpresa = async (req, res) => {
    try {
        const data = await empresaService.obtenerEmpresaPorId(req.params.id);

        if (!data) {
            return res.status(404).json({ mensaje: "No encontrada" });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ mensaje: "Error obteniendo empresa" });
    }
};

const crearEmpresa = async (req, res) => {
    try {
        const data = await empresaService.crearEmpresa(req.body);
        res.status(201).json(data);
    } catch (error) {
        console.error(error);

    res.status(400).json({
        mensaje: error.message
    });
    }
};

const actualizarEmpresa = async (req, res) => {
    try {
        const data = await empresaService.actualizarEmpresa(
            req.params.id,
            req.body
        );

        if (!data) {
            return res.status(404).json({ mensaje: "No encontrada" });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ mensaje: "Error actualizando empresa" });
    }
};

const eliminarEmpresa = async (req, res) => {
    try {
        const data = await empresaService.eliminarEmpresa(req.params.id);

        if (!data) {
            return res.status(404).json({ mensaje: "No encontrada" });
        }

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error eliminando empresa" });
    }
};

module.exports = {
    listarEmpresas,
    obtenerEmpresa,
    crearEmpresa,
    actualizarEmpresa,
    eliminarEmpresa,
};