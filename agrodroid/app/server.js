const express = require("express");
const alertaRoutes = require("./routes/alerta.routes");
const notificacionRoutes = require("./routes/notificacion.routes");
const usuarioRoutes = require("./routes/usuario.routes");
const empresaRoutes = require("./routes/empresa.routes");
const vinedoRoutes = require("./routes/vinedo.routes");
const dronRoutes = require("./routes/dron.routes");
const imagenRoutes = require("./routes/imagen.routes"); 
const deteccionRoutes = require("./routes/deteccion.routes");
const lecturaRoutes = require("./routes/lecturaSensor.routes");
const sensorRoutes = require("./routes/sensor.routes");
const umbralRoutes = require("./routes/umbral.routes");
const app = express();

app.use(express.json());

app.use("/alertas", alertaRoutes);
app.use("/notificaciones", notificacionRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/empresas", empresaRoutes);
app.use("/vinedos", vinedoRoutes);
app.use("/drones", dronRoutes);
app.use("/imagenes", imagenRoutes);
app.use("/detecciones", deteccionRoutes);
app.use("/lecturas", lecturaRoutes);
app.use("/sensores", sensorRoutes);
app.use("/umbrales", umbralRoutes);

app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});