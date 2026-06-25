const empresaService = require("../services/empresa.service");

const listarEmpresas = async (req, res) => {

    try {

        const empresas = await empresaService.obtenerEmpresas();

        res.status(200).json(empresas);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error obteniendo empresas"
        });

    }
};

module.exports = {
    listarEmpresas
};